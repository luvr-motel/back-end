#!/usr/bin/env node

const { Client } = require('pg');
const dns = require('dns').promises;

async function testConnection(connectionString, label) {
  console.log(`\n[TEST] Testando: ${label}`);
  const urlForLog = connectionString.replace(/:[^:@]+@/, ':****@');
  console.log(`[TEST] URL: ${urlForLog}`);

  const client = new Client({
    connectionString,
    connectionTimeoutMillis: 5000,
    ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
      ? false
      : { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    const result = await client.query('SELECT NOW(), version()');
    console.log(`[TEST] ✅ SUCESSO! Conectado ao banco.`);
    console.log(`[TEST] Hora do servidor: ${result.rows[0].now}`);
    console.log(`[TEST] Versão PostgreSQL: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`);
    await client.end();
    return true;
  } catch (error) {
    console.log(`[TEST] ❌ FALHOU: ${error.message}`);
    console.log(`[TEST] Código: ${error.code || 'UNKNOWN'}`);
    await client.end().catch(() => undefined);
    return false;
  }
}

async function testHostname(hostname) {
  console.log(`\n[DNS] Testando resolução DNS para: ${hostname}`);
  try {
    const addresses = await dns.resolve4(hostname);
    console.log(`[DNS] ✅ Hostname resolve para: ${addresses.join(', ')}`);
    return true;
  } catch (error) {
    console.log(`[DNS] ❌ Não foi possível resolver: ${error.message}`);
    try {
      const addresses6 = await dns.resolve6(hostname);
      console.log(`[DNS] ✅ Hostname resolve para IPv6: ${addresses6.join(', ')}`);
      return true;
    } catch (error6) {
      console.log(`[DNS] ❌ IPv6 também falhou: ${error6.message}`);
      return false;
    }
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('TESTE DE CONECTIVIDADE COM POSTGRESQL');
  console.log('='.repeat(60));

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('[ERRO] DATABASE_URL não está definida!');
    process.exit(1);
  }

  // Extrair hostname da URL
  const urlMatch = databaseUrl.match(/@([^:]+):(\d+)\//);
  if (urlMatch) {
    const hostname = urlMatch[1];
    const port = urlMatch[2];
    console.log(`\n[INFO] Hostname extraído: ${hostname}`);
    console.log(`[INFO] Porta: ${port}`);

    // Testar resolução DNS
    await testHostname(hostname);
  }

  // Testar conexão com a URL atual
  const success = await testConnection(databaseUrl, 'DATABASE_URL atual');

  // Tentar variações do hostname
  if (!success && urlMatch) {
    const hostname = urlMatch[1];
    const variations = [
      hostname.replace('.railway.internal', ''),
      hostname.replace('postgres.railway.internal', 'postgresql.railway.internal'),
      hostname.replace('postgresql.railway.internal', 'postgres.railway.internal'),
    ];

    for (const variation of variations) {
      if (variation !== hostname) {
        const testUrl = databaseUrl.replace(hostname, variation);
        await testConnection(testUrl, `Variação: ${variation}`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  if (success) {
    console.log('✅ CONEXÃO BEM-SUCEDIDA!');
    process.exit(0);
  } else {
    console.log('❌ TODAS AS TENTATIVAS FALHARAM');
    console.log('\nVerifique:');
    console.log('1. Serviços estão no mesmo projeto Railway?');
    console.log('2. Nome do serviço PostgreSQL está correto?');
    console.log('3. PostgreSQL está "Running" (não "Starting")?');
    console.log('4. Variáveis de ambiente estão corretas?');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('[ERRO FATAL]', error);
  process.exit(1);
});

