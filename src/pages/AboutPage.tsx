import React from 'react';
import { TrendingUp, Zap, BarChart3, Globe, Award, Users, Shield, Target, Rocket, DollarSign, Battery, Factory } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      <div className="relative z-10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-red-600 to-red-500 p-4 rounded-2xl shadow-lg shadow-red-600/25">
                <Zap className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              About Tesla Stock Pro
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              The revolutionary platform connecting cryptocurrency investors with Tesla's future.
              Trade TSLA shares seamlessly using Bitcoin on our secure, professional-grade exchange.
            </p>
          </div>

          {/* Tesla Stock Overview */}
          <div className="mb-16">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Why Tesla Stock?</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Tesla Inc. (NASDAQ: TSLA) is not just an automotive company – it's a revolutionary force
                    reshaping transportation, energy, and technology. Founded by Elon Musk, Tesla has become
                    the world's most valuable automaker and a leader in sustainable energy solutions.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    With groundbreaking innovations in electric vehicles, autonomous driving, battery technology,
                    and solar energy, Tesla represents the future of sustainable transportation. The company's
                    mission to accelerate the world's transition to sustainable energy aligns perfectly with the
                    cryptocurrency community's vision of decentralized, forward-thinking technology.
                  </p>
                </div>
                <div>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Tesla's stock has been one of the most dynamic and high-performing equities in modern markets.
                    The company's continuous innovation, global expansion, and market leadership position make
                    TSLA a compelling investment for those who believe in the future of clean energy and
                    autonomous transportation.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Our platform uniquely bridges the gap between cryptocurrency holders and traditional equity
                    markets, allowing Bitcoin investors to seamlessly participate in Tesla's growth story without
                    converting to fiat currency.
                  </p>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10">
                <div className="text-center">
                  <Globe className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">180+</p>
                  <p className="text-gray-400 text-sm">Countries Sold</p>
                </div>
                <div className="text-center">
                  <Factory className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">6</p>
                  <p className="text-gray-400 text-sm">Gigafactories</p>
                </div>
                <div className="text-center">
                  <Battery className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">1.8M+</p>
                  <p className="text-gray-400 text-sm">Vehicles Delivered</p>
                </div>
                <div className="text-center">
                  <DollarSign className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">$96B+</p>
                  <p className="text-gray-400 text-sm">Annual Revenue</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tesla's Innovation */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Tesla's Revolutionary Products</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <Rocket className="h-10 w-10 text-red-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Electric Vehicles</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Model S, Model 3, Model X, Model Y, and the upcoming Cybertruck represent the pinnacle
                  of electric vehicle technology with industry-leading range, performance, and safety ratings.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <Battery className="h-10 w-10 text-orange-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Energy Solutions</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Powerwall, Powerpack, and Megapack battery storage systems, combined with Solar Roof and
                  solar panels, create comprehensive sustainable energy ecosystems for homes and businesses.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <Target className="h-10 w-10 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Autonomous Driving</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Full Self-Driving capability powered by neural networks and advanced AI represents the
                  future of transportation, with continuous over-the-air updates improving functionality.
                </p>
              </div>
            </div>
          </div>

          {/* Platform Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Choose Our Platform?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6">
                <Shield className="h-10 w-10 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Bank-Grade Security</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Multi-layer encryption, secure wallet integration, and regulatory compliance ensure
                  your assets are protected with institutional-grade security measures.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-2xl p-6">
                <TrendingUp className="h-10 w-10 text-orange-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Real-Time Trading</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Live market data feeds, instant Bitcoin-to-TSLA conversions, and real-time portfolio
                  tracking keep you connected to the markets 24/7.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-6">
                <BarChart3 className="h-10 w-10 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Advanced Analytics</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Comprehensive portfolio tracking, transaction history, and market analytics help you
                  make informed investment decisions with confidence.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-6">
                <Users className="h-10 w-10 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Expert Support</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  24/7 live chat support from our dedicated team of crypto and stock market professionals
                  ensures you're never alone in your investment journey.
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-2xl p-6">
                <Award className="h-10 w-10 text-red-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Regulated Platform</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Full regulatory compliance and investor protection mechanisms ensure a safe,
                  transparent trading environment for all users.
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-2xl p-6">
                <Zap className="h-10 w-10 text-yellow-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Instant Transactions</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Lightning-fast trade execution and settlement powered by cutting-edge blockchain
                  technology and traditional market infrastructure integration.
                </p>
              </div>
            </div>
          </div>

          {/* Investment Insights */}
          <div className="mb-16">
            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Investment Considerations</h2>
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Growth Potential</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Tesla's expansion into new markets, continuous innovation in battery technology, and
                    dominance in the EV sector position the company for sustained growth. With global
                    automotive markets transitioning to electric, Tesla's first-mover advantage and brand
                    strength create significant long-term value potential.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Market Leadership</h3>
                  <p className="text-gray-300 leading-relaxed">
                    As the world's most valuable automaker and a leader in sustainable energy, Tesla has
                    established itself as a dominant force in multiple industries. The company's vertical
                    integration, manufacturing efficiency, and technological innovation create competitive
                    moats that are difficult for competitors to overcome.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Diversification</h3>
                  <p className="text-gray-300 leading-relaxed">
                    For cryptocurrency holders, adding Tesla stock to your portfolio provides exposure to
                    traditional equities while maintaining your Bitcoin holdings. This diversification strategy
                    allows you to participate in both the crypto revolution and the sustainable energy transition,
                    creating a balanced, forward-looking investment approach.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Invest in the Future?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of investors who are already trading Tesla stock with Bitcoin on our platform.
              Start your journey today with bank-grade security and professional support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-red-500 hover:to-red-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25">
                Get Started Now
              </button>
              <button className="border border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:border-red-500 hover:text-red-400 transition-all duration-300">
                View Live Prices
              </button>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6">
            <p className="text-yellow-200 text-sm text-center">
              <strong>Investment Disclaimer:</strong> This platform is for demonstration purposes. Trading stocks and
              cryptocurrencies involves risk. Past performance does not guarantee future results. Please conduct your own
              research and consult with financial advisors before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
