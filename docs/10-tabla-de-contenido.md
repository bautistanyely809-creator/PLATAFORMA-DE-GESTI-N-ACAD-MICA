# 10. TABLA DE CONTENIDO GENERAL

Este índice maestro articula todos los documentos técnicos de la plataforma **EDUNOVA** en la rama `DEV`, permitiendo una navegación hipertextual rápida y estructurada:

---

## 📑 1. Documentación de Ingeniería de Software (01 a 16)
1. [01. Introducción General del Sistema EDUNOVA](01-introduccion.md)
   * Resumen Ejecutivo, Contexto Institucional SENA (ADSO Ficha 3413988) y Propósito.
2. [02. Planteamiento del Problema](02-planteamiento-del-problema.md)
   * Situación actual, Pregunta problema y Árbol de problemas.
3. [03. Justificación y Vigilancia Tecnológica](03-justificacion.md)
   * Justificación académica, técnica y Benchmark comparativo contra Moodle, Canvas y Zajuna.
4. [04. Objetivos del Sistema](04-objetivos.md)
   * Objetivo general y 9 objetivos específicos por módulo implementado.
5. [05. Alcance y Límites](05-alcance.md)
   * Módulos operativos en rama DEV vs. funcionalidades pendientes/propuestas.
6. [06. Arquitectura del Sistema](06-arquitectura-del-sistema.md)
   * Arquitectura de Tres Capas, Diagrama de Componentes y Diagrama de Despliegue.
7. [07. Requisitos Funcionales y Matriz de Trazabilidad](07-requisitos-funcionales.md)
   * Catálogo RF-001 a RF-036 y Matriz completa de correspondencia cruzada.
8. [08. Requisitos No Funcionales (RNF)](08-requisitos-no-funcionales.md)
   * Catálogo RNF-001 a RNF-015 (Rendimiento, Seguridad, Usabilidad, Fiabilidad).
9. [09. Actores y Perfiles del Sistema](09-actores-del-sistema.md)
   * Perfiles de Administrador, Instructor, Aprendiz, Servicios automatizados y Matriz CRUD.
10. [10. Tabla de Contenido General](10-tabla-de-contenido.md) (Documento actual).
11. [11. Especificación General de Casos de Uso y Diagramas UML](11-casos-de-uso.md)
    * Diagrama global del sistema y 10 diagramas Mermaid específicos por módulo.
12. [12. Modelo Entidad-Relación](12-modelo-entidad-relacion.md)
    * Diagrama MER exhaustivo de las 22 tablas reales y normalización 3FN.
13. [13. Diccionario de Datos de la Base de Datos](13-diccionario-de-datos.md)
    * Tablas, columnas, tipos de datos, nulabilidad, índices y descripción semántica.
14. [14. Tecnologías y Stack Técnico](14-tecnologias.md)
    * Especificación detallada de React 18, Vite, Three.js, Node.js 24, Express, MySQL 8 y Prisma.
15. [15. Seguridad, Autenticación y Permisos](15-seguridad-y-permisos.md)
    * Implementación del modelo RBAC, estructura de JWT, cifrado Bcrypt y auditoría.
16. [16. Glosario de Términos del Dominio Académico y Tecnológico](16-glosario.md)
    * Definiciones formales de la terminología SENA e informática empleada.

---

## 📦 2. Catálogo de Casos de Uso Detallados (04-casos-de-uso/)
Accede al directorio maestro de Casos de Uso: 👉 **[Índice y Resumen de Casos de Uso (README)](04-casos-de-uso/README.md)**

### Módulo: Autenticación y Perfil
* [CU-001: Autenticación de Usuario (Login)](04-casos-de-uso/CU-001.md)
* [CU-002: Cierre de Sesión Seguro (Logout)](04-casos-de-uso/CU-002.md)
* [CU-003: Solicitud de Recuperación de Contraseña [Propuesto]](04-casos-de-uso/CU-003.md)
* [CU-004: Consulta y Actualización de Perfil](04-casos-de-uso/CU-004.md)

### Módulo: Administración Académica Base
* [CU-005: Gestión Administrativa de Usuarios](04-casos-de-uso/CU-005.md)
* [CU-006: Administración de Programas de Formación](04-casos-de-uso/CU-006.md)
* [CU-007: Administración de Cursos / Fichas](04-casos-de-uso/CU-007.md)
* [CU-008: Asignación de Instructores a Fichas](04-casos-de-uso/CU-008.md)
* [CU-009: Matrícula e Inscripción de Aprendices](04-casos-de-uso/CU-009.md)
* [CU-010: Consulta de Estadísticas Globales del Dashboard](04-casos-de-uso/CU-010.md)

### Módulo 1: Seguimiento por Competencias y RAPs
* [CU-011: Consulta de Competencias y RAPs por Programa](04-casos-de-uso/CU-011.md)
* [CU-012: Consulta de Estado de Competencias por Aprendiz](04-casos-de-uso/CU-012.md)
* [CU-013: Monitoreo Grupal de Competencias por Ficha](04-casos-de-uso/CU-013.md)
* [CU-014: Evaluación de Competencia y Registro de Trazabilidad](04-casos-de-uso/CU-014.md)

### Módulo 2: Gestión de Evidencias y Entregas
* [CU-015: Creación y Publicación de Evidencia de Aprendizaje](04-casos-de-uso/CU-015.md)
* [CU-016: Consulta de Evidencias y Vencimientos por Ficha](04-casos-de-uso/CU-016.md)
* [CU-017: Radicación de Entrega de Evidencia con Versionamiento](04-casos-de-uso/CU-017.md)
* [CU-018: Calificación y Retroalimentación de Entregas](04-casos-de-uso/CU-018.md)

### Módulo 3: Recuperación de Competencias
* [CU-019: Identificación de Aprendices en Refuerzo Académico](04-casos-de-uso/CU-019.md)
* [CU-020: Asignación de Plan de Recuperación Académica](04-casos-de-uso/CU-020.md)
* [CU-021: Entrega de Actividad de Refuerzo por el Aprendiz](04-casos-de-uso/CU-021.md)
* [CU-022: Evaluación de Recuperación y Auto-Acreditación](04-casos-de-uso/CU-022.md)

### Módulo 4: Control de Asistencia y Justificaciones
* [CU-023: Programación y Apertura de Sesión de Clase](04-casos-de-uso/CU-023.md)
* [CU-024: Toma de Asistencia y Registro de Novedades](04-casos-de-uso/CU-024.md)
* [CU-025: Radicación y Resolución de Justificación de Inasistencia](04-casos-de-uso/CU-025.md)
* [CU-026: Monitoreo y Disparo de Alertas de Asistencia (< 85%)](04-casos-de-uso/CU-026.md)

### Módulo 5: Reportes y Auditoría Académica
* [CU-027: Generación de Expediente Académico Individual](04-casos-de-uso/CU-027.md)
* [CU-028: Generación de Dossier Consolidado de Ficha](04-casos-de-uso/CU-028.md)
* [CU-029: Exportación de Datos Académicos a Excel (CSV UTF-8)](04-casos-de-uso/CU-029.md)
* [CU-030: Impresión de Reporte Académico en Formato Oficial](04-casos-de-uso/CU-030.md)

### Módulo 6: Centro de Notificaciones y Eventos
* [CU-031: Consulta y Filtrado de Notificaciones del Sistema](04-casos-de-uso/CU-031.md)
* [CU-032: Marcado de Notificación Individual como Leída](04-casos-de-uso/CU-032.md)
* [CU-033: Marcado Masivo de Notificaciones como Leídas](04-casos-de-uso/CU-033.md)
* [CU-034: Despacho Automatizado de Notificaciones por Evento](04-casos-de-uso/CU-034.md)

### Módulo 7: Asistente Contextual EDUNOVA AI
* [CU-035: Consulta al Asistente Académico Contextual](04-casos-de-uso/CU-035.md)
* [CU-036: Streaming en Tiempo Real de Diagnóstico IA](04-casos-de-uso/CU-036.md)
