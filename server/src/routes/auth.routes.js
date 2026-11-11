const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Endpoint de Login de demostración / producción
router.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ message: 'El correo y la contraseña son obligatorios' });
  }

  // Usuarios simulados para demostración ágil en la semana 1
  const mockUsers = [
    {
      id_usuario: 1,
      nombre: 'Administrador',
      apellido: 'General',
      correo: 'admin@edunova.edu.co',
      rol: 'ADMIN'
    },
    {
      id_usuario: 2,
      nombre: 'Carlos',
      apellido: 'Mendoza',
      correo: 'carlos.mendoza@edunova.edu.co',
      rol: 'INSTRUCTOR'
    },
    {
      id_usuario: 4,
      nombre: 'Anyely',
      apellido: 'Valeria',
      correo: 'anyely.valeria@edunova.edu.co',
      rol: 'APRENDIZ'
    }
  ];

  const user = mockUsers.find(u => u.correo.toLowerCase() === correo.toLowerCase());

  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas. Usuario no registrado.' });
  }

  // Generar Token JWT
  const secret = process.env.JWT_SECRET || 'edunova_super_secret_jwt_key_2026';
  const token = jwt.sign(
    {
      id_usuario: user.id_usuario,
      nombre: `${user.nombre} ${user.apellido}`,
      correo: user.correo,
      rol: user.rol
    },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

  res.json({
    message: 'Inicio de sesión exitoso en EDUNOVA',
    token,
    user: {
      id: user.id_usuario,
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      rol: user.rol
    }
  });
});

module.exports = router;

