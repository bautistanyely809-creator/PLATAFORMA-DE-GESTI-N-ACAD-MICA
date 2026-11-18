const express = require('express');
const router = express.Router();
const controller = require('../controllers/aula.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

router.get('/', controller.getAulas);
router.get('/:id', controller.getAulaById);
router.post('/', verifyToken, requireRole('ADMIN', 'INSTRUCTOR'), controller.crearAula);
router.post('/:id_aula/unidades', verifyToken, requireRole('ADMIN', 'INSTRUCTOR'), controller.crearUnidad);
router.post('/unidades/:id_unidad/materiales', verifyToken, requireRole('ADMIN', 'INSTRUCTOR'), controller.publicarMaterial);
router.post('/unidades/:id_unidad/actividades', verifyToken, requireRole('ADMIN', 'INSTRUCTOR'), controller.publicarActividad);
router.post('/actividades/:id_actividad/entregar', verifyToken, requireRole('APRENDIZ'), controller.entregarActividad);
router.post('/entregas/:id_entrega/evaluar', verifyToken, requireRole('ADMIN', 'INSTRUCTOR'), controller.evaluarEntrega);

module.exports = router;

