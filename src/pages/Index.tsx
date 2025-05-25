
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    }
  }, [navigate, isAuthenticated, loading]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-slate-900">
      <img 
        src="https://redig-apps.com/assets/img/logos/logo_w.png" 
        alt="Redig ERP" 
        className="h-20 mb-4" 
      />
      <h2 className="text-2xl font-bold text-white mb-2">Redig ERP</h2>
      <p className="text-white/70">Enterprise Resource Planning</p>
      <div className="mt-8 flex items-center gap-2 text-white/50">
        <Loader2 className="h-4 w-4 animate-spin" />
        Initializing...
      </div>
    </div>
  );
};

export default Index;
