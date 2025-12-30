# Guia de Migração para Supabase

Este projeto já está configurado para funcionar nativamente com o Supabase (PostgreSQL).

## 1. Configurar Conexão (Connection Pooler)

O Supabase recomenda o uso do **Connection Pooler** para ambientes Serverless/Deploy como o Render, para evitar exaurir o limite de conexões.

1. No Painel do Supabase, vá em **Project Settings** > **Database**.
2. Em **Connection String**, mude a aba de "Direct" para **"Transaction Pooler"** (porta 6543) ou **"Session Pooler"** (porta 5432).
   - *Recomendação:* Use a URL da porta **5432** (Direct/Session) se não tiver certeza, pois é mais compatível com todas as queries.
   - Copie a string `URI`.

## 2. Formato da Connection String

A URL deve ficar neste formato para ser colocada no Render:

```
postgresql://postgres.[SEU-PROJETO]:[SUA-SENHA]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres?sslmode=no-verify
```

> **Importante:**
> 1. Substitua `[SUA-SENHA]` pela senha que você criou (não é a senha da sua conta Supabase, é a do banco).
> 2. Se a senha tiver caracteres especiais (como `$ # @`), você deve codificá-los (URL Encode) ou trocar a senha para apenas letras e números.
> 3. Adicione `?sslmode=no-verify` ou `?sslmode=require` no final para evitar erros de certificado.

## 3. Banco de Dados Limpo

Ao conectar no Supabase pela primeira vez, o banco estará vazio.
O sistema detectará isso e rodará automaticamente as migrações (arquivo `server/db/migrations.ts`) ao iniciar, criando:
- Tabela `companies`
- Tabela `app_users`
- Tabelas do CRM e WhatsApp

## 4. SuperAdmin Fixo

Lembre-se que o usuário SuperAdmin "dev.karenfernandes@gmail.com" é **hardcoded** no código (`authController.ts`), então você conseguirá logar imediatamente mesmo com o banco vazio.
