const express = require('express');
const router = express.Router();
const controller = require('../controllers/competencias.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

router.get('/programa/:id_programa', controller.getCompetenciasPorPrograma);
router.get('/seguimiento/:id_inscripcion', controller.getSeguimientoAprendiz);
router.get('/ficha/:id_curso', controller.getSeguimientoFicha);
router.post('/evaluar', verifyToken, requireRole('INSTRUCTOR', 'ADMIN'), controller.evaluarCompetencia);

module.exports = router;
