// Arquivo principal que importa todos os módulos necessários
import { initializeEventHandlers } from './eventHandlers.js';
import { initializeSortable } from './sortable.js';
import { loadTasksFromDatabase } from './taskOperations.js';

// Função para verificar se o usuário está autenticado
async function checkAuth() {
    try {
        console.log('Verificando se o cliente Supabase está disponível...');
        
        // Verificar se o cliente Supabase está disponível
        if (!window.supabaseAuth || !window.supabaseAuth.supabase) {
            console.error('Cliente Supabase não está disponível. Aguardando 500ms...');
            
            // Esperar um pouco e tentar novamente
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Verificar novamente
            if (!window.supabaseAuth || !window.supabaseAuth.supabase) {
                console.error('Cliente Supabase ainda não está disponível após espera');
                return false;
            }
        }
        
        console.log('Cliente Supabase encontrado, verificando autenticação...');
        const { data: { user } } = await window.supabaseAuth.supabase.auth.getUser();
        
        if (!user) {
            // Usuário não está autenticado, redirecionar para a página de login
            console.log('Usuário não autenticado, redirecionando para login');
            window.location.href = '/login.html';
            return false;
        }
        
        // Exibir informações do usuário no console
        console.log('Usuário autenticado:', user.email);
        return true;
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        console.error('Detalhes do erro:', error.message || 'Sem mensagem de erro');
        console.error('Stack trace:', error.stack || 'Sem stack trace');
        return false;
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', async function() {
    try {
        console.log('Iniciando aplicação...');
        
        // Verificar autenticação
        console.log('Verificando autenticação...');
        const isAuthenticated = await checkAuth();
        if (!isAuthenticated) {
            console.log('Usuário não autenticado, redirecionando...');
            return;
        }
        
        // Configurar botão de logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            // Remover eventos anteriores para evitar duplicação
            logoutBtn.removeEventListener('click', window.supabaseAuth.logout);
            // Adicionar evento de logout
            logoutBtn.addEventListener('click', window.supabaseAuth.logout);
        }
        
        // Carregar tarefas do banco de dados
        console.log('Carregando tarefas do banco de dados...');
        await loadTasksFromDatabase();
        
        // Inicializar manipuladores de eventos
        initializeEventHandlers();
        
        // Inicializar funcionalidade de arrastar e soltar
        initializeSortable();
        
        console.log('Aplicação inicializada com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar a aplicação:', error);
        console.error('Detalhes do erro:', error.message || 'Sem mensagem de erro');
        console.error('Stack trace:', error.stack || 'Sem stack trace');
    }
});
