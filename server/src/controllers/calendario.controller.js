const { PrismaClient } = require('@prisma/client');
const NotificationService = require('../services/notification.service');
const prisma = new PrismaClient();

// Listar eventos con filtros (mes, año, categoría, ficha, instructor)
exports.getEventos = async (req, res) => {
  try {
    const { mes, anio, categoria, id_curso, id_instructor, estado } = req.query;
    const where = {};

    if (estado) {
      where.estado = estado;
    }

    if (categoria && categoria !== 'TODAS') {
      where.categoria = categoria;
    }

    if (id_curso) {
      where.id_curso = Number(id_curso);
    }

    if (id_instructor) {
      where.id_instructor = Number(id_instructor);
    }

    // Filtro por rango de fecha (mes y año opcionales)
    if (mes && anio) {
      const fechaInicioMes = new Date(Number(anio), Number(mes) - 1, 1);
      const fechaFinMes = new Date(Number(anio), Number(mes), 0, 23, 59, 59);
      where.fecha_inicio = {
        gte: fechaInicioMes,
        lte: fechaFinMes
      };
    }

    const eventos = await prisma.eventoCalendario.findMany({
      where,
      include: {
        ambiente: { select: { id_ambiente: true, nombre: true, codigo: true, ubicacion: true } },
        instructor: { include: { usuario: { select: { nombre: true, apellido: true, correo: true } } } },
        curso: { select: { id_curso: true, nombre: true } },
        creador: { select: { id_usuario: true, nombre: true, apellido: true, rol: true } }
      },
      orderBy: { fecha_inicio: 'asc' }
    });

    res.json(eventos);
  } catch (error) {
    console.error('Error al consultar eventos:', error);
    res.status(500).json({ message: 'Error interno al consultar el calendario', error: error.message });
  }
};

// Obtener un evento por ID
exports.getEventoById = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await prisma.eventoCalendario.findUnique({
      where: { id_evento: Number(id) },
      include: {
        ambiente: true,
        instructor: { include: { usuario: true } },
        curso: true,
        creador: true
      }
    });

    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    res.json(evento);
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar evento', error: error.message });
  }
};

// Crear evento en calendario
exports.crearEvento = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      categoria,
      fecha_inicio,
      fecha_fin,
      hora_inicio,
      hora_fin,
      ubicacion,
      id_ambiente,
      id_instructor,
      id_curso
    } = req.body;

    // Regla de negocio 1: Validar fechas
    const fInicio = new Date(fecha_inicio);
    const fFin = new Date(fecha_fin);

    if (isNaN(fInicio.getTime()) || isNaN(fFin.getTime())) {
      return res.status(400).json({ message: 'Las fechas proporcionadas no son válidas' });
    }

    if (fFin < fInicio) {
      return res.status(400).json({ message: 'La fecha de finalización no puede ser anterior a la de inicio' });
    }

    const id_usuario_creador = req.user?.id_usuario || 1;

    const nuevoEvento = await prisma.eventoCalendario.create({
      data: {
        titulo,
        descripcion,
        categoria: categoria || 'CLASE',
        fecha_inicio: fInicio,
        fecha_fin: fFin,
        hora_inicio,
        hora_fin,
        ubicacion,
        id_ambiente: id_ambiente ? Number(id_ambiente) : null,
        id_instructor: id_instructor ? Number(id_instructor) : null,
        id_curso: id_curso ? Number(id_curso) : null,
        id_usuario_creador,
        estado: 'ACTIVO'
      },
      include: {
        ambiente: true,
        curso: true
      }
    });

    // Notificar a los aprendices de la ficha si está asignada
    if (id_curso) {
      await NotificationService.notificarFicha(
        id_curso,
        `Nuevo Evento: ${titulo}`,
        `Se ha programado una actividad de tipo ${categoria} para el ${fInicio.toLocaleDateString()}.`,
        'CALENDARIO',
        '/calendario'
      );
    }

    res.status(201).json({
      message: 'Evento creado exitosamente en el calendario',
      evento: nuevoEvento
    });
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(500).json({ message: 'Error al crear evento', error: error.message });
  }
};

// Modificar evento
exports.actualizarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      descripcion,
      categoria,
      fecha_inicio,
      fecha_fin,
      hora_inicio,
      hora_fin,
      ubicacion,
      id_ambiente,
      id_instructor,
      id_curso,
      estado
    } = req.body;

    const data = {};
    if (titulo) data.titulo = titulo;
    if (descripcion !== undefined) data.descripcion = descripcion;
    if (categoria) data.categoria = categoria;
    if (fecha_inicio) data.fecha_inicio = new Date(fecha_inicio);
    if (fecha_fin) data.fecha_fin = new Date(fecha_fin);
    if (hora_inicio) data.hora_inicio = hora_inicio;
    if (hora_fin) data.hora_fin = hora_fin;
    if (ubicacion !== undefined) data.ubicacion = ubicacion;
    if (id_ambiente !== undefined) data.id_ambiente = id_ambiente ? Number(id_ambiente) : null;
    if (id_instructor !== undefined) data.id_instructor = id_instructor ? Number(id_instructor) : null;
    if (id_curso !== undefined) data.id_curso = id_curso ? Number(id_curso) : null;
    if (estado) data.estado = estado;

    const eventoActualizado = await prisma.eventoCalendario.update({
      where: { id_evento: Number(id) },
      data,
      include: { ambiente: true, curso: true }
    });

    res.json({ message: 'Evento actualizado exitosamente', evento: eventoActualizado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar evento', error: error.message });
  }
};

// Cancelar evento (conserva trazabilidad)
exports.cancelarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;

    const evento = await prisma.eventoCalendario.update({
      where: { id_evento: Number(id) },
      data: {
        estado: 'CANCELADO',
        motivo_cancelacion: motivo || 'Cancelado por el organizador'
      },
      include: { curso: true }
    });

    if (evento.id_curso) {
      await NotificationService.notificarFicha(
        evento.id_curso,
        `Evento Cancelado: ${evento.titulo}`,
        `Motivo: ${evento.motivo_cancelacion}`,
        'CALENDARIO',
        '/calendario'
      );
    }

    res.json({ message: 'Evento cancelado con éxito', evento });
  } catch (error) {
    res.status(500).json({ message: 'Error al cancelar evento', error: error.message });
  }
};

