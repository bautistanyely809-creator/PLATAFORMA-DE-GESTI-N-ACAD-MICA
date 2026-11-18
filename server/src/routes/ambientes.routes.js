const express = require('express');
const router = express.Router();
const controller = require('../controllers/ambientes.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

router.get('/', controller.getAmbientes);
router.get('/:id', controller.getAmbienteById);
router.get('/:id/disponibilidad', controller.getDisponibilidadAmbiente);
router.post('/', verifyToken, requireRole('ADMIN'), controller.crearAmbiente);
router.put('/:id', verifyToken, requireRole('ADMIN'), controller.actualizarAmbiente);
router.post('/reservas', verifyToken, requireRole('ADMIN', 'INSTRUCTOR'), controller.crearReserva);
router.patch('/reservas/:id/cancelar', verifyToken, requireRole('ADMIN', 'INSTRUCTOR'), controller.cancelarReserva);

module.exports = router;
