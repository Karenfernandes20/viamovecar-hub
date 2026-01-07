import { Request, Response } from 'express';
import { pool } from '../db';

export const getCostCenters = async (req: Request, res: Response) => {
    try {
        if (!pool) return res.status(500).json({ error: 'Database not configured' });

        const user = (req as any).user;
        const companyId = user?.company_id;

        if (!companyId) {
            return res.status(400).json({ error: 'Company ID is required' });
        }

        const result = await pool.query(
            'SELECT * FROM financial_cost_centers WHERE company_id = $1 ORDER BY name ASC',
            [companyId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching cost centers:', error);
        res.status(500).json({ error: 'Failed to fetch cost centers' });
    }
};

export const createCostCenter = async (req: Request, res: Response) => {
    try {
        if (!pool) return res.status(500).json({ error: 'Database not configured' });

        const user = (req as any).user;
        const companyId = user?.company_id;
        const { name } = req.body;

        if (!companyId) {
            return res.status(400).json({ error: 'Company ID is required' });
        }

        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Nome do centro de custo é obrigatório' });
        }

        const result = await pool.query(
            'INSERT INTO financial_cost_centers (name, company_id) VALUES ($1, $2) RETURNING *',
            [name.trim(), companyId]
        );

        res.status(201).json(result.rows[0]);
    } catch (error: any) {
        console.error('Error creating cost center:', error);
        if (error.code === '23505') {
            return res.status(409).json({ error: 'Centro de custo já existe' });
        }
        res.status(500).json({ error: 'Failed to create cost center' });
    }
};

export const deleteCostCenter = async (req: Request, res: Response) => {
    try {
        if (!pool) return res.status(500).json({ error: 'Database not configured' });

        const user = (req as any).user;
        const companyId = user?.company_id;
        const { id } = req.params;

        if (!companyId) {
            return res.status(400).json({ error: 'Company ID is required' });
        }

        const result = await pool.query(
            'DELETE FROM financial_cost_centers WHERE id = $1 AND company_id = $2 RETURNING *',
            [id, companyId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Centro de custo não encontrado' });
        }

        res.json({ message: 'Centro de custo deletado com sucesso' });
    } catch (error) {
        console.error('Error deleting cost center:', error);
        res.status(500).json({ error: 'Failed to delete cost center' });
    }
};
