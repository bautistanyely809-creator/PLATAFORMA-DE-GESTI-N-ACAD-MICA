const { PrismaClient } = require('@prisma/client');
const NotificationService = require('../services/notification.service');
const prisma = new PrismaClient();

// 1. Listar evidencias de un curso/ficha con entregas y RAP
exports.getEvidenciasPorCurso = async (req, res) => {
  try {
    const { id_curso } = req.params;
    const { estado } = req.query;

    const where = { id_curso: Number(id_curso) };
    if (estado) where.estado = estado;

    const evidencias = await prisma.evidencia.findMany({
      where,
      include: {
        rap: {
          include: { competencia: { select: { codigo: true, nombre: true } } }
        },
        entregas: {
          include: {
            inscripcion: {
              include: { aprendiz: { include: { usuario: { select: { nombre: true, apellido: true } } } } }
            }
          },
          orderBy: { version: 'desc' }
        }
      },
      orderBy: { fecha_creacion: 'desc' }
    });

    res.json(evidencias);
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar evidencias', error: error.message });
  }
};

// 2. Crear y publicar nueva evidencia por el instructor
exports.crearEvidencia = async (req, res) => {
  try {
    const { id_curso, id_rap, nombre, descripcion, instrucciones, porcentaje, fecha_limite, estado } = req.body;
    const id_usuario = req.user ? req.user.id_usuario : null;

    if (!id_curso || !nombre) {
      return res.status(400).json({ message: 'El curso y el nombre de la evidencia son obligatorios' });
    }

    const nuevaEvidencia = await prisma.evidencia.create({
      data: {
        id_curso: Number(id_curso),
        id_rap: id_rap ? Number(id_rap) : null,
        nombre,
        descripcion,
        instrucciones,
        porcentaje: porcentaje ? Number(porcentaje) : 100.00,
        fecha_limite: fecha_limite ? new Date(fecha_limite) : null,
        estado: estado || 'PUBLICADA'
      }
    });

    // Notificar a toda la ficha si fue publicada
    if (nuevaEvidencia.estado === 'PUBLICADA') {
      await NotificationService.notificarFicha(
        id_curso,
        'Nueva Evidencia Publicada',
        `Se ha publicado la actividad "${nombre}". Fecha límite: ${fecha_limite ? new Date(fecha_limite).toLocaleDateString() : 'Sin definir'}.`,
        'EVIDENCIA',
        '/dashboard?tab=evidencias'
      );
    }

    // Auditoría
    await NotificationService.registrarAuditoria(
      id_usuario,
      'CREAR_EVIDENCIA',
      'EVIDENCIAS',
      `Evidencia creada: ${nombre} para el curso ID ${id_curso}`
    );

    res.status(201).json({
      message: 'Evidencia creada y publicada exitosamente',
      evidencia: nuevaEvidencia
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la evidencia', error: error.message });
  }
};

// 3. Entregar evidencia con soporte de versionamiento
exports.entregarEvidencia = async (req, res) => {
  try {
    const { id_evidencia } = req.params;
    const { id_inscripcion, archivo_nombre, archivo_url, comentario_aprendiz } = req.body;

    if (!id_inscripcion) {
      return res.status(400).json({ message: 'La inscripción del aprendiz es obligatoria' });
    }

    // Verificar si ya existen entregas previas para calcular la versión
    const entregasPrevias = await prisma.entregaEvidencia.findMany({
      where: {
        id_evidencia: Number(id_evidencia),
        id_inscripcion: Number(id_inscripcion)
      },
      orderBy: { version: 'desc' }
    });

    const ultimaEntrega = entregasPrevias[0];
    let nuevaVersion = 1;

    if (ultimaEntrega) {
      if (ultimaEntrega.estado === 'APROBADA') {
        return res.status(400).json({
          message: 'Esta evidencia ya fue evaluada y APROBADA. No se requieren entregas adicionales.'
        });
      }
      nuevaVersion = ultimaEntrega.version + 1;
    }

    const entrega = await prisma.entregaEvidencia.create({
      data: {
        id_evidencia: Number(id_evidencia),
        id_inscripcion: Number(id_inscripcion),
        version: nuevaVersion,
        archivo_nombre: archivo_nombre || `Entrega_v${nuevaVersion}_Evidencia_${id_evidencia}.zip`,
        archivo_url: archivo_url || `/uploads/evidencias/evidencia_${id_evidencia}_v${nuevaVersion}.zip`,
        comentario_aprendiz,
        estado: 'ENTREGADA',
        fecha_entrega: new Date()
      },
      include: {
        evidencia: true,
        inscripcion: {
          include: { aprendiz: { include: { usuario: true } } }
        }
      }
    });

    // Notificar a instructores asignados al curso
    const cursoInstructores = await prisma.cursoInstructor.findMany({
      where: { id_curso: entrega.evidencia.id_curso },
      include: { instructor: true }
    });

    for (const ci of cursoInstructores) {
      await NotificationService.notificarUsuario(
        ci.instructor.id_usuario,
        'Nueva Entrega de Evidencia Radicada',
        `${entrega.inscripcion.aprendiz.usuario.nombre} ${entrega.inscripcion.aprendiz.usuario.apellido} ha entregado la versión ${nuevaVersion} de "${entrega.evidencia.nombre}".`,
        'EVIDENCIA',
        '/dashboard?tab=evidencias'
      );
    }

    res.status(201).json({
      message: `Evidencia entregada exitosamente (Versión ${nuevaVersion})`,
      entrega
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al entregar la evidencia', error: error.message });
  }
};

// 4. Calificar entrega por el instructor
exports.calificarEntrega = async (req, res) => {
  try {
    const { id_entrega } = req.params;
    const { calificacion, retroalimentacion, estado } = req.body;
    const evaluadorNombre = req.user ? `${req.user.nombre}` : 'Instructor Titular';

    if (calificacion === undefined || !estado) {
      return res.status(400).json({ message: 'La calificación y el estado son requeridos' });
    }

    const entregaActualizada = await prisma.entregaEvidencia.update({
      where: { id_entrega: Number(id_entrega) },
      data: {
        calificacion: Number(calificacion),
        retroalimentacion,
        estado,
        fecha_evaluacion: new Date(),
        evaluador_nombre: evaluadorNombre
      },
      include: {
        evidencia: true,
        inscripcion: {
          include: { aprendiz: { include: { usuario: true } } }
        }
      }
    });

    // Registrar o actualizar calificación en la tabla histórica CALIFICACION
    await prisma.calificacion.upsert({
      where: {
        uk_inscripcion_evidencia: {
          id_inscripcion: entregaActualizada.id_inscripcion,
          id_evidencia: entregaActualizada.id_evidencia
        }
      },
      update: {
        nota: Number(calificacion),
        observacion: retroalimentacion
      },
      create: {
        id_inscripcion: entregaActualizada.id_inscripcion,
        id_evidencia: entregaActualizada.id_evidencia,
        nota: Number(calificacion),
        observacion: retroalimentacion
      }
    });

    // Notificar al aprendiz
    const idUsuarioAprendiz = entregaActualizada.inscripcion.aprendiz.id_usuario;
    await NotificationService.notificarUsuario(
      idUsuarioAprendiz,
      `Resultado de Evidencia: ${estado}`,
      `Tu entrega "${entregaActualizada.evidencia.nombre}" ha sido evaluada con nota ${calificacion} / 5.0. Estado: ${estado}.`,
      'CALIFICACION',
      '/dashboard?tab=calificaciones'
    );

    res.json({
      message: 'Entrega calificada y sincronizada con el libro de calificaciones',
      entrega: entregaActualizada
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al calificar la entrega', error: error.message });
  }
};
