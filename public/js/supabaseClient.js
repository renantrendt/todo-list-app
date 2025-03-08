// Usamos a versão global do Supabase que será carregada via CDN no index.html

// Configuração do Supabase
const supabaseUrl = 'https://rszyboyppgxywwixxpqo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzenlib3lwcGd4eXd3aXh4cHFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExNTE4NTEsImV4cCI6MjA1NjcyNzg1MX0.VoPTGdmmvs7394wPU8GsQwglM5zmmJBOCRk72-g1x6g';

// Criar cliente Supabase usando a variável global
export const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Função para obter o usuário atual
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Função para buscar todas as tarefas
export async function fetchTasks() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      console.error('Usuário não autenticado');
      return [];
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('position', { ascending: true });
    
    if (error) {
      console.error('Erro ao buscar tarefas:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    return [];
  }
}

// Função para adicionar uma nova tarefa
export async function addTaskToDatabase(task) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      console.error('Usuário não autenticado');
      return null;
    }
    
    // Obter a maior posição atual para adicionar a nova tarefa no final
    const { data: existingTasks } = await supabase
      .from('tasks')
      .select('position')
      .eq('user_id', user.id)
      .order('position', { ascending: false })
      .limit(1);
    
    const nextPosition = existingTasks && existingTasks.length > 0 
      ? existingTasks[0].position + 1 
      : 0;
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        { 
          task_text: task.taskText,
          duration: task.duration,
          is_pinned: task.isPinned,
          position: nextPosition,
          user_id: user.id
        }
      ])
      .select();
    
    if (error) {
      console.error('Erro ao adicionar tarefa:', error);
      return null;
    }
    
    return data[0];
  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error);
    return null;
  }
}

// Função para atualizar uma tarefa existente
export async function updateTask(taskId, updates) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      console.error('Usuário não autenticado');
      return null;
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .eq('user_id', user.id)
      .select();
    
    if (error) {
      console.error('Erro ao atualizar tarefa:', error);
      return null;
    }
    
    return data[0];
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    return null;
  }
}

// Função para remover uma tarefa
export async function deleteTask(taskId) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      console.error('Usuário não autenticado');
      return false;
    }
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Erro ao remover tarefa:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao remover tarefa:', error);
    return false;
  }
}

// Função para atualizar a posição das tarefas após arrastar e soltar
export async function updateTaskPositions(taskPositions) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      console.error('Usuário não autenticado');
      return false;
    }
    
    // taskPositions deve ser um array de objetos { id, position }
    const updates = taskPositions.map(({ id, position }) => {
      return supabase
        .from('tasks')
        .update({ position })
        .eq('id', id)
        .eq('user_id', user.id);
    });
    
    await Promise.all(updates);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar posições:', error);
    return false;
  }
}

// Função para alternar o estado de fixação de uma tarefa
export async function toggleTaskPin(taskId, isPinned) {
  return updateTask(taskId, { is_pinned: isPinned });
}
