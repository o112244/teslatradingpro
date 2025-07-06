import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Zap, Bitcoin, BarChart3, Lock } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Invest in Tesla
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300">
                with Bitcoin
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              The future of stock trading is here. Buy Tesla shares using Bitcoin with our secure, 
              professional-grade platform designed for the modern investor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-red-500 hover:to-red-400 transition-all duration-300 transform hover:scale-105"
              >
                Start Trading Now
              </Link>
              <button className="border border-gray-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:border-red-500 hover:text-red-400 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Tesla Stock Pro?</h2>
            <p className="text-xl text-gray-300">Advanced features for the modern crypto-stock investor</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-red-500/50 transition-all duration-300 group">
              <div className="bg-gradient-to-r from-red-600 to-red-500 p-3 rounded-lg w-fit mb-4 group-hover:from-red-500 group-hover:to-red-400 transition-all duration-300">
                <Bitcoin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Bitcoin Integration</h3>
              <p className="text-gray-300 leading-relaxed">
                Seamlessly purchase Tesla stock using Bitcoin. Secure, fast, and decentralized transactions with real-time market pricing.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-red-500/50 transition-all duration-300 group">
              <div className="bg-gradient-to-r from-red-600 to-red-500 p-3 rounded-lg w-fit mb-4 group-hover:from-red-500 group-hover:to-red-400 transition-all duration-300">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Bank-Grade Security</h3>
              <p className="text-gray-300 leading-relaxed">
                Enterprise-level security with multi-layer encryption, secure wallet integration, and regulatory compliance.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-red-500/50 transition-all duration-300 group">
              <div className="bg-gradient-to-r from-red-600 to-red-500 p-3 rounded-lg w-fit mb-4 group-hover:from-red-500 group-hover:to-red-400 transition-all duration-300">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Advanced Analytics</h3>
              <p className="text-gray-300 leading-relaxed">
                Real-time market data, portfolio tracking, and comprehensive trading analytics with live price feeds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold text-red-400 mb-2 group-hover:text-red-300 transition-colors duration-300">$2.5M+</div>
              <div className="text-gray-300">Total Trading Volume</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-red-400 mb-2 group-hover:text-red-300 transition-colors duration-300">10K+</div>
              <div className="text-gray-300">Active Traders</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-red-400 mb-2 group-hover:text-red-300 transition-colors duration-300">99.9%</div>
              <div className="text-gray-300">Uptime</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-red-400 mb-2 group-hover:text-red-300 transition-colors duration-300">24/7</div>
              <div className="text-gray-300">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-r from-red-900/20 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Trading?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of investors who trust Tesla Stock Pro for their Bitcoin-to-Tesla trading needs.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-red-500 hover:to-red-400 transition-all duration-300 transform hover:scale-105"
          >
            <TrendingUp className="mr-2 h-5 w-5" />
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Demo Notice */}
      <div className="bg-yellow-900/20 border-t border-yellow-500/30 p-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-yellow-200 text-sm">
            <Shield className="inline h-4 w-4 mr-1" />
            This is a demonstration platform. Use demo credentials: admin@tesla.com/admin123 or user@demo.com/demo123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;