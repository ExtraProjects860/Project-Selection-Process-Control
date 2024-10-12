import React from 'react';
import ReactDOM from 'react-dom/client'; // Altere para 'react-dom/client'
import App from './App';
import { AuthProvider } from './components/auth-context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root')); // Cria o root
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
