import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { PerformanceMonitor } from './services/metrics'

// Inicializar monitoreo de rendimiento de usuarios reales (RUM & Core Web Vitals)
PerformanceMonitor.init();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
