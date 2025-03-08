// Rotas da aplicação
import express from 'express';
import { join } from 'path';
import { PUBLIC_DIR } from './config.js';

// Criar router do Express
const router = express.Router();

// Rota principal
router.get('/', (req, res) => {
  res.sendFile(join(PUBLIC_DIR, 'index.html'));
});

// Rota para a página de login
router.get('/login', (req, res) => {
  res.sendFile(join(PUBLIC_DIR, 'login.html'));
});

// Rota para API (exemplo)
router.get('/api/status', (req, res) => {
  res.json({ status: 'online', timestamp: new Date() });
});

// Exportar o router
export default router;
