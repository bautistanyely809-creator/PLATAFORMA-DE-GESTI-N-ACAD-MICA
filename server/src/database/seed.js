const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando carga de datos reales para EDUNOVA Academic Management...');

  // Limpieza previa opcional o verificación
  const passwordHash = await bcrypt.hash('edunova2026', 10);

  // 1. USUARIOS
  console.log('👤 Creando usuarios...');
  
  // Admin
  const adminUser = await prisma.usuario.upsert({
    where: { correo: 'admin@edunova.edu.co' },
    update: {},
    create: {
      nombre: 'Administrador',
      apellido: 'General',
      correo: 'admin@edunova.edu.co',
      password_hash: passwordHash,
      rol: 'ADMIN',
      estado: 'ACTIVO'
    }
  });

  // Instructores
  const inst1User = await prisma.usuario.upsert({
    where: { correo: 'carlos.mendoza@edunova.edu.co' },
    update: {},
    create: {
      nombre: 'Carlos',
      apellido: 'Mendoza',
      correo: 'carlos.mendoza@edunova.edu.co',
      password_hash: passwordHash,
      rol: 'INSTRUCTOR',
      estado: 'ACTIVO'
    }
  });

  const inst2User = await prisma.usuario.upsert({
    where: { correo: 'laura.gomez@edunova.edu.co' },
    update: {},
    create: {
      nombre: 'Laura',
      apellido: 'Gómez',
      correo: 'laura.gomez@edunova.edu.co',
      password_hash: passwordHash,
      rol: 'INSTRUCTOR',
      estado: 'ACTIVO'
    }
  });

  // Aprendices
  const apren1User = await prisma.usuario.upsert({
    where: { correo: 'anyely.valeria@edunova.edu.co' },
    update: {},
    create: {
      nombre: 'Anyely',
      apellido: 'Valeria',
      correo: 'anyely.valeria@edunova.edu.co',
      password_hash: passwordHash,
      rol: 'APRENDIZ',
      estado: 'ACTIVO'
    }
  });

  const apren2User = await prisma.usuario.upsert({
    where: { correo: 'juan.perez@edunova.edu.co' },
    update: {},
    create: {
      nombre: 'Juan David',
      apellido: 'Pérez',
      correo: 'juan.perez@edunova.edu.co',
      password_hash: passwordHash,
      rol: 'APRENDIZ',
      estado: 'ACTIVO'
    }
  });

  // Perfiles de Instructores
  const inst1 = await prisma.instructor.upsert({
    where: { id_usuario: inst1User.id_usuario },
    update: {},
    create: {
      id_usuario: inst1User.id_usuario,
      especialidad: 'Frontend & Arquitectura de Software',
      telefono: '3105551234'
    }
  });

  const inst2 = await prisma.instructor.upsert({
    where: { id_usuario: inst2User.id_usuario },
    update: {},
    create: {
      id_usuario: inst2User.id_usuario,
      especialidad: 'Backend & Bases de Datos Relacionales',
      telefono: '3126667890'
    }
  });

  // Perfiles de Aprendices
  const apren1 = await prisma.aprendiz.upsert({
    where: { id_usuario: apren1User.id_usuario },
    update: {},
    create: {
      id_usuario: apren1User.id_usuario,
      documento: '1075321890',
      telefono: '3147894561'
    }
  });

  const apren2 = await prisma.aprendiz.upsert({
    where: { id_usuario: apren2User.id_usuario },
    update: {},
    create: {
      id_usuario: apren2User.id_usuario,
      documento: '1075987654',
      telefono: '3189012345'
    }
  });

  // 2. PROGRAMA DE FORMACIÓN
  console.log('📚 Creando programa institucional...');
  const programa = await prisma.programa.upsert({
    where: { codigo: 'ADSO-2874102' },
    update: {},
    create: {
      nombre: 'Tecnólogo en Análisis y Desarrollo de Software',
      codigo: 'ADSO-2874102',
      descripcion: 'Formación profesional integral en desarrollo full-stack, metodologías ágiles, bases de datos y arquitectura SaaS.',
      estado: 'ACTIVO'
    }
  });

  // 3. CURSO / FICHA
  console.log('🏛️ Creando cursos y fichas...');
  const curso = await prisma.curso.upsert({
    where: { id_curso: 1 },
    update: {},
    create: {
      id_programa: programa.id_programa,
      nombre: 'Ficha ADSO 2874102 - Jornada Diurna (Neiva)',
      descripcion: 'Ficha líder del Centro de Formación Industrial SENA Regional Huila. Énfasis en React, Node.js y MySQL.',
      fecha_inicio: new Date('2026-02-01'),
      fecha_fin: new Date('2026-11-30'),
      estado: 'ACTIVO'
    }
  });

  // Asignar instructores al curso
  await prisma.cursoInstructor.upsert({
    where: { uk_curso_instructor: { id_curso: curso.id_curso, id_instructor: inst1.id_instructor } },
    update: {},
    create: {
      id_curso: curso.id_curso,
      id_instructor: inst1.id_instructor
    }
  });

  await prisma.cursoInstructor.upsert({
    where: { uk_curso_instructor: { id_curso: curso.id_curso, id_instructor: inst2.id_instructor } },
    update: {},
    create: {
      id_curso: curso.id_curso,
      id_instructor: inst2.id_instructor
    }
  });

  // 4. INSCRIPCIONES (Matrículas)
  console.log('📝 Matriculando aprendices...');
  const inscripcion1 = await prisma.inscripcion.upsert({
    where: { uk_aprendiz_curso: { id_aprendiz: apren1.id_aprendiz, id_curso: curso.id_curso } },
    update: {},
    create: {
      id_aprendiz: apren1.id_aprendiz,
      id_curso: curso.id_curso,
      estado: 'ACTIVO'
    }
  });

  const inscripcion2 = await prisma.inscripcion.upsert({
    where: { uk_aprendiz_curso: { id_aprendiz: apren2.id_aprendiz, id_curso: curso.id_curso } },
    update: {},
    create: {
      id_aprendiz: apren2.id_aprendiz,
      id_curso: curso.id_curso,
      estado: 'ACTIVO'
    }
  });

  // 5. COMPETENCIAS Y RAPS (MÓDULO 1)
  console.log('🎯 Creando competencias y resultados de aprendizaje (RAP)...');
  const comp1 = await prisma.competencia.upsert({
    where: { codigo: 'COMP-220501096' },
    update: {},
    create: {
      id_programa: programa.id_programa,
      codigo: 'COMP-220501096',
      nombre: 'Desarrollar la solución de software de acuerdo con el diseño y metodologías de desarrollo',
      descripcion: 'Aplicar estándares de codificación limpia, control de versiones Git y arquitectura monolítica modular.',
      horas_duracion: 160
    }
  });

  const comp2 = await prisma.competencia.upsert({
    where: { codigo: 'COMP-220501095' },
    update: {},
    create: {
      id_programa: programa.id_programa,
      codigo: 'COMP-220501095',
      nombre: 'Construir la interfaz de usuario de acuerdo con las especificaciones del diseño',
      descripcion: 'Desarrollo de interfaces accesibles, responsivas e interactivas con React 18, Tailwind y Three.js.',
      horas_duracion: 120
    }
  });

  const comp3 = await prisma.competencia.upsert({
    where: { codigo: 'COMP-220501097' },
    update: {},
    create: {
      id_programa: programa.id_programa,
      codigo: 'COMP-220501097',
      nombre: 'Gestionar y administrar bases de datos relacionales cumpliendo estándares de seguridad',
      descripcion: 'Diseño entidad-relación en 3FN, transacciones ACID, optimización de índices y pools de conexiones MySQL.',
      horas_duracion: 140
    }
  });

  // RAPs
  const rap1 = await prisma.resultadoAprendizaje.upsert({
    where: { uk_competencia_rap: { id_competencia: comp1.id_competencia, codigo: 'RAP-01' } },
    update: {},
    create: {
      id_competencia: comp1.id_competencia,
      codigo: 'RAP-01',
      descripcion: 'Estructurar la arquitectura del software de acuerdo con las reglas de negocio y patrones de diseño.'
    }
  });

  const rap2 = await prisma.resultadoAprendizaje.upsert({
    where: { uk_competencia_rap: { id_competencia: comp2.id_competencia, codigo: 'RAP-02' } },
    update: {},
    create: {
      id_competencia: comp2.id_competencia,
      codigo: 'RAP-02',
      descripcion: 'Codificar componentes de interfaz interactivos consumiendo APIs RESTful y optimizando rendimiento.'
    }
  });

  const rap3 = await prisma.resultadoAprendizaje.upsert({
    where: { uk_competencia_rap: { id_competencia: comp3.id_competencia, codigo: 'RAP-03' } },
    update: {},
    create: {
      id_competencia: comp3.id_competencia,
      codigo: 'RAP-03',
      descripcion: 'Modelar e implementar bases de datos relacionales en MySQL con normalización en 3FN e integridad.'
    }
  });

  // Seguimiento de Competencias para Anyely Valeria (Inscripción 1)
  const seg1 = await prisma.seguimientoCompetencia.upsert({
    where: { uk_inscripcion_competencia: { id_inscripcion: inscripcion1.id_inscripcion, id_competencia: comp1.id_competencia } },
    update: {},
    create: {
      id_inscripcion: inscripcion1.id_inscripcion,
      id_competencia: comp1.id_competencia,
      id_instructor: inst1.id_instructor,
      estado: 'APROBADA',
      porcentaje_avance: 100.00,
      fecha_evaluacion: new Date('2026-03-20'),
      observaciones: 'Cumplimiento sobresaliente en la estructuración de arquitectura modular y patrones de diseño.'
    }
  });

  const seg2 = await prisma.seguimientoCompetencia.upsert({
    where: { uk_inscripcion_competencia: { id_inscripcion: inscripcion1.id_inscripcion, id_competencia: comp2.id_competencia } },
    update: {},
    create: {
      id_inscripcion: inscripcion1.id_inscripcion,
      id_competencia: comp2.id_competencia,
      id_instructor: inst1.id_instructor,
      estado: 'APROBADA',
      porcentaje_avance: 95.00,
      fecha_evaluacion: new Date('2026-03-28'),
      observaciones: 'Excelente maquetación con sistema de diseño Factory y núcleo 3D interactivo Three.js.'
    }
  });

  const seg3 = await prisma.seguimientoCompetencia.upsert({
    where: { uk_inscripcion_competencia: { id_inscripcion: inscripcion1.id_inscripcion, id_competencia: comp3.id_competencia } },
    update: {},
    create: {
      id_inscripcion: inscripcion1.id_inscripcion,
      id_competencia: comp3.id_competencia,
      id_instructor: inst2.id_instructor,
      estado: 'EN_DESARROLLO',
      porcentaje_avance: 80.00,
      observaciones: 'En proceso de entrega de evidencias de transacciones y pools de conexión.'
    }
  });

  // Seguimiento de Juan David (Inscripción 2 - con competencia que requiere refuerzo para módulo 3)
  const segJuan1 = await prisma.seguimientoCompetencia.upsert({
    where: { uk_inscripcion_competencia: { id_inscripcion: inscripcion2.id_inscripcion, id_competencia: comp3.id_competencia } },
    update: {},
    create: {
      id_inscripcion: inscripcion2.id_inscripcion,
      id_competencia: comp3.id_competencia,
      id_instructor: inst2.id_instructor,
      estado: 'REQUIERE_REFUERZO',
      porcentaje_avance: 45.00,
      observaciones: 'Presenta deficiencias en normalización de 3FN y consultas con índices compuestos.'
    }
  });

  // Historial de Seguimiento
  await prisma.historialSeguimiento.createMany({
    data: [
      {
        id_seguimiento: seg1.id_seguimiento,
        estado_anterior: 'EN_EVALUACION',
        estado_nuevo: 'APROBADA',
        motivo: 'Evaluación exitosa de todas las evidencias formativas de arquitectura.',
        usuario_responsable: 'Carlos Mendoza'
      },
      {
        id_seguimiento: segJuan1.id_seguimiento,
        estado_anterior: 'EN_DESARROLLO',
        estado_nuevo: 'REQUIERE_REFUERZO',
        motivo: 'Puntaje de evidencia inferior a 3.5. Requiere plan de mejoramiento académico.',
        usuario_responsable: 'Laura Gómez'
      }
    ]
  });

  // 6. EVIDENCIAS Y ENTREGAS VERSIONADAS (MÓDULO 2)
  console.log('📂 Creando evidencias y entregas con versionamiento...');
  const ev1 = await prisma.evidencia.upsert({
    where: { id_evidencia: 1 },
    update: {},
    create: {
      id_curso: curso.id_curso,
      id_rap: rap2.id_rap,
      nombre: 'Prototipo UI en Figma y Factory Design Tokens',
      descripcion: 'Diseño de interfaces SaaS con tokens de color, Geist typography y radio de 3px.',
      instrucciones: 'Adjuntar enlace al prototipo de Figma y archivo comprimido con los componentes React maquetados.',
      porcentaje: 30.00,
      fecha_limite: new Date('2026-04-15'),
      estado: 'PUBLICADA'
    }
  });

  const ev2 = await prisma.evidencia.upsert({
    where: { id_evidencia: 2 },
    update: {},
    create: {
      id_curso: curso.id_curso,
      id_rap: rap3.id_rap,
      nombre: 'Modelo Entidad-Relación y Script MySQL Normalizado',
      descripcion: 'Diseño relacional en 3FN con 22 tablas, índices y restricciones de integridad.',
      instrucciones: 'Entregar script SQL ejecutable (.sql) o esquema Prisma con migraciones exitosas.',
      porcentaje: 35.00,
      fecha_limite: new Date('2026-04-20'),
      estado: 'PUBLICADA'
    }
  });

  const ev3 = await prisma.evidencia.upsert({
    where: { id_evidencia: 3 },
    update: {},
    create: {
      id_curso: curso.id_curso,
      id_rap: rap1.id_rap,
      nombre: 'Consumo REST con Axios, JWT & Streaming IA',
      descripcion: 'Integración completa frontend-backend con autenticación de 3 roles y respuestas en streaming.',
      instrucciones: 'Subir repositorio de GitHub con commits organizados y documentación de endpoints en el SRS.',
      porcentaje: 35.00,
      fecha_limite: new Date('2026-04-30'),
      estado: 'PUBLICADA'
    }
  });

  // Entregas versionadas para Anyely Valeria
  await prisma.entregaEvidencia.createMany({
    data: [
      {
        id_evidencia: ev1.id_evidencia,
        id_inscripcion: inscripcion1.id_inscripcion,
        version: 1,
        archivo_nombre: 'Evidencia1_UI_Factory_v1.zip',
        archivo_url: '/uploads/evidencias/anyely_evidencia1_v1.zip',
        comentario_aprendiz: 'Primera entrega del prototipo con componentes Factory y Three.js.',
        estado: 'APROBADA',
        calificacion: 4.80,
        retroalimentacion: 'Excelente trabajo. Implementación rigurosa de los tokens de diseño y 3D animable.',
        evaluador_nombre: 'Carlos Mendoza',
        fecha_evaluacion: new Date('2026-04-10')
      },
      {
        id_evidencia: ev2.id_evidencia,
        id_inscripcion: inscripcion1.id_inscripcion,
        version: 1,
        archivo_nombre: 'Evidencia2_Modelo_MySQL_v1.sql',
        archivo_url: '/uploads/evidencias/anyely_evidencia2_v1.sql',
        comentario_aprendiz: 'Script con normalización 3FN, índices compuestos y pool de conexiones.',
        estado: 'APROBADA',
        calificacion: 4.70,
        retroalimentacion: 'Estructura relacional correcta y validada en MySQL 8.',
        evaluador_nombre: 'Laura Gómez',
        fecha_evaluacion: new Date('2026-04-12')
      }
    ]
  });

  // Calificaciones históricas
  await prisma.calificacion.upsert({
    where: { uk_inscripcion_evidencia: { id_inscripcion: inscripcion1.id_inscripcion, id_evidencia: ev1.id_evidencia } },
    update: {},
    create: {
      id_inscripcion: inscripcion1.id_inscripcion,
      id_evidencia: ev1.id_evidencia,
      nota: 4.80,
      observacion: 'Aprobado sobresaliente en UI Factory.'
    }
  });

  await prisma.calificacion.upsert({
    where: { uk_inscripcion_evidencia: { id_inscripcion: inscripcion1.id_inscripcion, id_evidencia: ev2.id_evidencia } },
    update: {},
    create: {
      id_inscripcion: inscripcion1.id_inscripcion,
      id_evidencia: ev2.id_evidencia,
      nota: 4.70,
      observacion: 'Aprobado sobresaliente en Base de Datos MySQL.'
    }
  });

  // 7. SISTEMA DE RECUPERACIÓN (MÓDULO 3)
  console.log('🔄 Creando proceso de recuperación académica...');
  await prisma.recuperacion.create({
    data: {
      id_inscripcion: inscripcion2.id_inscripcion,
      id_rap: rap3.id_rap,
      id_instructor: inst2.id_instructor,
      actividad_refuerzo: 'Plan de mejoramiento: Resolver taller práctico de normalización a 3FN y creación de consultas con agregaciones SQL.',
      fecha_inicio: new Date('2026-04-05'),
      fecha_limite: new Date('2026-04-20'),
      estado: 'ASIGNADA',
      observacion: 'El aprendiz debe sustentar oralmente los cambios realizados en el modelo relacional.'
    }
  });

  // 8. CONTROL DE ASISTENCIA AUTOMATIZADO (MÓDULO 4)
  console.log('⏱️ Creando sesiones de formación y registros biométricos de asistencia...');
  const sesion1 = await prisma.sesionClase.create({
    data: {
      id_curso: curso.id_curso,
      id_instructor: inst1.id_instructor,
      fecha: new Date('2026-04-01'),
      hora_inicio: '07:00',
      hora_fin: '13:00',
      tema: 'Arquitectura Frontend con React 18, Vite y Three.js'
    }
  });

  const sesion2 = await prisma.sesionClase.create({
    data: {
      id_curso: curso.id_curso,
      id_instructor: inst2.id_instructor,
      fecha: new Date('2026-04-02'),
      hora_inicio: '07:00',
      hora_fin: '13:00',
      tema: 'Modelado Relacional y Prisma ORM con MySQL'
    }
  });

  const sesion3 = await prisma.sesionClase.create({
    data: {
      id_curso: curso.id_curso,
      id_instructor: inst1.id_instructor,
      fecha: new Date('2026-04-03'),
      hora_inicio: '07:00',
      hora_fin: '13:00',
      tema: 'Optimización de APIs: Debounce, Paginación y Caching'
    }
  });

  // Registros de asistencia
  await prisma.registroAsistencia.createMany({
    data: [
      {
        id_sesion: sesion1.id_sesion,
        id_inscripcion: inscripcion1.id_inscripcion,
        estado: 'ASISTIO',
        observacion: 'Puntualidad y participación activa.'
      },
      {
        id_sesion: sesion1.id_sesion,
        id_inscripcion: inscripcion2.id_inscripcion,
        estado: 'ASISTIO',
        observacion: 'Presente.'
      },
      {
        id_sesion: sesion2.id_sesion,
        id_inscripcion: inscripcion1.id_inscripcion,
        estado: 'ASISTIO',
        observacion: 'Presente.'
      },
      {
        id_sesion: sesion2.id_sesion,
        id_inscripcion: inscripcion2.id_inscripcion,
        estado: 'RETARDO',
        observacion: 'Ingreso a las 07:25 AM.'
      },
      {
        id_sesion: sesion3.id_sesion,
        id_inscripcion: inscripcion1.id_inscripcion,
        estado: 'ASISTIO',
        observacion: 'Presente.'
      },
      {
        id_sesion: sesion3.id_sesion,
        id_inscripcion: inscripcion2.id_inscripcion,
        estado: 'AUSENTE',
        observacion: 'Inasistencia sin previo aviso.'
      }
    ]
  });

  // 9. CENTRO DE NOTIFICACIONES (MÓDULO 6)
  console.log('🔔 Creando notificaciones automáticas conectadas a eventos...');
  await prisma.notificacion.createMany({
    data: [
      {
        id_usuario: apren1User.id_usuario,
        titulo: '¡Evidencia Evaluada!',
        mensaje: 'Tu entrega de "Prototipo UI en Figma" ha sido aprobada con nota 4.8 / 5.0 por Carlos Mendoza.',
        categoria: 'CALIFICACION',
        leida: false,
        enlace: '/dashboard?tab=evidencias'
      },
      {
        id_usuario: apren1User.id_usuario,
        titulo: 'Competencia Acreditada',
        mensaje: 'Has alcanzado el 100% de cumplimiento en la competencia COMP-220501096.',
        categoria: 'COMPETENCIA',
        leida: false,
        enlace: '/dashboard?tab=competencias'
      },
      {
        id_usuario: apren2User.id_usuario,
        titulo: 'Plan de Recuperación Asignado',
        mensaje: 'La instructora Laura Gómez ha asignado la actividad de refuerzo para RAP-03.',
        categoria: 'RECUPERACION',
        leida: false,
        enlace: '/dashboard?tab=recuperaciones'
      },
      {
        id_usuario: inst1User.id_usuario,
        titulo: 'Nueva Evidencia Entregada',
        mensaje: 'La aprendiz Anyely Valeria ha radicado la versión 1 de "Modelo Entidad-Relación y Script MySQL".',
        categoria: 'EVIDENCIA',
        leida: false,
        enlace: '/dashboard?tab=evidencias'
      },
      {
        id_usuario: adminUser.id_usuario,
        titulo: 'Alerta Académica: Asistencia en Seguimiento',
        mensaje: 'La ficha ADSO 2874102 registra 1 aprendiz con asistencia inferior al umbral del 85%.',
        categoria: 'ALERTA',
        leida: false,
        enlace: '/dashboard?tab=asistencia'
      }
    ]
  });

  // 10. AUDITORÍA GENERAL
  console.log('🛡️ Registrando auditoría inicial...');
  await prisma.historialAuditoria.create({
    data: {
      id_usuario: adminUser.id_usuario,
      accion: 'INICIALIZACION_SISTEMA_7_MODULOS',
      modulo: 'CORE_ACADEMICO',
      detalle: 'Inicialización completa de los 7 módulos funcionales de EDUNOVA con persistencia en MySQL 8.',
      ip_address: '127.0.0.1'
    }
  });

  console.log('✅ Base de datos real de EDUNOVA poblada exitosamente con datos del SENA ADSO.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
