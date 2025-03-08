import { updateAllTaskPositions } from './taskPositioning.js';

// Inicializar Sortable.js para as listas de tarefas
export function initializeSortable() {
    // Inicializar Sortable para a lista principal
    const taskList = document.getElementById('taskList');
    new Sortable(taskList, {
        handle: '.drag-handle',
        animation: 150,
        group: 'tasks',
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        forceFallback: true,
        fallbackClass: 'sortable-fallback',
        fallbackOnBody: true,
        swapThreshold: 0.65,
        onStart: function(evt) {
            document.body.style.cursor = 'grabbing';
            console.log('Drag started', evt.item);
        },
        onEnd: function(evt) {
            document.body.style.cursor = '';
            console.log('Drag ended', evt.item);
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
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        forceFallback: true,
        fallbackClass: 'sortable-fallback',
        fallbackOnBody: true,
        swapThreshold: 0.65,
        onStart: function(evt) {
            document.body.style.cursor = 'grabbing';
            console.log('Drag started in fixed list', evt.item);
        },
        onEnd: function(evt) {
            document.body.style.cursor = '';
            console.log('Drag ended in fixed list', evt.item);
            // Atualizar posições no banco de dados após arrastar e soltar
            updateAllTaskPositions();
        }
    });

    // Adicionar logs para depuração
    console.log('Sortable inicializado com sucesso!');
    console.log('Elementos de arrasto encontrados:', document.querySelectorAll('.drag-handle').length);
}
