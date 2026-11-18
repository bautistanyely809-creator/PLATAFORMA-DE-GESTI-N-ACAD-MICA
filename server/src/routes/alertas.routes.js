const express = require('express');
const router = express.Router();
const controller = require('../controllers/alertas.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

router.get('/', controller.getAlertas);
router.get('/:id', controller.getAlertaById);
router.post('/', verifyToken, requireRole('ADMIN', 'INSTRUCTOR'), controller.crearAlerta);
router.patch('/:id/estado', verifyToken, requireRole('ADMIN', 'INSTRUCTOR'), controller.cambiarEstadoAlerta);
router.post('/evaluar-reglas', verifyToken, requireRole('ADMIN', 'INSTRUCTOR'), controller.evaluarReglasAutomaticas);

module.exports = router;

