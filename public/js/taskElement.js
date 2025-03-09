// Importações necessárias
import { updateTask } from './supabaseClient.js';
import { createTaskInput, createDurationInput } from './components/inputComponent.js';
import { createDragHandle } from './components/dragHandleComponent.js';
import { createPinButton } from './components/pinButtonComponent.js';
import { createRemoveButton } from './components/removeButtonComponent.js';

// Função para criar uma tarefa
export function createTaskElement(taskData) {
    const li = document.createElement('li');
    
    // Armazenar o ID da tarefa no elemento para referência futura
    if (taskData.id) {
        li.dataset.taskId = taskData.id;
    }
    
    // Determinar se a tarefa está fixada
    const isPinned = typeof taskData.is_pinned === 'boolean' ? taskData.is_pinned : false;
    if (isPinned) {
        li.classList.add('pinned');
    }
    
    // Obter o texto da tarefa e duração
    const taskText = typeof taskData === 'string' ? taskData : (taskData.task_text || '');
    const duration = taskData.duration || '';
    
    // Criar inputs usando os componentes
    const taskNameInput = createTaskInput(taskText, (value) => {
        if (li.dataset.taskId) {
            updateTask(li.dataset.taskId, { task_text: value });
        }
    });
    
    const durationInput = createDurationInput(duration, (value) => {
        if (li.dataset.taskId) {
            updateTask(li.dataset.taskId, { duration: value });
        }
    });
    
    // Criar wrapper para os inputs
    const inputsWrapper = document.createElement('div');
    inputsWrapper.classList.add('inputs-wrapper');
    inputsWrapper.style.width = '100%';
    inputsWrapper.style.display = 'flex';
    inputsWrapper.style.flexWrap = 'wrap';
    inputsWrapper.style.gap = '8px';
    inputsWrapper.style.marginRight = '40px';
    
    inputsWrapper.appendChild(taskNameInput);
    inputsWrapper.appendChild(durationInput);
    
    // Adicionar elementos ao li
    li.appendChild(inputsWrapper);
    li.appendChild(dragHandle);
    li.appendChild(pinBtn);
    li.appendChild(removeBtn);
    
    return li;
}
