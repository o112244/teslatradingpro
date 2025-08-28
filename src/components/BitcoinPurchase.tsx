import React, { useState } from 'react';
import { Bitcoin, CreditCard, Wallet, Shield, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBitcoinPrice } from '../hooks/useBitcoinPrice';

interface BitcoinPurchaseProps {
  isOpen: boolean;
  onClose: () => void;
}

const BitcoinPurchase: React.FC<BitcoinPurchaseProps> = ({ isOpen, onClose }) => {
  const { user, updatePortfolio } = useAuth();
  const { bitcoinData } = useBitcoinPrice();
  const [amount, setAmount] = useState(100);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState<'amount' | 'payment' | 'confirmation'>('amount');

  const bitcoinAmount = amount / bitcoinData.price;
  const fees = amount * (paymentMethod === 'card' ? 0.025 : 0.015);
  const totalAmount = amount + fees;

  // Admin wallet address (demo)
  const adminWalletAddress = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Update user's Bitcoin balance
      if (user) {
        updatePortfolio(0, 0, -bitcoinAmount); // Add Bitcoin to balance
        
        setIsProcessing(false);
        setShowSuccess(true);
        
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
          setStep('amount');
          setAmount(100); // Reset to default
        }, 3000);
      }
    }, 3000);
  };

  const nextStep = () => {
    if (step === 'amount') setStep('payment');
    else if (step === 'payment') setStep('confirmation');
    else handlePurchase();
  };

  const prevStep = () => {
    if (step === 'payment') setStep('amount');
    else if (step === 'confirmation') setStep('payment');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl">
                <Bitcoin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Buy Bitcoin</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-gray-400 text-sm">Current price: ${bitcoinData.price.toFixed(2)}</span>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-green-400" />
                    <span className="text-green-400 text-xs">+{bitcoinData.changePercent24h.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-6">
            {['Amount', 'Payment', 'Confirm'].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    index <= ['amount', 'payment', 'confirmation'].indexOf(step)
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/25'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="ml-2 text-sm text-gray-300 hidden sm:block">{stepName}</span>
                {index < 2 && <div className="w-8 h-px bg-gray-600 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success Message */}
          {showSuccess && (
            <div className="bg-green-900/20 border border-green-500/50 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-green-200">
                  Successfully purchased {bitcoinAmount.toFixed(6)} BTC!
                </span>
              </div>
            </div>
          )}

          {/* Step 1: Amount */}
          {step === 'amount' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Purchase Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">$</span>
                  <input
                    type="number"
                    min="10"
                    max="10000"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white text-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-400">Min: $10</span>
                  <span className="text-gray-400">Max: $10,000</span>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-3">
                {[50, 100, 250, 500].map(quickAmount => (
                  <button
                    key={quickAmount}
                    onClick={() => setAmount(quickAmount)}
                    className={`py-3 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      amount === quickAmount
                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/25'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    ${quickAmount}
                  </button>
                ))}
              </div>

              {/* Purchase Summary */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Bitcoin price:</span>
                  <span className="text-white">${bitcoinData.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">You'll receive:</span>
                  <span className="text-orange-400 font-semibold">{bitcoinAmount.toFixed(6)} BTC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Processing fee:</span>
                  <span className="text-white">${fees.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="text-white font-medium">Total:</span>
                  <span className="text-white font-semibold text-lg">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === 'payment' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Select Payment Method</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`w-full p-4 rounded-xl border transition-all duration-200 ${
                      paymentMethod === 'card'
                        ? 'border-orange-500 bg-orange-900/20 shadow-lg shadow-orange-500/10'
                        : 'border-white/20 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-orange-400" />
                      <div className="text-left">
                        <p className="text-white font-medium">Credit/Debit Card</p>
                        <p className="text-gray-400 text-sm">Instant purchase • 2.5% fee</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('bank')}
                    className={`w-full p-4 rounded-xl border transition-all duration-200 ${
                      paymentMethod === 'bank'
                        ? 'border-orange-500 bg-orange-900/20 shadow-lg shadow-orange-500/10'
                        : 'border-white/20 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Wallet className="h-5 w-5 text-orange-400" />
                      <div className="text-left">
                        <p className="text-white font-medium">Bank Transfer</p>
                        <p className="text-gray-400 text-sm">1-3 business days • 1.5% fee</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-start space-x-2">
                  <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-blue-200 text-sm font-medium">Bank-Grade Security</p>
                    <p className="text-blue-300 text-xs mt-1">
                      Your payment information is encrypted with 256-bit SSL and never stored on our servers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 'confirmation' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Confirm Purchase</h3>
                
                {/* Purchase Details */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white">${amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bitcoin to receive:</span>
                    <span className="text-orange-400 font-semibold">{bitcoinAmount.toFixed(6)} BTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment method:</span>
                    <span className="text-white capitalize">{paymentMethod === 'card' ? 'Credit Card' : 'Bank Transfer'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Processing fee:</span>
                    <span className="text-white">${fees.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between">
                    <span className="text-white font-medium">Total charge:</span>
                    <span className="text-white font-semibold text-lg">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Admin Wallet Info */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Wallet className="h-4 w-4 text-orange-400" />
                    <span className="text-white font-medium text-sm">Destination Wallet</span>
                  </div>
                  <p className="text-gray-300 text-xs font-mono break-all bg-gray-800/50 p-2 rounded">
                    {adminWalletAddress}
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    Bitcoin will be securely transferred to the admin wallet and credited to your account balance
                  </p>
                </div>
              </div>

              {/* Terms */}
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-yellow-200 text-xs">
                      <strong>Demo Notice:</strong> This is a demonstration platform. By confirming this purchase, you acknowledge that this is a simulated transaction and no real money or cryptocurrency will be exchanged.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            {step !== 'amount' && (
              <button
                onClick={prevStep}
                disabled={isProcessing}
                className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 disabled:opacity-50 border border-white/20"
              >
                Back
              </button>
            )}
            <button
              onClick={nextStep}
              disabled={isProcessing || (step === 'amount' && amount < 10)}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-orange-500/25"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : step === 'confirmation' ? (
                'Confirm Purchase'
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

export default BitcoinPurchase;