import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Importa tu archivo de estilos con Tailwind
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);