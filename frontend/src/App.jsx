import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Profile from './pages/Profile';
import Layout from './components/Layout';

function MainApp() {
  const { user, setSessionFromSocial } = useAuth();
  const [authView, setAuthView] = useState('login');
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    const hash = window.location.hash;

    if (hash.startsWith('#social_token=')) {
      const params = new URLSearchParams(hash.substring(1));

      const socialToken = params.get('social_token');
      const socialUser = params.get('social_user');

      if (socialToken && socialUser) {
        try {
          const userData = JSON.parse(decodeURIComponent(socialUser));

          setSessionFromSocial(socialToken, userData);

          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        } catch (error) {
          console.error('Error procesando login social:', error);
        }
      }
    }
  }, [setSessionFromSocial]);

  if (!user) {
    return authView === 'login' ? (
      <Login onSwitchToRegister={() => setAuthView('register')} />
    ) : (
      <Register onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {currentView === 'dashboard' && (
        <Dashboard setCurrentView={setCurrentView} />
      )}

      {currentView === 'products' && <Products />}

      {currentView === 'profile' && <Profile />}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}