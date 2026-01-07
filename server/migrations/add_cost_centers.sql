-- Migration: Add financial_cost_centers table
-- This table stores cost centers for financial transactions

CREATE TABLE IF NOT EXISTS financial_cost_centers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, company_id)
);

CREATE INDEX IF NOT EXISTS idx_cost_centers_company ON financial_cost_centers(company_id);

-- Add cost_center column to financial_transactions if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'financial_transactions' 
        AND column_name = 'cost_center'
    ) THEN
        ALTER TABLE financial_transactions ADD COLUMN cost_center VARCHAR(255);
    END IF;
END $$;
