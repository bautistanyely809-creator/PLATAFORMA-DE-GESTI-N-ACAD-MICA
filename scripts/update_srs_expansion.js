const fs = require('fs');
const path = require('path');

console.log('📝 Preparando expansión completa del SRS para EDUNOVA v4.0...');

// 1. Definición de los 12 nuevos Casos de Uso (CU-037 a CU-048)
const nuevosCasosDeUso = [
  {
    id: "CU-037",
    nombre: "Programar Evento en Calendario Académico",
    modulo: "Módulo 8: Calendario Académico",
    descripcion: "Permite al Administrador o Instructor crear y agendar eventos institucionales, sesiones presenciales, fechas límites de entrega y evaluaciones, validando rangos horarios y notificando a la ficha correspondiente.",
    actores: {
      principal: "Instructor / Administrador",
      secundario: "Servicio de Notificaciones y Aprendices de la Ficha"
    },
    precondiciones: [
      "Usuario autenticado con rol INSTRUCTOR o ADMIN.",
      "Ficha o grupo académico activo en el sistema."
    ],
    trigger: "El usuario presiona 'Programar Evento' en el Calendario Académico.",
    flujoPrincipal: [
      "El actor ingresa al módulo de Calendario Académico.",
      "El sistema valida los permisos y despliega el formulario de creación.",
      "El actor ingresa título, categoría (CLASE, EVALUACION, ENTREGA, INSTITUCIONAL), fechas, horarios y ambiente.",
      "El sistema valida que la fecha y hora final sean posteriores a las de inicio.",
      "El sistema registra el evento en la tabla EVENTO_CALENDARIO vinculando el usuario creador.",
      "El sistema invoca a NotificationService para alertar a los aprendices asignados.",
      "El sistema confirma la programación y actualiza la matriz del calendario en pantalla."
    ],
    flujosAlternativos: [
      "3a. El evento está asociado a una reserva de ambiente: el sistema comprueba la disponibilidad del aula física antes de guardar."
    ],
    flujosExcepcion: [
      "4a. Fecha fin anterior a fecha inicio: el sistema bloquea el guardado con código HTTP 400 y mensaje de error descriptivo."
    ],
    postcondiciones: {
      exito: "Evento persistido en base de datos y visible en vistas mensual y de agenda.",
      fallo: "No se guardan cambios y se muestra mensaje de error al usuario."
    },
    reglasNegocio: [
      "RN-045: Ningún evento puede tener fecha_fin anterior a fecha_inicio.",
      "RN-046: Los instructores solo pueden programar eventos en fichas donde figuren como asignados."
    ],
    datosInvolucrados: {
      entradas: "titulo, descripcion, categoria, fecha_inicio, fecha_fin, hora_inicio, hora_fin, id_ambiente, id_curso",
      salidas: "Objeto evento con ID autoincremental y confirmación JSON"
    },
    permisos: "ADMIN, INSTRUCTOR (Token JWT requerido).",
    criteriosAceptacion: "El evento debe aparecer inmediatamente en la cuadrícula del mes y generar alerta en la campana de notificaciones.",
    relacionesUML: "include NotificationService; extend Gestión de Ambientes."
  },
  {
    id: "CU-038",
    nombre: "Navegar y Filtrar el Calendario Académico",
    modulo: "Módulo 8: Calendario Académico",
    descripcion: "Permite a cualquier usuario autenticado navegar entre meses, conmutar entre vista mensual y agenda, y filtrar actividades por categoría institucional.",
    actores: {
      principal: "Aprendiz / Instructor / Administrador",
      secundario: "Servidor API REST"
    },
    precondiciones: [
      "Usuario autenticado en la plataforma."
    ],
    trigger: "El usuario navega entre meses o hace clic en un filtro de categoría.",
    flujoPrincipal: [
      "El usuario selecciona el mes o pulsa los botones de anterior/siguiente.",
      "El usuario selecciona una categoría (CLASE, EVALUACION, ENTREGA, etc.).",
      "El frontend envía petición GET /api/calendario con query params de mes, año y categoría.",
      "El backend filtra los registros en MySQL y retorna la colección de eventos.",
      "El frontend recalcula la cuadrícula mensual y renderiza los badges coloreados según la categoría."
    ],
    flujosAlternativos: [
      "2a. Conmutar a vista Agenda: el sistema renderiza una línea de tiempo vertical con badges numéricos del día."
    ],
    flujosExcepcion: [
      "3a. Error de red o servidor no disponible: se despliega banner de reintento."
    ],
    postcondiciones: {
      exito: "Cuadrícula y listado sincronizados con los filtros aplicados.",
      fallo: "Se mantiene el estado previo del calendario."
    },
    reglasNegocio: [
      "RN-047: Los aprendices solo visualizan eventos públicos institucionales o asignados a su ficha 3413988."
    ],
    datosInvolucrados: {
      entradas: "mes, anio, categoria, id_curso",
      salidas: "Array de eventos ordenados cronológicamente"
    },
    permisos: "Todos los roles autenticados.",
    criteriosAceptacion: "Tiempo de filtrado reactivo menor a 150 ms en navegador.",
    relacionesUML: "Asociación directa con componente CalendarioModule."
  },
  {
    id: "CU-039",
    nombre: "Cancelar Evento de Calendario con Trazabilidad",
    modulo: "Módulo 8: Calendario Académico",
    descripcion: "Permite al organizador cancelar un evento programado, registrando obligatoriamente el motivo de cancelación y notificando la novedad a los participantes.",
    actores: {
      principal: "Instructor / Administrador",
      secundario: "Aprendices Destinatarios"
    },
    precondiciones: [
      "Evento existente con estado ACTIVO.",
      "Usuario creador o administrador."
    ],
    trigger: "El usuario presiona 'Cancelar Evento' en el modal de detalle.",
    flujoPrincipal: [
      "El actor abre el modal de detalle del evento.",
      "Presiona 'Cancelar Evento'.",
      "El sistema solicita el motivo justificado de la cancelación.",
      "El actor ingresa el motivo y confirma.",
      "El sistema ejecuta PATCH /api/calendario/:id/cancelar actualizando estado a CANCELADO.",
      "Se dispara notificación preventiva a los aprendices de la ficha.",
      "El evento se conserva visible con etiqueta de cancelación (no se elimina físicamente)."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [
      "4a. Motivo vacío: el sistema cancela la operación y exige justificación."
    ],
    postcondiciones: {
      exito: "Registro marcado como CANCELADO con motivo preservado en auditoría.",
      fallo: "El evento permanece ACTIVO."
    },
    reglasNegocio: [
      "RN-048: Los eventos cancelados no se purgan de la base de datos para preservar trazabilidad."
    ],
    datosInvolucrados: {
      entradas: "id_evento, motivo",
      salidas: "Objeto evento con estado CANCELADO"
    },
    permisos: "ADMIN, INSTRUCTOR.",
    criteriosAceptacion: "El evento muestra badge rojo de CANCELADO y se notifica a la ficha.",
    relacionesUML: "include NotificationService."
  },
  {
    id: "CU-040",
    nombre: "Consultar Expediente Académico Digital 360°",
    modulo: "Módulo 9: Perfil Académico 360°",
    descripcion: "Permite al aprendiz consultar su propio expediente formativo integral, y al instructor/admin auditar el progreso de cualquier aprendiz con indicadores de avance, asistencia, recuperaciones y alertas.",
    actores: {
      principal: "Aprendiz / Instructor / Administrador",
      secundario: "Base de Datos Relacional MySQL 8"
    },
    precondiciones: [
      "Usuario autenticado en la plataforma.",
      "Aprendiz registrado con matrícula activa en ficha 3413988."
    ],
    trigger: "El usuario ingresa a la pestaña 'Perfil Académico 360°'.",
    flujoPrincipal: [
      "El usuario selecciona la opción Perfil 360° en la barra de navegación.",
      "Si es aprendiz, invoca GET /api/perfil-360/me; si es docente/admin, invoca GET /api/perfil-360/:id con selector de aprendiz.",
      "El backend compila en una sola consulta estructurada los datos del usuario, inscripciones, competencias, evidencias, asistencia, recuperaciones, alertas y solicitudes.",
      "Calcula en tiempo real los 6 KPIs matemáticos.",
      "El frontend renderiza el banner de información general, las tarjetas métricas y las 7 pestañas temáticas."
    ],
    flujosAlternativos: [
      "3a. Aprendiz sin registros de asistencia: el indicador muestra 100% por defecto sin arrojar errores nulos."
    ],
    flujosExcepcion: [
      "2a. Aprendiz no encontrado: código HTTP 404 con mensaje 'Aprendiz no registrado'."
    ],
    postcondiciones: {
      exito: "Expediente digital renderizado de forma coherente y completa.",
      fallo: "Mensaje de error y retorno al dashboard general."
    },
    reglasNegocio: [
      "RN-049: El aprendiz únicamente tiene acceso de lectura sobre su propio expediente.",
      "RN-050: Los porcentajes se calculan con datos vivos de la BD, prohibiendo valores estáticos simulados."
    ],
    datosInvolucrados: {
      entradas: "id_aprendiz (o token de sesión)",
      salidas: "Objeto JSON multidimensional con perfil, indicadores y 7 colecciones temáticas"
    },
    permisos: "APRENDIZ (propio perfil), INSTRUCTOR (fichas asignadas), ADMIN (todos).",
    criteriosAceptacion: "Cálculo preciso de porcentajes de aprobación conforme a la fórmula (aprobadas/total)*100.",
    relacionesUML: "Agregación de Competencias, Evidencias, Asistencia y Alertas."
  },
  {
    id: "CU-041",
    nombre: "Registrar Acción de Acompañamiento Formativo y Tutoría",
    modulo: "Módulo 9: Perfil Académico 360°",
    descripcion: "Permite a un instructor registrar una sesión de tutoría, citación preventiva o compromiso pedagógico en el expediente 360° del aprendiz.",
    actores: {
      principal: "Instructor / Administrador",
      secundario: "Aprendiz Destinatario"
    },
    precondiciones: [
      "Usuario con rol INSTRUCTOR o ADMIN.",
      "Aprendiz seleccionado en el Perfil 360°."
    ],
    trigger: "El docente presiona '+ Registrar Acompañamiento'.",
    flujoPrincipal: [
      "El docente pulsa el botón de registro de acompañamiento.",
      "Selecciona el tipo de acción: TUTORIA, CITACION, COMPROMISO o REMISION_BIENESTAR.",
      "Ingresa la descripción de la sesión y el compromiso adquirido por el estudiante.",
      "Presiona 'Guardar Acompañamiento'.",
      "El backend inserta el registro en ACCION_ACOMPANAMIENTO vinculando aprendiz e instructor.",
      "El expediente se actualiza en vivo en la pestaña de acompañamiento."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [
      "3a. Campos vacíos: validación de obligatoriedad en cliente y servidor."
    ],
    postcondiciones: {
      exito: "Acción persistida en el expediente digital con fecha y firma docente.",
      fallo: "No se registran compromisos."
    },
    reglasNegocio: [
      "RN-051: Toda acción de acompañamiento debe dejar constancia del compromiso adquirido."
    ],
    datosInvolucrados: {
      entradas: "id_aprendiz, tipo_accion, descripcion, compromiso",
      salidas: "Registro de acción con timestamp y clave foránea docente"
    },
    permisos: "INSTRUCTOR, ADMIN.",
    criteriosAceptacion: "Visibilidad inmediata en la pestaña de Acompañamiento Formativo.",
    relacionesUML: "Composición en Perfil 360°."
  },
  {
    id: "CU-042",
    nombre: "Detección Automatizada de Riesgos Formativos (Motor de Reglas)",
    modulo: "Módulo 10: Sistema de Alertas Tempranas",
    descripcion: "Ejecuta el motor de reglas en segundo plano o a demanda para identificar inasistencias reiteradas (> 2 ausencias) o evidencias vencidas, generando alertas preventivas automáticas.",
    actores: {
      principal: "Motor de Reglas del Sistema (CRON / Background Worker)",
      secundario: "Coordinador Académico / Instructor"
    },
    precondiciones: [
      "Base de datos operativa con registros de asistencia y evidencias.",
      "Disparador programado o invocación manual desde consola."
    ],
    trigger: "Ejecución periódica automática o clic en 'Evaluar Reglas'.",
    flujoPrincipal: [
      "El servicio consulta los registros de asistencia agrupados por aprendiz con estado AUSENTE.",
      "Si un aprendiz acumula 2 o más ausencias sin justificar, verifica si ya existe una alerta activa para evitar duplicados.",
      "Si no existe, crea una ALERTA_TEMPRANA con prioridad ALTA o CRÍTICA y origen AUTOMATICA.",
      "El servicio consulta las evidencias con fecha límite superada y sin entregas completas.",
      "Genera alertas de tipo EVIDENCIA_VENCIDA con prioridad MEDIA.",
      "Registra el hito en HISTORIAL_ALERTA con el usuario del sistema.",
      "Retorna el conteo total de nuevas alertas generadas."
    ],
    flujosAlternativos: [
      "2a. No se detectan anomalías: el sistema retorna 0 alertas nuevas sin alterar el estado actual."
    ],
    flujosExcepcion: [
      "1a. Falla de conexión a base de datos: error 500 registrado en logs de OpenTelemetry."
    ],
    postcondiciones: {
      exito: "Alertas tempranas disponibles en la consola preventiva y badges actualizados.",
      fallo: "No se crean alertas erróneas."
    },
    reglasNegocio: [
      "RN-052: Prevención de spam: no se genera una nueva alerta idéntica si ya existe una en estado NUEVA o EN_SEGUIMIENTO.",
      "RN-053: Las alertas automáticas jamás sancionan ni cambian el estado de matrícula sin intervención humana."
    ],
    datosInvolucrados: {
      entradas: "Registros de ASISTENCIA y fechas de EVIDENCIA",
      salidas: "Registros insertados en ALERTA_TEMPRANA e HISTORIAL_ALERTA"
    },
    permisos: "ADMIN, INSTRUCTOR (invocación manual), Sistema (background).",
    criteriosAceptacion: "Detección exacta de aprendices que superan el umbral de inasistencia.",
    relacionesUML: "include HistorialAlerta; lectura de Asistencia y Evidencias."
  },
  {
    id: "CU-043",
    nombre: "Gestionar y Cerrar Alerta Temprana con Justificación",
    modulo: "Módulo 10: Sistema de Alertas Tempranas",
    descripcion: "Permite al personal docente cambiar el estado de una alerta (a En Seguimiento, Atendida o Cerrada), registrando obligatoriamente la justificación del cierre.",
    actores: {
      principal: "Instructor / Administrador",
      secundario: "Historial de Auditoría"
    },
    precondiciones: [
      "Alerta existente registrada en el sistema.",
      "Usuario con permisos docentes o administrativos."
    ],
    trigger: "El usuario presiona 'Gestionar' en la tarjeta de alerta.",
    flujoPrincipal: [
      "El actor abre el modal de gestión de la alerta.",
      "Selecciona el nuevo estado (EN_SEGUIMIENTO, ATENDIDA, CERRADA).",
      "Redacta el comentario de la sesión o justificación de cierre.",
      "Presiona 'Confirmar Cambio'.",
      "El backend actualiza ALERTA_TEMPRANA registrando fecha_atencion o fecha_cierre según corresponda.",
      "Inserta un registro inmutable en HISTORIAL_ALERTA con el estado anterior y el nuevo.",
      "La consola refresca la lista y actualiza los contadores de criticidad."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [
      "3a. Intento de cerrar alerta sin justificación: el sistema rechaza la solicitud con HTTP 400."
    ],
    postcondiciones: {
      exito: "Estado actualizado y trazabilidad registrada en el historial cronológico.",
      fallo: "La alerta conserva su estado anterior."
    },
    reglasNegocio: [
      "RN-054: Para cerrar definitivamente una alerta se exige una justificación detallada."
    ],
    datosInvolucrados: {
      entradas: "id_alerta, nuevo_estado, comentario, justificacion_cierre",
      salidas: "Alerta actualizada con registro en HISTORIAL_ALERTA"
    },
    permisos: "ADMIN, INSTRUCTOR.",
    criteriosAceptacion: "Auditoría visible en la línea de tiempo del caso con nombre del funcionario.",
    relacionesUML: "Composición con HistorialAlerta."
  },
  {
    id: "CU-044",
    nombre: "Administrar Aula Virtual y Unidades Didácticas",
    modulo: "Módulo 11: Aula Virtual LMS",
    descripcion: "Permite al instructor o administrador crear y organizar aulas virtuales asociadas a fichas, dividiendo los contenidos en unidades temáticas ordenadas.",
    actores: {
      principal: "Instructor / Administrador",
      secundario: "Ficha ADSO 3413988"
    },
    precondiciones: [
      "Ficha académica creada.",
      "Usuario docente asignado."
    ],
    trigger: "El usuario presiona 'Agregar Unidad Temática' en el Aula Virtual.",
    flujoPrincipal: [
      "El actor ingresa al módulo de Aula Virtual.",
      "Presiona 'Agregar Unidad Temática'.",
      "Ingresa el título de la unidad y su descripción pedagógica.",
      "El sistema calcula el orden consecutivo y crea la UNIDAD_AULA.",
      "La nueva sección aparece en el aula virtual lista para recibir materiales y actividades."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [
      "3a. Título vacío: validación de obligatoriedad."
    ],
    postcondiciones: {
      exito: "Unidad temática creada y vinculada al aula.",
      fallo: "No se crean registros."
    },
    reglasNegocio: [
      "RN-055: Las unidades se organizan con un índice ordinal ascendente para guiar la secuencia de aprendizaje."
    ],
    datosInvolucrados: {
      entradas: "id_aula, titulo, descripcion, orden",
      salidas: "Objeto UNIDAD_AULA persistido"
    },
    permisos: "ADMIN, INSTRUCTOR.",
    criteriosAceptacion: "Despliegue inmediato de la sección en la vista del aula.",
    relacionesUML: "Composición de AulaVirtual con UnidadAula."
  },
  {
    id: "CU-045",
    nombre: "Publicar Recursos y Actividades con Proyección al Calendario",
    modulo: "Módulo 11: Aula Virtual LMS",
    descripcion: "Permite al instructor subir recursos (guías PDF, diapositivas, enlaces) y crear actividades evaluables; cuando se asigna fecha límite, se proyecta automáticamente al Calendario Académico y se notifica a la ficha.",
    actores: {
      principal: "Instructor",
      secundario: "Calendario Académico y Servicio de Notificaciones"
    },
    precondiciones: [
      "Unidad temática existente en el aula.",
      "Instructor titular del curso."
    ],
    trigger: "El instructor presiona 'Subir Material' o 'Crear Actividad'.",
    flujoPrincipal: [
      "El instructor selecciona la unidad y pulsa 'Crear Actividad'.",
      "Ingresa título, descripción, instrucciones y fecha límite de entrega.",
      "Presiona 'Publicar Actividad'.",
      "El backend registra la ACTIVIDAD_AULA.",
      "Si tiene fecha límite, inserta automáticamente un EVENTO_CALENDARIO de categoría ENTREGA.",
      "Invoca a NotificationService para alertar a todos los aprendices inscritos.",
      "La actividad queda disponible para recepción de entregas."
    ],
    flujosAlternativos: [
      "1a. Publicar Material didáctico: el docente ingresa tipo (PDF, ENLACE, VIDEO) y URL del recurso, guardando en MATERIAL_AULA."
    ],
    flujosExcepcion: [
      "2a. Fecha límite inválida o anterior a la fecha actual: rechazo de la solicitud."
    ],
    postcondiciones: {
      exito: "Actividad publicada, evento reflejado en Calendario y notificación emitida.",
      fallo: "No se publican actividades."
    },
    reglasNegocio: [
      "RN-056: Toda actividad con fecha límite debe sincronizarse de manera atómica con el Calendario Académico."
    ],
    datosInvolucrados: {
      entradas: "id_unidad, titulo, descripcion, instrucciones, fecha_limite, archivo_adjunto",
      salidas: "Registros en ACTIVIDAD_AULA y EVENTO_CALENDARIO"
    },
    permisos: "INSTRUCTOR, ADMIN.",
    criteriosAceptacion: "Visualización de la fecha límite tanto en la tarjeta de la actividad como en la matriz mensual del calendario.",
    relacionesUML: "include Calendario; include NotificationService."
  },
  {
    id: "CU-046",
    nombre: "Entregar y Calificar Actividades en Aula Virtual",
    modulo: "Módulo 11: Aula Virtual LMS",
    descripcion: "Permite al aprendiz subir su solución a una actividad formativa, y al instructor evaluar el trabajo asignando una calificación de 0.0 a 5.0 y comentarios de retroalimentación.",
    actores: {
      principal: "Aprendiz (Entrega) / Instructor (Evaluación)",
      secundario: "Expediente Perfil 360°"
    },
    precondiciones: [
      "Actividad publicada en el aula virtual.",
      "Aprendiz con matrícula activa."
    ],
    trigger: "El aprendiz presiona 'Entregar Solución' o el docente presiona 'Calificar'.",
    flujoPrincipal: [
      "El aprendiz ingresa la URL o archivo de su solución y redacta sus observaciones.",
      "El sistema registra ENTREGA_ACTIVIDAD_AULA con estado ENTREGADA.",
      "El instructor visualiza la entrega en su panel de aula.",
      "Presiona 'Calificar / Retroalimentar'.",
      "Ingresa la calificación numérica (ej. 4.8), el estado (APROBADA) y la retroalimentación cualitativa.",
      "El backend actualiza la entrega y despacha una notificación al aprendiz.",
      "El resultado se refleja de inmediato en el Perfil Académico 360° del aprendiz."
    ],
    flujosAlternativos: [
      "5a. El instructor solicita corrección: estado pasa a REQUIERE_CORRECCION permitiendo un nuevo envío al estudiante."
    ],
    flujosExcepcion: [
      "5b. Calificación fuera del rango 0.0 a 5.0: error de validación en backend."
    ],
    postcondiciones: {
      exito: "Entrega evaluada, nota visible para el estudiante y actualizada en el expediente 360°.",
      fallo: "Entrega permanece en revisión."
    },
    reglasNegocio: [
      "RN-057: La calificación formativa debe ser un número decimal entre 0.0 y 5.0.",
      "RN-058: Toda evaluación requiere retroalimentación explicativa obligatoria."
    ],
    datosInvolucrados: {
      entradas: "id_actividad, archivo_url, comentario, calificacion, retroalimentacion, estado",
      salidas: "Registro en ENTREGA_ACTIVIDAD_AULA con nota y fecha de evaluación"
    },
    permisos: "APRENDIZ (entregar), INSTRUCTOR (calificar).",
    criteriosAceptacion: "Retroalimentación legible y calificación reflejada en tiempo real en la ficha del estudiante.",
    relacionesUML: "Asociación con Perfil 360° y Notificaciones."
  },
  {
    id: "CU-047",
    nombre: "Programar Reserva de Ambientes con Detección de Conflictos",
    modulo: "Módulo 12: Programación y Gestión de Ambientes",
    descripcion: "Permite agendar reservas en laboratorios o auditorios verificando la disponibilidad en tiempo real, bloqueando colisiones horarias concurrentes y creando el evento correspondiente en el calendario.",
    actores: {
      principal: "Instructor / Administrador",
      secundario: "Calendario Institucional"
    },
    precondiciones: [
      "Ambiente registrado en estado DISPONIBLE.",
      "Usuario docente o administrativo."
    ],
    trigger: "El usuario presiona 'Reservar Ambiente'.",
    flujoPrincipal: [
      "El actor selecciona el ambiente (ej. Laboratorio 101), fecha y franja horaria (08:00 a 12:00).",
      "Ingresa el motivo pedagógico de la reserva y selecciona la ficha.",
      "Presiona 'Confirmar Reserva'.",
      "El backend evalúa en MySQL si existe alguna reserva confirmada en ese mismo ambiente y fecha que solape con el horario.",
      "Si no hay colisiones, inserta RESERVA_AMBIENTE con estado CONFIRMADA.",
      "Crea automáticamente el EVENTO_CALENDARIO de categoría RESERVA_AMBIENTE.",
      "Notifica a la ficha si está asignada y libera la vista de disponibilidad."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [
      "4a. Conflicto de horario detectado: el backend responde con código HTTP 409 y mensaje 'Conflicto de programación: El ambiente ya tiene una reserva que coincide con ese horario'. La reserva es rechazada."
    ],
    postcondiciones: {
      exito: "Ambiente reservado, horario bloqueado y evento programado en el Calendario.",
      fallo: "Reserva rechazada por conflicto horario."
    },
    reglasNegocio: [
      "RN-059: Detección estricta de colisiones: no se permiten reservas simultáneas en el mismo espacio físico.",
      "RN-060: No se admiten reservas en ambientes en estado EN_MANTENIMIENTO o INACTIVO."
    ],
    datosInvolucrados: {
      entradas: "id_ambiente, id_curso, fecha, hora_inicio, hora_fin, motivo, observaciones",
      salidas: "Registro de RESERVA_AMBIENTE y sincronización en EVENTO_CALENDARIO"
    },
    permisos: "ADMIN, INSTRUCTOR.",
    criteriosAceptacion: "Bloqueo efectivo de solapamientos con retorno HTTP 409 verificado en pruebas.",
    relacionesUML: "include Calendario; consulta de Ambiente."
  },
  {
    id: "CU-048",
    nombre: "Radicar y Atender Solicitud Institucional con Radicado Único",
    modulo: "Módulo 13: Centro de Solicitudes Institucionales",
    descripcion: "Permite radicar peticiones académicas, novedades de asistencia o certificados generando un radicado oficial único (SOL-2026-XXXX), y permite al funcionario asignado emitir respuesta oficial con trazabilidad inmutable.",
    actores: {
      principal: "Aprendiz (Solicitante) / Instructor o Admin (Atención)",
      secundario: "Historial de Solicitud y Notificaciones"
    },
    precondiciones: [
      "Usuario autenticado en el sistema."
    ],
    trigger: "El usuario presiona 'Radicar Nueva Solicitud' o el funcionario presiona 'Responder'.",
    flujoPrincipal: [
      "El solicitante diligencia el formulario: categoría, asunto, descripción y prioridad.",
      "Presiona 'Radicar Trámite'.",
      "El backend calcula el número consecutivo anual y genera el radicado (ej. SOL-2026-0004).",
      "Inserta SOLICITUD_INSTITUCIONAL con estado RECIBIDA y registra el hito en HISTORIAL_SOLICITUD.",
      "El funcionario asignado o administrador ingresa a la solicitud y pulsa 'Responder'.",
      "Ingresa la resolución oficial y actualiza el estado a RESPONDIDA o CERRADA.",
      "El sistema notifica al aprendiz y guarda el historial auditable."
    ],
    flujosAlternativos: [
      "5a. Asignar responsable: el Administrador asigna un instructor específico; el estado pasa a ASIGNADA y se notifica al docente."
    ],
    flujosExcepcion: [
      "1a. Campos obligatorios incompletos: validación HTTP 400."
    ],
    postcondiciones: {
      exito: "Solicitud radicada con número único inmutable y respuesta oficial consignada.",
      fallo: "No se genera radicado."
    },
    reglasNegocio: [
      "RN-061: Todo radicado es único, secuencial y contiene el año de vigencia.",
      "RN-062: El historial de trazabilidad de una solicitud jamás puede ser editado ni borrado.",
      "RN-063: Los aprendices solo pueden consultar sus propias solicitudes radicadas."
    ],
    datosInvolucrados: {
      entradas: "categoria, asunto, descripcion, prioridad, archivo_adjunto, respuesta, nuevo_estado",
      salidas: "Número de radicado SOL-2026-XXXX e historial de estados"
    },
    permisos: "Todos autenticados (radicar), INSTRUCTOR y ADMIN (atender).",
    criteriosAceptacion: "Generación comprobada del radicado y entrega de notificación al solicitante.",
    relacionesUML: "Composición con HistorialSolicitud; include NotificationService."
  }
];

// Actualizar scripts/doc_generator/data_use_cases.js
const useCasesPath = path.resolve(__dirname, 'doc_generator/data_use_cases.js');
let currentUseCases = require('./doc_generator/data_use_cases');

// Verificar si ya están agregados para no duplicar
const existingIds = new Set(currentUseCases.map(c => c.id));
const toAdd = nuevosCasosDeUso.filter(c => !existingIds.has(c.id));

if (toAdd.length > 0) {
  const updatedUseCases = [...currentUseCases, ...toAdd];
  const fileContent = `// Catálogo exhaustivo de Casos de Uso del Sistema EDUNOVA\n// Incluye CU-001 a CU-048 (Expansión Integral v4.0)\n\nmodule.exports = ${JSON.stringify(updatedUseCases, null, 2)};\n`;
  fs.writeFileSync(useCasesPath, fileContent, 'utf8');
  console.log(`✅ Actualizado data_use_cases.js con ${toAdd.length} nuevos casos de uso (Total: ${updatedUseCases.length}).`);
} else {
  console.log('ℹ️ data_use_cases.js ya contenía los casos de uso nuevos.');
}

// Generar los archivos individuales en docs/04-casos-de-uso/
const casosDeUsoDir = path.resolve(__dirname, '../docs/04-casos-de-uso');
for (const cu of nuevosCasosDeUso) {
  const filePath = path.join(casosDeUsoDir, `${cu.id}.md`);
  let content = `# CASO DE USO ${cu.id}: ${cu.nombre.toUpperCase()}\n\n`;
  content += `## Identificación del caso de uso\n\n`;
  content += `* **Código:** \`${cu.id}\`\n`;
  content += `* **Nombre:** ${cu.nombre}\n`;
  content += `* **Módulo:** ${cu.modulo}\n`;
  content += `* **Actor principal:** ${cu.actores.principal}\n`;
  content += `* **Actores secundarios:** ${cu.actores.secundario}\n`;
  content += `* **Prioridad:** Alta\n`;
  content += `* **Estado de implementación:** 🟢 Implementado y Verificado en Rama DEV\n\n`;

  content += `## Descripción\n${cu.descripcion}\n\n`;
  content += `## Precondiciones\n${cu.precondiciones.map(p => `* ${p}`).join('\n')}\n\n`;
  content += `## Disparador\n${cu.trigger}\n\n`;
  content += `## Flujo principal\n${cu.flujoPrincipal.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n`;
  content += `## Flujos alternativos\n${cu.flujosAlternativos.length > 0 ? cu.flujosAlternativos.map(a => `* ${a}`).join('\n') : '* No aplican flujos alternativos directos.'}\n\n`;
  content += `## Excepciones\n${cu.flujosExcepcion.length > 0 ? cu.flujosExcepcion.map(e => `* ${e}`).join('\n') : '* No se identifican excepciones críticas no controladas.'}\n\n`;
  content += `## Postcondiciones\n* **Éxito:** ${cu.postcondiciones.exito}\n* **Fallo:** ${cu.postcondiciones.fallo}\n\n`;
  content += `## Reglas de negocio\n${cu.reglasNegocio.map(r => `* ${r}`).join('\n')}\n\n`;
  content += `## Datos involucrados\n* **Entradas:** \`${cu.datosInvolucrados.entradas}\`\n* **Salidas:** \`${cu.datosInvolucrados.salidas}\`\n\n`;
  content += `## Permisos\n* \`${cu.permisos}\`\n\n`;
  content += `## Criterios de aceptación\n> ${cu.criteriosAceptacion}\n\n`;
  content += `## Relaciones UML\n* ${cu.relacionesUML}\n`;

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log(`✅ Creados los archivos individuales CU-037.md a CU-048.md en docs/04-casos-de-uso/.`);

// 2. Actualizar data_general_docs.js con las especificaciones de los 6 nuevos módulos
const generalDocsPath = path.resolve(__dirname, 'doc_generator/data_general_docs.js');
let generalDocs = require('./doc_generator/data_general_docs');

// Actualizar Alcance (05-alcance.md)
generalDocs['05-alcance.md'] += `

### 5.2.8 Módulo 8: Calendario Académico Centralizado
- Matriz interactiva mensual, semanal y de agenda.
- Agendamiento de clases, evaluaciones, entregas de aula y comités.
- Cancelación con motivo justificado y notificación a fichas.

### 5.2.9 Módulo 9: Perfil Académico 360° del Aprendiz
- Expediente digital formativo integral sin duplicidad de fuentes de datos.
- Cálculo de 6 indicadores en tiempo real (% avance competencias, % asistencia, evidencias aprobadas, recuperaciones, alertas y solicitudes).
- 7 Pestañas de detalle académico y registro de tutorías/acompañamiento.

### 5.2.10 Módulo 10: Sistema de Alertas Tempranas
- Motor automático de reglas preventivas para detección de inasistencias (> 2 ausencias) y evidencias vencidas.
- Clasificación por 5 niveles de criticidad e historial inmutable de trazabilidad.
- Gestión de estado con obligatoriedad de justificación de cierre.

### 5.2.11 Módulo 11: Aula Virtual LMS Integrada
- Creación de unidades didácticas ordenadas por curso.
- Publicación de recursos educativos (PDF, documentos, enlaces).
- Asignación de actividades evaluables con proyección automática al Calendario Académico.
- Recepción de entregas y calificación docente de 0.0 a 5.0 con retroalimentación.

### 5.2.12 Módulo 12: Programación y Gestión de Ambientes
- Catálogo de laboratorios, talleres y auditorios con aforo y equipamiento.
- Detección estricta de conflictos de programación y reservas concurrentes (HTTP 409).
- Generación automática de eventos en el calendario institucional.

### 5.2.13 Módulo 13: Centro de Solicitudes Institucionales
- Radicación digital con consecutivo único anual oficial (\`SOL-2026-XXXX\`).
- Clasificación temática (Académica, Certificados, Asistencia, Soporte).
- Asignación de funcionarios responsables, emisión de respuestas oficiales e historial inmutable.
`;

// Actualizar Requisitos Funcionales (07-requisitos-funcionales.md)
generalDocs['07-requisitos-funcionales.md'] += `

### 7.1.8 Requisitos del Módulo de Calendario Académico
* **RF-037:** El sistema debe permitir a instructores y administradores programar eventos con fecha, franja horaria y ubicación.
* **RF-038:** El sistema debe permitir navegar entre meses y filtrar eventos por categoría de forma reactiva.
* **RF-039:** El sistema debe permitir cancelar eventos registrando obligatoriamente el motivo y notificando a los aprendices.

### 7.1.9 Requisitos del Módulo de Perfil Académico 360°
* **RF-040:** El sistema debe compilar el expediente digital 360° calculando en tiempo real los indicadores de avance y asistencia.
* **RF-041:** El sistema debe permitir al instructor registrar sesiones de tutoría y compromisos pedagógicos formativos.

### 7.1.10 Requisitos del Módulo de Alertas Tempranas
* **RF-042:** El sistema debe evaluar de forma automatizada las inasistencias y evidencias vencidas para generar alertas de prioridad Alta/Crítica.
* **RF-043:** El sistema debe registrar un historial inmutable de cambios de estado y requerir justificación para cerrar alertas.

### 7.1.11 Requisitos del Módulo de Aula Virtual LMS
* **RF-044:** El sistema debe permitir estructurar contenidos en unidades temáticas ordenadas.
* **RF-045:** El sistema debe sincronizar automáticamente la fecha límite de las actividades creadas en el Calendario Académico.
* **RF-046:** El sistema debe permitir la entrega de archivos por parte de los aprendices y su evaluación docente con nota de 0.0 a 5.0.

### 7.1.12 Requisitos del Módulo de Gestión de Ambientes
* **RF-047:** El sistema debe validar la disponibilidad del aula física y bloquear reservas simultáneas incompatibles mediante HTTP 409.

### 7.1.13 Requisitos del Módulo de Solicitudes Institucionales
* **RF-048:** El sistema debe generar un radicado único anual (\`SOL-2026-XXXX\`) y permitir emitir respuestas oficiales con trazabilidad completa.
`;

// Actualizar Modelo Entidad-Relación (12-modelo-entidad-relacion.md)
generalDocs['12-modelo-entidad-relacion.md'] += `

### 12.3 Extensiones del Modelo Relacional — Expansión Integral (13 Nuevas Entidades)
A continuación se especifican las 13 entidades incorporadas en MySQL 8 para soportar los 6 nuevos módulos:

\`\`\`mermaid
erDiagram
    USUARIO ||--o{ EVENTO_CALENDARIO : crea
    USUARIO ||--o{ HISTORIAL_ALERTA : audita
    USUARIO ||--o{ SOLICITUD_INSTITUCIONAL : radica
    USUARIO ||--o{ SOLICITUD_INSTITUCIONAL : atiende
    USUARIO ||--o{ HISTORIAL_SOLICITUD : registra

    APRENDIZ ||--o{ ALERTA_TEMPRANA : recibe
    APRENDIZ ||--o{ ACCION_ACOMPANAMIENTO : participa

    INSTRUCTOR ||--o{ EVENTO_CALENDARIO : programa
    INSTRUCTOR ||--o{ ALERTA_TEMPRANA : atiende
    INSTRUCTOR ||--o{ AULA_VIRTUAL : lidera
    INSTRUCTOR ||--o{ RESERVA_AMBIENTE : agenda
    INSTRUCTOR ||--o{ ACCION_ACOMPANAMIENTO : imparte

    CURSO ||--o{ EVENTO_CALENDARIO : asigna
    CURSO ||--o{ ALERTA_TEMPRANA : asocia
    CURSO ||--o{ AULA_VIRTUAL : alberga
    CURSO ||--o{ RESERVA_AMBIENTE : convoca

    AULA_VIRTUAL ||--|{ UNIDAD_AULA : contiene
    UNIDAD_AULA ||--o{ MATERIAL_AULA : publica
    UNIDAD_AULA ||--o{ ACTIVIDAD_AULA : asigna
    ACTIVIDAD_AULA ||--o{ ENTREGA_ACTIVIDAD_AULA : recibe
    INSCRIPCION ||--o{ ENTREGA_ACTIVIDAD_AULA : efectua

    AMBIENTE ||--o{ RESERVA_AMBIENTE : hospeda
    AMBIENTE ||--o{ EVENTO_CALENDARIO : ubica

    ALERTA_TEMPRANA ||--|{ HISTORIAL_ALERTA : traza
    SOLICITUD_INSTITUCIONAL ||--|{ HISTORIAL_SOLICITUD : traza
\`\`\`
`;

// Actualizar Diccionario de Datos (13-diccionario-de-datos.md)
generalDocs['13-diccionario-de-datos.md'] += `

### 13.23 Tabla EVENTO_CALENDARIO
Centraliza la planificación de actividades, clases presenciales, entregas y reservas.

| Campo | Tipo de Dato | Nulo | Clave | Valor por Defecto | Descripción |
| :--- | :--- | :---: | :---: | :---: | :--- |
| \`id_evento\` | INT | NO | PK (AI) | Auto | Identificador único del evento. |
| \`titulo\` | VARCHAR(150) | NO | | | Título representativo de la actividad. |
| \`descripcion\` | TEXT | SÍ | | NULL | Detalle de objetivos o instrucciones. |
| \`categoria\` | VARCHAR(50) | NO | | 'CLASE' | Categoría: CLASE, EVALUACION, ENTREGA, INSTITUCIONAL, RESERVA_AMBIENTE. |
| \`fecha_inicio\` | DATETIME | NO | MUL | | Fecha y hora de inicio. |
| \`fecha_fin\` | DATETIME | NO | | | Fecha y hora de culminación. |
| \`hora_inicio\` | VARCHAR(10) | SÍ | | NULL | Hora visual formateada. |
| \`hora_fin\` | VARCHAR(10) | SÍ | | NULL | Hora visual final. |
| \`ubicacion\` | VARCHAR(100) | SÍ | | NULL | Nombre del ambiente o enlace virtual. |
| \`id_ambiente\` | INT | SÍ | FK | NULL | Referencia a tabla AMBIENTE. |
| \`id_instructor\`| INT | SÍ | FK | NULL | Referencia a tabla INSTRUCTOR. |
| \`id_curso\` | INT | SÍ | FK | NULL | Referencia a tabla CURSO (Ficha 3413988). |
| \`id_usuario_creador\` | INT | NO | FK | | Referencia a USUARIO creador. |
| \`estado\` | VARCHAR(20) | NO | | 'ACTIVO' | Estado: ACTIVO, MODIFICADO, CANCELADO. |
| \`motivo_cancelacion\` | TEXT | SÍ | | NULL | Motivo justificado si fue cancelado. |

### 13.24 Tabla ALERTA_TEMPRANA
Almacena las alertas preventivas de rendimiento académico y asistencia.

| Campo | Tipo de Dato | Nulo | Clave | Valor por Defecto | Descripción |
| :--- | :--- | :---: | :---: | :---: | :--- |
| \`id_alerta\` | INT | NO | PK (AI) | Auto | Identificador único de la alerta. |
| \`tipo\` | VARCHAR(50) | NO | MUL | | INASISTENCIA, EVIDENCIA_VENCIDA, COMPETENCIA_SIN_AVANCE, etc. |
| \`titulo\` | VARCHAR(150) | NO | | | Título del riesgo detectado. |
| \`descripcion\` | TEXT | NO | | | Causa y datos cuantitativos del riesgo. |
| \`id_aprendiz\` | INT | SÍ | FK | NULL | Referencia a APRENDIZ afectado. |
| \`id_curso\` | INT | SÍ | FK | NULL | Referencia a CURSO / Ficha. |
| \`id_instructor_responsable\` | INT | SÍ | FK | NULL | Instructor a cargo del seguimiento. |
| \`prioridad\` | VARCHAR(20) | NO | MUL | 'MEDIA' | CRITICA, ALTA, MEDIA, BAJA, INFORMATIVA. |
| \`estado\` | VARCHAR(20) | NO | MUL | 'NUEVA' | NUEVA, EN_SEGUIMIENTO, ATENDIDA, CERRADA. |
| \`origen\` | VARCHAR(20) | NO | | 'AUTOMATICA' | AUTOMATICA (motor) o MANUAL. |
| \`fecha_generacion\` | DATETIME | NO | | CURRENT_TIMESTAMP | Momento de detección. |
| \`fecha_atencion\` | DATETIME | SÍ | | NULL | Fecha de intervención docente. |
| \`fecha_cierre\` | DATETIME | SÍ | | NULL | Fecha formal de cierre. |
| \`justificacion_cierre\` | TEXT | SÍ | | NULL | Argumento obligatorio de cierre. |

### 13.25 Tabla AULA_VIRTUAL
Representa el espacio digital LMS de cada ficha formativa.

| Campo | Tipo de Dato | Nulo | Clave | Valor por Defecto | Descripción |
| :--- | :--- | :---: | :---: | :---: | :--- |
| \`id_aula\` | INT | NO | PK (AI) | Auto | Identificador único del aula. |
| \`id_curso\` | INT | NO | FK | | Ficha formativa vinculada. |
| \`id_instructor\`| INT | NO | FK | | Docente titular del espacio. |
| \`nombre\` | VARCHAR(150) | NO | | | Nombre formal del aula. |
| \`descripcion\` | TEXT | SÍ | | NULL | Presentación y objetivos pedagógicos. |
| \`imagen_portada\`| VARCHAR(255)| SÍ | | NULL | Ruta del banner gráfico. |
| \`estado\` | VARCHAR(20) | NO | | 'ACTIVO' | ACTIVO o ARCHIVADO. |

### 13.26 Tabla UNIDAD_AULA
Secciones temáticas en que se divide el aula virtual.

| Campo | Tipo de Dato | Nulo | Clave | Valor por Defecto | Descripción |
| :--- | :--- | :---: | :---: | :---: | :--- |
| \`id_unidad\` | INT | NO | PK (AI) | Auto | Identificador de la unidad. |
| \`id_aula\` | INT | NO | FK | | Aula a la que pertenece. |
| \`titulo\` | VARCHAR(150) | NO | | | Nombre de la unidad temática. |
| \`descripcion\` | TEXT | SÍ | | NULL | Resumen del contenido temático. |
| \`orden\` | INT | NO | | 1 | Posición ordinal en el curso. |

### 13.27 Tabla ACTIVIDAD_AULA
Talleres y actividades evaluables publicadas en el aula virtual.

| Campo | Tipo de Dato | Nulo | Clave | Valor por Defecto | Descripción |
| :--- | :--- | :---: | :---: | :---: | :--- |
| \`id_actividad\` | INT | NO | PK (AI) | Auto | Identificador de la actividad. |
| \`id_unidad\` | INT | NO | FK | | Unidad contenedora. |
| \`id_evidencia\`| INT | SÍ | FK | NULL | Enlace opcional a EVIDENCIA sin duplicar. |
| \`titulo\` | VARCHAR(150) | NO | | | Título del entregable. |
| \`descripcion\` | TEXT | NO | | | Explicación del taller. |
| \`instrucciones\`| TEXT | SÍ | | NULL | Criterios y requerimientos específicos. |
| \`fecha_limite\` | DATETIME | SÍ | | NULL | Vencimiento proyectado en Calendario. |
| \`estado\` | VARCHAR(20) | NO | | 'PUBLICADA' | PUBLICADA o BORRADOR. |

### 13.28 Tabla ENTREGA_ACTIVIDAD_AULA
Soluciones entregadas por los aprendices y evaluadas por los instructores.

| Campo | Tipo de Dato | Nulo | Clave | Valor por Defecto | Descripción |
| :--- | :--- | :---: | :---: | :---: | :--- |
| \`id_entrega_actividad\` | INT | NO | PK (AI) | Auto | Identificador del envío. |
| \`id_actividad\`| INT | NO | FK | | Actividad correspondiente. |
| \`id_inscripcion\`| INT | NO | FK | | Aprendiz que entrega. |
| \`archivo_url\` | VARCHAR(500) | SÍ | | NULL | URL del repositorio o documento. |
| \`comentario\` | TEXT | SÍ | | NULL | Nota adjunta del estudiante. |
| \`estado\` | VARCHAR(20) | NO | | 'ENTREGADA' | ENTREGADA, APROBADA, REQUIERE_CORRECCION. |
| \`calificacion\` | DECIMAL(4,2)| SÍ | | NULL | Nota numérica (0.0 a 5.0). |
| \`retroalimentacion\`| TEXT | SÍ | | NULL | Comentarios y feedback docente. |
| \`fecha_entrega\`| DATETIME | NO | | CURRENT_TIMESTAMP | Momento del envío. |
| \`fecha_evaluacion\`| DATETIME | SÍ| | NULL | Momento de la calificación. |

### 13.29 Tabla AMBIENTE
Inventario de espacios físicos y laboratorios de la institución.

| Campo | Tipo de Dato | Nulo | Clave | Valor por Defecto | Descripción |
| :--- | :--- | :---: | :---: | :---: | :--- |
| \`id_ambiente\` | INT | NO | PK (AI) | Auto | Identificador del ambiente. |
| \`codigo\` | VARCHAR(50) | NO | UNI | | Código patrimonial (ej. AMB-SISTEMAS-101). |
| \`nombre\` | VARCHAR(100) | NO | | | Nombre del laboratorio. |
| \`ubicacion\` | VARCHAR(100) | NO | | | Sede, bloque y piso. |
| \`capacidad\` | INT | NO | | | Aforo máximo de personas. |
| \`tipo\` | VARCHAR(50) | NO | MUL | | SISTEMAS, LABORATORIO, AUDITORIO, AULA_TEORICA. |
| \`equipamiento\`| TEXT | SÍ | | NULL | Hardware e infraestructura disponible. |
| \`estado\` | VARCHAR(30) | NO | MUL | 'DISPONIBLE' | DISPONIBLE, OCUPADO, EN_MANTENIMIENTO, INACTIVO. |

### 13.30 Tabla RESERVA_AMBIENTE
Agendamiento de ambientes con validación de conflictos de horario.

| Campo | Tipo de Dato | Nulo | Clave | Valor por Defecto | Descripción |
| :--- | :--- | :---: | :---: | :---: | :--- |
| \`id_reserva\` | INT | NO | PK (AI) | Auto | Identificador de la reserva. |
| \`id_ambiente\` | INT | NO | FK | | Espacio físico reservado. |
| \`id_curso\` | INT | SÍ | FK | NULL | Ficha académica beneficiaria. |
| \`id_instructor\`| INT | NO | FK | | Docente responsable. |
| \`motivo\` | VARCHAR(200) | NO | | | Objeto de la actividad formativa. |
| \`fecha\` | DATE | NO | MUL | | Día de la reserva. |
| \`hora_inicio\` | VARCHAR(10) | NO | | | Hora de inicio (ej. 08:00). |
| \`hora_fin\` | VARCHAR(10) | NO | | | Hora de salida (ej. 12:00). |
| \`estado\` | VARCHAR(20) | NO | | 'CONFIRMADA' | CONFIRMADA o CANCELADO. |

### 13.31 Tabla SOLICITUD_INSTITUCIONAL
Centro de atención con radicado oficial único anual.

| Campo | Tipo de Dato | Nulo | Clave | Valor por Defecto | Descripción |
| :--- | :--- | :---: | :---: | :---: | :--- |
| \`id_solicitud\` | INT | NO | PK (AI) | Auto | Identificador del trámite. |
| \`radicado\` | VARCHAR(50) | NO | UNI | | Radicado oficial (ej. SOL-2026-0001). |
| \`id_usuario_solicitante\` | INT | NO | FK | | Usuario solicitante. |
| \`id_usuario_responsable\` | INT | SÍ | FK | NULL | Funcionario o docente asignado. |
| \`categoria\` | VARCHAR(50) | NO | MUL | | ACADEMICA, CERTIFICADO, ASISTENCIA, etc. |
| \`asunto\` | VARCHAR(200) | NO | | | Resumen del requerimiento. |
| \`descripcion\` | TEXT | NO | | | Argumentación detallada. |
| \`prioridad\` | VARCHAR(20) | NO | | 'MEDIA' | BAJA, MEDIA, ALTA, URGENTE. |
| \`estado\` | VARCHAR(20) | NO | MUL | 'RECIBIDA' | RECIBIDA, EN_PROCESO, RESPONDIDA, CERRADA. |
| \`respuesta\` | TEXT | SÍ | | NULL | Respuesta oficial de la institución. |
| \`fecha_creacion\`| DATETIME | NO | | CURRENT_TIMESTAMP | Radicación inicial. |
| \`fecha_cierre\` | DATETIME | SÍ | | NULL | Fecha de resolución definitiva. |

### 13.32 Tabla HISTORIAL_SOLICITUD
Registro de auditoría inmutable de cada solicitud.

| Campo | Tipo de Dato | Nulo | Clave | Valor por Defecto | Descripción |
| :--- | :--- | :---: | :---: | :---: | :--- |
| \`id_historial\` | INT | NO | PK (AI) | Auto | Identificador de auditoría. |
| \`id_solicitud\`| INT | NO | FK | | Solicitud trazada. |
| \`estado_anterior\`| VARCHAR(50)| NO | | | Estado previo al cambio. |
| \`estado_nuevo\` | VARCHAR(50) | NO | | | Nuevo estado aplicado. |
| \`id_usuario\` | INT | NO | FK | | Funcionario que ejecutó el cambio. |
| \`comentario\` | TEXT | SÍ | | NULL | Justificación del cambio o respuesta. |
| \`fecha\` | DATETIME | NO | | CURRENT_TIMESTAMP | Estampa de tiempo exacta. |
`;

// Guardar data_general_docs.js
fs.writeFileSync(generalDocsPath, `module.exports = ${JSON.stringify(generalDocs, null, 2)};\n`, 'utf8');
console.log('✅ Actualizado data_general_docs.js con las especificaciones de la expansión.');

// 3. Modificar build_monolithic_srs.js para que refleje la versión v4.0 y los 48 casos de uso
let buildContent = fs.readFileSync(path.resolve(__dirname, 'build_monolithic_srs.js'), 'utf8');
buildContent = buildContent.replace(
  "| **Versión del Documento:** | 3.2 (SRS Monolítico Maestro Integral · Rama DEV) |",
  "| **Versión del Documento:** | 4.0 (SRS Monolítico Maestro Integral — Expansión de 6 Nuevos Módulos Académicos · Rama DEV) |"
);
buildContent = buildContent.replace(
  "| **v3.2** | 17/11/2026 | Anyely Valeria | **Consolidación Monolítica Maestra**",
  "| **v4.0** | 18/11/2026 | Anyely Valeria | **Expansión Integral de EDUNOVA**: Incorporación de los 6 nuevos módulos requeridos (Calendario Académico, Perfil Académico 360°, Sistema de Alertas Tempranas, Aula Virtual LMS, Gestión de Ambientes y Centro de Solicitudes), ampliando la base de datos a 35 entidades relacionales, catálogo a 48 Casos de Uso (CU-001 a CU-048) y 48 Requisitos Funcionales (RF-001 a RF-048) bajo estándar IEEE 830 / ISO 29148.\\n| **v3.2** | 17/11/2026 | Anyely Valeria | **Consolidación Monolítica Maestra**"
);
buildContent = buildContent.replace(
  "11. [SECCIÓN 11: ESPECIFICACIÓN DETALLADA DE LOS 36 CASOS DE USO (CU-001 a CU-036)]",
  "11. [SECCIÓN 11: ESPECIFICACIÓN DETALLADA DE LOS 48 CASOS DE USO (CU-001 a CU-048)]"
);
buildContent = buildContent.replace(
  "## SECCIÓN 11: ESPECIFICACIÓN DETALLADA DE LOS 36 CASOS DE USO",
  "## SECCIÓN 11: ESPECIFICACIÓN DETALLADA DE LOS 48 CASOS DE USO"
);
buildContent = buildContent.replace(
  "cada uno de los 36 casos de uso del sistema EDUNOVA",
  "cada uno de los 48 casos de uso del sistema EDUNOVA (incluyendo los módulos de expansión CU-037 a CU-048)"
);

fs.writeFileSync(path.resolve(__dirname, 'build_monolithic_srs.js'), buildContent, 'utf8');

console.log('🔄 Ejecutando compilación final del SRS monolítico...');
require('./build_monolithic_srs.js');
