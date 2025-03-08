import { createTaskElement } from './taskElement.js';
import { fetchTasks, addTaskToDatabase, updateTask } from './supabaseClient.js';

// Adicionar tarefa ao DOM e ao banco de dados
export async function addTask(taskText) {
    console.log('Adicionando nova tarefa:', taskText);
    
    try {
        // Primeiro adiciona ao banco de dados
        console.log('Enviando tarefa para o banco de dados...');
        const newTask = await addTaskToDatabase({
            taskText: taskText,
            duration: '',
            isPinned: false
        });
        
        if (newTask) {
            console.log('Tarefa adicionada ao banco de dados com sucesso, ID:', newTask.id);
            // Depois adiciona ao DOM com o ID retornado
            const taskList = document.getElementById('taskList');
            if (!taskList) {
                console.error('Lista de tarefas não encontrada no DOM');
                return null;
            }
            
            const taskElement = createTaskElement(newTask);
            taskList.appendChild(taskElement);
            console.log('Tarefa adicionada ao DOM com sucesso');
            return newTask.id;
        } else {
            console.warn('Falha ao adicionar tarefa ao banco de dados, usando fallback local');
        }
        
        // Fallback: adicionar localmente mesmo se falhar no banco
        const taskList = document.getElementById('taskList');
        if (!taskList) {
            console.error('Lista de tarefas não encontrada no DOM (fallback)');
            return null;
        }
        
        const taskElement = createTaskElement({id: 'local-' + Date.now(), task_text: taskText, duration: '', is_pinned: false});
        taskList.appendChild(taskElement);
        console.log('Tarefa adicionada localmente com sucesso (fallback)');
        return null;
    } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
        console.error('Detalhes do erro:', error.message || 'Sem mensagem de erro');
        console.error('Stack trace:', error.stack || 'Sem stack trace');
        return null;
    }
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
