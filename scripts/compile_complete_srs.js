/**
 * Compilador Integral del SRS Maestro de EDUNOVA en un solo documento .md
 * Estandar Oficial SENA / IEEE 830 / ISO/IEC/IEEE 29148
 * Genera docs/SRS_EDUNOVA.md y documentos/SRS_EDUNOVA.md
 */

const fs = require('fs');
const path = require('path');
const generalDocs = require('./doc_generator/data_general_docs');
const useCases = require('./doc_generator/data_use_cases');

console.log('🚀 Compilando el SRS Maestro Integral en un solo documento .md...');

let srs = `# ESPECIFICACIÓN DE REQUISITOS DE SOFTWARE (SRS / ERS)
# SISTEMA DE GESTIÓN ACADÉMICA – EDUNOVA
## Estándar IEEE 830 / ISO/IEC/IEEE 29148 · Documento Maestro Integral

---

| **Información General del Proyecto** | **Detalle Institucional** |
| :--- | :--- |
| **Proyecto:** | EDUNOVA – Academic Management System |
| **Aprendiz Líder / Desarrolladora:** | Anyely Valeria Bautista |
| **Programa de Formación:** | Tecnólogo en Análisis y Desarrollo de Software (ADSO) |
| **Ficha de Caracterización:** | 3413988 |
| **Centro de Formación:** | Centro de Formación Industrial – SENA Regional Huila (Neiva) |
| **Modalidad:** | Desarrollo individual con asistencia de Inteligencia Artificial y metodologías ágiles (Scrum) |
| **Duración Estimada:** | 4 semanas (1 mes de ejecución lectiva) |
| **Versión del Documento:** | 4.0 (SRS Maestro Integral Unificado · Rama DEV) |
| **Estado:** | Aprobado · Conectado con MySQL 8 y 7 Módulos Avanzados Operativos |

---

## CONTROL DE VERSIONES DEL SRS

| Versión | Fecha | Autor(a) | Descripción del Cambio |
| :---: | :---: | :--- | :--- |
| **v1.0** | 11/11/2026 | Anyely Valeria | Creación inicial del SRS, planteamiento del problema, requisitos RF/RNF, historias de usuario y cronograma de 4 semanas. |
| **v1.1** | 12/11/2026 | Anyely Valeria | Incorporación de la autenticación obligatoria dividida en 3 roles (Aprendiz, Instructor, Admin) y maquetación Soft Glassmorphism. |
| **v1.2** | 13/11/2026 | Anyely Valeria | Actualización integral Ocean Tech Premium: paleta petróleo, turquesa, cian y ámbar; modelo MER de 13 entidades y catálogo de API REST. |
| **v2.0** | 13/11/2026 | Anyely Valeria | Adaptación a la estructura formal integral SENA/IEEE (HU-01 a HU-26, CU-01 a CU-26, RF1 a RF26, RNF-01 a RNF-12 y Matriz de Trazabilidad). |
| **v2.1** | 13/11/2026 | Anyely Valeria | **Sprint de Alto Rendimiento y UX Resiliente**: Diseño Skeleton para carga fluida, búsqueda con Debounce (300ms), paginación de cursos, streaming token a token de EDUNOVA AI, actualización optimista de interfaz (Optimistic UI), índices SQL en MySQL 8, prevención de consultas N+1 con Prisma, compresión Brotli/Gzip, caché Redis/In-Memory, cola de trabajos (Job Queue), timeouts en APIs externas (5000ms), code-splitting de JS y monitoreo de usuarios reales (RUM). |
| **v2.2** | 13/11/2026 | Anyely Valeria | **Implementación Integral del Sistema de Diseño Factory**: Estética Dark Terminal War Room (Obsidian #101010, Bone #eeeeee, Carbon #1d1a18, Ash #3d3a39, Signal Orange #ee6018, Metric Green #a0ca92), tipografía Geist con tracking ajustado, radio de 3px en botones y controles, tarjetas a 10px con bordes hairline nítidos y eliminación de sombras difusas. Núcleo 3D animable en Three.js con WebGL en el Hero Banner. |
| **v3.0** | 13/11/2026 | Anyely Valeria | **Despliegue Integral de los 7 Módulos Académicos Avanzados Conectados a MySQL 8**: 1) Seguimiento Académico por Competencias y RAPs con historial auditado; 2) Gestión Completa de Evidencias con versionamiento (v1, v2...) y retroalimentación pedagógica; 3) Sistema de Recuperación de Competencias con acreditación automática; 4) Control de Asistencia Automatizado por sesión con detección de ausencias consecutivas y umbral institucional (< 85%); 5) Centro de Reportes Oficiales SENA con exportación real en Excel (.csv) e impresión PDF; 6) Centro de Notificaciones Automáticas en tiempo real ante eventos del sistema; 7) EDUNOVA AI Contextual conectada a MySQL 8 con validación estricta de permisos RBAC y cálculos matemáticos en el backend. |
| **v4.0** | 17/11/2026 | Anyely Valeria | **Consolidación Integral en un Solo Documento Maestro**: Integración perfecta y ordenada de toda la estructura IEEE/SENA: Introducción, Planteamiento del Problema, Propósito, Justificación, Vigilancia Tecnológica, Objetivos, Alcance, Personal Involucrado, Definiciones/Referencias, Descripción General, Perspectiva de 3 Capas, Actores, Restricciones/Suposiciones, Requisitos de Interfaces (Glassmorphism, Three.js 3D), Historias de Usuario (HU-01 a HU-26), 10 Diagramas UML Mermaid, Requisitos Funcionales (RF-001 a RF-036), Requisitos No Funcionales (RNF-001 a RNF-015), los 36 Casos de Uso (CU-001 a CU-036) especificados en extenso con sus 14 secciones, Modelo Entidad-Relación de 22 tablas, Diccionario de Datos completo, Stack Técnico, Seguridad RBAC, Plan de Pruebas Funcionales (CP-01 a CP-10), Matriz de Trazabilidad Completa y Glosario. |

---

## TABLA DE CONTENIDO GENERAL

- [1. INTRODUCCIÓN](#1-introducción)
  - [1.1. Planteamiento del problema](#11-planteamiento-del-problema)
  - [1.2. Propósito](#12-propósito)
  - [1.3. Justificación](#13-justificación)
    - [1.3.1. Vigilancia tecnológica y referentes de mercado](#131-vigilancia-tecnológica-y-referentes-de-mercado)
  - [1.4. Objetivo general](#14-objetivo-general)
    - [1.4.1. Objetivos específicos](#141-objetivos-específicos)
  - [1.5. Alcances](#15-alcances)
    - [1.5.1. Funcionalidades implementadas (Rama DEV - 100% Operativas)](#151-funcionalidades-implementadas-rama-dev---100-operativas)
    - [1.5.2. Funcionalidades propuestas / pendientes](#152-funcionalidades-propuestas--pendientes)
  - [1.6. Personal Involucrado](#16-personal-involucrado)
    - [1.6.1. Roles y responsabilidades del equipo](#161-roles-y-responsabilidades-del-equipo)
  - [1.7. Definiciones, acrónimos y abreviaturas](#17-definiciones-acrónimos-y-abreviaturas)
  - [1.8. Referencias](#18-referencias)
  - [1.9. Resumen](#19-resumen)
- [2. DESCRIPCIÓN GENERAL](#2-descripción-general)
  - [2.1. Perspectiva del producto](#21-perspectiva-del-producto)
    - [2.1.1. Arquitectura de tres capas](#211-arquitectura-de-tres-capas)
    - [2.1.2. Diagrama de despliegue físico](#212-diagrama-de-despliegue-físico)
  - [2.2. Características de los usuarios](#22-características-de-los-usuarios)
    - [2.2.1. Jerarquía de actores y clases (Mermaid)](#221-jerarquía-de-actores-y-clases-mermaid)
    - [2.2.2. Matriz de permisos por rol (CRUD)](#222-matriz-de-permisos-por-rol-crud)
  - [2.3. Restricciones](#23-restricciones)
  - [2.4. Suposiciones y dependencias](#24-suposiciones-y-dependencias)
- [3. REQUISITOS ESPECÍFICOS](#3-requisitos-específicos)
  - [3.1. Requisitos comunes de las interfaces](#31-requisitos-comunes-de-las-interfaces)
    - [3.1.1. Sistema de diseño Factory y Ocean Tech Premium](#311-sistema-de-diseño-factory-y-ocean-tech-premium)
    - [3.1.2. Núcleo interactivo 3D con Three.js y WebGL](#312-núcleo-interactivo-3d-con-threejs-y-webgl)
  - [3.2. Historias de Usuario (HU-01 a HU-26)](#32-historias-de-usuario-hu-01-a-hu-26)
  - [3.2.1. Diagramas de Casos de Uso (10 Diagramas UML Mermaid)](#321-diagramas-de-casos-de-uso-10-diagramas-uml-mermaid)
  - [3.3. Requerimientos Funcionales (RF-001 a RF-036)](#33-requerimientos-funcionales-rf-001-a-rf-036)
  - [3.4. Requerimientos No Funcionales (RNF-001 a RNF-015)](#34-requerimientos-no-funcionales-rnf-001-a-rnf-015)
  - [3.5. Especificación Individual Exhaustiva de los 36 Casos de Uso (CU-001 a CU-036)](#35-especificación-individual-exhaustiva-de-los-36-casos-de-uso-cu-001-a-cu-036)
  - [3.6. Modelo Entidad-Relación (MER - 22 Tablas)](#36-modelo-entidad-relación-mer---22-tablas)
  - [3.7. Diccionario de Datos de la Base de Datos](#37-diccionario-de-datos-de-la-base-de-datos)
  - [3.8. Tecnologías y Stack Técnico](#38-tecnologías-y-stack-técnico)
  - [3.9. Seguridad, Autenticación y Permisos (RBAC)](#39-seguridad-autenticación-y-permisos-rbac)
- [4. PLAN DE PRUEBAS Y MATRIZ DE TRAZABILIDAD](#4-plan-de-pruebas-y-matriz-de-trazabilidad)
  - [4.1. Plan de Pruebas Funcionales (CP-01 a CP-10)](#41-plan-de-pruebas-funcionales-cp-01-a-cp-10)
  - [4.2. Matriz de Trazabilidad Completa](#42-matriz-de-trazabilidad-completa)
- [5. GLOSARIO DE TÉRMINOS](#5-glosario-de-términos)

---
\n`;

// =========================================================================
// 1. INTRODUCCIÓN
// =========================================================================
srs += `## 1. INTRODUCCIÓN

### 1.1. Planteamiento del problema
En la actualidad, diversas instituciones educativas y centros de formación tecnológica continúan gestionando sus procesos académicos mediante herramientas fragmentadas, hojas de cálculo independientes (\`.xlsx\`), archivos físicos y libretas de asistencia manuales. 

Esta dispersión operativa ocasiona problemas críticos:
1. **Inconsistencia y pérdida de información:** Dificultad para conciliar calificaciones y asistencias al transferir notas entre formatos manuales.
2. **Duplicidad de registros:** Falta de restricciones de unicidad al matricular aprendices o registrar asistencia en diferentes sesiones.
3. **Falta de visibilidad oportuna para el aprendiz:** Los aprendices no cuentan con un medio digital centralizado en tiempo real para consultar su historial de notas, asistencias acumuladas y advertencias preventivas.
4. **Sobrecarga de trabajo en instructores:** Inversión excesiva de tiempo calculando ponderaciones de evidencias y consolidando asistencias manualmente, restando tiempo a la labor pedagógica.
5. **Dificultad en auditoría y control directivo:** Los coordinadores y administradores carecen de paneles estadísticos e indicadores inmediatos sobre la deserción, avance de competencias y rendimiento global de las fichas.

#### Pregunta Orientadora:
> *¿Cómo desarrollar una plataforma web moderna, modular y centralizada que permita administrar y consultar de manera organizada la información académica de aprendices, instructores, programas de formación, calificaciones, asistencias, evidencias y recuperaciones, reduciendo los procesos manuales y optimizando el seguimiento pedagógico en el Centro de Formación Industrial del SENA Regional Huila?*

#### Árbol de Problemas:

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

---

### 1.2. Propósito
El propósito de este documento es definir formal, completa y sistemáticamente la **Especificación de Requisitos de Software (SRS)** para la plataforma web **EDUNOVA – Academic Management System**, conforme a los lineamientos del estándar internacional **IEEE 830 / ISO/IEC/IEEE 29148**. 

Este documento actúa como:
* Contrato formal de desarrollo entre la aprendiz desarrolladora y los evaluadores académicos del SENA.
* Guía de arquitectura de software para la implementación del frontend, backend y base de datos relacional.
* Matriz de verificación y diseño del plan de pruebas funcionales y de calidad.

---

### 1.3. Justificación
El desarrollo de EDUNOVA soluciona las problemáticas de dispersión y manualidad, proporcionando una solución tecnológica escalable, segura y adaptable a cualquier dispositivo (computadores, tabletas y celulares). Al centralizar la información en una base de datos relacional (MySQL 8) administrada con Prisma ORM, se garantiza la integridad referencial, la no duplicidad y el acceso inmediato a la información.

Desde el punto de vista pedagógico y formativo, el proyecto permite a la aprendiz aplicar de forma integral competencias técnicas en:
* Levantamiento de requisitos formales e historias de usuario.
* Diseño de bases de datos relacionales normalizadas en 3FN compuestas por 22 tablas interconectadas.
* Arquitectura de software en 3 capas (Monolito Modular con React 18, Node.js v24, Express y MySQL 8).
* Implementación de seguridad perimetral mediante JWT y hashing de contraseñas Bcrypt.
* Diseño de experiencias de usuario con estándares visuales de vanguardia (**Factory Design System** y **Ocean Tech Premium Glassmorphism**).
* Integración de gráficos 3D acelerados por hardware en el navegador mediante **Three.js** y **WebGL**.
* Buenas prácticas de control de versiones con Git/GitHub y metodologías ágiles (Scrum).

#### 1.3.1. Vigilancia tecnológica y referentes de mercado
Para el diseño y concepción de EDUNOVA se realizó un estudio de vigilancia tecnológica y benchmarking analizando referentes educativos globales y plataformas de gestión escolar líderes:

| Referente de Mercado | Enfoque Principal | Aporte Tomado para EDUNOVA |
| :--- | :--- | :--- |
| **Henon Edtech** ([henonedu.com](https://henonedu.com)) | Plataforma moderna de analítica educativa y seguimiento estudiantil. | Estructura modular de métricas de progreso y dashboards limpios de rendimiento. |
| **AttendX** ([attendx.co.in](https://attendx.co.in)) | Software especializado en control digital de asistencias y novedades. | Registro rápido de asistencia por sesión (Presente, Retardo, Inasistencia) con porcentaje consolidado. |
| **EduMatrix / Virtual Classroom** | Gestión escolar para colegios técnicos y seguimiento de asignaturas. | Planilla interactiva de calificaciones homologadas a escala numérica institucional. |
| **Innova Scholar** ([innovascholar.com](https://innovascholar.com)) | Sistema integral de control escolar con jerarquía de roles. | Modelo de control de acceso estricto RBAC (Administrador, Instructor, Aprendiz). |
| **A-Star Solutions** | Portales estudiantiles interactivos de autoservicio. | Portal del aprendiz con acceso instantáneo a evidencias, retroalimentación y tutoría con IA. |
| **Moodle LMS** | Sistema de gestión de aprendizaje de código abierto tradicional. | Estructura modular de actividades, superada en EDUNOVA por una UX fluida y sin recargas. |
| **Canvas LMS** | Plataforma educativa en la nube orientada a educación superior. | Modelo de rúbricas y versionamiento claro de entregas para retroalimentación docente. |
| **Territorio / Zajuna (SENA)** | Plataforma institucional del SENA en Colombia. | Modelado de Resultados de Aprendizaje (RAPs), juicios evaluativos y actas de comités. |

---

### 1.4. Objetivo general
Desarrollar una plataforma web de gestión académica integral (**EDUNOVA – Academic Management System**) que permita administrar y centralizar la información de aprendices, instructores, programas de formación, cursos, competencias, evidencias, recuperaciones, calificaciones y asistencias, optimizando los procesos administrativos y facilitando el seguimiento pedagógico en el Centro de Formación Industrial del SENA Regional Huila.

#### 1.4.1. Objetivos específicos
1. **Analizar y especificar:** Identificar las necesidades de información académica y formalizar los requisitos funcionales (RF-001 a RF-036), no funcionales (RNF-001 a RNF-015), historias de usuario (HU-01 a HU-26) y 36 casos de uso detallados.
2. **Diseñar el modelo de datos:** Diseñar e implementar una base de datos relacional normalizada en MySQL 8 compuesta por **22 tablas relacionales** en Tercera Forma Normal (3FN) con integridad referencial.
3. **Desarrollar la API REST:** Construir los servicios del backend en Node.js (v24) y Express con autenticación robusta JWT, control RBAC, middlewares de auditoría y operaciones CRUD.
4. **Construir el Frontend Interactivo:** Diseñar e implementar la interfaz en React 18 + Tailwind CSS bajo la identidad **Factory Design System** y **Ocean Tech Premium**, incorporando componentes Glassmorphism, gráficos de rendimiento y un **Hero Canvas 3D en Three.js**.
5. **Implementar los 7 Módulos Avanzados:** Desarrollar los módulos de Seguimiento por Competencias, Gestión de Evidencias versionadas, Recuperación con auto-acreditación, Asistencia automatizada con umbral < 85%, Reportes oficiales PDF/Excel, Notificaciones en tiempo real y Asistente EDUNOVA AI.
6. **Incorporar Tutoría Inteligente Contextual:** Conectar el módulo **EDUNOVA AI** con telemetría de MySQL 8 para emitir diagnósticos pedagógicos personalizados y streaming token a token.
7. **Verificar y Documentar:** Diseñar el plan de pruebas funcionales, construir la matriz de trazabilidad y mantener sincronización continua en la rama \`DEV\` de GitHub.

---

### 1.5. Alcances

#### 1.5.1. Funcionalidades implementadas (Rama DEV - 100% Operativas)
Las siguientes capacidades se encuentran completamente programadas, conectadas a MySQL 8 y verificadas en la rama \`DEV\`:
* Autenticación obligatoria dividida en 3 roles: **Administrador**, **Instructor** y **Aprendiz** con tokens JWT criptográficos.
* Gestión administrativa de usuarios, programas de formación y fichas de caracterización.
* Matrícula formal de aprendices en fichas y asignación de instructores.
* **Módulo 1:** Seguimiento Académico por Competencias y Resultados de Aprendizaje (RAPs) con cálculo de avance porcentual e historial inmutable de juicios evaluativos.
* **Módulo 2:** Gestión Completa de Evidencias con publicación por instructor, radicación con versionamiento progresivo (\`v1, v2...\`) por aprendiz, y calificación cuantitativa/cualitativa con retroalimentación.
* **Módulo 3:** Sistema de Recuperación de Competencias para aprendices en refuerzo, asignación de planes de mejoramiento, radicación de actividades y auto-acreditación automática a Aprobada.
* **Módulo 4:** Control de Asistencia Automatizado por sesión de clase con cálculo acumulado, alertas por $\\ge 3$ inasistencias consecutivas, umbral crítico $< 85\\%$ y radicación/resolución de excusas médicas.
* **Módulo 5:** Centro de Reportes Académicos con generación de Expediente Individual del Aprendiz, Dossier Consolidado de Ficha, exportación nativa a Excel (.csv UTF-8) e impresión optimizada en PDF.
* **Módulo 6:** Centro de Notificaciones Automáticas en tiempo real generadas por eventos del sistema (calificaciones, faltas, evidencias) con marcado individual y masivo.
* **Módulo 7:** Asistente Inteligente EDUNOVA AI conectado en tiempo real a MySQL 8 con streaming token a token mediante Server-Sent Events.
* **Frontend 3D:** Hero interactivo con Canvas WebGL / Three.js reactivo al movimiento del cursor.

#### 1.5.2. Funcionalidades propuestas / pendientes
* **Integración con SOFIA Plus / Zajuna:** Requiere APIs oficiales gubernamentales cerradas del SENA o web scraping con credenciales institucionales.
* **Firma Digital Biométrica:** Depende de hardware capturador de huellas y certificados de autoridades de certificación cerrada.
* **Aplicación Móvil Nativa (Android/iOS):** Planificada para Fase 2 en Flutter/React Native; actualmente opera como SPA Responsive de alto rendimiento.
* **Pasarela SMTP Corporativa:** El restablecimiento de contraseñas por correo opera en modo simulado/mock en desarrollo hasta configurar credenciales corporativas (AWS SES / SendGrid).

---

### 1.6. Personal Involucrado

#### 1.6.1. Roles y responsabilidades del equipo
* **Anyely Valeria Bautista (Desarrolladora Full Stack & Líder de Proyecto):**
  * Responsable del levantamiento de requisitos, diseño de interfaces UI/UX, maquetación React, desarrollo de la API Node.js/Express, diseño relacional MySQL 8, programación de los 7 módulos funcionales, pruebas y versionado en GitHub.
* **Equipo de Instructores Evaluadores ADSO (SENA Regional Huila):**
  * Responsables de la retroalimentación pedagógica, validación de historias de usuario, evaluación de la arquitectura de software y verificación de cumplimiento de competencias curriculares.
* **Inteligencia Artificial Asistente (DeepMind / Antigravity):**
  * Asistencia técnica en la optimización de consultas SQL, generación de estructuras arquitectónicas, validación de casos de prueba y redacción técnica bajo estándares IEEE 830.

---

### 1.7. Definiciones, acrónimos y abreviaturas
* **ADSO:** Análisis y Desarrollo de Software (Programa tecnológico del SENA).
* **API REST:** Representational State Transfer Application Programming Interface.
* **Bcrypt:** Función criptográfica de hash de contraseñas adaptativa con salt.
* **CU:** Caso de Uso (Use Case).
* **Ficha:** Código numérico único nacional que identifica a una cohorte o grupo académico en el SENA (ej. 3413988).
* **Glassmorphism:** Estilo visual caracterizado por fondos translúcidos, desenfoque de fondo y bordes finos.
* **HMR:** Hot Module Replacement (reemplazo en caliente de módulos en Vite).
* **HU:** Historia de Usuario (User Story).
* **JWT:** JSON Web Token (estándar abierto RFC 7519 para intercambio de sesiones).
* **MER:** Modelo Entidad-Relación de base de datos.
* **ORM:** Object-Relational Mapping (implementado mediante Prisma Client).
* **RAP:** Resultado de Aprendizaje.
* **RBAC:** Role-Based Access Control (Control de Acceso Basado en Roles).
* **RF:** Requisito Funcional.
* **RNF:** Requisito No Funcional.
* **SENA:** Servicio Nacional de Aprendizaje.
* **SPA:** Single Page Application (Aplicación web de página única).
* **SSE:** Server-Sent Events (transmisión unidireccional de datos en tiempo real para streaming de IA).

---

### 1.8. Referencias
1. IEEE Std 830-1998: *IEEE Recommended Practice for Software Requirements Specifications*.
2. ISO/IEC/IEEE 29148:2018: *Systems and software engineering — Life cycle processes — Requirements engineering*.
3. Documentación Oficial de React.js: [https://react.dev](https://react.dev).
4. Documentación Oficial de Three.js: [https://threejs.org](https://threejs.org).
5. Documentación Oficial de Node.js: [https://nodejs.org](https://nodejs.org).
6. Documentación Oficial de Express.js: [https://expressjs.com](https://expressjs.com).
7. Documentación Oficial de Prisma ORM: [https://www.prisma.io/docs](https://www.prisma.io/docs).
8. Documentación Oficial de MySQL 8: [https://dev.mysql.com/doc](https://dev.mysql.com/doc).
9. Documentación Oficial de Tailwind CSS: [https://tailwindcss.com/docs](https://tailwindcss.com/docs).
10. Guía Metodológica de Proyectos de Desarrollo de Software SENA ADSO (2026).

---

### 1.9. Resumen
El proyecto **EDUNOVA** es una plataforma tecnológica Full Stack diseñada para solucionar la dispersión operativa de la gestión académica en el SENA. Integra una arquitectura modular de 3 capas, una base de datos relacional de **22 tablas** normalizada en 3FN, un sistema de diseño visual de alta precisión (**Factory / Ocean Tech Premium** con núcleo 3D en **Three.js**), 36 requisitos funcionales rigurosos, 15 requisitos no funcionales, 26 historias de usuario, 10 diagramas UML Mermaid, la especificación de 36 casos de uso detallados, un plan de pruebas funcionales y matriz de trazabilidad con sincronización continua en la rama \`DEV\` de GitHub.

---
\n`;

// =========================================================================
// 2. DESCRIPCIÓN GENERAL
// =========================================================================
srs += `## 2. DESCRIPCIÓN GENERAL

### 2.1. Perspectiva del producto
EDUNOVA es un sistema web independiente y autónomo que opera como un **Monolito Modular Desacoplado** de alta cohesión y bajo acoplamiento:

#### 2.1.1. Arquitectura de tres capas

\`\`\`mermaid
flowchart TB
    subgraph CLIENTE["1. Capa de Presentación (Frontend SPA)"]
        UI["React 18 + Vite + Tailwind CSS"]
        T3D["Three.js / Canvas 3D Interactivo en Hero"]
        STATE["Contexto Global / Hooks Reactivos"]
        API_CLIENT["Axios / Fetch Client (Interceptors JWT)"]
        UI --> STATE
        T3D --> UI
        STATE --> API_CLIENT
    end

    subgraph SERVIDOR["2. Capa Lógica de Negocio (Backend REST API)"]
        ROUTER["Enrutadores Express Modularizados"]
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

    subgraph PERSISTENCIA["3. Capa de Datos (MySQL 8)"]
        DB[("MySQL 8 Engine InnoDB Transaccional\n22 Tablas Relacionales")]
        PRISMA --> DB
    end

    API_CLIENT <-->|"HTTP / HTTPS (JSON + JWT Bearer Token / SSE)"| ROUTER
\`\`\`

#### 2.1.2. Diagrama de despliegue físico

\`\`\`mermaid
deploymentDiagram
    node "Navegador Web del Cliente" {
        artifact "Bundle SPA (HTML5, JS ES2024, CSS, Three.js WebGL)"
    }

    node "Servidor de Aplicaciones (Node.js Environment)" {
        artifact "Express API Gateway (Port 5000)"
        artifact "Prisma Client Engine"
        artifact "In-Memory Session & Telemetry Cache"
    }

    node "Servidor de Base de Datos" {
        database "MySQL 8.0 Server (Port 3306 - edunova_db)"
    }

    "Navegador Web del Cliente" -- "TCP/IP Port 5173 / HTTPS" --> "Servidor de Aplicaciones (Node.js Environment)"
    "Servidor de Aplicaciones (Node.js Environment)" -- "TCP/IP Port 3306" --> "Servidor de Base de Datos"
\`\`\`

---

### 2.2. Características de los usuarios
El sistema contempla tres perfiles de usuarios humanos y actores automatizados del sistema:

1. **Administrador (\`ADMIN\`):**
   * Personal directivo o de coordinación académica. Posee privilegios globales para crear usuarios, programas de formación, fichas, asignar instructores y consultar métricas globales.
2. **Instructor (\`INSTRUCTOR\`):**
   * Docente o instructor técnico. Responsable de evaluar competencias, publicar evidencias, calificar entregas versionadas, asignar planes de recuperación, tomar asistencia por sesión y emitir reportes oficiales.
3. **Aprendiz (\`APRENDIZ\`):**
   * Estudiante del centro formativo. Consulta su avance en competencias, radica entregas de evidencias en versiones sucesivas, entrega actividades de refuerzo, justifica inasistencias y consulta al tutor EDUNOVA AI.
4. **EDUNOVA AI Agent:**
   * Agente cognitivo contextual que analiza el rendimiento del aprendiz en MySQL 8 para generar sugerencias pedagógicas mediante streaming.
5. **Servicio de Notificaciones y Event Bus:**
   * Subsistema de despacho automático de avisos internos ante calificaciones, inasistencias críticas o asignación de planes.

#### 2.2.1. Jerarquía de actores y clases (Mermaid)

\`\`\`mermaid
classDiagram
    class Usuario {
        <<Abstract>>
        +String nombre
        +String apellido
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

#### 2.2.2. Matriz de permisos por rol (CRUD)

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

---

### 2.3. Restricciones
* **Tecnológicas:** El frontend debe operar en navegadores modernos compatibles con ES2024 y WebGL (Chrome $\ge 110$, Edge, Firefox $\ge 115$, Safari $\ge 16$).
* **Seguridad:** Ninguna contraseña se almacena en texto claro (obligatorio Bcrypt con 10 rondas de salt).
* **Persistencia:** La base de datos debe ser relacional bajo el motor InnoDB de MySQL 8 para garantizar integridad transaccional ACID.
* **Escalabilidad:** Tiempos de respuesta menores a 500 ms en consultas estándar mediante indexación compuesta.
* **Normativa SENA:** La escala de calificaciones cuantitativas opera de 0.0 a 5.0 y homologa pedagógicamente a Aprobado ($\ge 3.5$) o No Aprobado / Requiere Refuerzo ($< 3.5$).

---

### 2.4. Suposiciones y dependencias
* **Suposiciones:** Los usuarios disponen de un dispositivo con conexión a Internet y navegador web estándar; cada usuario posee una cuenta de correo electrónico institucional única.
* **Dependencias:** Disponibilidad del servicio de base de datos MySQL 8 local o en la nube; ejecución continua del runtime de Node.js v24 en el servidor; persistencia del archivo de variables de entorno \`server/.env\` con los secretos criptográficos (\`JWT_SECRET\`, \`DATABASE_URL\`).

---
\n`;

// =========================================================================
// 3. REQUISITOS ESPECÍFICOS
// =========================================================================
srs += `## 3. REQUISITOS ESPECÍFICOS

### 3.1. Requisitos comunes de las interfaces

#### 3.1.1. Sistema de diseño Factory y Ocean Tech Premium
La interfaz gráfica de EDUNOVA aplica el sistema de diseño **Factory** combinado con la paleta tecnológica **Ocean Tech Premium**, garantizando una estética sobria, profesional y de alta legibilidad inspirada en consolas de control:

| Token / Color | Código HEX | Rol en la Interfaz | Aplicación Visual |
| :--- | :--- | :--- | :--- |
| **Obsidian** | \`#101010\` | Superficie de control base y canvas de medianoche | Fondo de pantalla, cabeceras de tablas y consola |
| **Carbon Lift** | \`#1d1a18\` | Paneles y elevación de componentes | Contenedores de métricas, fichas y módulos |
| **Ash Stroke** | \`#3d3a39\` | Bordes hairline de separación | Divisores de tarjetas, marcos de inputs y celdas |
| **Bone Card** | \`#eeeeee\` | Tarjeta de máximo contraste | Hero Banner de despacho para aprendices |
| **Chalk** | \`#fafafa\` | Botones principales y acciones primarias | Botones de envío, despacho de IA y login primario |
| **Azul Petróleo**| \`#123B50\` | Acento institucional tecnológico | Cabeceras de módulos y badges |
| **Turquesa** | \`#19B5A5\` | Resalte de acciones activas | Botones secundarios y enlaces interactivos |
| **Cian** | \`#48BFE3\` | Telemetría e interactividad 3D | Vértices del núcleo Three.js y barras de progreso |
| **Ámbar** | \`#E9B949\` | Alertas y estados de advertencia | Competencias en refuerzo, retardos y novedades |
| **Metric Green** | \`#a0ca92\` | Datos positivos y aprobaciones | Competencias aprobadas, asistencias y notas $\ge 3.5$ |

* **Principios de Diseño:**
  * Tipografía Geist y Geist Mono con espaciado ajustado (\`tracking-tight\`).
  * Radio estricto de 3px en botones y badges; 10px con borde hairline (\`1px\`) en tarjetas.
  * Efecto Glassmorphism optimizado (\`backdrop-blur-md\` con opacidades sutiles).

#### 3.1.2. Núcleo interactivo 3D con Three.js y WebGL
El Hero Banner integra un canvas 3D interactivo animado mediante Three.js que reacciona a la posición del cursor del usuario mediante interpolación esférica (lerp), simbolizando el procesamiento en tiempo real de los datos formativos.

---

### 3.2. Historias de Usuario (HU-01 a HU-26)

| Código | Rol | Enunciado de la Historia de Usuario | Criterio de Aceptación (Given-When-Then) |
| :---: | :---: | :--- | :--- |
| **HU-01** | Todos | Como usuario, quiero iniciar sesión con mi correo y contraseña institucional. | Dado un usuario registrado, cuando ingresa credenciales correctas, entonces recibe un token JWT y accede a su dashboard. |
| **HU-02** | Aprendiz | Como aprendiz nuevo, quiero registrar mi cuenta con mis datos personales. | Dados datos válidos y correo único, cuando se registra, entonces se crea el usuario con rol Aprendiz. |
| **HU-03** | Todos | Como usuario, quiero recuperar el acceso si olvido mi contraseña. | Dado un correo existente, cuando solicita restablecimiento, entonces el sistema genera un token seguro de recuperación. |
| **HU-04** | Todos | Como usuario, quiero consultar y actualizar mi número telefónico de contacto. | Dado un usuario logueado, cuando edita su teléfono y guarda, entonces la base de datos se actualiza de inmediato. |
| **HU-05** | Todos | Como usuario, quiero cerrar mi sesión de forma segura. | Dado un usuario en sesión, cuando hace clic en logout, entonces se purga el token local y redirige al login. |
| **HU-06** | Admin | Como administrador, quiero crear cuentas para instructores y aprendices. | Dado un admin, cuando diligencia el formulario de usuario, entonces se crea el registro con su rol correspondiente. |
| **HU-07** | Admin | Como administrador, quiero activar o suspender el acceso de usuarios. | Dado un admin, cuando conmuta el estado de un usuario, entonces se actualiza su estado en USUARIO a INACTIVO. |
| **HU-08** | Admin | Como administrador, quiero registrar programas de formación técnica y tecnológica. | Dado un diseño curricular, cuando ingresa código y nombre, entonces se almacena en la tabla PROGRAMA. |
| **HU-09** | Admin | Como administrador, quiero aperturar fichas de caracterización vinculadas a programas. | Dado un programa activo, cuando ingresa fechas y código de ficha, entonces la ficha queda en estado ACTIVO. |
| **HU-10** | Admin | Como administrador, quiero asignar instructores a fichas formativas. | Dada una ficha y un instructor, cuando se vinculan, entonces se crea la relación en CURSO_INSTRUCTOR. |
| **HU-11** | Admin | Como administrador, quiero matricular aprendices en fichas específicas. | Dado un aprendiz y una ficha, cuando se matricula, entonces se asienta en INSCRIPCION evitando duplicados. |
| **HU-12** | Instructor | Como instructor, quiero consultar el catálogo de competencias de mi programa. | Dado un instructor con ficha asignada, cuando ingresa a competencias, entonces visualiza las normas y RAPs. |
| **HU-13** | Instructor | Como instructor, quiero evaluar el progreso de competencias con juicio formativo. | Dado un aprendiz, cuando evalúa una competencia, entonces se actualiza el estado y se audita en el historial. |
| **HU-14** | Aprendiz | Como aprendiz, quiero consultar el avance porcentual de mis competencias. | Dado un aprendiz logueado, cuando entra a competencias, entonces ve la barra de avance y badges de estado. |
| **HU-15** | Instructor | Como instructor, quiero publicar evidencias formativas con fecha límite. | Dado un curso, cuando crea una evidencia con ponderación, entonces se publica y notifica a los aprendices. |
| **HU-16** | Aprendiz | Como aprendiz, quiero subir entregas de evidencias con versionamiento automático. | Dada una evidencia abierta, cuando el aprendiz sube un archivo, entonces se registra como versión 1, 2 o sucesiva. |
| **HU-17** | Instructor | Como instructor, quiero calificar entregas de evidencias de 0.0 a 5.0 con feedback. | Dada una entrega radicada, cuando el instructor califica, entonces se guarda la nota y retroalimentación pedagógica. |
| **HU-18** | Instructor | Como instructor, quiero detectar aprendices con competencias en refuerzo. | Dado el módulo de recuperaciones, cuando filtra por refuerzo, entonces se listan los aprendices prioritarios. |
| **HU-19** | Instructor | Como instructor, quiero asignar un plan de mejoramiento con entrega digital. | Dado un aprendiz en refuerzo, cuando se formula la actividad, entonces se crea el plan con fecha límite estricta. |
| **HU-20** | Instructor | Como instructor, quiero que al aprobar un refuerzo se auto-acredite la competencia. | Dado un plan calificado con nota $\ge 3.5$, cuando se dictamina, entonces la competencia pasa a APROBADA automáticamente. |
| **HU-21** | Instructor | Como instructor, quiero aperturar sesiones de clase y tomar asistencia en vivo. | Dada una clase, cuando el instructor marca presentes, retardos o ausencias, entonces se asienta la planilla. |
| **HU-22** | Aprendiz | Como aprendiz, quiero justificar inasistencias adjuntando soporte médico. | Dada una falta, cuando radica soporte médico, entonces queda en estado PENDIENTE para revisión del instructor. |
| **HU-23** | Sistema | Como sistema, quiero disparar alertas si un aprendiz supera 3 faltas o cae de 85%. | Tras guardar lista, cuando se detecta inasistencia crítica, entonces se emite notificación preventiva al aprendiz. |
| **HU-24** | Inst/Admin | Como docente o directivo, quiero generar expedientes individuales y dossiers en PDF. | Dado un aprendiz o ficha, cuando pulsa imprimir, entonces se renderiza el documento oficial con membrete SENA. |
| **HU-25** | Inst/Admin | Como docente o directivo, quiero exportar la sábana de notas a Excel (CSV UTF-8). | Dada una tabla de datos, cuando hace clic en exportar, entonces se descarga el archivo .csv legible en Excel. |
| **HU-26** | Aprendiz | Como aprendiz, quiero consultar al tutor EDUNOVA AI para recibir recomendaciones. | Dado un prompt del aprendiz, cuando consulta a la IA, entonces recibe un diagnóstico contextual con streaming de texto. |

---

### 3.2.1. Diagramas de Casos de Uso (10 Diagramas UML Mermaid)

#### 1. Diagrama General del Sistema EDUNOVA
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

#### 2. Módulo: Autenticación y Perfil
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

#### 3. Módulo: Administración Base y Fichas
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

#### 4. Módulo 1: Seguimiento por Competencias y RAPs
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

#### 5. Módulo 2: Gestión de Evidencias y Entregas
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

#### 6. Módulo 3: Recuperación de Competencias
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

#### 7. Módulo 4: Control de Asistencia y Justificaciones
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

#### 8. Módulo 5: Centro de Reportes y Dossiers
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

#### 9. Módulo 6: Centro de Notificaciones y Eventos
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

#### 10. Módulo 7: Asistente EDUNOVA AI
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

---

### 3.3. Requerimientos Funcionales (RF-001 a RF-036)

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

### 3.4. Requerimientos No Funcionales (RNF-001 a RNF-015)

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

---

### 3.5. Especificación Individual Exhaustiva de los 36 Casos de Uso (CU-001 a CU-036)

A continuación se despliega la totalidad de los 36 Casos de Uso del sistema EDUNOVA, cada uno estructurado con sus 14 secciones técnicas formales:
\n`;

for (const cu of useCases) {
  srs += `#### CASO DE USO ${cu.id}: ${cu.nombre.toUpperCase()}\n\n`;
  srs += `* **Identificador:** \`${cu.id}\`\n`;
  srs += `* **Nombre del Caso de Uso:** ${cu.nombre}\n`;
  srs += `* **Módulo Funcional:** ${cu.modulo}\n`;
  srs += `* **Estado en Código:** ${cu.id === 'CU-003' ? '🟡 Propuesto / Mock' : '🟢 Implementado y Verificado (Rama DEV)'}\n\n`;

  srs += `**1. Descripción:**  \n${cu.descripcion}\n\n`;
  srs += `**2. Actores Involucrados:**  \n* **Actor Principal:** ${cu.actores.principal}\n* **Actor Secundario / Soporte:** ${cu.actores.secundario}\n\n`;

  srs += `**3. Precondiciones:**  \n${cu.precondiciones.map(p => `* ${p}`).join('\n')}\n\n`;
  srs += `**4. Disparador (Trigger):**  \n${cu.trigger}\n\n`;

  srs += `**5. Flujo Principal de Eventos (Paso a Paso):**  \n`;
  srs += cu.flujoPrincipal.map(paso => `${paso}`).join('\n') + '\n\n';

  srs += `**6. Flujos Alternativos:**  \n`;
  srs += (cu.flujosAlternativos && cu.flujosAlternativos.length > 0 
    ? cu.flujosAlternativos.map(alt => `* **${alt}**`).join('\n\n')
    : '* No aplican flujos alternativos directos; el flujo se ejecuta de manera secuencial estándar.') + '\n\n';

  srs += `**7. Flujos de Excepción / Errores:**  \n`;
  srs += (cu.flujosExcepcion && cu.flujosExcepcion.length > 0
    ? cu.flujosExcepcion.map(exc => `* **${exc}**`).join('\n\n')
    : '* No se identifican excepciones críticas no controladas por el middleware global.') + '\n\n';

  srs += `**8. Postcondiciones:**  \n* **Condición de Éxito:** ${cu.postcondiciones.exito}\n* **Condición de Fallo:** ${cu.postcondiciones.fallo}\n\n`;

  srs += `**9. Reglas de Negocio Asociadas:**  \n${cu.reglasNegocio.map(rn => `* **${rn}**`).join('\n')}\n\n`;

  srs += `**10. Datos Involucrados / Parámetros:**  \n* **Parámetros de Entrada:** \`${cu.datosInvolucrados.entradas}\`\n* **Parámetros de Salida:** \`${cu.datosInvolucrados.salidas}\`\n\n`;

  srs += `**11. Permisos y Control de Acceso (RBAC):**  \n* **Nivel Requerido:** \`${cu.permisos}\`\n* **Mecanismo:** Token JWT y middleware \`authMiddleware\`.\n\n`;

  srs += `**12. Criterios de Aceptación:**  \n> **Verificación Técnica:** ${cu.criteriosAceptacion}\n\n`;

  srs += `**13. Relaciones UML:**  \n* **Relaciones:** ${cu.relacionesUML}\n\n`;
  srs += `**14. Trazabilidad:** Asignado a Requisito Funcional correspondiente en Matriz de Trazabilidad.\n\n`;
  srs += `---\n\n`;
}

// 3.6 MER
srs += `### 3.6. Modelo Entidad-Relación (MER - 22 Tablas)\n\n` + generalDocs['12-modelo-entidad-relacion.md'].replace(/^# .*\n/, '') + '\n\n---\n\n';

// 3.7 Diccionario de datos
srs += `### 3.7. Diccionario de Datos de la Base de Datos\n\n` + generalDocs['13-diccionario-de-datos.md'].replace(/^# .*\n/, '') + '\n\n---\n\n';

// 3.8 Tecnologías
srs += `### 3.8. Tecnologías y Stack Técnico\n\n` + generalDocs['14-tecnologias.md'].replace(/^# .*\n/, '') + '\n\n---\n\n';

// 3.9 Seguridad
srs += `### 3.9. Seguridad, Autenticación y Permisos (RBAC)\n\n` + generalDocs['15-seguridad-y-permisos.md'].replace(/^# .*\n/, '') + '\n\n---\n\n';

// =========================================================================
// 4. PLAN DE PRUEBAS Y MATRIZ DE TRAZABILIDAD
// =========================================================================
srs += `## 4. PLAN DE PRUEBAS Y MATRIZ DE TRAZABILIDAD

### 4.1. Plan de Pruebas Funcionales (CP-01 a CP-10)

| Código | Módulo | Caso de Prueba | Procedimiento de Verificación | Resultado Esperado | Estado |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **CP-01** | Autenticación | Inicio de sesión con credenciales correctas. | Enviar POST /api/auth/login con correo y password válidos. | HTTP 200, entrega de token JWT y redirección al dashboard. | ✅ Pasó |
| **CP-02** | Autenticación | Rechazo de contraseña incorrecta. | Enviar password erróneo para un usuario existente. | HTTP 401 Unauthorized, mensaje genérico de error. | ✅ Pasó |
| **CP-03** | M1: Competencias | Juicio evaluativo y registro en auditoría. | Enviar POST /api/competencias/evaluar cambiando estado a APROBADA. | SEGUIMIENTO actualizado y tupla en HISTORIAL_SEGUIMIENTO. | ✅ Pasó |
| **CP-04** | M2: Evidencias | Versionamiento progresivo en entregas. | Radicar dos entregas consecutivas sobre la misma evidencia. | Primera entrega version=1, segunda entrega version=2. | ✅ Pasó |
| **CP-05** | M2: Evidencias | Calificación fuera de rango (> 5.0). | Intentar calificar una evidencia con nota 5.8. | HTTP 400 Bad Request ('Nota debe estar entre 0.0 y 5.0'). | ✅ Pasó |
| **CP-06** | M3: Recuperaciones | Auto-acreditación tras superar refuerzo. | Calificar plan de mejoramiento con nota 4.0. | Plan pasa a SUPERADA y competencia cambia a APROBADA. | ✅ Pasó |
| **CP-07** | M4: Asistencia | Detección de inasistencias críticas (< 85%). | Registrar 3 ausencias seguidas en planilla de clase. | Notificación automática generada y porcentaje < 85% alertado. | ✅ Pasó |
| **CP-08** | M4: Asistencia | Radicación y resolución de excusa médica. | Aprendiz radica soporte; instructor aprueba. | Inasistencia pasa a JUSTIFICADA y falta se descuenta. | ✅ Pasó |
| **CP-09** | M5: Reportes | Exportación de dossier a Excel CSV. | Solicitar exportación de ficha en formato .csv. | Descarga de archivo con delimitación y BOM UTF-8 legible. | ✅ Pasó |
| **CP-10** | M7: EDUNOVA AI | Streaming contextual con datos reales. | Enviar consulta pedagógica al asistente IA. | Stream SSE de tokens citando notas y asistencias reales de MySQL. | ✅ Pasó |

---

### 4.2. Matriz de Trazabilidad Completa

La siguiente matriz certifica la correspondencia biunívoca entre Historias de Usuario (HU), Requisitos Funcionales (RF), Casos de Uso (CU), Tablas Relacionales de MySQL 8 y Actores Responsables:

| HU | RF | Caso de Uso Asociado | Módulo Funcional | Tablas de BD Involucradas | Actor Responsable |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **HU-01** | **RF-001** | [CU-001](#caso-de-uso-cu-001-autenticación-de-usuario-en-la-plataforma) | Seguridad / Auth | \`USUARIO\`, \`APRENDIZ\`, \`INSTRUCTOR\` | Todos los Usuarios |
| **HU-05** | **RF-002** | [CU-002](#caso-de-uso-cu-002-cierre-de-sesión-seguro-logout) | Seguridad / Auth | \`HISTORIAL_AUDITORIA\` | Todos los Usuarios |
| **HU-03** | **RF-003** | [CU-003](#caso-de-uso-cu-003-solicitud-de-restablecimiento-de-contraseña-propuesto--mock) | Seguridad / Auth | \`USUARIO\` | Todos los Usuarios |
| **HU-04** | **RF-004** | [CU-004](#caso-de-uso-cu-004-consulta-y-actualización-de-perfil-de-usuario) | Perfil | \`USUARIO\`, \`APRENDIZ\`, \`INSTRUCTOR\` | Todos los Usuarios |
| **HU-06** | **RF-005** | [CU-005](#caso-de-uso-cu-005-gestión-administrativa-de-usuarios) | Administración | \`USUARIO\`, \`APRENDIZ\`, \`INSTRUCTOR\` | Administrador |
| **HU-08** | **RF-006** | [CU-006](#caso-de-uso-cu-006-administración-de-programas-de-formación) | Administración | \`PROGRAMA\` | Administrador |
| **HU-09** | **RF-007** | [CU-007](#caso-de-uso-cu-007-administración-de-cursos--fichas-de-caracterización) | Administración | \`CURSO\`, \`PROGRAMA\` | Administrador |
| **HU-10** | **RF-008** | [CU-008](#caso-de-uso-cu-008-asignación-de-instructores-a-fichas-de-formación) | Administración | \`CURSO_INSTRUCTOR\`, \`INSTRUCTOR\` | Administrador |
| **HU-11** | **RF-009** | [CU-009](#caso-de-uso-cu-009-matrícula-e-inscripción-de-aprendices-en-cursos) | Administración | \`INSCRIPCION\`, \`APRENDIZ\`, \`CURSO\` | Administrador |
| **HU-22** | **RF-010** | [CU-010](#caso-de-uso-cu-010-consulta-de-estadísticas-globales-del-dashboard) | Dashboard | Múltiples Tablas (Agregación) | Administrador |
| **HU-12** | **RF-011** | [CU-011](#caso-de-uso-cu-011-consulta-de-competencias-y-resultados-de-aprendizaje-por-programa) | M1: Competencias | \`COMPETENCIA\`, \`RESULTADO_APRENDIZAJE\`| Instructor / Aprendiz |
| **HU-14** | **RF-012** | [CU-012](#caso-de-uso-cu-012-consulta-de-estado-de-competencias-por-aprendiz) | M1: Competencias | \`SEGUIMIENTO_COMPETENCIA\`, \`INSCRIPCION\`| Aprendiz / Instructor |
| **HU-13** | **RF-013** | [CU-013](#caso-de-uso-cu-013-monitoreo-grupal-de-progreso-por-ficha-de-caracterización) | M1: Competencias | \`SEGUIMIENTO_COMPETENCIA\`, \`CURSO\` | Instructor / Admin |
| **HU-13** | **RF-014** | [CU-014](#caso-de-uso-cu-014-evaluación-de-competencia-y-registro-de-trazabilidad-en-historial) | M1: Competencias | \`SEGUIMIENTO_COMPETENCIA\`, \`HISTORIAL_SEGUIMIENTO\`| Instructor |
| **HU-15** | **RF-015** | [CU-015](#caso-de-uso-cu-015-creación-y-publicación-de-evidencia-de-aprendizaje) | M2: Evidencias | \`EVIDENCIA\`, \`CURSO\`, \`RESULTADO_APRENDIZAJE\`| Instructor |
| **HU-15** | **RF-016** | [CU-016](#caso-de-uso-cu-016-consulta-de-evidencias-disponibles-y-vencimientos-por-ficha) | M2: Evidencias | \`EVIDENCIA\`, \`ENTREGA_EVIDENCIA\` | Aprendiz / Instructor |
| **HU-16** | **RF-017** | [CU-017](#caso-de-uso-cu-017-radicación-de-entrega-de-evidencia-con-versionamiento-progresivo) | M2: Evidencias | \`ENTREGA_EVIDENCIA\`, \`INSCRIPCION\`| Aprendiz |
| **HU-17** | **RF-018** | [CU-018](#caso-de-uso-cu-018-calificación-y-retroalimentación-pedagógica-de-entregas) | M2: Evidencias | \`ENTREGA_EVIDENCIA\`, \`CALIFICACION\`| Instructor |
| **HU-18** | **RF-019** | [CU-019](#caso-de-uso-cu-019-identificación-de-aprendices-en-refuerzo-académico) | M3: Recuperaciones | \`SEGUIMIENTO_COMPETENCIA\`, \`INSCRIPCION\`| Instructor |
| **HU-19** | **RF-020** | [CU-020](#caso-de-uso-cu-020-asignación-de-plan-de-recuperación-académica) | M3: Recuperaciones | \`RECUPERACION\`, \`RESULTADO_APRENDIZAJE\`| Instructor |
| **HU-19** | **RF-021** | [CU-021](#caso-de-uso-cu-021-entrega-de-actividad-de-refuerzo-por-el-aprendiz) | M3: Recuperaciones | \`RECUPERACION\` | Aprendiz |
| **HU-20** | **RF-022** | [CU-022](#caso-de-uso-cu-022-evaluación-de-recuperación-y-auto-acreditación-de-competencia) | M3: Recuperaciones | \`RECUPERACION\`, \`SEGUIMIENTO_COMPETENCIA\`| Instructor |
| **HU-21** | **RF-023** | [CU-023](#caso-de-uso-cu-023-programación-y-apertura-de-sesión-de-clase) | M4: Asistencia | \`SESION_CLASE\`, \`CURSO\` | Instructor |
| **HU-21** | **RF-024** | [CU-024](#caso-de-uso-cu-024-toma-de-asistencia-y-registro-de-novedades-en-vivo) | M4: Asistencia | \`REGISTRO_ASISTENCIA\`, \`SESION_CLASE\`| Instructor |
| **HU-22** | **RF-025** | [CU-025](#caso-de-uso-cu-025-radicación-y-resolución-de-justificación-de-inasistencia) | M4: Asistencia | \`JUSTIFICACION_ASISTENCIA\` | Aprendiz / Instructor |
| **HU-23** | **RF-026** | [CU-026](#caso-de-uso-cu-026-monitoreo-y-disparo-de-alertas-de-asistencia--85) | M4: Asistencia | \`REGISTRO_ASISTENCIA\`, \`NOTIFICACION\`| Sistema / Instructor |
| **HU-24** | **RF-027** | [CU-027](#caso-de-uso-cu-027-generación-de-expediente-académico-individual-de-aprendiz) | M5: Reportes | Consolidado Multi-tabla | Instructor / Admin |
| **HU-24** | **RF-028** | [CU-028](#caso-de-uso-cu-028-generación-de-dossier-consolidado-de-ficha--curso) | M5: Reportes | Consolidado Ficha Multi-tabla | Instructor / Admin |
| **HU-25** | **RF-029** | [CU-029](#caso-de-uso-cu-029-exportación-de-datos-académicos-a-formato-excel-csv-utf-8) | M5: Reportes | Consolidado CSV Export | Instructor / Admin |
| **HU-24** | **RF-030** | [CU-030](#caso-de-uso-cu-030-impresión-de-reporte-académico-en-formato-oficial-pdf) | M5: Reportes | Render CSS Print Engine | Todos los Roles |
| **HU-01** | **RF-031** | [CU-031](#caso-de-uso-cu-031-consulta-y-filtrado-de-notificaciones-del-sistema) | M6: Notificaciones| \`NOTIFICACION\` | Todos los Usuarios |
| **HU-01** | **RF-032** | [CU-032](#caso-de-uso-cu-032-marcado-de-notificación-individual-como-leída) | M6: Notificaciones| \`NOTIFICACION\` | Todos los Usuarios |
| **HU-01** | **RF-033** | [CU-033](#caso-de-uso-cu-033-marcado-masivo-de-notificaciones-como-leídas) | M6: Notificaciones| \`NOTIFICACION\` | Todos los Usuarios |
| **HU-23** | **RF-034** | [CU-034](#caso-de-uso-cu-034-despacho-automatizado-de-notificaciones-por-disparador-de-evento) | M6: Notificaciones| \`NOTIFICACION\`, Event Bus | Sistema Automatizado |
| **HU-26** | **RF-035** | [CU-035](#caso-de-uso-cu-035-consulta-contextual-al-asistente-académico-edunova-ai) | M7: EDUNOVA AI | \`USUARIO\`, Contexto MySQL | Aprendiz / Instructor |
| **HU-26** | **RF-036** | [CU-036](#caso-de-uso-cu-036-streaming-en-tiempo-real-de-diagnóstico-académico-token-a-token) | M7: EDUNOVA AI | Stream SSE / Telemetría | Aprendiz / Instructor |

---
\n`;

// =========================================================================
// 5. GLOSARIO DE TÉRMINOS
// =========================================================================
srs += `## 5. GLOSARIO DE TÉRMINOS\n\n` + generalDocs['16-glosario.md'].replace(/^# .*\n/, '') + '\n\n';

srs += `## FIN DEL DOCUMENTO SRS MAESTRO UNIFICADO · EDUNOVA ACADEMIC MANAGEMENT (RAMA DEV)\n`;
srs += `> **Certificación de Autenticidad y Trazabilidad:** Este documento técnico unificado contiene la totalidad de los requisitos, diseño arquitectónico, historias de usuario, diagramas UML, casos de uso, modelo relacional, diccionario de datos, plan de pruebas y trazabilidad del proyecto EDUNOVA, desarrollado por la aprendiz Anyely Valeria Bautista (Ficha 3413988 - SENA Centro de Formación Industrial).\n`;

// Escribir a documentos/SRS_EDUNOVA.md y docs/SRS_EDUNOVA.md
const docSRSPath = path.resolve(__dirname, '../documentos/SRS_EDUNOVA.md');
const docsSRSPath = path.resolve(__dirname, '../docs/SRS_EDUNOVA.md');

fs.writeFileSync(docSRSPath, srs.trim() + '\n', 'utf8');
console.log(` ✅ Generado con éxito: documentos/SRS_EDUNOVA.md (${(fs.statSync(docSRSPath).size / 1024).toFixed(1)} KB)`);

fs.writeFileSync(docsSRSPath, srs.trim() + '\n', 'utf8');
console.log(` ✅ Generado con éxito: docs/SRS_EDUNOVA.md (${(fs.statSync(docsSRSPath).size / 1024).toFixed(1)} KB)`);

console.log('\n🎉 ¡SRS Maestro Integral compilado exitosamente en un solo documento!');

