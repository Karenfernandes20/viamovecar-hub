import { Request, Response } from 'express';
import { pool } from '../db';

export const getPayables = async (req: Request, res: Response) => {
  try {
    if (!pool) return res.status(500).json({ error: 'Database not configured' });

    const { startDate, endDate, status, category, search } = req.query;
    const conditions: string[] = ["type = 'payable'"];
    const params: any[] = [];

    if (startDate) {
      params.push(startDate);
      conditions.push(`due_date >= $${params.length}`);
    }

    if (endDate) {
      params.push(endDate);
      conditions.push(`due_date <= $${params.length}`);
    }

    if (status && status !== 'all') {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }

    if (category && category !== 'all') {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(description ILIKE $${params.length} OR category ILIKE $${params.length})`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT ft.id, ft.description, ft.amount, ft.status, ft.due_date, ft.issue_date, ft.category, ft.paid_at,
             c.name as city_name, c.state as city_state
      FROM financial_transactions ft
      LEFT JOIN cities c ON ft.city_id = c.id
      ${whereClause}
      ORDER BY ft.due_date NULLS LAST, ft.created_at DESC
    `;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching payables:', error);
    res.status(500).json({ error: 'Failed to fetch payables' });
  }
};

export const getReceivablesByCity = async (_req: Request, res: Response) => {
  try {
    if (!pool) return res.status(500).json({ error: 'Database not configured' });

    const query = `
      SELECT COALESCE(c.name, 'Sem cidade') as city_name,
             COALESCE(c.state, '--') as city_state,
             SUM(ft.amount) as total_amount
      FROM financial_transactions ft
      LEFT JOIN cities c ON ft.city_id = c.id
      WHERE ft.type = 'receivable'
      GROUP BY c.name, c.state
      ORDER BY total_amount DESC
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching receivables by city:', error);
    res.status(500).json({ error: 'Failed to fetch receivables by city' });
  }
};

export const getCashFlow = async (req: Request, res: Response) => {
  try {
    if (!pool) return res.status(500).json({ error: 'Database not configured' });

    const { startDate, endDate } = req.query;
    const conditions: string[] = [];
    const params: any[] = [];

    if (startDate) {
      params.push(startDate);
      conditions.push(`due_date >= $${params.length}`);
    }

    if (endDate) {
      params.push(endDate);
      conditions.push(`due_date <= $${params.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT ft.id,
             ft.description,
             ft.amount,
             ft.type,
             ft.status,
             ft.due_date,
             ft.category,
             c.name as city_name,
             c.state as city_state
      FROM financial_transactions ft
      LEFT JOIN cities c ON ft.city_id = c.id
      ${whereClause}
      ORDER BY ft.due_date NULLS LAST, ft.created_at DESC
    `;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching cash flow:', error);
    res.status(500).json({ error: 'Failed to fetch cash flow' });
  }
};

export const createFinancialTransaction = async (req: Request, res: Response) => {
  try {
    if (!pool) return res.status(500).json({ error: 'Database not configured' });

    const { description, amount, due_date, issue_date, category, status, type, city_id } = req.body;

    if (!description || !amount) {
      return res.status(400).json({ error: 'description and amount are required' });
    }

    const result = await pool.query(
      `INSERT INTO financial_transactions (description, type, amount, status, due_date, issue_date, category, city_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *` ,
      [description, type || 'payable', amount, status || 'pending', due_date || null, issue_date || new Date(), category || null, city_id || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

export const updateFinancialTransaction = async (req: Request, res: Response) => {
  try {
    if (!pool) return res.status(500).json({ error: 'Database not configured' });
    const { id } = req.params;
    const { description, amount, due_date, issue_date, category, status, type, city_id } = req.body;

    const result = await pool.query(
      `UPDATE financial_transactions 
             SET description = $1, amount = $2, due_date = $3, issue_date = $4, category = $5, status = $6, type = $7, city_id = $8, updated_at = NOW()
             WHERE id = $9
             RETURNING *`,
      [description, amount, due_date, issue_date, category, status, type, city_id, id]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: 'Transaction not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};

export const deleteFinancialTransaction = async (req: Request, res: Response) => {
  try {
    if (!pool) return res.status(500).json({ error: 'Database not configured' });
    const { id } = req.params;
    const result = await pool.query('DELETE FROM financial_transactions WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};

export const markAsPaid = async (req: Request, res: Response) => {
  try {
    if (!pool) return res.status(500).json({ error: 'Database not configured' });
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE financial_transactions 
             SET status = 'paid', paid_at = NOW(), updated_at = NOW()
             WHERE id = $1
             RETURNING *`,
      [id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Transaction not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error marking as paid:', error);
    res.status(500).json({ error: 'Failed to mark as paid' });
  }
};
