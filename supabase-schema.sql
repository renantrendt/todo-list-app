-- Criar tabela de tarefas
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_text TEXT NOT NULL,
  duration TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar política de acesso público (para desenvolvimento)
-- Em produção, você deve restringir o acesso com autenticação
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acesso público às tarefas" ON tasks
  FOR ALL USING (true);
