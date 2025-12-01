import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { Screen } from '../App';

interface PasswordRecoveryPageProps {
  onNavigate: (screen: Screen) => void;
  theme: 'light' | 'dark';
}

export function PasswordRecoveryPage({ onNavigate, theme }: PasswordRecoveryPageProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Stub - just show success message
      setSuccess(true);
      setTimeout(() => {
        onNavigate('login');
      }, 2000);
    }
  };

  return (
    <div className={`h-full flex flex-col ${theme === 'dark' ? 'bg-neutral-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`pt-16 pb-6 px-6 ${
        theme === 'dark' ? 'border-b border-neutral-800' : 'border-b border-neutral-100'
      }`}>
        <button
          onClick={() => onNavigate('login')}
          className={`p-2 -ml-2 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <h1 className={theme === 'dark' ? 'text-white' : 'text-neutral-900'}>Reset password</h1>
        <p className={`mb-8 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
          Enter your email and we'll send you a link to reset your password
        </p>

        {success ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-800">
              Password reset link sent! Check your email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-neutral-800 border-neutral-700 text-white focus:ring-white'
                    : 'bg-white border-neutral-200 text-neutral-900 focus:ring-neutral-900'
                } ${error ? 'border-red-500' : ''}`}
                placeholder="your@email.com"
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className={`w-full py-4 rounded-xl mt-6 ${
                theme === 'dark' ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-white'
              }`}
            >
              Send Reset Link
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <button
            onClick={() => onNavigate('login')}
            className={theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}