const fs = require('fs');
const path = require('path');

const userStoriesMarkdown = `## 7.2 Catálogo Formal de Historias de Usuario (HU-01 a HU-26)

Las Historias de Usuario representan los requerimientos funcionales y de interacción formulados desde la perspectiva de los diferentes actores del ecosistema institucional de **EDUNOVA** (Administradores, Instructores, Aprendices y Agentes Automatizados del Sistema). Cada historia de usuario está articulada bajo el formato ágil estándar (*"Como [rol], quiero [acción], para [beneficio]"*) y validada mediante criterios de aceptación estructurados en lenguaje **Gherkin** (*Given-When-Then* / *Dado-Cuando-Entonces*), garantizando su verificación en las etapas de control de calidad (QA).

| Código | Rol / Actor | Enunciado de la Historia de Usuario | Criterios de Aceptación (Given-When-Then) | Requisito Funcional | Caso de Uso Vinculado |
| :---: | :---: | :--- | :--- | :---: | :---: |
| **HU-01** | Todos | Como usuario, quiero iniciar sesión con mi correo institucional y contraseña, para acceder a mi dashboard según mi rol. | **Dado** un usuario registrado y activo, **cuando** ingresa credenciales válidas, **entonces** el sistema genera un token JWT firmado y redirige a la vista principal correspondiente. | **RF-001** | [CU-001](#caso-de-uso-cu-001-autenticación-de-usuario-en-la-plataforma) |
| **HU-02** | Aprendiz | Como aprendiz nuevo, quiero registrar mi cuenta en la plataforma con mis datos personales, para integrarme a los cursos de formación. | **Dados** datos personales válidos y un correo no registrado, **cuando** el aprendiz envía el formulario de registro, **entonces** se crea su usuario con rol \`APRENDIZ\` y registro en la tabla \`APRENDIZ\`. | **RF-001** | [CU-001](#caso-de-uso-cu-001-autenticación-de-usuario-en-la-plataforma) |
| **HU-03** | Todos | Como usuario, quiero recuperar el acceso a mi cuenta si olvido mi clave, para restablecer mi contraseña mediante un método seguro. | **Dado** un correo institucional válido, **cuando** el usuario solicita recuperación, **entonces** se genera un token temporal de restablecimiento seguro. | **RF-003** | [CU-001](#caso-de-uso-cu-001-autenticación-de-usuario-en-la-plataforma) |
| **HU-04** | Todos | Como usuario, quiero consultar y actualizar mis datos de perfil y teléfono de contacto, para mantener mi información institucional al día. | **Dado** un usuario con sesión iniciada, **cuando** modifica su teléfono y confirma, **entonces** se actualiza de inmediato el registro en la base de datos con notificación de confirmación. | **RF-004** | [CU-004](#caso-de-uso-cu-004-actualización-de-datos-de-perfil-del-usuario) |
| **HU-05** | Todos | Como usuario, quiero cerrar mi sesión de forma explícita y segura, para evitar accesos no autorizados en terminales compartidas. | **Dado** un usuario con sesión activa, **cuando** pulsa el botón 'Cerrar Sesión', **entonces** se destruye el token en memoria/almacenamiento local y se redirige a la pantalla de login. | **RF-002** | [CU-002](#caso-de-uso-cu-002-cierre-de-sesión-y-destrucción-de-token-jwt) |
| **HU-06** | Administrador | Como administrador, quiero crear cuentas institucionales para instructores y aprendices, para habilitar su acceso a la plataforma. | **Dado** un administrador autenticado, **cuando** diligencia el formulario de nuevo usuario con rol asignado, **entonces** el sistema cifra la contraseña en Bcrypt y persiste la cuenta. | **RF-005** | [CU-005](#caso-de-uso-cu-005-creación-y-mantenimiento-de-usuarios-institucionales) |
| **HU-07** | Administrador | Como administrador, quiero activar o suspender el acceso de usuarios al sistema, para gestionar la permanencia institucional. | **Dado** un usuario seleccionado, **cuando** el administrador conmuta su estado a \`INACTIVO\`, **entonces** el sistema deniega peticiones posteriores con error HTTP 403. | **RF-005** | [CU-005](#caso-de-uso-cu-005-creación-y-mantenimiento-de-usuarios-institucionales) |
| **HU-08** | Administrador | Como administrador, quiero registrar programas de formación técnica y tecnológica con sus códigos oficiales, para estructurar la oferta académica. | **Dado** un diseño curricular avalado por el SENA, **cuando** el administrador registra código, nombre y versión, **entonces** se crea la entidad en la tabla \`PROGRAMA\`. | **RF-006** | [CU-006](#caso-de-uso-cu-006-administración-de-programas-de-formación) |
| **HU-09** | Administrador | Como administrador, quiero aperturar fichas de caracterización vinculadas a programas formativos, para gestionar cohortes académicas. | **Dado** un programa formativo activo, **cuando** el administrador asigna código numérico (ej. 3413988) y fechas de inicio/fin, **entonces** se genera la ficha con estado \`ACTIVO\`. | **RF-007** | [CU-007](#caso-de-uso-cu-007-apertura-y-gestión-de-fichas-de-caracterización) |
| **HU-10** | Administrador | Como administrador, quiero asignar instructores técnicos y transversales a fichas formativas, para delegar la gestión pedagógica. | **Dada** una ficha activa y un instructor disponible, **cuando** se formaliza la vinculación, **entonces** se registra la relación en \`CURSO_INSTRUCTOR\` y se notifican las partes. | **RF-008** | [CU-008](#caso-de-uso-cu-008-asignación-de-instructores-a-fichas-de-formación) |
| **HU-11** | Administrador | Como administrador, quiero matricular aprendices en fichas de caracterización específicas, para habilitar su seguimiento curricular. | **Dado** un aprendiz registrado y una ficha con cupos, **cuando** se procesa la matrícula, **entonces** se crea el registro en \`INSCRIPCION\` validando que no existan duplicados. | **RF-009** | [CU-009](#caso-de-uso-cu-009-matrícula-formal-de-aprendices-en-fichas) |
| **HU-12** | Instructor | Como instructor, quiero consultar el catálogo de competencias laborales y Resultados de Aprendizaje (RAPs) del programa, para planear mi ruta de formación. | **Dado** un instructor con fichas asignadas, **cuando** ingresa al módulo de competencias, **entonces** el sistema lista la totalidad de normas de competencia y sus RAPs asociados. | **RF-011** | [CU-011](#caso-de-uso-cu-011-consulta-de-competencias-laborales-y-raps-por-programa) |
| **HU-13** | Instructor | Como instructor, quiero evaluar el progreso de competencias de mis aprendices con juicio formativo (\`APROBADO\` o \`NO_APROBADO\`), para registrar su avance oficial. | **Dado** un aprendiz matriculado, **cuando** el instructor emite la evaluación con observación pedagógica, **entonces** se actualiza \`SEGUIMIENTO_COMPETENCIA\` y se audita en \`HISTORIAL_COMPETENCIA\`. | **RF-014** | [CU-014](#caso-de-uso-cu-014-evaluación-de-competencias-y-asentamiento-de-juicio-formativo) |
| **HU-14** | Aprendiz | Como aprendiz, quiero consultar el avance porcentual de mis competencias y juicios emitidos, para conocer mi estado formativo en tiempo real. | **Dado** un aprendiz logueado en la ficha 3413988, **cuando** navega a la sección de competencias, **entonces** visualiza la barra de progreso general y el semáforo de estado de cada RAP. | **RF-012** | [CU-012](#caso-de-uso-cu-012-consulta-del-avance-académico-individual-del-aprendiz) |
| **HU-15** | Instructor | Como instructor, quiero publicar evidencias formativas con fecha límite, ponderación y criterios de entrega, para evaluar el desempeño práctico. | **Dada** una ficha formativa, **cuando** el instructor crea la evidencia asociada a un RAP, **entonces** se registra en \`EVIDENCIA\` y se envía notificación masiva a los aprendices matriculados. | **RF-015** | [CU-015](#caso-de-uso-cu-015-publicación-de-evidencias-de-aprendizaje-por-el-instructor) |
| **HU-16** | Aprendiz | Como aprendiz, quiero subir entregas de evidencias con versionamiento automático (\`v1\`, \`v2\`...), para remitir correcciones sin perder el historial. | **Dada** una evidencia publicada, **cuando** el aprendiz adjunta su archivo o enlace, **entonces** se almacena en \`ENTREGA_EVIDENCIA\` incrementando el número de versión y sellando la fecha de entrega. | **RF-017** | [CU-017](#caso-de-uso-cu-017-radicación-de-entrega-de-evidencia-con-versionamiento-progresivo) |
| **HU-17** | Instructor | Como instructor, quiero calificar entregas de evidencias en escala de 0.0 a 5.0 con retroalimentación cualitativa, para orientar la mejora continua del aprendiz. | **Dada** una entrega de evidencia radicada, **cuando** el instructor asienta la calificación y observaciones, **entonces** se registra en \`CALIFICACION\` y se alerta de inmediato al aprendiz. | **RF-018** | [CU-018](#caso-de-uso-cu-018-calificación-y-retroalimentación-pedagógica-de-entregas) |
| **HU-18** | Instructor | Como instructor, quiero identificar aprendices con competencias en estado "Requiere Refuerzo", para focalizar actividades de nivelación oportunas. | **Dado** el módulo de recuperaciones, **cuando** el instructor filtra por la ficha 3413988, **entonces** el sistema lista a los aprendices con RAPs pendientes o juicios no alcanzados. | **RF-019** | [CU-019](#caso-de-uso-cu-019-identificación-de-aprendices-en-refuerzo-académico) |
| **HU-19** | Instructor | Como instructor, quiero asignar un plan de mejoramiento con actividad de refuerzo y fecha estricta, para brindar la oportunidad de nivelación al aprendiz. | **Dado** un aprendiz en refuerzo, **cuando** el instructor define la actividad y el plazo, **entonces** se crea el registro en \`RECUPERACION\` con estado \`ASIGNADA\`. | **RF-020** | [CU-020](#caso-de-uso-cu-020-asignación-de-plan-de-recuperación-académica) |
| **HU-20** | Instructor | Como instructor, quiero que al dictaminar favorablemente un plan de mejoramiento se acredite automáticamente la competencia, para agilizar el cierre evaluativo. | **Dado** un plan de refuerzo completado y calificado con nota $\\ge 3.5$, **cuando** se emite el dictamen, **entonces** el sistema actualiza la competencia vinculada a estado \`APROBADA\`. | **RF-022** | [CU-022](#caso-de-uso-cu-022-evaluación-de-refuerzo-y-auto-acreditación-de-la-competencia) |
| **HU-21** | Instructor | Como instructor, quiero crear sesiones de formación y tomar asistencia en vivo con discriminación de estados, para controlar la presencialidad. | **Dada** una sesión programada, **cuando** el instructor asienta la planilla marcando asistió, ausencia o retardo, **entonces** se insertan los registros en \`REGISTRO_ASISTENCIA\`. | **RF-024** | [CU-024](#caso-de-uso-cu-024-registro-de-asistencia-por-sesión-de-formación) |
| **HU-22** | Aprendiz | Como aprendiz, quiero justificar inasistencias adjuntando soportes válidos (incapacidades médicas), para evitar sanciones institucionales. | **Dada** una inasistencia registrada, **cuando** el aprendiz remite el motivo y soporte documental, **entonces** se crea la solicitud con estado \`PENDIENTE\` para revisión del instructor. | **RF-025** | [CU-025](#caso-de-uso-cu-025-radicación-y-resolución-de-justificaciones-de-inasistencia) |
| **HU-23** | Sistema | Como sistema automatizado, quiero disparar alertas tempranas si un aprendiz supera 3 faltas consecutivas o su asistencia cae por debajo del 85%, para prevenir la deserción. | **Tras** guardar una planilla de asistencia, **cuando** el motor detecta que un aprendiz cruza el umbral crítico, **entonces** genera una \`ALERTA_TEMPRANA\` y notifica a coordinación. | **RF-026** | [CU-026](#caso-de-uso-cu-026-monitoreo-y-disparo-de-alertas-de-asistencia--85) |
| **HU-24** | Inst/Admin | Como instructor o directivo, quiero generar el expediente académico individual del aprendiz y el dossier consolidado de ficha, para sustentar comités de evaluación. | **Dado** un aprendiz o ficha seleccionada, **cuando** se solicita el informe, **entonces** el sistema consolida asistencias, competencias y notas en un documento con membrete oficial SENA. | **RF-027** | [CU-027](#caso-de-uso-cu-027-generación-de-expediente-académico-individual-de-aprendiz) |
| **HU-25** | Inst/Admin | Como docente o directivo, quiero exportar la sábana académica a formato Excel (CSV con codificación UTF-8), para realizar análisis cuantitativos externos. | **Dada** una vista tabular de calificaciones o asistencia, **cuando** el usuario pulsa 'Exportar CSV', **entonces** el navegador descarga el archivo estructurado con soporte de caracteres especiales. | **RF-029** | [CU-029](#caso-de-uso-cu-029-exportación-de-datos-académicos-a-formato-excel-csv-utf-8) |
| **HU-26** | Aprendiz | Como aprendiz, quiero consultar al asistente interactivo EDUNOVA AI, para recibir diagnósticos pedagógicos y recomendaciones de estudio en tiempo real. | **Dado** el panel del aprendiz, **cuando** formula una pregunta académica al chat de IA, **entonces** el backend consulta sus métricas reales en MySQL y devuelve un análisis en streaming token a token. | **RF-035** | [CU-035](#caso-de-uso-cu-035-consulta-contextual-al-asistente-académico-edunova-ai) |

---
`;

// 1. Guardar en docs/07.1-historias-de-usuario.md y documentos/07.1-historias-de-usuario.md
const fileHeader = "# 07.1. HISTORIAS DE USUARIO (HU-01 A HU-26)\n\n";
fs.writeFileSync(path.resolve(__dirname, '../docs/07.1-historias-de-usuario.md'), fileHeader + userStoriesMarkdown, 'utf8');
fs.writeFileSync(path.resolve(__dirname, '../documentos/07.1-historias-de-usuario.md'), fileHeader + userStoriesMarkdown, 'utf8');
console.log('✅ Creado docs/07.1-historias-de-usuario.md y documentos/07.1-historias-de-usuario.md');

// 2. Insertar en docs/SRS_EDUNOVA.md y documentos/SRS_EDUNOVA.md
function injectInSRS(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('## 7.2 Catálogo Formal de Historias de Usuario (HU-01 a HU-26)')) {
    console.log(`ℹ️ El archivo ${filePath} ya contiene las Historias de Usuario.`);
    return;
  }

  // Renombrar la sección de matriz de trazabilidad actual si se llamaba 7.2 a 7.3
  content = content.replace('## 7.2 Matriz de Trazabilidad Completa', '## 7.3 Matriz de Trazabilidad Completa');
  
  // Insertar antes de 7.3 Matriz de Trazabilidad Completa
  const target = '## 7.3 Matriz de Trazabilidad Completa';
  if (content.includes(target)) {
    content = content.replace(target, userStoriesMarkdown + '\n' + target);
  } else {
    // Si no, buscar la sección 8
    const sec8 = '## SECCIÓN 8: REQUISITOS NO FUNCIONALES (RNF)';
    content = content.replace(sec8, userStoriesMarkdown + '\n' + sec8);
  }

  // Actualizar tabla de contenido en el SRS
  const tocTarget = '- [7.1. Catálogo de Requisitos Funcionales (RF-001 a RF-036)](#71-catálogo-de-requisitos-funcionales-rf-001-a-rf-036)';
  if (content.includes(tocTarget) && !content.includes('7.2. Catálogo Formal de Historias de Usuario')) {
    const tocReplacement = `${tocTarget}\n    - [7.2. Catálogo Formal de Historias de Usuario (HU-01 a HU-26)](#72-catálogo-formal-de-historias-de-usuario-hu-01-a-hu-26)\n    - [7.3. Matriz de Trazabilidad Completa](#73-matriz-de-trazabilidad-completa)`;
    content = content.replace(tocTarget, tocReplacement);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Inyectadas las 26 Historias de Usuario en: ${filePath}`);
}

injectInSRS(path.resolve(__dirname, '../docs/SRS_EDUNOVA.md'));
injectInSRS(path.resolve(__dirname, '../documentos/SRS_EDUNOVA.md'));

// 3. Actualizar tabla de contenido modular
function updateToc(tocPath) {
  let toc = fs.readFileSync(tocPath, 'utf8');
  if (!toc.includes('07.1-historias-de-usuario.md')) {
    toc = toc.replace(
      '* [07. Requisitos Funcionales](07-requisitos-funcionales.md)',
      '* [07. Requisitos Funcionales](07-requisitos-funcionales.md)\n* [07.1. Historias de Usuario (HU-01 a HU-26)](07.1-historias-de-usuario.md)'
    );
    fs.writeFileSync(tocPath, toc, 'utf8');
    console.log(`✅ Actualizado índice en: ${tocPath}`);
  }
}
updateToc(path.resolve(__dirname, '../docs/10-tabla-de-contenido.md'));
updateToc(path.resolve(__dirname, '../documentos/10-tabla-de-contenido.md'));

console.log('\n🎉 ¡Proceso de integración de las 26 Historias de Usuario finalizado exitosamente!');
