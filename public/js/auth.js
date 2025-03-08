// Autenticação com Supabase
const SUPABASE_URL = 'https://rszyboyppgxywwixxpqo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzenlib3lwcGd4eXd3aXh4cHFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExNTE4NTEsImV4cCI6MjA1NjcyNzg1MX0.VoPTGdmmvs7394wPU8GsQwglM5zmmJBOCRk72-g1x6g';

// Inicializar cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Verificar se o usuário já está logado
async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        // Usuário já está logado, redirecionar para a página principal
        window.location.href = '/';
    }
}

// Login com Google
async function loginWithGoogle() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/`
            }
        });
        
        if (error) throw error;
    } catch (error) {
        console.error('Erro ao fazer login:', error.message);
        alert('Erro ao fazer login. Por favor, tente novamente.');
    }
}

// Logout
async function logout() {
    try {
        console.log('Iniciando processo de logout...');
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Erro retornado pelo Supabase durante logout:', error);
            throw error;
        }
        console.log('Logout realizado com sucesso, redirecionando...');
        window.location.href = '/login.html';
    } catch (error) {
        console.error('Erro ao fazer logout:', error.message || 'Sem mensagem de erro');
        console.error('Stack trace:', error.stack || 'Sem stack trace');
        // Tentar redirecionar mesmo com erro
        window.location.href = '/login.html';
    }
}

// Inicializar eventos
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando eventos de autenticação...');
    
    try {
        // Verificar se estamos na página de login
        const googleLoginBtn = document.getElementById('googleLogin');
        if (googleLoginBtn) {
            console.log('Botão de login com Google encontrado');
            checkUser(); // Verificar se o usuário já está logado
            googleLoginBtn.addEventListener('click', loginWithGoogle);
        }
        
        // Verificar se estamos na página principal
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            console.log('Botão de logout encontrado');
            // Remover eventos anteriores
            logoutBtn.onclick = logout;
            console.log('Evento de logout configurado');
        } else {
            console.warn('Botão de logout não encontrado');
        }
    } catch (error) {
        console.error('Erro ao configurar eventos de autenticação:', error);
    }
});

// Expor funções para uso em outros arquivos
window.supabaseAuth = {
    supabase,
    checkUser,
    logout
};
