#!/usr/bin/env node

import { Client } from 'pg';

const connectionString = process.env.DATABASE_URL;
const maxAttempts = Number(process.env.DB_WAIT_MAX_ATTEMPTS || 10);
const waitIntervalMs = Number(process.env.DB_WAIT_INTERVAL_MS || 3000);

if (!connectionString) {
  console.error('DATABASE_URL não está definida. Abortando.');
  process.exit(1);
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createClient = () =>
  new Client({
    connectionString,
    ssl: connectionString.includes('localhost')
      ? false
      : { rejectUnauthorized: false },
  });

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
        `Tentativa ${attempt}/${maxAttempts} falhou: ${error.message}`,
      );
      if (attempt === maxAttempts) {
        console.error('Não foi possível conectar ao banco de dados.');
        process.exit(1);
      }
      await wait(waitIntervalMs);
    }
  }
})();


