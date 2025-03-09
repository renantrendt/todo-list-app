import { toggleTaskPin } from '../supabaseClient.js';
import { updateAllTaskPositions } from '../taskPositioning.js';

export function createPinButton(isPinned, taskElement) {
    const pinBtn = document.createElement('button');
    pinBtn.classList.add('pin-btn');
    pinBtn.title = isPinned ? 'Desafixar atividade' : 'Fixar atividade';
    
    function atualizarIconePin(comX) {
        pinBtn.innerHTML = '';
        const pinIcon = document.createElement('span');
        pinIcon.textContent = '📌';
        pinIcon.style.position = 'relative';
        pinIcon.style.display = 'inline-block';
        
        if (comX) {
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
        
        pinBtn.appendChild(pinIcon);
    }
    
    atualizarIconePin(isPinned);
    
    pinBtn.onclick = async function() {
        const fixedTaskList = document.getElementById('fixedTaskList');
        const taskList = document.getElementById('taskList');
        const newPinnedState = taskElement.parentElement === fixedTaskList ? false : true;
        
        if (taskElement.parentElement === fixedTaskList) {
            taskElement.classList.remove('pinned');
            taskList.appendChild(taskElement);
            atualizarIconePin(false);
            pinBtn.title = 'Fixar atividade';
        } else {
            taskElement.classList.add('pinned');
            fixedTaskList.appendChild(taskElement);
            atualizarIconePin(true);
            pinBtn.title = 'Desafixar atividade';
        }
        
        if (taskElement.dataset.taskId) {
            await toggleTaskPin(taskElement.dataset.taskId, newPinnedState);
        }
        
        updateAllTaskPositions();
    };
    
    return pinBtn;
}
