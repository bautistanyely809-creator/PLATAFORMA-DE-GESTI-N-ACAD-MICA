const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

// Listar usuarios (accesible por ADMIN e INSTRUCTOR para búsquedas pedagógicas)
router.get('/', verifyToken, usuariosController.getUsuarios);

// HU-06: Creación institucional de cuentas (Exclusivo ADMIN)
router.post('/', verifyToken, requireRole('ADMIN'), usuariosController.crearUsuario);

// HU-07: Suspensión y reactivación de cuentas (Exclusivo ADMIN)
router.patch('/:id/estado', verifyToken, requireRole('ADMIN'), usuariosController.cambiarEstadoUsuario);

module.exports = router;
