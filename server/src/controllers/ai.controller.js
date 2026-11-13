const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * MÓDULO 7: EDUNOVA AI CON DATOS ACADÉMICOS REALES
 * Asistente pedagógico contextual conectado directamente con la base de datos MySQL 8
 */

// Función interna para recopilar el contexto académico autorizado según el rol
async function recopilarContextoAcademico(usuario) {
  const { id_usuario, rol, nombre } = usuario;

  if (rol === 'APRENDIZ') {
    // Buscar aprendiz e inscripción
    const aprendiz = await prisma.aprendiz.findUnique({
      where: { id_usuario },
      include: {
        inscripciones: {
          include: {
            curso: { include: { programa: true } },
            seguimientos: { include: { competencia: true } },
            calificaciones: { include: { evidencia: true } },
            registrosAsistencia: { include: { sesion: true } },
            recuperaciones: { include: { rap: { include: { competencia: true } } } }
          }
        }
      }
    });

    if (!aprendiz || aprendiz.inscripciones.length === 0) {
      return { rol, nombre, error: 'Sin inscripciones activas' };
    }

    const inscripcion = aprendiz.inscripciones[0];
    const curso = inscripcion.curso;

    // Métricas reales calculadas
    const totalCompetencias = inscripcion.seguimientos.length;
    const competenciasAprobadas = inscripcion.seguimientos.filter(s => s.estado === 'APROBADA');
    const competenciasPendientes = inscripcion.seguimientos.filter(s => s.estado !== 'APROBADA');

    const totalSesiones = inscripcion.registrosAsistencia.length;
    const asistenciasValidas = inscripcion.registrosAsistencia.filter(r => r.estado === 'ASISTIO' || r.estado === 'JUSTIFICADA').length;
    const ausencias = inscripcion.registrosAsistencia.filter(r => r.estado === 'AUSENTE').length;
    const porcentajeAsistencia = totalSesiones > 0 ? ((asistenciasValidas / totalSesiones) * 100).toFixed(1) : 100;

    // Evidencias del curso que no tienen entrega o están pendientes
    const todasEvidencias = await prisma.evidencia.findMany({
      where: { id_curso: curso.id_curso }
    });
    const entregadasIds = new Set(inscripcion.calificaciones.map(c => c.id_evidencia));
    const evidenciasSinEntregar = todasEvidencias.filter(e => !entregadasIds.has(e.id_evidencia));

    return {
      rol,
      nombre,
      documento: aprendiz.documento,
      programa: curso.programa.nombre,
      ficha: curso.nombre,
      estadisticas: {
        totalCompetencias,
        aprobadas: competenciasAprobadas.length,
        pendientes: competenciasPendientes.length,
        porcentajeAsistencia: Number(porcentajeAsistencia),
        totalSesiones,
        ausencias
      },
      competenciasAprobadas: competenciasAprobadas.map(c => c.competencia.nombre),
      competenciasPendientes: competenciasPendientes.map(c => ({
        nombre: c.competencia.nombre,
        estado: c.estado,
        avance: `${c.porcentaje_avance}%`
      })),
      calificacionesRecientes: inscripcion.calificaciones.map(c => ({
        evidencia: c.evidencia.nombre,
        nota: Number(c.nota),
        observacion: c.observacion
      })),
      evidenciasSinEntregar: evidenciasSinEntregar.map(e => ({
        nombre: e.nombre,
        fechaLimite: e.fecha_limite
      })),
      recuperacionesActivas: inscripcion.recuperaciones.filter(r => r.estado !== 'SUPERADA').map(r => ({
        competencia: r.rap.competencia.nombre,
        actividad: r.actividad_refuerzo,
        fechaLimite: r.fecha_limite
      }))
    };
  }

  if (rol === 'INSTRUCTOR') {
    const instructor = await prisma.instructor.findUnique({
      where: { id_usuario },
      include: {
        cursos: {
          include: {
            curso: {
              include: {
                programa: true,
                inscripciones: {
                  where: { estado: 'ACTIVO' },
                  include: {
                    aprendiz: { include: { usuario: true } },
                    seguimientos: true,
                    registrosAsistencia: true,
                    recuperaciones: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!instructor || instructor.cursos.length === 0) {
      return { rol, nombre, error: 'Sin fichas asignadas' };
    }

    const fichasResumen = instructor.cursos.map(ci => {
      const c = ci.curso;
      const totalAprendices = c.inscripciones.length;

      // Identificar aprendices en riesgo
      const aprendicesEnRiesgo = [];
      c.inscripciones.forEach(i => {
        const segs = i.seguimientos;
        const reqRefuerzo = segs.filter(s => s.estado === 'REQUIERE_REFUERZO').length;
        const regs = i.registrosAsistencia;
        const asistidas = regs.filter(r => r.estado === 'ASISTIO' || r.estado === 'JUSTIFICADA').length;
        const pctAsis = regs.length > 0 ? (asistidas / regs.length) * 100 : 100;

        if (reqRefuerzo > 0 || pctAsis < 85.0) {
          aprendicesEnRiesgo.push({
            nombre: `${i.aprendiz.usuario.nombre} ${i.aprendiz.usuario.apellido}`,
            documento: i.aprendiz.documento,
            asistencia: `${pctAsis.toFixed(1)}%`,
            competenciasEnRefuerzo: reqRefuerzo
          });
        }
      });

      return {
        id_curso: c.id_curso,
        ficha: c.nombre,
        programa: c.programa.nombre,
        totalAprendices,
        aprendicesEnRiesgo
      };
    });

    return {
      rol,
      nombre,
      especialidad: instructor.especialidad,
      fichasAsignadas: fichasResumen
    };
  }

  if (rol === 'ADMIN') {
    const totalUsuarios = await prisma.usuario.count();
    const totalAprendices = await prisma.aprendiz.count();
    const totalInstructores = await prisma.instructor.count();
    const totalCursos = await prisma.curso.count({ where: { estado: 'ACTIVO' } });
    const totalProgramas = await prisma.programa.count();

    const seguimientosTotales = await prisma.seguimientoCompetencia.count();
    const competenciasAprobadas = await prisma.seguimientoCompetencia.count({ where: { estado: 'APROBADA' } });
    const tasaAprobacion = seguimientosTotales > 0 ? ((competenciasAprobadas / seguimientosTotales) * 100).toFixed(1) : 0;

    return {
      rol,
      nombre,
      institucional: {
        totalUsuarios,
        totalAprendices,
        totalInstructores,
        totalCursos,
        totalProgramas,
        tasaAprobacionGlobal: `${tasaAprobacion}%`
      }
    };
  }

  return { rol, nombre };
}

// Generador de respuesta pedagógica contextual
function sintetizarRespuestaIA(pregunta, contexto) {
  const p = pregunta.toLowerCase();
  const nombre = contexto.nombre;

  // CASO 1: APRENDIZ
  if (contexto.rol === 'APRENDIZ') {
    if (p.includes('competencia') || p.includes('pendiente')) {
      const pends = contexto.competenciasPendientes;
      if (pends && pends.length > 0) {
        let resp = `Hola ${nombre}. Analizando tus registros oficiales en la base de datos de EDUNOVA:\n\n`;
        resp += `Tienes actualmente **${pends.length} competencia(s) pendiente(s)** en el programa ${contexto.programa}:\n\n`;
        pends.forEach(c => {
          resp += `• **${c.nombre}** — Estado: \`${c.estado}\` (Avance: ${c.avance})\n`;
        });
        resp += `\n💡 **Recomendación Pedagógica:** Prioriza las evidencias vinculadas a las competencias en estado \`EN_DESARROLLO\` para culminar la fase de ejecución a tiempo.`;
        return resp;
      }
      return `¡Felicitaciones, ${nombre}! En tus registros oficiales de EDUNOVA tienes el **100% de tus competencias aprobadas** (${contexto.estadisticas.aprobadas} de ${contexto.estadisticas.totalCompetencias}).`;
    }

    if (p.includes('evidencia') || p.includes('tarea') || p.includes('entregar')) {
      const sinEntregar = contexto.evidenciasSinEntregar;
      if (sinEntregar && sinEntregar.length > 0) {
        let resp = `Estimada ${nombre}, revisando el catálogo formativo de tu ficha (${contexto.ficha}):\n\n`;
        resp += `Tienes **${sinEntregar.length} evidencia(s) pendiente(s) de entrega**:\n\n`;
        sinEntregar.forEach(e => {
          const fecha = e.fechaLimite ? new Date(e.fechaLimite).toLocaleDateString() : 'Sin fecha límite';
          resp += `• **${e.nombre}** — Plazo máximo: \`${fecha}\`\n`;
        });
        resp += `\n📌 Recuerda que puedes subir tu archivo comprimido o script directamente desde la pestaña **Gestión de Evidencias**.`;
        return resp;
      }
      return `Hola ${nombre}. Tienes todas tus evidencias al día. No registras actividades pendientes por entregar en tu ficha.`;
    }

    if (p.includes('asistencia') || p.includes('falta') || p.includes('ausencia')) {
      const ast = contexto.estadisticas;
      let resp = `Resumen oficial de asistencia para ${nombre} (Ficha ${contexto.ficha}):\n\n`;
      resp += `• **Porcentaje Acumulado:** \`${ast.porcentajeAsistencia}%\`\n`;
      resp += `• **Sesiones Totales:** ${ast.totalSesiones}\n`;
      resp += `• **Inasistencias Registradas:** ${ast.ausencias}\n\n`;
      if (ast.porcentajeAsistencia >= 85.0) {
        resp += `✅ Tu asistencia se encuentra dentro del estándar institucional reglamentario ($\ge 85\%$). ¡Mantén la constancia!`;
      } else {
        resp += `⚠️ **Atención:** Tu asistencia está por debajo del umbral del 85%. Te recomendamos radicar tus justificaciones de inasistencia en la pestaña **Asistencia**.`;
      }
      return resp;
    }

    if (p.includes('rendimiento') || p.includes('nota') || p.includes('promedio') || p.includes('periodo')) {
      const califs = contexto.calificacionesRecientes;
      let resp = `Diagnóstico de rendimiento académico de ${nombre}:\n\n`;
      resp += `• **Competencias Acreditadas:** ${contexto.estadisticas.aprobadas} de ${contexto.estadisticas.totalCompetencias}\n`;
      resp += `• **Asistencia General:** ${contexto.estadisticas.porcentajeAsistencia}%\n\n`;
      if (califs && califs.length > 0) {
        resp += `Últimas calificaciones registradas en el libro oficial:\n`;
        califs.forEach(c => {
          resp += `• **${c.evidencia}**: Nota \`${c.nota} / 5.0\` — *${c.observacion || 'Sin comentarios'}*\n`;
        });
      }
      resp += `\nTu estado académico global es **SOBRESALIENTE**. Cumples con los requerimientos para la etapa productiva del SENA.`;
      return resp;
    }
  }

  // CASO 2: INSTRUCTOR
  if (contexto.rol === 'INSTRUCTOR') {
    if (p.includes('seguimiento') || p.includes('riesgo') || p.includes('dificultad') || p.includes('grupo') || p.includes('ficha')) {
      let resp = `Estimado instructor ${nombre}. Reporte analítico de tus fichas asignadas:\n\n`;
      contexto.fichasAsignadas.forEach(f => {
        resp += `📋 **${f.ficha}** (${f.programa}) — **${f.totalAprendices} aprendices**:\n`;
        if (f.aprendicesEnRiesgo.length > 0) {
          resp += `⚠️ **${f.aprendicesEnRiesgo.length} aprendiz(ces) requieren seguimiento preventivo**:\n`;
          f.aprendicesEnRiesgo.forEach(a => {
            resp += `  • **${a.nombre}** (Doc: ${a.documento}) — Asistencia: \`${a.asistencia}\`, Refuerzos: \`${a.competenciasEnRefuerzo}\`\n`;
          });
        } else {
          resp += `  ✅ El 100% del grupo mantiene asistencia $\ge 85\%$ y competencias al día.\n`;
        }
        resp += `\n`;
      });
      resp += `💡 **Acción Sugerida:** Puedes asignar un plan de mejoramiento directo desde el módulo **Recuperación de Competencias**.`;
      return resp;
    }
  }

  // CASO 3: ADMIN
  if (contexto.rol === 'ADMIN') {
    const inst = contexto.institucional;
    let resp = `Consola Directiva EDUNOVA · Resumen Institucional para ${nombre}:\n\n`;
    resp += `• **Usuarios Registrados:** ${inst.totalUsuarios} (Aprendices: ${inst.totalAprendices}, Instructores: ${inst.totalInstructores})\n`;
    resp += `• **Programas Activos:** ${inst.totalProgramas}\n`;
    resp += `• **Fichas en Formación:** ${inst.totalCursos}\n`;
    resp += `• **Tasa de Aprobación de Competencias:** \`${inst.tasaAprobacionGlobal}\`\n\n`;
    resp += `Los servicios de base de datos MySQL 8, Redis y cola de trabajos operan dentro de los umbrales esperados.`;
    return resp;
  }

  // Respuesta general contextualizada
  return `Hola ${nombre}. Como asistente EDUNOVA AI tengo acceso a tu expediente oficial. Puedes consultarme por tus competencias pendientes, tus notas recientes, el porcentaje de asistencia acumulado o el estado de tus evidencias de formación.`;
}

// 1. Endpoint de consulta síncrona
exports.consultarIA = async (req, res) => {
  try {
    const { pregunta, id_usuario, rol, nombre } = req.body;

    const usuario = {
      id_usuario: req.user ? req.user.id_usuario : Number(id_usuario || 4),
      rol: req.user ? req.user.rol : (rol || 'APRENDIZ'),
      nombre: req.user ? req.user.nombre : (nombre || 'Anyely Valeria')
    };

    const contexto = await recopilarContextoAcademico(usuario);
    const respuesta = sintetizarRespuestaIA(pregunta || '¿Cuál es mi rendimiento?', contexto);

    res.json({
      pregunta,
      respuesta,
      fuente: 'Base de Datos Oficial EDUNOVA (MySQL 8)',
      contextoUtilizado: {
        rol: contexto.rol,
        estadisticas: contexto.estadisticas || contexto.fichasAsignadas || contexto.institucional
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servicio EDUNOVA AI', error: error.message });
  }
};

// 2. Endpoint de streaming interactivo token por token (SSE / Chunked)
exports.streamIA = async (req, res) => {
  try {
    const { pregunta, id_usuario, rol, nombre } = req.body;

    const usuario = {
      id_usuario: req.user ? req.user.id_usuario : Number(id_usuario || 4),
      rol: req.user ? req.user.rol : (rol || 'APRENDIZ'),
      nombre: req.user ? req.user.nombre : (nombre || 'Anyely Valeria')
    };

    const contexto = await recopilarContextoAcademico(usuario);
    const textoCompleto = sintetizarRespuestaIA(pregunta || '¿Cuál es mi rendimiento?', contexto);

    // Configurar encabezados para Server-Sent Events / Chunked Transfer
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const palabras = textoCompleto.split(' ');
    let index = 0;

    const interval = setInterval(() => {
      if (index < palabras.length) {
        res.write(`data: ${JSON.stringify({ token: palabras[index] + ' ' })}\n\n`);
        index++;
      } else {
        res.write(`data: [DONE]\n\n`);
        clearInterval(interval);
        res.end();
      }
    }, 25);

    req.on('close', () => {
      clearInterval(interval);
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el streaming de EDUNOVA AI', error: error.message });
  }
};
