# Troubleshooting Railway - Conexão Backend ↔ PostgreSQL

## Problemas Possíveis:

### 1. **Hostname Incorreto**
O hostname `postgres.railway.internal` pode não estar correto. No Railway:
- Verifique o **nome exato do serviço PostgreSQL** no dashboard
- O hostname deve ser: `[NOME_DO_SERVICO].railway.internal`
- Exemplo: Se o serviço se chama `postgresql`, use `postgresql.railway.internal`

### 2. **Serviços em Projetos Diferentes**
- Ambos os serviços (backend e postgresql) **DEVEM estar no mesmo projeto Railway**
- Se estiverem em projetos diferentes, não conseguem se comunicar via rede interna

### 3. **Variáveis Compartilhadas (RECOMENDADO)**
No Railway, use **Shared Variables** ao invés de variáveis individuais:

**No serviço PostgreSQL:**
- Crie uma **Shared Variable** chamada `DATABASE_URL` com:
  ```
  postgresql://${{POSTGRES_USER}}:${{POSTGRES_PASSWORD}}@${{RAILWAY_PRIVATE_DOMAIN}}:5432/${{POSTGRES_DB}}
  ```

**No serviço Backend:**
- **NÃO** crie uma variável própria
- **Referencie** a Shared Variable do PostgreSQL
- Ou simplesmente deixe o Railway injetar automaticamente

### 4. **Usar URL Pública ao Invés de Privada**
Se a rede privada não funcionar, tente usar a URL pública:
- Use `DATABASE_PUBLIC_URL` do PostgreSQL
- Formato: `postgresql://${{PGUSER}}:${{POSTGRES_PASSWORD}}@${{RAILWAY_TCP_PROXY_DOMAIN}}:${{RAILWAY_TCP_PROXY_PORT}}/${{PGDATABASE}}`

### 5. **Verificar Status do PostgreSQL**
- O serviço PostgreSQL deve estar **"Running"** (não "Starting" ou "Stopped")
- Verifique os logs do PostgreSQL para confirmar que está aceitando conexões

### 6. **Testar Conectividade**
Adicione um script de teste no backend para verificar:
```bash
# No Railway, use "Run Command" no serviço backend:
psql "$DATABASE_URL" -c "SELECT 1;"
```

## Solução Recomendada:

1. **Use Shared Variables no Railway:**
   - No serviço PostgreSQL → Variables → "New Shared Variable"
   - Nome: `DATABASE_URL`
   - Valor: `postgresql://${{POSTGRES_USER}}:${{POSTGRES_PASSWORD}}@${{RAILWAY_PRIVATE_DOMAIN}}:5432/${{POSTGRES_DB}}`

2. **No serviço Backend:**
   - Remova a variável `DATABASE_URL` local (se existir)
   - O Railway automaticamente injetará a Shared Variable

3. **Verifique o nome do serviço PostgreSQL:**
   - O hostname deve corresponder ao nome exato do serviço
   - Se o serviço se chama `postgres`, use `postgres.railway.internal`
   - Se se chama `postgresql`, use `postgresql.railway.internal`

