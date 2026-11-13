const express = require('express');
const router = express.Router();
const controller = require('../controllers/reportes.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/aprendiz/:id_inscripcion', controller.getReporteAprendiz);
router.get('/ficha/:id_curso', controller.getReporteFicha);
router.get('/exportar/excel', controller.exportarExcel);

module.exports = router;
