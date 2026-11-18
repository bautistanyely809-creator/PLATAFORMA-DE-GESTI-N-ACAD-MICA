const express = require('express');
const router = express.Router();

// Métricas oficiales del Dashboard de EDUNOVA
router.get('/stats', (req, res) => {
  res.json({
    kpis: {
      aprendices: 250,
      cursosActivos: 12,
      instructores: 18,
      asistenciaPromedio: 85
    },
    rendimiento: {
      satisfactorio: 75,
      requiereSeguimiento: 25
    },
    aiAssistant: {
      nombre: 'EDUNOVA AI',
      descripcion: 'Asistente inteligente para el seguimiento académico y recomendaciones de aprendizaje.',
      sugerenciasPendientes: 4,
      estado: 'activo'
    }
  });
});

module.exports = router;

