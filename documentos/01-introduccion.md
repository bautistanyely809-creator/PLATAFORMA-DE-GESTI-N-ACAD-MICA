# 01. INTRODUCCIÓN GENERAL DEL SISTEMA EDUNOVA

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
* **Versión del Sistema:** v3.0 (Rama `DEV`)

---

## 1.3 Propósito del Sistema
El propósito primordial de EDUNOVA es transformar la administración académica en una experiencia ágil, transparente y predictiva mediante:

1. **Centralización de Datos:** Consolidar en una base de datos relacional de alto rendimiento (MySQL 8) toda la información de aprendices, instructores, programas, fichas de caracterización, competencias y novedades.
2. **Trazabilidad Pedagógica:** Registrar el historial inmutable de las evaluaciones de competencias y resultados de aprendizaje (RAPs), permitiendo conocer quién evaluó, en qué fecha y bajo qué criterio.
3. **Optimización del Flujo de Evidencias:** Facilitar la radicación digital de actividades con versionamiento iterativo (v1, v2, ...), permitiendo retroalimentaciones cualitativas y cuantitativas directas.
4. **Prevención de la Deserción:** Detectar automáticamente inasistencias críticas (consecutivas $\ge 3$ o acumuladas por debajo del 85%), alertando oportunamente a los instructores y administradores.
5. **Asistencia Inteligente:** Proveer un asistente virtual contextual (`EDUNOVA AI`) que analiza datos reales de rendimiento, calificaciones y asistencia para orientar tanto al aprendiz en sus hábitos de estudio como al instructor en la formulación de planes de mejoramiento.

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
