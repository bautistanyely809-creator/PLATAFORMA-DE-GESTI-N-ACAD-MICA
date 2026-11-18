const express = require('express');
const router = express.Router();
const controller = require('../controllers/perfil360.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

router.get('/me', verifyToken, controller.getMiPerfil360);
router.get('/ficha/:id_curso', controller.getAprendicesFicha);
router.get('/:id_aprendiz', controller.getPerfil360PorId);
router.post('/:id_aprendiz/accion', verifyToken, requireRole('INSTRUCTOR', 'ADMIN'), controller.registrarAccionAcompanamiento);

module.exports = router;
