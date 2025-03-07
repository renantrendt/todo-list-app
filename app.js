// Servidor Express compatível com Node.js e Vercel
import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001; // Alterado para porta 3001 para evitar conflitos
const PUBLIC_DIR = join(__dirname, 'public');

// Servir arquivos estáticos da pasta public
app.use(express.static(PUBLIC_DIR));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(join(PUBLIC_DIR, 'index.html'));
});

// Iniciar o servidor
if (process.env.NODE_ENV !== 'production') {
  // Em desenvolvimento, adicionar LiveReload (opcional)
  // Desativado por padrão para evitar conflitos de porta
  const enableLiveReload = false; // Altere para true se quiser ativar o LiveReload
  
  if (enableLiveReload) {
    try {
      const livereload = await import('livereload');
      const lrServer = livereload.createServer({
        port: 35730 // Porta alternativa para evitar conflitos
      });
      lrServer.watch(PUBLIC_DIR);
      console.log('LiveReload ativado para a pasta public/ na porta 35730');
    } catch (err) {
      console.log('LiveReload não disponível:', err.message);
    }
  }
}

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Para compatibilidade com Vercel serverless functions
export default app;
