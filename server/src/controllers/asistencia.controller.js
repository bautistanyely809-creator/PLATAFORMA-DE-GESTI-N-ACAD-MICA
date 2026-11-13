const { PrismaClient } = require('@prisma/client');
const NotificationService = require('../services/notification.service');
const prisma = new PrismaClient();

// 1. Listar sesiones de formación de un curso/ficha
exports.getSesionesPorCurso = async (req, res) => {
  try {
    const { id_curso } = req.params;

    const sesiones = await prisma.sesionClase.findMany({
      where: { id_curso: Number(id_curso) },
      include: {
        instructor: {
          include: { usuario: { select: { nombre: true, apellido: true } } }
        },
        _count: { select: { registros: true } }
      },
      orderBy: { fecha: 'desc' }
    });

    res.json(sesiones);
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar sesiones de formación', error: error.message });
  }
};

// 2. Crear nueva sesión de formación
exports.crearSesion = async (req, res) => {
  try {
    const { id_curso, id_instructor, fecha, hora_inicio, hora_fin, tema } = req.body;

    if (!id_curso || !fecha || !tema) {
      return res.status(400).json({ message: 'Curso, fecha y tema son obligatorios' });
    }

    const nuevaSesion = await prisma.sesionClase.create({
      data: {
        id_curso: Number(id_curso),
        id_instructor: Number(id_instructor || 1),
        fecha: new Date(fecha),
        hora_inicio: hora_inicio || '07:00',
        hora_fin: hora_fin || '13:00',
        tema
      }
    });

    res.status(201).json({
      message: 'Sesión de formación creada exitosamente',
      sesion: nuevaSesion
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la sesión', error: error.message });
  }
};

// 3. Consultar planilla de aprendices y asistencia de una sesión específica
exports.getPlanillaSesion = async (req, res) => {
  try {
    const { id_sesion } = req.params;

    const sesion = await prisma.sesionClase.findUnique({
      where: { id_sesion: Number(id_sesion) },
      include: {
        curso: {
          include: {
            inscripciones: {
              where: { estado: 'ACTIVO' },
              include: {
                aprendiz: { include: { usuario: true } }
              }
            }
          }
        },
        registros: {
          include: { justificaciones: true }
        }
      }
    });

    if (!sesion) {
      return res.status(404).json({ message: 'Sesión no encontrada' });
    }

    // Mapear cada aprendiz de la ficha con su estado en esta sesión
    const registrosMap = new Map();
    sesion.registros.forEach(r => registrosMap.set(r.id_inscripcion, r));

    const planilla = sesion.curso.inscripciones.map(i => {
      const reg = registrosMap.get(i.id_inscripcion);
      return {
        id_inscripcion: i.id_inscripcion,
        id_aprendiz: i.aprendiz.id_aprendiz,
        documento: i.aprendiz.documento,
        nombre: `${i.aprendiz.usuario.nombre} ${i.aprendiz.usuario.apellido}`,
        correo: i.aprendiz.usuario.correo,
        id_registro: reg ? reg.id_registro : null,
        estado: reg ? reg.estado : 'ASISTIO',
        observacion: reg ? reg.observacion : null,
        justificacion: reg && reg.justificaciones.length > 0 ? reg.justificaciones[0] : null
      };
    });

    res.json({
      sesion: {
        id_sesion: sesion.id_sesion,
        fecha: sesion.fecha,
        horario: `${sesion.hora_inicio} - ${sesion.hora_fin}`,
        tema: sesion.tema
      },
      planilla
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar planilla de la sesión', error: error.message });
  }
};

// 4. Registrar o actualizar asistencia masiva de una sesión (sin duplicados)
exports.registrarAsistenciaSesion = async (req, res) => {
  try {
    const { id_sesion, registros } = req.body;

    if (!id_sesion || !Array.isArray(registros)) {
      return res.status(400).json({ message: 'Se requiere id_sesion y arreglo de registros' });
    }

    const operaciones = registros.map(r => 
      prisma.registroAsistencia.upsert({
        where: {
          uk_sesion_inscripcion: {
            id_sesion: Number(id_sesion),
            id_inscripcion: Number(r.id_inscripcion)
          }
        },
        update: {
          estado: r.estado,
          observacion: r.observacion
        },
        create: {
          id_sesion: Number(id_sesion),
          id_inscripcion: Number(r.id_inscripcion),
          estado: r.estado,
          observacion: r.observacion
        }
      })
    );

    const resultados = await prisma.$transaction(operaciones);

    // Detección automática de alertas: Notificar inasistencias a los aprendices
    const inasistencias = registros.filter(r => r.estado === 'AUSENTE');
    for (const inasistencia of inasistencias) {
      const inscripcion = await prisma.inscripcion.findUnique({
        where: { id_inscripcion: Number(inasistencia.id_inscripcion) },
        include: { aprendiz: true }
      });
      if (inscripcion) {
        await NotificationService.notificarUsuario(
          inscripcion.aprendiz.id_usuario,
          'Alerta: Inasistencia Registrada',
          `Se ha registrado una inasistencia en la sesión de formación. Recuerda que puedes radicar tu justificación médica o laboral.`,
          'ASISTENCIA',
          '/dashboard?tab=asistencia'
        );
      }
    }

    res.json({
      message: `Asistencia consolidada exitosamente (${resultados.length} registros)`,
      resultados
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar asistencia', error: error.message });
  }
};

// 5. Radicar justificación de inasistencia
exports.radicarJustificacion = async (req, res) => {
  try {
    const { id_registro, motivo, soporte_url } = req.body;

    if (!id_registro || !motivo) {
      return res.status(400).json({ message: 'El registro y el motivo son obligatorios' });
    }

    const justificacion = await prisma.justificacionAsistencia.create({
      data: {
        id_registro: Number(id_registro),
        motivo,
        soporte_url,
        estado: 'PENDIENTE'
      }
    });

    // Actualizar estado del registro a EXCUSA_PENDIENTE
    await prisma.registroAsistencia.update({
      where: { id_registro: Number(id_registro) },
      data: { estado: 'EXCUSA_PENDIENTE' }
    });

    res.status(201).json({
      message: 'Justificación radicada exitosamente y enviada a revisión docente',
      justificacion
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al radicar la justificación', error: error.message });
  }
};

// 6. Automatizaciones: Estadísticas, ausencias consecutivas y umbral < 85%
exports.getEstadisticasAsistencia = async (req, res) => {
  try {
    const { id_curso } = req.params;

    const inscripciones = await prisma.inscripcion.findMany({
      where: { id_curso: Number(id_curso), estado: 'ACTIVO' },
      include: {
        aprendiz: { include: { usuario: true } },
        registrosAsistencia: {
          orderBy: { fecha_registro: 'asc' },
          include: { sesion: true }
        }
      }
    });

    const totalSesiones = await prisma.sesionClase.count({
      where: { id_curso: Number(id_curso) }
    });

    const informeAprendices = inscripciones.map(i => {
      const regs = i.registrosAsistencia;
      const asistidas = regs.filter(r => r.estado === 'ASISTIO' || r.estado === 'JUSTIFICADA').length;
      const retardos = regs.filter(r => r.estado === 'RETARDO').length;
      const ausencias = regs.filter(r => r.estado === 'AUSENTE' || r.estado === 'EXCUSA_PENDIENTE').length;

      // Porcentaje calculado
      const porcentaje = totalSesiones > 0 
        ? (((asistidas + (retardos * 0.5)) / totalSesiones) * 100).toFixed(1) 
        : 100;

      // Detección de ausencias consecutivas
      let maxConsecutivas = 0;
      let contadorConsecutivas = 0;
      regs.forEach(r => {
        if (r.estado === 'AUSENTE') {
          contadorConsecutivas++;
          if (contadorConsecutivas > maxConsecutivas) maxConsecutivas = contadorConsecutivas;
        } else {
          contadorConsecutivas = 0;
        }
      });

      const enRiesgo = Number(porcentaje) < 85.0 || maxConsecutivas >= 3;

      return {
        id_inscripcion: i.id_inscripcion,
        aprendiz: `${i.aprendiz.usuario.nombre} ${i.aprendiz.usuario.apellido}`,
        documento: i.aprendiz.documento,
        correo: i.aprendiz.usuario.correo,
        totalSesiones,
        asistenciasValidas: asistidas,
        retardos,
        ausencias,
        porcentajeAsistencia: Number(porcentaje),
        maxAusenciasConsecutivas: maxConsecutivas,
        alertaSeguimiento: enRiesgo,
        motivoAlerta: enRiesgo 
          ? (Number(porcentaje) < 85.0 ? 'Porcentaje inferior al umbral del 85%' : 'Tres o más ausencias consecutivas')
          : 'Sin novedades críticas'
      };
    });

    // Promedio grupal
    const sumaPorcentajes = informeAprendices.reduce((acc, curr) => acc + curr.porcentajeAsistencia, 0);
    const promedioGrupal = informeAprendices.length > 0 ? (sumaPorcentajes / informeAprendices.length).toFixed(1) : 100;
    const aprendicesEnRiesgo = informeAprendices.filter(a => a.alertaSeguimiento).length;

    res.json({
      resumenGrupal: {
        totalSesiones,
        aprendicesActivos: inscripciones.length,
        promedioAsistenciaGrupal: Number(promedioGrupal),
        aprendicesEnRiesgo
      },
      aprendices: informeAprendices
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al calcular estadísticas de asistencia', error: error.message });
  }
};
