-- Migration: Fix WhatsApp tables structure
-- Run this in Supabase SQL Editor

-- 1. Fix whatsapp_conversations
ALTER TABLE whatsapp_conversations 
ADD COLUMN IF NOT EXISTS instance TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_group BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS group_name TEXT,
ADD COLUMN IF NOT EXISTS profile_pic_url TEXT,
ADD COLUMN IF NOT EXISTS last_message TEXT,
ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS unread_count INTEGER DEFAULT 0;

-- 2. Fix whatsapp_messages
ALTER TABLE whatsapp_messages 
ADD COLUMN IF NOT EXISTS status TEXT,
ADD COLUMN IF NOT EXISTS external_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS message_type TEXT DEFAULT 'text',
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES app_users(id),
ADD COLUMN IF NOT EXISTS sender_jid TEXT,
ADD COLUMN IF NOT EXISTS sender_name TEXT;

-- 3. Create indices for performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_conv_company ON whatsapp_conversations(company_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conv_external ON whatsapp_conversations(external_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_msg_conv ON whatsapp_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_msg_external ON whatsapp_messages(external_id);

-- 4. Set company_id for existing conversations (if any)
UPDATE whatsapp_conversations 
SET company_id = (SELECT MIN(id) FROM companies) 
WHERE company_id IS NULL;
