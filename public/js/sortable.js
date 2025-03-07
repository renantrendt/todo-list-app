import { updateAllTaskPositions } from './taskManager.js';

// Inicializar Sortable.js para as listas de tarefas
export function initializeSortable() {
    // Inicializar Sortable para a lista principal
    const taskList = document.getElementById('taskList');
    new Sortable(taskList, {
        handle: '.drag-handle',
        animation: 150,
        group: 'tasks',
        onEnd: function() {
            // Atualizar posições no banco de dados após arrastar e soltar
            updateAllTaskPositions();
        }
    });

    // Inicializar Sortable para a lista de tarefas fixas
    const fixedTaskList = document.getElementById('fixedTaskList');
    new Sortable(fixedTaskList, {
        handle: '.drag-handle',
        animation: 150,
        group: 'tasks',
        onEnd: function() {
            // Atualizar posições no banco de dados após arrastar e soltar
            updateAllTaskPositions();
        }
    });
}
