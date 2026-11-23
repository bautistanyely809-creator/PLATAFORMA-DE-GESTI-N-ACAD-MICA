const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

/**
 * Listar usuarios institucionales con filtros por rol y estado
 */
exports.getUsuarios = async (req, res) => {
  try {
    const { rol, estado, busqueda } = req.query;

    const where = {};
    if (rol) where.rol = rol;
    if (estado) where.estado = estado;
    if (busqueda) {
      where.OR = [
        { nombre: { contains: busqueda } },
        { apellido: { contains: busqueda } },
        { correo: { contains: busqueda } }
      ];
    }

    const usuarios = await prisma.usuario.findMany({
      where,
      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
        correo: true,
        rol: true,
        estado: true,
        fecha_creacion: true,
        aprendiz: {
          select: {
            id_aprendiz: true,
            documento: true,
            telefono: true,
            inscripciones: {
              select: {
                id_curso: true,
                curso: { select: { codigo: true, nombre: true } }
              }
            }
          }
        },
        instructor: {
          select: {
            id_instructor: true,
            documento: true,
            especialidad: true,
            telefono: true,
            cursos: {
              select: {
                id_curso: true,
                curso: { select: { codigo: true, nombre: true } }
              }
            }
          }
        }
      },
      orderBy: { id_usuario: 'desc' }
    });

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar la lista de usuarios', error: error.message });
  }
};

/**
 * HU-06: Creación institucional de cuentas por administrador
 */
exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, apellido, correo, rol, password, documento, telefono, especialidad } = req.body;

    if (!nombre || !apellido || !correo || !rol || !password) {
      return res.status(400).json({ message: 'Nombre, apellido, correo, rol y contraseña son obligatorios.' });
    }

    if (!['ADMIN', 'INSTRUCTOR', 'APRENDIZ'].includes(rol)) {
      return res.status(400).json({ message: 'El rol seleccionado no es válido en el sistema.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe contener al menos 6 caracteres.' });
    }

    const cleanEmail = correo.trim().toLowerCase();

    // Validar correo duplicado
    const existEmail = await prisma.usuario.findUnique({
      where: { correo: cleanEmail }
    });
    if (existEmail) {
      return res.status(409).json({ message: 'Ya existe una cuenta registrada con este correo electrónico.' });
    }

    // Validar documento duplicado si aplica
    if (documento) {
      const cleanDoc = documento.trim();
      const dupAprendiz = await prisma.aprendiz.findUnique({ where: { documento: cleanDoc } });
      const dupInstructor = await prisma.instructor.findUnique({ where: { documento: cleanDoc } });
      if (dupAprendiz || dupInstructor) {
        return res.status(409).json({ message: 'El número de documento ya está asociado a otra cuenta institucional.' });
      }
    }

    const password_hash = await bcrypt.hash(password, 10);

    const nuevoUsuario = await prisma.$transaction(async (tx) => {
      const u = await tx.usuario.create({
        data: {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          correo: cleanEmail,
          password_hash,
          rol,
          estado: 'ACTIVO'
        }
      });

      if (rol === 'APRENDIZ') {
        await tx.aprendiz.create({
          data: {
            id_usuario: u.id_usuario,
            documento: documento ? documento.trim() : `CC-${Date.now().toString().slice(-8)}`,
            telefono: telefono ? telefono.trim() : null
          }
        });
      } else if (rol === 'INSTRUCTOR') {
        await tx.instructor.create({
          data: {
            id_usuario: u.id_usuario,
            documento: documento ? documento.trim() : `CC-${Date.now().toString().slice(-8)}`,
            especialidad: especialidad ? especialidad.trim() : 'Formación Profesional Integral',
            telefono: telefono ? telefono.trim() : null
          }
        });
      }

      return u;
    });

    res.status(201).json({
      message: `Cuenta institucional creada exitosamente con rol ${rol}.`,
      usuario: {
        id_usuario: nuevoUsuario.id_usuario,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol,
        estado: nuevoUsuario.estado
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la cuenta institucional', error: error.message });
  }
};

/**
 * HU-07: Suspensión y reactivación de cuentas institucionales
 */
exports.cambiarEstadoUsuario = async (req, res) => {
  try {
    const id_usuario = Number(req.params.id);
    const { estado } = req.body;

    if (!['ACTIVO', 'INACTIVO'].includes(estado)) {
      return res.status(400).json({ message: 'El estado debe ser ACTIVO o INACTIVO.' });
    }

    // Regla de seguridad límite: evitar auto-suspensión del administrador en sesión
    if (req.user && req.user.id_usuario === id_usuario && estado === 'INACTIVO') {
      return res.status(400).json({
        message: 'Operación no permitida: Un administrador no puede suspender su propia cuenta institucional.'
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario }
    });

    if (!usuario) {
      return res.status(404).json({ message: 'El usuario especificado no existe.' });
    }

    const actualizado = await prisma.usuario.update({
      where: { id_usuario },
      data: { estado }
    });

    res.json({
      message: `El estado de la cuenta de ${actualizado.nombre} ${actualizado.apellido} ha sido actualizado a ${estado}.`,
      usuario: {
        id_usuario: actualizado.id_usuario,
        nombre: actualizado.nombre,
        apellido: actualizado.apellido,
        correo: actualizado.correo,
        rol: actualizado.rol,
        estado: actualizado.estado
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar el estado del usuario', error: error.message });
  }
};
