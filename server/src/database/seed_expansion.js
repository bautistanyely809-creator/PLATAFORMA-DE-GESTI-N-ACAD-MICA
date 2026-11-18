const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedExpansion() {
  console.log('🚀 Iniciando semillero de los 6 nuevos módulos para EDUNOVA...');

  // 1. Obtener usuarios clave
  const admin = await prisma.usuario.findFirst({ where: { rol: 'ADMIN' } });
  const instructor1 = await prisma.instructor.findFirst({
    include: { usuario: true }
  });
  const instructor2 = await prisma.instructor.findMany({
    include: { usuario: true }
  });
  const inst2 = instructor2[1] || instructor1;
  const aprendiz = await prisma.aprendiz.findFirst({
    include: { usuario: true, inscripciones: true }
  });
  const curso = await prisma.curso.findFirst({
    where: { nombre: { contains: '3413988' } }
  }) || await prisma.curso.findFirst();

  const inscripcion = aprendiz?.inscripciones?.[0];

  console.log(`- Admin ID: ${admin?.id_usuario}`);
  console.log(`- Instructor 1: ${instructor1?.usuario?.nombre} (ID: ${instructor1?.id_instructor})`);
  console.log(`- Aprendiz: ${aprendiz?.usuario?.nombre} (ID: ${aprendiz?.id_aprendiz})`);
  console.log(`- Curso: ${curso?.nombre} (ID: ${curso?.id_curso})`);

  // =========================================================================
  // MÓDULO 5: AMBIENTES Y PROGRAMACIÓN
  // =========================================================================
  console.log('🏢 Creando Ambientes de Formación...');
  const ambiente1 = await prisma.ambiente.upsert({
    where: { codigo: 'AMB-SISTEMAS-101' },
    update: {},
    create: {
      codigo: 'AMB-SISTEMAS-101',
      nombre: 'Laboratorio de Desarrollo de Software 101',
      descripcion: 'Ambiente dotado con 35 estaciones Core i7, monitores duales y fibra óptica.',
      ubicacion: 'Bloque Tecnológico - Piso 1',
      capacidad: 35,
      tipo: 'SISTEMAS',
      equipamiento: '35 Equipos i7 16GB, Servidor local Linux, Pantalla interactiva 75 pulgadas',
      estado: 'DISPONIBLE',
      observaciones: 'Mantenimiento preventivo programado para fines de mes.'
    }
  });

  const ambiente2 = await prisma.ambiente.upsert({
    where: { codigo: 'AMB-REDES-202' },
    update: {},
    create: {
      codigo: 'AMB-REDES-202',
      nombre: 'Taller de Redes & Infraestructura Cloud 202',
      descripcion: 'Racks de comunicaciones, switches Cisco capa 3 y patch panels.',
      ubicacion: 'Bloque B - Piso 2',
      capacidad: 30,
      tipo: 'LABORATORIO',
      equipamiento: 'Racks Cisco, herramientas de crimpado, analizadores de espectro',
      estado: 'DISPONIBLE'
    }
  });

  const ambiente3 = await prisma.ambiente.upsert({
    where: { codigo: 'AUD-CENTRAL' },
    update: {},
    create: {
      codigo: 'AUD-CENTRAL',
      nombre: 'Auditorio Institucional SENA Regional',
      descripcion: 'Auditorio para conferencias magistrales, grados y jornadas de inducción.',
      ubicacion: 'Edificio Administrativo - Piso 1',
      capacidad: 120,
      tipo: 'AUDITORIO',
      equipamiento: 'Sistema de audio envolvente, 2 proyectores láser 4K, microfonía inalámbrica',
      estado: 'DISPONIBLE'
    }
  });

  // Reservas de Ambientes
  const hoy = new Date();
  const fechaReserva1 = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
  const fechaReserva2 = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 3);

  await prisma.reservaAmbiente.deleteMany({ where: { id_ambiente: ambiente1.id_ambiente } });
  const reserva1 = await prisma.reservaAmbiente.create({
    data: {
      id_ambiente: ambiente1.id_ambiente,
      id_curso: curso?.id_curso,
      id_instructor: instructor1?.id_instructor,
      motivo: 'Sesión Práctica: Desarrollo de APIs REST con Express & Prisma ORM',
      fecha: fechaReserva1,
      hora_inicio: '07:00',
      hora_fin: '13:00',
      estado: 'CONFIRMADA',
      observaciones: 'Requiere acceso con privilegios de administrador para MySQL Workbench.'
    }
  });

  const reserva2 = await prisma.reservaAmbiente.create({
    data: {
      id_ambiente: ambiente2.id_ambiente,
      id_curso: curso?.id_curso,
      id_instructor: inst2?.id_instructor,
      motivo: 'Taller de Despliegue en Red Local & Pruebas de Carga',
      fecha: fechaReserva2,
      hora_inicio: '14:00',
      hora_fin: '18:00',
      estado: 'CONFIRMADA'
    }
  });

  // =========================================================================
  // MÓDULO 1: CALENDARIO ACADÉMICO
  // =========================================================================
  console.log('📅 Creando Eventos de Calendario...');
  await prisma.eventoCalendario.deleteMany({});
  
  await prisma.eventoCalendario.create({
    data: {
      titulo: 'Sesión Presencial: Arquitectura Limpia y Patrones en Node.js',
      descripcion: 'Revisión del patrón MVC y servicios desacoplados en el backend de EDUNOVA.',
      categoria: 'CLASE',
      fecha_inicio: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 7, 0, 0),
      fecha_fin: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 13, 0, 0),
      hora_inicio: '07:00',
      hora_fin: '13:00',
      ubicacion: 'Laboratorio 101 - Bloque Tecnológico',
      id_ambiente: ambiente1.id_ambiente,
      id_instructor: instructor1?.id_instructor,
      id_curso: curso?.id_curso,
      id_usuario_creador: instructor1?.usuario?.id_usuario || admin.id_usuario,
      estado: 'ACTIVO'
    }
  });

  await prisma.eventoCalendario.create({
    data: {
      titulo: 'Entrega Final: Documento Técnico SRS bajo estándar IEEE 830',
      descripcion: 'Fecha límite de subida del artefacto monolítico de requerimientos de software en el aula.',
      categoria: 'ENTREGA',
      fecha_inicio: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 2, 23, 59, 0),
      fecha_fin: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 2, 23, 59, 0),
      hora_inicio: '23:59',
      hora_fin: '23:59',
      ubicacion: 'Aula Virtual EDUNOVA',
      id_instructor: instructor1?.id_instructor,
      id_curso: curso?.id_curso,
      id_usuario_creador: instructor1?.usuario?.id_usuario || admin.id_usuario,
      estado: 'ACTIVO'
    }
  });

  await prisma.eventoCalendario.create({
    data: {
      titulo: 'Evaluación Técnica de Competencias: Algoritmia & Normalización 3FN',
      descripcion: 'Prueba práctica individual en ambiente controlado sobre consultas optimizadas en MySQL 8.',
      categoria: 'EVALUACION',
      fecha_inicio: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 4, 8, 0, 0),
      fecha_fin: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 4, 11, 0, 0),
      hora_inicio: '08:00',
      hora_fin: '11:00',
      ubicacion: 'Laboratorio 101',
      id_ambiente: ambiente1.id_ambiente,
      id_instructor: instructor1?.id_instructor,
      id_curso: curso?.id_curso,
      id_usuario_creador: instructor1?.usuario?.id_usuario || admin.id_usuario,
      estado: 'ACTIVO'
    }
  });

  await prisma.eventoCalendario.create({
    data: {
      titulo: 'Comité Institucional de Evaluación & Seguimiento Formativo',
      descripcion: 'Reunión de instructores titulares y coordinación para análisis de alertas tempranas.',
      categoria: 'INSTITUCIONAL',
      fecha_inicio: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 5, 14, 0, 0),
      fecha_fin: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 5, 17, 0, 0),
      hora_inicio: '14:00',
      hora_fin: '17:00',
      ubicacion: 'Auditorio Institucional SENA Regional',
      id_ambiente: ambiente3.id_ambiente,
      id_usuario_creador: admin.id_usuario,
      estado: 'ACTIVO'
    }
  });

  // =========================================================================
  // MÓDULO 4: AULA VIRTUAL (LMS INTEGRADO)
  // =========================================================================
  console.log('🎓 Creando Aula Virtual y Contenidos...');
  await prisma.entregaActividadAula.deleteMany({});
  await prisma.actividadAula.deleteMany({});
  await prisma.materialAula.deleteMany({});
  await prisma.unidadAula.deleteMany({});
  await prisma.aulaVirtual.deleteMany({});

  const aula = await prisma.aulaVirtual.create({
    data: {
      id_curso: curso?.id_curso,
      id_instructor: instructor1?.id_instructor,
      nombre: `Aula Virtual: Tecnólogo ADSO — Ficha 3413988`,
      descripcion: 'Espacio académico digital para el seguimiento, actividades guiadas y material de estudio del programa ADSO.',
      imagen_portada: '/assets/banner-adso.png',
      estado: 'ACTIVO',
      unidades: {
        create: [
          {
            titulo: 'Unidad 1: Fundamentos de Arquitectura de Software y Modelado UML',
            descripcion: 'Diagramas de casos de uso, especificación formal SRS y patrones arquitectónicos.',
            orden: 1,
            materiales: {
              create: [
                {
                  titulo: 'Guía de Aprendizaje 01: Especificación de Casos de Uso',
                  descripcion: 'Documento en PDF con la metodología y plantilla de casos de uso detallados.',
                  tipo: 'PDF',
                  url_recurso: 'https://edunova.edu.co/docs/guia-01-casos-de-uso.pdf',
                  peso_mb: 2.4
                },
                {
                  titulo: 'Repositorio Oficial de Plantillas UML (Diagrams & Mermaid)',
                  descripcion: 'Enlace a plantillas estándar para modelado en Mermaid.',
                  tipo: 'ENLACE',
                  url_recurso: 'https://github.com/mermaid-js/mermaid'
                }
              ]
            },
            actividades: {
              create: [
                {
                  titulo: 'Taller Práctico: Modelado de Casos de Uso del Proyecto Formativo',
                  descripcion: 'Construir la especificación paso a paso para el módulo de seguridad y autenticación.',
                  instrucciones: 'Subir un archivo PDF o Markdown con el diagrama y la descripción tabular completa.',
                  fecha_limite: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 5),
                  estado: 'PUBLICADA'
                }
              ]
            }
          },
          {
            titulo: 'Unidad 2: Construcción de Servicios Backend con Node.js, Express y MySQL 8',
            descripcion: 'Diseño de endpoints RESTful, middleware de autorización JWT y consultas con Prisma ORM.',
            orden: 2,
            materiales: {
              create: [
                {
                  titulo: 'Manual de Normalización de Bases de Datos hasta 3FN',
                  descripcion: 'Diapositivas y casos prácticos de diseño relacional eficiente.',
                  tipo: 'DOCUMENTO',
                  url_recurso: 'https://edunova.edu.co/docs/normalizacion-3fn.pdf',
                  peso_mb: 4.1
                }
              ]
            },
            actividades: {
              create: [
                {
                  titulo: 'Laboratorio de Código: Implementación de Endpoints con RBAC',
                  descripcion: 'Desarrollar controladores seguros que validen el token JWT y el rol del usuario.',
                  instrucciones: 'Empacar el código fuente en un archivo comprimido o enlace a commit de GitHub.',
                  fecha_limite: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 8),
                  estado: 'PUBLICADA'
                }
              ]
            }
          }
        ]
      }
    },
    include: {
      unidades: {
        include: {
          actividades: true
        }
      }
    }
  });

  // Crear una entrega de muestra para el aprendiz
  const actividad1 = aula.unidades[0]?.actividades[0];
  if (actividad1 && inscripcion) {
    await prisma.entregaActividadAula.create({
      data: {
        id_actividad: actividad1.id_actividad,
        id_inscripcion: inscripcion.id_inscripcion,
        archivo_url: 'https://edunova.edu.co/entregas/adso3413988_anyely_taller01.pdf',
        archivo_nombre: 'adso3413988_anyely_taller01.pdf',
        comentario: 'Profesor Carlos, adjunto el taller completo con los diagramas Mermaid revisados.',
        estado: 'APROBADA',
        calificacion: 4.8,
        retroalimentacion: 'Excelente trabajo. Especificación detallada conforme a la norma IEEE 830.',
        evaluador_nombre: instructor1?.usuario?.nombre + ' ' + instructor1?.usuario?.apellido,
        fecha_evaluacion: new Date()
      }
    });
  }

  // =========================================================================
  // MÓDULO 3: SISTEMA DE ALERTAS TEMPRANAS
  // =========================================================================
  console.log('⚠️ Creando Sistema de Alertas Tempranas...');
  await prisma.historialAlerta.deleteMany({});
  await prisma.alertaTemprana.deleteMany({});

  const alerta1 = await prisma.alertaTemprana.create({
    data: {
      tipo: 'EVIDENCIA_VENCIDA',
      titulo: 'Evidencia Técnica Pendiente de Calificación',
      descripcion: `La evidencia "Diseño de Arquitectura de Software" de la ficha 3413988 tiene entregas pendientes de evaluar por más de 72 horas.`,
      id_curso: curso?.id_curso,
      id_instructor_responsable: instructor1?.id_instructor,
      prioridad: 'MEDIA',
      estado: 'EN_SEGUIMIENTO',
      origen: 'AUTOMATICA',
      historial: {
        create: {
          estado_anterior: 'NUEVA',
          estado_nuevo: 'EN_SEGUIMIENTO',
          comentario: 'Alerta asignada al instructor titular Carlos Mendoza para revisión prioritaria.',
          id_usuario: admin.id_usuario
        }
      }
    }
  });

  const alerta2 = await prisma.alertaTemprana.create({
    data: {
      tipo: 'INASISTENCIA',
      titulo: 'Umbral de Asistencia Preventivo en Ficha 3413988',
      descripcion: 'Se detectaron 2 ausencias consecutivas no justificadas en sesiones presenciales del módulo.',
      id_aprendiz: aprendiz?.id_aprendiz,
      id_curso: curso?.id_curso,
      id_instructor_responsable: instructor1?.id_instructor,
      prioridad: 'ALTA',
      estado: 'NUEVA',
      origen: 'AUTOMATICA'
    }
  });

  const alerta3 = await prisma.alertaTemprana.create({
    data: {
      tipo: 'COMPETENCIA_SIN_AVANCE',
      titulo: 'Seguimiento Formativo: Resultado de Aprendizaje en Refuerzo',
      descripcion: 'Aprendiz con plan de mejoramiento activo en el RAP "Modelar las funciones del software".',
      id_aprendiz: aprendiz?.id_aprendiz,
      id_curso: curso?.id_curso,
      id_instructor_responsable: instructor1?.id_instructor,
      prioridad: 'MEDIA',
      estado: 'ATENDIDA',
      origen: 'MANUAL',
      fecha_atencion: new Date(),
      justificacion_cierre: 'Se acordó sesión de tutoría individual y entrega de evidencia complementaria.'
    }
  });

  // =========================================================================
  // MÓDULO 6: CENTRO DE SOLICITUDES INSTITUCIONALES
  // =========================================================================
  console.log('📑 Creando Centro de Solicitudes Institucionales...');
  await prisma.historialSolicitud.deleteMany({});
  await prisma.solicitudInstitucional.deleteMany({});

  const sol1 = await prisma.solicitudInstitucional.create({
    data: {
      radicado: 'SOL-2026-0001',
      id_usuario_solicitante: aprendiz?.usuario?.id_usuario || admin.id_usuario,
      id_usuario_responsable: instructor1?.usuario?.id_usuario,
      categoria: 'ACADEMICA',
      asunto: 'Solicitud de Revisión y Retroalimentación de Evidencia Técnica',
      descripcion: 'Solicito comedidamente una revisión complementaria sobre la retroalimentación de la Evidencia 02 de Normalización 3FN.',
      prioridad: 'MEDIA',
      estado: 'RESPONDIDA',
      respuesta: 'Estimada Anyely, se ha concertado una sesión de retroalimentación presencial en el Ambiente 101 para mañana a las 11:00 AM.',
      historial: {
        create: [
          {
            estado_anterior: 'RECIBIDA',
            estado_nuevo: 'ASIGNADA',
            id_usuario: admin.id_usuario,
            comentario: 'Radicado asignado al instructor líder Carlos Mendoza.'
          },
          {
            estado_anterior: 'ASIGNADA',
            estado_nuevo: 'RESPONDIDA',
            id_usuario: instructor1?.usuario?.id_usuario || admin.id_usuario,
            comentario: 'Respuesta emitida y notificación enviada al aprendiz.'
          }
        ]
      }
    }
  });

  const sol2 = await prisma.solicitudInstitucional.create({
    data: {
      radicado: 'SOL-2026-0002',
      id_usuario_solicitante: aprendiz?.usuario?.id_usuario || admin.id_usuario,
      id_usuario_responsable: admin.id_usuario,
      categoria: 'CERTIFICADO',
      asunto: 'Constancia de Matrícula y Horario Académico para Afiliación EPS',
      descripcion: 'Requiero constancia formal de estudio con intensidad horaria y código de ficha 3413988 para trámite de seguridad social.',
      prioridad: 'ALTA',
      estado: 'EN_PROCESO',
      historial: {
        create: {
          estado_anterior: 'RECIBIDA',
          estado_nuevo: 'EN_PROCESO',
          id_usuario: admin.id_usuario,
          comentario: 'En trámite de firma digital por Coordinación Académica.'
        }
      }
    }
  });

  const sol3 = await prisma.solicitudInstitucional.create({
    data: {
      radicado: 'SOL-2026-0003',
      id_usuario_solicitante: instructor1?.usuario?.id_usuario || admin.id_usuario,
      id_usuario_responsable: admin.id_usuario,
      categoria: 'ADMINISTRATIVA',
      asunto: 'Requerimiento de Mantenimiento y Actualización de Node.js en Ambiente 101',
      descripcion: 'Se solicita actualizar los entornos de desarrollo a Node.js 20 LTS en las 35 estaciones del laboratorio.',
      prioridad: 'BAJA',
      estado: 'RECIBIDA'
    }
  });

  // =========================================================================
  // MÓDULO 2: ACCIÓN DE ACOMPAÑAMIENTO (PERFIL 360°)
  // =========================================================================
  console.log('👤 Creando Acompañamiento Formativo para Perfil 360°...');
  await prisma.accionAcompanamiento.deleteMany({});
  if (aprendiz && instructor1) {
    await prisma.accionAcompanamiento.create({
      data: {
        id_aprendiz: aprendiz.id_aprendiz,
        id_instructor: instructor1.id_instructor,
        tipo_accion: 'TUTORIA',
        descripcion: 'Tutoría técnica sobre estructuración de esquemas relacionales y claves foráneas en MySQL 8.',
        compromiso: 'El aprendiz presentará el modelo entidad-relación normalizado en la siguiente sesión de taller.'
      }
    });
  }

  console.log('✅ Semillero de los 6 nuevos módulos completado con éxito.');
}

seedExpansion()
  .catch((e) => {
    console.error('❌ Error ejecutando semillero:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

