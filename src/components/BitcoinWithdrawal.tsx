import React, { useState } from 'react';
import { Bitcoin, Wallet, Send, AlertCircle, CheckCircle, Copy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface BitcoinWithdrawalProps {
  isOpen: boolean;
  onClose: () => void;
  adminBalance: number;
}

const BitcoinWithdrawal: React.FC<BitcoinWithdrawalProps> = ({ isOpen, onClose, adminBalance }) => {
  const { user } = useAuth();
  const [withdrawalAddress, setWithdrawalAddress] = useState('');
  const [amount, setAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState<'details' | 'confirmation'>('details');

  // Current Bitcoin price (simulated)
  const bitcoinPrice = 43250.50;
  const usdValue = amount * bitcoinPrice;
  const networkFee = 0.0001; // BTC
  const totalAmount = amount + networkFee;

  const handleWithdrawal = async () => {
    setIsProcessing(true);
    
    // Simulate withdrawal processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        setStep('details');
        setWithdrawalAddress('');
        setAmount(0);
      }, 3000);
    }, 3000);
  };

  const validateAddress = (address: string): boolean => {
    // Basic Bitcoin address validation (simplified)
    return address.length >= 26 && address.length <= 62 && 
           (address.startsWith('1') || address.startsWith('3') || address.startsWith('bc1'));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isOpen || user?.role !== 'admin') return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-2 rounded-lg">
                <Send className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Withdraw Bitcoin</h2>
                <p className="text-gray-400 text-sm">Admin wallet withdrawal</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success Message */}
          {showSuccess && (
            <div className="bg-green-900/20 border border-green-500/50 p-4 rounded-lg mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-green-200">
                  Withdrawal of {amount} BTC initiated successfully!
                </span>
              </div>
            </div>
          )}

          {/* Admin Balance */}
          <div className="bg-gray-700/30 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bitcoin className="h-5 w-5 text-orange-400" />
                <span className="text-white font-medium">Available Balance</span>
              </div>
              <div className="text-right">
                <p className="text-orange-400 font-semibold">{adminBalance.toFixed(6)} BTC</p>
                <p className="text-gray-400 text-sm">≈ ${(adminBalance * bitcoinPrice).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Step 1: Withdrawal Details */}
          {step === 'details' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Withdrawal Address
                </label>
                <input
                  type="text"
                  value={withdrawalAddress}
                  onChange={(e) => setWithdrawalAddress(e.target.value)}
                  placeholder="Enter Bitcoin address (bc1... or 1... or 3...)"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
                {withdrawalAddress && !validateAddress(withdrawalAddress) && (
                  <p className="text-red-400 text-sm mt-1">Invalid Bitcoin address format</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount (BTC)
                </label>
                <input
                  type="number"
                  step="0.00000001"
                  min="0.0001"
                  max={adminBalance - networkFee}
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-gray-400 text-sm">Min: 0.0001 BTC</span>
                  <button
                    onClick={() => setAmount(adminBalance - networkFee)}
                    className="text-orange-400 text-sm hover:text-orange-300"
                  >
                    Max: {(adminBalance - networkFee).toFixed(6)} BTC
                  </button>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[0.001, 0.01, 0.1, 0.5].map(quickAmount => (
                  <button
                    key={quickAmount}
                    onClick={() => setAmount(Math.min(quickAmount, adminBalance - networkFee))}
                    disabled={quickAmount > adminBalance - networkFee}
                    className="py-2 px-3 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-lg text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {quickAmount} BTC
                  </button>
                ))}
              </div>

              {/* Transaction Summary */}
              {amount > 0 && (
                <div className="bg-gray-700/30 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white">{amount.toFixed(6)} BTC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">USD Value:</span>
                    <span className="text-white">${usdValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Network Fee:</span>
                    <span className="text-white">{networkFee.toFixed(6)} BTC</span>
                  </div>
                  <div className="border-t border-gray-600 pt-2 flex justify-between">
                    <span className="text-white font-medium">Total Deducted:</span>
                    <span className="text-white font-semibold">{totalAmount.toFixed(6)} BTC</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Confirmation */}
          {step === 'confirmation' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Confirm Withdrawal</h3>
                
                {/* Withdrawal Details */}
                <div className="bg-gray-700/30 p-4 rounded-lg space-y-3">
                  <div>
                    <span className="text-gray-400 text-sm">Destination Address:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-white font-mono text-sm break-all">{withdrawalAddress}</span>
                      <button
                        onClick={() => copyToClipboard(withdrawalAddress)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-orange-400 font-semibold">{amount.toFixed(6)} BTC</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">USD Value:</span>
                    <span className="text-white">${usdValue.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network Fee:</span>
                    <span className="text-white">{networkFee.toFixed(6)} BTC</span>
                  </div>
                  
                  <div className="border-t border-gray-600 pt-3 flex justify-between">
                    <span className="text-white font-medium">Total Deducted:</span>
                    <span className="text-white font-semibold">{totalAmount.toFixed(6)} BTC</span>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
                  <div>
                    <p className="text-red-200 text-sm font-medium">Important Notice</p>
                    <p className="text-red-300 text-xs mt-1">
                      This withdrawal cannot be reversed. Please verify the address is correct before confirming.
                      This is a demo - no real Bitcoin will be sent.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            {step === 'confirmation' && (
              <button
                onClick={() => setStep('details')}
                disabled={isProcessing}
                className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                Back
              </button>
            )}
            <button
              onClick={step === 'details' ? () => setStep('confirmation') : handleWithdrawal}
              disabled={
                isProcessing || 
                !withdrawalAddress || 
                !validateAddress(withdrawalAddress) || 
                amount <= 0 || 
                totalAmount > adminBalance
              }
              className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : step === 'confirmation' ? (
                'Confirm Withdrawal'
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BitcoinWithdrawal;