const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// HU-01: Autenticación de usuario
router.post('/login', authController.login);

// HU-02: Registro autónomo de aprendices
router.post('/registro', authController.registro);

// HU-03: Solicitud de restablecimiento de contraseña
router.post('/recuperar-password', authController.solicitarRecuperacion);
router.post('/restablecer-password', authController.restablecerPassword);

// HU-04: Perfil de usuario (requiere token JWT)
router.get('/perfil', verifyToken, authController.getPerfilActual);
router.put('/perfil', verifyToken, authController.actualizarPerfil);

module.exports = router;
