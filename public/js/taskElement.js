// Importações necessárias
import { updateTask, deleteTask, toggleTaskPin } from './supabaseClient.js';
import { updateAllTaskPositions } from './taskPositioning.js';

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
    
    // Obter o texto da tarefa
    const taskText = typeof taskData === 'string' ? taskData : (taskData.task_text || '');
    
    // Obter a duração da tarefa
    const duration = taskData.duration || '';
    
    // Criar input para tarefa
    const taskNameInput = document.createElement('input');
    taskNameInput.type = 'text';
    taskNameInput.value = taskText;
    taskNameInput.placeholder = 'Tarefa';
    
    // Criar input para duração
    const durationInput = document.createElement('input');
    durationInput.type = 'text';
    durationInput.value = duration;
    durationInput.placeholder = 'Tempo (min)';
    
    // Adicionar evento para converter quando pressionar Enter
    durationInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            // Manter o valor como está, sem tentar converter
            // Remover o foco e desabilitar a edição
            this.blur();
            this.readOnly = true;
            
            // Atualizar no banco de dados
            if (li.dataset.taskId) {
                updateTask(li.dataset.taskId, { duration: this.value });
            }
            
            // Adicionar evento para reativar a edição ao clicar
            this.addEventListener('click', function() {
                this.readOnly = false;
            }, { once: true });
        }
    });
    
    // Adicionar evento para tarefa quando pressionar Enter
    taskNameInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            // Atualizar no banco de dados
            if (li.dataset.taskId) {
                updateTask(li.dataset.taskId, { task_text: this.value });
            }
            
            // Remover o foco e desabilitar a edição
            this.blur();
            this.readOnly = true;
            
            // Adicionar evento para reativar a edição ao clicar
            this.addEventListener('click', function() {
                this.readOnly = false;
            }, { once: true });
        }
    });
    
    // Criar wrapper para os inputs para melhor controle de layout
    const inputsWrapper = document.createElement('div');
    inputsWrapper.classList.add('inputs-wrapper');
    inputsWrapper.style.width = '100%';
    inputsWrapper.style.display = 'flex';
    inputsWrapper.style.flexWrap = 'wrap';
    inputsWrapper.style.gap = '8px';
    inputsWrapper.style.marginRight = '40px'; // Espaço para o drag handle
    
    // Mover os inputs para o wrapper
    inputsWrapper.appendChild(taskNameInput);
    inputsWrapper.appendChild(durationInput);
    
    // Criar ícone de arrastar
    const dragHandle = document.createElement('span');
    dragHandle.textContent = '☰';
    dragHandle.classList.add('drag-handle');
    dragHandle.setAttribute('title', 'Arrastar para reordenar');
    dragHandle.style.position = 'absolute';
    dragHandle.style.right = '10px';
    dragHandle.style.top = '10px';
    
    // Adicionar eventos para melhorar a experiência de arrasto
    dragHandle.addEventListener('mousedown', function(e) {
        // Impedir que o evento de mousedown se propague para o li
        e.stopPropagation();
        console.log('Drag handle mousedown');
    });
    
    dragHandle.addEventListener('touchstart', function(e) {
        // Impedir que o evento de touchstart se propague para o li
        e.stopPropagation();
        console.log('Drag handle touchstart');
    }, { passive: true });
    
    // Criar botão de fixar
    const pinBtn = document.createElement('button');
    pinBtn.classList.add('pin-btn');
    pinBtn.title = isPinned ? 'Desafixar atividade' : 'Fixar atividade';
    
    // Criar um span para o ícone do alfinete
    const pinIcon = document.createElement('span');
    pinIcon.textContent = '📌';
    pinIcon.style.position = 'relative';
    pinIcon.style.display = 'inline-block';
    pinBtn.appendChild(pinIcon);
    
    // Se estiver fixado, adicionar o X sobreposto
    if (isPinned) {
        const crossIcon = document.createElement('span');
        crossIcon.textContent = '✕';
        crossIcon.style.position = 'absolute';
        crossIcon.style.top = '0px';
        crossIcon.style.right = '0px';
        crossIcon.style.fontSize = '0.8em';
        crossIcon.style.color = '#000';
        crossIcon.style.fontWeight = 'bold';
        pinIcon.appendChild(crossIcon);
    }
    
    pinBtn.onclick = async function() {
        const fixedTaskList = document.getElementById('fixedTaskList');
        const taskList = document.getElementById('taskList');
        const newPinnedState = li.parentElement === fixedTaskList ? false : true;
        
        // Se a tarefa já estiver na lista de fixados, retorna para a lista normal
        if (li.parentElement === fixedTaskList) {
            li.classList.remove('pinned');
            taskList.appendChild(li);
            pinBtn.innerHTML = '';
            const pinIcon = document.createElement('span');
            pinIcon.textContent = '📌';
            pinBtn.appendChild(pinIcon);
            pinBtn.title = 'Fixar atividade';
        } else {
            // Move para a lista de fixados
            li.classList.add('pinned');
            fixedTaskList.appendChild(li);
            
            // Recriar o botão com o X sobreposto
            pinBtn.innerHTML = '';
            const pinIcon = document.createElement('span');
            pinIcon.textContent = '📌';
            pinIcon.style.position = 'relative';
            pinIcon.style.display = 'inline-block';
            
            const crossIcon = document.createElement('span');
            crossIcon.textContent = '✕';
            crossIcon.style.position = 'absolute';
            crossIcon.style.top = '0px';
            crossIcon.style.right = '0px';
            crossIcon.style.fontSize = '0.8em';
            crossIcon.style.color = '#000';
            crossIcon.style.fontWeight = 'bold';
            
            pinIcon.appendChild(crossIcon);
            pinBtn.appendChild(pinIcon);
            pinBtn.title = 'Desafixar atividade';
        }
        
        // Atualizar no banco de dados
        if (li.dataset.taskId) {
            await toggleTaskPin(li.dataset.taskId, newPinnedState);
        }
        
        // Atualizar posições após mover
        updateAllTaskPositions();
    };
    
    // Criar botão de remover
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remover';
    removeBtn.onclick = async function() {
        // Remover do banco de dados
        if (li.dataset.taskId) {
            await deleteTask(li.dataset.taskId);
        }
        
        // Remover do DOM
        li.parentElement.removeChild(li);
        
        // Atualizar posições após remover
        updateAllTaskPositions();
    };
    
    // Adicionar elementos ao li
    li.appendChild(inputsWrapper);
    li.appendChild(dragHandle);
    li.appendChild(pinBtn);
    li.appendChild(removeBtn);
    
    return li;
}
