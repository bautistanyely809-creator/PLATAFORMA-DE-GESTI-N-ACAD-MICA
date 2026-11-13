const { PrismaClient } = require('@prisma/client');
const NotificationService = require('../services/notification.service');
const prisma = new PrismaClient();

// 1. Consultar recuperaciones de un aprendiz
exports.getRecuperacionesAprendiz = async (req, res) => {
  try {
    const { id_inscripcion } = req.params;

    const recuperaciones = await prisma.recuperacion.findMany({
      where: { id_inscripcion: Number(id_inscripcion) },
      include: {
        rap: {
          include: { competencia: true }
        },
        instructor: {
          include: { usuario: { select: { nombre: true, apellido: true } } }
        }
      },
      orderBy: { fecha_creacion: 'desc' }
    });

    res.json(recuperaciones);
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar recuperaciones del aprendiz', error: error.message });
  }
};

// 2. Consultar aprendices que requieren refuerzo en una ficha y sus procesos
exports.getRecuperacionesFicha = async (req, res) => {
  try {
    const { id_curso } = req.params;

    // Aprendices con competencias en REQUIERE_REFUERZO
    const enRefuerzo = await prisma.seguimientoCompetencia.findMany({
      where: {
        inscripcion: { id_curso: Number(id_curso) },
        estado: 'REQUIERE_REFUERZO'
      },
      include: {
        inscripcion: {
          include: {
            aprendiz: {
              include: { usuario: { select: { nombre: true, apellido: true, correo: true } } }
            }
          }
        },
        competencia: {
          include: { resultados: true }
        }
      }
    });

    // Procesos de recuperación activos
    const recuperaciones = await prisma.recuperacion.findMany({
      where: {
        inscripcion: { id_curso: Number(id_curso) }
      },
      include: {
        inscripcion: {
          include: { aprendiz: { include: { usuario: true } } }
        },
        rap: { include: { competencia: true } },
        instructor: { include: { usuario: true } }
      },
      orderBy: { fecha_creacion: 'desc' }
    });

    res.json({
      pendientesPorAsignar: enRefuerzo,
      recuperacionesActivas: recuperaciones
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar recuperaciones de la ficha', error: error.message });
  }
};

// 3. Asignar plan de recuperación por el instructor
exports.asignarRecuperacion = async (req, res) => {
  try {
    const { id_inscripcion, id_rap, id_instructor, actividad_refuerzo, fecha_inicio, fecha_limite } = req.body;

    if (!id_inscripcion || !id_rap || !actividad_refuerzo || !fecha_limite) {
      return res.status(400).json({ message: 'Todos los campos del plan de refuerzo son obligatorios' });
    }

    const nuevaRecuperacion = await prisma.recuperacion.create({
      data: {
        id_inscripcion: Number(id_inscripcion),
        id_rap: Number(id_rap),
        id_instructor: Number(id_instructor),
        actividad_refuerzo,
        fecha_inicio: new Date(fecha_inicio || Date.now()),
        fecha_limite: new Date(fecha_limite),
        estado: 'ASIGNADA'
      },
      include: {
        inscripcion: {
          include: { aprendiz: { include: { usuario: true } } }
        },
        rap: { include: { competencia: true } }
      }
    });

    // Notificar al aprendiz
    const idUsuarioAprendiz = nuevaRecuperacion.inscripcion.aprendiz.id_usuario;
    await NotificationService.notificarUsuario(
      idUsuarioAprendiz,
      'Nuevo Plan de Recuperación Asignado',
      `Se te ha asignado una actividad de refuerzo para "${nuevaRecuperacion.rap.competencia.nombre}". Fecha límite: ${new Date(fecha_limite).toLocaleDateString()}.`,
      'RECUPERACION',
      '/dashboard?tab=recuperaciones'
    );

    res.status(201).json({
      message: 'Plan de recuperación asignado exitosamente',
      recuperacion: nuevaRecuperacion
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al asignar recuperación', error: error.message });
  }
};

// 4. Aprendiz entrega la actividad de refuerzo
exports.entregarRecuperacion = async (req, res) => {
  try {
    const { id_recuperacion } = req.params;
    const { archivo_entrega, comentario_entrega } = req.body;

    const recuperacion = await prisma.recuperacion.update({
      where: { id_recuperacion: Number(id_recuperacion) },
      data: {
        archivo_entrega: archivo_entrega || `/uploads/recuperaciones/recuperacion_${id_recuperacion}.zip`,
        comentario_entrega,
        fecha_entrega: new Date(),
        estado: 'ENTREGADA'
      },
      include: {
        instructor: true,
        inscripcion: { include: { aprendiz: { include: { usuario: true } } } },
        rap: { include: { competencia: true } }
      }
    });

    // Notificar al instructor
    await NotificationService.notificarUsuario(
      recuperacion.instructor.id_usuario,
      'Entrega de Recuperación Radicada',
      `El aprendiz ${recuperacion.inscripcion.aprendiz.usuario.nombre} entregó la evidencia de recuperación para "${recuperacion.rap.competencia.nombre}".`,
      'RECUPERACION',
      '/dashboard?tab=recuperaciones'
    );

    res.json({
      message: 'Evidencia de recuperación radicada exitosamente',
      recuperacion
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al entregar recuperación', error: error.message });
  }
};

// 5. Instructor evalúa la recuperación
exports.evaluarRecuperacion = async (req, res) => {
  try {
    const { id_recuperacion } = req.params;
    const { calificacion, observacion, estado } = req.body;
    const evaluadorNombre = req.user ? req.user.nombre : 'Instructor Titular';

    if (calificacion === undefined || !estado) {
      return res.status(400).json({ message: 'Calificación y estado son requeridos' });
    }

    const recuperacion = await prisma.recuperacion.update({
      where: { id_recuperacion: Number(id_recuperacion) },
      data: {
        calificacion: Number(calificacion),
        observacion,
        estado,
        fecha_evaluacion: new Date()
      },
      include: {
        inscripcion: { include: { aprendiz: { include: { usuario: true } } } },
        rap: { include: { competencia: true } }
      }
    });

    // Si la recuperación fue SUPERADA, actualizar automáticamente el SeguimientoCompetencia a APROBADA
    if (estado === 'SUPERADA') {
      const idCompetencia = recuperacion.rap.id_competencia;
      const seguimiento = await prisma.seguimientoCompetencia.findUnique({
        where: {
          uk_inscripcion_competencia: {
            id_inscripcion: recuperacion.id_inscripcion,
            id_competencia: idCompetencia
          }
        }
      });

      if (seguimiento) {
        await prisma.seguimientoCompetencia.update({
          where: { id_seguimiento: seguimiento.id_seguimiento },
          data: {
            estado: 'APROBADA',
            porcentaje_avance: 100.00,
            fecha_evaluacion: new Date(),
            observaciones: `Superada mediante plan de refuerzo académico. Nota: ${calificacion}. ${observacion || ''}`
          }
        });

        await prisma.historialSeguimiento.create({
          data: {
            id_seguimiento: seguimiento.id_seguimiento,
            estado_anterior: 'REQUIERE_REFUERZO',
            estado_nuevo: 'APROBADA',
            motivo: `Plan de recuperación superado exitosamente con nota ${calificacion}`,
            usuario_responsable: evaluadorNombre
          }
        });
      }
    }

    // Notificar al aprendiz
    const idUsuarioAprendiz = recuperacion.inscripcion.aprendiz.id_usuario;
    await NotificationService.notificarUsuario(
      idUsuarioAprendiz,
      `Resultado de Recuperación: ${estado}`,
      `Tu proceso de recuperación para "${recuperacion.rap.competencia.nombre}" fue evaluado con nota ${calificacion}. Estado: ${estado}.`,
      'RECUPERACION',
      '/dashboard?tab=recuperaciones'
    );

    res.json({
      message: 'Evaluación de recuperación registrada exitosamente',
      recuperacion
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al evaluar recuperación', error: error.message });
  }
};
