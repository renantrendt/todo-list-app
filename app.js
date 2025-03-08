// Arquivo principal da aplicação
import { PORT } from './config.js';
import { initServer } from './server.js';

// Inicializar o servidor
async function startServer() {
  const app = await initServer();
  
  // Iniciar o servidor
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
  
  return app;
}

// Iniciar o servidor
const app = await startServer();

// Para compatibilidade com Vercel serverless functions
export default app;
