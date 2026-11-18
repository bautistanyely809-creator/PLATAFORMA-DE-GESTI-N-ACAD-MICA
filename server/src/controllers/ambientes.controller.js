const { PrismaClient } = require('@prisma/client');
const NotificationService = require('../services/notification.service');
const prisma = new PrismaClient();

// Listar ambientes con filtros
exports.getAmbientes = async (req, res) => {
  try {
    const { tipo, estado, q } = req.query;
    const where = {};

    if (tipo && tipo !== 'TODOS') where.tipo = tipo;
    if (estado && estado !== 'TODOS') where.estado = estado;
    if (q) {
      where.OR = [
        { nombre: { contains: q } },
        { codigo: { contains: q } },
        { ubicacion: { contains: q } }
      ];
    }

    const ambientes = await prisma.ambiente.findMany({
      where,
      include: {
        reservas: {
          where: { estado: 'CONFIRMADA' },
          include: {
            instructor: { include: { usuario: { select: { nombre: true, apellido: true } } } },
            curso: { select: { nombre: true } }
          },
          orderBy: { fecha: 'asc' }
        }
      },
      orderBy: { nombre: 'asc' }
    });

    res.json(ambientes);
  } catch (error) {
    console.error('Error al listar ambientes:', error);
    res.status(500).json({ message: 'Error interno al consultar ambientes', error: error.message });
  }
};

// Detalle de ambiente por ID
exports.getAmbienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const ambiente = await prisma.ambiente.findUnique({
      where: { id_ambiente: Number(id) },
      include: {
        reservas: {
          include: {
            instructor: { include: { usuario: true } },
            curso: true
          },
          orderBy: { fecha: 'desc' }
        }
      }
    });

    if (!ambiente) {
      return res.status(404).json({ message: 'Ambiente de formación no encontrado' });
    }

    res.json(ambiente);
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar ambiente', error: error.message });
  }
};

// Crear nuevo ambiente (Admin)
exports.crearAmbiente = async (req, res) => {
  try {
    const { codigo, nombre, descripcion, ubicacion, capacidad, tipo, equipamiento, estado, observaciones } = req.body;

    if (!codigo || !nombre || !capacidad) {
      return res.status(400).json({ message: 'El código, nombre y capacidad son requeridos' });
    }

    const existe = await prisma.ambiente.findUnique({ where: { codigo } });
    if (existe) {
      return res.status(400).json({ message: `Ya existe un ambiente con el código ${codigo}` });
    }

    const nuevoAmbiente = await prisma.ambiente.create({
      data: {
        codigo,
        nombre,
        descripcion,
        ubicacion: ubicacion || 'Sede Principal',
        capacidad: Number(capacidad),
        tipo: tipo || 'SISTEMAS',
        equipamiento,
        estado: estado || 'DISPONIBLE',
        observaciones
      }
    });

    res.status(201).json({ message: 'Ambiente registrado exitosamente', ambiente: nuevoAmbiente });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear ambiente', error: error.message });
  }
};

// Actualizar ambiente
exports.actualizarAmbiente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, ubicacion, capacidad, tipo, equipamiento, estado, observaciones } = req.body;

    const data = {};
    if (nombre) data.nombre = nombre;
    if (descripcion !== undefined) data.descripcion = descripcion;
    if (ubicacion) data.ubicacion = ubicacion;
    if (capacidad) data.capacidad = Number(capacidad);
    if (tipo) data.tipo = tipo;
    if (equipamiento !== undefined) data.equipamiento = equipamiento;
    if (estado) data.estado = estado;
    if (observaciones !== undefined) data.observaciones = observaciones;

    const ambienteActualizado = await prisma.ambiente.update({
      where: { id_ambiente: Number(id) },
      data
    });

    res.json({ message: 'Ambiente actualizado exitosamente', ambiente: ambienteActualizado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar ambiente', error: error.message });
  }
};

// Consultar disponibilidad y reservas de un ambiente en una fecha
exports.getDisponibilidadAmbiente = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha } = req.query;

    const where = {
      id_ambiente: Number(id),
      estado: 'CONFIRMADA'
    };

    if (fecha) {
      const fechaObj = new Date(fecha);
      where.fecha = fechaObj;
    }

    const reservas = await prisma.reservaAmbiente.findMany({
      where,
      include: {
        instructor: { include: { usuario: { select: { nombre: true, apellido: true } } } },
        curso: { select: { nombre: true } }
      },
      orderBy: { hora_inicio: 'asc' }
    });

    res.json(reservas);
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar disponibilidad', error: error.message });
  }
};

// Crear reserva con validación estricta de conflictos de horario y sincronización con calendario
exports.crearReserva = async (req, res) => {
  try {
    const {
      id_ambiente,
      id_curso,
      id_instructor,
      motivo,
      fecha,
      hora_inicio,
      hora_fin,
      observaciones
    } = req.body;

    if (!id_ambiente || !fecha || !hora_inicio || !hora_fin || !motivo) {
      return res.status(400).json({ message: 'Todos los campos de horario, ambiente y motivo son requeridos' });
    }

    if (hora_fin <= hora_inicio) {
      return res.status(400).json({ message: 'La hora de finalización debe ser posterior a la de inicio' });
    }

    const ambiente = await prisma.ambiente.findUnique({
      where: { id_ambiente: Number(id_ambiente) }
    });

    if (!ambiente) {
      return res.status(404).json({ message: 'Ambiente no encontrado' });
    }

    if (ambiente.estado === 'INACTIVO' || ambiente.estado === 'EN_MANTENIMIENTO') {
      return res.status(400).json({
        message: `El ambiente se encuentra actualmente ${ambiente.estado} y no admite reservas.`
      });
    }

    const fechaReserva = new Date(fecha);

    // Detección estricta de colisiones concurrentes en el servidor
    // Una colisión ocurre si: (nueva_inicio < existente_fin) AND (nueva_fin > existente_inicio)
    const reservasExistentes = await prisma.reservaAmbiente.findMany({
      where: {
        id_ambiente: Number(id_ambiente),
        fecha: fechaReserva,
        estado: 'CONFIRMADA'
      }
    });

    const hayConflicto = reservasExistentes.some(r => {
      return (hora_inicio < r.hora_fin && hora_fin > r.hora_inicio);
    });

    if (hayConflicto) {
      return res.status(409).json({
        message: 'Conflicto de programación: El ambiente ya tiene una reserva confirmada que coincide con ese horario.'
      });
    }

    const instructorId = id_instructor ? Number(id_instructor) : 1;

    // Crear la reserva
    const nuevaReserva = await prisma.reservaAmbiente.create({
      data: {
        id_ambiente: Number(id_ambiente),
        id_curso: id_curso ? Number(id_curso) : null,
        id_instructor: instructorId,
        motivo,
        fecha: fechaReserva,
        hora_inicio,
        hora_fin,
        estado: 'CONFIRMADA',
        observaciones
      },
      include: {
        ambiente: true,
        curso: true,
        instructor: { include: { usuario: true } }
      }
    });

    // Regla de Integración: Crear automáticamente el evento en el Calendario Académico
    const [hIniHours, hIniMins] = hora_inicio.split(':');
    const [hFinHours, hFinMins] = hora_fin.split(':');
    const fechaHoraInicio = new Date(fechaReserva);
    fechaHoraInicio.setHours(Number(hIniHours || 7), Number(hIniMins || 0), 0);
    const fechaHoraFin = new Date(fechaReserva);
    fechaHoraFin.setHours(Number(hFinHours || 13), Number(hFinMins || 0), 0);

    await prisma.eventoCalendario.create({
      data: {
        titulo: `Reserva Ambiente: ${ambiente.nombre} — ${motivo}`,
        descripcion: `Ambiente ${ambiente.codigo} reservado para ${motivo}.`,
        categoria: 'RESERVA_AMBIENTE',
        fecha_inicio: fechaHoraInicio,
        fecha_fin: fechaHoraFin,
        hora_inicio,
        hora_fin,
        ubicacion: `${ambiente.nombre} (${ambiente.ubicacion})`,
        id_ambiente: ambiente.id_ambiente,
        id_instructor: instructorId,
        id_curso: id_curso ? Number(id_curso) : null,
        id_usuario_creador: req.user?.id_usuario || 1,
        estado: 'ACTIVO'
      }
    });

    // Notificar a la ficha si la reserva corresponde a una clase
    if (id_curso) {
      await NotificationService.notificarFicha(
        id_curso,
        `Ambiente Asignado: ${ambiente.nombre}`,
        `Se programó actividad en el ambiente ${ambiente.codigo} para el ${fechaReserva.toISOString().split('T')[0]} (${hora_inicio} - ${hora_fin}).`,
        'AMBIENTE',
        '/ambientes'
      );
    }

    res.status(201).json({
      message: 'Reserva confirmada y sincronizada en el calendario académico',
      reserva: nuevaReserva
    });
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ message: 'Error interno al procesar reserva', error: error.message });
  }
};

// Cancelar reserva de ambiente
exports.cancelarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;

    const reserva = await prisma.reservaAmbiente.update({
      where: { id_reserva: Number(id) },
      data: {
        estado: 'CANCELADO',
        observaciones: motivo ? `Cancelada: ${motivo}` : 'Cancelada por el usuario'
      },
      include: { ambiente: true, curso: true }
    });

    // Notificar si está asociada a ficha
    if (reserva.id_curso) {
      await NotificationService.notificarFicha(
        reserva.id_curso,
        `Reserva Cancelada en ${reserva.ambiente.nombre}`,
        `La reserva en ${reserva.ambiente.codigo} para el ${reserva.fecha.toISOString().split('T')[0]} fue cancelada.`,
        'AMBIENTE',
        '/ambientes'
      );
    }

    res.json({ message: 'Reserva cancelada exitosamente', reserva });
  } catch (error) {
    res.status(500).json({ message: 'Error al cancelar reserva', error: error.message });
  }
};

