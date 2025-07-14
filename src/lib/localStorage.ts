// Utilities per gestire localStorage con tipizzazione TypeScript

export interface User {
  id: string;
  username: string;
  password: string; // In un'app reale useresti hash, qui per semplicità plain text
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: string;
  category: string;
}

export interface UserMenu {
  userId: string;
  title: string;
  items: MenuItem[];
  updatedAt: string;
}

const USERS_KEY = 'menudesigner_users';
const MENUS_KEY = 'menudesigner_menus';
const CURRENT_USER_KEY = 'menudesigner_current_user';

// Gestione utenti
export const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const findUserByUsername = (username: string): User | null => {
  const users = getUsers();
  return users.find(user => user.username === username) || null;
};

export const createUser = (username: string, password: string): User => {
  const users = getUsers();
  const newUser: User = {
    id: `user_${Date.now()}`,
    username,
    password,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveUsers(users);
  
  return newUser;
};

export const authenticateUser = (username: string, password: string): User | null => {
  const user = findUserByUsername(username);
  if (user && user.password === password) {
    return user;
  }
  return null;
};

// Gestione sessione corrente
export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Gestione menu
export const saveUserMenu = (userId: string, title: string, items: MenuItem[]) => {
  const menus = getUserMenus();
  const existingMenuIndex = menus.findIndex(menu => menu.userId === userId);
  
  const userMenu: UserMenu = {
    userId,
    title,
    items,
    updatedAt: new Date().toISOString()
  };
  
  if (existingMenuIndex >= 0) {
    menus[existingMenuIndex] = userMenu;
  } else {
    menus.push(userMenu);
  }
  
  localStorage.setItem(MENUS_KEY, JSON.stringify(menus));
};

export const getUserMenu = (userId: string): UserMenu | null => {
  const menus = getUserMenus();
  return menus.find(menu => menu.userId === userId) || null;
};

export const getUserMenus = (): UserMenu[] => {
  const menus = localStorage.getItem(MENUS_KEY);
  return menus ? JSON.parse(menus) : [];
};

// Utility per reset completo (per debug/testing)
export const clearAllData = () => {
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(MENUS_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
};