import React from 'react';
import { PieChart, TrendingUp, Bitcoin, Zap } from 'lucide-react';

interface PortfolioChartProps {
  teslaShares: number;
  bitcoinBalance: number;
  teslaPrice: number;
  bitcoinPrice: number;
}

const PortfolioChart: React.FC<PortfolioChartProps> = ({
  teslaShares,
  bitcoinBalance,
  teslaPrice,
  bitcoinPrice
}) => {
  const teslaValue = teslaShares * teslaPrice;
  const bitcoinValue = bitcoinBalance * bitcoinPrice;
  const totalValue = teslaValue + bitcoinValue;
  
  const teslaPercentage = totalValue > 0 ? (teslaValue / totalValue) * 100 : 0;
  const bitcoinPercentage = totalValue > 0 ? (bitcoinValue / totalValue) * 100 : 0;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
      <div className="flex items-center space-x-2 mb-6">
        <PieChart className="h-6 w-6 text-gray-400" />
        <h3 className="text-xl font-semibold text-white">Portfolio Distribution</h3>
      </div>

      {/* Visual Chart */}
      <div className="mb-6">
        {totalValue > 0 ? (
          <div className="relative h-32 bg-gray-700/30 rounded-lg overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500"
              style={{ width: `${teslaPercentage}%` }}
            ></div>
            <div 
              className="absolute right-0 top-0 h-full bg-gradient-to-r from-orange-600 to-orange-500 transition-all duration-500"
              style={{ width: `${bitcoinPercentage}%` }}
            ></div>
            
            {/* Center Labels */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
                <p className="text-sm text-gray-300">Total Value</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative h-32 bg-gray-700/30 rounded-lg overflow-hidden flex items-center justify-center">
            <div className="text-center text-gray-400">
              <p className="text-lg font-medium">No Portfolio Data</p>
              <p className="text-sm">Start trading to see your portfolio</p>
            </div>
          </div>
        )}
      </div>

      {/* Asset Breakdown */}
      <div className="space-y-4">
        {/* Tesla Holdings */}
        <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-red-600 to-red-500 p-2 rounded-lg">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">Tesla Stock</p>
              <p className="text-gray-400 text-sm">{teslaShares} shares</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-semibold">${teslaValue.toFixed(2)}</p>
            <p className="text-red-400 text-sm">{teslaPercentage.toFixed(1)}%</p>
          </div>
        </div>

        {/* Bitcoin Holdings */}
        <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-2 rounded-lg">
              <Bitcoin className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">Bitcoin</p>
              <p className="text-gray-400 text-sm">{bitcoinBalance.toFixed(4)} BTC</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-semibold">${bitcoinValue.toFixed(2)}</p>
            <p className="text-orange-400 text-sm">{bitcoinPercentage.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      {totalValue > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-600">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center space-x-1 mb-1">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-green-400 text-sm">+8.5%</span>
              </div>
              <p className="text-gray-400 text-xs">24h Change</p>
            </div>
            <div>
              <div className="flex items-center justify-center space-x-1 mb-1">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-green-400 text-sm">+24.3%</span>
              </div>
              <p className="text-gray-400 text-xs">7d Change</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioChart;