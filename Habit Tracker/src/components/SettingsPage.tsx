import { useState, useRef } from 'react';
import { ArrowLeft, User, Moon, Download, Upload, LogOut } from 'lucide-react';
import type { Screen } from '../App';

interface SettingsPageProps {
  user: { name: string; avatar: string };
  theme: 'light' | 'dark';
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  onUpdateProfile: (name: string, avatar: string) => void;
  onToggleTheme: () => void;
  onExport: () => void;
  onImport: (data: string) => void;
}

const AVATARS = ['👤', '👨', '👩', '🧑', '👦', '👧', '🐱', '🐶', '🐼', '🦊'];

export function SettingsPage({
  user,
  theme,
  onNavigate,
  onLogout,
  onUpdateProfile,
  onToggleTheme,
  onExport,
  onImport,
}: SettingsPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdateProfile(name, avatar);
    setIsEditing(false);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onImport(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={`h-full flex flex-col overflow-y-auto ${theme === 'dark' ? 'bg-neutral-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`pt-16 pb-4 px-6 border-b sticky top-0 z-10 ${
        theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-100'
      }`}>
        <div className="flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="p-2 -ml-2">
            <ArrowLeft className={`w-6 h-6 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-900'}`} />
          </button>
          <h1 className={theme === 'dark' ? 'text-white' : 'text-neutral-900'}>Settings</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Profile */}
        <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-neutral-800' : 'bg-neutral-50'}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
              theme === 'dark' ? 'bg-white' : 'bg-neutral-900'
            }`}>
              {avatar}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    theme === 'dark'
                      ? 'bg-neutral-900 border-neutral-700 text-white focus:ring-white'
                      : 'bg-white border-neutral-200 text-neutral-900 focus:ring-neutral-900'
                  }`}
                  placeholder="Display name"
                />
              ) : (
                <>
                  <h2 className={theme === 'dark' ? 'text-white' : 'text-neutral-900'}>{user.name}</h2>
                  <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    Local Profile
                  </p>
                </>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-2 flex-wrap mb-4">
              {AVATARS.map((av) => (
                <button
                  key={av}
                  onClick={() => setAvatar(av)}
                  className={`w-12 h-12 rounded-xl text-2xl ${
                    avatar === av 
                      ? theme === 'dark' ? 'bg-white' : 'bg-neutral-900'
                      : theme === 'dark' ? 'bg-neutral-900' : 'bg-white'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className={`w-full py-3 rounded-xl ${
              theme === 'dark' ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-white'
            }`}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        {/* Theme */}
        <div className="space-y-3">
          <h3 className={theme === 'dark' ? 'text-white' : 'text-neutral-900'}>Appearance</h3>
          <button
            onClick={onToggleTheme}
            className={`w-full flex items-center justify-between p-4 rounded-xl ${
              theme === 'dark' ? 'bg-neutral-800' : 'bg-neutral-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`} />
              <span className={theme === 'dark' ? 'text-white' : 'text-neutral-900'}>Dark Mode</span>
            </div>
            <div
              className={`w-12 h-7 rounded-full transition-colors ${
                theme === 'dark' ? 'bg-white' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full transition-transform mt-1 ${
                  theme === 'dark' ? 'bg-neutral-900 translate-x-6' : 'bg-white translate-x-1'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Backup & Restore */}
        <div className="space-y-3">
          <h3 className={theme === 'dark' ? 'text-white' : 'text-neutral-900'}>Data Management</h3>
          
          <button
            onClick={onExport}
            className={`w-full flex items-center gap-3 p-4 rounded-xl ${
              theme === 'dark' ? 'bg-neutral-800' : 'bg-neutral-50'
            }`}
          >
            <Download className={`w-5 h-5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`} />
            <span className={theme === 'dark' ? 'text-white' : 'text-neutral-900'}>Export Backup</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className={`w-full flex items-center gap-3 p-4 rounded-xl ${
              theme === 'dark' ? 'bg-neutral-800' : 'bg-neutral-50'
            }`}
          >
            <Upload className={`w-5 h-5 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`} />
            <span className={theme === 'dark' ? 'text-white' : 'text-neutral-900'}>Import Backup</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleImport}
            className="hidden"
          />
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            if (confirm('Are you sure you want to log out?')) {
              onLogout();
            }
          }}
          className={`w-full flex items-center gap-3 p-4 rounded-xl ${
            theme === 'dark' ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'
          }`}
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>

        {/* Info */}
        <div className={`text-center text-sm pt-4 ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`}>
          <p>All data is stored locally</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}