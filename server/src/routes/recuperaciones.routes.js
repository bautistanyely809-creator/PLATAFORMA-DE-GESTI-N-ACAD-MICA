const express = require('express');
const router = express.Router();
const controller = require('../controllers/recuperaciones.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

router.get('/aprendiz/:id_inscripcion', controller.getRecuperacionesAprendiz);
router.get('/ficha/:id_curso', controller.getRecuperacionesFicha);
router.post('/asignar', verifyToken, requireRole('INSTRUCTOR', 'ADMIN'), controller.asignarRecuperacion);
router.post('/:id_recuperacion/entregar', verifyToken, requireRole('APRENDIZ'), controller.entregarRecuperacion);
router.post('/:id_recuperacion/evaluar', verifyToken, requireRole('INSTRUCTOR', 'ADMIN'), controller.evaluarRecuperacion);

module.exports = router;
