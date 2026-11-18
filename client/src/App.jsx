import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('edunova_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('edunova_current_user');
    setCurrentUser(null);
  };

  // Si no ha iniciado sesión, es obligatorio autenticarse
  if (!currentUser) {
    return <Auth onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  // Una vez autenticado, accede al sistema completo
  return (
    <div className="min-h-screen">
      <Dashboard currentUser={currentUser} onLogout={handleLogout} />
    </div>
  );
}

export default App;
