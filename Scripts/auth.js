// 📁 Scripts/auth.js

// ==================== CRUD DE USUÁRIOS ==================== //
const userDB = {
  // CREATE - Cadastra novo usuário
  create(user) {
    const users = this.getAll();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  },

  // READ - Obtém todos usuários
  getAll() {
    return JSON.parse(localStorage.getItem('users')) || [];
  },

  // READ - Busca usuário por nome
  getByUsername(username) {
    return this.getAll().find(u => u.username === username);
  },

  // UPDATE - Atualiza dados do usuário
  update(username, newData) {
    const users = this.getAll();
    const index = users.findIndex(u => u.username === username);
    if (index !== -1) {
      users[index] = { ...users[index], ...newData };
      localStorage.setItem('users', JSON.stringify(users));
    }
  },

  // DELETE - Remove usuário
  delete(username) {
    const filteredUsers = this.getAll().filter(u => u.username !== username);
    localStorage.setItem('users', JSON.stringify(filteredUsers));
  }
};

// ==================== SISTEMA DE AUTENTICAÇÃO ==================== //
function login(username, password) {
  const user = userDB.getByUsername(username);
  
  if (user && user.password === password) {
    // Atualiza último login
    userDB.update(username, { lastLogin: new Date().toISOString() });
    
    // Armazena sessão
    localStorage.setItem('currentUser', JSON.stringify(user));
    return true;
  }
  return false;
}

function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

function isAuthenticated() {
  return !!localStorage.getItem('currentUser');
}

// ==================== GERENCIAMENTO DE PERFIL ==================== //
function updateProfileIcon() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const profileIcon = document.getElementById('profile-icon');
  const profileLink = document.getElementById('profile-link');

  if (profileIcon && profileLink) {
    if (currentUser) {
      // Usuário logado - mostra avatar e link para logout
      profileIcon.src = currentUser.selectedTrainerImage || 'IMGs/perfil.png';
      profileLink.href = 'javascript:logout()';
      profileLink.title = `Sair (${currentUser.username})`;
    } else {
      // Usuário não logado - ícone padrão e link para login
      profileIcon.src = 'IMGs/perfil.png';
      profileLink.href = 'login.html';
      profileLink.title = 'Faça login';
    }
  }
}

// ==================== PROTEÇÃO DE ROTAS ==================== //
function protectRoute() {
  if (!isAuthenticated() && 
      window.location.pathname.includes('seleçãodepersonagens.html')) {
    window.location.href = 'login.html';
  }
}

// ==================== INICIALIZAÇÃO ==================== //
document.addEventListener('DOMContentLoaded', () => {
  updateProfileIcon();
  protectRoute();
});

// ==================== EXPORT PARA USO EM OUTROS ARQUIVOS ==================== //
// (Use esses métodos nas suas páginas HTML)
window.authSystem = {
  register: (userData) => {
    if (userDB.getByUsername(userData.username)) {
      return { success: false, message: 'Nome já em uso' };
    }
    userDB.create(userData);
    return { success: true };
  },
  login,
  logout,
  getCurrentUser: () => JSON.parse(localStorage.getItem('currentUser')),
  updateUser: (newData) => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      userDB.update(user.username, newData);
      localStorage.setItem('currentUser', JSON.stringify({ ...user, ...newData }));
    }
  }
};