import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, ArrowLeft, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import AnimatedBackground from '../components/AnimatedBackground';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ForgotPasswordPage: React.FC = () => {
  const [resetType, setResetType] = useState<'email' | 'phone'>('email');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const generateToken = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const isEmail = resetType === 'email';

      const { data: users, error: userError } = await supabase
        .from('users')
        .select('id, email, phone, name')
        .or(isEmail ? `email.eq.${emailOrPhone}` : `phone.eq.${emailOrPhone}`)
        .eq('status', 'active')
        .maybeSingle();

      if (userError || !users) {
        setError('No account found with this information');
        setIsLoading(false);
        return;
      }

      const token = generateToken();

      const { error: tokenError } = await supabase
        .from('password_reset_tokens')
        .insert({
          user_id: users.id,
          token: token,
          expires_at: new Date(Date.now() + 3600000).toISOString()
        });

      if (tokenError) {
        setError('Failed to generate reset token. Please try again.');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setEmailOrPhone('');

    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <AnimatedBackground />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-red-600 to-red-500 p-3 rounded-lg w-fit mx-auto mb-4">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-gray-300">We'll help you get back into your account</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-8">
          {!success ? (
            <>
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setResetType('email')}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    resetType === 'email'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600'
                  }`}
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => setResetType('phone')}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    resetType === 'phone'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600'
                  }`}
                >
                  <Phone className="h-4 w-4" />
                  <span>Phone</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-300 mb-2">
                    {resetType === 'email' ? 'Email Address' : 'Phone Number'}
                  </label>
                  <div className="relative">
                    {resetType === 'email' ? (
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    ) : (
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    )}
                    <input
                      id="emailOrPhone"
                      type={resetType === 'email' ? 'email' : 'tel'}
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors duration-200"
                      placeholder={resetType === 'email' ? 'your.email@example.com' : '+1 (555) 123-4567'}
                      required
                    />
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-blue-200 text-sm">
                    We'll send you instructions to reset your password. For security purposes,
                    please contact our support team to complete the password reset process.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-red-500 hover:to-red-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-red-500/25"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Request Password Reset'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-6">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Request Received</h3>
                <p className="text-green-200 text-sm">
                  We've received your password reset request. Our support team will contact you
                  shortly with instructions to reset your password securely.
                </p>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-200 text-sm">
                  For immediate assistance, please contact our 24/7 support team via live chat.
                </p>
              </div>

              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Return to Login
              </Link>
            </div>
          )}

          {!success && (
            <div className="mt-6 pt-6 border-t border-gray-600">
              <p className="text-center text-gray-300 text-sm">
                Remember your password?{' '}
                <Link to="/login" className="text-red-400 hover:text-red-300 font-medium transition-colors duration-200">
                  Sign in here
                </Link>
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
