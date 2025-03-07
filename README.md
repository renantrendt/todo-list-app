# Lista de Tarefas - Aplicativo

Um aplicativo de lista de tarefas com armazenamento persistente usando Supabase.

## Funcionalidades

- Adicionar, remover e editar tarefas
- Fixar tarefas importantes
- Arrastar e soltar para reorganizar
- Conversão de tempo (minutos para horas)
- Armazenamento persistente com Supabase
- Formato de tempo personalizado

## Tecnologias Utilizadas

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js/Express
- Banco de Dados: Supabase
- Implantação: Vercel

## Como Implantar no Vercel

1. Crie uma conta no [Vercel](https://vercel.com) se ainda não tiver uma
2. Instale a CLI do Vercel: `npm install -g vercel`
3. Faça login na sua conta: `vercel login`
4. No diretório do projeto, execute: `vercel`
5. Siga as instruções na tela para concluir a implantação

## Desenvolvimento Local

Para executar localmente:

```bash
# Instalar dependências
bun install

# Iniciar o servidor de desenvolvimento
bun dev
```

O aplicativo estará disponível em `http://localhost:3000`

## Estrutura do Projeto

- `public/`: Arquivos estáticos (HTML, CSS, JavaScript)
- `server/`: Código do servidor original (Bun)
- `app.js`: Servidor Express compatível com Vercel
- `vercel.json`: Configuração para implantação no Vercel
