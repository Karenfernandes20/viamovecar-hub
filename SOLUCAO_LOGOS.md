# SOLUÇÃO: Persistir Logos das Empresas no Supabase Storage

## ❌ PROBLEMA ATUAL:
- Imagens salvas na pasta `server/uploads/` (local)
- Render apaga tudo quando reinicia (filesystem efêmero)
- Logos desaparecem depois de deploy

## ✅ SOLUÇÃO: Usar Supabase Storage

### 📋 PASSO 1: Configurar no Supabase

1. Acesse [supabase.com](https://supabase.com) → Seu projeto
2. Vá em **Storage** (menu lateral)
3. Clique em **"Create a new bucket"**
4. Nome do bucket: `company-logos`
5. **Public bucket**: ✅ MARQUE (para as imagens serem acessíveis publicamente)
6. Clique em **"Create bucket"**

### 📋 PASSO 2: Adicionar chave no .env

Adicione esta linha no arquivo `.env` (local e no Render):

```
SUPABASE_SERVICE_KEY=sua_service_role_key_aqui
```

**Como pegar a Service Role Key:**
- No Supabase → Settings → API
- Copie a **"service_role key"** (não a anon key)
- **⚠️ IMPORTANTE:** Essa chave é secreta! Não commite no Git.

### 📋 PASSO 3: Eu vou criar o código

Depois que você:
1. Criar o bucket `company-logos`
2. Adicionar `SUPABASE_SERVICE_KEY` no `.env` do Render
3. Me confirmar

Eu crio o código para fazer upload direto no Supabase Storage.

---

## 🎯 RESULTADO FINAL:
- ✅ Logos ficam permanentes (nunca somem)
- ✅ 1GB de storage grátis no Supabase
- ✅ CDN rápido global
- ✅ URLs públicas automáticas

---

Me avise quando terminar os passos 1 e 2! 🚀
