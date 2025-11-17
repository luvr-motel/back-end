#!/usr/bin/env node

const { execSync } = require('child_process');
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;
const maxAttempts = Number(process.env.DB_WAIT_MAX_ATTEMPTS || 30);
const waitIntervalMs = Number(process.env.DB_WAIT_INTERVAL_MS || 5000);
const connectionTimeoutMillis = Number(process.env.DB_WAIT_TIMEOUT_MS || 10000);

if (!connectionString) {
  console.error('DATABASE_URL não está definida. Abortando.');
  process.exit(1);
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createClient = () => {
  const options = {
    connectionString,
    connectionTimeoutMillis,
  };
  const needsSsl =
    !connectionString.includes('localhost') &&
    !connectionString.includes('127.0.0.1');
  if (needsSsl) {
    options.ssl = { rejectUnauthorized: false };
  }
  return new Client(options);
};

async function waitForDatabase() {
  console.log('[START] Aguardando banco de dados ficar disponível...');
  const urlForLog = connectionString.replace(/:[^:@]+@/, ':****@');
  console.log(`[START] Conectando em: ${urlForLog}`);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const client = createClient();
    try {
      await client.connect();
      await client.query('SELECT 1');
      await client.end();
      console.log('[START] Banco de dados disponível!');
      return true;
    } catch (error) {
      await client.end().catch(() => undefined);
      const errorMsg = error?.message || String(error);
      if (attempt % 5 === 0 || attempt === maxAttempts) {
        console.warn(
          `[START] Tentativa ${attempt}/${maxAttempts}: ${errorMsg}`,
        );
      }
      if (attempt === maxAttempts) {
        console.error('[START] Não foi possível conectar ao banco após todas as tentativas.');
        return false;
      }
      await wait(waitIntervalMs);
    }
  }
  return false;
}

async function runMigrations() {
  console.log('[START] Executando migrations...');
  try {
    execSync('node node_modules/typeorm/cli.js migration:run -d dist/src/database/data-source.js', {
      stdio: 'inherit',
      env: process.env,
    });
    console.log('[START] Migrations executadas com sucesso!');
    return true;
  } catch (error) {
    console.error('[START] Erro ao executar migrations:', error.message);
    return false;
  }
}

async function startApp() {
  console.log('[START] Iniciando aplicação...');
  try {
    execSync('node dist/main', {
      stdio: 'inherit',
      env: process.env,
    });
  } catch (error) {
    console.error('[START] Erro ao iniciar aplicação:', error.message);
    process.exit(1);
  }
}

async function main() {
  const dbReady = await waitForDatabase();
  if (!dbReady) {
    console.error('[START] Falha ao conectar ao banco. Abortando.');
    process.exit(1);
  }

  const migrationsOk = await runMigrations();
  if (!migrationsOk) {
    console.warn('[START] Aviso: Migrations falharam, mas continuando...');
  }

  await startApp();
}

main().catch((error) => {
  console.error('[START] Erro fatal:', error);
  process.exit(1);
});

