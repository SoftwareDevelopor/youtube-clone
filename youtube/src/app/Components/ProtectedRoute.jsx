'use client'
import { useEffect, useState } from 'react';
import { isAuthenticated, getUserData } from '@/app/utils/auth';

export default function ProtectedRoute({ children, fallback = null }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const userData = getUserData();
      
      setIsAuth(authenticated);
      setUser(userData);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!isAuth) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access this page.</p>
          <a 
            href="/login" 
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return children;
} 