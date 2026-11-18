const express = require('express');
const router = express.Router();
const controller = require('../controllers/calendario.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

router.get('/', controller.getEventos);
router.get('/:id', controller.getEventoById);
router.post('/', verifyToken, requireRole('ADMIN', 'INSTRUCTOR'), controller.crearEvento);
router.put('/:id', verifyToken, requireRole('ADMIN', 'INSTRUCTOR'), controller.actualizarEvento);
router.patch('/:id/cancelar', verifyToken, requireRole('ADMIN', 'INSTRUCTOR'), controller.cancelarEvento);

module.exports = router;

