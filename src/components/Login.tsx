import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Loader2 } from 'lucide-react';

export interface User {
  email: string;
  name?: string;
  picture?: string;
  hd?: string;
}

interface LoginProps {
  onLogin: (user: User) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin is from same domain (or localhost for dev)
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type === 'OAUTH_SUCCESS') {
        setIsLoading(false);
        onLogin(event.data.user);
      } else if (event.data?.type === 'OAUTH_ERROR') {
        setIsLoading(false);
        setError(event.data.error || 'Authentication failed');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onLogin]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const redirectUri = `${window.location.origin}/auth/callback`;
      const response = await fetch(`/api/auth/google/url?redirect_uri=${encodeURIComponent(redirectUri)}`);
      
      if (!response.ok) {
        throw new Error('Failed to get auth URL');
      }
      
      const { url } = await response.json();

      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const authWindow = window.open(
        url,
        'google_oauth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!authWindow) {
        setError('Popup blocked. Please allow popups for this site.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to initialize login. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
      >
        <div className="w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/thumb/f/fa/North_South_University_Logo.svg/1200px-North_South_University_Logo.svg.png" 
            alt="NSU Logo" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome to NSU Transcript Analyzer</h1>
        <p className="text-slate-500 mb-8">Sign in with your Google account to continue.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start text-left">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
          ) : (
            <img 
              src="https://www.google.com/favicon.ico" 
              alt="Google" 
              className="w-5 h-5"
            />
          )}
          <span className="font-medium text-slate-700 group-hover:text-slate-900">
            {isLoading ? 'Connecting...' : 'Sign in with Google'}
          </span>
        </button>
      </motion.div>
    </div>
  );
}
