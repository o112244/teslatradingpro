import React from 'react';
import { TrendingUp, TrendingDown, Activity, Globe, Clock } from 'lucide-react';
import RealTimeIndicator from './RealTimeIndicator';

interface MarketOverviewProps {
  bitcoinData: {
    price: number;
    change24h: number;
    changePercent24h: number;
    lastUpdated: Date;
  };
  teslaData: {
    price: number;
    change24h: number;
    changePercent24h: number;
    volume: number;
    marketCap: number;
    lastUpdated: Date;
  };
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ bitcoinData, teslaData }) => {
  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${formatNumber(num)}`;
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Market Overview</h2>
            <p className="text-gray-400 text-sm">Real-time market data</p>
          </div>
        </div>
        <RealTimeIndicator 
          isConnected={true} 
          lastUpdated={bitcoinData.lastUpdated}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bitcoin Card */}
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">₿</span>
              </div>
              <div>
                <h3 className="text-white font-semibold">Bitcoin</h3>
                <p className="text-gray-400 text-sm">BTC/USD</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Activity className="h-4 w-4 text-orange-400 animate-pulse" />
              <span className="text-orange-400 text-sm">Live</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-white">
                ${formatNumber(bitcoinData.price)}
              </span>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
                bitcoinData.changePercent24h >= 0 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {bitcoinData.changePercent24h >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span className="text-sm font-medium">
                  {bitcoinData.changePercent24h >= 0 ? '+' : ''}{formatNumber(bitcoinData.changePercent24h)}%
                </span>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">24h Change:</span>
              <span className={bitcoinData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                {bitcoinData.change24h >= 0 ? '+' : ''}${formatNumber(Math.abs(bitcoinData.change24h))}
              </span>
            </div>
          </div>
        </div>

        {/* Tesla Card */}
        <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <div>
                <h3 className="text-white font-semibold">Tesla Inc.</h3>
                <p className="text-gray-400 text-sm">TSLA</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Activity className="h-4 w-4 text-red-400 animate-pulse" />
              <span className="text-red-400 text-sm">Live</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-white">
                ${formatNumber(teslaData.price)}
              </span>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
                teslaData.changePercent24h >= 0 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {teslaData.changePercent24h >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span className="text-sm font-medium">
              <p className="text-white font-semibold">{formatLargeNumber(bitcoinData.price * 19700000)}</p>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">24h Change:</span>
              <p className="text-white font-semibold">{(bitcoinData.price / teslaData.price).toFixed(0)}:1</p>
                  {teslaData.change24h >= 0 ? '+' : ''}${formatNumber(Math.abs(teslaData.change24h))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Volume:</span>
                <span className="text-white">{formatLargeNumber(teslaData.volume)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Stats */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-gray-400 text-sm">BTC Market Cap</p>
            <p className="text-white font-semibold">{formatLargeNumber(bitcoinData.price * 19700000)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">TSLA Market Cap</p>
            <p className="text-white font-semibold">{formatLargeNumber(teslaData.marketCap)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">BTC/TSLA Ratio</p>
            <p className="text-white font-semibold">{formatNumber(bitcoinData.price / teslaData.price, 0)}:1</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Platform Status</p>
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-semibold">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;