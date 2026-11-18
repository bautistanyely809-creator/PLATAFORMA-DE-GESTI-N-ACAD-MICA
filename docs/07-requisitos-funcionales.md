# 07. REQUISITOS FUNCIONALES Y MATRIZ DE TRAZABILIDAD

## 7.1 Catálogo de Requisitos Funcionales (RF-001 a RF-036)

| Código | Requisito Funcional | Módulo | Prioridad | Actor Principal |
| :--- | :--- | :--- | :--- | :--- |
| **RF-001** | Autenticación de usuarios mediante correo y contraseña con generación de token JWT. | Seguridad / Auth | Crítica | Todos los Roles |
| **RF-002** | Cierre de sesión e invalidación de token de acceso en el cliente. | Seguridad / Auth | Alta | Todos los Roles |
| **RF-003** | Solicitud de restablecimiento de contraseña mediante token seguro [Propuesto]. | Seguridad / Auth | Media | Aprendiz / Instructor |
| **RF-004** | Consulta y actualización de datos de perfil del usuario logueado. | Usuarios / Perfil | Alta | Todos los Roles |
| **RF-005** | Gestión administrativa de usuarios (crear, listar, actualizar estado ACTIVO/INACTIVO).| Administración | Alta | Administrador |
| **RF-006** | Registro y actualización de Programas de Formación y códigos curriculares. | Administración | Alta | Administrador |
| **RF-007** | Creación y mantenimiento de Fichas de Caracterización / Cursos. | Administración | Alta | Administrador |
| **RF-008** | Asignación de instructores a fichas de formación activas. | Administración | Alta | Administrador |
| **RF-009** | Matrícula e inscripción formal de aprendices en fichas específicas. | Administración | Alta | Administrador |
| **RF-010** | Consulta de métricas estadísticas globales en el Dashboard Administrativo. | Dashboard | Alta | Administrador |
| **RF-011** | Consulta de competencias laborales y Resultados de Aprendizaje (RAPs) por programa.| M1: Competencias | Alta | Instructor / Aprendiz |
| **RF-012** | Consulta del avance porcentual y estado de competencias por aprendiz. | M1: Competencias | Alta | Aprendiz / Instructor |
| **RF-013** | Visualización consolidada de avance de competencias a nivel de ficha. | M1: Competencias | Alta | Instructor / Admin |
| **RF-014** | Evaluación de competencias con registro inmutable en el historial de trazabilidad. | M1: Competencias | Crítica | Instructor |
| **RF-015** | Publicación de evidencias de aprendizaje vinculadas a RAPs y cursos. | M2: Evidencias | Alta | Instructor |
| **RF-016** | Consulta y filtrado de evidencias pendientes y vencidas por ficha. | M2: Evidencias | Alta | Aprendiz / Instructor |
| **RF-017** | Radicación de entrega de evidencia con versionamiento automático (`v1, v2...`). | M2: Evidencias | Crítica | Aprendiz |
| **RF-018** | Calificación cuantitativa/cualitativa y retroalimentación de entregas de evidencias. | M2: Evidencias | Crítica | Instructor |
| **RF-019** | Detección y listado de aprendices con competencias en estado "Requiere Refuerzo". | M3: Recuperaciones | Alta | Instructor |
| **RF-020** | Asignación de planes de recuperación académica con fechas límite y actividades. | M3: Recuperaciones | Crítica | Instructor |
| **RF-021** | Envío de actividad de recuperación por parte del aprendiz asignado. | M3: Recuperaciones | Crítica | Aprendiz |
| **RF-022** | Evaluación de actividad de refuerzo y auto-acreditación de la competencia a APROBADA. | M3: Recuperaciones | Crítica | Instructor |
| **RF-023** | Creación y programación de sesiones de clase con fecha, tema y horario. | M4: Asistencia | Alta | Instructor |
| **RF-024** | Registro de asistencia por sesión con estados detallados (Asistió, Ausente, Retardo).| M4: Asistencia | Crítica | Instructor |
| **RF-025** | Radicación y resolución de justificaciones de inasistencia con soporte documental. | M4: Asistencia | Alta | Aprendiz / Instructor |
| **RF-026** | Monitoreo automatizado de alertas por ausencias consecutivas ($ge 3$) y umbral $< 85\%$.| M4: Asistencia | Alta | Sistema / Instructor |
| **RF-027** | Emisión del Expediente Académico Individual del Aprendiz para impresión/PDF. | M5: Reportes | Alta | Instructor / Admin |
| **RF-028** | Generación del Dossier Académico Consolidado de Ficha para comités de evaluación. | M5: Reportes | Alta | Instructor / Admin |
| **RF-029** | Exportación de datos tabulares a formato Excel (.csv compatible UTF-8). | M5: Reportes | Media | Instructor / Admin |
| **RF-030** | Impresión directa formateada en alta resolución con membrete institucional SENA. | M5: Reportes | Media | Todos los Roles |
| **RF-031** | Consulta y categorización de notificaciones del sistema (Evidencias, Asistencia...).| M6: Notificaciones| Alta | Todos los Roles |
| **RF-032** | Marcado individual de notificación como leída. | M6: Notificaciones| Media | Todos los Roles |
| **RF-033** | Marcado masivo de todas las notificaciones pendientes como leídas. | M6: Notificaciones| Media | Todos los Roles |
| **RF-034** | Disparo automatizado de notificaciones al ocurrir eventos académicos críticos. | M6: Notificaciones| Alta | Sistema / Eventos |
| **RF-035** | Consulta interactiva al Asistente Inteligente EDUNOVA AI con datos contextuales. | M7: EDUNOVA AI | Alta | Aprendiz / Instructor |
| **RF-036** | Streaming en tiempo real de recomendaciones y diagnósticos token a token. | M7: EDUNOVA AI | Media | Aprendiz / Instructor |

---

## 7.2 Matriz de Trazabilidad Completa (Requisitos vs. Casos de Uso vs. Tablas vs. Actores)

| RF | Caso de Uso Asociado | Módulo | Tablas de BD Involucradas | Actor Responsable |
| :--- | :--- | :--- | :--- | :--- |
| **RF-001** | [CU-001](04-casos-de-uso/CU-001.md) | Seguridad / Auth | `USUARIO`, `APRENDIZ`, `INSTRUCTOR` | Todos los Usuarios |
| **RF-002** | [CU-002](04-casos-de-uso/CU-002.md) | Seguridad / Auth | `HISTORIAL_AUDITORIA` | Todos los Usuarios |
| **RF-003** | [CU-003](04-casos-de-uso/CU-003.md) | Seguridad / Auth | `USUARIO` | Todos los Usuarios |
| **RF-004** | [CU-004](04-casos-de-uso/CU-004.md) | Perfil | `USUARIO`, `APRENDIZ`, `INSTRUCTOR` | Todos los Usuarios |
| **RF-005** | [CU-005](04-casos-de-uso/CU-005.md) | Administración | `USUARIO`, `APRENDIZ`, `INSTRUCTOR` | Administrador |
| **RF-006** | [CU-006](04-casos-de-uso/CU-006.md) | Administración | `PROGRAMA` | Administrador |
| **RF-007** | [CU-007](04-casos-de-uso/CU-007.md) | Administración | `CURSO`, `PROGRAMA` | Administrador |
| **RF-008** | [CU-008](04-casos-de-uso/CU-008.md) | Administración | `CURSO_INSTRUCTOR`, `INSTRUCTOR` | Administrador |
| **RF-009** | [CU-009](04-casos-de-uso/CU-009.md) | Administración | `INSCRIPCION`, `APRENDIZ`, `CURSO` | Administrador |
| **RF-010** | [CU-010](04-casos-de-uso/CU-010.md) | Dashboard | Múltiples Tablas (Agregación) | Administrador |
| **RF-011** | [CU-011](04-casos-de-uso/CU-011.md) | M1: Competencias | `COMPETENCIA`, `RESULTADO_APRENDIZAJE`| Instructor / Aprendiz |
| **RF-012** | [CU-012](04-casos-de-uso/CU-012.md) | M1: Competencias | `SEGUIMIENTO_COMPETENCIA`, `INSCRIPCION`| Aprendiz / Instructor |
| **RF-013** | [CU-013](04-casos-de-uso/CU-013.md) | M1: Competencias | `SEGUIMIENTO_COMPETENCIA`, `CURSO` | Instructor / Admin |
| **RF-014** | [CU-014](04-casos-de-uso/CU-014.md) | M1: Competencias | `SEGUIMIENTO_COMPETENCIA`, `HISTORIAL_SEGUIMIENTO`| Instructor |
| **RF-015** | [CU-015](04-casos-de-uso/CU-015.md) | M2: Evidencias | `EVIDENCIA`, `CURSO`, `RESULTADO_APRENDIZAJE`| Instructor |
| **RF-016** | [CU-016](04-casos-de-uso/CU-016.md) | M2: Evidencias | `EVIDENCIA`, `ENTREGA_EVIDENCIA` | Aprendiz / Instructor |
| **RF-017** | [CU-017](04-casos-de-uso/CU-017.md) | M2: Evidencias | `ENTREGA_EVIDENCIA`, `INSCRIPCION`| Aprendiz |
| **RF-018** | [CU-018](04-casos-de-uso/CU-018.md) | M2: Evidencias | `ENTREGA_EVIDENCIA`, `CALIFICACION`| Instructor |
| **RF-019** | [CU-019](04-casos-de-uso/CU-019.md) | M3: Recuperaciones | `SEGUIMIENTO_COMPETENCIA`, `INSCRIPCION`| Instructor |
| **RF-020** | [CU-020](04-casos-de-uso/CU-020.md) | M3: Recuperaciones | `RECUPERACION`, `RESULTADO_APRENDIZAJE`| Instructor |
| **RF-021** | [CU-021](04-casos-de-uso/CU-021.md) | M3: Recuperaciones | `RECUPERACION` | Aprendiz |
| **RF-022** | [CU-022](04-casos-de-uso/CU-022.md) | M3: Recuperaciones | `RECUPERACION`, `SEGUIMIENTO_COMPETENCIA`| Instructor |
| **RF-023** | [CU-023](04-casos-de-uso/CU-023.md) | M4: Asistencia | `SESION_CLASE`, `CURSO` | Instructor |
| **RF-024** | [CU-024](04-casos-de-uso/CU-024.md) | M4: Asistencia | `REGISTRO_ASISTENCIA`, `SESION_CLASE`| Instructor |
| **RF-025** | [CU-025](04-casos-de-uso/CU-025.md) | M4: Asistencia | `JUSTIFICACION_ASISTENCIA` | Aprendiz / Instructor |
| **RF-026** | [CU-026](04-casos-de-uso/CU-026.md) | M4: Asistencia | `REGISTRO_ASISTENCIA`, `NOTIFICACION`| Sistema / Instructor |
| **RF-027** | [CU-027](04-casos-de-uso/CU-027.md) | M5: Reportes | Consolidado Multi-tabla | Instructor / Admin |
| **RF-028** | [CU-028](04-casos-de-uso/CU-028.md) | M5: Reportes | Consolidado Ficha Multi-tabla | Instructor / Admin |
| **RF-029** | [CU-029](04-casos-de-uso/CU-029.md) | M5: Reportes | Consolidado CSV Export | Instructor / Admin |
| **RF-030** | [CU-030](04-casos-de-uso/CU-030.md) | M5: Reportes | Render CSS Print Engine | Todos los Roles |
| **RF-031** | [CU-031](04-casos-de-uso/CU-031.md) | M6: Notificaciones| `NOTIFICACION` | Todos los Usuarios |
| **RF-032** | [CU-032](04-casos-de-uso/CU-032.md) | M6: Notificaciones| `NOTIFICACION` | Todos los Usuarios |
| **RF-033** | [CU-033](04-casos-de-uso/CU-033.md) | M6: Notificaciones| `NOTIFICACION` | Todos los Usuarios |
| **RF-034** | [CU-034](04-casos-de-uso/CU-034.md) | M6: Notificaciones| `NOTIFICACION`, Event Bus | Sistema Automatizado |
| **RF-035** | [CU-035](04-casos-de-uso/CU-035.md) | M7: EDUNOVA AI | `USUARIO`, Contexto MySQL | Aprendiz / Instructor |
| **RF-036** | [CU-036](04-casos-de-uso/CU-036.md) | M7: EDUNOVA AI | Stream SSE / Telemetría | Aprendiz / Instructor |


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
* **RF-048:** El sistema debe generar un radicado único anual (`SOL-2026-XXXX`) y permitir emitir respuestas oficiales con trazabilidad completa.
