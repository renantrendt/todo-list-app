// Configuração do servidor
import express from 'express';
import { PORT, PUBLIC_DIR, ENABLE_LIVERELOAD, LIVERELOAD_PORT } from './config.js';
import router from './routes.js';

// Inicializar o servidor
export async function initServer() {
  const app = express();
  
  // Servir arquivos estáticos da pasta public
  app.use(express.static(PUBLIC_DIR));
  
  // Usar as rotas definidas
  app.use(router);
  
  // Configurar LiveReload em desenvolvimento
  if (ENABLE_LIVERELOAD) {
    try {
      const livereload = await import('livereload');
      const lrServer = livereload.createServer({
        port: LIVERELOAD_PORT
      });
      lrServer.watch(PUBLIC_DIR);
      console.log(`LiveReload ativado para a pasta public/ na porta ${LIVERELOAD_PORT}`);
    } catch (err) {
      console.log('LiveReload não disponível:', err.message);
    }
  }
  
  return app;
}
