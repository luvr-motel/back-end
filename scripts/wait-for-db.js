#!/usr/bin/env node

const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;
const maxAttempts = Number(process.env.DB_WAIT_MAX_ATTEMPTS || 20);
const waitIntervalMs = Number(process.env.DB_WAIT_INTERVAL_MS || 5000);
const connectionTimeoutMillis = Number(process.env.DB_WAIT_TIMEOUT_MS || 10000);

if (!connectionString) {
  console.error('DATABASE_URL não está definida. Abortando.');
  process.exit(1);
}

// Log da URL (sem senha) para debug
const urlForLog = connectionString.replace(/:[^:@]+@/, ':****@');
console.log(`[DEBUG] Tentando conectar ao banco: ${urlForLog}`);
console.log(`[DEBUG] Configuração: ${maxAttempts} tentativas, ${waitIntervalMs}ms entre tentativas, ${connectionTimeoutMillis}ms timeout`);

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

(async () => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const client = createClient();
    try {
      await client.connect();
      await client.end();
      console.log('Banco de dados disponível. Prosseguindo...');
      process.exit(0);
    } catch (error) {
      await client.end().catch(() => undefined);
      const errorMsg = error?.message || String(error);
      const errorCode = error?.code || 'UNKNOWN';
      console.warn(
        `Tentativa ${attempt}/${maxAttempts} falhou: ${errorMsg} (código: ${errorCode})`,
      );
      if (attempt === maxAttempts) {
        console.error('Não foi possível conectar ao banco de dados após todas as tentativas.');
        console.error(`Último erro: ${errorMsg}`);
        console.error(`Código do erro: ${errorCode}`);
        process.exit(1);
      }
      await wait(waitIntervalMs);
    }
  }
})();


