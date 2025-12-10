import type { Screen } from '../App';

interface WelcomePageProps {
  onNavigate: (screen: Screen) => void;
  theme: 'light' | 'dark';
}

export function WelcomePage({ onNavigate, theme }: WelcomePageProps) {
  return (
    <div className={`h-full flex flex-col items-center justify-between p-8 pt-20 pb-12 ${
      theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-50'
    }`}>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-neutral-900 rounded-3xl flex items-center justify-center mb-6">
          <span className="text-5xl text-white font-bold">H</span>
        </div>
        <h1 className={`mb-3 text-center ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
          Habitually
        </h1>
        <p className={`text-center max-w-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
          Build better habits, one day at a time
        </p>
      </div>

      <div className="w-full space-y-3">
        <button
          onClick={() => onNavigate('login')}
          className={`w-full py-4 rounded-2xl transition-opacity hover:opacity-90 ${
            theme === 'dark' ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-white'
          }`}
        >
          Log In
        </button>
        <button
          onClick={() => onNavigate('signup')}
          className={`w-full py-4 rounded-2xl transition-colors ${
            theme === 'dark' 
              ? 'bg-neutral-800 text-white border-2 border-neutral-700 hover:bg-neutral-750'
              : 'bg-white text-neutral-900 border-2 border-neutral-200 hover:bg-neutral-50'
          }`}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}