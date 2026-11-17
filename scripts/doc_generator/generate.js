/**
 * Generador Automatizado de Documentación Técnica de EDUNOVA
 * Rama DEV · Estándar IEEE 830 / ISO/IEC/IEEE 29148
 */

const fs = require('fs');
const path = require('path');
const generalDocs = require('./data_general_docs');
const useCases = require('./data_use_cases');

const DOCS_DIR = path.resolve(__dirname, '../../docs');
const CU_DIR = path.resolve(DOCS_DIR, '04-casos-de-uso');

// 1. Asegurar directorios
if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });
if (!fs.existsSync(CU_DIR)) fs.mkdirSync(CU_DIR, { recursive: true });

console.log('🚀 Iniciando generación de documentación técnica de EDUNOVA...');

// 2. Generar documentos generales (01 a 16)
let generalCount = 0;
for (const [filename, content] of Object.entries(generalDocs)) {
  const filePath = path.join(DOCS_DIR, filename);
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
  console.log(` ✅ Generado: docs/${filename}`);
  generalCount++;
}

// 3. Generar archivos individuales de Casos de Uso (CU-001 a CU-036)
let cuCount = 0;
for (const cu of useCases) {
  const cuFilename = `${cu.id}.md`;
  const cuPath = path.join(CU_DIR, cuFilename);

  const markdown = `# ESPECIFICACIÓN DE CASO DE USO: ${cu.id}
## ${cu.nombre.toUpperCase()}

---

### 1. Identificación y Nombre
* **Identificador:** \`${cu.id}\`
* **Nombre del Caso de Uso:** ${cu.nombre}
* **Módulo Funcional:** ${cu.modulo}
* **Estado en Código:** ${cu.id === 'CU-003' ? 'Propuesto / Mock' : 'Implementado y Verificado (Rama DEV)'}

---

### 2. Descripción
${cu.descripcion}

---

### 3. Actores Involucrados
* **Actor Principal:** ${cu.actores.principal}
* **Actor Secundario / Soporte:** ${cu.actores.secundario}

---

### 4. Precondiciones
${cu.precondiciones.map(p => `* ${p}`).join('\n')}

---

### 5. Disparador (Trigger)
${cu.trigger}

---

### 6. Flujo Principal de Eventos (Paso a Paso)
${cu.flujoPrincipal.map(paso => `${paso}`).join('\n')}

---

### 7. Flujos Alternativos
${cu.flujosAlternativos && cu.flujosAlternativos.length > 0 
  ? cu.flujosAlternativos.map(alt => `* **${alt}**`).join('\n\n')
  : '* No aplican flujos alternativos directos; el flujo se ejecuta de manera secuencial estándar.'}

---

### 8. Flujos de Excepción / Errores
${cu.flujosExcepcion && cu.flujosExcepcion.length > 0
  ? cu.flujosExcepcion.map(exc => `* **${exc}**`).join('\n\n')
  : '* No se identifican excepciones críticas no controladas por el middleware global.'}

---

### 9. Postcondiciones
* **Condición de Éxito:** ${cu.postcondiciones.exito}
* **Condición de Fallo:** ${cu.postcondiciones.fallo}

---

### 10. Reglas de Negocio Asociadas
${cu.reglasNegocio.map(rn => `* **${rn}**`).join('\n')}

---

### 11. Datos Involucrados / Parámetros
* **Parámetros de Entrada:** \`${cu.datosInvolucrados.entradas}\`
* **Parámetros de Salida / Respuesta:** \`${cu.datosInvolucrados.salidas}\`

---

### 12. Permisos y Control de Acceso (RBAC)
* **Nivel de Acceso Requerido:** \`${cu.permisos}\`
* **Mecanismo de Verificación:** Middleware \`authMiddleware\` y validación de \`rol\` en token JWT.

---

### 13. Criterios de Aceptación
> **Verificación Técnica:** ${cu.criteriosAceptacion}

---

### 14. Relaciones UML y Trazabilidad
* **Relaciones con otros Casos de Uso:** ${cu.relacionesUML}
* **Enlace al Índice de Casos de Uso:** [Volver a la Tabla de Casos de Uso](README.md)
* **Enlace a la Tabla de Contenido General:** [Ir a la Tabla de Contenido General](../10-tabla-de-contenido.md)
`;

  fs.writeFileSync(cuPath, markdown.trim() + '\n', 'utf8');
  console.log(` ✅ Generado: docs/04-casos-de-uso/${cuFilename}`);
  cuCount++;
}

// 4. Generar docs/04-casos-de-uso/README.md
const cuReadmeContent = `# CATÁLOGO GENERAL DE CASOS DE USO DE EDUNOVA

Este directorio compendia la especificación técnica formal e individual de los **36 Casos de Uso** del sistema **EDUNOVA – Academic Management System** (Rama \`DEV\`), elaborados bajo el estándar internacional **IEEE 830 / ISO/IEC/IEEE 29148**.

---

## 📊 Resumen Métrico de Casos de Uso
* **Total de Casos de Uso Especificados:** 36
* **Casos de Uso Implementados y Conectados a MySQL 8:** 35 (97.2%)
* **Casos de Uso Propuestos / Mock:** 1 (CU-003 - Restablecimiento de Contraseña por Correo SMTP)

---

## 📑 Tabla Maestra de Casos de Uso

| ID | Nombre del Caso de Uso | Módulo | Actor Principal | Estado | Enlace al Documento |
| :---: | :--- | :--- | :--- | :---: | :---: |
${useCases.map(cu => `| **${cu.id}** | ${cu.nombre} | ${cu.modulo} | ${cu.actores.principal.split('(')[0].trim()} | ${cu.id === 'CU-003' ? '🟡 Propuesto' : '🟢 Implementado'} | [Ver ${cu.id}](${cu.id}.md) |`).join('\n')}

---

## 🔗 Navegación Rápida
* [Ir a la Tabla de Contenido Principal](../10-tabla-de-contenido.md)
* [Ir a Requisitos Funcionales y Matriz de Trazabilidad](../07-requisitos-funcionales.md)
* [Ir a Diagramas UML de Casos de Uso](../11-casos-de-uso.md)
`;

fs.writeFileSync(path.join(CU_DIR, 'README.md'), cuReadmeContent.trim() + '\n', 'utf8');
console.log(' ✅ Generado: docs/04-casos-de-uso/README.md');

console.log(`\n🎉 Generación completada con éxito:`);
console.log(`   - ${generalCount} documentos maestros en docs/`);
console.log(`   - ${cuCount} casos de uso individuales en docs/04-casos-de-uso/`);
console.log(`   - 1 índice maestro en docs/04-casos-de-uso/README.md`);
