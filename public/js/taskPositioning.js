import { updateTaskPositions } from './supabaseClient.js';

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
