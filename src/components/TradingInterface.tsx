import React, { useState } from 'react';
import { ShoppingCart, Bitcoin, Calculator, AlertCircle, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TradingInterfaceProps {
  teslaPrice: number;
  bitcoinPrice: number;
}

const TradingInterface: React.FC<TradingInterfaceProps> = ({ teslaPrice, bitcoinPrice }) => {
  const { user, updatePortfolio } = useAuth();
  const [shares, setShares] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!user) return null;

  const totalCost = shares * teslaPrice;
  const bitcoinRequired = totalCost / bitcoinPrice;
  const canAfford = user.portfolio.bitcoinBalance >= bitcoinRequired;

  const handlePurchase = async () => {
    if (!canAfford) return;
    
    setIsProcessing(true);
    
    // Simulate transaction processing
    setTimeout(() => {
      updatePortfolio(shares, totalCost, bitcoinRequired);
      setIsProcessing(false);
      setShowConfirmation(true);
      setShares(1);
      
      setTimeout(() => setShowConfirmation(false), 3000);
    }, 2000);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-white">Tesla Stock Trading</h2>
          <p className="text-gray-400">Buy TSLA shares with Bitcoin</p>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-green-400" />
          <span className="text-green-400 text-sm font-medium">Market Open</span>
        </div>
      </div>
      
      {/* Current Prices Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">T</span>
              </div>
              <span className="text-white font-medium">Tesla (TSLA)</span>
            </div>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">${teslaPrice.toFixed(2)}</span>
            <span className="text-green-400 text-sm">+1.26%</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Bitcoin className="h-8 w-8 text-orange-400" />
              <span className="text-white font-medium">Bitcoin (BTC)</span>
            </div>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">${bitcoinPrice.toFixed(2)}</span>
            <span className="text-green-400 text-sm">+2.98%</span>
          </div>
        </div>
      </div>

      {/* Purchase Form */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Number of Tesla Shares
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              max="100"
              value={shares}
              onChange={(e) => setShares(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white text-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <span className="text-gray-400 text-sm">shares</span>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-gray-400">Min: 1 share</span>
            <span className="text-gray-400">Max: 100 shares</span>
          </div>
        </div>

        {/* Quick Share Buttons */}
        <div className="grid grid-cols-4 gap-3">
          {[1, 5, 10, 25].map(quickShares => (
            <button
              key={quickShares}
              onClick={() => setShares(quickShares)}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                shares === quickShares
                  ? 'bg-red-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {quickShares} {quickShares === 1 ? 'share' : 'shares'}
            </button>
          ))}
        </div>

        {/* Cost Calculation */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Calculator className="h-5 w-5 text-gray-400" />
            <span className="text-white font-medium">Transaction Summary</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Tesla shares:</span>
              <span className="text-white font-medium">{shares} × ${teslaPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total cost (USD):</span>
              <span className="text-white font-semibold text-lg">${totalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Bitcoin required:</span>
              <span className="text-orange-400 font-semibold">{bitcoinRequired.toFixed(6)} BTC</span>
            </div>
            <div className="border-t border-white/10 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Your BTC balance:</span>
                <span className={`font-semibold ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                  {user.portfolio.bitcoinBalance.toFixed(6)} BTC
                </span>
              </div>
              {!canAfford && (
                <div className="mt-2 text-right">
                  <span className="text-red-400 text-sm">
                    Need {(bitcoinRequired - user.portfolio.bitcoinBalance).toFixed(6)} more BTC
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Warning */}
        {!canAfford && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-red-200 font-medium">Insufficient Bitcoin Balance</p>
                <p className="text-red-300 text-sm mt-1">
                  You need {(bitcoinRequired - user.portfolio.bitcoinBalance).toFixed(6)} more BTC to complete this purchase.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {showConfirmation && (
          <div className="bg-green-900/20 border border-green-500/50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-green-200 font-medium">Purchase Successful!</p>
                <p className="text-green-300 text-sm mt-1">
                  Successfully purchased {shares} Tesla share{shares !== 1 ? 's' : ''} for {bitcoinRequired.toFixed(6)} BTC
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Purchase Button */}
        <button
          onClick={handlePurchase}
          disabled={!canAfford || isProcessing || shares < 1}
          className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-red-500 hover:to-red-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-red-500/25"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Processing Transaction...</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              <span>
                Buy {shares} Share{shares !== 1 ? 's' : ''} for {bitcoinRequired.toFixed(6)} BTC
              </span>
            </>
          )}
        </button>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-xl">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
          <p className="text-yellow-200 text-xs">
            <strong>Demo Platform:</strong> This is a demonstration trading platform. All transactions are simulated and no real money, Bitcoin, or Tesla stock is involved. Real-time prices are used for educational purposes only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TradingInterface;