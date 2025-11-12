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
      console.warn(
        `Tentativa ${attempt}/${maxAttempts} falhou: ${
          error?.message || error
        }`,
      );
      if (attempt === maxAttempts) {
        console.error('Não foi possível conectar ao banco de dados.');
        process.exit(1);
      }
      await wait(waitIntervalMs);
    }
  }
})();


