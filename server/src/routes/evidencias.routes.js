const express = require('express');
const router = express.Router();
const controller = require('../controllers/evidencias.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

router.get('/curso/:id_curso', controller.getEvidenciasPorCurso);
router.post('/', verifyToken, requireRole('INSTRUCTOR', 'ADMIN'), controller.crearEvidencia);
router.post('/:id_evidencia/entregar', verifyToken, requireRole('APRENDIZ'), controller.entregarEvidencia);
router.post('/entregas/:id_entrega/calificar', verifyToken, requireRole('INSTRUCTOR', 'ADMIN'), controller.calificarEntrega);

module.exports = router;
