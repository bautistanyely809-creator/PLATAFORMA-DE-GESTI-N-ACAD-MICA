const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper para consolidar el perfil 360 con métricas calculadas en tiempo real
async function compilarPerfil360(id_aprendiz) {
  const aprendiz = await prisma.aprendiz.findUnique({
    where: { id_aprendiz: Number(id_aprendiz) },
    include: {
      usuario: {
        select: {
          id_usuario: true,
          nombre: true,
          apellido: true,
          correo: true,
          rol: true,
          estado: true,
          fecha_creacion: true
        }
      },
      inscripciones: {
        include: {
          curso: {
            include: {
              programa: true,
              instructores: {
                include: {
                  instructor: {
                    include: { usuario: { select: { nombre: true, apellido: true, correo: true } } }
                  }
                }
              }
            }
          },
          seguimientos: {
            include: {
              competencia: {
                include: { resultados: true }
              },
              instructor: {
                include: { usuario: { select: { nombre: true, apellido: true } } }
              },
              historial: {
                orderBy: { fecha: 'desc' }
              }
            }
          },
          entregas: {
            include: {
              evidencia: true
            },
            orderBy: { fecha_entrega: 'desc' }
          },
          registrosAsistencia: {
            include: {
              sesion: true,
              justificaciones: true
            },
            orderBy: { fecha_registro: 'desc' }
          },
          recuperaciones: {
            include: {
              rap: { include: { competencia: true } },
              instructor: { include: { usuario: { select: { nombre: true, apellido: true } } } }
            },
            orderBy: { fecha_creacion: 'desc' }
          }
        }
      },
      alertas: {
        include: {
          historial: {
            orderBy: { fecha: 'desc' }
          }
        },
        orderBy: { fecha_generacion: 'desc' }
      },
      acciones: {
        include: {
          instructor: {
            include: { usuario: { select: { nombre: true, apellido: true, correo: true } } }
          }
        },
        orderBy: { fecha: 'desc' }
      }
    }
  });

  if (!aprendiz) return null;

  // Consultar solicitudes del usuario
  const solicitudes = await prisma.solicitudInstitucional.findMany({
    where: { id_usuario_solicitante: aprendiz.usuario.id_usuario },
    include: {
      responsable: { select: { nombre: true, apellido: true } },
      historial: { orderBy: { fecha: 'desc' } }
    },
    orderBy: { fecha_creacion: 'desc' }
  });

  // Métricas agregadas
  const inscripcionPrincipal = aprendiz.inscripciones[0];
  const curso = inscripcionPrincipal?.curso;
  const programa = curso?.programa;

  // 1. Competencias
  const seguimientos = inscripcionPrincipal?.seguimientos || [];
  const totalCompetencias = seguimientos.length;
  const competenciasAprobadas = seguimientos.filter(s => s.estado === 'APROBADA').length;
  const competenciasEnProceso = seguimientos.filter(s => s.estado === 'EN_DESARROLLO' || s.estado === 'EN_EVALUACION').length;
  const competenciasPendientes = seguimientos.filter(s => s.estado === 'PENDIENTE' || s.estado === 'REQUIERE_REFUERZO').length;
  const porcentajeAvanceCompetencias = totalCompetencias > 0
    ? ((competenciasAprobadas / totalCompetencias) * 100).toFixed(1)
    : 0;

  // 2. Asistencia
  const registrosAsistencia = inscripcionPrincipal?.registrosAsistencia || [];
  const totalSesiones = registrosAsistencia.length;
  const asistencias = registrosAsistencia.filter(r => r.estado === 'ASISTIO').length;
  const inasistencias = registrosAsistencia.filter(r => r.estado === 'AUSENTE').length;
  const retardos = registrosAsistencia.filter(r => r.estado === 'RETARDO').length;
  const justificadas = registrosAsistencia.filter(r => r.estado === 'JUSTIFICADA' || r.estado === 'EXCUSA_PENDIENTE').length;
  const porcentajeAsistencia = totalSesiones > 0
    ? (((asistencias + retardos + justificadas) / totalSesiones) * 100).toFixed(1)
    : 100;

  // 3. Evidencias
  const entregas = inscripcionPrincipal?.entregas || [];
  const totalEntregas = entregas.length;
  const entregasAprobadas = entregas.filter(e => e.estado === 'APROBADA').length;
  const entregasEnRevision = entregas.filter(e => e.estado === 'ENTREGADA' || e.estado === 'EN_REVISION').length;
  const entregasCorregir = entregas.filter(e => e.estado === 'REQUIERE_CORRECCION' || e.estado === 'NO_APROBADA').length;

  // 4. Recuperaciones
  const recuperaciones = inscripcionPrincipal?.recuperaciones || [];
  const recuperacionesActivas = recuperaciones.filter(r => r.estado !== 'SUPERADA').length;

  // 5. Alertas
  const alertas = aprendiz.alertas || [];
  const alertasActivas = alertas.filter(a => a.estado === 'NUEVA' || a.estado === 'EN_SEGUIMIENTO').length;

  return {
    perfil: {
      id_aprendiz: aprendiz.id_aprendiz,
      documento: aprendiz.documento,
      telefono: aprendiz.telefono,
      nombre: aprendiz.usuario.nombre,
      apellido: aprendiz.usuario.apellido,
      correo: aprendiz.usuario.correo,
      estado: aprendiz.usuario.estado,
      fecha_registro: aprendiz.fecha_registro,
      programa: {
        id_programa: programa?.id_programa,
        codigo: programa?.codigo,
        nombre: programa?.nombre
      },
      ficha: {
        id_curso: curso?.id_curso,
        nombre: curso?.nombre,
        fecha_inicio: curso?.fecha_inicio,
        fecha_fin: curso?.fecha_fin
      },
      instructores: curso?.instructores?.map(ci => ({
        id_instructor: ci.instructor.id_instructor,
        nombre: `${ci.instructor.usuario.nombre} ${ci.instructor.usuario.apellido}`,
        correo: ci.instructor.usuario.correo
      })) || []
    },
    indicadores: {
      totalCompetencias,
      competenciasAprobadas,
      competenciasEnProceso,
      competenciasPendientes,
      porcentajeAvanceCompetencias: Number(porcentajeAvanceCompetencias),
      totalSesiones,
      asistencias,
      inasistencias,
      retardos,
      justificadas,
      porcentajeAsistencia: Number(porcentajeAsistencia),
      totalEntregas,
      entregasAprobadas,
      entregasEnRevision,
      entregasCorregir,
      recuperacionesActivas,
      alertasActivas
    },
    secciones: {
      competencias: seguimientos,
      evidencias: entregas,
      asistencia: registrosAsistencia,
      recuperaciones: recuperaciones,
      alertas: alertas,
      solicitudes: solicitudes,
      accionesAcompanamiento: aprendiz.acciones || []
    }
  };
}

// Perfil del aprendiz autenticado
exports.getMiPerfil360 = async (req, res) => {
  try {
    const id_usuario = req.user?.id_usuario;
    const aprendiz = await prisma.aprendiz.findUnique({
      where: { id_usuario: Number(id_usuario) }
    });

    if (!aprendiz) {
      return res.status(404).json({ message: 'No se encontró registro de aprendiz para el usuario actual' });
    }

    const perfilConsolidado = await compilarPerfil360(aprendiz.id_aprendiz);
    res.json(perfilConsolidado);
  } catch (error) {
    console.error('Error al compilar mi perfil 360:', error);
    res.status(500).json({ message: 'Error interno al consultar perfil 360', error: error.message });
  }
};

// Perfil de un aprendiz específico (Admin / Instructor)
exports.getPerfil360PorId = async (req, res) => {
  try {
    const { id_aprendiz } = req.params;
    const perfilConsolidado = await compilarPerfil360(id_aprendiz);

    if (!perfilConsolidado) {
      return res.status(404).json({ message: 'Aprendiz no encontrado' });
    }

    res.json(perfilConsolidado);
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar perfil 360', error: error.message });
  }
};

// Listar aprendices de una ficha para seleccionar perfil
exports.getAprendicesFicha = async (req, res) => {
  try {
    const { id_curso } = req.params;
    const inscripciones = await prisma.inscripcion.findMany({
      where: { id_curso: Number(id_curso) },
      include: {
        aprendiz: {
          include: {
            usuario: {
              select: { id_usuario: true, nombre: true, apellido: true, correo: true, estado: true }
            }
          }
        }
      }
    });

    const lista = inscripciones.map(i => ({
      id_aprendiz: i.aprendiz.id_aprendiz,
      documento: i.aprendiz.documento,
      nombre: `${i.aprendiz.usuario.nombre} ${i.aprendiz.usuario.apellido}`,
      correo: i.aprendiz.usuario.correo,
      estado: i.aprendiz.usuario.estado
    }));

    res.json(lista);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar aprendices', error: error.message });
  }
};

// Registrar acción de acompañamiento formativo
exports.registrarAccionAcompanamiento = async (req, res) => {
  try {
    const { id_aprendiz } = req.params;
    const { tipo_accion, descripcion, compromiso } = req.body;

    const id_usuario = req.user?.id_usuario;
    const instructor = await prisma.instructor.findUnique({
      where: { id_usuario: Number(id_usuario) }
    }) || await prisma.instructor.findFirst();

    if (!instructor) {
      return res.status(400).json({ message: 'No se encontró instructor asociado para registrar la acción' });
    }

    const nuevaAccion = await prisma.accionAcompanamiento.create({
      data: {
        id_aprendiz: Number(id_aprendiz),
        id_instructor: instructor.id_instructor,
        tipo_accion: tipo_accion || 'TUTORIA',
        descripcion,
        compromiso
      },
      include: {
        instructor: { include: { usuario: true } }
      }
    });

    res.status(201).json({
      message: 'Acción de acompañamiento registrada exitosamente',
      accion: nuevaAccion
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar acción formativa', error: error.message });
  }
};
