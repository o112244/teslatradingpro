import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  portfolio: {
    teslaShares: number;
    totalValue: number;
    bitcoinBalance: number;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updatePortfolio: (shares: number, totalValue: number, bitcoinSpent: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Admin login - keep for platform management
    if (email === 'admin@tesla.com' && password === 'admin123') {
      const adminUser: User = {
        id: 'admin-1',
        email: 'admin@tesla.com',
        name: 'Admin User',
        role: 'admin',
        portfolio: {
          teslaShares: 0,
          totalValue: 0,
          bitcoinBalance: 5.5
        }
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return true;
    }
    
    // For real users, this would connect to your authentication API
    // Example implementation for production:
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (response.ok) {
        const userData = await response.json();
        const realUser: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: 'user',
          portfolio: {
            teslaShares: userData.portfolio?.teslaShares || 0,
            totalValue: userData.portfolio?.totalValue || 0,
            bitcoinBalance: userData.portfolio?.bitcoinBalance || 0
          }
        };
        setUser(realUser);
        localStorage.setItem('user', JSON.stringify(realUser));
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updatePortfolio = (shares: number, totalValue: number, bitcoinSpent: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        portfolio: {
          ...user.portfolio,
          teslaShares: user.portfolio.teslaShares + shares,
          totalValue: user.portfolio.totalValue + totalValue,
          bitcoinBalance: user.portfolio.bitcoinBalance - bitcoinSpent
        }
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // In production, sync with backend
      // syncPortfolioWithBackend(updatedUser.portfolio);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updatePortfolio }}>
      {children}
    </AuthContext.Provider>
  );
};