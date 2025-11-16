import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../pages/services/api';

export type UserRole = 'ADMIN' | 'GARCOM' | 'COZINHEIRO';

export interface User {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  tipoUsuario: UserRole;
 
  matricula?: string;
  dataAdmissao?: string;
  salario?: number;
  
  bonus?: number; //bonus funcionario

  status?: string; //cozinheiro

  nivelAcesso?: number; //admin
}

interface LoginResponse {
  token: string;
  user: User;
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

  // inicializa o estado do usuário a partir do localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          
          if (parsedUser?.id && parsedUser?.email && parsedUser?.tipoUsuario) { //valida
            setToken(storedToken);
            setUser(parsedUser);
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          } else {
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

  // atualiza o header Authorization quando o token muda
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      if (!email || !password) {
        throw new Error('E-mail e senha são obrigatórios');
      }

      // chamada ao endpoint de login do backend
      const response = await api.post<LoginResponse>('/api/auth/login', { 
        email: email.trim().toLowerCase(), 
        senha: password
      });

      const { token: newToken, user: newUser } = response.data;

      if (!newToken) {
        throw new Error('Token não retornado pelo servidor');
      }

      if (!newUser || !newUser.id || !newUser.email || !newUser.tipoUsuario) {
        throw new Error('Dados de usuário incompletos');
      }

      const validRoles: UserRole[] = ['ADMIN', 'GARCOM', 'COZINHEIRO'];
      if (!validRoles.includes(newUser.tipoUsuario)) {
        throw new Error('Tipo de usuário inválido');
      }

      setUser(newUser);
      setToken(newToken);

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return newUser;
    } catch (error: any) {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');

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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common['Authorization'];
  }, []);

  const getCurrentUser = useCallback((): User | null => {
    return user;
  }, [user]);

  const hasRole = useCallback((roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.tipoUsuario);
  }, [user]);

  // interceptor para logout automático - token invalido
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401 && token) {
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