const { PrismaClient } = require('@prisma/client');
const NotificationService = require('../services/notification.service');
const prisma = new PrismaClient();

// Listar aulas según rol y ficha
exports.getAulas = async (req, res) => {
  try {
    const { id_curso } = req.query;
    const where = {};
    if (id_curso) where.id_curso = Number(id_curso);

    const aulas = await prisma.aulaVirtual.findMany({
      where,
      include: {
        curso: {
          include: { programa: { select: { nombre: true, codigo: true } } }
        },
        instructor: {
          include: { usuario: { select: { nombre: true, apellido: true, correo: true } } }
        },
        unidades: {
          include: {
            materiales: true,
            actividades: {
              include: {
                entregas: true
              }
            }
          },
          orderBy: { orden: 'asc' }
        }
      },
      orderBy: { fecha_creacion: 'desc' }
    });

    res.json(aulas);
  } catch (error) {
    console.error('Error al listar aulas:', error);
    res.status(500).json({ message: 'Error interno al consultar aulas virtuales', error: error.message });
  }
};

// Detalle de aula por ID
exports.getAulaById = async (req, res) => {
  try {
    const { id } = req.params;
    const aula = await prisma.aulaVirtual.findUnique({
      where: { id_aula: Number(id) },
      include: {
        curso: {
          include: {
            programa: true,
            inscripciones: {
              include: {
                aprendiz: {
                  include: { usuario: { select: { id_usuario: true, nombre: true, apellido: true, correo: true } } }
                }
              }
            }
          }
        },
        instructor: {
          include: { usuario: { select: { nombre: true, apellido: true, correo: true } } }
        },
        unidades: {
          include: {
            materiales: { orderBy: { fecha_publicacion: 'desc' } },
            actividades: {
              include: {
                entregas: {
                  include: {
                    inscripcion: {
                      include: {
                        aprendiz: { include: { usuario: true } }
                      }
                    }
                  }
                }
              },
              orderBy: { fecha_creacion: 'desc' }
            }
          },
          orderBy: { orden: 'asc' }
        }
      }
    });

    if (!aula) {
      return res.status(404).json({ message: 'Aula virtual no encontrada' });
    }

    res.json(aula);
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar aula virtual', error: error.message });
  }
};

// Crear nueva aula virtual
exports.crearAula = async (req, res) => {
  try {
    const { id_curso, id_instructor, nombre, descripcion, imagen_portada } = req.body;

    if (!id_curso || !nombre) {
      return res.status(400).json({ message: 'El curso y el nombre del aula son obligatorios' });
    }

    const instructorId = id_instructor ? Number(id_instructor) : 1;

    const nuevaAula = await prisma.aulaVirtual.create({
      data: {
        id_curso: Number(id_curso),
        id_instructor: instructorId,
        nombre,
        descripcion,
        imagen_portada: imagen_portada || '/assets/default-course.png',
        estado: 'ACTIVO'
      },
      include: { curso: true }
    });

    res.status(201).json({ message: 'Aula virtual creada exitosamente', aula: nuevaAula });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear aula virtual', error: error.message });
  }
};

// Crear unidad temática en el aula
exports.crearUnidad = async (req, res) => {
  try {
    const { id_aula } = req.params;
    const { titulo, descripcion, orden } = req.body;

    const count = await prisma.unidadAula.count({ where: { id_aula: Number(id_aula) } });

    const unidad = await prisma.unidadAula.create({
      data: {
        id_aula: Number(id_aula),
        titulo,
        descripcion,
        orden: orden ? Number(orden) : count + 1
      }
    });

    res.status(201).json({ message: 'Unidad temática agregada al aula', unidad });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear unidad temática', error: error.message });
  }
};

// Publicar material en una unidad
exports.publicarMaterial = async (req, res) => {
  try {
    const { id_unidad } = req.params;
    const { titulo, descripcion, tipo, url_recurso, peso_mb } = req.body;

    if (!titulo || !url_recurso) {
      return res.status(400).json({ message: 'El título y la URL del recurso son requeridos' });
    }

    const material = await prisma.materialAula.create({
      data: {
        id_unidad: Number(id_unidad),
        titulo,
        descripcion,
        tipo: tipo || 'DOCUMENTO',
        url_recurso,
        peso_mb: peso_mb ? Number(peso_mb) : null
      }
    });

    res.status(201).json({ message: 'Material publicado con éxito', material });
  } catch (error) {
    res.status(500).json({ message: 'Error al publicar material', error: error.message });
  }
};

// Publicar actividad formativa en una unidad (y sincronizar con calendario)
exports.publicarActividad = async (req, res) => {
  try {
    const { id_unidad } = req.params;
    const {
      titulo,
      descripcion,
      instrucciones,
      fecha_limite,
      archivo_adjunto,
      id_evidencia
    } = req.body;

    const fLimite = fecha_limite ? new Date(fecha_limite) : null;

    const actividad = await prisma.actividadAula.create({
      data: {
        id_unidad: Number(id_unidad),
        id_evidencia: id_evidencia ? Number(id_evidencia) : null,
        titulo,
        descripcion,
        instrucciones,
        fecha_limite: fLimite,
        archivo_adjunto,
        estado: 'PUBLICADA'
      },
      include: {
        unidad: {
          include: {
            aula: { include: { curso: true } }
          }
        }
      }
    });

    const aula = actividad.unidad.aula;

    // Regla de Integración: Reflejar en el Calendario Académico si tiene fecha límite
    if (fLimite && aula?.id_curso) {
      await prisma.eventoCalendario.create({
        data: {
          titulo: `Aula Virtual: Entrega de ${titulo}`,
          descripcion: `Vencimiento de actividad formativa en el aula "${aula.nombre}".`,
          categoria: 'ENTREGA',
          fecha_inicio: fLimite,
          fecha_fin: fLimite,
          hora_inicio: '23:59',
          hora_fin: '23:59',
          ubicacion: `Aula Virtual — ${aula.nombre}`,
          id_curso: aula.id_curso,
          id_instructor: aula.id_instructor,
          id_usuario_creador: req.user?.id_usuario || 1,
          estado: 'ACTIVO'
        }
      });

      // Notificar a los aprendices de la ficha
      await NotificationService.notificarFicha(
        aula.id_curso,
        `Nueva Actividad en Aula: ${titulo}`,
        `Fecha límite de entrega: ${fLimite.toISOString().split('T')[0]}. Consulta instrucciones y materiales en el aula virtual.`,
        'AULA_VIRTUAL',
        '/aula'
      );
    }

    res.status(201).json({ message: 'Actividad publicada exitosamente', actividad });
  } catch (error) {
    console.error('Error al publicar actividad:', error);
    res.status(500).json({ message: 'Error al publicar actividad', error: error.message });
  }
};

// Entregar actividad por parte del aprendiz
exports.entregarActividad = async (req, res) => {
  try {
    const { id_actividad } = req.params;
    const { archivo_url, archivo_nombre, comentario } = req.body;

    const id_usuario = req.user?.id_usuario;
    const aprendiz = await prisma.aprendiz.findUnique({
      where: { id_usuario: Number(id_usuario) },
      include: { inscripciones: true }
    });

    if (!aprendiz || !aprendiz.inscripciones.length) {
      return res.status(400).json({ message: 'El usuario no tiene una inscripción activa como aprendiz' });
    }

    const id_inscripcion = aprendiz.inscripciones[0].id_inscripcion;

    const entrega = await prisma.entregaActividadAula.create({
      data: {
        id_actividad: Number(id_actividad),
        id_inscripcion,
        archivo_url,
        archivo_nombre: archivo_nombre || 'archivo_entregado.pdf',
        comentario,
        estado: 'ENTREGADA',
        fecha_entrega: new Date()
      }
    });

    res.status(201).json({ message: 'Actividad entregada exitosamente', entrega });
  } catch (error) {
    res.status(500).json({ message: 'Error al entregar actividad', error: error.message });
  }
};

// Calificar / Retroalimentar entrega (Instructor)
exports.evaluarEntrega = async (req, res) => {
  try {
    const { id_entrega } = req.params;
    const { calificacion, retroalimentacion, estado } = req.body;

    const evaluadorNombre = req.user ? `${req.user.nombre} ${req.user.apellido}` : 'Instructor Evaluador';

    const entregaEvaluada = await prisma.entregaActividadAula.update({
      where: { id_entrega_actividad: Number(id_entrega) },
      data: {
        calificacion: calificacion !== undefined ? Number(calificacion) : null,
        retroalimentacion,
        estado: estado || 'APROBADA',
        evaluador_nombre: evaluadorNombre,
        fecha_evaluacion: new Date()
      },
      include: {
        inscripcion: {
          include: { aprendiz: { include: { usuario: true } } }
        },
        actividad: true
      }
    });

    // Notificar al aprendiz sobre la retroalimentación
    const usuarioAprendiz = entregaEvaluada.inscripcion?.aprendiz?.usuario;
    if (usuarioAprendiz) {
      await NotificationService.notificarUsuario(
        usuarioAprendiz.id_usuario,
        `Retroalimentación de Actividad: ${entregaEvaluada.actividad.titulo}`,
        `Tu entrega ha sido evaluada con calificación ${calificacion}. Estado: ${estado}.`,
        'AULA_VIRTUAL',
        '/aula'
      );
    }

    res.json({ message: 'Evaluación y retroalimentación guardadas', entrega: entregaEvaluada });
  } catch (error) {
    res.status(500).json({ message: 'Error al evaluar entrega', error: error.message });
  }
};

