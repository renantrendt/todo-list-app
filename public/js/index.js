// Arquivo principal que importa todos os módulos necessários
import { initializeEventHandlers } from './eventHandlers.js';
import { initializeSortable } from './sortable.js';
import { loadTasksFromDatabase } from './taskOperations.js';

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', async function() {
    try {
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
    }
});
