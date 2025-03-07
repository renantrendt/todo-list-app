import { formatDuration } from './utils.js';
import { fetchTasks, addTaskToDatabase, updateTask, deleteTask, toggleTaskPin, updateTaskPositions } from './supabaseClient.js';

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
    
    // Criar ícone de arrastar
    const dragHandle = document.createElement('span');
    dragHandle.textContent = '☰';
    dragHandle.classList.add('drag-handle');
    
    // Criar botão de fixar
    const pinBtn = document.createElement('button');
    pinBtn.innerHTML = isPinned ? '🔓' : '📌'; // ícone baseado no estado
    pinBtn.classList.add('pin-btn');
    pinBtn.title = isPinned ? 'Desafixar atividade' : 'Fixar atividade';
    pinBtn.onclick = async function() {
        const fixedTaskList = document.getElementById('fixedTaskList');
        const taskList = document.getElementById('taskList');
        const newPinnedState = li.parentElement === fixedTaskList ? false : true;
        
        // Se a tarefa já estiver na lista de fixados, retorna para a lista normal
        if (li.parentElement === fixedTaskList) {
            li.classList.remove('pinned');
            taskList.appendChild(li);
            pinBtn.innerHTML = '📌';
            pinBtn.title = 'Fixar atividade';
        } else {
            // Move para a lista de fixados
            li.classList.add('pinned');
            fixedTaskList.appendChild(li);
            pinBtn.innerHTML = '🔓'; // ícone de cadeado
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
    li.appendChild(taskNameInput);
    li.appendChild(durationInput);
    li.appendChild(dragHandle);
    li.appendChild(pinBtn);
    li.appendChild(removeBtn);
    
    return li;
}

// Adicionar tarefa ao DOM e ao banco de dados
export async function addTask(taskText) {
    // Primeiro adiciona ao banco de dados
    const newTask = await addTaskToDatabase({
        taskText: taskText,
        duration: '',
        isPinned: false
    });
    
    if (newTask) {
        // Depois adiciona ao DOM com o ID retornado
        const taskList = document.getElementById('taskList');
        const taskElement = createTaskElement(newTask);
        taskList.appendChild(taskElement);
        return newTask.id;
    }
    
    // Fallback: adicionar localmente mesmo se falhar no banco
    const taskList = document.getElementById('taskList');
    const taskElement = createTaskElement(taskText);
    taskList.appendChild(taskElement);
    return null;
}

// Função para salvar alterações (não converte mais o tempo)
export function saveChangesAndConvert() {
    const taskInputs = document.querySelectorAll('li input[type="text"]');
    
    taskInputs.forEach(input => {
        // Verificar se é um campo de tempo
        if (input.placeholder === 'Tempo (min)') {
            const timeText = input.value.trim();
            
            // Atualizar no banco de dados sem converter
            const li = input.closest('li');
            if (li && li.dataset.taskId && timeText) {
                updateTask(li.dataset.taskId, { duration: timeText });
            }
        } else if (input.placeholder === 'Tarefa') {
            // Atualizar o texto da tarefa no banco de dados
            const taskText = input.value.trim();
            const li = input.closest('li');
            if (li && li.dataset.taskId && taskText) {
                updateTask(li.dataset.taskId, { task_text: taskText });
            }
        }
    });
}

// Carregar tarefas do banco de dados
export async function loadTasksFromDatabase() {
    try {
        const tasks = await fetchTasks();
        
        // Limpar as listas existentes
        const taskList = document.getElementById('taskList');
        const fixedTaskList = document.getElementById('fixedTaskList');
        taskList.innerHTML = '';
        fixedTaskList.innerHTML = '';
        
        // Adicionar cada tarefa à lista apropriada
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            if (task.is_pinned) {
                fixedTaskList.appendChild(taskElement);
            } else {
                taskList.appendChild(taskElement);
            }
        });
        
        console.log('Tarefas carregadas com sucesso!');
        return true;
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        return false;
    }
}

// Atualizar posições de todas as tarefas
export async function updateAllTaskPositions() {
    try {
        const taskPositions = [];
        let position = 0;
        
        // Primeiro as tarefas fixadas
        const fixedTaskList = document.getElementById('fixedTaskList');
        fixedTaskList.querySelectorAll('li').forEach(li => {
            if (li.dataset.taskId) {
                taskPositions.push({
                    id: li.dataset.taskId,
                    position: position++
                });
            }
        });
        
        // Depois as tarefas normais
        const taskList = document.getElementById('taskList');
        taskList.querySelectorAll('li').forEach(li => {
            if (li.dataset.taskId) {
                taskPositions.push({
                    id: li.dataset.taskId,
                    position: position++
                });
            }
        });
        
        // Atualizar no banco de dados
        if (taskPositions.length > 0) {
            await updateTaskPositions(taskPositions);
            console.log('Posições atualizadas com sucesso!');
        }
        
        return true;
    } catch (error) {
        console.error('Erro ao atualizar posições:', error);
        return false;
    }
}
