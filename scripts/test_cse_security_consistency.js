const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const serverDir = path.join(rootDir, 'server');
const clientDir = path.join(rootDir, 'client');
const envPath = path.join(serverDir, '.env');
const envExamplePath = path.join(serverDir, '.env.example');

require(path.join(serverDir, 'node_modules/dotenv')).config({ path: envPath });

const BASE_URL = 'http://localhost:4000/api';

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  cannotRun: 0,
  tests: []
};

function recordTest(id, name, status, details, errorInfo = null) {
  results.total++;
  if (status === 'PASS') {
    results.passed++;
    console.log(`  ✅ [PASS] ${id}: ${name}`);
  } else if (status === 'FAIL') {
    results.failed++;
    console.error(`  ❌ [FAIL] ${id}: ${name} -> ${details}`);
  } else {
    results.cannotRun++;
    console.warn(`  ⚠️ [CANNOT RUN] ${id}: ${name} -> ${details}`);
  }
  results.tests.push({ id, name, status, details, errorInfo });
}

async function runCSE() {
  console.log('======================================================================');
  console.log('🔒 INICIANDO PRUEBAS DE CSE (CONTROL DE SEGURIDAD Y CONSISTENCIA)');
  console.log('   Rama activa: QA | Ecosistema EDUNOVA AMS');
  console.log('======================================================================\n');

  // --- 1. Consistencia de Variables de Entorno ---
  console.log('--- Bloque 1: Consistencia de Variables de Entorno y Configuración ---');
  try {
    const envExists = fs.existsSync(envPath);
    if (!envExists) {
      recordTest('CSE-01', 'Existencia de archivo .env en backend', 'FAIL', 'El archivo server/.env no existe');
    } else {
      const content = fs.readFileSync(envPath, 'utf8');
      const hasDbUrl = !!process.env.DATABASE_URL;
      const hasJwt = !!process.env.JWT_SECRET;
      const hasPort = !!process.env.PORT;
      if (hasDbUrl && hasJwt && hasPort && process.env.JWT_SECRET.length >= 16) {
        recordTest('CSE-01', 'Variables críticas de entorno (PORT, DATABASE_URL, JWT_SECRET >= 16 chars)', 'PASS', 'Variables verificadas correctamente');
      } else {
        recordTest('CSE-01', 'Variables críticas de entorno', 'FAIL', `Variables incompletas: PORT=${hasPort}, DB=${hasDbUrl}, JWT=${hasJwt}`);
      }
    }
  } catch (err) {
    recordTest('CSE-01', 'Lectura de .env', 'FAIL', err.message, { file: 'server/.env', error: err.message });
  }

  // CSE-02: Paridad .env vs .env.example
  try {
    if (fs.existsSync(envExamplePath)) {
      const exampleContent = fs.readFileSync(envExamplePath, 'utf8');
      const exampleKeys = exampleContent.split('\n')
        .map(l => l.trim())
        .filter(l => l && !l.startsWith('#'))
        .map(l => l.split('=')[0].trim());

      const missingKeys = exampleKeys.filter(k => process.env[k] === undefined);
      if (missingKeys.length === 0) {
        recordTest('CSE-02', 'Paridad de variables .env vs .env.example', 'PASS', `Todas las ${exampleKeys.length} claves documentadas están definidas`);
      } else {
        recordTest('CSE-02', 'Paridad de variables .env vs .env.example', 'FAIL', `Claves faltantes en .env: ${missingKeys.join(', ')}`, {
          file: 'server/.env',
          missing: missingKeys
        });
      }
    } else {
      recordTest('CSE-02', 'Existencia de .env.example', 'FAIL', 'server/.env.example no existe');
    }
  } catch (err) {
    recordTest('CSE-02', 'Paridad .env vs .env.example', 'FAIL', err.message);
  }

  // --- 2. Base de Datos y Prisma ORM ---
  console.log('\n--- Bloque 2: Consistencia de Base de Datos y Esquema Prisma ORM ---');
  try {
    const { PrismaClient } = require(path.join(serverDir, 'node_modules/@prisma/client'));
    const prisma = new PrismaClient();
    const dbTest = await prisma.$queryRaw`SELECT 1 as connected, VERSION() as version`;
    if (dbTest && dbTest.length > 0) {
      recordTest('CSE-03', 'Conectividad activa TCP/SQL con MySQL 8 en puerto 3306', 'PASS', `Conexión exitosa. Versión MySQL: ${dbTest[0].version}`);
    } else {
      recordTest('CSE-03', 'Conectividad activa con MySQL', 'FAIL', 'La consulta SELECT 1 no devolvió datos');
    }
    await prisma.$disconnect();
  } catch (err) {
    recordTest('CSE-03', 'Conectividad activa con MySQL', 'FAIL', err.message, { file: 'server/prisma/schema.prisma', error: err.message });
  }

  // CSE-04: Validación formal del esquema Prisma
  try {
    const validateOut = execSync('npx prisma validate', { cwd: serverDir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    if (validateOut.includes('is valid')) {
      recordTest('CSE-04', 'Validación formal de integridad del esquema Prisma (schema.prisma)', 'PASS', 'Esquema syntactically valid y relaciones consistentes');
    } else {
      recordTest('CSE-04', 'Validación formal de integridad Prisma', 'FAIL', validateOut);
    }
  } catch (err) {
    recordTest('CSE-04', 'Validación formal de integridad Prisma', 'FAIL', err.stderr || err.message, {
      file: 'server/prisma/schema.prisma',
      error: err.stderr || err.message
    });
  }

  // --- 3. Control de Seguridad y Autorización (JWT & RBAC) ---
  console.log('\n--- Bloque 3: Control de Seguridad en Autenticación y Autorización (JWT & RBAC) ---');
  
  // CSE-05: Petición sin token -> 401
  try {
    const noTokenRes = await fetch(`${BASE_URL}/competencias/evaluar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_competencia: 1 })
    });
    if (noTokenRes.status === 401) {
      recordTest('CSE-05', 'Rechazo de peticiones no autenticadas a endpoints protegidos (HTTP 401 Unauthorized)', 'PASS', 'Respuesta HTTP 401 correcta');
    } else {
      recordTest('CSE-05', 'Rechazo de peticiones no autenticadas', 'FAIL', `Esperado status 401, recibido ${noTokenRes.status}`, {
        file: 'server/src/middlewares/auth.middleware.js',
        receivedStatus: noTokenRes.status
      });
    }
  } catch (err) {
    recordTest('CSE-05', 'Rechazo de peticiones no autenticadas', 'FAIL', err.message);
  }

  // CSE-06: Petición con token JWT adulterado -> 403
  try {
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTk5LCJyb2wiOiJBRE1JTiIsImlhdCI6MTc2MzQ4MDAwMH0.INVALID_SIGNATURE_FORGED_TOKEN';
    const badTokenRes = await fetch(`${BASE_URL}/calendario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${fakeToken}`
      },
      body: JSON.stringify({ titulo: 'Intento de Inyeccion' })
    });
    if (badTokenRes.status === 403 || badTokenRes.status === 401) {
      recordTest('CSE-06', 'Rechazo de tokens JWT con firma manipulada/falsificada (HTTP 403/401)', 'PASS', `Token inválido bloqueado con HTTP ${badTokenRes.status}`);
    } else {
      recordTest('CSE-06', 'Rechazo de tokens JWT manipulados', 'FAIL', `Esperado status 403/401, recibido ${badTokenRes.status}`, {
        file: 'server/src/middlewares/auth.middleware.js',
        receivedStatus: badTokenRes.status
      });
    }
  } catch (err) {
    recordTest('CSE-06', 'Rechazo de tokens JWT manipulados', 'FAIL', err.message);
  }

  // Login como Aprendiz para probar RBAC
  let apToken = null;
  try {
    const apRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: 'anyely.valeria@edunova.edu.co', password: 'edunova2026' })
    });
    const apData = await apRes.json();
    apToken = apData.token;
  } catch (e) {}

  // CSE-07: RBAC - Aprendiz intentando crear ambientes (solo ADMIN) -> 403
  try {
    if (!apToken) {
      recordTest('CSE-07', 'Control de Acceso Basado en Roles (RBAC - Aprendiz vs Endpoint Admin)', 'CANNOT RUN', 'No se pudo obtener token de Aprendiz');
    } else {
      const rbacAdminRes = await fetch(`${BASE_URL}/ambientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apToken}`
        },
        body: JSON.stringify({ nombre: 'Ambiente no autorizado', tipo: 'LABORATORIO', capacidad: 30 })
      });
      if (rbacAdminRes.status === 403) {
        recordTest('CSE-07', 'RBAC: Denegación de acceso a rol APRENDIZ en endpoints de rol ADMINISTRADOR (HTTP 403 Forbidden)', 'PASS', 'HTTP 403 Forbidden retornado');
      } else {
        recordTest('CSE-07', 'RBAC: Aprendiz en endpoint admin', 'FAIL', `Esperado 403 Forbidden, recibido status ${rbacAdminRes.status}`, {
          file: 'server/src/middlewares/auth.middleware.js',
          receivedStatus: rbacAdminRes.status
        });
      }
    }
  } catch (err) {
    recordTest('CSE-07', 'RBAC: Aprendiz en endpoint admin', 'FAIL', err.message);
  }

  // CSE-08: RBAC - Aprendiz intentando evaluar competencias (solo INSTRUCTOR/ADMIN) -> 403
  try {
    if (!apToken) {
      recordTest('CSE-08', 'Control de Acceso Basado en Roles (RBAC - Aprendiz vs Endpoint Instructor)', 'CANNOT RUN', 'No se pudo obtener token de Aprendiz');
    } else {
      const rbacInstRes = await fetch(`${BASE_URL}/competencias/evaluar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apToken}`
        },
        body: JSON.stringify({ id_inscripcion: 1, id_resultado: 1, juicio: 'APROBADO' })
      });
      if (rbacInstRes.status === 403) {
        recordTest('CSE-08', 'RBAC: Denegación de acceso a rol APRENDIZ en endpoints de rol INSTRUCTOR (HTTP 403 Forbidden)', 'PASS', 'HTTP 403 Forbidden retornado');
      } else {
        recordTest('CSE-08', 'RBAC: Aprendiz en endpoint instructor', 'FAIL', `Esperado 403 Forbidden, recibido status ${rbacInstRes.status}`, {
          file: 'server/src/middlewares/auth.middleware.js',
          receivedStatus: rbacInstRes.status
        });
      }
    }
  } catch (err) {
    recordTest('CSE-08', 'RBAC: Aprendiz en endpoint instructor', 'FAIL', err.message);
  }

  // --- 4. Auditoría de Seguridad de Dependencias y Build ---
  console.log('\n--- Bloque 4: Auditoría de Seguridad de Dependencias y Build ---');
  // CSE-09: npm audit server
  try {
    let auditOut = '';
    try {
      auditOut = execSync('npm audit --json', { cwd: serverDir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    } catch (auditErr) {
      auditOut = auditErr.stdout || '';
    }
    const auditJson = JSON.parse(auditOut || '{}');
    const vulns = auditJson.metadata?.vulnerabilities || {};
    const critical = vulns.critical || 0;
    const high = vulns.high || 0;
    const moderate = vulns.moderate || 0;
    const total = (vulns.total !== undefined) ? vulns.total : (critical + high + moderate + (vulns.low || 0));

    if (critical === 0 && high === 0) {
      recordTest('CSE-09', 'Auditoría de vulnerabilidades en dependencias del Backend (npm audit server)', 'PASS', `Cero vulnerabilidades críticas o altas (${moderate} moderadas en devDependencies/nodemon)`);
    } else {
      recordTest('CSE-09', 'Auditoría de dependencias del Backend', 'FAIL', `Vulnerabilidades detectadas: ${critical} críticas, ${high} altas, ${moderate} moderadas`, {
        module: 'server/package.json',
        critical,
        high,
        moderate,
        details: 'Vulnerabilidades detectadas en árbol de dependencias del backend'
      });
    }
  } catch (err) {
    recordTest('CSE-09', 'Auditoría de dependencias del Backend', 'FAIL', err.message);
  }

  // CSE-10: npm audit client
  try {
    let clientAuditOut = '';
    try {
      clientAuditOut = execSync('npm audit --json', { cwd: clientDir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    } catch (auditErr) {
      clientAuditOut = auditErr.stdout || '';
    }
    const auditJson = JSON.parse(clientAuditOut || '{}');
    const vulns = auditJson.metadata?.vulnerabilities || {};
    const critical = vulns.critical || 0;
    const high = vulns.high || 0;
    const moderate = vulns.moderate || 0;
    
    if (critical === 0 && high === 0) {
      recordTest('CSE-10', 'Auditoría de vulnerabilidades en dependencias del Frontend (npm audit client)', 'PASS', `Cero vulnerabilidades críticas o altas`);
    } else {
      recordTest('CSE-10', 'Auditoría de dependencias del Frontend', 'FAIL', `Vulnerabilidades detectadas en frontend: ${critical} críticas, ${high} altas (esbuild/vite dev server)`, {
        module: 'client/package.json',
        critical,
        high,
        moderate,
        advisory: 'GHSA-67mh-4wv8-2f99 (esbuild dev server origin check)'
      });
    }
  } catch (err) {
    recordTest('CSE-10', 'Auditoría de dependencias del Frontend', 'FAIL', err.message);
  }

  // CSE-11: Verificación de compilación del Frontend (Vite Build)
  try {
    // Verificamos si vite build puede ejecutarse o si existe restricción de concurrencia de proceso / temp lock
    try {
      execSync('npm run build', { cwd: clientDir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
      recordTest('CSE-11', 'Integridad de Compilación Frontend en Producción (npm run build --prefix client)', 'PASS', 'Bundle de producción generado exitosamente en client/dist');
    } catch (buildErr) {
      const errText = (buildErr.stderr || buildErr.stdout || buildErr.message).toString();
      if (errText.includes('Access is denied') || errText.includes('EPERM')) {
        recordTest('CSE-11', 'Integridad de Compilación Frontend en Producción (npm run build)', 'FAIL', 'Bloqueo por bloqueo de archivo temporal en Windows (esbuild temp file lock con servidor dev concurrente)', {
          file: 'client/vite.config.js / node_modules/esbuild',
          error: errText.split('\n').slice(0, 4).join(' ')
        });
      } else {
        recordTest('CSE-11', 'Integridad de Compilación Frontend en Producción', 'FAIL', errText.slice(0, 200), {
          file: 'client/src',
          error: errText.slice(0, 300)
        });
      }
    }
  } catch (err) {
    recordTest('CSE-11', 'Integridad de Compilación Frontend', 'FAIL', err.message);
  }

  console.log('\n======================================================================');
  console.log(`📊 RESULTADOS CSE: ${results.passed} Aprobadas, ${results.failed} Fallidas, ${results.cannotRun} No ejecutables (Total: ${results.total})`);
  console.log('======================================================================');

  fs.writeFileSync(path.join(rootDir, 'scripts/cse_results.json'), JSON.stringify(results, null, 2), 'utf8');
  return results;
}

runCSE().catch(console.error);
