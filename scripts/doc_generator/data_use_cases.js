/**
 * Módulo de Definición Detallada de Casos de Uso (CU-001 a CU-036)
 * Estándar IEEE 830 / ISO/IEC/IEEE 29148
 */

const useCases = [
  // ==========================================
  // AUTENTICACIÓN Y PERFIL (CU-001 a CU-004)
  // ==========================================
  {
    id: "CU-001",
    nombre: "Autenticación de Usuario en la Plataforma",
    modulo: "Seguridad y Autenticación",
    descripcion: "Permite a un usuario autenticarse en EDUNOVA mediante sus credenciales institucionales (correo y contraseña) para acceder al dashboard y módulos según su rol RBAC.",
    actores: { principal: "Usuario (Cualquier Rol: Administrador, Instructor, Aprendiz)", secundario: "Servicio de Autenticación JWT / Base de Datos" },
    precondiciones: ["El usuario debe estar previamente registrado en la tabla USUARIO.", "El estado del usuario debe ser ACTIVO.", "El cliente debe contar con conexión HTTP a la API REST."],
    trigger: "El usuario ingresa al formulario de inicio de sesión (/login) e introduce sus credenciales.",
    flujoPrincipal: [
      "El usuario accede a la pantalla de autenticación de EDUNOVA.",
      "El usuario ingresa su correo electrónico institucional y su contraseña.",
      "El usuario hace clic en el botón 'Iniciar Sesión'.",
      "El cliente frontend valida la presencia y formato de los campos.",
      "El cliente envía una solicitud HTTP POST a /api/auth/login con el payload { correo, password }.",
      "El controlador auth.controller consulta el registro del usuario en la tabla USUARIO mediante Prisma ORM.",
      "El sistema verifica que el usuario exista y tenga estado ACTIVO.",
      "El sistema compara la contraseña recibida contra el password_hash almacenado mediante bcrypt.compare().",
      "Al ser válida, el sistema genera un token JWT firmado con el algoritmo HS256 conteniendo id_usuario, correo, rol y fecha de expiración (24h).",
      "El sistema registra el inicio de sesión en HISTORIAL_AUDITORIA.",
      "El servidor responde con estado HTTP 200 y el objeto { token, usuario }.",
      "El frontend almacena el token en localStorage/memoria y redirige al dashboard correspondiente al rol."
    ],
    flujosAlternativos: [
      "4a. El usuario utiliza credenciales de cuenta demo preconfigurada: El sistema carga instantáneamente el usuario correspondiente y navega al entorno correspondiente."
    ],
    flujosExcepcion: [
      "6a. El correo electrónico no existe en la base de datos: El servidor responde HTTP 401 Unauthorized ('Credenciales inválidas').",
      "7a. El usuario existe pero su estado es INACTIVO: El servidor responde HTTP 403 Forbidden ('Usuario inactivo, contacte al administrador').",
      "8a. La contraseña no coincide con el hash: El servidor responde HTTP 401 Unauthorized ('Credenciales inválidas'). El frontend muestra notificación de error."
    ],
    postcondiciones: { exito: "Sesión iniciada, token JWT almacenado en cliente, usuario en dashboard.", fallo: "Acceso denegado, permanece en vista de login con mensaje descriptivo de error." },
    reglasNegocio: ["RN-001: La contraseña nunca se transmite ni compara en texto plano; se usa bcrypt con 10 rondas.", "RN-002: El token JWT expira en 24 horas y debe incluir el rol explícito.", "RN-003: Solo usuarios con estado ACTIVO pueden acceder al sistema."],
    datosInvolucrados: { entradas: "correo (String, requerido), password (String, requerido)", salidas: "token (JWT String), usuario: { id_usuario, nombre, apellido, correo, rol }" },
    permisos: "Público (no requiere token previo).",
    criteriosAceptacion: "El usuario debe quedar autenticado en menos de 500 ms; las contraseñas erróneas deben ser rechazadas sin dar detalles de si falló el correo o la contraseña.",
    relacionesUML: "<<include>> Validar Credenciales Bcrypt, <<include>> Emitir Token JWT, <<include>> Registrar Auditoría."
  },
  {
    id: "CU-002",
    nombre: "Cierre de Sesión Seguro (Logout)",
    modulo: "Seguridad y Autenticación",
    descripcion: "Permite al usuario finalizar su sesión activa de forma segura, eliminando los tokens de persistencia en el cliente y notificando al servidor para auditoría.",
    actores: { principal: "Usuario Autenticado", secundario: "Manejador de Estado del Frontend" },
    precondiciones: ["El usuario debe tener una sesión activa con token JWT válido."],
    trigger: "El usuario hace clic en el botón 'Cerrar Sesión' en la barra de navegación o menú de perfil.",
    flujoPrincipal: [
      "El usuario selecciona la opción 'Cerrar Sesión'.",
      "El cliente muestra confirmación o procede al cierre inmediato.",
      "El cliente elimina el token JWT y los datos de usuario de localStorage y del estado global.",
      "El cliente envía solicitud opcional de desautenticación para registro en HISTORIAL_AUDITORIA.",
      "El cliente redirige automáticamente a la pantalla de /login con mensaje de confirmación."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [
      "3a. Error de red durante la notificación al servidor: El frontend purga de todos modos los tokens locales y fuerza la redirección a /login garantizando la seguridad en el dispositivo."
    ],
    postcondiciones: { exito: "Token eliminado, contexto de sesión reiniciado, vista redirigida a login.", fallo: "Ninguno (la purga local es infalible)." },
    reglasNegocio: ["RN-004: Ningún dato sensible de la sesión anterior debe quedar en memoria tras el logout."],
    datosInvolucrados: { entradas: "Ninguna", salidas: "Mensaje de confirmación" },
    permisos: "Todos los roles autenticados.",
    criteriosAceptacion: "El usuario no puede acceder a rutas privadas pulsando el botón 'Atrás' del navegador tras cerrar sesión.",
    relacionesUML: "Generalización del comportamiento de salida del sistema."
  },
  {
    id: "CU-003",
    nombre: "Solicitud de Restablecimiento de Contraseña [Propuesto / Mock]",
    modulo: "Seguridad y Autenticación",
    descripcion: "Permite al usuario que ha olvidado su clave solicitar un enlace seguro de recuperación por correo electrónico.",
    actores: { principal: "Usuario", secundario: "Servicio de Correo Electrónico (Mock en DEV)" },
    precondiciones: ["El usuario debe tener una cuenta registrada con correo institucional."],
    trigger: "El usuario pulsa el enlace '¿Olvidaste tu contraseña?' en la pantalla de login.",
    flujoPrincipal: [
      "El usuario ingresa su correo electrónico en el formulario de recuperación.",
      "El usuario hace clic en 'Enviar Enlace'.",
      "El servidor valida si el correo existe en la base de datos.",
      "El sistema genera un token criptográfico temporal de un solo uso con caducidad de 1 hora.",
      "El servidor registra la solicitud y simula el despacho por consola en entorno DEV (o envía correo en producción).",
      "El sistema muestra al usuario un mensaje confirmando el envío de instrucciones."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [
      "3a. El correo no existe: El sistema muestra el mismo mensaje de confirmación para evitar enumeración de correos por agentes maliciosos."
    ],
    postcondiciones: { exito: "Token temporal generado y correo despachado.", fallo: "Notificación de error de conexión." },
    reglasNegocio: ["RN-005: El token de recuperación tiene validez máxima de 60 minutos.", "RN-006: No se debe revelar la existencia o no de una cuenta en el formulario de recuperación."],
    datosInvolucrados: { entradas: "correo (String)", salidas: "mensaje de confirmación" },
    permisos: "Público.",
    criteriosAceptacion: "El sistema genera un token seguro sin exponer datos confidenciales.",
    relacionesUML: "<<extend>> CU-001 (Iniciar Sesión)"
  },
  {
    id: "CU-004",
    nombre: "Consulta y Actualización de Perfil de Usuario",
    modulo: "Usuarios y Perfiles",
    descripcion: "Permite a los usuarios consultar sus datos personales y actualizar su información de contacto (teléfono) o cambiar su contraseña.",
    actores: { principal: "Usuario Autenticado", secundario: "Base de Datos (USUARIO, APRENDIZ, INSTRUCTOR)" },
    precondiciones: ["Usuario con sesión activa y token JWT válido."],
    trigger: "El usuario accede a la sección 'Mi Perfil' o ajustes de cuenta.",
    flujoPrincipal: [
      "El usuario navega a la vista de perfil.",
      "El frontend solicita los datos del usuario logueado mediante GET /api/auth/perfil.",
      "El servidor consulta las tablas USUARIO y el perfil específico según el rol.",
      "El frontend presenta los datos: nombre, correo, rol, documento, teléfono y especialidad.",
      "El usuario modifica su número telefónico y pulsa 'Guardar Cambios'.",
      "El servidor actualiza el registro correspondiente y responde HTTP 200.",
      "El frontend actualiza el estado local y muestra mensaje de éxito."
    ],
    flujosAlternativos: [
      "5a. El usuario decide cambiar su contraseña: Ingresa contraseña actual y nueva; el servidor valida la anterior y almacena el nuevo hash Bcrypt."
    ],
    flujosExcepcion: [
      "5a.1 La contraseña actual es incorrecta: El servidor responde HTTP 400 ('La contraseña actual no coincide')."
    ],
    postcondiciones: { exito: "Datos de contacto o contraseña actualizados en BD.", fallo: "Datos conservan su estado original." },
    reglasNegocio: ["RN-007: El correo electrónico y documento no son editables por el propio usuario sin autorización administrativa."],
    datosInvolucrados: { entradas: "telefono, password_actual, password_nueva", salidas: "objeto de usuario actualizado" },
    permisos: "Todos los roles autenticados (acceso restringido a sus propios datos).",
    criteriosAceptacion: "Las modificaciones se reflejan en tiempo real en la interfaz.",
    relacionesUML: "Asociación directa con USUARIO y entidades de perfil."
  },

  // ==========================================
  // ADMINISTRACIÓN ACADÉMICA BASE (CU-005 a CU-010)
  // ==========================================
  {
    id: "CU-005",
    nombre: "Gestión Administrativa de Usuarios",
    modulo: "Administración Base",
    descripcion: "Permite al Administrador registrar nuevos usuarios, listar las cuentas existentes con filtros por rol y estado, y activar o suspender usuarios.",
    actores: { principal: "Administrador", secundario: "Base de Datos" },
    precondiciones: ["Usuario autenticado con rol ADMIN."],
    trigger: "El Administrador ingresa al módulo de 'Usuarios' en el panel lateral.",
    flujoPrincipal: [
      "El Administrador ingresa a la vista de gestión de usuarios.",
      "El frontend carga la lista de usuarios desde GET /api/usuarios.",
      "El Administrador visualiza la tabla con nombre, correo, rol, estado y fecha de registro.",
      "El Administrador pulsa 'Nuevo Usuario' y diligencia: nombre, apellido, correo, contraseña, rol y datos de perfil.",
      "El frontend valida los campos y envía POST /api/usuarios.",
      "El servidor valida que el correo no esté duplicado, hashea la clave con bcrypt y crea el registro con su extensión (APRENDIZ o INSTRUCTOR) en una transacción.",
      "El servidor responde HTTP 201 y el frontend añade el usuario a la lista visualmente."
    ],
    flujosAlternativos: [
      "3a. El Administrador cambia el estado de un usuario de ACTIVO a INACTIVO con un solo clic: El servidor actualiza el estado en USUARIO."
    ],
    flujosExcepcion: [
      "6a. El correo ya se encuentra registrado: El servidor responde HTTP 409 Conflict ('El correo ya está en uso')."
    ],
    postcondiciones: { exito: "Nuevo usuario persistido en MySQL e indexado.", fallo: "No se crea el usuario; se informa el error." },
    reglasNegocio: ["RN-008: Cada correo electrónico debe ser único en la tabla USUARIO.", "RN-009: Un aprendiz debe tener documento de identidad único."],
    datosInvolucrados: { entradas: "nombre, apellido, correo, password, rol, documento/especialidad", salidas: "lista de usuarios o usuario creado" },
    permisos: "Exclusivo para rol ADMIN.",
    criteriosAceptacion: "Paginación y filtrado reactivo de usuarios en menos de 300 ms.",
    relacionesUML: "<<include>> Validar Unicidad de Correo."
  },
  {
    id: "CU-006",
    nombre: "Administración de Programas de Formación",
    modulo: "Administración Base",
    descripcion: "Permite al Administrador crear, actualizar y consultar los programas de formación técnica y tecnológica del SENA.",
    actores: { principal: "Administrador", secundario: "Base de Datos (PROGRAMA)" },
    precondiciones: ["Usuario autenticado con rol ADMIN."],
    trigger: "El Administrador navega a la pestaña 'Programas' en la barra de gestión.",
    flujoPrincipal: [
      "El Administrador accede al panel de programas.",
      "El sistema consulta GET /api/programas y renderiza el catálogo.",
      "El Administrador pulsa 'Crear Programa' e ingresa código (ej: '228106'), nombre y descripción.",
      "El servidor verifica la unicidad del código y persiste el registro en PROGRAMA.",
      "El sistema muestra el programa en estado ACTIVO y disponible para asociarle cursos y competencias."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [
      "4a. Código de programa duplicado: HTTP 409 ('El código de programa ya existe')."
    ],
    postcondiciones: { exito: "Programa registrado y disponible en el catálogo.", fallo: "Error visual y persistencia abortada." },
    reglasNegocio: ["RN-010: El código de programa debe ser único nacionalmente."],
    datosInvolucrados: { entradas: "codigo, nombre, descripcion", salidas: "id_programa, fecha_creacion" },
    permisos: "Creación/Edición: ADMIN. Consulta: Todos los roles.",
    criteriosAceptacion: "El programa se lista instantáneamente en los selectores de creación de fichas.",
    relacionesUML: "Composición con CURSO y COMPETENCIA."
  },
  {
    id: "CU-007",
    nombre: "Administración de Cursos / Fichas de Caracterización",
    modulo: "Administración Base",
    descripcion: "Permite al Administrador aperturar y configurar fichas de caracterización vinculadas a un programa formativo.",
    actores: { principal: "Administrador", secundario: "Base de Datos (CURSO, PROGRAMA)" },
    precondiciones: ["Debe existir al menos un programa de formación ACTIVO.", "Rol ADMIN autenticado."],
    trigger: "El Administrador selecciona 'Crear Ficha / Curso'.",
    flujoPrincipal: [
      "El Administrador abre el formulario de registro de curso.",
      "Selecciona el programa de formación de un menú desplegable.",
      "Diligencia el nombre/código de ficha (ej: 'ADSO 2874102'), descripción, fecha de inicio y fecha de finalización.",
      "Hace clic en 'Guardar Ficha'.",
      "El servidor valida las fechas (fecha_fin > fecha_inicio) y registra el curso en la tabla CURSO.",
      "El frontend actualiza la cuadrícula de fichas activas."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [
      "5a. Fecha de finalización anterior a la fecha de inicio: HTTP 400 ('La fecha de fin no puede ser previa al inicio')."
    ],
    postcondiciones: { exito: "Ficha creada en estado ACTIVO.", fallo: "Formulario retiene datos para corrección." },
    reglasNegocio: ["RN-011: Toda ficha debe estar indefectiblemente asociada a un programa de formación."],
    datosInvolucrados: { entradas: "id_programa, nombre, descripcion, fecha_inicio, fecha_fin", salidas: "id_curso, estado" },
    permisos: "ADMIN.",
    criteriosAceptacion: "La ficha se crea y permite inmediatamente la inscripción de aprendices.",
    relacionesUML: "<<include>> Validar Rango de Fechas."
  },
  {
    id: "CU-008",
    nombre: "Asignación de Instructores a Fichas de Formación",
    modulo: "Administración Base",
    descripcion: "Permite al Administrador vincular uno o varios instructores a una ficha de formación para que puedan orientar competencias y calificar.",
    actores: { principal: "Administrador", secundario: "Base de Datos (CURSO_INSTRUCTOR)" },
    precondiciones: ["Ficha existente en estado ACTIVO.", "Instructor registrado en la plataforma."],
    trigger: "El Administrador hace clic en 'Asignar Instructor' dentro del detalle de una ficha.",
    flujoPrincipal: [
      "El Administrador visualiza la lista de instructores disponibles.",
      "Selecciona el instructor deseado para la ficha activa.",
      "Confirma la asignación.",
      "El servidor crea la tupla en CURSO_INSTRUCTOR verificando que no exista duplicidad previa.",
      "El instructor queda vinculado y recibe acceso a la gestión pedagógica de la ficha."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [
      "4a. El instructor ya estaba asignado a dicha ficha: El sistema responde sin error pero no duplica el registro (restricción UNIQUE uk_curso_instructor)."
    ],
    postcondiciones: { exito: "Relación instructor-ficha creada en MySQL.", fallo: "No se altera la asignación." },
    reglasNegocio: ["RN-012: Una ficha puede tener múltiples instructores; un instructor puede estar asignado a múltiples fichas."],
    datosInvolucrados: { entradas: "id_curso, id_instructor", salidas: "id_curso_instructor, fecha_asignacion" },
    permisos: "ADMIN.",
    criteriosAceptacion: "El instructor visualiza la ficha en su panel inmediatamente después de la asignación.",
    relacionesUML: "Asociación N:M entre CURSO e INSTRUCTOR."
  },
  {
    id: "CU-009",
    nombre: "Matrícula e Inscripción de Aprendices en Cursos",
    modulo: "Administración Base",
    descripcion: "Permite vincular a un aprendiz en una ficha formativa, habilitando su participación en evidencias, asistencias y competencias.",
    actores: { principal: "Administrador", secundario: "Base de Datos (INSCRIPCION)" },
    precondiciones: ["El aprendiz debe existir en la tabla APRENDIZ.", "La ficha debe estar ACTIVA."],
    trigger: "El Administrador registra la inscripción del aprendiz en un curso.",
    flujoPrincipal: [
      "El Administrador ingresa al módulo de inscripciones de la ficha.",
      "Busca al aprendiz por número de documento o nombre.",
      "Confirma la acción 'Matricular Aprendiz'.",
      "El servidor inserta el registro en INSCRIPCION con estado ACTIVO.",
      "El servidor inicializa automáticamente los registros base de competencias en SEGUIMIENTO_COMPETENCIA para el aprendiz.",
      "El aprendiz queda formalmente matriculado y visible en las planillas de asistencia y listas del instructor."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [
      "4a. El aprendiz ya se encuentra matriculado en esa misma ficha: HTTP 409 ('El aprendiz ya está inscrito en este curso')."
    ],
    postcondiciones: { exito: "Matrícula asentada y registros de seguimiento inicializados.", fallo: "No se asienta la matrícula." },
    reglasNegocio: ["RN-013: Un aprendiz no puede tener dos inscripciones activas simultáneas en la misma ficha (uk_aprendiz_curso)."],
    datosInvolucrados: { entradas: "id_aprendiz, id_curso", salidas: "id_inscripcion, fecha_inscripcion" },
    permisos: "ADMIN.",
    criteriosAceptacion: "El aprendiz puede ingresar a ver la ficha inmediatamente.",
    relacionesUML: "<<include>> Inicializar Seguimiento de Competencias."
  },
  {
    id: "CU-010",
    nombre: "Consulta de Estadísticas Globales del Dashboard",
    modulo: "Dashboard y Métricas",
    descripcion: "Proporciona una vista consolidada en tiempo real de los indicadores clave del centro: total de aprendices, instructores, fichas, tasa de aprobación y alertas activas.",
    actores: { principal: "Administrador / Directivo", secundario: "Servicio de Cache y Métricas" },
    precondiciones: ["Usuario con rol ADMIN autenticado."],
    trigger: "El usuario carga la pantalla principal del Dashboard.",
    flujoPrincipal: [
      "El usuario ingresa al Dashboard principal.",
      "El frontend solicita las métricas agregadas al backend.",
      "El backend ejecuta consultas optimizadas con índices (o lee de memoria si está cacheado).",
      "Se calculan los totales: total_aprendices, total_instructores, fichas_activas, asistencias_promedio y competencias_aprobadas.",
      "El frontend renderiza las tarjetas estadísticas Glassmorphism y gráficos de rendimiento."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [],
    postcondiciones: { exito: "Indicadores desplegados con latencia < 300 ms.", fallo: "Mensaje de reintento de conexión." },
    reglasNegocio: ["RN-014: Las métricas deben reflejar el estado vivo de la base de datos MySQL 8."],
    datosInvolucrados: { entradas: "Ninguna", salidas: "kpis: { aprendices, instructores, fichas, promedioAsistencia, tasaAprobacion }" },
    permisos: "ADMIN (métricas globales); INSTRUCTOR (métricas de sus fichas).",
    criteriosAceptacion: "Tiempo de carga de métricas inferior a 400 ms.",
    relacionesUML: "Agregación de datos transversales."
  },

  // ==========================================
  // MÓDULO 1: COMPETENCIAS Y RAPS (CU-011 a CU-014)
  // ==========================================
  {
    id: "CU-011",
    nombre: "Consulta de Competencias y Resultados de Aprendizaje por Programa",
    modulo: "Módulo 1: Seguimiento por Competencias",
    descripcion: "Permite listar las competencias laborales y sus RAPs asociados pertenecientes a un programa formativo.",
    actores: { principal: "Instructor / Aprendiz / Administrador", secundario: "Base de Datos (COMPETENCIA, RESULTADO_APRENDIZAJE)" },
    precondiciones: ["Programa de formación existente con competencias creadas."],
    trigger: "El usuario selecciona un programa o ficha en el módulo de Competencias.",
    flujoPrincipal: [
      "El usuario selecciona la ficha o programa a consultar.",
      "El cliente invoca GET /api/competencias/programa/:id_programa.",
      "El backend consulta las competencias y anida sus Resultados de Aprendizaje mediante include de Prisma.",
      "El frontend presenta la jerarquía de competencias con su código, nombre, horas y listado de RAPs."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [],
    postcondiciones: { exito: "Catálogo curricular renderizado en pantalla.", fallo: "Aviso de lista vacía." },
    reglasNegocio: ["RN-015: Cada competencia debe tener al menos un RAP asociado para ser evaluable."],
    datosInvolucrados: { entradas: "id_programa", salidas: "Array de competencias con sus RAPs" },
    permisos: "Todos los roles autenticados.",
    criteriosAceptacion: "Presentación clara de código y nombre formal de la competencia.",
    relacionesUML: "Composición entre COMPETENCIA y RESULTADO_APRENDIZAJE."
  },
  {
    id: "CU-012",
    nombre: "Consulta de Estado de Competencias por Aprendiz",
    modulo: "Módulo 1: Seguimiento por Competencias",
    descripcion: "Permite visualizar el avance detallado, porcentaje de logro y juicio evaluativo de cada competencia para un aprendiz específico.",
    actores: { principal: "Aprendiz / Instructor", secundario: "Base de Datos (SEGUIMIENTO_COMPETENCIA)" },
    precondiciones: ["Aprendiz matriculado en la ficha activa."],
    trigger: "El aprendiz hace clic en 'Mis Competencias' o el instructor inspecciona a un aprendiz.",
    flujoPrincipal: [
      "El usuario accede a la vista de seguimiento individual.",
      "El cliente solicita GET /api/competencias/seguimiento/:id_inscripcion.",
      "El servidor recopila los registros de SEGUIMIENTO_COMPETENCIA.",
      "El frontend calcula la barra de progreso global y lista cada competencia con su badge de estado (PENDIENTE, EN_DESARROLLO, EN_EVALUACION, APROBADA, REQUIERE_REFUERZO).",
      "El usuario puede hacer clic en una competencia para ver el instructor evaluador, fecha y observaciones."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [],
    postcondiciones: { exito: "Expediente de competencias desplegado.", fallo: "Error de consulta informado." },
    reglasNegocio: ["RN-016: Los aprendices únicamente pueden consultar sus propios seguimientos; los instructores pueden consultar a cualquier aprendiz de sus fichas."],
    datosInvolucrados: { entradas: "id_inscripcion", salidas: "competencias con porcentajes y estados" },
    permisos: "APRENDIZ (propio), INSTRUCTOR, ADMIN.",
    criteriosAceptacion: "Visualización de badges de color exactos según el estado.",
    relacionesUML: "Asociación con INSCRIPCION y COMPETENCIA."
  },
  {
    id: "CU-013",
    nombre: "Monitoreo Grupal de Progreso por Ficha de Caracterización",
    modulo: "Módulo 1: Seguimiento por Competencias",
    descripcion: "Permite al instructor o directivo obtener una vista de matriz o resumen del porcentaje de aprobación de competencias de todo el grupo.",
    actores: { principal: "Instructor / Administrador", secundario: "Base de Datos" },
    precondiciones: ["Ficha con aprendices matriculados."],
    trigger: "El instructor pulsa 'Monitoreo Grupal de Ficha' en el módulo de competencias.",
    flujoPrincipal: [
      "El instructor selecciona la ficha de caracterización.",
      "El sistema agrupa los seguimientos de todos los aprendices inscritos.",
      "Se calcula el promedio de avance grupal y el porcentaje de aprendices con competencias aprobadas vs. en refuerzo.",
      "Se despliega la tabla comparativa con indicadores visuales de semáforo."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [],
    postcondiciones: { exito: "Métricas grupales desplegadas.", fallo: "Aviso de ficha sin inscripciones." },
    reglasNegocio: ["RN-017: Permite identificar de inmediato la necesidad de convocar a comités de evaluación."],
    datosInvolucrados: { entradas: "id_curso", salidas: "resumen_grupal: { total, promedio_avance, aprendices_en_refuerzo }" },
    permisos: "INSTRUCTOR, ADMIN.",
    criteriosAceptacion: "Cálculo instantáneo sin recargar la página.",
    relacionesUML: "Agregación de datos grupales."
  },
  {
    id: "CU-014",
    nombre: "Evaluación de Competencia y Registro de Trazabilidad en Historial",
    modulo: "Módulo 1: Seguimiento por Competencias",
    descripcion: "Permite al instructor asentar un juicio evaluativo sobre una competencia para un aprendiz, actualizando el estado y guardando un registro histórico inmutable.",
    actores: { principal: "Instructor", secundario: "Base de Datos (SEGUIMIENTO_COMPETENCIA, HISTORIAL_SEGUIMIENTO)" },
    precondiciones: ["Instructor asignado a la ficha del aprendiz.", "Competencia previamente vinculada al programa."],
    trigger: "El instructor hace clic en 'Evaluar Competencia' dentro de la ficha del aprendiz.",
    flujoPrincipal: [
      "El instructor abre el modal de evaluación para una competencia de un aprendiz.",
      "Selecciona el nuevo estado: PENDIENTE, EN_DESARROLLO, EN_EVALUACION, APROBADA o REQUIERE_REFUERZO.",
      "Ingresa el porcentaje de avance (0 a 100%) y las observaciones pedagógicas.",
      "Pulsa 'Registrar Juicio Evaluativo'.",
      "El backend ejecuta una transacción en Prisma que: actualiza SEGUIMIENTO_COMPETENCIA con fecha y nota, e inserta una tupla en HISTORIAL_SEGUIMIENTO guardando estado_anterior, estado_nuevo, motivo y usuario_responsable.",
      "Si el estado asignado es REQUIERE_REFUERZO, el sistema dispara automáticamente una notificación interna al aprendiz (CU-034).",
      "El servidor responde HTTP 200 y el frontend refresca el estado en la interfaz."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [
      "5a. Porcentaje fuera de rango (< 0 o > 100): HTTP 400 ('El porcentaje debe estar entre 0 y 100')."
    ],
    postcondiciones: { exito: "Competencia evaluada y trazabilidad histórica auditada en MySQL.", fallo: "Transacción abortada sin alterar el estado previo." },
    reglasNegocio: ["RN-018: Ningún cambio de estado puede omitir la inserción en HISTORIAL_SEGUIMIENTO.", "RN-019: La aprobación exige un avance igual o superior al 70.0% según criterio pedagógico."],
    datosInvolucrados: { entradas: "id_seguimiento, estado, porcentaje_avance, observaciones", salidas: "seguimiento actualizado" },
    permisos: "Exclusivo para rol INSTRUCTOR y ADMIN.",
    criteriosAceptacion: "El historial muestra el autor, fecha y hora exacta del juicio de inmediato.",
    relacionesUML: "<<include>> Guardar en Historial Inmutable, <<extend>> Disparar Alerta de Refuerzo."
  },

  // ==========================================
  // MÓDULO 2: GESTIÓN DE EVIDENCIAS (CU-015 a CU-018)
  // ==========================================
  {
    id: "CU-015",
    nombre: "Creación y Publicación de Evidencia de Aprendizaje",
    modulo: "Módulo 2: Gestión de Evidencias",
    descripcion: "Permite al instructor crear una nueva evidencia o taller asociada a un curso y un RAP, definiendo instrucciones, ponderación y fecha límite de entrega.",
    actores: { principal: "Instructor", secundario: "Base de Datos (EVIDENCIA)" },
    precondiciones: ["Curso activo asignado al instructor."],
    trigger: "El instructor hace clic en 'Publicar Evidencia' en el módulo de evidencias.",
    flujoPrincipal: [
      "El instructor accede al formulario de creación de evidencias.",
      "Ingresa título de la evidencia (ej: 'Taller 02: Diagrama de Clases UML').",
      "Selecciona el Resultado de Aprendizaje (RAP) que evalúa.",
      "Escribe la descripción, instrucciones detalladas y define el porcentaje de ponderación.",
      "Establece la fecha límite de entrega.",
      "Hace clic en 'Publicar Evidencia'.",
      "El servidor valida los datos e inserta la tupla en EVIDENCIA con estado PUBLICADA.",
      "El servicio de notificaciones genera avisos a todos los aprendices inscritos en la ficha.",
      "La evidencia aparece disponible en la lista de actividades del curso."
    ],
    flujosAlternativos: [
      "6a. El instructor marca la evidencia como BORRADOR para publicarla más tarde: Queda guardada pero oculta para los aprendices."
    ],
    flujosExcepcion: [
      "7a. Fecha límite anterior a la fecha actual: El sistema advierte o permite definirla con indicación de vencida."
    ],
    postcondiciones: { exito: "Evidencia registrada y visible para los aprendices.", fallo: "Evidencia no guardada." },
    reglasNegocio: ["RN-020: La ponderación porcentual debe ser un número positivo mayor a 0."],
    datosInvolucrados: { entradas: "id_curso, id_rap, nombre, descripcion, instrucciones, porcentaje, fecha_limite", salidas: "id_evidencia" },
    permisos: "INSTRUCTOR.",
    criteriosAceptacion: "La evidencia se notifica y se lista en el tablero de los aprendices de la ficha.",
    relacionesUML: "<<include>> Notificar a Aprendices de la Ficha."
  },
  {
    id: "CU-016",
    nombre: "Consulta de Evidencias Disponibles y Vencimientos por Ficha",
    modulo: "Módulo 2: Gestión de Evidencias",
    descripcion: "Permite a los aprendices e instructores listar las evidencias asignadas, visualizando su estado de entrega, ponderación y días restantes para la fecha límite.",
    actores: { principal: "Aprendiz / Instructor", secundario: "Base de Datos" },
    precondiciones: ["Usuario con sesión activa y ficha seleccionada."],
    trigger: "El usuario navega a la pestaña 'Evidencias'.",
    flujoPrincipal: [
      "El usuario selecciona el curso o ficha.",
      "El cliente solicita GET /api/evidencias/curso/:id_curso.",
      "El backend retorna las evidencias, y para el aprendiz autenticado, incluye el estado de su entrega más reciente (ENTREGADA, CALIFICADA, PENDIENTE).",
      "El frontend categoriza las actividades en: Pendientes, Entregadas y Vencidas con indicadores de tiempo."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [],
    postcondiciones: { exito: "Listado de evidencias renderizado con estados actualizados.", fallo: "Mensaje informativo de no evidencias." },
    reglasNegocio: ["RN-021: El sistema debe resaltar visualmente en color ámbar/rojo las evidencias próximas a vencer en menos de 48 horas."],
    datosInvolucrados: { entradas: "id_curso", salidas: "colección de evidencias con metadatos" },
    permisos: "Todos los roles asignados a la ficha.",
    criteriosAceptacion: "Cálculo preciso del badge de vencimiento.",
    relacionesUML: "Asociación con CURSO y ENTREGA_EVIDENCIA."
  },
  {
    id: "CU-017",
    nombre: "Radicación de Entrega de Evidencia con Versionamiento Progresivo",
    modulo: "Módulo 2: Gestión de Evidencias",
    descripcion: "Permite a un aprendiz radicar su solución o documento a una evidencia. Si ya existía una entrega previa rechazada o con observaciones, el sistema incrementa automáticamente la versión (v1 -> v2 -> v3).",
    actores: { principal: "Aprendiz", secundario: "Base de Datos (ENTREGA_EVIDENCIA)" },
    precondiciones: ["Aprendiz matriculado en la ficha.", "Evidencia en estado PUBLICADA."],
    trigger: "El aprendiz hace clic en 'Subir Solución' en una evidencia.",
    flujoPrincipal: [
      "El aprendiz abre el modal de radicación de evidencia.",
      "Diligencia el enlace o archivo de su solución (archivo_url, archivo_nombre).",
      "Añade un comentario explicativo para el instructor.",
      "Hace clic en 'Enviar Entrega'.",
      "El backend consulta si existen entregas previas para id_evidencia e id_inscripcion.",
      "Si no existen entregas, se asigna version = 1; si existen, se toma el valor máximo y se asigna version = max + 1.",
      "Se inserta la nueva tupla en ENTREGA_EVIDENCIA con estado ENTREGADA y fecha_entrega actual.",
      "Se despacha una notificación al instructor informando la nueva entrega.",
      "El frontend muestra confirmación exitosa con la etiqueta 'Entregado (Versión X)'."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [
      "5a. URL o nombre de archivo vacío: HTTP 400 ('Debe proporcionar el archivo o enlace de la evidencia')."
    ],
    postcondiciones: { exito: "Nueva versión de entrega persistida en MySQL sin sobreescribir el historial previo.", fallo: "No se radican cambios." },
    reglasNegocio: ["RN-022: Las entregas previas nunca se borran; quedan almacenadas para fines de trazabilidad y auditoría pedagógica.", "RN-023: El versionamiento es estrictamente secuencial ascendente."],
    datosInvolucrados: { entradas: "id_evidencia, archivo_nombre, archivo_url, comentario_aprendiz", salidas: "id_entrega, version, fecha_entrega" },
    permisos: "APRENDIZ.",
    criteriosAceptacion: "El historial de versiones se despliega con su fecha respectiva.",
    relacionesUML: "<<include>> Computar Siguiente Versión, <<include>> Notificar al Instructor."
  },
  {
    id: "CU-018",
    nombre: "Calificación y Retroalimentación Pedagógica de Entregas",
    modulo: "Módulo 2: Gestión de Evidencias",
    descripcion: "Permite al instructor revisar la última versión radicada por un aprendiz, asignar una calificación numérica (0.0 a 5.0) y registrar comentarios de retroalimentación pedagógica.",
    actores: { principal: "Instructor", secundario: "Base de Datos (ENTREGA_EVIDENCIA, CALIFICACION)" },
    precondiciones: ["Existe al menos una entrega radicada por el aprendiz."],
    trigger: "El instructor hace clic en 'Calificar' en la bandeja de entregas de la evidencia.",
    flujoPrincipal: [
      "El instructor visualiza la entrega radicada, la versión, el archivo adjunto y el comentario del aprendiz.",
      "Ingresa la nota cuantitativa (ej: 4.5).",
      "Escribe la retroalimentación cualitativa detallando fortalezas y aspectos a mejorar.",
      "Selecciona el dictamen: APROBADA o REQUIERE_CORRECCION.",
      "Hace clic en 'Guardar Calificación'.",
      "El servidor actualiza ENTREGA_EVIDENCIA con la nota, feedback, fecha_evaluacion y evaluador_nombre.",
      "El servidor actualiza o crea el registro correspondiente en la tabla CALIFICACION.",
      "El sistema despacha una notificación inmediata al aprendiz con su resultado.",
      "El frontend actualiza la lista reflejando la nota y badge verde o ámbar."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [
      "5a. Nota fuera del rango permitido (< 0.0 o > 5.0): HTTP 400 ('La calificación debe estar entre 0.0 y 5.0')."
    ],
    postcondiciones: { exito: "Nota y retroalimentación guardadas en MySQL; aprendiz notificado.", fallo: "Calificación no asentada." },
    reglasNegocio: ["RN-024: La escala oficial de calificación es de 0.0 a 5.0 con hasta dos decimales.", "RN-025: Toda calificación menor a 3.5 requiere obligatoriamente retroalimentación escrita."],
    datosInvolucrados: { entradas: "id_entrega, calificacion, retroalimentacion, estado", salidas: "entrega actualizada" },
    permisos: "INSTRUCTOR.",
    criteriosAceptacion: "El aprendiz puede consultar la retroalimentación de forma instantánea.",
    relacionesUML: "<<include>> Actualizar CALIFICACION, <<include>> Notificar al Aprendiz."
  },

  // ==========================================
  // MÓDULO 3: RECUPERACIÓN DE COMPETENCIAS (CU-019 a CU-022)
  // ==========================================
  {
    id: "CU-019",
    nombre: "Identificación de Aprendices en Refuerzo Académico",
    modulo: "Módulo 3: Recuperación de Competencias",
    descripcion: "Permite al instructor consultar de forma filtrada y priorizada a todos los aprendices que tienen competencias en estado 'REQUIERE_REFUERZO' para la formulación de planes de mejoramiento.",
    actores: { principal: "Instructor / Coordinador", secundario: "Base de Datos" },
    precondiciones: ["Existen aprendices con seguimientos en estado REQUIERE_REFUERZO."],
    trigger: "El instructor ingresa al módulo de 'Recuperaciones'.",
    flujoPrincipal: [
      "El instructor accede a la vista de Recuperaciones.",
      "El sistema ejecuta consulta filtrando SEGUIMIENTO_COMPETENCIA donde estado = 'REQUIERE_REFUERZO'.",
      "Se despliega la lista con: nombre del aprendiz, documento, competencia deficitaria, RAP involucrado y fecha del juicio.",
      "El instructor puede filtrar por ficha de formación específica."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [],
    postcondiciones: { exito: "Bandeja de refuerzos desplegada.", fallo: "Mensaje: 'No hay aprendices pendientes de recuperación'." },
    reglasNegocio: ["RN-026: Todo aprendiz con competencia en REQUIERE_REFUERZO tiene derecho reglamentario a plan de mejoramiento previo a comité."],
    datosInvolucrados: { entradas: "id_curso (opcional)", salidas: "lista de aprendices en refuerzo" },
    permisos: "INSTRUCTOR, ADMIN.",
    criteriosAceptacion: "Identificación inmediata de los casos críticos del grupo.",
    relacionesUML: "Lectura especializada de SEGUIMIENTO_COMPETENCIA."
  },
  {
    id: "CU-020",
    nombre: "Asignación de Plan de Recuperación Académica",
    modulo: "Módulo 3: Recuperación de Competencias",
    descripcion: "Permite al instructor formular y asignar un plan de mejoramiento a un aprendiz, especificando la actividad o producto a entregar, fecha límite y criterios.",
    actores: { principal: "Instructor", secundario: "Base de Datos (RECUPERACION)" },
    precondiciones: ["El aprendiz presenta una deficiencia en un RAP/competencia."],
    trigger: "El instructor pulsa 'Asignar Plan de Refuerzo' en la ficha del aprendiz.",
    flujoPrincipal: [
      "El instructor abre el formulario de asignación de recuperación.",
      "Selecciona el RAP y la inscripción del aprendiz.",
      "Escribe la descripción de la actividad de refuerzo pedagógico solicitada.",
      "Define la fecha de inicio y la fecha límite de entrega.",
      "Hace clic en 'Asignar Plan'.",
      "El servidor crea la tupla en RECUPERACION con estado ASIGNADA.",
      "Se dispara una notificación de alta prioridad al aprendiz informando su plan de mejoramiento.",
      "El plan queda registrado y contabilizado en el expediente del aprendiz."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [
      "5a. Fecha límite menor a fecha de inicio: HTTP 400 ('La fecha límite debe ser posterior al inicio')."
    ],
    postcondiciones: { exito: "Plan de recuperación formalmente asentado y notificado.", fallo: "No se crea el plan." },
    reglasNegocio: ["RN-027: El plazo del plan de mejoramiento se acuerda según el reglamento del aprendiz SENA."],
    datosInvolucrados: { entradas: "id_inscripcion, id_rap, actividad_refuerzo, fecha_inicio, fecha_limite", salidas: "id_recuperacion" },
    permisos: "INSTRUCTOR.",
    criteriosAceptacion: "El plan es visible en el dashboard del aprendiz en la sección de refuerzos.",
    relacionesUML: "<<include>> Notificar Asignación de Plan de Mejoramiento."
  },
  {
    id: "CU-021",
    nombre: "Entrega de Actividad de Refuerzo por el Aprendiz",
    modulo: "Módulo 3: Recuperación de Competencias",
    descripcion: "Permite al aprendiz radicar el entregable de su plan de recuperación dentro de los plazos establecidos.",
    actores: { principal: "Aprendiz", secundario: "Base de Datos (RECUPERACION)" },
    precondiciones: ["Plan de recuperación en estado ASIGNADA o EN_PROCESO."],
    trigger: "El aprendiz hace clic en 'Radicar Refuerzo' en su plan de recuperación.",
    flujoPrincipal: [
      "El aprendiz ingresa a su módulo de recuperaciones.",
      "Selecciona el plan asignado y visualiza las instrucciones.",
      "Ingresa el enlace al documento o repositorio con la solución (archivo_entrega) y un comentario.",
      "Pulsa 'Enviar Actividad de Refuerzo'.",
      "El servidor valida que la fecha actual sea menor o igual a fecha_limite.",
      "Actualiza el estado a ENTREGADA y registra fecha_entrega = NOW().",
      "Se emite notificación al instructor responsable."
    ],
    flujosAlternativos: [
      "5a. La fecha límite ya venció: El sistema puede permitir entrega extemporánea marcándola como tal según configuración pedagógica."
    ],
    flujosExcepcion: [
      "4a. Enlace vacío: HTTP 400 ('Debe adjuntar el soporte de su trabajo')."
    ],
    postcondiciones: { exito: "Plan en estado ENTREGADA listo para revisión docente.", fallo: "No se radican cambios." },
    reglasNegocio: ["RN-028: Solo el aprendiz asignado puede radicar la entrega correspondiente."],
    datosInvolucrados: { entradas: "id_recuperacion, archivo_entrega, comentario_entrega", salidas: "estado = ENTREGADA" },
    permisos: "APRENDIZ asignado.",
    criteriosAceptacion: "Confirmación visual inmediata de entrega radicada.",
    relacionesUML: "Mutación de estado en RECUPERACION."
  },
  {
    id: "CU-022",
    nombre: "Evaluación de Recuperación y Auto-Acreditación de Competencia",
    modulo: "Módulo 3: Recuperación de Competencias",
    descripcion: "Permite al instructor calificar la actividad de refuerzo. Si la calificación es aprobatoria (>= 3.5), el sistema auto-acredita automáticamente la competencia asociada, cambiando su estado a APROBADA en SEGUIMIENTO_COMPETENCIA y auditando el cambio.",
    actores: { principal: "Instructor", secundario: "Base de Datos (RECUPERACION, SEGUIMIENTO_COMPETENCIA, HISTORIAL_SEGUIMIENTO)" },
    precondiciones: ["El aprendiz radicó la actividad (estado ENTREGADA)."],
    trigger: "El instructor hace clic en 'Evaluar Plan de Refuerzo'.",
    flujoPrincipal: [
      "El instructor revisa la solución presentada por el aprendiz.",
      "Ingresa la calificación obtenida (0.0 a 5.0) y la retroalimentación.",
      "Hace clic en 'Registrar Dictamen de Refuerzo'.",
      "El servidor evalúa la nota:",
      "Si nota >= 3.5: El estado de RECUPERACION pasa a 'SUPERADA'. En la misma transacción, el sistema busca la competencia vinculada al RAP y actualiza SEGUIMIENTO_COMPETENCIA a estado 'APROBADA' con avance = 100.0%.",
      "Se registra el cambio en HISTORIAL_SEGUIMIENTO con motivo 'Superación de Plan de Mejoramiento'.",
      "Si nota < 3.5: El estado de RECUPERACION pasa a 'PENDIENTE_NUEVA_ACTIVIDAD' y la competencia permanece en 'REQUIERE_REFUERZO'.",
      "Se despacha notificación de resolución al aprendiz.",
      "El frontend refleja el cambio inmediatamente en el expediente del aprendiz."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [
      "4a. Error transaccional en base de datos: Prisma ejecuta rollback completo preservando la coherencia."
    ],
    postcondiciones: { exito: "Recuperación evaluada y competencia auto-acreditada en caso aprobatorio.", fallo: "Transacción revertida." },
    reglasNegocio: ["RN-029: La superación satisfactoria del plan de mejoramiento genera la aprobación inmediata de la competencia sin pasos manuales redundantes."],
    datosInvolucrados: { entradas: "id_recuperacion, calificacion, observacion", salidas: "recuperacion: { estado: 'SUPERADA' }, competencia_actualizada" },
    permisos: "INSTRUCTOR titular.",
    criteriosAceptacion: "El aprendiz pasa automáticamente a figurar con la competencia aprobada en sus reportes.",
    relacionesUML: "<<extend>> Auto-Acreditar Competencia, <<include>> Registrar en Historial Inmutable."
  },

  // ==========================================
  // MÓDULO 4: ASISTENCIA Y NOVEDADES (CU-023 a CU-026)
  // ==========================================
  {
    id: "CU-023",
    nombre: "Programación y Apertura de Sesión de Clase",
    modulo: "Módulo 4: Control de Asistencia",
    descripcion: "Permite al instructor crear una sesión formativa con fecha, horario y tema a desarrollar, aperturando la planilla digital para el llamado a lista.",
    actores: { principal: "Instructor", secundario: "Base de Datos (SESION_CLASE)" },
    precondiciones: ["Instructor asignado a la ficha formativa."],
    trigger: "El instructor hace clic en 'Nueva Sesión de Clase'.",
    flujoPrincipal: [
      "El instructor selecciona la ficha y pulsa 'Aperturar Sesión'.",
      "Ingresa: fecha (por defecto hoy), hora_inicio, hora_fin y tema de la clase.",
      "Pulsa 'Crear Sesión'.",
      "El servidor inserta el registro en SESION_CLASE.",
      "El servidor pre-genera automáticamente los registros en REGISTRO_ASISTENCIA para todos los aprendices activos de la ficha con estado inicial ASISTIO.",
      "Se despliega la planilla interactiva de asistencia lista para el instructor."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [
      "3a. Sesión duplicada para la misma fecha y ficha: El sistema permite crearla o advierte según configuración."
    ],
    postcondiciones: { exito: "Sesión creada y planilla pre-cargada.", fallo: "Sesión no creada." },
    reglasNegocio: ["RN-030: Toda sesión debe tener fecha y tema curricular explícito."],
    datosInvolucrados: { entradas: "id_curso, fecha, hora_inicio, hora_fin, tema", salidas: "id_sesion" },
    permisos: "INSTRUCTOR.",
    criteriosAceptacion: "La planilla carga con todos los aprendices de la ficha en un solo paso.",
    relacionesUML: "<<include>> Pre-cargar Aprendices en Planilla."
  },
  {
    id: "CU-024",
    nombre: "Toma de Asistencia y Registro de Novedades en Vivo",
    modulo: "Módulo 4: Control de Asistencia",
    descripcion: "Permite al instructor cambiar de manera rápida y táctil los estados de asistencia de los aprendices (ASISTIO, AUSENTE, RETARDO, EXCUSA_PENDIENTE) y guardar observaciones.",
    actores: { principal: "Instructor", secundario: "Base de Datos (REGISTRO_ASISTENCIA, ASISTENCIA)" },
    precondiciones: ["Sesión de clase aperturada."],
    trigger: "El instructor pulsa sobre los botones de estado en la planilla de asistencia.",
    flujoPrincipal: [
      "El instructor revisa la lista de aprendices en la sesión.",
      "Para cada aprendiz, conmuta el estado deseado haciendo clic en los botones estilizados: 'Asistió' (verde), 'Ausente' (rojo), 'Retardo' (ámbar).",
      "Opcionalmente añade una observación textual en el campo adyacente.",
      "Hace clic en 'Guardar Planilla de Asistencia'.",
      "El servidor procesa en batch la actualización de REGISTRO_ASISTENCIA.",
      "El sistema recomputa el porcentaje acumulado de inasistencias de cada aprendiz.",
      "El frontend confirma el guardado exitoso de la sesión."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [],
    postcondiciones: { exito: "Asistencias asentadas y estadísticas recalculadas.", fallo: "Error informado en interfaz." },
    reglasNegocio: ["RN-031: Cada falta no justificada incrementa el conteo de inasistencia del aprendiz."],
    datosInvolucrados: { entradas: "id_sesion, registros: [ { id_inscripcion, estado, observacion } ]", salidas: "confirmación y resumen" },
    permisos: "INSTRUCTOR.",
    criteriosAceptacion: "Permite registrar la asistencia de un grupo de 30 aprendices en menos de 1 minuto.",
    relacionesUML: "<<include>> Recalcular Porcentaje de Asistencia."
  },
  {
    id: "CU-025",
    nombre: "Radicación y Resolución de Justificación de Inasistencia",
    modulo: "Módulo 4: Control de Asistencia",
    descripcion: "Permite a un aprendiz con estado AUSENTE o RETARDO adjuntar una excusa médica o laboral con su soporte digital. Posteriormente, el instructor revisa la solicitud y la aprueba (cambiando el estado a JUSTIFICADA) o la rechaza.",
    actores: { principal: "Aprendiz (Radicación) / Instructor (Resolución)", secundario: "Base de Datos (JUSTIFICACION_ASISTENCIA)" },
    precondiciones: ["Existe un registro de inasistencia para el aprendiz."],
    trigger: "El aprendiz hace clic en 'Justificar Falta' en su módulo de asistencias.",
    flujoPrincipal: [
      "El aprendiz selecciona la inasistencia a justificar.",
      "Ingresa el motivo detallado y el enlace/archivo del soporte médico o constancia laboral.",
      "Pulsa 'Radicar Justificación'.",
      "El servidor crea la tupla en JUSTIFICACION_ASISTENCIA con estado 'PENDIENTE'.",
      "El instructor recibe una notificación en su panel.",
      "El instructor accede a la bandeja de justificaciones, revisa el soporte y pulsa 'Aprobar'.",
      "El servidor actualiza el registro de asistencia a 'JUSTIFICADA' y la justificación a 'APROBADA'.",
      "El sistema descuenta la falta del cómputo crítico del aprendiz y le notifica."
    ],
    flujosAlternativos: [
      "6a. El instructor rechaza la justificación por soporte inválido: El estado queda en RECHAZADA y la falta persiste."
    ],
    flujosExcepcion: [],
    postcondiciones: { exito: "Falta formalmente justificada o denegada con debida justificación.", fallo: "Permanece en estado previo." },
    reglasNegocio: ["RN-032: El plazo reglamentario para radicar excusas es de máximo 3 días hábiles posteriores a la falta."],
    datosInvolucrados: { entradas: "id_registro, motivo, soporte_url", salidas: "id_justificacion, estado" },
    permisos: "Radicación: APRENDIZ. Resolución: INSTRUCTOR.",
    criteriosAceptacion: "El porcentaje de asistencia se recalcula al ser aprobada la justificación.",
    relacionesUML: "<<include>> Recalcular Porcentaje de Asistencia."
  },
  {
    id: "CU-026",
    nombre: "Monitoreo y Disparo de Alertas de Asistencia (< 85%)",
    modulo: "Módulo 4: Control de Asistencia",
    descripcion: "Proceso automatizado del sistema que analiza los registros de asistencia tras cada sesión para detectar aprendices con 3 o más inasistencias consecutivas o con asistencia acumulada inferior al 85%, generando alertas automáticas.",
    actores: { principal: "Servicio de Monitoreo del Sistema", secundario: "Instructor / Coordinador" },
    precondiciones: ["Guardado de una planilla de asistencia."],
    trigger: "Evento post-guardado de asistencia en la API.",
    flujoPrincipal: [
      "El servicio calcula el porcentaje de asistencia: (sesiones_asistidas / total_sesiones) * 100.",
      "Verifica si el aprendiz acumula 3 o más faltas seguidas sin justificar.",
      "Verifica si el porcentaje acumulado es inferior al 85.0%.",
      "Si se cumple alguna condición de riesgo, el sistema crea automáticamente una tupla en NOTIFICACION de categoría 'ASISTENCIA' dirigida al instructor y al aprendiz.",
      "La tarjeta del aprendiz en el dashboard se resalta con el indicador crítico en color rojo."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [],
    postcondiciones: { exito: "Alertas tempranas generadas y notificadas.", fallo: "Ninguno." },
    reglasNegocio: ["RN-033: El umbral del 85% de asistencia es causal reglamentaria SENA para llamado de atención o deserción."],
    datosInvolucrados: { entradas: "id_inscripcion", salidas: "notificaciones de alerta" },
    permisos: "Proceso del Sistema.",
    criteriosAceptacion: "Alerta generada inmediatamente tras registrar la tercera inasistencia.",
    relacionesUML: "<<include>> Despachar Notificación Crítica."
  },

  // ==========================================
  // MÓDULO 5: REPORTES Y AUDITORÍA (CU-027 a CU-030)
  // ==========================================
  {
    id: "CU-027",
    nombre: "Generación de Expediente Académico Individual de Aprendiz",
    modulo: "Módulo 5: Reportes Académicos",
    descripcion: "Permite generar un documento oficial consolidado con el historial completo de un aprendiz: datos personales, programa, ficha, estado de competencias, notas de evidencias y récord de asistencia.",
    actores: { principal: "Instructor / Administrador", secundario: "Motor de Reportes de EDUNOVA" },
    precondiciones: ["Aprendiz matriculado en la base de datos."],
    trigger: "El usuario pulsa 'Expediente Académico' en el perfil del aprendiz o módulo de reportes.",
    flujoPrincipal: [
      "El usuario selecciona al aprendiz a auditar.",
      "El sistema ejecuta consulta agregada en MySQL 8 trayendo: perfil, inscripciones, competencias evaluadas, calificaciones de evidencias y porcentaje de asistencia.",
      "El frontend renderiza la vista oficial formateada con membrete del SENA, marcas institucionales y tablas limpias.",
      "El usuario puede revisar la información en pantalla o enviarla a imprimir en PDF."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [],
    postcondiciones: { exito: "Expediente formal listo para consulta o impresión.", fallo: "Error de consulta informado." },
    reglasNegocio: ["RN-034: El expediente debe reflejar datos 100% consistentes con las tablas de evaluación viva."],
    datosInvolucrados: { entradas: "id_aprendiz o id_inscripcion", salidas: "expediente_completo (JSON / Vista Renderizada)" },
    permisos: "INSTRUCTOR, ADMIN (y APRENDIZ para su propio expediente).",
    criteriosAceptacion: "Carga completa del expediente en menos de 600 ms.",
    relacionesUML: "Consolidación multi-tabla."
  },
  {
    id: "CU-028",
    nombre: "Generación de Dossier Consolidado de Ficha / Curso",
    modulo: "Módulo 5: Reportes Académicos",
    descripcion: "Genera el informe grupal consolidado de toda una ficha de caracterización para su presentación en comités de evaluación y seguimiento formativo.",
    actores: { principal: "Instructor / Coordinador Académico", secundario: "Motor de Reportes" },
    precondiciones: ["Ficha con aprendices evaluados."],
    trigger: "El usuario pulsa 'Dossier de Ficha' en el módulo de reportes.",
    flujoPrincipal: [
      "El usuario selecciona la ficha de formación.",
      "El sistema calcula las métricas globales del grupo: porcentaje de aprobación, número de aprendices en refuerzo, asistencia promedio de la cohorte.",
      "Genera la sábana de notas agrupada por aprendiz y competencia.",
      "Despliega la vista ejecutiva estructurada para actas de comité."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [],
    postcondiciones: { exito: "Dossier consolidado disponible en pantalla.", fallo: "Aviso de datos insuficientes." },
    reglasNegocio: ["RN-035: El dossier es el documento oficial base para la toma de decisiones en comités de seguimiento."],
    datosInvolucrados: { entradas: "id_curso", salidas: "dossier_grupal" },
    permisos: "INSTRUCTOR, ADMIN.",
    criteriosAceptacion: "Estructura formal con campos para firmas de los instructores miembros del comité.",
    relacionesUML: "Agregación y cálculo estadístico."
  },
  {
    id: "CU-029",
    nombre: "Exportación de Datos Académicos a Formato Excel (CSV UTF-8)",
    modulo: "Módulo 5: Reportes Académicos",
    descripcion: "Permite exportar tablas de calificaciones, asistencias o aprendices a archivos planos CSV con codificación UTF-8 y delimitadores estándar, garantizando compatibilidad con Microsoft Excel y LibreOffice.",
    actores: { principal: "Instructor / Administrador", secundario: "Navegador del Cliente" },
    precondiciones: ["Existen registros en la vista activa."],
    trigger: "El usuario hace clic en el botón 'Exportar a Excel (CSV)'.",
    flujoPrincipal: [
      "El usuario pulsa el botón de exportación en cualquier módulo tabular.",
      "El frontend o backend estructura los datos en formato CSV incorporando el BOM UTF-8 (\\uFEFF) para preservar tildes y caracteres especiales en español.",
      "Se dispara la descarga automática del archivo con nombre descriptivo (ej: 'EDUNOVA_Dossier_Ficha_2874102.csv').",
      "El usuario abre el archivo directamente en Excel sin problemas de codificación."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [],
    postcondiciones: { exito: "Archivo descargado en el dispositivo del usuario.", fallo: "Alerta de exportación vacía." },
    reglasNegocio: ["RN-036: Los encabezados deben ser claros y descriptivos en español."],
    datosInvolucrados: { entradas: "conjunto de datos visible", salidas: "archivo .csv descargable" },
    permisos: "INSTRUCTOR, ADMIN.",
    criteriosAceptacion: "Apertura en Excel sin distorsión de caracteres (ñ, tildes).",
    relacionesUML: "Transformación de formato y descarga cliente."
  },
  {
    id: "CU-030",
    nombre: "Impresión de Reporte Académico en Formato Oficial PDF",
    modulo: "Módulo 5: Reportes Académicos",
    descripcion: "Permite enviar cualquier reporte o expediente directamente al motor de impresión del navegador con estilos optimizados CSS print, ocultando barras de navegación y agregando membrete SENA.",
    actores: { principal: "Todos los Usuarios", secundario: "Motor de Impresión del Sistema Operativo" },
    precondiciones: ["Reporte abierto en pantalla."],
    trigger: "El usuario pulsa 'Imprimir Reporte / PDF'.",
    flujoPrincipal: [
      "El usuario hace clic en el botón con icono de impresora.",
      "Se aplica la hoja de estilos @media print que oculta la barra lateral, botones y fondos oscuros.",
      "Se formatea el documento a fondo blanco con tipografía de alto contraste y saltos de página inteligentes.",
      "Se abre el diálogo nativo de impresión del navegador permitiendo guardar como PDF o imprimir en papel."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [],
    postcondiciones: { exito: "Diálogo de impresión activado.", fallo: "Ninguno." },
    reglasNegocio: ["RN-037: Los documentos impresos deben contener la fecha y hora de emisión para fines legales."],
    datosInvolucrados: { entradas: "DOM del reporte", salidas: "documento impreso / PDF" },
    permisos: "Todos los roles autenticados.",
    criteriosAceptacion: "Documento perfectamente legible y paginado sin elementos residuales de la interfaz web.",
    relacionesUML: "Adaptación de capa de presentación."
  },

  // ==========================================
  // MÓDULO 6: CENTRO DE NOTIFICACIONES (CU-031 a CU-034)
  // ==========================================
  {
    id: "CU-031",
    nombre: "Consulta y Filtrado de Notificaciones del Sistema",
    modulo: "Módulo 6: Notificaciones y Eventos",
    descripcion: "Permite al usuario visualizar sus notificaciones personales categorizadas por tipo (EVIDENCIA, CALIFICACION, ASISTENCIA, RECUPERACION, ALERTA), con badge de no leídas.",
    actores: { principal: "Usuario Autenticado", secundario: "Base de Datos (NOTIFICACION)" },
    precondiciones: ["Sesión activa."],
    trigger: "El usuario hace clic en el icono de campana en la barra superior.",
    flujoPrincipal: [
      "El usuario pulsa el icono de campana.",
      "El frontend solicita GET /api/notificaciones al servidor.",
      "El backend retorna las notificaciones del usuario ordenadas cronológicamente descendente.",
      "El frontend muestra el panel desplegable con contador de no leídas y pestañas de filtro por categoría."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [],
    postcondiciones: { exito: "Bandeja desplegada con notificaciones.", fallo: "Aviso de no notificaciones." },
    reglasNegocio: ["RN-038: Cada usuario únicamente puede leer sus propias notificaciones."],
    datosInvolucrados: { entradas: "id_usuario (extraído del token JWT)", salidas: "lista de notificaciones" },
    permisos: "Todos los roles autenticados.",
    criteriosAceptacion: "El contador de la campana se actualiza en tiempo real.",
    relacionesUML: "Lectura de NOTIFICACION."
  },
  {
    id: "CU-032",
    nombre: "Marcado de Notificación Individual como Leída",
    modulo: "Módulo 6: Notificaciones y Eventos",
    descripcion: "Permite al usuario marcar una notificación específica como leída, o hacerlo automáticamente al hacer clic en su enlace de acción rápida.",
    actores: { principal: "Usuario", secundario: "Base de Datos" },
    precondiciones: ["Notificación en estado leida = false."],
    trigger: "El usuario hace clic sobre una notificación.",
    flujoPrincipal: [
      "El usuario pulsa una notificación en la lista.",
      "El cliente invoca PUT /api/notificaciones/:id/leida.",
      "El servidor actualiza el campo leida = true en la base de datos.",
      "El frontend decrementa el contador de la campana y navega a la sección indicada en el enlace de la notificación."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [],
    postcondiciones: { exito: "Notificación marcada como leída.", fallo: "Estado sin cambios." },
    reglasNegocio: ["RN-039: Al navegar al enlace, la notificación se marca automáticamente."],
    datosInvolucrados: { entradas: "id_notificacion", salidas: "notificación actualizada" },
    permisos: "Dueño de la notificación.",
    criteriosAceptacion: "La notificación pierde el realce visual de no leída al instante.",
    relacionesUML: "Actualización de NOTIFICACION."
  },
  {
    id: "CU-033",
    nombre: "Marcado Masivo de Notificaciones como Leídas",
    modulo: "Módulo 6: Notificaciones y Eventos",
    descripcion: "Permite al usuario limpiar su bandeja marcando todas las notificaciones pendientes como leídas con un solo clic.",
    actores: { principal: "Usuario", secundario: "Base de Datos" },
    precondiciones: ["Existen notificaciones sin leer."],
    trigger: "El usuario hace clic en 'Marcar todas como leídas'.",
    flujoPrincipal: [
      "El usuario pulsa el botón de lectura masiva.",
      "El cliente envía PUT /api/notificaciones/marcar-todas.",
      "El servidor ejecuta updateMany en Prisma estableciendo leida = true para todas las notificaciones del id_usuario.",
      "El contador de la campana pasa a 0 y la lista actualiza su apariencia."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [],
    postcondiciones: { exito: "Todas las notificaciones marcadas como leídas.", fallo: "Error de actualización." },
    reglasNegocio: ["RN-040: La operación solo afecta a las notificaciones del usuario en sesión."],
    datosInvolucrados: { entradas: "id_usuario", salidas: "conteo de actualizadas" },
    permisos: "Todos los roles autenticados.",
    criteriosAceptacion: "El badge numérico desaparece de inmediato.",
    relacionesUML: "Mutación en lote de NOTIFICACION."
  },
  {
    id: "CU-034",
    nombre: "Despacho Automatizado de Notificaciones por Disparador de Evento",
    modulo: "Módulo 6: Notificaciones y Eventos",
    descripcion: "Servicio transversal del backend (notification.service.js) que intercepta eventos formativos (calificaciones, faltas, nuevas evidencias, planes de refuerzo) e inserta automáticamente notificaciones para los destinatarios correspondientes.",
    actores: { principal: "Servicio de Notificaciones y Eventos", secundario: "Usuarios Destinatarios" },
    precondiciones: ["Ocurrencia de un evento calificado en cualquier módulo."],
    trigger: "Llamada a notificationService.crearNotificacion() desde cualquier controlador.",
    flujoPrincipal: [
      "Un controlador completa una transacción de negocio (ej: calificar evidencia o registrar inasistencia).",
      "Invoca el servicio pasando: id_usuario, titulo, mensaje, categoria y enlace.",
      "El servicio inserta la tupla en NOTIFICACION con leida = false y fecha_creacion = NOW().",
      "Si el usuario tiene la aplicación abierta, su cliente detecta la nueva alerta y actualiza el contador."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [],
    postcondiciones: { exito: "Notificación persistida y enrutada.", fallo: "Registro en log de error sin interrumpir la transacción principal." },
    reglasNegocio: ["RN-041: Una falla en el envío de notificación nunca debe abortar la transacción de datos principal."],
    datosInvolucrados: { entradas: "id_usuario, titulo, mensaje, categoria, enlace", salidas: "id_notificacion" },
    permisos: "Servicio interno del Backend.",
    criteriosAceptacion: "Notificación disponible en base de datos en menos de 50 ms.",
    relacionesUML: "<<include>> Creación de Notificación en Módulos 1, 2, 3 y 4."
  },

  // ==========================================
  // MÓDULO 7: EDUNOVA AI CONTEXTUAL (CU-035 a CU-036)
  // ==========================================
  {
    id: "CU-035",
    nombre: "Consulta Contextual al Asistente Académico EDUNOVA AI",
    modulo: "Módulo 7: Asistente Inteligente EDUNOVA AI",
    descripcion: "Permite al aprendiz o instructor interactuar con el asistente virtual inteligente, el cual analiza en tiempo real el contexto de datos vivos de MySQL 8 (promedios, faltas, competencias en refuerzo) para formular recomendaciones personalizadas.",
    actores: { principal: "Aprendiz / Instructor", secundario: "Motor EDUNOVA AI / Base de Datos MySQL 8" },
    precondiciones: ["Usuario con sesión activa."],
    trigger: "El usuario abre la consola del asistente AI y escribe una pregunta o selecciona una sugerencia rápida.",
    flujoPrincipal: [
      "El usuario accede a la consola de EDUNOVA AI.",
      "Elige un comando sugerido (ej: '¿Cuál es mi diagnóstico de riesgo?', '¿Qué competencias tengo pendientes?') o escribe una consulta libre.",
      "El cliente envía POST /api/ai/consulta con el prompt y el token JWT.",
      "El controlador ai.controller consulta el historial real del usuario en MySQL 8: notas promedio, competencias aprobadas vs. en refuerzo y récord de asistencia.",
      "El motor sintetiza el contexto pedagógico y genera una respuesta adaptada, empática y constructiva.",
      "El frontend renderiza el mensaje formateado en markdown en la consola interactiva."
    ],
    flujosAlternativos: [
      "2a. Un instructor consulta sobre su ficha: El asistente provee un resumen del estado del grupo y sugiere planes de mejoramiento."
    ],
    flujosExcepcion: [
      "4a. Error de conexión con el motor cognitivo: Se entrega un diagnóstico analítico directo basado en reglas de contingencia."
    ],
    postcondiciones: { exito: "Recomendación pedagógica generada y visible en pantalla.", fallo: "Mensaje de reintento." },
    reglasNegocio: ["RN-042: El asistente jamás revela información privada de otros aprendices.", "RN-043: Las recomendaciones deben ser estrictamente pedagógicas y motivacionales."],
    datosInvolucrados: { entradas: "prompt (String), contexto_usuario", salidas: "respuesta_ia (String Markdown)" },
    permisos: "Todos los roles autenticados (contexto restringido a su ámbito).",
    criteriosAceptacion: "La respuesta cita datos precisos del avance del aprendiz.",
    relacionesUML: "<<include>> Inyectar Telemetría Real de MySQL 8."
  },
  {
    id: "CU-036",
    nombre: "Streaming en Tiempo Real de Diagnóstico Académico (Token a Token)",
    modulo: "Módulo 7: Asistente Inteligente EDUNOVA AI",
    descripcion: "Permite la transmisión fluida y progresiva de las respuestas del asistente de IA mediante Server-Sent Events (SSE) o lectura de stream HTTP, mejorando la experiencia del usuario al eliminar tiempos de espera perceptibles.",
    actores: { principal: "Usuario Autenticado", secundario: "Stream de Salida de la API" },
    precondiciones: ["Petición al asistente enviada."],
    trigger: "Respuesta en curso desde el backend.",
    flujoPrincipal: [
      "El backend inicia la generación del texto de diagnóstico.",
      "A medida que los fragmentos de texto (tokens) se generan, el servidor los transmite por el canal HTTP sin cerrar la conexión.",
      "El cliente lee el stream y actualiza progresivamente el texto en pantalla con efecto de escritura en vivo.",
      "Al finalizar la respuesta, el servidor cierra el stream y el frontend finaliza la animación del cursor."
    ],
    flujosAlternativos: [],
    flujosExcepcion: [
      "2a. Conexión interrumpida a mitad de transmisión: El cliente conserva el texto recibido hasta ese momento y notifica el corte."
    ],
    postcondiciones: { exito: "Texto renderizado de forma continua y fluida.", fallo: "Texto truncado con botón de reintentar." },
    reglasNegocio: ["RN-044: El primer token debe aparecer en pantalla en menos de 800 ms."],
    datosInvolucrados: { entradas: "Stream HTTP de tokens", salidas: "Texto visual reactivo" },
    permisos: "Todos los roles autenticados.",
    criteriosAceptacion: "Efecto de máquina de escribir fluido sin bloqueos de la interfaz gráfica.",
    relacionesUML: "Optimización de canal de comunicación en CU-035."
  }
];

module.exports = useCases;
