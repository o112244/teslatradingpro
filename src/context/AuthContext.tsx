import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  role: 'user' | 'admin';
  portfolio: {
    teslaShares: number;
    totalValue: number;
    bitcoinBalance: number;
  };
}

interface RegisterData {
  name: string;
  email?: string;
  phone?: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (emailOrPhone: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
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

  const login = async (emailOrPhone: string, password: string): Promise<boolean> => {
    try {
      const isEmail = emailOrPhone.includes('@');

      const { data: users, error } = await supabase
        .from('users')
        .select('*, portfolios(*)')
        .or(isEmail ? `email.eq.${emailOrPhone}` : `phone.eq.${emailOrPhone}`)
        .eq('status', 'active')
        .maybeSingle();

      if (error || !users) {
        console.error('Login error:', error);
        return false;
      }

      const bcrypt = await import('bcryptjs');
      const passwordMatch = await bcrypt.compare(password, users.password_hash);

      if (!passwordMatch) {
        return false;
      }

      const portfolio = users.portfolios?.[0] || {
        tesla_shares: 0,
        bitcoin_balance: 0,
        total_value: 0
      };

      const loggedInUser: User = {
        id: users.id,
        email: users.email,
        phone: users.phone,
        name: users.name,
        role: users.role,
        portfolio: {
          teslaShares: Number(portfolio.tesla_shares) || 0,
          totalValue: Number(portfolio.total_value) || 0,
          bitcoinBalance: Number(portfolio.bitcoin_balance) || 0
        }
      };

      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const bcrypt = await import('bcryptjs');
      const passwordHash = await bcrypt.hash(data.password, 10);

      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          name: data.name,
          email: data.email || null,
          phone: data.phone || null,
          password_hash: passwordHash,
          role: 'user',
          status: 'active'
        })
        .select()
        .single();

      if (userError || !newUser) {
        console.error('Registration error:', userError);
        return false;
      }

      const { error: portfolioError } = await supabase
        .from('portfolios')
        .insert({
          user_id: newUser.id,
          tesla_shares: 0,
          bitcoin_balance: 0,
          total_value: 0
        });

      if (portfolioError) {
        console.error('Portfolio creation error:', portfolioError);
        return false;
      }

      const registeredUser: User = {
        id: newUser.id,
        email: newUser.email,
        phone: newUser.phone,
        name: newUser.name,
        role: newUser.role,
        portfolio: {
          teslaShares: 0,
          totalValue: 0,
          bitcoinBalance: 0
        }
      };

      setUser(registeredUser);
      localStorage.setItem('user', JSON.stringify(registeredUser));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updatePortfolio = async (shares: number, totalValue: number, bitcoinSpent: number) => {
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

      try {
        await supabase
          .from('portfolios')
          .update({
            tesla_shares: updatedUser.portfolio.teslaShares,
            bitcoin_balance: updatedUser.portfolio.bitcoinBalance,
            total_value: updatedUser.portfolio.totalValue
          })
          .eq('user_id', user.id);

        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Portfolio update error:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updatePortfolio }}>
      {children}
    </AuthContext.Provider>
  );
};