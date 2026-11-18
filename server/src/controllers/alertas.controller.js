const { PrismaClient } = require('@prisma/client');
const NotificationService = require('../services/notification.service');
const prisma = new PrismaClient();

// Listar alertas con filtros avanzados
exports.getAlertas = async (req, res) => {
  try {
    const { estado, prioridad, tipo, id_curso, id_aprendiz } = req.query;
    const where = {};

    if (estado && estado !== 'TODOS') where.estado = estado;
    if (prioridad && prioridad !== 'TODAS') where.prioridad = prioridad;
    if (tipo && tipo !== 'TODOS') where.tipo = tipo;
    if (id_curso) where.id_curso = Number(id_curso);
    if (id_aprendiz) where.id_aprendiz = Number(id_aprendiz);

    const alertas = await prisma.alertaTemprana.findMany({
      where,
      include: {
        aprendiz: {
          include: {
            usuario: { select: { nombre: true, apellido: true, correo: true } }
          }
        },
        curso: { select: { id_curso: true, nombre: true } },
        instructor: {
          include: {
            usuario: { select: { nombre: true, apellido: true, correo: true } }
          }
        },
        historial: {
          include: {
            usuario: { select: { nombre: true, apellido: true } }
          },
          orderBy: { fecha: 'desc' }
        }
      },
      orderBy: [
        { prioridad: 'desc' },
        { fecha_generacion: 'desc' }
      ]
    });

    res.json(alertas);
  } catch (error) {
    console.error('Error al consultar alertas:', error);
    res.status(500).json({ message: 'Error interno al consultar alertas', error: error.message });
  }
};

// Obtener detalle de una alerta
exports.getAlertaById = async (req, res) => {
  try {
    const { id } = req.params;
    const alerta = await prisma.alertaTemprana.findUnique({
      where: { id_alerta: Number(id) },
      include: {
        aprendiz: { include: { usuario: true } },
        curso: true,
        instructor: { include: { usuario: true } },
        historial: {
          include: { usuario: true },
          orderBy: { fecha: 'desc' }
        }
      }
    });

    if (!alerta) {
      return res.status(404).json({ message: 'Alerta no encontrada' });
    }

    res.json(alerta);
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar alerta', error: error.message });
  }
};

// Crear alerta manualmente
exports.crearAlerta = async (req, res) => {
  try {
    const {
      tipo,
      titulo,
      descripcion,
      id_aprendiz,
      id_curso,
      id_instructor_responsable,
      prioridad
    } = req.body;

    if (!titulo || !descripcion) {
      return res.status(400).json({ message: 'El título y la descripción son obligatorios' });
    }

    const nuevaAlerta = await prisma.alertaTemprana.create({
      data: {
        tipo: tipo || 'INFORMATIVA',
        titulo,
        descripcion,
        id_aprendiz: id_aprendiz ? Number(id_aprendiz) : null,
        id_curso: id_curso ? Number(id_curso) : null,
        id_instructor_responsable: id_instructor_responsable ? Number(id_instructor_responsable) : null,
        prioridad: prioridad || 'MEDIA',
        estado: 'NUEVA',
        origen: 'MANUAL',
        historial: {
          create: {
            estado_anterior: 'CREADA',
            estado_nuevo: 'NUEVA',
            comentario: 'Alerta generada manualmente por el personal académico.',
            id_usuario: req.user?.id_usuario || 1
          }
        }
      },
      include: {
        aprendiz: { include: { usuario: true } },
        curso: true
      }
    });

    // Si tiene instructor responsable, notificarlo
    if (id_instructor_responsable) {
      const instructor = await prisma.instructor.findUnique({
        where: { id_instructor: Number(id_instructor_responsable) }
      });
      if (instructor) {
        await NotificationService.notificarUsuario(
          instructor.id_usuario,
          `Nueva Alerta Temprana [${prioridad}]: ${titulo}`,
          descripcion,
          'ALERTA',
          '/alertas'
        );
      }
    }

    res.status(201).json({ message: 'Alerta creada con éxito', alerta: nuevaAlerta });
  } catch (error) {
    console.error('Error al crear alerta:', error);
    res.status(500).json({ message: 'Error al registrar alerta', error: error.message });
  }
};

// Cambiar estado de una alerta con trazabilidad obligatoria
exports.cambiarEstadoAlerta = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevo_estado, comentario, justificacion_cierre } = req.body;

    const alertaActual = await prisma.alertaTemprana.findUnique({
      where: { id_alerta: Number(id) }
    });

    if (!alertaActual) {
      return res.status(404).json({ message: 'Alerta no encontrada' });
    }

    if (nuevo_estado === 'CERRADA' && !justificacion_cierre && !comentario) {
      return res.status(400).json({ message: 'Para cerrar una alerta se requiere una justificación' });
    }

    const dataUpdate = {
      estado: nuevo_estado
    };

    if (nuevo_estado === 'ATENDIDA') {
      dataUpdate.fecha_atencion = new Date();
    } else if (nuevo_estado === 'CERRADA') {
      dataUpdate.fecha_cierre = new Date();
      dataUpdate.justificacion_cierre = justificacion_cierre || comentario;
    }

    const alertaActualizada = await prisma.alertaTemprana.update({
      where: { id_alerta: Number(id) },
      data: dataUpdate
    });

    // Registrar historial de trazabilidad
    await prisma.historialAlerta.create({
      data: {
        id_alerta: Number(id),
        estado_anterior: alertaActual.estado,
        estado_nuevo: nuevo_estado,
        comentario: comentario || justificacion_cierre || `Estado cambiado a ${nuevo_estado}`,
        id_usuario: req.user?.id_usuario || 1
      }
    });

    res.json({ message: 'Estado de la alerta actualizado exitosamente', alerta: alertaActualizada });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar alerta', error: error.message });
  }
};

// Motor Automatizado de Detección de Reglas
exports.evaluarReglasAutomaticas = async (req, res) => {
  try {
    const alertasGeneradas = [];

    // 1. Regla Inasistencias: Aprendices con > 2 ausencias en los últimos registros
    const registrosAusentes = await prisma.registroAsistencia.findMany({
      where: { estado: 'AUSENTE' },
      include: {
        inscripcion: {
          include: {
            aprendiz: { include: { usuario: true } },
            curso: true
          }
        }
      }
    });

    // Agrupar por aprendiz
    const ausenciasPorAprendiz = {};
    for (const reg of registrosAusentes) {
      const idAp = reg.inscripcion.id_aprendiz;
      if (!ausenciasPorAprendiz[idAp]) {
        ausenciasPorAprendiz[idAp] = {
          count: 0,
          aprendiz: reg.inscripcion.aprendiz,
          curso: reg.inscripcion.curso
        };
      }
      ausenciasPorAprendiz[idAp].count++;
    }

    for (const idAp of Object.keys(ausenciasPorAprendiz)) {
      const item = ausenciasPorAprendiz[idAp];
      if (item.count >= 2) {
        // Verificar si ya existe una alerta activa para evitar spam/duplicados
        const alertaExistente = await prisma.alertaTemprana.findFirst({
          where: {
            id_aprendiz: Number(idAp),
            tipo: 'INASISTENCIA',
            estado: { in: ['NUEVA', 'EN_SEGUIMIENTO'] }
          }
        });

        if (!alertaExistente) {
          const nueva = await prisma.alertaTemprana.create({
            data: {
              tipo: 'INASISTENCIA',
              titulo: `Riesgo de Inasistencia Crítica: ${item.aprendiz.usuario.nombre} ${item.aprendiz.usuario.apellido}`,
              descripcion: `El aprendiz acumula ${item.count} inasistencias en la ficha ${item.curso.nombre}. Supera el umbral preventivo institucional.`,
              id_aprendiz: Number(idAp),
              id_curso: item.curso.id_curso,
              prioridad: item.count >= 3 ? 'CRITICA' : 'ALTA',
              estado: 'NUEVA',
              origen: 'AUTOMATICA',
              historial: {
                create: {
                  estado_anterior: 'AUTOMATIZACION',
                  estado_nuevo: 'NUEVA',
                  comentario: 'Generada automáticamente por el motor de reglas de asistencia de EDUNOVA.',
                  id_usuario: 1
                }
              }
            }
          });
          alertasGeneradas.push(nueva);
        }
      }
    }

    // 2. Regla Evidencias Vencidas sin entrega
    const ahora = new Date();
    const evidenciasVencidas = await prisma.evidencia.findMany({
      where: {
        fecha_limite: { lt: ahora },
        estado: 'PUBLICADA'
      },
      include: { curso: true }
    });

    for (const ev of evidenciasVencidas) {
      const alertaExistente = await prisma.alertaTemprana.findFirst({
        where: {
          id_curso: ev.id_curso,
          tipo: 'EVIDENCIA_VENCIDA',
          estado: { in: ['NUEVA', 'EN_SEGUIMIENTO'] }
        }
      });

      if (!alertaExistente) {
        const nueva = await prisma.alertaTemprana.create({
          data: {
            tipo: 'EVIDENCIA_VENCIDA',
            titulo: `Fecha Límite Vencida: ${ev.nombre}`,
            descripcion: `La evidencia "${ev.nombre}" de la ficha ${ev.curso.nombre} superó la fecha límite (${ev.fecha_limite?.toISOString().split('T')[0]}). Se requiere cierre o evaluación.`,
            id_curso: ev.id_curso,
            prioridad: 'MEDIA',
            estado: 'NUEVA',
            origen: 'AUTOMATICA',
            historial: {
              create: {
                estado_anterior: 'AUTOMATIZACION',
                estado_nuevo: 'NUEVA',
                comentario: 'Generada automáticamente por evaluación de fechas límite en el servidor.',
                id_usuario: 1
              }
            }
          }
        });
        alertasGeneradas.push(nueva);
      }
    }

    res.json({
      message: `Motor de reglas ejecutado exitosamente. ${alertasGeneradas.length} nuevas alertas preventivas generadas.`,
      alertasGeneradas
    });
  } catch (error) {
    console.error('Error al evaluar reglas:', error);
    res.status(500).json({ message: 'Error al evaluar reglas automáticas', error: error.message });
  }
};

