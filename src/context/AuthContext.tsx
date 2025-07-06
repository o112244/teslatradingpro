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
    // Demo login - in production, this would be a real API call
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
    } else if (email === 'user@demo.com' && password === 'demo123') {
      const demoUser: User = {
        id: 'user-1',
        email: 'user@demo.com',
        name: 'Demo User',
        role: 'user',
        portfolio: {
          teslaShares: 25,
          totalValue: 6250,
          bitcoinBalance: 2.3
        }
      };
      setUser(demoUser);
      localStorage.setItem('user', JSON.stringify(demoUser));
      return true;
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
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updatePortfolio }}>
      {children}
    </AuthContext.Provider>
  );
};