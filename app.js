// Servidor Express compatível com Node.js e Vercel
import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = join(__dirname, 'public');

// Servir arquivos estáticos da pasta public
app.use(express.static(PUBLIC_DIR));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(join(PUBLIC_DIR, 'index.html'));
});

// Iniciar o servidor
if (process.env.NODE_ENV !== 'production') {
  // Em desenvolvimento, adicionar LiveReload
  try {
    const livereload = await import('livereload');
    const lrServer = livereload.createServer();
    lrServer.watch(PUBLIC_DIR);
    console.log('LiveReload ativado para a pasta public/');
  } catch (err) {
    console.log('LiveReload não disponível:', err.message);
  }
}

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Para compatibilidade com Vercel serverless functions
export default app;
