/**
 * Módulo de Contenido de Documentación General de EDUNOVA (docs/01 a docs/16)
 * Estándar IEEE 830 / ISO/IEC/IEEE 29148
 */

module.exports = {
  '01-introduccion.md': `# 01. INTRODUCCIÓN GENERAL DEL SISTEMA EDUNOVA

## 1.1 Resumen Ejecutivo
**EDUNOVA – Academic Management System** es una solución integral de software diseñada para la modernización, centralización y automatización de la gestión académica y formativa en el contexto del **Servicio Nacional de Aprendizaje (SENA)**. Desarrollada bajo la metodología de formación por competencias laborales, la plataforma articula en un entorno unificado el seguimiento pedagógico de los aprendices, la gestión de evidencias versionadas, la planeación y ejecución de planes de mejoramiento, el control automatizado de asistencia y un asistente contextual impulsado por inteligencia artificial.

La plataforma responde a la necesidad de superar la fragmentación operativa provocada por el uso de herramientas ofimáticas aisladas, formatos impresos y sistemas heterogéneos, garantizando trazabilidad total, integridad referencial y disponibilidad en tiempo real tanto para el cuerpo directivo y de coordinación (Administradores) como para los Instructores y Aprendices.

---

## 1.2 Contexto Institucional y Académico
El desarrollo del proyecto se enmarca dentro de las actividades formativas del programa **Tecnólogo en Análisis y Desarrollo de Software (ADSO)**:

* **Institución:** Servicio Nacional de Aprendizaje (SENA)
* **Regional:** Huila
* **Centro de Formación:** Centro de la Industria, la Empresa y los Servicios (CIES) / Centro de Formación Industrial
* **Programa de Formación:** Tecnólogo en Análisis y Desarrollo de Software (ADSO)
* **Código de Ficha:** 2874102
* **Desarrolladora / Autora:** Anyely Valeria Bautista
* **Modalidad de Desarrollo:** Desarrollo individual asistido por Inteligencia Artificial y metodologías ágiles (Scrum)
* **Versión del Sistema:** v3.0 (Rama \`DEV\`)

---

## 1.3 Propósito del Sistema
El propósito primordial de EDUNOVA es transformar la administración académica en una experiencia ágil, transparente y predictiva mediante:

1. **Centralización de Datos:** Consolidar en una base de datos relacional de alto rendimiento (MySQL 8) toda la información de aprendices, instructores, programas, fichas de caracterización, competencias y novedades.
2. **Trazabilidad Pedagógica:** Registrar el historial inmutable de las evaluaciones de competencias y resultados de aprendizaje (RAPs), permitiendo conocer quién evaluó, en qué fecha y bajo qué criterio.
3. **Optimización del Flujo de Evidencias:** Facilitar la radicación digital de actividades con versionamiento iterativo (v1, v2, ...), permitiendo retroalimentaciones cualitativas y cuantitativas directas.
4. **Prevención de la Deserción:** Detectar automáticamente inasistencias críticas (consecutivas $\\ge 3$ o acumuladas por debajo del 85%), alertando oportunamente a los instructores y administradores.
5. **Asistencia Inteligente:** Proveer un asistente virtual contextual (\`EDUNOVA AI\`) que analiza datos reales de rendimiento, calificaciones y asistencia para orientar tanto al aprendiz en sus hábitos de estudio como al instructor en la formulación de planes de mejoramiento.

---

## 1.4 Estructura Documental del Repositorio
La documentación técnica del sistema se organiza de manera modular bajo estándares internacionales de ingeniería de software (IEEE 830 / ISO/IEC/IEEE 29148). A continuación se describe el mapa de documentos disponibles en este repositorio:

* [01. Introducción General](01-introduccion.md)
* [02. Planteamiento del Problema](02-planteamiento-del-problema.md)
* [03. Justificación y Vigilancia Tecnológica](03-justificacion.md)
* [04. Objetivos del Sistema](04-objetivos.md)
* [05. Alcance y Límites](05-alcance.md)
* [06. Arquitectura del Sistema](06-arquitectura-del-sistema.md)
* [07. Requisitos Funcionales y Matriz de Trazabilidad](07-requisitos-funcionales.md)
* [08. Requisitos No Funcionales](08-requisitos-no-funcionales.md)
* [09. Actores y Perfiles del Sistema](09-actores-del-sistema.md)
* [10. Tabla de Contenido General](10-tabla-de-contenido.md)
* [11. Especificación General de Casos de Uso](11-casos-de-uso.md)
* [12. Modelo Entidad-Relación](12-modelo-entidad-relacion.md)
* [13. Diccionario de Datos](13-diccionario-de-datos.md)
* [14. Tecnologías y Stack Técnico](14-tecnologias.md)
* [15. Seguridad, Autenticación y Permisos](15-seguridad-y-permisos.md)
* [16. Glosario de Términos](16-glosario.md)
* [Carpeta de Casos de Uso Detallados (CU-001 a CU-036)](04-casos-de-uso/README.md)
`,

  '02-planteamiento-del-problema.md': `# 02. PLANTEAMIENTO DEL PROBLEMA

## 2.1 Descripción de la Situación Actual
En múltiples instituciones de educación para el trabajo y el desarrollo humano, así como en diversos centros de formación técnica y tecnológica, la administración cotidiana de los procesos académicos presenta serias dificultades operativas derivadas de la **dispersión y fragmentación de la información**.

Tradicionalmente, los instructores y coordinadores académicos gestionan los registros de aprendices, las calificaciones de actividades, las listas de asistencia y los planes de refuerzo utilizando herramientas ofimáticas descentralizadas (como libros de cálculo de Microsoft Excel o Google Sheets), libretas físicas de apuntes, correos electrónicos personales y carpetas compartidas en servicios de almacenamiento en la nube sin control transaccional.

Esta metodología analógica o semi-digital presenta las siguientes deficiencias críticas:

1. **Pérdida y Corrupción de Datos:** La ausencia de una base de datos centralizada provoca pérdidas accidentales de archivos, sobrescritura de notas y divergencias entre las copias que maneja cada instructor y las que reposan en coordinación.
2. **Duplicidad y Redundancia:** Los datos de un mismo aprendiz (número de documento, nombres, contacto) se replican manualmente en múltiples planillas, propiciando discrepancias de información.
3. **Falta de Trazabilidad en Calificaciones:** Al no existir un histórico formal de cambios, resulta complejo auditar cuándo un aprendiz corrigió una evidencia, quién la evaluó y cuáles fueron los motivos de modificación de la nota.
4. **Detección Tardía del Riesgo Académico:** El cálculo manual de inasistencias o de competencias no aprobadas impide identificar oportunamente a los aprendices en peligro de deserción o cancelación de matrícula, reduciendo el impacto de los comités de evaluación.
5. **Sobrecarga Administrativa en Instructores:** Los docentes invierten una proporción excesiva de su tiempo laboral consolidando reportes y sumando porcentajes en vez de dedicarse a la retroalimentación pedagógica y al acompañamiento formativo.

---

## 2.2 Formulación del Problema (Pregunta Problema)
Partiendo de las debilidades descritas en el ecosistema formativo, se formula la siguiente pregunta de investigación y desarrollo de software:

> **¿Cómo diseñar e implementar una plataforma web de gestión académica integral, que centralice la información de aprendices, instructores, programas de formación, competencias, evidencias, recuperaciones y asistencia en tiempo real, optimizando los tiempos de respuesta y proporcionando soporte predictivo mediante inteligencia artificial?**

---

## 2.3 Árbol de Problemas

\`\`\`mermaid
flowchart TD
    subgraph EFECTOS["Efectos y Consecuencias"]
        E1["Alta tasa de deserción no detectada a tiempo"]
        E2["Inconformidad de aprendices por falta de retroalimentación oportuna"]
        E3["Inconsistencia en reportes institucionales y auditorías"]
        E4["Sobrecarga laboral de instructores en tareas ofimáticas"]
    end

    subgraph PROBLEMA["Problema Central"]
        P["Gestión académica fragmentada, manual y carente de trazabilidad unificada en los centros de formación"]
    end

    subgraph CAUSAS["Causas Raíz"]
        C1["Uso de hojas de cálculo descentralizadas y soportes físicos"]
        C2["Inexistencia de un repositorio único relacional y transaccional"]
        C3["Ausencia de automatización en el cómputo de asistencia y alertas"]
        C4["Falta de canales centralizados para radicación y versionamiento de evidencias"]
    end

    C1 --> P
    C2 --> P
    C3 --> P
    C4 --> P
    P --> E1
    P --> E2
    P --> E3
    P --> E4
\`\`\`
`,

  '03-justificacion.md': `# 03. JUSTIFICACIÓN Y VIGILANCIA TECNOLÓGICA

## 3.1 Justificación Institucional y Académica
La implementación de **EDUNOVA** es crucial para robustecer los procesos de aseguramiento de la calidad educativa en la formación profesional integral. Al automatizar la captura de evidencias, el cómputo de asistencias y la evaluación por competencias, el sistema democratiza el acceso a la información para los aprendices, quienes disponen de visibilidad inmediata de su progreso, garantizando el principio de debido proceso y transparencia evaluativa.

Asimismo, alinea las directrices pedagógicas del modelo SENA (basado en Resultados de Aprendizaje - RAPs y Juicios Evaluativos) con una herramienta moderna que minimiza el error humano en la generación de comités y actas de seguimiento.

---

## 3.2 Justificación Técnica
Desde la perspectiva de la ingeniería de software, EDUNOVA implementa un stack tecnológico contemporáneo y de alto rendimiento:

1. **Arquitectura Desacoplada y Modular:** Frontend reactivo construido en **React 18** y **Vite**, separado de una API RESTful en **Node.js (v24)** y **Express**, permitiendo escalabilidad horizontal y mantenimiento independiente.
2. **Modelo Relacional Transaccional:** Base de datos **MySQL 8** modelada bajo la Tercera Forma Normal (3FN), garantizando integridad referencial, transacciones ACID mediante **Prisma ORM** y optimización con índices compuestos para consultas de alto tráfico.
3. **Seguridad y Control de Acceso (RBAC):** Cifrado robusto de contraseñas con **Bcrypt (10 salt rounds)** y autenticación sin estado mediante tokens **JWT (JSON Web Token)** con discriminación de roles (\`ADMIN\`, \`INSTRUCTOR\`, \`APRENDIZ\`).
4. **Innovación Visual y Telemetría:** Integración de un Hero Canvas 3D interactivo en **Three.js**, diseño con paleta tecnológica **Ocean Tech Premium / Factory System** con efecto Glassmorphism optimizado, y endpoints de inteligencia artificial con streaming reactivo de respuestas token a token.

---

## 3.3 Vigilancia Tecnológica y Comparativa de Mercado

| Criterio / Plataforma | Moodle LMS | Canvas LMS | Territorio / Zajuna (SENA) | EDUNOVA (Propuesta) |
| :--- | :--- | :--- | :--- | :--- |
| **Enfoque Pedagógico** | Modular genérico | Cursos universitarios | Formación técnica SENA | Competencias SENA + RAPs + Evidencias |
| **Curva de Aprendizaje** | Alta (Interfaz densa) | Media | Media-Alta | Baja (UX moderna, Glassmorphism) |
| **Control de Asistencia** | Plugin de terceros | Básico | Módulo externo | Automatizado (alertas 85% y faltas) |
| **Versionamiento de Entregas**| No nativo (sobreescritura)| Historial básico | Historial básico | Versionamiento automático (v1, v2...) |
| **Planes de Refuerzo** | Tarea manual adicional | Manual | Manual en acta externa | Integrado con auto-acreditación |
| **Asistente de IA Académica** | No nativo | Complemento de pago | No disponible | Asistente contextual con datos reales |
| **Consumo de Recursos** | Alto (PHP/Apache) | Muy Alto (Ruby/Cloud) | Alto | Muy Bajo (Node.js/React/MySQL 8) |
`,

  '04-objetivos.md': `# 04. OBJETIVOS DEL SISTEMA

## 4.1 Objetivo General
Desarrollar, implementar y documentar la plataforma web **EDUNOVA – Academic Management System**, con el fin de centralizar, automatizar y auditar la administración académica de aprendices, instructores, programas de formación, competencias, evidencias, recuperaciones y control de asistencia en centros de formación técnica y tecnológica, incorporando herramientas de análisis de datos y asistencia pedagógica mediante Inteligencia Artificial.

---

## 4.2 Objetivos Específicos

1. **Diseñar e Implementar la Capa de Seguridad y Autenticación:**
   Establecer un esquema de control de acceso basado en roles (RBAC) para perfiles \`ADMIN\`, \`INSTRUCTOR\` y \`APRENDIZ\`, empleando tokens criptográficos JWT y hashing de contraseñas con Bcrypt.

2. **Desarrollar el Módulo de Seguimiento por Competencias (Módulo 1):**
   Gestionar la estructura de competencias laborales y Resultados de Aprendizaje (RAPs) por programa, permitiendo la asignación a fichas y aprendices con cálculo automático de avance porcentual y registro inmutable en el historial de seguimiento.

3. **Construir el Módulo de Gestión Completa de Evidencias (Módulo 2):**
   Implementar el ciclo de vida de evidencias de aprendizaje (publicación por instructor, radicación con versionamiento progresivo por aprendiz y calificación cuantitativa/cualitativa con retroalimentación).

4. **Implementar el Sistema de Recuperación de Competencias (Módulo 3):**
   Facilitar la identificación de aprendices con competencias en estado "Requiere Refuerzo", asignando planes de mejoramiento con entrega digital y habilitando la auto-acreditación de la competencia al aprobar la actividad de refuerzo.

5. **Automatizar el Control de Asistencia y Novedades (Módulo 4):**
   Registrar la asistencia por sesiones de clase, calculando de forma acumulativa el porcentaje por aprendiz, emitiendo alertas por ausencias consecutivas ($\ge 3$) y alertando el umbral crítico de inasistencia ($< 85\\%$), con radicación digital de justificaciones médicas.

6. **Generar Reportes Académicos Oficiales y Dossiers (Módulo 5):**
   Proveer la generación dinámica de expedientes individuales de aprendices y dossiers consolidados de fichas en formatos imprimibles PDF y hojas de cálculo Excel (.csv UTF-8 con delimitación estándar).

7. **Crear el Centro de Notificaciones en Tiempo Real (Módulo 6):**
   Diseñar un bus de eventos y notificaciones internas categorizadas (Evidencias, Calificaciones, Asistencia, Recuperaciones, Alertas) con opciones de lectura individual y masiva.

8. **Integrar el Asistente Contextual EDUNOVA AI (Módulo 7):**
   Conectar un agente inteligente que consume la telemetría y datos reales de la base de datos MySQL 8 para emitir recomendaciones académicas personalizadas mediante streaming de texto en tiempo real.

9. **Garantizar la Calidad, Rendimiento y Usabilidad:**
   Asegurar tiempos de respuesta inferiores a 500 ms mediante indexación en MySQL 8, diseño responsivo adaptativo bajo el sistema de diseño Factory / Ocean Tech Premium y cobertura técnica documentada bajo IEEE 830.
`,

  '05-alcance.md': `# 05. ALCANCE Y LÍMITES DEL SISTEMA

## 5.1 Delimitación Espacial y Contextual
El sistema EDUNOVA está concebido para operar en entornos educativos del Servicio Nacional de Aprendizaje (SENA) a nivel regional (Regional Huila, Centro de Formación Industrial) y es extensible a instituciones de educación técnica y superior que operen bajo el enfoque de formación basada en competencias.

---

## 5.2 Funcionalidades Implementadas (Rama DEV - 100% Operativas)

Las siguientes funcionalidades se encuentran plenamente codificadas, conectadas a la base de datos MySQL 8 y verificadas en la rama \`DEV\`:

| Módulo / Componente | Funcionalidad Específica | Estado en Código |
| :--- | :--- | :--- |
| **Seguridad y Perfiles** | Login con JWT, logout seguro, edición de perfil y control de rutas RBAC | Implementado |
| **Administración Base** | Gestión CRUD de Usuarios, Programas de Formación y Fichas/Cursos | Implementado |
| **Inscripciones** | Matrícula de aprendices en cursos y asignación de instructores | Implementado |
| **M1: Competencias** | Catálogo de competencias y RAPs, avance porcentual, historial inmutable | Implementado |
| **M2: Evidencias** | Creación de evidencias, entregas versionadas (\`v1, v2...\`), calificación y feedback | Implementado |
| **M3: Recuperaciones**| Identificación de refuerzos, asignación de planes, entrega y auto-acreditación | Implementado |
| **M4: Asistencia** | Sesiones de clase, planilla en vivo, cálculo < 85%, justificaciones con soporte | Implementado |
| **M5: Reportes** | Expediente individual PDF, Dossier grupal PDF, exportación Excel CSV UTF-8 | Implementado |
| **M6: Notificaciones** | Disparador de eventos, bandeja filtrable por categoría, marcado de leídas | Implementado |
| **M7: EDUNOVA AI** | Consultas contextuales conectadas a MySQL 8 y streaming reactivo token a token | Implementado |
| **Frontend 3D** | Hero Banner animado e interactivo con WebGL / Three.js | Implementado |

---

## 5.3 Funcionalidades Pendientes y Propuestas Futuras
Para mantener absoluta transparencia con respecto al estado real del desarrollo, las siguientes características no están en el código y se catalogan como **Propuestas / Pendientes**:

| Característica Propuesta | Justificación del Estado Pendiente | Clasificación |
| :--- | :--- | :--- |
| **Integración con SOFIA Plus / Zajuna** | Requiere APIs oficiales gubernamentales o web scraping con credenciales institucionales no provistas. | Propuesta Externa |
| **Firma Digital Biométrica** | Depende de hardware capturador de huellas o certificados digitales de entidades de certificación cerrada. | Propuesta Futura |
| **Aplicación Móvil Nativa (Android/iOS)** | El diseño actual es una SPA Web Responsive altamente adaptable; la app compilada en Flutter queda como fase posterior. | Pendiente Fase 2 |
| **Recuperación de Contraseña por Correo SMTP**| Actualmente se simula vía consola/mock en desarrollo; el envío real requiere configurar pasarela SMTP corporativa (SendGrid/AWS SES). | Pendiente Configuración |

---

## 5.4 Criterios de Aceptación Globales
1. Toda transacción de modificación de estado pedagógico queda registrada en auditoría.
2. Los aprendices solo tienen acceso de lectura a sus propios datos e historial.
3. El cálculo de porcentajes de inasistencia es consistente y automático sin intervención manual del usuario.
4. Las contraseñas de los usuarios nunca se transmiten en texto plano ni se guardan sin hash Bcrypt.
`,

  '06-arquitectura-del-sistema.md': `# 06. ARQUITECTURA DEL SISTEMA

## 6.1 Patrón Arquitectónico General
EDUNOVA se estructura bajo el patrón de **Arquitectura Modular de Tres Capas** (Capa de Presentación, Capa Lógica de Negocio y Capa de Persistencia de Datos), articulada a través de servicios desacoplados bajo el estándar arquitectónico **REST (Representational State Transfer)**.

\`\`\`mermaid
flowchart TB
    subgraph CLIENTE["Capa de Presentación (Frontend SPA)"]
        UI["React 18 + Vite + Tailwind CSS"]
        T3D["Three.js / Canvas 3D Interactivo"]
        STATE["Contexto Global / Hooks Reactivos"]
        API_CLIENT["Axios / Fetch Client (Interceptors JWT)"]
        UI --> STATE
        T3D --> UI
        STATE --> API_CLIENT
    end

    subgraph SERVIDOR["Capa Lógica de Negocio (Backend REST API)"]
        ROUTER["Enrutadores Express (Rutas Modularizadas)"]
        AUTH_MID["Middleware de Autenticación JWT y RBAC"]
        AUDIT_MID["Middleware de Auditoría y Telemetría"]
        
        subgraph CONTROLADORES["Controladores de Módulos"]
            C_AUTH["auth.controller"]
            C_COMP["competencias.controller"]
            C_EVID["evidencias.controller"]
            C_REC["recuperaciones.controller"]
            C_ASIS["asistencia.controller"]
            C_REP["reportes.controller"]
            C_NOT["notificaciones.controller"]
            C_AI["ai.controller"]
        end

        SRV_NOTIF["Notification & Event Service"]
        PRISMA["Prisma ORM Client (Data Access Layer)"]

        ROUTER --> AUTH_MID
        AUTH_MID --> AUDIT_MID
        AUDIT_MID --> CONTROLADORES
        CONTROLADORES --> SRV_NOTIF
        CONTROLADORES --> PRISMA
    end

    subgraph PERSISTENCIA["Capa de Datos (MySQL 8)"]
        DB[("MySQL 8 Engine\nInnoDB Transaccional\n22 Tablas Relacionales")]
        PRISMA --> DB
    end

    API_CLIENT <-->|"HTTP / HTTPS (JSON + JWT Bearer Token)"| ROUTER
\`\`\`

---

## 6.2 Diagrama de Despliegue Físico

\`\`\`mermaid
deploymentDiagram
    node "Navegador Web del Cliente" {
        artifact "Bundle SPA (HTML5, JS, CSS, WebGL)"
    }

    node "Servidor de Aplicaciones (Node.js Environment)" {
        artifact "Express API Gateway"
        artifact "Prisma Client Engine"
        artifact "In-Memory Session & Telemetry Cache"
    }

    node "Servidor de Base de Datos" {
        database "MySQL 8.0 Server (edunova_db)"
    }

    "Navegador Web del Cliente" -- "TCP/IP Port 5173 / HTTPS" --> "Servidor de Aplicaciones (Node.js Environment)"
    "Servidor de Aplicaciones (Node.js Environment)" -- "TCP/IP Port 3306" --> "Servidor de Base de Datos"
\`\`\`

---

## 6.3 Descripción de Componentes Principales

1. **Frontend (SPA - Single Page Application):**
   * **React 18:** Motor de renderizado reactivo basado en componentes funcionales y Hooks.
   * **Vite:** Herramienta de compilación ultrarrápida con Hot Module Replacement (HMR).
   * **Tailwind CSS & Factory System:** Estilización utilitaria para Glassmorphism, paleta Ocean Tech y modo oscuro de alta precisión.
   * **Three.js WebGL Canvas:** Núcleo geométrico interactivo en el Hero del dashboard que reacciona al cursor del usuario.

2. **Backend (API RESTful):**
   * **Node.js (v24):** Entorno de ejecución JavaScript del lado del servidor de alto desempeño.
   * **Express.js:** Framework minimalista para la estructuración de rutas, middlewares y controladores.
   * **Prisma ORM:** Capa de mapeo objeto-relacional tipada y segura contra inyecciones SQL que administra las 22 entidades de la base de datos.
   * **JWT & Bcrypt:** Criptografía para autenticación sin estado y hash irreversible de credenciales.
   * **OpenTelemetry & Cache:** Monitoreo de latencia de endpoints y almacenamiento en memoria de métricas frecuentes.

3. **Capa de Persistencia:**
   * **MySQL 8:** Motor relacional con almacenamiento InnoDB, soporte de claves foráneas con restricciones \`CASCADE\` / \`SET NULL\` y transacciones ACID.
`,

  '07-requisitos-funcionales.md': `# 07. REQUISITOS FUNCIONALES Y MATRIZ DE TRAZABILIDAD

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
| **RF-017** | Radicación de entrega de evidencia con versionamiento automático (\`v1, v2...\`). | M2: Evidencias | Crítica | Aprendiz |
| **RF-018** | Calificación cuantitativa/cualitativa y retroalimentación de entregas de evidencias. | M2: Evidencias | Crítica | Instructor |
| **RF-019** | Detección y listado de aprendices con competencias en estado "Requiere Refuerzo". | M3: Recuperaciones | Alta | Instructor |
| **RF-020** | Asignación de planes de recuperación académica con fechas límite y actividades. | M3: Recuperaciones | Crítica | Instructor |
| **RF-021** | Envío de actividad de recuperación por parte del aprendiz asignado. | M3: Recuperaciones | Crítica | Aprendiz |
| **RF-022** | Evaluación de actividad de refuerzo y auto-acreditación de la competencia a APROBADA. | M3: Recuperaciones | Crítica | Instructor |
| **RF-023** | Creación y programación de sesiones de clase con fecha, tema y horario. | M4: Asistencia | Alta | Instructor |
| **RF-024** | Registro de asistencia por sesión con estados detallados (Asistió, Ausente, Retardo).| M4: Asistencia | Crítica | Instructor |
| **RF-025** | Radicación y resolución de justificaciones de inasistencia con soporte documental. | M4: Asistencia | Alta | Aprendiz / Instructor |
| **RF-026** | Monitoreo automatizado de alertas por ausencias consecutivas ($\ge 3$) y umbral $< 85\\%$.| M4: Asistencia | Alta | Sistema / Instructor |
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
| **RF-001** | [CU-001](04-casos-de-uso/CU-001.md) | Seguridad / Auth | \`USUARIO\`, \`APRENDIZ\`, \`INSTRUCTOR\` | Todos los Usuarios |
| **RF-002** | [CU-002](04-casos-de-uso/CU-002.md) | Seguridad / Auth | \`HISTORIAL_AUDITORIA\` | Todos los Usuarios |
| **RF-003** | [CU-003](04-casos-de-uso/CU-003.md) | Seguridad / Auth | \`USUARIO\` | Todos los Usuarios |
| **RF-004** | [CU-004](04-casos-de-uso/CU-004.md) | Perfil | \`USUARIO\`, \`APRENDIZ\`, \`INSTRUCTOR\` | Todos los Usuarios |
| **RF-005** | [CU-005](04-casos-de-uso/CU-005.md) | Administración | \`USUARIO\`, \`APRENDIZ\`, \`INSTRUCTOR\` | Administrador |
| **RF-006** | [CU-006](04-casos-de-uso/CU-006.md) | Administración | \`PROGRAMA\` | Administrador |
| **RF-007** | [CU-007](04-casos-de-uso/CU-007.md) | Administración | \`CURSO\`, \`PROGRAMA\` | Administrador |
| **RF-008** | [CU-008](04-casos-de-uso/CU-008.md) | Administración | \`CURSO_INSTRUCTOR\`, \`INSTRUCTOR\` | Administrador |
| **RF-009** | [CU-009](04-casos-de-uso/CU-009.md) | Administración | \`INSCRIPCION\`, \`APRENDIZ\`, \`CURSO\` | Administrador |
| **RF-010** | [CU-010](04-casos-de-uso/CU-010.md) | Dashboard | Múltiples Tablas (Agregación) | Administrador |
| **RF-011** | [CU-011](04-casos-de-uso/CU-011.md) | M1: Competencias | \`COMPETENCIA\`, \`RESULTADO_APRENDIZAJE\`| Instructor / Aprendiz |
| **RF-012** | [CU-012](04-casos-de-uso/CU-012.md) | M1: Competencias | \`SEGUIMIENTO_COMPETENCIA\`, \`INSCRIPCION\`| Aprendiz / Instructor |
| **RF-013** | [CU-013](04-casos-de-uso/CU-013.md) | M1: Competencias | \`SEGUIMIENTO_COMPETENCIA\`, \`CURSO\` | Instructor / Admin |
| **RF-014** | [CU-014](04-casos-de-uso/CU-014.md) | M1: Competencias | \`SEGUIMIENTO_COMPETENCIA\`, \`HISTORIAL_SEGUIMIENTO\`| Instructor |
| **RF-015** | [CU-015](04-casos-de-uso/CU-015.md) | M2: Evidencias | \`EVIDENCIA\`, \`CURSO\`, \`RESULTADO_APRENDIZAJE\`| Instructor |
| **RF-016** | [CU-016](04-casos-de-uso/CU-016.md) | M2: Evidencias | \`EVIDENCIA\`, \`ENTREGA_EVIDENCIA\` | Aprendiz / Instructor |
| **RF-017** | [CU-017](04-casos-de-uso/CU-017.md) | M2: Evidencias | \`ENTREGA_EVIDENCIA\`, \`INSCRIPCION\`| Aprendiz |
| **RF-018** | [CU-018](04-casos-de-uso/CU-018.md) | M2: Evidencias | \`ENTREGA_EVIDENCIA\`, \`CALIFICACION\`| Instructor |
| **RF-019** | [CU-019](04-casos-de-uso/CU-019.md) | M3: Recuperaciones | \`SEGUIMIENTO_COMPETENCIA\`, \`INSCRIPCION\`| Instructor |
| **RF-020** | [CU-020](04-casos-de-uso/CU-020.md) | M3: Recuperaciones | \`RECUPERACION\`, \`RESULTADO_APRENDIZAJE\`| Instructor |
| **RF-021** | [CU-021](04-casos-de-uso/CU-021.md) | M3: Recuperaciones | \`RECUPERACION\` | Aprendiz |
| **RF-022** | [CU-022](04-casos-de-uso/CU-022.md) | M3: Recuperaciones | \`RECUPERACION\`, \`SEGUIMIENTO_COMPETENCIA\`| Instructor |
| **RF-023** | [CU-023](04-casos-de-uso/CU-023.md) | M4: Asistencia | \`SESION_CLASE\`, \`CURSO\` | Instructor |
| **RF-024** | [CU-024](04-casos-de-uso/CU-024.md) | M4: Asistencia | \`REGISTRO_ASISTENCIA\`, \`SESION_CLASE\`| Instructor |
| **RF-025** | [CU-025](04-casos-de-uso/CU-025.md) | M4: Asistencia | \`JUSTIFICACION_ASISTENCIA\` | Aprendiz / Instructor |
| **RF-026** | [CU-026](04-casos-de-uso/CU-026.md) | M4: Asistencia | \`REGISTRO_ASISTENCIA\`, \`NOTIFICACION\`| Sistema / Instructor |
| **RF-027** | [CU-027](04-casos-de-uso/CU-027.md) | M5: Reportes | Consolidado Multi-tabla | Instructor / Admin |
| **RF-028** | [CU-028](04-casos-de-uso/CU-028.md) | M5: Reportes | Consolidado Ficha Multi-tabla | Instructor / Admin |
| **RF-029** | [CU-029](04-casos-de-uso/CU-029.md) | M5: Reportes | Consolidado CSV Export | Instructor / Admin |
| **RF-030** | [CU-030](04-casos-de-uso/CU-030.md) | M5: Reportes | Render CSS Print Engine | Todos los Roles |
| **RF-031** | [CU-031](04-casos-de-uso/CU-031.md) | M6: Notificaciones| \`NOTIFICACION\` | Todos los Usuarios |
| **RF-032** | [CU-032](04-casos-de-uso/CU-032.md) | M6: Notificaciones| \`NOTIFICACION\` | Todos los Usuarios |
| **RF-033** | [CU-033](04-casos-de-uso/CU-033.md) | M6: Notificaciones| \`NOTIFICACION\` | Todos los Usuarios |
| **RF-034** | [CU-034](04-casos-de-uso/CU-034.md) | M6: Notificaciones| \`NOTIFICACION\`, Event Bus | Sistema Automatizado |
| **RF-035** | [CU-035](04-casos-de-uso/CU-035.md) | M7: EDUNOVA AI | \`USUARIO\`, Contexto MySQL | Aprendiz / Instructor |
| **RF-036** | [CU-036](04-casos-de-uso/CU-036.md) | M7: EDUNOVA AI | Stream SSE / Telemetría | Aprendiz / Instructor |
`,

  '08-requisitos-no-funcionales.md': `# 08. REQUISITOS NO FUNCIONALES (RNF)

## 8.1 Catálogo de Requisitos No Funcionales (RNF-001 a RNF-015)

| Código | Categoría | Nombre del Requisito | Métrica / Criterio de Medición |
| :--- | :--- | :--- | :--- |
| **RNF-001** | Rendimiento | Tiempo de Respuesta de la API | El 95% de las consultas debe responder en $< 500\\text{ ms}$ en condiciones normales. |
| **RNF-002** | Rendimiento | Optimización de Base de Datos | Todas las claves foráneas y campos de búsqueda frecuente cuentan con índices compuestos B-Tree en MySQL 8. |
| **RNF-003** | Rendimiento | Optimización del Frontend | Implementación de debounce en inputs de búsqueda (300 ms), lazy loading y compresión Brotli/Gzip en servidor. |
| **RNF-004** | Rendimiento | Telemetría Token a Token | El asistente IA entrega flujo continuo de tokens por Server-Sent Events con primer byte $< 800\\text{ ms}$. |
| **RNF-005** | Seguridad | Cifrado y Hashing de Credenciales | Contraseñas protegidas mediante algoritmo Bcrypt con factor de costo 10 (\`salt rounds\`). |
| **RNF-006** | Seguridad | Autenticación Stateless JWT | Sesiones administradas por JSON Web Tokens firmados criptográficamente mediante clave privada en variable de entorno. |
| **RNF-007** | Seguridad | Prevención de Inyecciones | Sanitización absoluta de consultas SQL mediante el cliente parametrizado de Prisma ORM. |
| **RNF-008** | Seguridad | Control de Acceso por Rol (RBAC) | Middlewares dedicados en backend verifican permisos por endpoint impidiendo escalamiento de privilegios. |
| **RNF-009** | Usabilidad | Sistema de Diseño Factory / Glassmorphism | Estética moderna de alto contraste, tipografía Geist, bordes hairline y paleta Ocean Tech Premium sin saturaciones. |
| **RNF-010** | Usabilidad | Diseño Web Adaptativo (Responsive) | Visualización fluida garantizada en pantallas de escritorio ($> 1280\\text{px}$), tablets ($768\\text{px}$) y móviles ($< 480\\text{px}$). |
| **RNF-011** | Confiabilidad | Integridad Referencial | Restricciones de integridad \`CASCADE\` y \`SET NULL\` que previenen registros huérfanos ante eliminaciones. |
| **RNF-012** | Confiabilidad | Trazabilidad e Inmutabilidad | Los cambios de estado de competencias se respaldan en \`HISTORIAL_SEGUIMIENTO\` sin posibilidad de borrado directo. |
| **RNF-013** | Disponibilidad | Tolerancia a Fallos | Mecanismos de recuperación automática y control global de excepciones en el servidor Express. |
| **RNF-014** | Mantenibilidad | Arquitectura Modular Desacoplada | Código organizado en capas independientes (Rutas, Middlewares, Controladores, Servicios, Esquemas). |
| **RNF-015** | Portabilidad | Compatibilidad Multi-navegador | Funcionamiento verificado en Google Chrome ($\ge 110$), Mozilla Firefox ($\ge 115$), Microsoft Edge y Safari ($\ge 16$). |
`,

  '09-actores-del-sistema.md': `# 09. ACTORES Y PERFILES DEL SISTEMA

## 9.1 Definición de Actores
En el ecosistema de EDUNOVA convergen tanto **actores humanos** como **actores de software / procesos automatizados**:

### 1. Actores Humanos
* **Administrador (\`ADMIN\`):**
  Personal directivo, coordinador académico o administrador técnico del centro de formación. Posee privilegios globales para crear usuarios, asignar roles, gestionar programas de formación, aperturar fichas de caracterización, matricular aprendices, auditar registros y consultar la telemetría general.
* **Instructor (\`INSTRUCTOR\`):**
  Docente o instructor técnico responsable de la orientación formativa de una o más fichas. Gestiona las competencias de sus cursos, evalúa los Resultados de Aprendizaje, publica evidencias, califica entregas versionadas, asigna planes de mejoramiento/recuperación, toma asistencia por sesión y emite reportes académicos.
* **Aprendiz (\`APRENDIZ\`):**
  Estudiante matriculado en uno o más programas de formación. Consulta su estado de competencias, entrega evidencias de aprendizaje en versiones sucesivas, radica actividades de refuerzo, consulta sus asistencias acumuladas, registra justificaciones médicas con soporte y dialoga con el asistente pedagógico EDUNOVA AI.

### 2. Actores de Software / Procesos del Sistema
* **EDUNOVA AI Agent:**
  Servicio cognitivo contextual que procesa el estado académico real del aprendiz para sintetizar diagnósticos personalizados y sugerir acciones pedagógicas.
* **Servicio de Notificaciones y Event Bus:**
  Subsistema automatizado que detecta eventos de mutación de datos (por ejemplo, una nueva calificación, una falta de asistencia o una evidencia publicada) y despacha notificaciones internas a los destinatarios.
* **Motor de Auditoría (\`HistorialAuditoria\`):**
  Interceptor que captura las acciones críticas ejecutadas en el sistema junto con la dirección IP, fecha y usuario responsable.

---

## 9.2 Diagrama de Jerarquía de Actores (Mermaid)

\`\`\`mermaid
classDiagram
    class Usuario {
        <<Abstract>>
        +String nombre
        +String correo
        +String password_hash
        +iniciarSesion()
        +cerrarSesion()
        +consultarPerfil()
    }

    class Administrador {
        +gestionarUsuarios()
        +gestionarProgramas()
        +gestionarCursos()
        +matricularAprendices()
        +consultarAuditoria()
    }

    class Instructor {
        +evaluarCompetencias()
        +publicarEvidencias()
        +calificarEntregas()
        +asignarRecuperaciones()
        +tomarAsistencia()
        +generarReportes()
    }

    class Aprendiz {
        +consultarProgreso()
        +radicarEntregas()
        +entregarRecuperacion()
        +radicarJustificacion()
        +consultarAsistencias()
    }

    Usuario <|-- Administrador
    Usuario <|-- Instructor
    Usuario <|-- Aprendiz
\`\`\`

---

## 9.3 Matriz de Permisos por Rol (CRUD)

| Módulo / Recurso | Administrador | Instructor | Aprendiz |
| :--- | :---: | :---: | :---: |
| **Usuarios y Roles** | CRUD Completo | Lectura Perfil Propio | Lectura Perfil Propio |
| **Programas de Formación** | CRUD Completo | Solo Lectura | Solo Lectura |
| **Cursos / Fichas** | CRUD Completo | Lectura Asignados | Lectura Inscritos |
| **Competencias y RAPs** | CRUD Completo | Lectura y Evaluación | Solo Lectura |
| **Evidencias de Aprendizaje**| Lectura | Crear / Editar / Calificar | Radicar Entrega |
| **Planes de Recuperación** | Lectura | Asignar / Evaluar | Entregar Actividad |
| **Sesiones y Asistencia** | Lectura | Programar / Calificar / Resolver | Justificar / Consultar |
| **Expedientes y Dossiers** | Generar / Imprimir | Generar / Imprimir | Consultar Propio |
| **Notificaciones** | Recibir / Marcar | Recibir / Marcar | Recibir / Marcar |
| **EDUNOVA AI** | Consultas Globales | Consultas Ficha | Consultas Propias |
`,

  '10-tabla-de-contenido.md': `# 10. TABLA DE CONTENIDO GENERAL

Este índice maestro articula todos los documentos técnicos de la plataforma **EDUNOVA** en la rama \`DEV\`, permitiendo una navegación hipertextual rápida y estructurada:

---

## 📑 1. Documentación de Ingeniería de Software (01 a 16)
1. [01. Introducción General del Sistema EDUNOVA](01-introduccion.md)
   * Resumen Ejecutivo, Contexto Institucional SENA (ADSO Ficha 2874102) y Propósito.
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
`,

  '11-casos-de-uso.md': `# 11. ESPECIFICACIÓN GENERAL DE CASOS DE USO Y DIAGRAMAS UML

## 11.1 Introducción
Los Casos de Uso de EDUNOVA modelan las interacciones formales entre los actores (humanos y automatizados) y el sistema de información. Cada caso de uso representa una unidad completa de trabajo de negocio que genera un resultado de valor observable.

A continuación se presentan el **Diagrama Global del Sistema** y **10 Diagramas Detallados por Módulo**, elaborados bajo el estándar gráfico UML mediante sintaxis Mermaid.

---

## 11.2 Diagrama General de Casos de Uso del Sistema EDUNOVA

\`\`\`mermaid
flowchart LR
    subgraph ACTORES["Actores del Sistema"]
        A_ADM["Administrador"]
        A_INS["Instructor"]
        A_APR["Aprendiz"]
        A_SYS["Servicios del Sistema"]
    end

    subgraph SISTEMA["Plataforma EDUNOVA"]
        CU_AUTH["CU-001: Iniciar Sesión"]
        CU_USU["CU-005: Gestionar Usuarios"]
        CU_CUR["CU-007: Gestionar Fichas"]
        CU_COMP["CU-014: Evaluar Competencias"]
        CU_EVID["CU-017: Radicar Evidencias"]
        CU_REC["CU-020: Asignar Recuperación"]
        CU_ASIS["CU-024: Tomar Asistencia"]
        CU_REP["CU-027: Generar Expediente"]
        CU_NOT["CU-034: Despachar Notificación"]
        CU_AI["CU-035: Consultar EDUNOVA AI"]
    end

    A_ADM --> CU_AUTH
    A_ADM --> CU_USU
    A_ADM --> CU_CUR
    A_ADM --> CU_REP

    A_INS --> CU_AUTH
    A_INS --> CU_COMP
    A_INS --> CU_REC
    A_INS --> CU_ASIS
    A_INS --> CU_REP

    A_APR --> CU_AUTH
    A_APR --> CU_EVID
    A_APR --> CU_AI

    A_SYS --> CU_NOT
\`\`\`

---

## 11.3 Diagramas de Casos de Uso por Módulo

### 1. Módulo: Autenticación y Perfil
\`\`\`mermaid
flowchart LR
    actor Usuario
    subgraph MOD_AUTH["Módulo: Autenticación y Perfil"]
        CU1["CU-001: Iniciar Sesión"]
        CU2["CU-002: Cerrar Sesión"]
        CU3["CU-003: Recuperar Contraseña (Mock)"]
        CU4["CU-004: Consultar / Actualizar Perfil"]
        VAL["<<include>> Validar Credenciales Bcrypt"]
        JWT["<<include>> Emitir Token JWT"]
    end
    Usuario --> CU1
    Usuario --> CU2
    Usuario --> CU3
    Usuario --> CU4
    CU1 -.-> VAL
    CU1 -.-> JWT
\`\`\`

### 2. Módulo: Administración Base y Fichas
\`\`\`mermaid
flowchart LR
    actor Admin["Administrador"]
    subgraph MOD_ADM["Módulo: Administración Base"]
        CU5["CU-005: Gestionar Usuarios"]
        CU6["CU-006: Gestionar Programas"]
        CU7["CU-007: Gestionar Cursos/Fichas"]
        CU8["CU-008: Asignar Instructores"]
        CU9["CU-009: Matricular Aprendices"]
        CU10["CU-010: Estadísticas Globales"]
    end
    Admin --> CU5
    Admin --> CU6
    Admin --> CU7
    Admin --> CU8
    Admin --> CU9
    Admin --> CU10
\`\`\`

### 3. Módulo 1: Seguimiento por Competencias y RAPs
\`\`\`mermaid
flowchart LR
    actor Instructor
    actor Aprendiz
    subgraph MOD_M1["Módulo 1: Competencias"]
        CU11["CU-011: Consultar Competencias del Programa"]
        CU12["CU-012: Consultar Avance por Aprendiz"]
        CU13["CU-013: Monitoreo Grupal por Ficha"]
        CU14["CU-014: Evaluar Competencia y Registrar Historial"]
        HIST["<<include>> Registrar Historial Inmutable"]
    end
    Aprendiz --> CU11
    Aprendiz --> CU12
    Instructor --> CU11
    Instructor --> CU13
    Instructor --> CU14
    CU14 -.-> HIST
\`\`\`

### 4. Módulo 2: Gestión de Evidencias y Entregas
\`\`\`mermaid
flowchart LR
    actor Instructor
    actor Aprendiz
    subgraph MOD_M2["Módulo 2: Evidencias"]
        CU15["CU-015: Publicar Evidencia"]
        CU16["CU-016: Consultar Evidencias y Fechas"]
        CU17["CU-017: Radicar Entrega Versionada"]
        CU18["CU-018: Calificar y Retroalimentar"]
        VER["<<include>> Incrementar Versión (v1, v2...)"]
    end
    Instructor --> CU15
    Instructor --> CU16
    Instructor --> CU18
    Aprendiz --> CU16
    Aprendiz --> CU17
    CU17 -.-> VER
\`\`\`

### 5. Módulo 3: Recuperación de Competencias
\`\`\`mermaid
flowchart LR
    actor Instructor
    actor Aprendiz
    subgraph MOD_M3["Módulo 3: Recuperaciones"]
        CU19["CU-019: Identificar Aprendices en Refuerzo"]
        CU20["CU-020: Asignar Plan de Mejoramiento"]
        CU21["CU-021: Entregar Actividad de Refuerzo"]
        CU22["CU-022: Evaluar y Auto-Acreditar"]
        ACRED["<<extend>> Auto-Acreditar Competencia a Aprobada"]
    end
    Instructor --> CU19
    Instructor --> CU20
    Instructor --> CU22
    Aprendiz --> CU21
    CU22 -.-> ACRED
\`\`\`

### 6. Módulo 4: Control de Asistencia y Justificaciones
\`\`\`mermaid
flowchart LR
    actor Instructor
    actor Aprendiz
    actor Sistema["Servicio de Alertas"]
    subgraph MOD_M4["Módulo 4: Asistencia"]
        CU23["CU-023: Programar Sesión de Clase"]
        CU24["CU-024: Tomar Asistencia en Vivo"]
        CU25["CU-025: Radicar/Resolver Justificación"]
        CU26["CU-026: Monitorear Umbral < 85% y Faltas"]
    end
    Instructor --> CU23
    Instructor --> CU24
    Instructor --> CU25
    Aprendiz --> CU25
    Sistema --> CU26
\`\`\`

### 7. Módulo 5: Centro de Reportes y Dossiers
\`\`\`mermaid
flowchart LR
    actor Instructor
    actor Admin["Administrador"]
    subgraph MOD_M5["Módulo 5: Reportes"]
        CU27["CU-027: Expediente Individual Aprendiz"]
        CU28["CU-028: Dossier Consolidado de Ficha"]
        CU29["CU-029: Exportar Datos a Excel (CSV)"]
        CU30["CU-030: Formato de Impresión Oficial"]
    end
    Instructor --> CU27
    Instructor --> CU28
    Instructor --> CU29
    Admin --> CU28
    Admin --> CU30
\`\`\`

### 8. Módulo 6: Centro de Notificaciones y Eventos
\`\`\`mermaid
flowchart LR
    actor Usuario
    actor Sistema["Bus de Eventos"]
    subgraph MOD_M6["Módulo 6: Notificaciones"]
        CU31["CU-031: Consultar Notificaciones"]
        CU32["CU-032: Marcar Notificación Leída"]
        CU33["CU-033: Marcar Todo como Leído"]
        CU34["CU-034: Despachar Notificación por Evento"]
    end
    Usuario --> CU31
    Usuario --> CU32
    Usuario --> CU33
    Sistema --> CU34
\`\`\`

### 9. Módulo 7: Asistente EDUNOVA AI
\`\`\`mermaid
flowchart LR
    actor Aprendiz
    actor Instructor
    subgraph MOD_M7["Módulo 7: Asistente IA"]
        CU35["CU-035: Consulta Contextual Asistente"]
        CU36["CU-036: Streaming en Vivo de Diagnóstico"]
        CTX["<<include>> Inyectar Métricas Reales MySQL"]
    end
    Aprendiz --> CU35
    Instructor --> CU35
    CU35 -.-> CTX
    CU35 -.-> CU36
\`\`\`

### 10. Diagrama de Procesos Transversales e Integración
\`\`\`mermaid
flowchart TD
    EVID_FAIL["Entrega de Evidencia No Aprobada"] --> COMP_REF["Competencia cambia a REQUIERE REFUERZO"]
    COMP_REF --> PLAN_REC["Se genera Plan de Recuperación (M3)"]
    PLAN_REC --> NOTIF["Se notifica al Aprendiz e Instructor (M6)"]
    PLAN_REC --> APR_DELIV["Aprendiz entrega actividad de refuerzo"]
    APR_DELIV --> INST_EVAL["Instructor evalúa positivamente"]
    INST_EVAL --> AUTO_ACRED["Auto-acreditación: Competencia pasa a APROBADA"]
    AUTO_ACRED --> AUDIT_LOG["Registro inmutable en Historial de Seguimiento"]
\`\`\`
`,

  '12-modelo-entidad-relacion.md': `# 12. MODELO ENTIDAD-RELACIÓN (MER)

## 12.1 Descripción General
La base de datos de EDUNOVA (\`edunova_db\`) está modelada en **Tercera Forma Normal (3FN)** sobre el motor transaccional **InnoDB** de **MySQL 8**. El esquema se compone de **22 tablas relacionales** rigurosamente acopladas mediante claves foráneas con reglas de integridad referencial (\`ON DELETE CASCADE\` y \`ON DELETE SET NULL\`).

---

## 12.2 Diagrama Entidad-Relación Completo (Mermaid)

\`\`\`mermaid
erDiagram
    USUARIO ||--o| APRENDIZ : "es"
    USUARIO ||--o| INSTRUCTOR : "es"
    USUARIO ||--o{ NOTIFICACION : "recibe"
    USUARIO ||--o{ HISTORIAL_AUDITORIA : "origina"

    PROGRAMA ||--o{ CURSO : "contiene"
    PROGRAMA ||--o{ COMPETENCIA : "estructura"

    CURSO ||--o{ CURSO_INSTRUCTOR : "asigna"
    INSTRUCTOR ||--o{ CURSO_INSTRUCTOR : "orienta"

    CURSO ||--o{ INSCRIPCION : "matricula"
    APRENDIZ ||--o{ INSCRIPCION : "cursa"

    CURSO ||--o{ EVIDENCIA : "publica"
    CURSO ||--o{ SESION_CLASE : "programa"

    COMPETENCIA ||--o{ RESULTADO_APRENDIZAJE : "desglosa"
    COMPETENCIA ||--o{ SEGUIMIENTO_COMPETENCIA : "evalua"

    INSCRIPCION ||--o{ SEGUIMIENTO_COMPETENCIA : "registra_avance"
    SEGUIMIENTO_COMPETENCIA ||--o{ HISTORIAL_SEGUIMIENTO : "audita"

    RESULTADO_APRENDIZAJE ||--o{ EVIDENCIA : "asocia"
    RESULTADO_APRENDIZAJE ||--o{ RECUPERACION : "mejora"

    INSCRIPCION ||--o{ ENTREGA_EVIDENCIA : "radica"
    EVIDENCIA ||--o{ ENTREGA_EVIDENCIA : "recibe"
    INSCRIPCION ||--o{ CALIFICACION : "obtiene"
    EVIDENCIA ||--o{ CALIFICACION : "evalua"

    INSCRIPCION ||--o{ RECUPERACION : "asigna_a"
    INSTRUCTOR ||--o{ RECUPERACION : "tutoriza"

    SESION_CLASE ||--o{ REGISTRO_ASISTENCIA : "detalla"
    INSCRIPCION ||--o{ REGISTRO_ASISTENCIA : "asiste"
    REGISTRO_ASISTENCIA ||--o{ JUSTIFICACION_ASISTENCIA : "soporta"

    INSCRIPCION ||--o{ ASISTENCIA : "resumen_diario"
    INSCRIPCION ||--o{ OBSERVACION : "observa"
    INSTRUCTOR ||--o{ OBSERVACION : "emite"

    USUARIO {
        int id_usuario PK
        string nombre
        string apellido
        string correo UK
        string password_hash
        enum rol
        enum estado
        datetime fecha_creacion
    }

    APRENDIZ {
        int id_aprendiz PK
        int id_usuario FK,UK
        string documento UK
        string telefono
        datetime fecha_registro
    }

    INSTRUCTOR {
        int id_instructor PK
        int id_usuario FK,UK
        string especialidad
        string telefono
    }

    PROGRAMA {
        int id_programa PK
        string nombre
        string codigo UK
        text descripcion
        enum estado
    }

    CURSO {
        int id_curso PK
        int id_programa FK
        string nombre
        date fecha_inicio
        date fecha_fin
        enum estado
    }

    INSCRIPCION {
        int id_inscripcion PK
        int id_aprendiz FK
        int id_curso FK
        datetime fecha_inscripcion
        enum estado
    }

    COMPETENCIA {
        int id_competencia PK
        int id_programa FK
        string codigo UK
        string nombre
        int horas_duracion
    }

    RESULTADO_APRENDIZAJE {
        int id_rap PK
        int id_competencia FK
        string codigo
        text descripcion
    }

    SEGUIMIENTO_COMPETENCIA {
        int id_seguimiento PK
        int id_inscripcion FK
        int id_competencia FK
        int id_instructor FK
        enum estado
        decimal porcentaje_avance
    }

    HISTORIAL_SEGUIMIENTO {
        int id_historial PK
        int id_seguimiento FK
        string estado_anterior
        string estado_nuevo
        string usuario_responsable
        datetime fecha
    }

    EVIDENCIA {
        int id_evidencia PK
        int id_curso FK
        int id_rap FK
        string nombre
        decimal porcentaje
        date fecha_limite
        enum estado
    }

    ENTREGA_EVIDENCIA {
        int id_entrega PK
        int id_evidencia FK
        int id_inscripcion FK
        int version
        string archivo_url
        enum estado
        decimal calificacion
    }

    RECUPERACION {
        int id_recuperacion PK
        int id_inscripcion FK
        int id_rap FK
        int id_instructor FK
        text actividad_refuerzo
        date fecha_limite
        enum estado
    }

    SESION_CLASE {
        int id_sesion PK
        int id_curso FK
        int id_instructor FK
        date fecha
        string tema
    }

    REGISTRO_ASISTENCIA {
        int id_registro PK
        int id_sesion FK
        int id_inscripcion FK
        enum estado
        text observacion
    }

    JUSTIFICACION_ASISTENCIA {
        int id_justificacion PK
        int id_registro FK
        text motivo
        string soporte_url
        string estado
    }
\`\`\`
`,

  '13-diccionario-de-datos.md': `# 13. DICCIONARIO DE DATOS DE LA BASE DE DATOS EDUNOVA

Este documento detalla las especificaciones de campo, tipos, restricciones y propósito semántico de las **22 tablas** que conforman la base de datos \`edunova_db\` gestionadas mediante Prisma ORM.

---

## 1. Tabla: \`USUARIO\`
Almacena las cuentas de acceso al sistema para todos los roles con sus credenciales cifradas.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| \`id_usuario\` | INT | NO | PK | Auto-increment | Identificador único del usuario. |
| \`nombre\` | VARCHAR(100) | NO | | | Nombre(s) del usuario. |
| \`apellido\` | VARCHAR(100) | NO | | | Apellido(s) del usuario. |
| \`correo\` | VARCHAR(150) | NO | UK, INDEX | | Correo institucional único de acceso. |
| \`password_hash\`| VARCHAR(255) | NO | | | Hash criptográfico Bcrypt de la contraseña. |
| \`rol\` | ENUM | NO | INDEX | 'APRENDIZ' | Rol RBAC: \`ADMIN\`, \`INSTRUCTOR\`, \`APRENDIZ\`. |
| \`estado\` | ENUM | NO | INDEX | 'ACTIVO' | Estado: \`ACTIVO\`, \`INACTIVO\`. |
| \`fecha_creacion\`| DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de registro de la cuenta. |
| \`fecha_actualizacion\`| DATETIME | NO | | AUTO UPDATE | Fecha de la última modificación. |

---

## 2. Tabla: \`APRENDIZ\`
Extensión de perfil para usuarios con rol de aprendiz, conteniendo datos documentales.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| \`id_aprendiz\` | INT | NO | PK | Auto-increment | Identificador único del aprendiz. |
| \`id_usuario\` | INT | NO | FK, UK | | Referencia a \`USUARIO.id_usuario\` (Cascade). |
| \`documento\` | VARCHAR(20) | NO | UK, INDEX | | Cédula o documento de identidad oficial. |
| \`telefono\` | VARCHAR(20) | SÍ | | NULL | Teléfono móvil de contacto. |
| \`fecha_registro\`| DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de matrícula en el centro. |

---

## 3. Tabla: \`INSTRUCTOR\`
Extensión de perfil para instructores técnicos y transversales.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| \`id_instructor\`| INT | NO | PK | Auto-increment | Identificador único del instructor. |
| \`id_usuario\` | INT | NO | FK, UK | | Referencia a \`USUARIO.id_usuario\` (Cascade). |
| \`especialidad\` | VARCHAR(100) | NO | INDEX | | Área técnica (ej: "Desarrollo de Software"). |
| \`telefono\` | VARCHAR(20) | SÍ | | NULL | Teléfono de contacto institucional. |

---

## 4. Tabla: \`PROGRAMA\`
Programas de formación profesional titulados o complementarios ofertados por el SENA.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| \`id_programa\` | INT | NO | PK | Auto-increment | Identificador único del programa. |
| \`nombre\` | VARCHAR(150) | NO | | | Denominación del programa formativo. |
| \`codigo\` | VARCHAR(50) | NO | UK, INDEX | | Código oficial del diseño curricular SENA. |
| \`descripcion\` | TEXT | SÍ | | NULL | Justificación y perfil de egreso. |
| \`estado\` | ENUM | NO | INDEX | 'ACTIVO' | Estado: \`ACTIVO\`, \`INACTIVO\`. |
| \`fecha_creacion\`| DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de creación del registro. |

---

## 5. Tabla: \`CURSO\` (Ficha de Caracterización)
Cursos o fichas formativas específicas vinculadas a un programa.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| \`id_curso\` | INT | NO | PK | Auto-increment | Identificador único de la ficha. |
| \`id_programa\` | INT | NO | FK, INDEX | | Referencia a \`PROGRAMA.id_programa\`. |
| \`nombre\` | VARCHAR(150) | NO | | | Denominación de la ficha (ej: "ADSO 2874102"). |
| \`descripcion\` | TEXT | SÍ | | NULL | Modalidad, jornada o detalles del grupo. |
| \`fecha_inicio\` | DATE | NO | | | Fecha de inicio de la etapa lectiva. |
| \`fecha_fin\` | DATE | NO | | | Fecha estimada de finalización. |
| \`estado\` | ENUM | NO | INDEX | 'ACTIVO' | Estado: \`ACTIVO\`, \`FINALIZADO\`, \`CANCELADO\`. |
| \`fecha_creacion\`| DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de creación de la ficha. |

---

## 6. Tabla: \`CURSO_INSTRUCTOR\`
Relación muchos a muchos entre instructores y cursos/fichas.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| \`id_curso_instructor\`| INT | NO | PK | Auto-increment | Identificador de la asignación. |
| \`id_curso\` | INT | NO | FK | | Referencia a \`CURSO.id_curso\` (Cascade). |
| \`id_instructor\` | INT | NO | FK, INDEX | | Referencia a \`INSTRUCTOR.id_instructor\` (Cascade). |
| \`fecha_asignacion\` | DATETIME | NO | | CURRENT_TIMESTAMP | Fecha en que fue asignado el instructor. |
*(Restricción Única Compuesta: \`id_curso + id_instructor\`)*

---

## 7. Tabla: \`INSCRIPCION\`
Matrícula oficial de un aprendiz en una ficha de formación.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| \`id_inscripcion\` | INT | NO | PK | Auto-increment | Identificador único de la matrícula. |
| \`id_aprendiz\` | INT | NO | FK, INDEX | | Referencia a \`APRENDIZ.id_aprendiz\` (Cascade). |
| \`id_curso\` | INT | NO | FK, INDEX | | Referencia a \`CURSO.id_curso\` (Cascade). |
| \`fecha_inscripcion\`| DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de matrícula en el grupo. |
| \`estado\` | ENUM | NO | INDEX | 'ACTIVO' | \`ACTIVO\`, \`RETIRADO\`, \`APROBADO\`, \`NO_APROBADO\`.|
*(Restricción Única Compuesta: \`id_aprendiz + id_curso\`)*

---

## 8. Tabla: \`COMPETENCIA\`
Competencias laborales de la norma sectorial asociadas al programa.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| \`id_competencia\` | INT | NO | PK | Auto-increment | Identificador único de la competencia. |
| \`id_programa\` | INT | NO | FK, INDEX | | Referencia a \`PROGRAMA.id_programa\` (Cascade). |
| \`codigo\` | VARCHAR(50) | NO | UK, INDEX | | Código de la norma sectorial de competencia. |
| \`nombre\` | VARCHAR(255) | NO | | | Denominación formal de la competencia. |
| \`descripcion\` | TEXT | SÍ | | NULL | Alcance y normas de desempeño. |
| \`horas_duracion\`| INT | NO | | 120 | Horas pedagógicas estimadas. |
| \`fecha_creacion\`| DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de registro. |

---

## 9. Tabla: \`RESULTADO_APRENDIZAJE\` (RAP)
Resultados de aprendizaje específicos derivados de cada competencia.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| \`id_rap\` | INT | NO | PK | Auto-increment | Identificador del resultado de aprendizaje. |
| \`id_competencia\` | INT | NO | FK, INDEX | | Referencia a \`COMPETENCIA.id_competencia\` (Cascade).|
| \`codigo\` | VARCHAR(50) | NO | | | Código RAP (ej: "RAP-01"). |
| \`descripcion\` | TEXT | NO | | | Criterios y enunciado del resultado formativo.|
| \`fecha_creacion\`| DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de creación del RAP. |
*(Restricción Única Compuesta: \`id_competencia + codigo\`)*

---

## 10. Tabla: \`SEGUIMIENTO_COMPETENCIA\`
Registro del avance y juicio evaluativo de un aprendiz en una competencia.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| \`id_seguimiento\` | INT | NO | PK | Auto-increment | Identificador único de seguimiento. |
| \`id_inscripcion\` | INT | NO | FK, INDEX | | Referencia a \`INSCRIPCION.id_inscripcion\` (Cascade).|
| \`id_competencia\` | INT | NO | FK, INDEX | | Referencia a \`COMPETENCIA.id_competencia\` (Cascade).|
| \`id_instructor\` | INT | SÍ | FK | NULL | Instructor evaluador (SetNull). |
| \`estado\` | ENUM | NO | INDEX | 'PENDIENTE' | \`PENDIENTE\`, \`EN_DESARROLLO\`, \`EN_EVALUACION\`, \`APROBADA\`, \`REQUIERE_REFUERZO\`. |
| \`porcentaje_avance\`| DECIMAL(5,2)| NO | | 0.00 | Porcentaje de cumplimiento ($0.00\\% - 100.00\\%$).|
| \`fecha_evaluacion\`| DATETIME | SÍ | | NULL | Fecha en que se emitió el último juicio. |
| \`observaciones\` | TEXT | SÍ | | NULL | Juicio cualitativo u observaciones. |
*(Restricción Única Compuesta: \`id_inscripcion + id_competencia\`)*

---

## 11. Tabla: \`HISTORIAL_SEGUIMIENTO\`
Trazabilidad inmutable de cambios de estado en las competencias para auditoría.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| \`id_historial\` | INT | NO | PK | Auto-increment | Identificador del evento histórico. |
| \`id_seguimiento\` | INT | NO | FK, INDEX | | Referencia a \`SEGUIMIENTO_COMPETENCIA\` (Cascade).|
| \`estado_anterior\`| VARCHAR(50) | NO | | | Estado previo de la competencia. |
| \`estado_nuevo\` | VARCHAR(50) | NO | | | Nuevo estado asignado. |
| \`motivo\` | TEXT | SÍ | | NULL | Justificación del cambio de estado. |
| \`usuario_responsable\`| VARCHAR(100)| NO | | | Nombre y correo de quien evaluó. |
| \`fecha\` | DATETIME | NO | | CURRENT_TIMESTAMP | Marca temporal exacta de la transacción. |

---

## 12. Tabla: \`EVIDENCIA\`
Actividades y talleres publicados por los instructores vinculados a un curso.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| \`id_evidencia\` | INT | NO | PK | Auto-increment | Identificador único de la evidencia. |
| \`id_curso\` | INT | NO | FK, INDEX | | Referencia a \`CURSO.id_curso\` (Cascade). |
| \`id_rap\` | INT | SÍ | FK, INDEX | NULL | RAP asociado (SetNull). |
| \`nombre\` | VARCHAR(150) | NO | | | Título de la evidencia de aprendizaje. |
| \`descripcion\` | TEXT | SÍ | | NULL | Objetivos y contexto de la actividad. |
| \`instrucciones\` | TEXT | SÍ | | NULL | Criterios de entrega y formato solicitado. |
| \`porcentaje\` | DECIMAL(5,2)| NO | | 100.00 | Ponderación porcentual de la evidencia. |
| \`fecha_limite\` | DATE | SÍ | | NULL | Plazo máximo de radicación. |
| \`estado\` | ENUM | NO | INDEX | 'PUBLICADA' | \`BORRADOR\`, \`PUBLICADA\`, \`VENCIDA\`. |
| \`fecha_creacion\`| DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de publicación en plataforma. |

---

## 13. Tabla: \`ENTREGA_EVIDENCIA\`
Entregas radicadas por los aprendices con versionamiento progresivo.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| \`id_entrega\` | INT | NO | PK | Auto-increment | Identificador único de la entrega. |
| \`id_evidencia\` | INT | NO | FK, INDEX | | Referencia a \`EVIDENCIA.id_evidencia\` (Cascade). |
| \`id_inscripcion\` | INT | NO | FK, INDEX | | Referencia a \`INSCRIPCION.id_inscripcion\` (Cascade).|
| \`version\` | INT | NO | | 1 | Número de intento de entrega (1, 2, 3...). |
| \`archivo_nombre\`| VARCHAR(255) | SÍ | | NULL | Nombre original del documento adjunto. |
| \`archivo_url\` | VARCHAR(500) | SÍ | | NULL | Enlace al repositorio de almacenamiento. |
| \`comentario_aprendiz\`| TEXT | SÍ | | NULL | Mensaje explicativo del aprendiz. |
| \`estado\` | ENUM | NO | INDEX | 'ENTREGADA' | \`ENTREGADA\`, \`APROBADA\`, \`REQUIERE_CORRECCION\`. |
| \`calificacion\` | DECIMAL(4,2)| SÍ | | NULL | Nota numérica asignada ($0.0 - 5.0$). |
| \`retroalimentacion\`| TEXT | SÍ | | NULL | Comentarios pedagógicos del instructor. |
| \`fecha_entrega\` | DATETIME | NO | | CURRENT_TIMESTAMP | Fecha y hora de radicación. |
| \`fecha_evaluacion\`| DATETIME | SÍ | | NULL | Fecha en que fue revisada. |
| \`evaluador_nombre\`| VARCHAR(100)| SÍ | | NULL | Nombre del instructor que calificó. |

---

## 14. Tabla: \`CALIFICACION\`
Consolidado oficial de notas finales por evidencia.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| \`id_calificacion\`| INT | NO | PK | Auto-increment | Identificador único del registro de nota. |
| \`id_inscripcion\` | INT | NO | FK, INDEX | | Referencia a \`INSCRIPCION\` (Cascade). |
| \`id_evidencia\` | INT | NO | FK, INDEX | | Referencia a \`EVIDENCIA\` (Cascade). |
| \`nota\` | DECIMAL(4,2)| NO | | | Calificación numérica obtenida. |
| \`observacion\` | TEXT | SÍ | | NULL | Observaciones pedagógicas. |
| \`fecha_registro\` | DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de asentamiento de la nota. |
*(Restricción Única Compuesta: \`id_inscripcion + id_evidencia\`)*

---

## 15. Tabla: \`RECUPERACION\`
Planes de mejoramiento asignados para superar competencias pendientes.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| \`id_recuperacion\`| INT | NO | PK | Auto-increment | Identificador del plan de refuerzo. |
| \`id_inscripcion\` | INT | NO | FK, INDEX | | Referencia a \`INSCRIPCION\` (Cascade). |
| \`id_rap\` | INT | NO | FK, INDEX | | RAP específico a recuperar (Cascade). |
| \`id_instructor\` | INT | NO | FK, INDEX | | Instructor tutor responsable (Cascade). |
| \`actividad_refuerzo\`| TEXT | NO | | | Descripción detallada del taller o producto.|
| \`fecha_inicio\` | DATE | NO | | | Fecha de apertura del plan. |
| \`fecha_limite\` | DATE | NO | | | Fecha de cierre improrrogable. |
| \`fecha_entrega\` | DATETIME | SÍ | | NULL | Fecha de envío por el aprendiz. |
| \`archivo_entrega\`| VARCHAR(500) | SÍ | | NULL | Documento adjunto con la solución. |
| \`comentario_entrega\`| TEXT | SÍ | | NULL | Comentario del aprendiz al radicar. |
| \`calificacion\` | DECIMAL(4,2)| SÍ | | NULL | Calificación del refuerzo ($0.0 - 5.0$). |
| \`estado\` | ENUM | NO | INDEX | 'IDENTIFICADA' | \`IDENTIFICADA\`, \`ASIGNADA\`, \`SUPERADA\`, etc. |
| \`fecha_evaluacion\`| DATETIME | SÍ | | NULL | Fecha de calificación y cierre. |

---

## 16. Tabla: \`SESION_CLASE\`
Programación diaria o semanal de encuentros formativos por curso.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| \`id_sesion\` | INT | NO | PK | Auto-increment | Identificador de la sesión de clase. |
| \`id_curso\` | INT | NO | FK, INDEX | | Referencia a \`CURSO.id_curso\` (Cascade). |
| \`id_instructor\` | INT | NO | FK, INDEX | | Instructor titular de la clase (Cascade). |
| \`fecha\` | DATE | NO | INDEX | | Fecha del encuentro presencial/virtual. |
| \`hora_inicio\` | VARCHAR(10) | NO | | | Hora de inicio (ej: "07:00"). |
| \`hora_fin\` | VARCHAR(10) | NO | | | Hora de finalización (ej: "13:00"). |
| \`tema\` | VARCHAR(200) | NO | | | Asunto o resultado de aprendizaje abordado.|
| \`fecha_registro\` | DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de creación de la sesión. |

---

## 17. Tabla: \`REGISTRO_ASISTENCIA\`
Planilla detallada de asistencia individual por aprendiz y sesión.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| \`id_registro\` | INT | NO | PK | Auto-increment | Identificador único del registro de asistencia.|
| \`id_sesion\` | INT | NO | FK, INDEX | | Referencia a \`SESION_CLASE\` (Cascade). |
| \`id_inscripcion\` | INT | NO | FK, INDEX | | Referencia a \`INSCRIPCION\` (Cascade). |
| \`estado\` | ENUM | NO | INDEX | 'ASISTIO' | \`ASISTIO\`, \`AUSENTE\`, \`RETARDO\`, \`EXCUSA_PENDIENTE\`, \`JUSTIFICADA\`. |
| \`observacion\` | TEXT | SÍ | | NULL | Nota o motivo de retardo/falta. |
| \`fecha_registro\` | DATETIME | NO | | CURRENT_TIMESTAMP | Momento exacto de toma de lista. |
*(Restricción Única Compuesta: \`id_sesion + id_inscripcion\`)*

---

## 18. Tabla: \`JUSTIFICACION_ASISTENCIA\`
Radicación de excusas médicas o laborales que amparan una inasistencia.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| \`id_justificacion\`| INT | NO | PK | Auto-increment | Identificador único de la justificación. |
| \`id_registro\` | INT | NO | FK, INDEX | | Referencia a \`REGISTRO_ASISTENCIA\` (Cascade). |
| \`motivo\` | TEXT | NO | | | Explicación detallada de la causa de ausencia.|
| \`soporte_url\` | VARCHAR(500) | SÍ | | NULL | Enlace o archivo de incapacidad médica/soporte.|
| \`estado\` | VARCHAR(20) | NO | | 'PENDIENTE' | \`PENDIENTE\`, \`APROBADA\`, \`RECHAZADA\`. |
| \`fecha_radicacion\`| DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de envío por el aprendiz. |
| \`fecha_resolucion\`| DATETIME | SÍ | | NULL | Fecha en que el instructor la dictaminó. |

---

## 19. Tabla: \`ASISTENCIA\`
Registro histórico diario de asistencia compatible con esquemas legados.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| \`id_asistencia\` | INT | NO | PK | Auto-increment | Identificador del registro diario. |
| \`id_inscripcion\` | INT | NO | FK, INDEX | | Referencia a \`INSCRIPCION\` (Cascade). |
| \`fecha\` | DATE | NO | INDEX | | Día del registro. |
| \`estado\` | ENUM | NO | INDEX | 'PRESENTE' | \`PRESENTE\`, \`AUSENTE\`, \`TARDANZA\`, \`EXCUSA\`.|
| \`observacion\` | TEXT | SÍ | | NULL | Comentarios adicionales. |
| \`fecha_registro\` | DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de inserción. |
*(Restricción Única Compuesta: \`id_inscripcion + fecha\`)*

---

## 20. Tabla: \`OBSERVACION\`
Anotaciones pedagógicas o conductuales realizadas por los instructores.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| \`id_observacion\` | INT | NO | PK | Auto-increment | Identificador de la anotación. |
| \`id_inscripcion\` | INT | NO | FK, INDEX | | Referencia a \`INSCRIPCION\` (Cascade). |
| \`id_instructor\` | INT | NO | FK, INDEX | | Instructor autor de la observación (Cascade).|
| \`descripcion\` | TEXT | NO | | | Texto descriptivo de la novedad pedagógica. |
| \`fecha\` | DATETIME | NO | | CURRENT_TIMESTAMP | Fecha de emisión. |

---

## 21. Tabla: \`NOTIFICACION\`
Bandeja de mensajes internos y alertas automáticas despachadas por el sistema.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| \`id_notificacion\` | INT | NO | PK | Auto-increment | Identificador único de la notificación. |
| \`id_usuario\` | INT | NO | FK, INDEX | | Usuario destinatario (Cascade). |
| \`titulo\` | VARCHAR(150) | NO | | | Encabezado descriptivo de la alerta. |
| \`mensaje\` | TEXT | NO | | | Contenido detallado del aviso. |
| \`categoria\` | ENUM | NO | | 'ALERTA' | \`EVIDENCIA\`, \`CALIFICACION\`, \`ASISTENCIA\`, etc.|
| \`leida\` | BOOLEAN | NO | INDEX | false | Bandera de estado de lectura. |
| \`enlace\` | VARCHAR(200) | SÍ | | NULL | Ruta SPA de navegación directa. |
| \`fecha_creacion\`| DATETIME | NO | INDEX | CURRENT_TIMESTAMP | Momento de despacho de la notificación. |

---

## 22. Tabla: \`HISTORIAL_AUDITORIA\`
Bitácora de seguridad forense y trazabilidad de operaciones críticas.

| Campo | Tipo MySQL | Nulo | Clave | Default | Descripción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| \`id_auditoria\` | INT | NO | PK | Auto-increment | Identificador del evento de auditoría. |
| \`id_usuario\` | INT | SÍ | FK, INDEX | NULL | Usuario autor de la transacción (SetNull). |
| \`accion\` | VARCHAR(100) | NO | | | Verbo/operación realizada (ej: "EVALUAR_COMPETENCIA").|
| \`modulo\` | VARCHAR(50) | NO | INDEX | | Módulo del sistema afectado. |
| \`detalle\` | TEXT | NO | | | JSON o descripción con parámetros de cambio. |
| \`ip_address\` | VARCHAR(50) | SÍ | | NULL | Dirección IP del cliente originador. |
| \`fecha\` | DATETIME | NO | INDEX | CURRENT_TIMESTAMP | Marca de tiempo inmutable. |
`,

  '14-tecnologias.md': `# 14. TECNOLOGÍAS Y STACK TÉCNICO

EDUNOVA integra un ecosistema tecnológico contemporáneo, optimizado para ofrecer tiempos de respuesta ultrarrápidos, alta interactividad visual y estabilidad transaccional.

---

## 14.1 Arquitectura del Stack Tecnológico

\`\`\`mermaid
flowchart TD
    subgraph PRESENTACION["Capa de Presentación (Frontend)"]
        REACT["React 18.3 (Componentes Funcionales + Hooks)"]
        VITE["Vite 5 (Bundler ultrarrápido con HMR)"]
        TAILWIND["Tailwind CSS (Factory System / Glassmorphism)"]
        THREE["Three.js / WebGL (Canvas 3D Interactivo en Hero)"]
        LUCIDE["Lucide React (Iconografía técnica vectorizada)"]
        AXIOS["Axios (Cliente HTTP con interceptores JWT)"]
    end

    subgraph LOGICA["Capa de Negocio (Backend)"]
        NODE["Node.js v24.x LTS (Motor de ejecución V8)"]
        EXPRESS["Express.js (Framework REST API)"]
        PRISMA_CLI["Prisma Client ORM (Abstracción tipada de datos)"]
        JWT_LIB["jsonwebtoken (Autenticación sin estado)"]
        BCRYPT["bcryptjs (Hashing de contraseñas de 10 rondas)"]
        TELEMETRY["OpenTelemetry & In-Memory Metrics Engine"]
    end

    subgraph DATOS["Capa de Datos"]
        MYSQL["MySQL 8 Community Server (Motor InnoDB)"]
    end

    PRESENTACION <-->|"REST API / JSON / SSE Stream"| LOGICA
    LOGICA <-->|"MySQL Protocol / Pool de Conexiones"| DATOS
\`\`\`

---

## 14.2 Detalle de Tecnologías y Versiones

### 1. Frontend
* **React (\`v18.3.1\`):** Biblioteca estándar para interfaces basadas en componentes reactivos y gestión de ciclo de vida con Hooks (\`useState\`, \`useEffect\`, \`useMemo\`, \`useCallback\`).
* **Vite (\`v5.4.2\`):** Entorno de compilación moderno que utiliza Rollup y esbuild para ofrecer recarga de módulos en milisegundos.
* **Three.js (\`v0.160+\`):** Motor de gráficos WebGL que renderiza el Hero 3D con geometría poligonal y cálculo de sombras en tiempo real.
* **Tailwind CSS (\`v3.4.10\`):** Framework de utilidades CSS configurado con el tema de diseño **Ocean Tech Premium** y tokens del **Factory Design System** (paleta oscura Obsidian/Carbon y bordes hairline).
* **Lucide React (\`v0.441.0\`):** Set estandarizado de más de 200 iconos SVG ligeros.

### 2. Backend
* **Node.js (\`v24.16.0\`):** Plataforma de ejecución asíncrona basada en eventos, con soporte nativo de características modernas de ECMAScript.
* **Express (\`v4.19.2\`):** Enrutador HTTP robusto que maneja middlewares de autenticación, control de errores y controladores de dominio.
* **Prisma ORM (\`v5.19.1\`):** Mapeador objeto-relacional de siguiente generación que provee autocompletado tipado en consultas, migraciones automáticas y previene inyecciones SQL.
* **JSON Web Token (\`v9.0.2\`):** Estándar RFC 7519 para tokens portátiles y seguros de autenticación con firma HMAC-SHA256.
* **Bcryptjs (\`v2.4.3\`):** Función de derivación de claves basada en el cifrado Blowfish para el almacenamiento irreversible de credenciales.
* **CORS (\`v2.8.5\`):** Middleware de seguridad para autorización de peticiones entre orígenes cruzados.

### 3. Base de Datos
* **MySQL 8.0:** Motor relacional con soporte nativo de tipos JSON, transacciones ACID bajo InnoDB, índices B-Tree de alta eficiencia y optimizador de consultas basado en costo.
`,

  '15-seguridad-y-permisos.md': `# 15. SEGURIDAD, AUTENTICACIÓN Y PERMISOS (RBAC)

## 15.1 Modelo de Control de Acceso Basado en Roles (RBAC)
EDUNOVA aplica un esquema estricto de **Role-Based Access Control (RBAC)** que restringe la ejecución de operaciones y el acceso a endpoints según el rol validado en el token de autenticación.

\`\`\`mermaid
flowchart TD
    REQ["Petición HTTP del Cliente (Header Authorization: Bearer <token>)"] --> AUTH_CHECK{"¿Token Válido y Vigente?"}
    AUTH_CHECK -- NO --> RES_401["HTTP 401 Unauthorized (Sesión inválida o expirada)"]
    AUTH_CHECK -- SÍ --> ROLE_CHECK{"¿Rol del Usuario Autorizado para la Ruta?"}
    ROLE_CHECK -- NO --> RES_403["HTTP 403 Forbidden (Privilegios insuficientes)"]
    ROLE_CHECK -- SÍ --> NEXT["Ejecutar Controlador de Negocio"]
\`\`\`

---

## 15.2 Estructura del Token JWT
Los tokens emitidos en el inicio de sesión exitoso cumplen con el estándar RFC 7519 y contienen el siguiente payload criptográfico firmado:

\`\`\`json
{
  "id_usuario": 14,
  "nombre": "Anyely Valeria",
  "apellido": "Bautista",
  "correo": "anyely.bautista@soy.sena.edu.co",
  "rol": "INSTRUCTOR",
  "iat": 1731840000,
  "exp": 1731926400
}
\`\`\`

* **Algoritmo de Firma:** \`HS256\` (HMAC con SHA-256).
* **Vigencia del Token:** 24 horas continuas desde la emisión (\`exp = iat + 86400s\`).
* **Secreto Criptográfico:** Almacenado en la variable de entorno \`JWT_SECRET\` en el archivo \`server/.env\` del servidor (nunca expuesto al cliente).

---

## 15.3 Almacenamiento Seguro de Contraseñas (Bcrypt)
Las contraseñas nunca se guardan en texto claro en la base de datos:
1. Al crear o modificar una clave, se genera una sal criptográfica pseudoaleatoria (\`salt\`).
2. Se ejecuta la función hash con **10 rondas de costo computacional** (\`bcrypt.hash(password, 10)\`).
3. En el login, se verifica el intento mediante comparación de tiempo constante (\`bcrypt.compare(candidate, hash)\`), evitando ataques de temporización (*timing attacks*).

---

## 15.4 Matriz de Permisos por Endpoint de la API

| Ruta de la API | Método | Roles Autorizados | Acción / Propósito |
| :--- | :---: | :---: | :--- |
| \`/api/auth/login\` | POST | Público | Autenticar credenciales y emitir JWT. |
| \`/api/auth/perfil\` | GET | Todos (Token válido) | Consultar información de la cuenta propia. |
| \`/api/usuarios\` | GET/POST | \`ADMIN\` | Listar y crear usuarios en el sistema. |
| \`/api/programas\` | GET | Todos | Consultar catálogo de programas activos. |
| \`/api/programas\` | POST/PUT | \`ADMIN\` | Crear y modificar diseños curriculares. |
| \`/api/cursos\` | GET/POST | \`ADMIN\`, \`INSTRUCTOR\` | Administrar y listar fichas de formación. |
| \`/api/competencias/evaluar\`| POST | \`INSTRUCTOR\` | Calificar y asentar juicio de competencia. |
| \`/api/evidencias\` | POST | \`INSTRUCTOR\` | Publicar nueva evidencia o taller. |
| \`/api/evidencias/entregar\`| POST | \`APRENDIZ\` | Radicar entrega de evidencia versionada. |
| \`/api/evidencias/calificar\`| POST| \`INSTRUCTOR\` | Asignar nota y retroalimentación pedagógica.|
| \`/api/recuperaciones/asignar\`| POST| \`INSTRUCTOR\`| Asignar plan de mejoramiento académico. |
| \`/api/asistencia/sesiones\`| POST| \`INSTRUCTOR\` | Aperturar sesión de clase y planilla. |
| \`/api/asistencia/tomar\` | POST | \`INSTRUCTOR\` | Registrar estados de asistencia en sesión. |
| \`/api/asistencia/justificar\`| POST| \`APRENDIZ\` | Radicar justificación médica con soporte. |
| \`/api/reportes/expediente/:id\`| GET| \`ADMIN\`, \`INSTRUCTOR\` | Generar expediente completo de aprendiz. |
| \`/api/ai/consulta\` | POST | Todos (Contextual) | Interactuar con el asistente pedagógico IA. |
`,

  '16-glosario.md': `# 16. GLOSARIO DE TÉRMINOS

Este glosario define los términos pedagógicos del Servicio Nacional de Aprendizaje (SENA) y los conceptos técnicos de ingeniería de software empleados a lo largo del sistema EDUNOVA:

---

## 16.1 Términos del Dominio Pedagógico SENA
* **Aprendiz:** Persona natural matriculada en un programa de formación técnica o tecnológica del SENA, protagonista de su propio aprendizaje.
* **Centro de Formación:** Dependencia física y administrativa del SENA encargada de la ejecución de los programas de formación profesional integral.
* **Competencia Laboral:** Capacidad demostrada de una persona para desempeñar una función productiva en diferentes contextos laborales, respondiendo a normas del sector productivo.
* **Diseño Curricular:** Documento normativo que estructura el programa formativo, definiendo las competencias, resultados de aprendizaje y criterios de evaluación.
* **Dossier de Ficha:** Documento consolidado que resume el rendimiento cuantitativo, la asistencia acumulada y el estado de competencias de todos los aprendices pertenecientes a una misma ficha.
* **Etapa Lectiva:** Período de formación académica en el que el aprendiz adquiere conocimientos conceptuales, procedimentales y axiológicos en ambientes de aprendizaje.
* **Etapa Productiva:** Período formativo en el que el aprendiz aplica, complementa y consolida sus competencias en el sector productivo mediante contrato de aprendizaje, proyecto o pasantía.
* **Evidencia de Aprendizaje:** Prueba fehaciente (de conocimiento, desempeño o producto) presentada por el aprendiz para demostrar el dominio de un resultado de aprendizaje.
* **Expediente Académico:** Historial integral de un aprendiz que compendia sus calificaciones, novedades, asistencias y competencias aprobadas.
* **Ficha de Caracterización:** Código numérico único nacional (ej: 2874102) que identifica a un grupo o cohorte de aprendices asignados a un programa formativo específico.
* **Instructor:** Profesional encargado de orientar, acompañar y evaluar los procesos de aprendizaje en el SENA.
* **Juicio Evaluativo:** Dictamen pedagógico oficial emitido por el instructor que declara una competencia como "Aprobada" (A) o "No Aprobada" / "Requiere Refuerzo" (D).
* **Plan de Mejoramiento / Recuperación:** Conjunto concertado de actividades pedagógicas complementarias asignadas al aprendiz para superar deficiencias académicas antes de comités formativos.
* **Resultado de Aprendizaje (RAP):** Logro concreto de conocimiento y habilidad que el aprendiz debe ser capaz de demostrar al concluir una unidad formativa.
* **Umbral Crítico de Inasistencia (85%):** Porcentaje mínimo reglamentario de asistencia a clases que un aprendiz debe mantener; caer por debajo de este umbral activa causales de deserción.

---

## 16.2 Términos Técnicos de Ingeniería de Software
* **ACID (Atomicity, Consistency, Isolation, Durability):** Propiedades que garantizan que las transacciones en una base de datos relacional se ejecuten de manera segura y confiable.
* **API RESTful (Representational State Transfer):** Estilo arquitectónico de comunicación entre cliente y servidor fundamentado en operaciones HTTP sin estado (\`GET\`, \`POST\`, \`PUT\`, \`DELETE\`).
* **Bcrypt:** Función criptográfica de hash de contraseñas adaptativa que incorpora salt para frustrar ataques por diccionario y tablas arcoíris.
* **Debounce:** Técnica de optimización de software que aplaza la ejecución de una función costosa hasta que transcurra un período de inactividad especificado (ej: 300 ms en búsquedas).
* **Factory Design System:** Sistema de diseño visual sobrio, con contraste elevado Obsidian/Carbon, bordes hairline de 1px y estética industrial táctil.
* **Glassmorphism:** Estilo de diseño de interfaz de usuario caracterizado por fondos translúcidos, desenfoque de fondo (*backdrop blur*) y bordes finos simulando vidrio esmerilado.
* **JWT (JSON Web Token):** Formato compacto y autónomo para la transmisión segura de información de identidad entre partes como un objeto JSON firmado.
* **ORM (Object-Relational Mapping):** Técnica de desarrollo que permite interactuar con una base de datos relacional utilizando objetos en lenguajes de programación tipados (Prisma).
* **RBAC (Role-Based Access Control):** Mecanismo de seguridad que asigna permisos y restricciones de acceso en el sistema a partir de roles de usuario predeterminados.
* **Single Page Application (SPA):** Aplicación web que carga un único documento HTML y actualiza dinámicamente las vistas a medida que el usuario interactúa, sin recargar la página completa.
* **Three.js / WebGL:** API de renderizado gráfico por aceleración de hardware directamente en el navegador web para la visualización de geometrías 3D poligonales.
* **Token Streaming:** Transmisión continua y fragmentada de texto generado por modelos de lenguaje en tiempo real hacia el navegador web mediante Server-Sent Events.
`
};
