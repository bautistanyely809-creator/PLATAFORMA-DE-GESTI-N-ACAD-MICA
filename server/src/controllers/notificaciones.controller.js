const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Obtener notificaciones del usuario autenticado
exports.getNotificacionesUsuario = async (req, res) => {
  try {
    const id_usuario = req.user ? req.user.id_usuario : (req.query.id_usuario ? Number(req.query.id_usuario) : 4);
    const { categoria, soloNoLeidas } = req.query;

    const where = { id_usuario: Number(id_usuario) };
    if (categoria) where.categoria = categoria;
    if (soloNoLeidas === 'true') where.leida = false;

    const notificaciones = await prisma.notificacion.findMany({
      where,
      orderBy: { fecha_creacion: 'desc' },
      take: 50
    });

    const noLeidas = await prisma.notificacion.count({
      where: { id_usuario: Number(id_usuario), leida: false }
    });

    res.json({
      totalNoLeidas: noLeidas,
      notificaciones
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar notificaciones', error: error.message });
  }
};

// 2. Marcar una notificación como leída
exports.marcarComoLeida = async (req, res) => {
  try {
    const { id } = req.params;

    const notificacion = await prisma.notificacion.update({
      where: { id_notificacion: Number(id) },
      data: { leida: true }
    });

    res.json({ message: 'Notificación marcada como leída', notificacion });
  } catch (error) {
    res.status(500).json({ message: 'Error al marcar notificación', error: error.message });
  }
};

// 3. Marcar todas las notificaciones como leídas
exports.marcarTodasComoLeidas = async (req, res) => {
  try {
    const id_usuario = req.user ? req.user.id_usuario : (req.body.id_usuario ? Number(req.body.id_usuario) : 4);

    await prisma.notificacion.updateMany({
      where: { id_usuario: Number(id_usuario), leida: false },
      data: { leida: true }
    });

    res.json({ message: 'Todas las notificaciones han sido marcadas como leídas' });
  } catch (error) {
    res.status(500).json({ message: 'Error al marcar todas las notificaciones', error: error.message });
  }
};
