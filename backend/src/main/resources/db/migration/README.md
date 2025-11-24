# Flyway Database Migrations

Este projeto usa **Flyway** para gerenciar o schema do banco de dados de forma versionada e controlada.

## 📁 Estrutura

```
backend/src/main/resources/db/migration/
├── V1__initial_schema.sql    # Schema inicial completo
└── V2__seed_data.sql          # Dados iniciais (cardápio padrão)
```

## 🚀 Primeira Execução

### 1. Limpar o banco de dados

Execute no pgAdmin como usuário `postgres`:

```sql
DROP DATABASE IF EXISTS restaurantedb;
CREATE DATABASE restaurantedb OWNER fred;
```

### 2. Iniciar o backend

O Flyway irá automaticamente:
- Criar a tabela `flyway_schema_history` para rastrear migrations
- Executar `V1__initial_schema.sql` (cria todas as tabelas)
- Executar `V2__seed_data.sql` (insere dados iniciais)
- O `DataInitializer` criará o usuário Admin padrão

### 3. Verificar migrations aplicadas

Execute no pgAdmin:

```sql
SELECT * FROM flyway_schema_history ORDER BY installed_rank;
```

## 📝 Como Criar Novas Migrations

### Convenção de Nomenclatura

- **Versioned Migrations**: `V{numero}__{descricao}.sql`
  - Exemplo: `V3__add_telefone_to_usuarios.sql`
  - Executadas **apenas uma vez**, em ordem numérica
  
- **Repeatable Migrations**: `R__{descricao}.sql`
  - Exemplo: `R__create_views.sql`
  - Executadas **sempre que o conteúdo mudar**

### Exemplo: Adicionar uma coluna

**Arquivo**: `V3__add_telefone_to_usuarios.sql`

```sql
-- V3: Add telefone column to usuarios table
ALTER TABLE usuarios ADD COLUMN telefone VARCHAR(20);
```

Depois, atualizar a entidade Java:

```java
@Column(name = "telefone")
private String telefone;
```

### Exemplo: Criar uma nova tabela

**Arquivo**: `V4__create_reservas_table.sql`

```sql
-- V4: Create reservas table
CREATE TABLE reservas (
    id SERIAL PRIMARY KEY,
    mesa_id INTEGER NOT NULL REFERENCES mesas(id),
    cliente_nome VARCHAR(255) NOT NULL,
    data_reserva TIMESTAMP NOT NULL,
    numero_pessoas INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDENTE' NOT NULL
);
```

## ⚠️ Regras Importantes

### ✅ DO (Faça)

- ✅ Sempre criar **novas migrations** para mudanças
- ✅ Testar migrations em **desenvolvimento** primeiro
- ✅ Fazer **backup** antes de aplicar em produção
- ✅ Usar nomes **descritivos** para migrations
- ✅ Incluir **comentários** explicando a mudança

### ❌ DON'T (Não Faça)

- ❌ **NUNCA** modificar migrations já aplicadas em produção
- ❌ **NUNCA** deletar migrations já aplicadas
- ❌ **NUNCA** mudar `spring.jpa.hibernate.ddl-auto` de volta para `update`
- ❌ **NUNCA** criar tabelas manualmente no banco

## 🔄 Workflow de Desenvolvimento

1. **Fazer mudança no modelo** (entidade Java)
2. **Criar migration SQL** correspondente
3. **Reiniciar o backend** (Flyway aplica automaticamente)
4. **Testar** a mudança
5. **Commitar** a migration junto com o código

## 🛠️ Comandos Úteis

### Ver histórico de migrations

```sql
SELECT version, description, installed_on, success 
FROM flyway_schema_history 
ORDER BY installed_rank;
```

### Verificar se há migrations pendentes

Ao iniciar o backend, o Flyway automaticamente detecta e aplica migrations pendentes.

### Rollback (reverter migration)

Flyway **não suporta rollback automático**. Para reverter:

1. Criar uma **nova migration** que desfaz a mudança
2. Exemplo: Se `V3` adicionou uma coluna, criar `V4` que remove

**Arquivo**: `V4__remove_telefone_from_usuarios.sql`

```sql
-- V4: Remove telefone column from usuarios table
ALTER TABLE usuarios DROP COLUMN telefone;
```

## 📊 Monitoramento

### Verificar status do Flyway

O backend loga informações do Flyway no console:

```
Flyway Community Edition 10.x.x by Redgate
Database: jdbc:postgresql://localhost:5432/restaurantedb (PostgreSQL 17.6)
Successfully validated 2 migrations (execution time 00:00.015s)
Current version of schema "public": 2
Migrating schema "public" to version "3 - add telefone to usuarios"
Successfully applied 1 migration to schema "public" (execution time 00:00.023s)
```

## 🔧 Troubleshooting

### Erro: "Validate failed: Migration checksum mismatch"

**Causa**: Migration foi modificada após ser aplicada

**Solução**: 
1. **Desenvolvimento**: Limpar o banco e reaplicar
2. **Produção**: Criar nova migration corretiva

### Erro: "Found non-empty schema(s) without schema history table"

**Causa**: Banco já tem tabelas mas não tem histórico do Flyway

**Solução**: Configuração `spring.flyway.baseline-on-migrate=true` já resolve isso

### Migration não está sendo aplicada

**Verificar**:
1. Nome do arquivo segue o padrão `V{numero}__{descricao}.sql`
2. Arquivo está em `src/main/resources/db/migration/`
3. Não há erros de sintaxe SQL no arquivo

## 📚 Referências

- [Flyway Documentation](https://flywaydb.org/documentation/)
- [Flyway with Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto.data-initialization.migration-tool.flyway)
