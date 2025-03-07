// Função para converter minutos em horas
function formatDuration(minutes) {
    if (minutes < 60) return `${minutes}m`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
        ? `${hours}h ${remainingMinutes}m` 
        : `${hours}h`;
}

// Função para criar uma tarefa
function createTaskElement(taskText) {
    const li = document.createElement('li');
    
    // Criar input para tarefa
    const taskNameInput = document.createElement('input');
    taskNameInput.type = 'text';
    taskNameInput.value = taskText;
    taskNameInput.placeholder = 'Tarefa';
    
    // Criar input para duração
    const durationInput = document.createElement('input');
    durationInput.type = 'text';
    durationInput.placeholder = 'Tempo (min)';
    
    // Adicionar evento para converter quando pressionar Enter
    durationInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            const inputValue = this.value.trim();
            const minutes = parseInt(inputValue, 10);
            
            if (!isNaN(minutes)) {
                if (minutes < 60) {
                    this.value = minutes + 'm';
                } else {
                    this.value = formatDuration(minutes);
                }
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
    
    // Adicionar evento para tarefa quando pressionar Enter
    taskNameInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
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
    pinBtn.innerHTML = '📌'; // ícone de alfinete
    pinBtn.classList.add('pin-btn');
    pinBtn.title = 'Fixar atividade';
    pinBtn.onclick = function() {
        const fixedTaskList = document.getElementById('fixedTaskList');
        const taskList = document.getElementById('taskList');
        
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
    };
    
    // Criar botão de remover
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remover';
    removeBtn.onclick = function() {
        li.parentElement.removeChild(li);
    };
    
    // Adicionar elementos ao li
    li.appendChild(taskNameInput);
    li.appendChild(durationInput);
    li.appendChild(dragHandle);
    li.appendChild(pinBtn);
    li.appendChild(removeBtn);
    
    return li;
}

function addTask(taskText) {
    const taskList = document.getElementById('taskList');
    const taskElement = createTaskElement(taskText);
    taskList.appendChild(taskElement);
}

document.getElementById('addTaskBtn').addEventListener('click', function() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (taskText) {
        addTask(taskText);
        taskInput.value = '';
    }
});

document.getElementById('taskInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const taskValue = this.value;
        if (taskValue) {
            addTask(taskValue); // Chama a função que adiciona a tarefa
            this.value = ''; // Limpa o campo de entrada
        }
    }
});

// Inicializar Sortable para ambas as listas
const taskList = document.getElementById('taskList');
new Sortable(taskList, {
    handle: '.drag-handle',
    animation: 150,
    group: 'tasks'
});

const fixedTaskList = document.getElementById('fixedTaskList');
new Sortable(fixedTaskList, {
    handle: '.drag-handle',
    animation: 150,
    group: 'tasks'
});

const taskInputs = document.querySelectorAll('li input[type="text"]');

// Função para salvar alterações e converter tempo
function saveChangesAndConvert() {
    taskInputs.forEach(input => {
        const li = input.closest('li');
        const taskText = li.querySelector('input[placeholder="Tarefa"]').value;
        const timeInput = li.querySelector('input[placeholder="Tempo (min)"]');
        const timeText = timeInput.value;

        // Salvar a tarefa
        if (taskText) {
            console.log('Tarefa salva:', taskText);
        }

        // Converter tempo
        if (timeText) {
            const timeValue = parseInt(timeText);
            let convertedTime;
            if (timeValue >= 60) {
                convertedTime = formatDuration(timeValue);
            } else {
                convertedTime = timeValue + 'm'; // Adiciona 'm' para números menores que 60
            }
            console.log('Tempo convertido:', convertedTime);
            timeInput.value = convertedTime; // Atualiza o campo com o tempo convertido
        }
    });
}

// Adiciona evento de blur (clicar fora) para salvar e converter
taskInputs.forEach(input => {
    input.addEventListener('blur', saveChangesAndConvert);
});

// Adiciona evento de keypress para simular clique fora ao pressionar Enter
taskInputs.forEach(input => {
    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const li = this.closest('li');
            const timeInput = li.querySelector('input[placeholder="Tempo (min)"]');
            const timeValue = parseInt(timeInput.value);

            if (timeValue < 60) {
                timeInput.value = timeValue + 'm'; // Adiciona 'm' se o número for menor que 60
            }

            this.blur(); // Simula clicar fora do campo
        }
    });
});

// Adiciona evento de clique no container principal para salvar e converter
const mainContainer = document.querySelector('.main-container');

mainContainer.addEventListener('click', function() {
    saveChangesAndConvert(); // Chama a função para salvar e converter
});
