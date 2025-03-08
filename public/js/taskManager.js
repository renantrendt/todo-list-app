// Este arquivo serve como um ponto central para exportar todas as funções relacionadas ao gerenciamento de tarefas
// Ele importa e re-exporta as funções dos arquivos específicos

// Importar e exportar funções de criação de elementos de tarefa
import { createTaskElement } from './taskElement.js';
export { createTaskElement };

// Importar e exportar funções de operações de tarefas
import { addTask, saveChangesAndConvert, loadTasksFromDatabase } from './taskOperations.js';
export { addTask, saveChangesAndConvert, loadTasksFromDatabase };

// Importar e exportar funções de posicionamento de tarefas
import { updateAllTaskPositions } from './taskPositioning.js';
export { updateAllTaskPositions };
