import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

// tipos de usuarios do sistema
export type UserRole = 'CAIXA' | 'COZINHA' | 'BAR' | 'GARCOM' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  getCurrentUser: () => User | null;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inicializa o estado do usuário a partir do localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          
          // Valida se o usuário tem os campos necessários
          if (parsedUser?.id && parsedUser?.email && parsedUser?.role) {
            setToken(storedToken);
            setUser(parsedUser);
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          } else {
            // Remove dados inválidos
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Erro ao recuperar dados de autenticação:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Atualiza o header Authorization quando o token muda
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      // Validações básicas antes de enviar
      if (!email || !password) {
        throw new Error('E-mail e senha são obrigatórios');
      }

      const response = await api.post('/auth/login', { 
        email: email.trim().toLowerCase(), 
        password 
      });

      const { token: newToken, user: newUser } = response.data;

      // Valida resposta da API
      if (!newToken || !newUser) {
        throw new Error('Resposta inválida do servidor');
      }

      if (!newUser.id || !newUser.email || !newUser.role) {
        throw new Error('Dados de usuário incompletos');
      }

      // Valida se o role é válido
      const validRoles: UserRole[] = ['CAIXA', 'COZINHA', 'BAR', 'GARCOM', 'ADMIN'];
      if (!validRoles.includes(newUser.role)) {
        throw new Error('Tipo de usuário inválido');
      }

      // Atualiza estado e localStorage
      setUser(newUser);
      setToken(newToken);

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return newUser;
    } catch (error: any) {
      // Limpa dados em caso de erro
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Tratamento de erros específicos
      if (error?.response?.status === 401) {
        throw new Error('E-mail ou senha incorretos');
      } else if (error?.response?.status === 403) {
        throw new Error('Acesso não autorizado');
      } else if (error?.response?.status === 500) {
        throw new Error('Erro no servidor. Tente novamente mais tarde');
      } else if (error?.message) {
        throw error;
      } else {
        throw new Error('Falha no login. Verifique suas credenciais');
      }
    }
  };

  const logout = useCallback(() => {
    // Limpa todos os dados de autenticação
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common['Authorization'];
  }, []);

  const getCurrentUser = useCallback((): User | null => {
    return user;
  }, [user]);

  // Verifica se o usuário tem uma role específica ou uma das roles fornecidas
  const hasRole = useCallback((roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  }, [user]);

  // Interceptor para logout automático em caso de token inválido
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401 && token) {
          // Token expirado ou inválido
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [token, logout]);

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    getCurrentUser,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};