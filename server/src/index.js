const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Ruta base / Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'EDUNOVA Academic Management System',
    version: '1.0.0',
    developer: 'Anyely Valeria - SENA ADSO',
    timestamp: new Date().toISOString()
  });
});

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('[Error no controlado]:', err);
  res.status(500).json({
    message: 'Ocurrió un error interno en el servidor EDUNOVA',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Servidor EDUNOVA activo en http://localhost:${PORT}`);
    console.log(`📋 API Health: http://localhost:${PORT}/api/health`);
    console.log(`🎓 SENA Regional Huila - ADSO 2026`);
    console.log(`====================================================`);
  });
}

module.exports = app;

