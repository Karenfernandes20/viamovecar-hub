import express from 'express';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  clearUsers,
} from './controllers/userController';
import { getStages, getLeads, updateLeadStage, createStage } from './controllers/crmController';
import { getEvolutionQrCode, deleteEvolutionInstance, sendEvolutionMessage } from './controllers/evolutionController';
import { handleWebhook, getConversations, getMessages } from './controllers/webhookController';
import { getCities, createCity } from './controllers/cityController';
import { getPayables, getReceivablesByCity, getCashFlow, createExpense } from './controllers/financialController';
import { login, register } from './controllers/authController';
import { authenticateToken, authorizeRole } from './middleware/authMiddleware';

const router = express.Router();

// Auth routes
router.post('/auth/login', login);
router.post('/auth/register', register);

// User routes (Protected)
router.get('/users', authenticateToken, authorizeRole(['SUPERADMIN']), getUsers);
router.post('/users', authenticateToken, authorizeRole(['SUPERADMIN']), createUser);
router.put('/users/:id', authenticateToken, authorizeRole(['SUPERADMIN']), updateUser);
router.delete('/users/:id', authenticateToken, authorizeRole(['SUPERADMIN']), deleteUser);
// router.delete('/users', clearUsers); // Disable dangerous bulk delete without stronger protection or manual only


// Evolution routes
router.get('/evolution/qrcode', getEvolutionQrCode);
router.delete('/evolution/disconnect', deleteEvolutionInstance);
router.post('/evolution/messages/send', sendEvolutionMessage);
router.post('/evolution/webhook', handleWebhook);
router.get('/evolution/conversations', getConversations);
router.get('/evolution/messages/:conversationId', getMessages);

// Cities routes
router.get('/cities', getCities);
router.post('/cities', createCity);

// CRM routes
router.get('/crm/stages', getStages);
router.post('/crm/stages', createStage);
router.get('/crm/leads', getLeads);
router.put('/crm/leads/:id/move', updateLeadStage);

// Financial routes
router.get('/financial/payables', getPayables);
router.get('/financial/receivables-by-city', getReceivablesByCity);
router.get('/financial/cashflow', getCashFlow);
router.post('/financial/expenses', createExpense);

// Placeholder for other routes
router.get('/rides', (req, res) => res.json({ message: 'Rides endpoint' }));
router.get('/whatsapp', (req, res) => res.json({ message: 'WhatsApp endpoint' }));

export default router;

