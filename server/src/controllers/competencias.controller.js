const { PrismaClient } = require('@prisma/client');
const NotificationService = require('../services/notification.service');
const prisma = new PrismaClient();

// 1. Obtener competencias por programa de formación
exports.getCompetenciasPorPrograma = async (req, res) => {
  try {
    const { id_programa } = req.params;
    const competencias = await prisma.competencia.findMany({
      where: { id_programa: Number(id_programa) },
      include: {
        resultados: true,
        programa: { select: { nombre: true, codigo: true } }
      }
    });
    res.json(competencias);
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar competencias del programa', error: error.message });
  }
};

// 2. Obtener seguimiento de competencias de un aprendiz
exports.getSeguimientoAprendiz = async (req, res) => {
  try {
    const { id_inscripcion } = req.params;

    const seguimientos = await prisma.seguimientoCompetencia.findMany({
      where: { id_inscripcion: Number(id_inscripcion) },
      include: {
        competencia: {
          include: {
            resultados: true,
            programa: { select: { nombre: true, codigo: true } }
          }
        },
        instructor: {
          include: { usuario: { select: { nombre: true, apellido: true } } }
        },
        historial: {
          orderBy: { fecha: 'desc' }
        }
      }
    });

    // Calcular indicador global
    const total = seguimientos.length;
    const aprobadas = seguimientos.filter(s => s.estado === 'APROBADA').length;
    const porcentajeGlobal = total > 0 ? ((aprobadas / total) * 100).toFixed(1) : 0;

    res.json({
      resumen: {
        totalCompetencias: total,
        aprobadas,
        enDesarrollo: seguimientos.filter(s => s.estado === 'EN_DESARROLLO').length,
        requiereRefuerzo: seguimientos.filter(s => s.estado === 'REQUIERE_REFUERZO').length,
        porcentajeGlobal: Number(porcentajeGlobal)
      },
      seguimientos
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar seguimiento del aprendiz', error: error.message });
  }
};

// 3. Obtener seguimiento grupal por Ficha / Curso
exports.getSeguimientoFicha = async (req, res) => {
  try {
    const { id_curso } = req.params;

    const inscripciones = await prisma.inscripcion.findMany({
      where: { id_curso: Number(id_curso), estado: 'ACTIVO' },
      include: {
        aprendiz: {
          include: {
            usuario: { select: { nombre: true, apellido: true, correo: true } }
          }
        },
        seguimientos: {
          include: {
            competencia: true,
            historial: { take: 1, orderBy: { fecha: 'desc' } }
          }
        }
      }
    });

    res.json(inscripciones);
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar seguimiento de la ficha', error: error.message });
  }
};

// 4. Evaluar competencia y registrar cambio de estado con historial
exports.evaluarCompetencia = async (req, res) => {
  try {
    const { id_seguimiento, estado_nuevo, porcentaje_avance, observaciones } = req.body;
    const id_usuario = req.user ? req.user.id_usuario : null;
    const evaluadorNombre = req.user ? req.user.nombre : 'Instructor Titular';

    // Obtener seguimiento actual
    const seguimientoActual = await prisma.seguimientoCompetencia.findUnique({
      where: { id_seguimiento: Number(id_seguimiento) },
      include: {
        inscripcion: {
          include: { aprendiz: { include: { usuario: true } } }
        },
        competencia: true
      }
    });

    if (!seguimientoActual) {
      return res.status(404).json({ message: 'Registro de seguimiento no encontrado' });
    }

    const estadoAnterior = seguimientoActual.estado;

    // Actualización con transacción
    const [seguimientoActualizado] = await prisma.$transaction([
      prisma.seguimientoCompetencia.update({
        where: { id_seguimiento: Number(id_seguimiento) },
        data: {
          estado: estado_nuevo,
          porcentaje_avance: porcentaje_avance !== undefined ? porcentaje_avance : seguimientoActual.porcentaje_avance,
          observaciones,
          fecha_evaluacion: new Date()
        }
      }),
      prisma.historialSeguimiento.create({
        data: {
          id_seguimiento: Number(id_seguimiento),
          estado_anterior: estadoAnterior,
          estado_nuevo,
          motivo: observaciones || 'Evaluación periódica de competencias',
          usuario_responsable: evaluadorNombre
        }
      })
    ]);

    // Generar notificación si la competencia fue aprobada o si requiere refuerzo
    const idUsuarioAprendiz = seguimientoActual.inscripcion.aprendiz.id_usuario;
    if (estado_nuevo === 'APROBADA') {
      await NotificationService.notificarUsuario(
        idUsuarioAprendiz,
        '¡Competencia Aprobada!',
        `Has acreditado satisfactoriamente la competencia "${seguimientoActual.competencia.nombre}".`,
        'COMPETENCIA',
        '/dashboard?tab=competencias'
      );
    } else if (estado_nuevo === 'REQUIERE_REFUERZO') {
      await NotificationService.notificarUsuario(
        idUsuarioAprendiz,
        'Atención: Plan de Refuerzo Requerido',
        `La competencia "${seguimientoActual.competencia.nombre}" requiere plan de mejoramiento académico.`,
        'RECUPERACION',
        '/dashboard?tab=recuperaciones'
      );
    }

    // Auditoría
    await NotificationService.registrarAuditoria(
      id_usuario,
      'EVALUAR_COMPETENCIA',
      'COMPETENCIAS',
      `Cambio de estado ${estadoAnterior} -> ${estado_nuevo} para competencia ID ${seguimientoActual.id_competencia}`
    );

    res.json({
      message: 'Competencia evaluada y registrada exitosamente.',
      seguimiento: seguimientoActualizado
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al evaluar la competencia', error: error.message });
  }
};
