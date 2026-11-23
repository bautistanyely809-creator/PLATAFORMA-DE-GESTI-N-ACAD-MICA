const express = require('express');
const router = express.Router();
const academicoController = require('../controllers/academico.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

// Programas de formación (HU-08)
router.get('/programas', verifyToken, academicoController.getProgramas);
router.post('/programas', verifyToken, requireRole('ADMIN'), academicoController.crearPrograma);

// Fichas de caracterización (HU-09)
router.get('/fichas', verifyToken, academicoController.getFichas);
router.post('/fichas', verifyToken, requireRole('ADMIN'), academicoController.crearFicha);

// Asignación de instructores a fichas (HU-10)
router.post('/fichas/:id_curso/instructores', verifyToken, requireRole('ADMIN'), academicoController.asignarInstructorAFicha);

// Matrícula de aprendices en fichas (HU-11)
router.post('/fichas/:id_curso/matricular', verifyToken, requireRole('ADMIN'), academicoController.matricularAprendizEnFicha);

module.exports = router;
