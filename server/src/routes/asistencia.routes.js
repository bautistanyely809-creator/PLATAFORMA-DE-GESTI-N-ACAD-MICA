const express = require('express');
const router = express.Router();
const controller = require('../controllers/asistencia.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

router.get('/sesiones/:id_curso', controller.getSesionesPorCurso);
router.post('/sesiones', verifyToken, requireRole('INSTRUCTOR', 'ADMIN'), controller.crearSesion);
router.get('/sesion/:id_sesion', controller.getPlanillaSesion);
router.post('/registrar', verifyToken, requireRole('INSTRUCTOR', 'ADMIN'), controller.registrarAsistenciaSesion);
router.post('/justificar', verifyToken, controller.radicarJustificacion);
router.get('/estadisticas/:id_curso', controller.getEstadisticasAsistencia);

module.exports = router;
