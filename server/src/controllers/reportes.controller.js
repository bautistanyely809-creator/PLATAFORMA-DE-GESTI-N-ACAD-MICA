const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Reporte consolidado individual para el aprendiz
exports.getReporteAprendiz = async (req, res) => {
  try {
    const { id_inscripcion } = req.params;

    const inscripcion = await prisma.inscripcion.findUnique({
      where: { id_inscripcion: Number(id_inscripcion) },
      include: {
        aprendiz: { include: { usuario: true } },
        curso: { include: { programa: true } },
        seguimientos: {
          include: { competencia: true }
        },
        calificaciones: {
          include: { evidencia: true }
        },
        registrosAsistencia: {
          include: { sesion: true }
        },
        recuperaciones: {
          include: { rap: { include: { competencia: true } } }
        }
      }
    });

    if (!inscripcion) {
      return res.status(404).json({ message: 'Inscripción no encontrada' });
    }

    // Cálculos
    const totalCompetencias = inscripcion.seguimientos.length;
    const competenciasAprobadas = inscripcion.seguimientos.filter(s => s.estado === 'APROBADA').length;
    const porcentajeCompetencias = totalCompetencias > 0 ? ((competenciasAprobadas / totalCompetencias) * 100).toFixed(1) : 0;

    const totalSesiones = inscripcion.registrosAsistencia.length;
    const asistenciasValidas = inscripcion.registrosAsistencia.filter(r => r.estado === 'ASISTIO' || r.estado === 'JUSTIFICADA').length;
    const porcentajeAsistencia = totalSesiones > 0 ? ((asistenciasValidas / totalSesiones) * 100).toFixed(1) : 100;

    res.json({
      encabezado: {
        institucion: 'SERVICIO NACIONAL DE APRENDIZAJE - SENA',
        centro: 'Centro de Formación Industrial - Regional Huila (Neiva)',
        sistema: 'EDUNOVA Academic Management System',
        fechaGeneracion: new Date().toISOString(),
        usuarioSolicitante: req.user ? `${req.user.nombre}` : 'Usuario Autorizado'
      },
      aprendiz: {
        nombre: `${inscripcion.aprendiz.usuario.nombre} ${inscripcion.aprendiz.usuario.apellido}`,
        documento: inscripcion.aprendiz.documento,
        correo: inscripcion.aprendiz.usuario.correo,
        programa: inscripcion.curso.programa.nombre,
        ficha: inscripcion.curso.nombre
      },
      resumen: {
        porcentajeCompetencias: Number(porcentajeCompetencias),
        competenciasAprobadas,
        totalCompetencias,
        porcentajeAsistencia: Number(porcentajeAsistencia),
        totalSesiones,
        recuperacionesActivas: inscripcion.recuperaciones.filter(r => r.estado !== 'SUPERADA').length
      },
      competencias: inscripcion.seguimientos.map(s => ({
        codigo: s.competencia.codigo,
        nombre: s.competencia.nombre,
        estado: s.estado,
        avance: `${s.porcentaje_avance}%`,
        observaciones: s.observaciones
      })),
      calificaciones: inscripcion.calificaciones.map(c => ({
        evidencia: c.evidencia.nombre,
        porcentaje: `${c.evidencia.porcentaje}%`,
        nota: Number(c.nota),
        estado: Number(c.nota) >= 3.5 ? 'APROBADO' : 'DEFICIENTE',
        observacion: c.observacion
      })),
      asistencias: inscripcion.registrosAsistencia.map(r => ({
        fecha: r.sesion.fecha,
        tema: r.sesion.tema,
        estado: r.estado,
        observacion: r.observacion
      })),
      recuperaciones: inscripcion.recuperaciones.map(rec => ({
        competencia: rec.rap.competencia.nombre,
        actividad: rec.actividad_refuerzo,
        fechaLimite: rec.fecha_limite,
        estado: rec.estado,
        nota: rec.calificacion ? Number(rec.calificacion) : null
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al generar reporte de aprendiz', error: error.message });
  }
};

// 2. Reporte consolidado de la Ficha para instructores y coordinadores
exports.getReporteFicha = async (req, res) => {
  try {
    const { id_curso } = req.params;

    const curso = await prisma.curso.findUnique({
      where: { id_curso: Number(id_curso) },
      include: {
        programa: true,
        instructores: { include: { instructor: { include: { usuario: true } } } },
        inscripciones: {
          where: { estado: 'ACTIVO' },
          include: {
            aprendiz: { include: { usuario: true } },
            seguimientos: true,
            calificaciones: true,
            registrosAsistencia: true,
            recuperaciones: true
          }
        }
      }
    });

    if (!curso) {
      return res.status(404).json({ message: 'Ficha no encontrada' });
    }

    const aprendices = curso.inscripciones.map(i => {
      const segs = i.seguimientos;
      const aprobadas = segs.filter(s => s.estado === 'APROBADA').length;
      const pctComp = segs.length > 0 ? ((aprobadas / segs.length) * 100).toFixed(1) : 0;

      const regs = i.registrosAsistencia;
      const asistidas = regs.filter(r => r.estado === 'ASISTIO' || r.estado === 'JUSTIFICADA').length;
      const pctAsis = regs.length > 0 ? ((asistidas / regs.length) * 100).toFixed(1) : 100;

      const recuperacionesPendientes = i.recuperaciones.filter(r => r.estado !== 'SUPERADA').length;

      return {
        id_inscripcion: i.id_inscripcion,
        documento: i.aprendiz.documento,
        nombre: `${i.aprendiz.usuario.nombre} ${i.aprendiz.usuario.apellido}`,
        correo: i.aprendiz.usuario.correo,
        porcentajeCompetencias: Number(pctComp),
        competenciasAprobadas: `${aprobadas}/${segs.length}`,
        porcentajeAsistencia: Number(pctAsis),
        recuperacionesPendientes,
        estadoGeneral: (Number(pctComp) >= 80 && Number(pctAsis) >= 85) ? 'SOBRESALIENTE' : 'EN_SEGUIMIENTO'
      };
    });

    res.json({
      encabezado: {
        institucion: 'SENA REGIONAL HUILA - CENTRO DE FORMACIÓN INDUSTRIAL',
        ficha: curso.nombre,
        programa: curso.programa.nombre,
        instructores: curso.instructores.map(ci => `${ci.instructor.usuario.nombre} ${ci.instructor.usuario.apellido}`),
        totalAprendices: aprendices.length,
        fechaGeneracion: new Date().toISOString()
      },
      aprendices
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al generar reporte de la ficha', error: error.message });
  }
};

// 3. Exportación oficial a Excel (formato CSV con BOM UTF-8 compatible con Excel)
exports.exportarExcel = async (req, res) => {
  try {
    const { id_curso } = req.query;
    const cursoId = id_curso ? Number(id_curso) : 1;

    const inscripciones = await prisma.inscripcion.findMany({
      where: { id_curso: cursoId, estado: 'ACTIVO' },
      include: {
        aprendiz: { include: { usuario: true } },
        curso: { include: { programa: true } },
        seguimientos: true,
        registrosAsistencia: true,
        calificaciones: true
      }
    });

    // Construcción de CSV
    let csv = '\uFEFF'; // BOM para que Excel en español respete tildes
    csv += 'REPORTE ACADEMICO OFICIAL SENA - EDUNOVA SYSTEM\n';
    csv += `Fecha de Generacion:;${new Date().toLocaleString()}\n`;
    csv += `Generado por:;${req.user ? req.user.nombre : 'Coordinacion Academica'}\n\n`;
    csv += 'Documento;Aprendiz;Correo;Competencias Aprobadas;% Avance Competencias;% Asistencia;Estado General\n';

    inscripciones.forEach(i => {
      const totalSeg = i.seguimientos.length;
      const aprobadas = i.seguimientos.filter(s => s.estado === 'APROBADA').length;
      const pctComp = totalSeg > 0 ? ((aprobadas / totalSeg) * 100).toFixed(1) : '0';

      const totalAsis = i.registrosAsistencia.length;
      const validas = i.registrosAsistencia.filter(r => r.estado === 'ASISTIO' || r.estado === 'JUSTIFICADA').length;
      const pctAsis = totalAsis > 0 ? ((validas / totalAsis) * 100).toFixed(1) : '100';

      const estado = (Number(pctComp) >= 80 && Number(pctAsis) >= 85) ? 'SOBRESALIENTE' : 'EN_SEGUIMIENTO';

      csv += `"${i.aprendiz.documento}";"${i.aprendiz.usuario.nombre} ${i.aprendiz.usuario.apellido}";"${i.aprendiz.usuario.correo}";"${aprobadas}/${totalSeg}";"${pctComp}%";"${pctAsis}%";"${estado}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="EDUNOVA_Reporte_Ficha_${cursoId}_${Date.now()}.csv"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Error al exportar reporte a Excel', error: error.message });
  }
};
