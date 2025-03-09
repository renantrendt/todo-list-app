import { deleteTask } from '../supabaseClient.js';
import { updateAllTaskPositions } from '../taskPositioning.js';

export function createRemoveButton(taskElement) {
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remover';
    
    removeBtn.onclick = async function() {
        if (taskElement.dataset.taskId) {
            await deleteTask(taskElement.dataset.taskId);
        }
        
        taskElement.parentElement.removeChild(taskElement);
        updateAllTaskPositions();
    };
    
    return removeBtn;
}
