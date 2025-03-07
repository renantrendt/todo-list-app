// Configuração do Bun.sh para o backend
import { serve } from 'bun';
import { join } from 'path';
import livereload from 'livereload';

const PORT = 3000;
const PUBLIC_DIR = join(import.meta.dir, '..', 'public');

serve({
    fetch(req) {
        const url = new URL(req.url);
        const pathname = url.pathname;

        // Serve arquivos estáticos
        if (pathname === '/' || pathname === '/index.html') {
            const file = Bun.file(join(PUBLIC_DIR, 'index.html'));
            return new Response(file, {
                headers: { 'Content-Type': 'text/html' }
            });
        }

        // Servir outros arquivos estáticos
        if (pathname.startsWith('/')) {
            const filePath = join(PUBLIC_DIR, pathname);
            const file = Bun.file(filePath);
            
            // Determinar o tipo de conteúdo com base na extensão
            const contentTypes = {
                '.js': 'application/javascript',
                '.css': 'text/css',
                '.html': 'text/html',
            };
            
            const ext = pathname.slice(pathname.lastIndexOf('.'));
            const contentType = contentTypes[ext] || 'application/octet-stream';

            return new Response(file, {
                headers: { 'Content-Type': contentType }
            });
        }

        // Rota não encontrada
        return new Response('Não encontrado', { status: 404 });
    },
    port: PORT,
});

console.log(`Servidor rodando em http://localhost:${PORT}`);

// Iniciar servidor LiveReload
const lrServer = livereload.createServer();
lrServer.watch(PUBLIC_DIR);
console.log('LiveReload ativado para a pasta public/');
