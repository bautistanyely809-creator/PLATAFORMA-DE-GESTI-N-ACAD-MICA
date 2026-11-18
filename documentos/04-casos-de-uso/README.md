# CATÁLOGO GENERAL DE CASOS DE USO DE EDUNOVA

Este directorio compendia la especificación técnica formal e individual de los **36 Casos de Uso** del sistema **EDUNOVA – Academic Management System** (Rama `DEV`), elaborados bajo el estándar internacional **IEEE 830 / ISO/IEC/IEEE 29148**.

---

## 📊 Resumen Métrico de Casos de Uso
* **Total de Casos de Uso Especificados:** 48
* **Casos de Uso Implementados y Conectados a MySQL 8:** 47 (97.9%)
* **Casos de Uso Propuestos / Mock:** 1 (CU-003 - Restablecimiento de Contraseña por Correo SMTP)

---

## 📑 Tabla Maestra de Casos de Uso

| ID | Nombre del Caso de Uso | Módulo | Actor Principal | Estado | Enlace al Documento |
| :---: | :--- | :--- | :--- | :---: | :---: |
| **CU-001** | Autenticación de Usuario en la Plataforma | Seguridad y Autenticación | Usuario | 🟢 Implementado | [Ver CU-001](CU-001.md) |
| **CU-002** | Cierre de Sesión Seguro (Logout) | Seguridad y Autenticación | Usuario Autenticado | 🟢 Implementado | [Ver CU-002](CU-002.md) |
| **CU-003** | Solicitud de Restablecimiento de Contraseña [Propuesto / Mock] | Seguridad y Autenticación | Usuario | 🟡 Propuesto | [Ver CU-003](CU-003.md) |
| **CU-004** | Consulta y Actualización de Perfil de Usuario | Usuarios y Perfiles | Usuario Autenticado | 🟢 Implementado | [Ver CU-004](CU-004.md) |
| **CU-005** | Gestión Administrativa de Usuarios | Administración Base | Administrador | 🟢 Implementado | [Ver CU-005](CU-005.md) |
| **CU-006** | Administración de Programas de Formación | Administración Base | Administrador | 🟢 Implementado | [Ver CU-006](CU-006.md) |
| **CU-007** | Administración de Cursos / Fichas de Caracterización | Administración Base | Administrador | 🟢 Implementado | [Ver CU-007](CU-007.md) |
| **CU-008** | Asignación de Instructores a Fichas de Formación | Administración Base | Administrador | 🟢 Implementado | [Ver CU-008](CU-008.md) |
| **CU-009** | Matrícula e Inscripción de Aprendices en Cursos | Administración Base | Administrador | 🟢 Implementado | [Ver CU-009](CU-009.md) |
| **CU-010** | Consulta de Estadísticas Globales del Dashboard | Dashboard y Métricas | Administrador / Directivo | 🟢 Implementado | [Ver CU-010](CU-010.md) |
| **CU-011** | Consulta de Competencias y Resultados de Aprendizaje por Programa | Módulo 1: Seguimiento por Competencias | Instructor / Aprendiz / Administrador | 🟢 Implementado | [Ver CU-011](CU-011.md) |
| **CU-012** | Consulta de Estado de Competencias por Aprendiz | Módulo 1: Seguimiento por Competencias | Aprendiz / Instructor | 🟢 Implementado | [Ver CU-012](CU-012.md) |
| **CU-013** | Monitoreo Grupal de Progreso por Ficha de Caracterización | Módulo 1: Seguimiento por Competencias | Instructor / Administrador | 🟢 Implementado | [Ver CU-013](CU-013.md) |
| **CU-014** | Evaluación de Competencia y Registro de Trazabilidad en Historial | Módulo 1: Seguimiento por Competencias | Instructor | 🟢 Implementado | [Ver CU-014](CU-014.md) |
| **CU-015** | Creación y Publicación de Evidencia de Aprendizaje | Módulo 2: Gestión de Evidencias | Instructor | 🟢 Implementado | [Ver CU-015](CU-015.md) |
| **CU-016** | Consulta de Evidencias Disponibles y Vencimientos por Ficha | Módulo 2: Gestión de Evidencias | Aprendiz / Instructor | 🟢 Implementado | [Ver CU-016](CU-016.md) |
| **CU-017** | Radicación de Entrega de Evidencia con Versionamiento Progresivo | Módulo 2: Gestión de Evidencias | Aprendiz | 🟢 Implementado | [Ver CU-017](CU-017.md) |
| **CU-018** | Calificación y Retroalimentación Pedagógica de Entregas | Módulo 2: Gestión de Evidencias | Instructor | 🟢 Implementado | [Ver CU-018](CU-018.md) |
| **CU-019** | Identificación de Aprendices en Refuerzo Académico | Módulo 3: Recuperación de Competencias | Instructor / Coordinador | 🟢 Implementado | [Ver CU-019](CU-019.md) |
| **CU-020** | Asignación de Plan de Recuperación Académica | Módulo 3: Recuperación de Competencias | Instructor | 🟢 Implementado | [Ver CU-020](CU-020.md) |
| **CU-021** | Entrega de Actividad de Refuerzo por el Aprendiz | Módulo 3: Recuperación de Competencias | Aprendiz | 🟢 Implementado | [Ver CU-021](CU-021.md) |
| **CU-022** | Evaluación de Recuperación y Auto-Acreditación de Competencia | Módulo 3: Recuperación de Competencias | Instructor | 🟢 Implementado | [Ver CU-022](CU-022.md) |
| **CU-023** | Programación y Apertura de Sesión de Clase | Módulo 4: Control de Asistencia | Instructor | 🟢 Implementado | [Ver CU-023](CU-023.md) |
| **CU-024** | Toma de Asistencia y Registro de Novedades en Vivo | Módulo 4: Control de Asistencia | Instructor | 🟢 Implementado | [Ver CU-024](CU-024.md) |
| **CU-025** | Radicación y Resolución de Justificación de Inasistencia | Módulo 4: Control de Asistencia | Aprendiz | 🟢 Implementado | [Ver CU-025](CU-025.md) |
| **CU-026** | Monitoreo y Disparo de Alertas de Asistencia (< 85%) | Módulo 4: Control de Asistencia | Servicio de Monitoreo del Sistema | 🟢 Implementado | [Ver CU-026](CU-026.md) |
| **CU-027** | Generación de Expediente Académico Individual de Aprendiz | Módulo 5: Reportes Académicos | Instructor / Administrador | 🟢 Implementado | [Ver CU-027](CU-027.md) |
| **CU-028** | Generación de Dossier Consolidado de Ficha / Curso | Módulo 5: Reportes Académicos | Instructor / Coordinador Académico | 🟢 Implementado | [Ver CU-028](CU-028.md) |
| **CU-029** | Exportación de Datos Académicos a Formato Excel (CSV UTF-8) | Módulo 5: Reportes Académicos | Instructor / Administrador | 🟢 Implementado | [Ver CU-029](CU-029.md) |
| **CU-030** | Impresión de Reporte Académico en Formato Oficial PDF | Módulo 5: Reportes Académicos | Todos los Usuarios | 🟢 Implementado | [Ver CU-030](CU-030.md) |
| **CU-031** | Consulta y Filtrado de Notificaciones del Sistema | Módulo 6: Notificaciones y Eventos | Usuario Autenticado | 🟢 Implementado | [Ver CU-031](CU-031.md) |
| **CU-032** | Marcado de Notificación Individual como Leída | Módulo 6: Notificaciones y Eventos | Usuario | 🟢 Implementado | [Ver CU-032](CU-032.md) |
| **CU-033** | Marcado Masivo de Notificaciones como Leídas | Módulo 6: Notificaciones y Eventos | Usuario | 🟢 Implementado | [Ver CU-033](CU-033.md) |
| **CU-034** | Despacho Automatizado de Notificaciones por Disparador de Evento | Módulo 6: Notificaciones y Eventos | Servicio de Notificaciones y Eventos | 🟢 Implementado | [Ver CU-034](CU-034.md) |
| **CU-035** | Consulta Contextual al Asistente Académico EDUNOVA AI | Módulo 7: Asistente Inteligente EDUNOVA AI | Aprendiz / Instructor | 🟢 Implementado | [Ver CU-035](CU-035.md) |
| **CU-036** | Streaming en Tiempo Real de Diagnóstico Académico (Token a Token) | Módulo 7: Asistente Inteligente EDUNOVA AI | Usuario Autenticado | 🟢 Implementado | [Ver CU-036](CU-036.md) |
| **CU-037** | Programar Evento en Calendario Académico | Módulo 8: Calendario Académico | Instructor / Administrador | 🟢 Implementado | [Ver CU-037](CU-037.md) |
| **CU-038** | Navegar y Filtrar el Calendario Académico | Módulo 8: Calendario Académico | Aprendiz / Instructor / Admin | 🟢 Implementado | [Ver CU-038](CU-038.md) |
| **CU-039** | Cancelar Evento de Calendario con Trazabilidad | Módulo 8: Calendario Académico | Instructor / Administrador | 🟢 Implementado | [Ver CU-039](CU-039.md) |
| **CU-040** | Consultar Expediente Académico Digital 360° | Módulo 9: Perfil Académico 360° | Aprendiz / Instructor / Admin | 🟢 Implementado | [Ver CU-040](CU-040.md) |
| **CU-041** | Registrar Acción de Acompañamiento Formativo y Tutoría | Módulo 9: Perfil Académico 360° | Instructor / Administrador | 🟢 Implementado | [Ver CU-041](CU-041.md) |
| **CU-042** | Detección Automatizada de Riesgos Formativos (Motor de Reglas) | Módulo 10: Sistema de Alertas Tempranas | Motor de Reglas / Sistema | 🟢 Implementado | [Ver CU-042](CU-042.md) |
| **CU-043** | Gestionar y Cerrar Alerta Temprana con Justificación | Módulo 10: Sistema de Alertas Tempranas | Instructor / Administrador | 🟢 Implementado | [Ver CU-043](CU-043.md) |
| **CU-044** | Administrar Aula Virtual y Unidades Didácticas | Módulo 11: Aula Virtual LMS | Instructor / Administrador | 🟢 Implementado | [Ver CU-044](CU-044.md) |
| **CU-045** | Publicar Recursos y Actividades con Proyección al Calendario | Módulo 11: Aula Virtual LMS | Instructor | 🟢 Implementado | [Ver CU-045](CU-045.md) |
| **CU-046** | Entregar y Calificar Actividades en Aula Virtual | Módulo 11: Aula Virtual LMS | Aprendiz / Instructor | 🟢 Implementado | [Ver CU-046](CU-046.md) |
| **CU-047** | Programar Reserva de Ambientes con Detección de Conflictos | Módulo 12: Gestión de Ambientes | Instructor / Administrador | 🟢 Implementado | [Ver CU-047](CU-047.md) |
| **CU-048** | Radicar y Atender Solicitud Institucional con Radicado Único | Módulo 13: Centro de Solicitudes | Aprendiz / Funcionario | 🟢 Implementado | [Ver CU-048](CU-048.md) |

---

## 🔗 Navegación Rápida
* [Ir a la Tabla de Contenido Principal](../10-tabla-de-contenido.md)
* [Ir a Requisitos Funcionales y Matriz de Trazabilidad](../07-requisitos-funcionales.md)
* [Ir a Diagramas UML de Casos de Uso](../11-casos-de-uso.md)
