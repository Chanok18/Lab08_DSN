import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Profile from './pages/Profile';
import Layout from './components/Layout';

function MainApp() {
  const { user } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'products' | 'profile'

  if (!user) {
    return authView === 'login' ? (
      <Login onSwitchToRegister={() => setAuthView('register')} />
    ) : (
      <Register onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {currentView === 'dashboard' && <Dashboard setCurrentView={setCurrentView} />}
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
