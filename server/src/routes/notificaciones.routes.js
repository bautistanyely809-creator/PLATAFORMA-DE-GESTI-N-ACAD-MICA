const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificaciones.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/', controller.getNotificacionesUsuario);
router.put('/:id/leida', controller.marcarComoLeida);
router.put('/marcar-todas/todas', controller.marcarTodasComoLeidas);

module.exports = router;
