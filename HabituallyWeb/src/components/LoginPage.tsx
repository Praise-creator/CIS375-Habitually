import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { Screen } from '../App';

interface LoginPageProps {
  onNavigate: (screen: Screen) => void;
  onLogin: (name: string) => void;
  theme: 'light' | 'dark';
  registeredUsers: Array<{
    email: string;
    password: string;
    name: string;
  }>;
}

export function LoginPage({ onNavigate, onLogin, theme, registeredUsers }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Check if user exists
      const user = registeredUsers?.find(u => u.email === email && u.password === password);
      if (!user) {
        setErrors({ email: 'User not found. Please sign up first.' });
        return;
      }
      onLogin(user.name);
    }
  };

  return (
    <div className={`h-full flex flex-col ${theme === 'dark' ? 'bg-neutral-900' : 'bg-white'}`}>
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
        <h1 className={theme === 'dark' ? 'text-white' : 'text-neutral-900'}>Welcome back</h1>
        <p className={`mb-8 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
          Log in to continue
        </p>

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

          <button
            type="button"
            onClick={() => onNavigate('password-recovery')}
            className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}
          >
            Forgot password?
          </button>

          <button
            type="submit"
            className={`w-full py-4 rounded-xl mt-6 ${
              theme === 'dark' ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-white'
            }`}
          >
            Log In
          </button>
        </form>

        <div className="text-center mt-6">
          <span className={theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}>
            Don't have an account?{' '}
          </span>
          <button
            onClick={() => onNavigate('signup')}
            className={theme === 'dark' ? 'text-white' : 'text-neutral-900'}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}