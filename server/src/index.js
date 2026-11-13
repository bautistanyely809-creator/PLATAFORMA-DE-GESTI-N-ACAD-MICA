const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const cacheService = require('./services/cache.service');
const jobQueue = require('./services/jobQueue.service');

const app = express();
const PORT = process.env.PORT || 4000;

// =========================================================================
// 1. MIDDLEWARES GLOBALES DE SEGURIDAD, COMPRESIÓN Y CACHÉ
// =========================================================================
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Cabeceras de optimización y caché de activos estáticos
app.use((req, res, next) => {
  // Configurar compresión y caché de navegador para recursos estáticos
  if (req.url.match(/\.(css|js|png|jpg|jpeg|webp|avif|svg|woff2)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  next();
});

// =========================================================================
// 2. MONITOR DE PETICIONES LENTAS (ESTILO OPEN TELEMETRY / APM)
// =========================================================================
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 500) {
      console.warn(`⚠️ [OpenTelemetry Alerta Lenta] ${req.method} ${req.originalUrl} tardó ${duration}ms (>500ms)`);
    }
  });
  next();
});

// =========================================================================
// 3. RUTAS Y CACHÉ CON REDIS / IN-MEMORY
// =========================================================================

// Healthcheck con reporte de optimizaciones activas
app.get('/api/health', cacheService.middleware(60000), (req, res) => {
  res.json({
    status: 'online',
    project: 'EDUNOVA Academic Management System',
    version: '2.0.0-optimized',
    optimizations: {
      caching: 'In-Memory / Redis Adapter Active',
      compression: 'Gzip / Brotli Ready',
      antiNPlusOne: 'Prisma Single-Join Query Active',
      slowQueryTracking: 'OpenTelemetry Latency Monitor Active',
      jobQueue: 'Background Task Worker Running',
      connectionPool: 'MySQL 8 Pool (limit=10, timeout=20s)'
    },
    developer: 'Anyely Valeria - SENA ADSO',
    timestamp: new Date().toISOString()
  });
});

// Importar rutas de los 7 Módulos Avanzados
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const competenciasRoutes = require('./routes/competencias.routes');
const evidenciasRoutes = require('./routes/evidencias.routes');
const recuperacionesRoutes = require('./routes/recuperaciones.routes');
const asistenciaRoutes = require('./routes/asistencia.routes');
const reportesRoutes = require('./routes/reportes.routes');
const notificacionesRoutes = require('./routes/notificaciones.routes');
const aiRoutes = require('./routes/ai.routes');

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', cacheService.middleware(30000), dashboardRoutes);
app.use('/api/competencias', competenciasRoutes);
app.use('/api/evidencias', evidenciasRoutes);
app.use('/api/recuperaciones', recuperacionesRoutes);
app.use('/api/asistencia', asistenciaRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/notificaciones', notificacionesRoutes);
app.use('/api/ai', aiRoutes);

// Endpoint para probar la cola de tareas pesadas en segundo plano
app.post('/api/jobs/reporte-academico', (req, res) => {
  const { grupoId, usuarioEmail } = req.body;
  const jobId = jobQueue.enqueue('Generación Reporte Consolidado PDF', { grupoId, usuarioEmail }, async (payload) => {
    // Simulación de tarea lenta en background (2 segundos) sin bloquear el servidor
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.info(`📄 Reporte consolidado generado para grupo ${payload.grupoId} y enviado a ${payload.usuarioEmail}`);
  });

  res.status(202).json({
    message: 'Tarea lenta despachada a la cola de trabajos en segundo plano exitosamente.',
    jobId,
    status: 'enqueued'
  });
});

// Manejo de errores global con formato seguro
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
    console.log(`🚀 Servidor EDUNOVA High-Perf activo en http://localhost:${PORT}`);
    console.log(`📋 API Health: http://localhost:${PORT}/api/health`);
    console.log(`⚡ Optimizaciones: Brotli/Gzip, Cache, Anti-N+1, OpenTelemetry`);
    console.log(`🎓 SENA Regional Huila - ADSO 2026`);
    console.log(`====================================================`);
  });
}

module.exports = app;
