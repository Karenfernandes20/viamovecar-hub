import express from 'express';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  clearUsers,
  resetUserPassword,
} from './controllers/userController';
import { getStages, getLeads, updateLeadStage, createStage } from './controllers/crmController';
import { getEvolutionQrCode, deleteEvolutionInstance, sendEvolutionMessage } from './controllers/evolutionController';
import { handleWebhook, getConversations, getMessages } from './controllers/webhookController';
import { getCities, createCity } from './controllers/cityController';
import { getPayables, getReceivablesByCity, getCashFlow, createExpense } from './controllers/financialController';
import { login, register } from './controllers/authController';
import { authenticateToken, authorizeRole } from './middleware/authMiddleware';
import { getCompanies, createCompany, updateCompany, deleteCompany, getCompanyUsers } from './controllers/companyController';

const router = express.Router();

// Auth routes
router.post('/auth/login', login);
router.post('/auth/register', register);

import { upload } from './middleware/uploadMiddleware';

// Company routes (SuperAdmin only)
router.get('/companies', authenticateToken, authorizeRole(['SUPERADMIN']), getCompanies);
router.get('/companies/:id/users', authenticateToken, authorizeRole(['SUPERADMIN']), getCompanyUsers);
router.post('/companies', authenticateToken, authorizeRole(['SUPERADMIN']), upload.single('logo'), createCompany);
router.put('/companies/:id', authenticateToken, authorizeRole(['SUPERADMIN']), upload.single('logo'), updateCompany);
router.delete('/companies/:id', authenticateToken, authorizeRole(['SUPERADMIN']), deleteCompany);

// User routes (Protected)
router.get('/users', authenticateToken, authorizeRole(['SUPERADMIN']), getUsers);
router.post('/users', authenticateToken, authorizeRole(['SUPERADMIN']), createUser);
router.put('/users/:id', authenticateToken, authorizeRole(['SUPERADMIN']), updateUser);
router.delete('/users/:id', authenticateToken, authorizeRole(['SUPERADMIN']), deleteUser);
router.post('/users/:id/reset-password', authenticateToken, authorizeRole(['SUPERADMIN']), resetUserPassword);
// router.delete('/users', clearUsers); // Disable dangerous bulk delete without stronger protection or manual only


// Evolution routes
// Evolution routes
router.get('/evolution/qrcode', authenticateToken, getEvolutionQrCode);
router.delete('/evolution/disconnect', authenticateToken, deleteEvolutionInstance);
router.post('/evolution/messages/send', authenticateToken, sendEvolutionMessage);
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

