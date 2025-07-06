import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Bitcoin, Zap, DollarSign, Wallet, Plus, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBitcoinPrice } from '../hooks/useBitcoinPrice';
import { useTeslaPrice } from '../hooks/useTeslaPrice';
import TradingInterface from '../components/TradingInterface';
import PortfolioChart from '../components/PortfolioChart';
import MarketOverview from '../components/MarketOverview';
import LiveChat from '../components/LiveChat';
import BitcoinPurchase from '../components/BitcoinPurchase';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { bitcoinData, isLoading: bitcoinLoading, error: bitcoinError, refetch: refetchBitcoin } = useBitcoinPrice();
  const { teslaData, isLoading: teslaLoading, error: teslaError, refetch: refetchTesla } = useTeslaPrice();
  const [showBitcoinPurchase, setShowBitcoinPurchase] = useState(false);

  if (!user) return null;

  const portfolioValue = user.portfolio.teslaShares * teslaData.price;
  const totalBitcoinValue = user.portfolio.bitcoinBalance * bitcoinData.price;
  const totalPortfolioValue = portfolioValue + totalBitcoinValue;

  const handleRefreshPrices = () => {
    refetchBitcoin();
    refetchTesla();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Portfolio Dashboard
              </h1>
              <p className="text-gray-300">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <button
                onClick={handleRefreshPrices}
                disabled={bitcoinLoading || teslaLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all duration-200 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${(bitcoinLoading || teslaLoading) ? 'animate-spin' : ''}`} />
                <span className="text-sm">Refresh Prices</span>
              </button>
            </div>
          </div>

          {/* Market Overview */}
          <MarketOverview bitcoinData={bitcoinData} teslaData={teslaData} />

          {/* Portfolio Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Tesla Holdings */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-xl">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Tesla Holdings</p>
                  <p className="text-2xl font-bold text-white">{user.portfolio.teslaShares}</p>
                  <p className="text-xs text-gray-500">shares</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Current Value</span>
                  <span className="text-green-400 font-semibold">${portfolioValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Avg. Cost</span>
                  <span className="text-gray-300">${(portfolioValue / Math.max(user.portfolio.teslaShares, 1)).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Bitcoin Balance */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl">
                  <Bitcoin className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Bitcoin Balance</p>
                  <p className="text-2xl font-bold text-white">{user.portfolio.bitcoinBalance.toFixed(4)}</p>
                  <p className="text-xs text-gray-500">BTC</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">USD Value</span>
                  <span className="text-orange-400 font-semibold">${totalBitcoinValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setShowBitcoinPurchase(true)}
                    className="flex items-center space-x-1 text-xs text-orange-400 hover:text-orange-300 transition-colors duration-200"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Buy More</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Current Prices */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">TSLA Price</p>
                  <p className="text-2xl font-bold text-white">${teslaData.price.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">per share</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">24h Change</span>
                  <div className="flex items-center space-x-1">
                    {teslaData.changePercent24h >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-400" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-400" />
                    )}
                    <span className={`text-sm font-medium ${teslaData.changePercent24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {teslaData.changePercent24h >= 0 ? '+' : ''}{teslaData.changePercent24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Portfolio Value */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Total Portfolio</p>
                  <p className="text-2xl font-bold text-white">
                    ${totalPortfolioValue.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">USD value</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Tesla</span>
                  <span className="text-purple-400">{((portfolioValue / totalPortfolioValue) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Bitcoin</span>
                  <span className="text-pink-400">{((totalBitcoinValue / totalPortfolioValue) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Trading Interface */}
            <div className="lg:col-span-2">
              <TradingInterface 
                teslaPrice={teslaData.price} 
                bitcoinPrice={bitcoinData.price}
              />
            </div>

            {/* Portfolio Chart */}
            <div className="lg:col-span-1">
              <PortfolioChart 
                teslaShares={user.portfolio.teslaShares}
                bitcoinBalance={user.portfolio.bitcoinBalance}
                teslaPrice={teslaData.price}
                bitcoinPrice={bitcoinData.price}
              />
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="mt-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
                <span className="text-sm text-gray-400">Last 7 days</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="bg-orange-500/20 p-2 rounded-lg">
                      <Bitcoin className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Bitcoin Purchase</p>
                      <p className="text-gray-400 text-sm">Bought 0.1 BTC via credit card</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">${(0.1 * bitcoinData.price).toFixed(2)}</p>
                    <p className="text-gray-400 text-sm">6 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-500/20 p-2 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Tesla Stock Purchase</p>
                      <p className="text-gray-400 text-sm">Bought 10 TSLA shares with 0.0578 BTC</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">${(10 * teslaData.price).toFixed(2)}</p>
                    <p className="text-gray-400 text-sm">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-500/20 p-2 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Tesla Stock Purchase</p>
                      <p className="text-gray-400 text-sm">Bought 5 TSLA shares with 0.0289 BTC</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">${(5 * teslaData.price).toFixed(2)}</p>
                    <p className="text-gray-400 text-sm">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Messages */}
          {(bitcoinError || teslaError) && (
            <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-200 text-sm">
                {bitcoinError && `Bitcoin: ${bitcoinError}`}
                {bitcoinError && teslaError && ' | '}
                {teslaError && `Tesla: ${teslaError}`}
                {' - Using cached data.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bitcoin Purchase Modal */}
      <BitcoinPurchase 
        isOpen={showBitcoinPurchase}
        onClose={() => setShowBitcoinPurchase(false)}
      />

      {/* Live Chat */}
      <LiveChat />
    </div>
  );
};

export default Dashboard;