# 13. DICCIONARIO DE DATOS DE LA BASE DE DATOS EDUNOVA

Este documento detalla las especificaciones de campo, tipos, restricciones y propósito semántico de las **22 tablas** que conforman la base de datos `edunova_db` gestionadas mediante Prisma ORM.

---

## 1. Tabla: `USUARIO`
Almacena las cuentas de acceso al sistema para todos los roles con sus credenciales cifradas.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id_usuario` | INT | NO | PK | Auto-increment | Identificador único del usuario. |
| `nombre` | VARCHAR(100) | NO | | | Nombre(s) del usuario. |
| `apellido` | VARCHAR(100) | NO | | | Apellido(s) del usuario. |
| `correo` | VARCHAR(150) | NO | UK, INDEX | | Correo institucional único de acceso. |
| `password_hash`| VARCHAR(255) | NO | | | Hash criptográfico Bcrypt de la contraseña. |
| `rol` | ENUM | NO | INDEX | 'APRENDIZ' | Rol RBAC: `ADMIN`, `INSTRUCTOR`, `APRENDIZ`. |
| `estado` | ENUM | NO | INDEX | 'ACTIVO' | Estado: `ACTIVO`, `INACTIVO`. |
| `fecha_creacion`| DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de registro de la cuenta. |
| `fecha_actualizacion`| DATETIME | NO | | AUTO UPDATE | Fecha de la última modificación. |

---

## 2. Tabla: `APRENDIZ`
Extensión de perfil para usuarios con rol de aprendiz, conteniendo datos documentales.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id_aprendiz` | INT | NO | PK | Auto-increment | Identificador único del aprendiz. |
| `id_usuario` | INT | NO | FK, UK | | Referencia a `USUARIO.id_usuario` (Cascade). |
| `documento` | VARCHAR(20) | NO | UK, INDEX | | Cédula o documento de identidad oficial. |
| `telefono` | VARCHAR(20) | SÍ | | NULL | Teléfono móvil de contacto. |
| `fecha_registro`| DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de matrícula en el centro. |

---

## 3. Tabla: `INSTRUCTOR`
Extensión de perfil para instructores técnicos y transversales.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id_instructor`| INT | NO | PK | Auto-increment | Identificador único del instructor. |
| `id_usuario` | INT | NO | FK, UK | | Referencia a `USUARIO.id_usuario` (Cascade). |
| `especialidad` | VARCHAR(100) | NO | INDEX | | Área técnica (ej: "Desarrollo de Software"). |
| `telefono` | VARCHAR(20) | SÍ | | NULL | Teléfono de contacto institucional. |

---

## 4. Tabla: `PROGRAMA`
Programas de formación profesional titulados o complementarios ofertados por el SENA.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id_programa` | INT | NO | PK | Auto-increment | Identificador único del programa. |
| `nombre` | VARCHAR(150) | NO | | | Denominación del programa formativo. |
| `codigo` | VARCHAR(50) | NO | UK, INDEX | | Código oficial del diseño curricular SENA. |
| `descripcion` | TEXT | SÍ | | NULL | Justificación y perfil de egreso. |
| `estado` | ENUM | NO | INDEX | 'ACTIVO' | Estado: `ACTIVO`, `INACTIVO`. |
| `fecha_creacion`| DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de creación del registro. |

---

## 5. Tabla: `CURSO` (Ficha de Caracterización)
Cursos o fichas formativas específicas vinculadas a un programa.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id_curso` | INT | NO | PK | Auto-increment | Identificador único de la ficha. |
| `id_programa` | INT | NO | FK, INDEX | | Referencia a `PROGRAMA.id_programa`. |
| `nombre` | VARCHAR(150) | NO | | | Denominación de la ficha (ej: "ADSO 3413988"). |
| `descripcion` | TEXT | SÍ | | NULL | Modalidad, jornada o detalles del grupo. |
| `fecha_inicio` | DATE | NO | | | Fecha de inicio de la etapa lectiva. |
| `fecha_fin` | DATE | NO | | | Fecha estimada de finalización. |
| `estado` | ENUM | NO | INDEX | 'ACTIVO' | Estado: `ACTIVO`, `FINALIZADO`, `CANCELADO`. |
| `fecha_creacion`| DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de creación de la ficha. |

---

## 6. Tabla: `CURSO_INSTRUCTOR`
Relación muchos a muchos entre instructores y cursos/fichas.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id_curso_instructor`| INT | NO | PK | Auto-increment | Identificador de la asignación. |
| `id_curso` | INT | NO | FK | | Referencia a `CURSO.id_curso` (Cascade). |
| `id_instructor` | INT | NO | FK, INDEX | | Referencia a `INSTRUCTOR.id_instructor` (Cascade). |
| `fecha_asignacion` | DATETIME | NO | | CURRENT_TIMESTAMP | Fecha en que fue asignado el instructor. |
*(Restricción Única Compuesta: `id_curso + id_instructor`)*

---

## 7. Tabla: `INSCRIPCION`
Matrícula oficial de un aprendiz en una ficha de formación.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id_inscripcion` | INT | NO | PK | Auto-increment | Identificador único de la matrícula. |
| `id_aprendiz` | INT | NO | FK, INDEX | | Referencia a `APRENDIZ.id_aprendiz` (Cascade). |
| `id_curso` | INT | NO | FK, INDEX | | Referencia a `CURSO.id_curso` (Cascade). |
| `fecha_inscripcion`| DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de matrícula en el grupo. |
| `estado` | ENUM | NO | INDEX | 'ACTIVO' | `ACTIVO`, `RETIRADO`, `APROBADO`, `NO_APROBADO`.|
*(Restricción Única Compuesta: `id_aprendiz + id_curso`)*

---

## 8. Tabla: `COMPETENCIA`
Competencias laborales de la norma sectorial asociadas al programa.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id_competencia` | INT | NO | PK | Auto-increment | Identificador único de la competencia. |
| `id_programa` | INT | NO | FK, INDEX | | Referencia a `PROGRAMA.id_programa` (Cascade). |
| `codigo` | VARCHAR(50) | NO | UK, INDEX | | Código de la norma sectorial de competencia. |
| `nombre` | VARCHAR(255) | NO | | | Denominación formal de la competencia. |
| `descripcion` | TEXT | SÍ | | NULL | Alcance y normas de desempeño. |
| `horas_duracion`| INT | NO | | 120 | Horas pedagógicas estimadas. |
| `fecha_creacion`| DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de registro. |

---

## 9. Tabla: `RESULTADO_APRENDIZAJE` (RAP)
Resultados de aprendizaje específicos derivados de cada competencia.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id_rap` | INT | NO | PK | Auto-increment | Identificador del resultado de aprendizaje. |
| `id_competencia` | INT | NO | FK, INDEX | | Referencia a `COMPETENCIA.id_competencia` (Cascade).|
| `codigo` | VARCHAR(50) | NO | | | Código RAP (ej: "RAP-01"). |
| `descripcion` | TEXT | NO | | | Criterios y enunciado del resultado formativo.|
| `fecha_creacion`| DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de creación del RAP. |
*(Restricción Única Compuesta: `id_competencia + codigo`)*

---

## 10. Tabla: `SEGUIMIENTO_COMPETENCIA`
Registro del avance y juicio evaluativo de un aprendiz en una competencia.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id_seguimiento` | INT | NO | PK | Auto-increment | Identificador único de seguimiento. |
| `id_inscripcion` | INT | NO | FK, INDEX | | Referencia a `INSCRIPCION.id_inscripcion` (Cascade).|
| `id_competencia` | INT | NO | FK, INDEX | | Referencia a `COMPETENCIA.id_competencia` (Cascade).|
| `id_instructor` | INT | SÍ | FK | NULL | Instructor evaluador (SetNull). |
| `estado` | ENUM | NO | INDEX | 'PENDIENTE' | `PENDIENTE`, `EN_DESARROLLO`, `EN_EVALUACION`, `APROBADA`, `REQUIERE_REFUERZO`. |
| `porcentaje_avance`| DECIMAL(5,2)| NO | | 0.00 | Porcentaje de cumplimiento ($0.00\% - 100.00\%$).|
| `fecha_evaluacion`| DATETIME | SÍ | | NULL | Fecha en que se emitió el último juicio. |
| `observaciones` | TEXT | SÍ | | NULL | Juicio cualitativo u observaciones. |
*(Restricción Única Compuesta: `id_inscripcion + id_competencia`)*

---

## 11. Tabla: `HISTORIAL_SEGUIMIENTO`
Trazabilidad inmutable de cambios de estado en las competencias para auditoría.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id_historial` | INT | NO | PK | Auto-increment | Identificador del evento histórico. |
| `id_seguimiento` | INT | NO | FK, INDEX | | Referencia a `SEGUIMIENTO_COMPETENCIA` (Cascade).|
| `estado_anterior`| VARCHAR(50) | NO | | | Estado previo de la competencia. |
| `estado_nuevo` | VARCHAR(50) | NO | | | Nuevo estado asignado. |
| `motivo` | TEXT | SÍ | | NULL | Justificación del cambio de estado. |
| `usuario_responsable`| VARCHAR(100)| NO | | | Nombre y correo de quien evaluó. |
| `fecha` | DATETIME | NO | | CURRENT_TIMESTAMP | Marca temporal exacta de la transacción. |

---

## 12. Tabla: `EVIDENCIA`
Actividades y talleres publicados por los instructores vinculados a un curso.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id_evidencia` | INT | NO | PK | Auto-increment | Identificador único de la evidencia. |
| `id_curso` | INT | NO | FK, INDEX | | Referencia a `CURSO.id_curso` (Cascade). |
| `id_rap` | INT | SÍ | FK, INDEX | NULL | RAP asociado (SetNull). |
| `nombre` | VARCHAR(150) | NO | | | Título de la evidencia de aprendizaje. |
| `descripcion` | TEXT | SÍ | | NULL | Objetivos y contexto de la actividad. |
| `instrucciones` | TEXT | SÍ | | NULL | Criterios de entrega y formato solicitado. |
| `porcentaje` | DECIMAL(5,2)| NO | | 100.00 | Ponderación porcentual de la evidencia. |
| `fecha_limite` | DATE | SÍ | | NULL | Plazo máximo de radicación. |
| `estado` | ENUM | NO | INDEX | 'PUBLICADA' | `BORRADOR`, `PUBLICADA`, `VENCIDA`. |
| `fecha_creacion`| DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de publicación en plataforma. |

---

## 13. Tabla: `ENTREGA_EVIDENCIA`
Entregas radicadas por los aprendices con versionamiento progresivo.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id_entrega` | INT | NO | PK | Auto-increment | Identificador único de la entrega. |
| `id_evidencia` | INT | NO | FK, INDEX | | Referencia a `EVIDENCIA.id_evidencia` (Cascade). |
| `id_inscripcion` | INT | NO | FK, INDEX | | Referencia a `INSCRIPCION.id_inscripcion` (Cascade).|
| `version` | INT | NO | | 1 | Número de intento de entrega (1, 2, 3...). |
| `archivo_nombre`| VARCHAR(255) | SÍ | | NULL | Nombre original del documento adjunto. |
| `archivo_url` | VARCHAR(500) | SÍ | | NULL | Enlace al repositorio de almacenamiento. |
| `comentario_aprendiz`| TEXT | SÍ | | NULL | Mensaje explicativo del aprendiz. |
| `estado` | ENUM | NO | INDEX | 'ENTREGADA' | `ENTREGADA`, `APROBADA`, `REQUIERE_CORRECCION`. |
| `calificacion` | DECIMAL(4,2)| SÍ | | NULL | Nota numérica asignada ($0.0 - 5.0$). |
| `retroalimentacion`| TEXT | SÍ | | NULL | Comentarios pedagógicos del instructor. |
| `fecha_entrega` | DATETIME | NO | | CURRENT_TIMESTAMP | Fecha y hora de radicación. |
| `fecha_evaluacion`| DATETIME | SÍ | | NULL | Fecha en que fue revisada. |
| `evaluador_nombre`| VARCHAR(100)| SÍ | | NULL | Nombre del instructor que calificó. |

---

## 14. Tabla: `CALIFICACION`
Consolidado oficial de notas finales por evidencia.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id_calificacion`| INT | NO | PK | Auto-increment | Identificador único del registro de nota. |
| `id_inscripcion` | INT | NO | FK, INDEX | | Referencia a `INSCRIPCION` (Cascade). |
| `id_evidencia` | INT | NO | FK, INDEX | | Referencia a `EVIDENCIA` (Cascade). |
| `nota` | DECIMAL(4,2)| NO | | | Calificación numérica obtenida. |
| `observacion` | TEXT | SÍ | | NULL | Observaciones pedagógicas. |
| `fecha_registro` | DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de asentamiento de la nota. |
*(Restricción Única Compuesta: `id_inscripcion + id_evidencia`)*

---

## 15. Tabla: `RECUPERACION`
Planes de mejoramiento asignados para superar competencias pendientes.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id_recuperacion`| INT | NO | PK | Auto-increment | Identificador del plan de refuerzo. |
| `id_inscripcion` | INT | NO | FK, INDEX | | Referencia a `INSCRIPCION` (Cascade). |
| `id_rap` | INT | NO | FK, INDEX | | RAP específico a recuperar (Cascade). |
| `id_instructor` | INT | NO | FK, INDEX | | Instructor tutor responsable (Cascade). |
| `actividad_refuerzo`| TEXT | NO | | | Descripción detallada del taller o producto.|
| `fecha_inicio` | DATE | NO | | | Fecha de apertura del plan. |
| `fecha_limite` | DATE | NO | | | Fecha de cierre improrrogable. |
| `fecha_entrega` | DATETIME | SÍ | | NULL | Fecha de envío por el aprendiz. |
| `archivo_entrega`| VARCHAR(500) | SÍ | | NULL | Documento adjunto con la solución. |
| `comentario_entrega`| TEXT | SÍ | | NULL | Comentario del aprendiz al radicar. |
| `calificacion` | DECIMAL(4,2)| SÍ | | NULL | Calificación del refuerzo ($0.0 - 5.0$). |
| `estado` | ENUM | NO | INDEX | 'IDENTIFICADA' | `IDENTIFICADA`, `ASIGNADA`, `SUPERADA`, etc. |
| `fecha_evaluacion`| DATETIME | SÍ | | NULL | Fecha de calificación y cierre. |

---

## 16. Tabla: `SESION_CLASE`
Programación diaria o semanal de encuentros formativos por curso.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id_sesion` | INT | NO | PK | Auto-increment | Identificador de la sesión de clase. |
| `id_curso` | INT | NO | FK, INDEX | | Referencia a `CURSO.id_curso` (Cascade). |
| `id_instructor` | INT | NO | FK, INDEX | | Instructor titular de la clase (Cascade). |
| `fecha` | DATE | NO | INDEX | | Fecha del encuentro presencial/virtual. |
| `hora_inicio` | VARCHAR(10) | NO | | | Hora de inicio (ej: "07:00"). |
| `hora_fin` | VARCHAR(10) | NO | | | Hora de finalización (ej: "13:00"). |
| `tema` | VARCHAR(200) | NO | | | Asunto o resultado de aprendizaje abordado.|
| `fecha_registro` | DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de creación de la sesión. |

---

## 17. Tabla: `REGISTRO_ASISTENCIA`
Planilla detallada de asistencia individual por aprendiz y sesión.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id_registro` | INT | NO | PK | Auto-increment | Identificador único del registro de asistencia.|
| `id_sesion` | INT | NO | FK, INDEX | | Referencia a `SESION_CLASE` (Cascade). |
| `id_inscripcion` | INT | NO | FK, INDEX | | Referencia a `INSCRIPCION` (Cascade). |
| `estado` | ENUM | NO | INDEX | 'ASISTIO' | `ASISTIO`, `AUSENTE`, `RETARDO`, `EXCUSA_PENDIENTE`, `JUSTIFICADA`. |
| `observacion` | TEXT | SÍ | | NULL | Nota o motivo de retardo/falta. |
| `fecha_registro` | DATETIME | NO | | CURRENT_TIMESTAMP | Momento exacto de toma de lista. |
*(Restricción Única Compuesta: `id_sesion + id_inscripcion`)*

---

## 18. Tabla: `JUSTIFICACION_ASISTENCIA`
Radicación de excusas médicas o laborales que amparan una inasistencia.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id_justificacion`| INT | NO | PK | Auto-increment | Identificador único de la justificación. |
| `id_registro` | INT | NO | FK, INDEX | | Referencia a `REGISTRO_ASISTENCIA` (Cascade). |
| `motivo` | TEXT | NO | | | Explicación detallada de la causa de ausencia.|
| `soporte_url` | VARCHAR(500) | SÍ | | NULL | Enlace o archivo de incapacidad médica/soporte.|
| `estado` | VARCHAR(20) | NO | | 'PENDIENTE' | `PENDIENTE`, `APROBADA`, `RECHAZADA`. |
| `fecha_radicacion`| DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de envío por el aprendiz. |
| `fecha_resolucion`| DATETIME | SÍ | | NULL | Fecha en que el instructor la dictaminó. |

---

## 19. Tabla: `ASISTENCIA`
Registro histórico diario de asistencia compatible con esquemas legados.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id_asistencia` | INT | NO | PK | Auto-increment | Identificador del registro diario. |
| `id_inscripcion` | INT | NO | FK, INDEX | | Referencia a `INSCRIPCION` (Cascade). |
| `fecha` | DATE | NO | INDEX | | Día del registro. |
| `estado` | ENUM | NO | INDEX | 'PRESENTE' | `PRESENTE`, `AUSENTE`, `TARDANZA`, `EXCUSA`.|
| `observacion` | TEXT | SÍ | | NULL | Comentarios adicionales. |
| `fecha_registro` | DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de inserción. |
*(Restricción Única Compuesta: `id_inscripcion + fecha`)*

---

## 20. Tabla: `OBSERVACION`
Anotaciones pedagógicas o conductuales realizadas por los instructores.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id_observacion` | INT | NO | PK | Auto-increment | Identificador de la anotación. |
| `id_inscripcion` | INT | NO | FK, INDEX | | Referencia a `INSCRIPCION` (Cascade). |
| `id_instructor` | INT | NO | FK, INDEX | | Instructor autor de la observación (Cascade).|
| `descripcion` | TEXT | NO | | | Texto descriptivo de la novedad pedagógica. |
| `fecha` | DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de emisión. |

---

## 21. Tabla: `NOTIFICACION`
Bandeja de mensajes internos y alertas automáticas despachadas por el sistema.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id_notificacion` | INT | NO | PK | Auto-increment | Identificador único de la notificación. |
| `id_usuario` | INT | NO | FK, INDEX | | Usuario destinatario (Cascade). |
| `titulo` | VARCHAR(150) | NO | | | Encabezado descriptivo de la alerta. |
| `mensaje` | TEXT | NO | | | Contenido detallado del aviso. |
| `categoria` | ENUM | NO | | 'ALERTA' | `EVIDENCIA`, `CALIFICACION`, `ASISTENCIA`, etc.|
| `leida` | BOOLEAN | NO | INDEX | false | Bandera de estado de lectura. |
| `enlace` | VARCHAR(200) | SÍ | | NULL | Ruta SPA de navegación directa. |
| `fecha_creacion`| DATETIME | NO | INDEX | CURRENT_TIMESTAMP | Momento de despacho de la notificación. |

---

## 22. Tabla: `HISTORIAL_AUDITORIA`
Bitácora de seguridad forense y trazabilidad de operaciones críticas.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id_auditoria` | INT | NO | PK | Auto-increment | Identificador del evento de auditoría. |
| `id_usuario` | INT | SÍ | FK, INDEX | NULL | Usuario autor de la transacción (SetNull). |
| `accion` | VARCHAR(100) | NO | | | Verbo/operación realizada (ej: "EVALUAR_COMPETENCIA").|
| `modulo` | VARCHAR(50) | NO | INDEX | | Módulo del sistema afectado. |
| `detalle` | TEXT | NO | | | JSON o descripción con parámetros de cambio. |
| `ip_address` | VARCHAR(50) | SÍ | | NULL | Dirección IP del cliente originador. |
| `fecha` | DATETIME | NO | INDEX | CURRENT_TIMESTAMP | Marca de tiempo inmutable. |


### 13.23 Tabla EVENTO_CALENDARIO
Centraliza la planificación de actividades, clases presenciales, entregas y reservas.

| Campo | Tipo de Dato | Nulo | Clave | Valor por Defecto | Descripción |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `id_evento` | INT | NO | PK (AI) | Auto | Identificador único del evento. |
| `titulo` | VARCHAR(150) | NO | | | Título representativo de la actividad. |
| `descripcion` | TEXT | SÍ | | NULL | Detalle de objetivos o instrucciones. |
| `categoria` | VARCHAR(50) | NO | | 'CLASE' | Categoría: CLASE, EVALUACION, ENTREGA, INSTITUCIONAL, RESERVA_AMBIENTE. |
| `fecha_inicio` | DATETIME | NO | MUL | | Fecha y hora de inicio. |
| `fecha_fin` | DATETIME | NO | | | Fecha y hora de culminación. |
| `hora_inicio` | VARCHAR(10) | SÍ | | NULL | Hora visual formateada. |
| `hora_fin` | VARCHAR(10) | SÍ | | NULL | Hora visual final. |
| `ubicacion` | VARCHAR(100) | SÍ | | NULL | Nombre del ambiente o enlace virtual. |
| `id_ambiente` | INT | SÍ | FK | NULL | Referencia a tabla AMBIENTE. |
| `id_instructor`| INT | SÍ | FK | NULL | Referencia a tabla INSTRUCTOR. |
| `id_curso` | INT | SÍ | FK | NULL | Referencia a tabla CURSO (Ficha 3413988). |
| `id_usuario_creador` | INT | NO | FK | | Referencia a USUARIO creador. |
| `estado` | VARCHAR(20) | NO | | 'ACTIVO' | Estado: ACTIVO, MODIFICADO, CANCELADO. |
| `motivo_cancelacion` | TEXT | SÍ | | NULL | Motivo justificado si fue cancelado. |

### 13.24 Tabla ALERTA_TEMPRANA
Almacena las alertas preventivas de rendimiento académico y asistencia.

| Campo | Tipo de Dato | Nulo | Clave | Valor por Defecto | Descripción |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `id_alerta` | INT | NO | PK (AI) | Auto | Identificador único de la alerta. |
| `tipo` | VARCHAR(50) | NO | MUL | | INASISTENCIA, EVIDENCIA_VENCIDA, COMPETENCIA_SIN_AVANCE, etc. |
| `titulo` | VARCHAR(150) | NO | | | Título del riesgo detectado. |
| `descripcion` | TEXT | NO | | | Causa y datos cuantitativos del riesgo. |
| `id_aprendiz` | INT | SÍ | FK | NULL | Referencia a APRENDIZ afectado. |
| `id_curso` | INT | SÍ | FK | NULL | Referencia a CURSO / Ficha. |
| `id_instructor_responsable` | INT | SÍ | FK | NULL | Instructor a cargo del seguimiento. |
| `prioridad` | VARCHAR(20) | NO | MUL | 'MEDIA' | CRITICA, ALTA, MEDIA, BAJA, INFORMATIVA. |
| `estado` | VARCHAR(20) | NO | MUL | 'NUEVA' | NUEVA, EN_SEGUIMIENTO, ATENDIDA, CERRADA. |
| `origen` | VARCHAR(20) | NO | | 'AUTOMATICA' | AUTOMATICA (motor) o MANUAL. |
| `fecha_generacion` | DATETIME | NO | | CURRENT_TIMESTAMP | Momento de detección. |
| `fecha_atencion` | DATETIME | SÍ | | NULL | Fecha de intervención docente. |
| `fecha_cierre` | DATETIME | SÍ | | NULL | Fecha formal de cierre. |
| `justificacion_cierre` | TEXT | SÍ | | NULL | Argumento obligatorio de cierre. |

### 13.25 Tabla AULA_VIRTUAL
Representa el espacio digital LMS de cada ficha formativa.

| Campo | Tipo de Dato | Nulo | Clave | Valor por Defecto | Descripción |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `id_aula` | INT | NO | PK (AI) | Auto | Identificador único del aula. |
| `id_curso` | INT | NO | FK | | Ficha formativa vinculada. |
| `id_instructor`| INT | NO | FK | | Docente titular del espacio. |
| `nombre` | VARCHAR(150) | NO | | | Nombre formal del aula. |
| `descripcion` | TEXT | SÍ | | NULL | Presentación y objetivos pedagógicos. |
| `imagen_portada`| VARCHAR(255)| SÍ | | NULL | Ruta del banner gráfico. |
| `estado` | VARCHAR(20) | NO | | 'ACTIVO' | ACTIVO o ARCHIVADO. |

### 13.26 Tabla UNIDAD_AULA
Secciones temáticas en que se divide el aula virtual.

| Campo | Tipo de Dato | Nulo | Clave | Valor por Defecto | Descripción |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `id_unidad` | INT | NO | PK (AI) | Auto | Identificador de la unidad. |
| `id_aula` | INT | NO | FK | | Aula a la que pertenece. |
| `titulo` | VARCHAR(150) | NO | | | Nombre de la unidad temática. |
| `descripcion` | TEXT | SÍ | | NULL | Resumen del contenido temático. |
| `orden` | INT | NO | | 1 | Posición ordinal en el curso. |

### 13.27 Tabla ACTIVIDAD_AULA
Talleres y actividades evaluables publicadas en el aula virtual.

| Campo | Tipo de Dato | Nulo | Clave | Valor por Defecto | Descripción |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `id_actividad` | INT | NO | PK (AI) | Auto | Identificador de la actividad. |
| `id_unidad` | INT | NO | FK | | Unidad contenedora. |
| `id_evidencia`| INT | SÍ | FK | NULL | Enlace opcional a EVIDENCIA sin duplicar. |
| `titulo` | VARCHAR(150) | NO | | | Título del entregable. |
| `descripcion` | TEXT | NO | | | Explicación del taller. |
| `instrucciones`| TEXT | SÍ | | NULL | Criterios y requerimientos específicos. |
| `fecha_limite` | DATETIME | SÍ | | NULL | Vencimiento proyectado en Calendario. |
| `estado` | VARCHAR(20) | NO | | 'PUBLICADA' | PUBLICADA o BORRADOR. |

### 13.28 Tabla ENTREGA_ACTIVIDAD_AULA
Soluciones entregadas por los aprendices y evaluadas por los instructores.

| Campo | Tipo de Dato | Nulo | Clave | Valor por Defecto | Descripción |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `id_entrega_actividad` | INT | NO | PK (AI) | Auto | Identificador del envío. |
| `id_actividad`| INT | NO | FK | | Actividad correspondiente. |
| `id_inscripcion`| INT | NO | FK | | Aprendiz que entrega. |
| `archivo_url` | VARCHAR(500) | SÍ | | NULL | URL del repositorio o documento. |
| `comentario` | TEXT | SÍ | | NULL | Nota adjunta del estudiante. |
| `estado` | VARCHAR(20) | NO | | 'ENTREGADA' | ENTREGADA, APROBADA, REQUIERE_CORRECCION. |
| `calificacion` | DECIMAL(4,2)| SÍ | | NULL | Nota numérica (0.0 a 5.0). |
| `retroalimentacion`| TEXT | SÍ | | NULL | Comentarios y feedback docente. |
| `fecha_entrega`| DATETIME | NO | | CURRENT_TIMESTAMP | Momento del envío. |
| `fecha_evaluacion`| DATETIME | SÍ| | NULL | Momento de la calificación. |

### 13.29 Tabla AMBIENTE
Inventario de espacios físicos y laboratorios de la institución.

| Campo | Tipo de Dato | Nulo | Clave | Valor por Defecto | Descripción |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `id_ambiente` | INT | NO | PK (AI) | Auto | Identificador del ambiente. |
| `codigo` | VARCHAR(50) | NO | UNI | | Código patrimonial (ej. AMB-SISTEMAS-101). |
| `nombre` | VARCHAR(100) | NO | | | Nombre del laboratorio. |
| `ubicacion` | VARCHAR(100) | NO | | | Sede, bloque y piso. |
| `capacidad` | INT | NO | | | Aforo máximo de personas. |
| `tipo` | VARCHAR(50) | NO | MUL | | SISTEMAS, LABORATORIO, AUDITORIO, AULA_TEORICA. |
| `equipamiento`| TEXT | SÍ | | NULL | Hardware e infraestructura disponible. |
| `estado` | VARCHAR(30) | NO | MUL | 'DISPONIBLE' | DISPONIBLE, OCUPADO, EN_MANTENIMIENTO, INACTIVO. |

### 13.30 Tabla RESERVA_AMBIENTE
Agendamiento de ambientes con validación de conflictos de horario.

| Campo | Tipo de Dato | Nulo | Clave | Valor por Defecto | Descripción |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `id_reserva` | INT | NO | PK (AI) | Auto | Identificador de la reserva. |
| `id_ambiente` | INT | NO | FK | | Espacio físico reservado. |
| `id_curso` | INT | SÍ | FK | NULL | Ficha académica beneficiaria. |
| `id_instructor`| INT | NO | FK | | Docente responsable. |
| `motivo` | VARCHAR(200) | NO | | | Objeto de la actividad formativa. |
| `fecha` | DATE | NO | MUL | | Día de la reserva. |
| `hora_inicio` | VARCHAR(10) | NO | | | Hora de inicio (ej. 08:00). |
| `hora_fin` | VARCHAR(10) | NO | | | Hora de salida (ej. 12:00). |
| `estado` | VARCHAR(20) | NO | | 'CONFIRMADA' | CONFIRMADA o CANCELADO. |

### 13.31 Tabla SOLICITUD_INSTITUCIONAL
Centro de atención con radicado oficial único anual.

| Campo | Tipo de Dato | Nulo | Clave | Valor por Defecto | Descripción |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `id_solicitud` | INT | NO | PK (AI) | Auto | Identificador del trámite. |
| `radicado` | VARCHAR(50) | NO | UNI | | Radicado oficial (ej. SOL-2026-0001). |
| `id_usuario_solicitante` | INT | NO | FK | | Usuario solicitante. |
| `id_usuario_responsable` | INT | SÍ | FK | NULL | Funcionario o docente asignado. |
| `categoria` | VARCHAR(50) | NO | MUL | | ACADEMICA, CERTIFICADO, ASISTENCIA, etc. |
| `asunto` | VARCHAR(200) | NO | | | Resumen del requerimiento. |
| `descripcion` | TEXT | NO | | | Argumentación detallada. |
| `prioridad` | VARCHAR(20) | NO | | 'MEDIA' | BAJA, MEDIA, ALTA, URGENTE. |
| `estado` | VARCHAR(20) | NO | MUL | 'RECIBIDA' | RECIBIDA, EN_PROCESO, RESPONDIDA, CERRADA. |
| `respuesta` | TEXT | SÍ | | NULL | Respuesta oficial de la institución. |
| `fecha_creacion`| DATETIME | NO | | CURRENT_TIMESTAMP | Radicación inicial. |
| `fecha_cierre` | DATETIME | SÍ | | NULL | Fecha de resolución definitiva. |

### 13.32 Tabla HISTORIAL_SOLICITUD
Registro de auditoría inmutable de cada solicitud.

| Campo | Tipo de Dato | Nulo | Clave | Valor por Defecto | Descripción |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `id_historial` | INT | NO | PK (AI) | Auto | Identificador de auditoría. |
| `id_solicitud`| INT | NO | FK | | Solicitud trazada. |
| `estado_anterior`| VARCHAR(50)| NO | | | Estado previo al cambio. |
| `estado_nuevo` | VARCHAR(50) | NO | | | Nuevo estado aplicado. |
| `id_usuario` | INT | NO | FK | | Funcionario que ejecutó el cambio. |
| `comentario` | TEXT | SÍ | | NULL | Justificación del cambio o respuesta. |
| `fecha` | DATETIME | NO | | CURRENT_TIMESTAMP | Estampa de tiempo exacta. |
