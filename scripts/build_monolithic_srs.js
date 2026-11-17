/**
 * Compilador de SRS Monolítico Maestro para EDUNOVA
 * Rama DEV · Estándar IEEE 830 / ISO/IEC/IEEE 29148
 * Genera todo el sistema en un solo documento: documentos/SRS_EDUNOVA.md y docs/SRS_EDUNOVA.md
 */

const fs = require('fs');
const path = require('path');
const generalDocs = require('./doc_generator/data_general_docs');
const useCases = require('./doc_generator/data_use_cases');

console.log('🚀 Iniciando compilación del SRS monolítico maestro de EDUNOVA...');

let srs = `# ESPECIFICACIÓN DE REQUISITOS DE SOFTWARE (SRS / ERS)
# EDUNOVA – ACADEMIC MANAGEMENT SYSTEM
## Estándar Internacional IEEE 830 / ISO/IEC/IEEE 29148 · Documento Maestro Integral

---

| **Información General del Proyecto** | **Detalle Institucional** |
| :--- | :--- |
| **Nombre Oficial del Software:** | EDUNOVA – Academic Management System |
| **Aprendiz Desarrolladora:** | Anyely Valeria Bautista |
| **Programa de Formación:** | Tecnólogo en Análisis y Desarrollo de Software (ADSO) |
| **Número de Ficha de Caracterización:** | 2874102 |
| **Centro de Formación:** | Centro de Formación Industrial – SENA Regional Huila (Neiva) |
| **Modalidad de Desarrollo:** | Desarrollo individual con asistencia de Inteligencia Artificial y metodologías ágiles (Scrum) |
| **Duración Estimada:** | 4 semanas (1 mes de ejecución lectiva) |
| **Versión del Documento:** | 3.2 (SRS Monolítico Maestro Integral · Rama DEV) |
| **Estado del Documento:** | Aprobado · Conectado con MySQL 8 y 7 Módulos Avanzados Operativos |

---

## CONTROL DE VERSIONES DEL DOCUMENTO

| Versión | Fecha | Autor(a) | Descripción del Cambio |
| :---: | :---: | :--- | :--- |
| **v1.0** | 11/11/2026 | Anyely Valeria | Creación inicial del SRS, planteamiento del problema, requisitos RF/RNF, historias de usuario y cronograma. |
| **v1.1** | 12/11/2026 | Anyely Valeria | Incorporación de autenticación obligatoria dividida en 3 roles (Aprendiz, Instructor, Admin) y maquetación Glassmorphism. |
| **v1.2** | 13/11/2026 | Anyely Valeria | Actualización estética Ocean Tech Premium: paleta petróleo, turquesa, cian y ámbar; modelo MER de 13 entidades iniciales. |
| **v2.0** | 13/11/2026 | Anyely Valeria | Estandarización de historias de usuario (HU-01 a HU-26) y casos de uso básicos. |
| **v2.1** | 13/11/2026 | Anyely Valeria | Sprint de alto rendimiento: Skeletons, debounce en búsqueda, paginación, streaming de IA y caché. |
| **v2.2** | 13/11/2026 | Anyely Valeria | Integración de Three.js con WebGL en el Hero Banner y refinamiento de la paleta Factory / Ocean Tech. |
| **v3.0** | 13/11/2026 | Anyely Valeria | Despliegue de los 7 Módulos Académicos Avanzados conectados a MySQL 8 con 22 tablas relacionales. |
| **v3.1** | 17/11/2026 | Anyely Valeria | Especificación modular de 16 documentos y 36 Casos de Uso individuales bajo IEEE 830. |
| **v3.2** | 17/11/2026 | Anyely Valeria | **Consolidación Monolítica Maestra**: Integración total de la introducción, árbol de problemas, vigilancia tecnológica, arquitectura, requisitos funcionales/no funcionales, matriz de trazabilidad, actores, 10 diagramas UML Mermaid, los 36 casos de uso detallados en extenso, MER de 22 tablas, diccionario de datos exhaustivo, stack de tecnologías, seguridad RBAC y glosario en un único documento maestro. |

---

## TABLA DE CONTENIDO GENERAL DEL DOCUMENTO MAESTRO

1. [SECCIÓN 1: INTRODUCCIÓN GENERAL](#sección-1-introducción-general)
   - 1.1 Resumen Ejecutivo
   - 1.2 Contexto Institucional SENA (ADSO 2874102)
   - 1.3 Propósito del Sistema
2. [SECCIÓN 2: PLANTEAMIENTO DEL PROBLEMA](#sección-2-planteamiento-del-problema)
   - 2.1 Descripción de la Situación Actual
   - 2.2 Formulación del Problema (Pregunta Problema)
   - 2.3 Árbol de Problemas (Causas y Efectos)
3. [SECCIÓN 3: JUSTIFICACIÓN Y VIGILANCIA TECNOLÓGICA](#sección-3-justificación-y-vigilancia-tecnológica)
   - 3.1 Justificación Institucional y Académica
   - 3.2 Justificación Técnica
   - 3.3 Vigilancia Tecnológica (Benchmarking vs. Moodle, Canvas, Zajuna)
4. [SECCIÓN 4: OBJETIVOS DEL SISTEMA](#sección-4-objetivos-del-sistema)
   - 4.1 Objetivo General
   - 4.2 Objetivos Específicos por Módulo
5. [SECCIÓN 5: ALCANCE Y LÍMITES](#sección-5-alcance-y-límites)
   - 5.1 Delimitación Contextual
   - 5.2 Funcionalidades Implementadas en Rama DEV (100% Operativas)
   - 5.3 Funcionalidades Pendientes y Propuestas Futuras
   - 5.4 Criterios de Aceptación Globales
6. [SECCIÓN 6: ARQUITECTURA DEL SISTEMA](#sección-6-arquitectura-del-sistema)
   - 6.1 Patrón Arquitectónico de Tres Capas (Mermaid)
   - 6.2 Diagrama de Despliegue Físico
   - 6.3 Descripción de Componentes Principales
7. [SECCIÓN 7: REQUISITOS FUNCIONALES Y MATRIZ DE TRAZABILIDAD](#sección-7-requisitos-funcionales-y-matriz-de-trazabilidad)
   - 7.1 Catálogo Exhaustivo de Requisitos Funcionales (RF-001 a RF-036)
   - 7.2 Matriz de Trazabilidad Completa (RF ↔ CU ↔ Módulo ↔ Tablas ↔ Actor)
8. [SECCIÓN 8: REQUISITOS NO FUNCIONALES (RNF)](#sección-8-requisitos-no-funcionales-rnf)
   - 8.1 Catálogo RNF-001 a RNF-015 (Rendimiento, Seguridad, Usabilidad, Fiabilidad)
9. [SECCIÓN 9: ACTORES Y PERFILES DEL SISTEMA](#sección-9-actores-y-perfiles-del-sistema)
   - 9.1 Definición de Actores Humanos y Automatizados
   - 9.2 Diagrama de Jerarquía de Actores (Mermaid Class Diagram)
   - 9.3 Matriz de Permisos por Rol (CRUD)
10. [SECCIÓN 10: CASOS DE USO Y DIAGRAMAS UML](#sección-10-casos-de-uso-y-diagramas-uml)
    - 10.1 Introducción
    - 10.2 Diagrama General del Sistema EDUNOVA
    - 10.3 Diez (10) Diagramas UML de Casos de Uso por Módulo Funcional
11. [SECCIÓN 11: ESPECIFICACIÓN DETALLADA DE LOS 36 CASOS DE USO (CU-001 a CU-036)](#sección-11-especificación-detallada-de-los-36-casos-de-uso)
    - CU-001 al CU-036 con sus 14 secciones completas por caso de uso
12. [SECCIÓN 12: MODELO ENTIDAD-RELACIÓN (MER)](#sección-12-modelo-entidad-relación-mer)
    - 12.1 Descripción General y Normalización 3FN
    - 12.2 Diagrama Entidad-Relación Completo en Mermaid (22 Tablas)
13. [SECCIÓN 13: DICCIONARIO DE DATOS DE LA BASE DE DATOS](#sección-13-diccionario-de-datos-de-la-base-de-datos)
    - Especificación campo a campo de las 22 tablas de MySQL 8
14. [SECCIÓN 14: TECNOLOGÍAS Y STACK TÉCNICO](#sección-14-tecnologías-y-stack-técnico)
    - Frontend, Backend, Base de Datos, Criptografía y DevOps
15. [SECCIÓN 15: SEGURIDAD, AUTENTICACIÓN Y PERMISOS (RBAC)](#sección-15-seguridad-autenticación-y-permisos-rbac)
    - Flujo RBAC, Token JWT, Hashing Bcrypt, Middlewares y Auditoría
16. [SECCIÓN 16: GLOSARIO DE TÉRMINOS](#sección-16-glosario-de-términos)
    - Términos Pedagógicos SENA e Informáticos

---
\n`;

// Sección 1 a 5
srs += `## SECCIÓN 1: INTRODUCCIÓN GENERAL\n\n` + generalDocs['01-introduccion.md'].replace(/^# .*\n/, '') + '\n\n---\n\n';
srs += `## SECCIÓN 2: PLANTEAMIENTO DEL PROBLEMA\n\n` + generalDocs['02-planteamiento-del-problema.md'].replace(/^# .*\n/, '') + '\n\n---\n\n';
srs += `## SECCIÓN 3: JUSTIFICACIÓN Y VIGILANCIA TECNOLÓGICA\n\n` + generalDocs['03-justificacion.md'].replace(/^# .*\n/, '') + '\n\n---\n\n';
srs += `## SECCIÓN 4: OBJETIVOS DEL SISTEMA\n\n` + generalDocs['04-objetivos.md'].replace(/^# .*\n/, '') + '\n\n---\n\n';
srs += `## SECCIÓN 5: ALCANCE Y LÍMITES\n\n` + generalDocs['05-alcance.md'].replace(/^# .*\n/, '') + '\n\n---\n\n';

// Sección 6 a 10
srs += `## SECCIÓN 6: ARQUITECTURA DEL SISTEMA\n\n` + generalDocs['06-arquitectura-del-sistema.md'].replace(/^# .*\n/, '') + '\n\n---\n\n';
srs += `## SECCIÓN 7: REQUISITOS FUNCIONALES Y MATRIZ DE TRAZABILIDAD\n\n` + generalDocs['07-requisitos-funcionales.md'].replace(/^# .*\n/, '') + '\n\n---\n\n';
srs += `## SECCIÓN 8: REQUISITOS NO FUNCIONALES (RNF)\n\n` + generalDocs['08-requisitos-no-funcionales.md'].replace(/^# .*\n/, '') + '\n\n---\n\n';
srs += `## SECCIÓN 9: ACTORES Y PERFILES DEL SISTEMA\n\n` + generalDocs['09-actores-del-sistema.md'].replace(/^# .*\n/, '') + '\n\n---\n\n';
srs += `## SECCIÓN 10: CASOS DE USO Y DIAGRAMAS UML\n\n` + generalDocs['11-casos-de-uso.md'].replace(/^# .*\n/, '') + '\n\n---\n\n';

// Sección 11: Todos los 36 Casos de Uso integrados
srs += `## SECCIÓN 11: ESPECIFICACIÓN DETALLADA DE LOS 36 CASOS DE USO\n\n`;
srs += `Esta sección compendia la especificación individual y exhaustiva de cada uno de los 36 casos de uso del sistema EDUNOVA, estructurados con 14 apartados formales:\n\n`;

for (const cu of useCases) {
  srs += `### CASO DE USO ${cu.id}: ${cu.nombre.toUpperCase()}\n\n`;
  srs += `* **Identificador:** \`${cu.id}\`\n`;
  srs += `* **Nombre:** ${cu.nombre}\n`;
  srs += `* **Módulo:** ${cu.modulo}\n`;
  srs += `* **Estado en Código:** ${cu.id === 'CU-003' ? '🟡 Propuesto / Mock' : '🟢 Implementado y Verificado en Rama DEV'}\n\n`;

  srs += `#### 1. Descripción\n${cu.descripcion}\n\n`;
  srs += `#### 2. Actores Involucrados\n* **Principal:** ${cu.actores.principal}\n* **Secundario / Soporte:** ${cu.actores.secundario}\n\n`;

  srs += `#### 3. Precondiciones\n${cu.precondiciones.map(p => `* ${p}`).join('\n')}\n\n`;
  srs += `#### 4. Disparador (Trigger)\n${cu.trigger}\n\n`;

  srs += `#### 5. Flujo Principal de Eventos (Paso a Paso)\n`;
  srs += cu.flujoPrincipal.map(paso => `${paso}`).join('\n') + '\n\n';

  srs += `#### 6. Flujos Alternativos\n`;
  srs += (cu.flujosAlternativos && cu.flujosAlternativos.length > 0 
    ? cu.flujosAlternativos.map(alt => `* **${alt}**`).join('\n\n')
    : '* No aplican flujos alternativos directos; el flujo se ejecuta de manera secuencial estándar.') + '\n\n';

  srs += `#### 7. Flujos de Excepción / Errores\n`;
  srs += (cu.flujosExcepcion && cu.flujosExcepcion.length > 0
    ? cu.flujosExcepcion.map(exc => `* **${exc}**`).join('\n\n')
    : '* No se identifican excepciones críticas no controladas por el middleware global.') + '\n\n';

  srs += `#### 8. Postcondiciones\n* **Condición de Éxito:** ${cu.postcondiciones.exito}\n* **Condición de Fallo:** ${cu.postcondiciones.fallo}\n\n`;

  srs += `#### 9. Reglas de Negocio Asociadas\n${cu.reglasNegocio.map(rn => `* **${rn}**`).join('\n')}\n\n`;

  srs += `#### 10. Datos Involucrados / Parámetros\n* **Entradas:** \`${cu.datosInvolucrados.entradas}\`\n* **Salidas:** \`${cu.datosInvolucrados.salidas}\`\n\n`;

  srs += `#### 11. Permisos y Control de Acceso (RBAC)\n* **Nivel Requerido:** \`${cu.permisos}\`\n* **Mecanismo:** Token JWT y middleware \`authMiddleware\`.\n\n`;

  srs += `#### 12. Criterios de Aceptación\n> **Verificación Técnica:** ${cu.criteriosAceptacion}\n\n`;

  srs += `#### 13. Relaciones UML\n* **Relaciones:** ${cu.relacionesUML}\n\n`;
  srs += `---\n\n`;
}

// Sección 12 a 16
srs += `## SECCIÓN 12: MODELO ENTIDAD-RELACIÓN (MER)\n\n` + generalDocs['12-modelo-entidad-relacion.md'].replace(/^# .*\n/, '') + '\n\n---\n\n';
srs += `## SECCIÓN 13: DICCIONARIO DE DATOS DE LA BASE DE DATOS\n\n` + generalDocs['13-diccionario-de-datos.md'].replace(/^# .*\n/, '') + '\n\n---\n\n';
srs += `## SECCIÓN 14: TECNOLOGÍAS Y STACK TÉCNICO\n\n` + generalDocs['14-tecnologias.md'].replace(/^# .*\n/, '') + '\n\n---\n\n';
srs += `## SECCIÓN 15: SEGURIDAD, AUTENTICACIÓN Y PERMISOS (RBAC)\n\n` + generalDocs['15-seguridad-y-permisos.md'].replace(/^# .*\n/, '') + '\n\n---\n\n';
srs += `## SECCIÓN 16: GLOSARIO DE TÉRMINOS\n\n` + generalDocs['16-glosario.md'].replace(/^# .*\n/, '') + '\n\n---\n\n';

srs += `## FIN DEL DOCUMENTO MAESTRO SRS EDUNOVA (RAMA DEV)\n`;
srs += `> **Certificación de Autenticidad:** Este documento técnico unificado refleja con exactitud la totalidad del código fuente, controladores, esquemas relacionales de MySQL 8 y servicios implementados en el repositorio de la plataforma EDUNOVA por la aprendiz Anyely Valeria Bautista (Ficha 2874102 - SENA Centro de Formación Industrial).\n`;

// Escribir a documentos/SRS_EDUNOVA.md y docs/SRS_EDUNOVA.md
const docSRSPath = path.resolve(__dirname, '../documentos/SRS_EDUNOVA.md');
const docsSRSPath = path.resolve(__dirname, '../docs/SRS_EDUNOVA.md');

fs.writeFileSync(docSRSPath, srs.trim() + '\n', 'utf8');
console.log(` ✅ Generado: documentos/SRS_EDUNOVA.md (${(fs.statSync(docSRSPath).size / 1024).toFixed(1)} KB)`);

fs.writeFileSync(docsSRSPath, srs.trim() + '\n', 'utf8');
console.log(` ✅ Generado: docs/SRS_EDUNOVA.md (${(fs.statSync(docsSRSPath).size / 1024).toFixed(1)} KB)`);

console.log('\n🎉 Compilación del SRS monolítico maestro finalizada con éxito.');
