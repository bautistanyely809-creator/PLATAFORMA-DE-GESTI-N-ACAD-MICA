const express = require('express');
const router = express.Router();
const controller = require('../controllers/solicitudes.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, controller.getSolicitudes);
router.get('/:id', verifyToken, controller.getSolicitudById);
router.post('/', verifyToken, controller.crearSolicitud);
router.patch('/:id/asignar', verifyToken, requireRole('ADMIN'), controller.asignarResponsable);
router.patch('/:id/responder', verifyToken, requireRole('ADMIN', 'INSTRUCTOR'), controller.responderSolicitud);

module.exports = router;
