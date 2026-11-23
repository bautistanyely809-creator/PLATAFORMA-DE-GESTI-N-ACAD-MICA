const { PrismaClient } = require('@prisma/client');
const NotificationService = require('../services/notification.service');
const prisma = new PrismaClient();

// =========================================================================
// HU-08: REGISTRO Y GESTIÓN DE PROGRAMAS DE FORMACIÓN
// =========================================================================

exports.getProgramas = async (req, res) => {
  try {
    const programas = await prisma.programa.findMany({
      include: {
        cursos: {
          select: { id_curso: true, codigo: true, nombre: true, estado: true }
        },
        competencias: {
          select: { id_competencia: true, codigo: true, nombre: true }
        }
      },
      orderBy: { id_programa: 'asc' }
    });
    res.json(programas);
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar programas de formación', error: error.message });
  }
};

exports.crearPrograma = async (req, res) => {
  try {
    const { codigo, nombre, version, nivel } = req.body;

    if (!codigo || !nombre) {
      return res.status(400).json({ message: 'El código y nombre del programa son obligatorios.' });
    }

    const cleanCodigo = codigo.trim().toUpperCase();

    // Validar código duplicado
    const exist = await prisma.programa.findUnique({
      where: { codigo: cleanCodigo }
    });
    if (exist) {
      return res.status(409).json({ message: 'Ya existe un programa de formación con este código.' });
    }

    const programa = await prisma.programa.create({
      data: {
        codigo: cleanCodigo,
        nombre: nombre.trim(),
        version: version ? version.trim() : '1.0',
        nivel: nivel || 'TECNOLOGO',
        estado: 'ACTIVO'
      }
    });

    res.status(201).json({
      message: 'Programa de formación registrado exitosamente.',
      programa
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear programa de formación', error: error.message });
  }
};

// =========================================================================
// HU-09: APERTURA Y GESTIÓN DE FICHAS DE CARACTERIZACIÓN (CURSOS)
// =========================================================================

exports.getFichas = async (req, res) => {
  try {
    const fichas = await prisma.curso.findMany({
      include: {
        programa: true,
        instructores: {
          include: {
            instructor: {
              include: { usuario: { select: { nombre: true, apellido: true, correo: true } } }
            }
          }
        },
        inscripciones: {
          include: {
            aprendiz: {
              include: { usuario: { select: { nombre: true, apellido: true, correo: true } } }
            }
          }
        }
      },
      orderBy: { id_curso: 'desc' }
    });

    // Formatear resumen
    const resumen = fichas.map(f => ({
      id_curso: f.id_curso,
      codigo: f.codigo,
      nombre: f.nombre,
      estado: f.estado,
      fecha_inicio: f.fecha_inicio,
      fecha_fin: f.fecha_fin,
      programa: f.programa ? { id_programa: f.programa.id_programa, nombre: f.programa.nombre, codigo: f.programa.codigo } : null,
      total_aprendices: f.inscripciones.length,
      total_instructores: f.instructores.length,
      instructores: f.instructores.map(i => ({
        id_instructor: i.id_instructor,
        nombre: `${i.instructor.usuario.nombre} ${i.instructor.usuario.apellido}`,
        rol_docente: i.rol_docente
      })),
      aprendices: f.inscripciones.map(ins => ({
        id_inscripcion: ins.id_inscripcion,
        id_aprendiz: ins.id_aprendiz,
        nombre: `${ins.aprendiz.usuario.nombre} ${ins.aprendiz.usuario.apellido}`,
        documento: ins.aprendiz.documento,
        estado: ins.estado
      }))
    }));

    res.json(resumen);
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar fichas de formación', error: error.message });
  }
};

exports.crearFicha = async (req, res) => {
  try {
    const { id_programa, codigo, nombre, fecha_inicio, fecha_fin } = req.body;

    if (!id_programa || !codigo || !nombre) {
      return res.status(400).json({ message: 'El programa, código numérico y nombre de la ficha son obligatorios.' });
    }

    const cleanCodigo = codigo.trim();

    // Validar código de ficha duplicado
    const existFicha = await prisma.curso.findUnique({
      where: { codigo: cleanCodigo }
    });
    if (existFicha) {
      return res.status(409).json({ message: 'El número de ficha ya se encuentra registrado en el sistema.' });
    }

    // Validar coherencia de fechas (fecha_fin > fecha_inicio)
    const inicio = fecha_inicio ? new Date(fecha_inicio) : new Date();
    const fin = fecha_fin ? new Date(fecha_fin) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    if (fin <= inicio) {
      return res.status(400).json({ message: 'La fecha de finalización debe ser estrictamente posterior a la fecha de inicio.' });
    }

    const ficha = await prisma.curso.create({
      data: {
        id_programa: Number(id_programa),
        codigo: cleanCodigo,
        nombre: nombre.trim(),
        fecha_inicio: inicio,
        fecha_fin: fin,
        estado: 'ACTIVO'
      },
      include: { programa: true }
    });

    res.status(201).json({
      message: 'Ficha de caracterización aperturada exitosamente.',
      ficha
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al aperturar la ficha de caracterización', error: error.message });
  }
};

// =========================================================================
// HU-10: ASIGNACIÓN DE INSTRUCTORES A FICHAS FORMATIVAS
// =========================================================================

exports.asignarInstructorAFicha = async (req, res) => {
  try {
    const id_curso = Number(req.params.id_curso || req.body.id_curso);
    const { id_instructor, rol_docente } = req.body;

    if (!id_curso || !id_instructor) {
      return res.status(400).json({ message: 'La ficha y el instructor son requeridos.' });
    }

    // Validar si ya está asignado (evitar duplicados)
    const asignacionPrevia = await prisma.cursoInstructor.findUnique({
      where: {
        id_curso_id_instructor: {
          id_curso: Number(id_curso),
          id_instructor: Number(id_instructor)
        }
      }
    });

    if (asignacionPrevia) {
      return res.status(409).json({ message: 'El instructor ya se encuentra asignado a esta ficha formativa.' });
    }

    const asignacion = await prisma.cursoInstructor.create({
      data: {
        id_curso: Number(id_curso),
        id_instructor: Number(id_instructor),
        rol_docente: rol_docente || 'TITULAR'
      },
      include: {
        curso: true,
        instructor: { include: { usuario: true } }
      }
    });

    // Notificación interna
    await NotificationService.notifyUser(
      asignacion.instructor.id_usuario,
      'ASIGNACION_FICHA',
      `Ha sido asignado como docente ${rol_docente || 'TITULAR'} a la ficha ${asignacion.curso.codigo} (${asignacion.curso.nombre}).`,
      id_curso
    );

    res.status(201).json({
      message: 'Instructor vinculado exitosamente a la ficha formativa.',
      asignacion
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al vincular instructor a la ficha', error: error.message });
  }
};

// =========================================================================
// HU-11: MATRÍCULA FORMAL DE APRENDICES EN FICHAS
// =========================================================================

exports.matricularAprendizEnFicha = async (req, res) => {
  try {
    const id_curso = Number(req.params.id_curso || req.body.id_curso);
    const { id_aprendiz } = req.body;

    if (!id_curso || !id_aprendiz) {
      return res.status(400).json({ message: 'La ficha y el aprendiz son requeridos para la matrícula.' });
    }

    // Validar cupos máximos (límite institucional: 35 aprendices por ambiente SENA)
    const conteoActual = await prisma.inscripcion.count({
      where: { id_curso: Number(id_curso), estado: 'ACTIVO' }
    });

    const CUPO_MAXIMO = 35;
    if (conteoActual >= CUPO_MAXIMO) {
      return res.status(400).json({ message: `Cupo máximo de la ficha alcanzado (${CUPO_MAXIMO} aprendices).` });
    }

    // Validar matrícula duplicada
    const matriculaExistente = await prisma.inscripcion.findUnique({
      where: {
        id_aprendiz_id_curso: {
          id_aprendiz: Number(id_aprendiz),
          id_curso: Number(id_curso)
        }
      }
    });

    if (matriculaExistente) {
      return res.status(409).json({ message: 'El aprendiz ya se encuentra matriculado en esta ficha de formación.' });
    }

    const inscripcion = await prisma.inscripcion.create({
      data: {
        id_aprendiz: Number(id_aprendiz),
        id_curso: Number(id_curso),
        estado: 'ACTIVO',
        fecha_inscripcion: new Date()
      },
      include: {
        curso: true,
        aprendiz: { include: { usuario: true } }
      }
    });

    // Notificación al aprendiz
    await NotificationService.notifyUser(
      inscripcion.aprendiz.id_usuario,
      'MATRICULA_EXITOSA',
      `Ha sido matriculado exitosamente en la ficha ${inscripcion.curso.codigo} - ${inscripcion.curso.nombre}.`,
      id_curso
    );

    res.status(201).json({
      message: 'Aprendiz matriculado formalmente en la ficha formativa.',
      inscripcion
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al matricular aprendiz en la ficha', error: error.message });
  }
};
