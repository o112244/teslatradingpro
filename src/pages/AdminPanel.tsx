import React, { useState } from 'react';
import { Users, TrendingUp, Bitcoin, Settings, BarChart3, Shield, Smartphone, Eye, Wallet, Send } from 'lucide-react';
import { useBitcoinPrice } from '../hooks/useBitcoinPrice';
import { useTeslaPrice } from '../hooks/useTeslaPrice';
import BitcoinWithdrawal from '../components/BitcoinWithdrawal';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const { bitcoinData } = useBitcoinPrice();
  const { teslaData } = useTeslaPrice();
  
  // Mock admin wallet balance (accumulated from user purchases)
  const adminBitcoinBalance = 12.45678; // BTC
  const adminWalletValue = adminBitcoinBalance * bitcoinData.price;
  
  // Mock data for admin dashboard
  const stats = {
    totalUsers: 1247,
    totalTrades: 5634,
    totalVolume: 2450000,
    activeSessions: 89,
    bitcoinVolume: 156.78,
    dailyRevenue: 12450
  };

  const recentTrades = [
    { id: 1, user: 'user1@demo.com', shares: 10, amount: 2504.50, btc: 0.0578, time: '2 min ago' },
    { id: 2, user: 'user2@demo.com', shares: 5, amount: 1252.25, btc: 0.0289, time: '5 min ago' },
    { id: 3, user: 'user3@demo.com', shares: 25, amount: 6260.75, btc: 0.1445, time: '8 min ago' },
    { id: 4, user: 'user4@demo.com', shares: 15, amount: 3756.75, btc: 0.0867, time: '12 min ago' },
  ];

  const users = [
    { id: 1, email: 'user1@demo.com', name: 'John Smith', shares: 45, btc: 1.2345, status: 'active' },
    { id: 2, email: 'user2@demo.com', name: 'Sarah Johnson', shares: 78, btc: 2.5678, status: 'active' },
    { id: 3, email: 'user3@demo.com', name: 'Mike Wilson', shares: 23, btc: 0.8901, status: 'inactive' },
    { id: 4, email: 'user4@demo.com', name: 'Emma Davis', shares: 156, btc: 4.3210, status: 'active' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-red-600 to-red-500 p-3 rounded-xl shadow-lg shadow-red-600/25">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Control Center</h1>
                <p className="text-gray-300">Comprehensive platform management</p>
              </div>
            </div>
            
            {/* Mobile-friendly indicator */}
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4 text-green-400" />
                <span className="text-green-200 text-sm">
                  Mobile-optimized admin panel - Full functionality on any device
                </span>
              </div>
            </div>
          </div>

          {/* Admin Wallet Overview */}
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Admin Bitcoin Wallet</h2>
                  <p className="text-gray-400">Accumulated from user purchases</p>
                </div>
              </div>
              <button
                onClick={() => setShowWithdrawal(true)}
                className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-orange-500/25"
              >
                <Send className="h-4 w-4" />
                <span>Withdraw</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-orange-400 text-2xl font-bold">{adminBitcoinBalance.toFixed(6)} BTC</p>
                <p className="text-gray-400 text-sm">Total Balance</p>
              </div>
              <div className="text-center">
                <p className="text-white text-2xl font-bold">${adminWalletValue.toLocaleString()}</p>
                <p className="text-gray-400 text-sm">USD Value</p>
              </div>
              <div className="text-center">
                <p className="text-green-400 text-2xl font-bold">+{((adminWalletValue / 500000) * 100).toFixed(1)}%</p>
                <p className="text-gray-400 text-sm">Portfolio Growth</p>
              </div>
            </div>
          </div>

          {/* Mobile-friendly Tab Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'trades', label: 'Trades', icon: TrendingUp },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Users</p>
                      <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
                      <p className="text-green-400 text-sm">+12% this month</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-400" />
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Trades</p>
                      <p className="text-2xl font-bold text-white">{stats.totalTrades.toLocaleString()}</p>
                      <p className="text-green-400 text-sm">+8% this week</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-400" />
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Trading Volume</p>
                      <p className="text-2xl font-bold text-white">${(stats.totalVolume / 1000000).toFixed(1)}M</p>
                      <p className="text-green-400 text-sm">+15% today</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-400" />
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Sessions</p>
                      <p className="text-2xl font-bold text-white">{stats.activeSessions}</p>
                      <p className="text-yellow-400 text-sm">Real-time</p>
                    </div>
                    <Eye className="h-8 w-8 text-yellow-400" />
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Bitcoin Volume</p>
                      <p className="text-2xl font-bold text-white">{stats.bitcoinVolume} BTC</p>
                      <p className="text-orange-400 text-sm">24h volume</p>
                    </div>
                    <Bitcoin className="h-8 w-8 text-orange-400" />
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Daily Revenue</p>
                      <p className="text-2xl font-bold text-white">${stats.dailyRevenue.toLocaleString()}</p>
                      <p className="text-green-400 text-sm">+22% vs yesterday</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-400" />
                  </div>
                </div>
              </div>

              {/* Recent Trades */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Recent Trades</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-gray-400 pb-3 font-medium">User</th>
                        <th className="text-left text-gray-400 pb-3 font-medium">Shares</th>
                        <th className="text-left text-gray-400 pb-3 font-medium">Amount</th>
                        <th className="text-left text-gray-400 pb-3 font-medium">BTC Paid</th>
                        <th className="text-left text-gray-400 pb-3 font-medium">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTrades.map(trade => (
                        <tr key={trade.id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                          <td className="py-4 text-white">{trade.user}</td>
                          <td className="py-4 text-white">{trade.shares}</td>
                          <td className="py-4 text-green-400 font-semibold">${trade.amount.toFixed(2)}</td>
                          <td className="py-4 text-orange-400 font-semibold">{trade.btc.toFixed(4)}</td>
                          <td className="py-4 text-gray-400">{trade.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">User Management</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-gray-400 pb-3 font-medium">Name</th>
                      <th className="text-left text-gray-400 pb-3 font-medium">Email</th>
                      <th className="text-left text-gray-400 pb-3 font-medium">Tesla Shares</th>
                      <th className="text-left text-gray-400 pb-3 font-medium">BTC Balance</th>
                      <th className="text-left text-gray-400 pb-3 font-medium">Status</th>
                      <th className="text-left text-gray-400 pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                        <td className="py-4 text-white font-medium">{user.name}</td>
                        <td className="py-4 text-gray-300">{user.email}</td>
                        <td className="py-4 text-white">{user.shares}</td>
                        <td className="py-4 text-orange-400 font-semibold">{user.btc.toFixed(4)}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active' 
                              ? 'bg-green-900/30 text-green-400 border border-green-500/30' 
                              : 'bg-gray-700/50 text-gray-400 border border-gray-600/30'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200">
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Trades Tab */}
          {activeTab === 'trades' && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Trade History</h3>
              <div className="space-y-4">
                {recentTrades.map(trade => (
                  <div key={trade.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-white font-medium">{trade.user}</p>
                        <p className="text-gray-400 text-sm">
                          Bought {trade.shares} shares for {trade.btc.toFixed(4)} BTC
                        </p>
                      </div>
                      <div className="text-right mt-2 sm:mt-0">
                        <p className="text-green-400 font-semibold">${trade.amount.toFixed(2)}</p>
                        <p className="text-gray-400 text-sm">{trade.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Platform Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div>
                      <p className="text-white font-medium">Trading Enabled</p>
                      <p className="text-gray-400 text-sm">Allow users to buy/sell Tesla stock</p>
                    </div>
                    <button className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-white text-sm transition-colors duration-200 shadow-lg hover:shadow-green-500/25">
                      Enabled
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div>
                      <p className="text-white font-medium">Maintenance Mode</p>
                      <p className="text-gray-400 text-sm">Put platform in maintenance mode</p>
                    </div>
                    <button className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg text-white text-sm transition-colors duration-200">
                      Disabled
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div>
                      <p className="text-white font-medium">Mobile Notifications</p>
                      <p className="text-gray-400 text-sm">Send push notifications to mobile admin app</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white text-sm transition-colors duration-200 shadow-lg hover:shadow-blue-500/25">
                      Enabled
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div>
                      <p className="text-white font-medium">Real-time Price Updates</p>
                      <p className="text-gray-400 text-sm">Live Bitcoin and Tesla price feeds</p>
                    </div>
                    <button className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-white text-sm transition-colors duration-200 shadow-lg hover:shadow-green-500/25">
                      Active
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bitcoin Withdrawal Modal */}
      <BitcoinWithdrawal 
        isOpen={showWithdrawal}
        onClose={() => setShowWithdrawal(false)}
        adminBalance={adminBitcoinBalance}
      />
    </div>
  );
};

export default AdminPanel;