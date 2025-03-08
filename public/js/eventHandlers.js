import { addTask, saveChangesAndConvert } from './taskOperations.js';

// Inicializar eventos
export function initializeEventHandlers() {
    console.log('Inicializando manipuladores de eventos...');
    
    try {
        // Adicionar tarefa ao clicar no botão
        const addTaskBtn = document.getElementById('addTaskBtn');
        if (addTaskBtn) {
            console.log('Botão de adicionar tarefa encontrado');
            
            // Adicionar evento de clique
            addTaskBtn.onclick = function() {
                const taskInput = document.getElementById('taskInput');
                if (!taskInput) {
                    console.error('Campo de entrada não encontrado');
                    return;
                }
                
                const taskText = taskInput.value.trim();
                if (taskText) {
                    addTask(taskText);
                    taskInput.value = '';
                }
            };
        } else {
            console.warn('Botão de adicionar tarefa não encontrado');
        }
    } catch (error) {
        console.error('Erro ao configurar botão de adicionar:', error);
    }

    try {
        // Adicionar tarefa ao pressionar Enter no campo de entrada
        const taskInput = document.getElementById('taskInput');
        if (taskInput) {
            console.log('Campo de entrada encontrado');
            
            // Adicionar evento de keypress
            taskInput.onkeypress = function(event) {
                if (event.key === 'Enter') {
                    const taskValue = this.value.trim();
                    if (taskValue) {
                        addTask(taskValue); // Chama a função que adiciona a tarefa
                        this.value = ''; // Limpa o campo de entrada
                    }
                }
            };
        } else {
            console.warn('Campo de entrada não encontrado');
        }
    } catch (error) {
        console.error('Erro ao configurar evento de tecla Enter:', error);
    }

    // Adicionar evento de blur (clicar fora) para salvar e converter
    document.addEventListener('click', function(event) {
        // Aplicar o evento de blur a todos os inputs existentes
        document.querySelectorAll('li input[type="text"]').forEach(input => {
            // Remover evento anterior para evitar duplicação
            input.removeEventListener('blur', saveChangesAndConvert);
            // Adicionar evento de blur
            input.addEventListener('blur', saveChangesAndConvert);
        });
    });
    
    // Adicionar delegação de eventos para capturar Enter em inputs de tempo
    document.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && event.target.matches('li input[type="text"]')) {
            // Verificar se é um campo de tempo
            if (event.target.placeholder === 'Tempo (min)') {
                const inputValue = event.target.value.trim();
                
                // Verificar se já está em formato personalizado (contém 'h' ou 'm')
                if (!inputValue.includes('h') && !inputValue.includes('m')) {
                    // Apenas converter se for um número simples
                    const minutes = parseInt(inputValue, 10);
                    
                    if (!isNaN(minutes)) {
                        // Aplicar formatação diretamente
                        if (minutes < 60) {
                            event.target.value = minutes + 'm';
                        } else {
                            // Importar formatDuration diretamente para garantir que está funcionando
                            const hours = Math.floor(minutes / 60);
                            const remainingMinutes = minutes % 60;
                            event.target.value = remainingMinutes > 0 
                                ? `${hours}h ${remainingMinutes}m` 
                                : `${hours}h`;
                        }
                    }
                }
                // Se já estiver em formato personalizado, manter como está
            }
            
            // Remover o foco e desabilitar a edição
            event.target.blur();
            event.target.readOnly = true;
            
            // Adicionar evento para reativar a edição ao clicar
            event.target.addEventListener('click', function() {
                this.readOnly = false;
            }, { once: true });
        }
    });

    // Adicionar evento de clique no container principal para salvar e converter
    const mainContainer = document.querySelector('.main-container');
    mainContainer.addEventListener('click', function() {
        saveChangesAndConvert(); // Chama a função para salvar e converter
    });
}
