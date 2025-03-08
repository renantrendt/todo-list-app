// Configurações do servidor
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurações da aplicação
export const PORT = process.env.PORT || 3001;
export const PUBLIC_DIR = join(__dirname, 'public');

// Configuração do LiveReload
export const ENABLE_LIVERELOAD = process.env.NODE_ENV !== 'production' && false; // Altere para true se quiser ativar
export const LIVERELOAD_PORT = 35730; // Porta alternativa para evitar conflitos
