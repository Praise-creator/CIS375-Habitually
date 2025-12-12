import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { Screen } from '../App';

interface SignupPageProps {
  onNavigate: (screen: Screen) => void;
  onSignup: (email: string, password: string, name: string) => void;
  theme: 'light' | 'dark';
}

export function SignupPage({ onNavigate, onSignup, theme }: SignupPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: any = {};

    if (!name) {
      newErrors.name = 'Name is required';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSignup(email, password, name);
    }
  };

  return (
    <div className={`h-full flex flex-col overflow-y-auto ${theme === 'dark' ? 'bg-neutral-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`pt-16 pb-6 px-6 ${
        theme === 'dark' ? 'border-b border-neutral-800' : 'border-b border-neutral-100'
      }`}>
        <button
          onClick={() => onNavigate('welcome')}
          className={`p-2 -ml-2 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <h1 className={theme === 'dark' ? 'text-white' : 'text-neutral-900'}>Create account</h1>
        <p className={`mb-8 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
          Sign up to get started
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                theme === 'dark'
                  ? 'bg-neutral-800 border-neutral-700 text-white focus:ring-white'
                  : 'bg-white border-neutral-200 text-neutral-900 focus:ring-neutral-900'
              } ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Your name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

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
              } ${errors.email ? 'border-red-500' : ''}`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className={`block mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                theme === 'dark'
                  ? 'bg-neutral-800 border-neutral-700 text-white focus:ring-white'
                  : 'bg-white border-neutral-200 text-neutral-900 focus:ring-neutral-900'
              } ${errors.password ? 'border-red-500' : ''}`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className={`block mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                theme === 'dark'
                  ? 'bg-neutral-800 border-neutral-700 text-white focus:ring-white'
                  : 'bg-white border-neutral-200 text-neutral-900 focus:ring-neutral-900'
              } ${errors.confirmPassword ? 'border-red-500' : ''}`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-4 rounded-xl mt-6 ${
              theme === 'dark' ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-white'
            }`}
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-6">
          <span className={theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}>
            Already have an account?{' '}
          </span>
          <button
            onClick={() => onNavigate('login')}
            className={theme === 'dark' ? 'text-white' : 'text-neutral-900'}
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}