const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Servicio Centralizado para Notificaciones Automáticas de Eventos
 */
class NotificationService {
  /**
   * Crea una notificación para un usuario individual
   */
  static async notificarUsuario(id_usuario, titulo, mensaje, categoria = 'ALERTA', enlace = null) {
    try {
      return await prisma.notificacion.create({
        data: {
          id_usuario,
          titulo,
          mensaje,
          categoria,
          enlace
        }
      });
    } catch (error) {
      console.error('Error al crear notificación individual:', error);
      return null;
    }
  }

  /**
   * Notifica a todos los aprendices inscritos en un curso/ficha
   */
  static async notificarFicha(id_curso, titulo, mensaje, categoria = 'ANUNCIO', enlace = null) {
    try {
      const inscripciones = await prisma.inscripcion.findMany({
        where: { id_curso: Number(id_curso), estado: 'ACTIVO' },
        include: { aprendiz: true }
      });

      const notificaciones = inscripciones.map(i => ({
        id_usuario: i.aprendiz.id_usuario,
        titulo,
        mensaje,
        categoria,
        enlace
      }));

      if (notificaciones.length > 0) {
        return await prisma.notificacion.createMany({
          data: notificaciones
        });
      }
    } catch (error) {
      console.error('Error al notificar a la ficha:', error);
    }
  }

  /**
   * Registra una acción en la auditoría general
   */
  static async registrarAuditoria(id_usuario, accion, modulo, detalle, ip_address = '127.0.0.1') {
    try {
      await prisma.historialAuditoria.create({
        data: {
          id_usuario,
          accion,
          modulo,
          detalle,
          ip_address
        }
      });
    } catch (error) {
      console.error('Error al registrar auditoría:', error);
    }
  }
}

module.exports = NotificationService;
