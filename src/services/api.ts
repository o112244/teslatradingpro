// API service for production backend integration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
  };
  token: string;
  portfolio: {
    teslaShares: number;
    totalValue: number;
    bitcoinBalance: number;
  };
}

interface TradeRequest {
  type: 'buy' | 'sell';
  symbol: 'TSLA';
  shares: number;
  bitcoinAmount: number;
}

interface PortfolioUpdate {
  teslaShares: number;
  bitcoinBalance: number;
  totalValue: number;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'An error occurred',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      this.token = response.data.token;
      localStorage.setItem('auth_token', this.token);
    }

    return response;
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' });
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async executeTrade(trade: TradeRequest): Promise<ApiResponse<any>> {
    return this.request('/trading/execute', {
      method: 'POST',
      body: JSON.stringify(trade),
    });
  }

  async getPortfolio(): Promise<ApiResponse<PortfolioUpdate>> {
    return this.request('/portfolio');
  }

  async updatePortfolio(portfolio: PortfolioUpdate): Promise<ApiResponse<any>> {
    return this.request('/portfolio', {
      method: 'PUT',
      body: JSON.stringify(portfolio),
    });
  }

  async getBitcoinPrice(): Promise<ApiResponse<any>> {
    return this.request('/market/bitcoin');
  }

  async getTeslaPrice(): Promise<ApiResponse<any>> {
    return this.request('/market/tesla');
  }

  async getTransactionHistory(): Promise<ApiResponse<any[]>> {
    return this.request('/trading/history');
  }

  async withdrawBitcoin(address: string, amount: number): Promise<ApiResponse<any>> {
    return this.request('/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify({ address, amount }),
    });
  }

  async purchaseBitcoin(amount: number, paymentMethod: string): Promise<ApiResponse<any>> {
    return this.request('/wallet/purchase', {
      method: 'POST',
      body: JSON.stringify({ amount, paymentMethod }),
    });
  }
}

export const apiService = new ApiService();
export type { LoginRequest, LoginResponse, TradeRequest, PortfolioUpdate };