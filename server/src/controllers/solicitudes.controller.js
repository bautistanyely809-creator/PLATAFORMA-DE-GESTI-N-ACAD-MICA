const { PrismaClient } = require('@prisma/client');
const NotificationService = require('../services/notification.service');
const prisma = new PrismaClient();

// Generar número consecutivo único de radicado: SOL-2026-0001, etc.
async function generarNumeroRadicado() {
  const anio = new Date().getFullYear();
  const count = await prisma.solicitudInstitucional.count();
  const consecutivo = String(count + 1).padStart(4, '0');
  return `SOL-${anio}-${consecutivo}`;
}

// Listar solicitudes con filtros y permisos de rol
exports.getSolicitudes = async (req, res) => {
  try {
    const { estado, categoria, prioridad, radicado } = req.query;
    const where = {};

    if (estado && estado !== 'TODOS') where.estado = estado;
    if (categoria && categoria !== 'TODAS') where.categoria = categoria;
    if (prioridad && prioridad !== 'TODAS') where.prioridad = prioridad;
    if (radicado) where.radicado = { contains: radicado };

    // Si el usuario es aprendiz, solo puede consultar sus propias solicitudes
    if (req.user && req.user.rol === 'APRENDIZ') {
      where.id_usuario_solicitante = Number(req.user.id_usuario);
    } else if (req.user && req.user.rol === 'INSTRUCTOR' && req.query.solo_asignadas === 'true') {
      where.id_usuario_responsable = Number(req.user.id_usuario);
    }

    const solicitudes = await prisma.solicitudInstitucional.findMany({
      where,
      include: {
        solicitante: {
          select: { id_usuario: true, nombre: true, apellido: true, correo: true, rol: true }
        },
        responsable: {
          select: { id_usuario: true, nombre: true, apellido: true, correo: true }
        },
        historial: {
          include: { usuario: { select: { nombre: true, apellido: true } } },
          orderBy: { fecha: 'desc' }
        }
      },
      orderBy: { fecha_creacion: 'desc' }
    });

    res.json(solicitudes);
  } catch (error) {
    console.error('Error al listar solicitudes:', error);
    res.status(500).json({ message: 'Error interno al consultar solicitudes', error: error.message });
  }
};

// Detalle de solicitud por ID
exports.getSolicitudById = async (req, res) => {
  try {
    const { id } = req.params;
    const solicitud = await prisma.solicitudInstitucional.findUnique({
      where: { id_solicitud: Number(id) },
      include: {
        solicitante: {
          select: { id_usuario: true, nombre: true, apellido: true, correo: true, rol: true }
        },
        responsable: {
          select: { id_usuario: true, nombre: true, apellido: true, correo: true }
        },
        historial: {
          include: { usuario: { select: { nombre: true, apellido: true, rol: true } } },
          orderBy: { fecha: 'desc' }
        }
      }
    });

    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    // Validación de seguridad: un aprendiz no puede ver solicitudes de otros aprendices
    if (req.user && req.user.rol === 'APRENDIZ' && solicitud.id_usuario_solicitante !== req.user.id_usuario) {
      return res.status(403).json({ message: 'Acceso denegado: No tienes autorización para ver esta solicitud' });
    }

    res.json(solicitud);
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar solicitud', error: error.message });
  }
};

// Crear nueva solicitud (Genera radicado único)
exports.crearSolicitud = async (req, res) => {
  try {
    const { categoria, asunto, descripcion, archivo_adjunto, prioridad } = req.body;

    if (!asunto || !descripcion || !categoria) {
      return res.status(400).json({ message: 'Categoría, asunto y descripción son obligatorios' });
    }

    const radicado = await generarNumeroRadicado();
    const id_usuario_solicitante = req.user?.id_usuario || 1;

    const nuevaSolicitud = await prisma.solicitudInstitucional.create({
      data: {
        radicado,
        id_usuario_solicitante,
        categoria,
        asunto,
        descripcion,
        archivo_adjunto,
        prioridad: prioridad || 'MEDIA',
        estado: 'RECIBIDA',
        historial: {
          create: {
            estado_anterior: 'CREADA',
            estado_nuevo: 'RECIBIDA',
            id_usuario: id_usuario_solicitante,
            comentario: 'Solicitud radicada formalmente en el sistema.'
          }
        }
      },
      include: {
        solicitante: { select: { nombre: true, apellido: true, correo: true } }
      }
    });

    // Notificar al solicitante con su radicado
    await NotificationService.notificarUsuario(
      id_usuario_solicitante,
      `Solicitud Radicada: ${radicado}`,
      `Tu requerimiento sobre "${asunto}" ha sido recibido y está en cola de atención.`,
      'SOLICITUD',
      '/solicitudes'
    );

    res.status(201).json({
      message: 'Solicitud radicada con éxito',
      radicado,
      solicitud: nuevaSolicitud
    });
  } catch (error) {
    console.error('Error al crear solicitud:', error);
    res.status(500).json({ message: 'Error interno al radicar solicitud', error: error.message });
  }
};

// Asignar responsable a una solicitud (Admin)
exports.asignarResponsable = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario_responsable, comentario } = req.body;

    const solicitud = await prisma.solicitudInstitucional.findUnique({
      where: { id_solicitud: Number(id) }
    });

    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    const actualizada = await prisma.solicitudInstitucional.update({
      where: { id_solicitud: Number(id) },
      data: {
        id_usuario_responsable: Number(id_usuario_responsable),
        estado: 'ASIGNADA'
      },
      include: {
        responsable: { select: { nombre: true, apellido: true } },
        solicitante: { select: { id_usuario: true } }
      }
    });

    // Historial
    await prisma.historialSolicitud.create({
      data: {
        id_solicitud: Number(id),
        estado_anterior: solicitud.estado,
        estado_nuevo: 'ASIGNADA',
        id_usuario: req.user?.id_usuario || 1,
        comentario: comentario || `Asignada al funcionario ${actualizada.responsable?.nombre} ${actualizada.responsable?.apellido}`
      }
    });

    // Notificar al funcionario asignado
    await NotificationService.notificarUsuario(
      Number(id_usuario_responsable),
      `Nueva Solicitud Asignada: ${solicitud.radicado}`,
      `Se te ha asignado la solicitud de categoría ${solicitud.categoria}: "${solicitud.asunto}".`,
      'SOLICITUD',
      '/solicitudes'
    );

    res.json({ message: 'Responsable asignado correctamente', solicitud: actualizada });
  } catch (error) {
    res.status(500).json({ message: 'Error al asignar solicitud', error: error.message });
  }
};

// Responder y/o cambiar estado de una solicitud (Funcionario o Admin)
exports.responderSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { respuesta, nuevo_estado, comentario } = req.body;

    const solicitud = await prisma.solicitudInstitucional.findUnique({
      where: { id_solicitud: Number(id) }
    });

    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    const estadoFinal = nuevo_estado || (respuesta ? 'RESPONDIDA' : solicitud.estado);
    const dataUpdate = {
      estado: estadoFinal
    };

    if (respuesta) {
      dataUpdate.respuesta = respuesta;
    }

    if (estadoFinal === 'CERRADA' || estadoFinal === 'RECHAZADA') {
      dataUpdate.fecha_cierre = new Date();
    }

    const actualizada = await prisma.solicitudInstitucional.update({
      where: { id_solicitud: Number(id) },
      data: dataUpdate,
      include: {
        solicitante: true,
        responsable: true
      }
    });

    // Registrar en trazabilidad
    await prisma.historialSolicitud.create({
      data: {
        id_solicitud: Number(id),
        estado_anterior: solicitud.estado,
        estado_nuevo: estadoFinal,
        id_usuario: req.user?.id_usuario || 1,
        comentario: comentario || (respuesta ? 'Respuesta oficial enviada al solicitante.' : `Estado actualizado a ${estadoFinal}`)
      }
    });

    // Notificar al solicitante
    await NotificationService.notificarUsuario(
      actualizada.id_usuario_solicitante,
      `Actualización de Solicitud: ${solicitud.radicado}`,
      `Tu solicitud ha cambiado a estado [${estadoFinal}]. ${respuesta ? 'Respuesta: ' + respuesta.substring(0, 100) + '...' : ''}`,
      'SOLICITUD',
      '/solicitudes'
    );

    res.json({ message: 'Respuesta y estado procesados exitosamente', solicitud: actualizada });
  } catch (error) {
    res.status(500).json({ message: 'Error al responder solicitud', error: error.message });
  }
};
