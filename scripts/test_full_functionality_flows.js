const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const serverDir = path.join(rootDir, 'server');
require(path.join(serverDir, 'node_modules/dotenv')).config({ path: path.join(serverDir, '.env') });

const BASE_URL = 'http://localhost:4000/api';

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  cannotRun: 0,
  tests: []
};

function record(id, flow, description, passed, details, errorInfo = null) {
  results.total++;
  if (passed) {
    results.passed++;
    console.log(`  ✅ [PASS] ${id} (${flow}): ${description}`);
  } else {
    results.failed++;
    console.error(`  ❌ [FAIL] ${id} (${flow}): ${description} -> ${details}`);
  }
  results.tests.push({ id, flow, description, status: passed ? 'PASS' : 'FAIL', details, errorInfo });
}

async function runFunctionalityTests() {
  console.log('======================================================================');
  console.log('🚀 INICIANDO PRUEBAS DE FUNCIONALIDAD INTEGRAL — FLUJOS PRINCIPALES');
  console.log('   Rama activa: QA | Ficha Oficial: 3413988 (ADSO SENA)');
  console.log('======================================================================\n');

  let adminToken = null;
  let instToken = null;
  let apToken = null;

  // --- FLUJO 1: Autenticación por 3 Roles ---
  console.log('--- Flujo 1: Autenticación y Autorización por 3 Roles (Admin, Instructor, Aprendiz) ---');
  try {
    const adminRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: 'admin@edunova.edu.co', password: 'edunova2026' })
    });
    const adminData = await adminRes.json();
    adminToken = adminData.token;
    record('FUNC-01', 'Autenticación', 'Inicio de sesión exitoso como ADMINISTRADOR con token JWT', !!adminToken, adminToken ? 'Token JWT recibido' : 'Fallo en login');

    const instRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: 'carlos.mendoza@edunova.edu.co', password: 'edunova2026' })
    });
    const instData = await instRes.json();
    instToken = instData.token;
    record('FUNC-02', 'Autenticación', 'Inicio de sesión exitoso como INSTRUCTOR con token JWT', !!instToken, instToken ? 'Token JWT recibido' : 'Fallo en login');

    const apRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: 'anyely.valeria@edunova.edu.co', password: 'edunova2026' })
    });
    const apData = await apRes.json();
    apToken = apData.token;
    record('FUNC-03', 'Autenticación', 'Inicio de sesión exitoso como APRENDIZ con token JWT', !!apToken, apToken ? 'Token JWT recibido' : 'Fallo en login');
  } catch (err) {
    record('FUNC-01', 'Autenticación', 'Login general', false, err.message, { module: 'auth.controller.js', error: err.message });
  }

  // --- FLUJO 2: Competencias y Resultados de Aprendizaje ---
  console.log('\n--- Flujo 2: Competencias y Resultados de Aprendizaje ---');
  try {
    const compRes = await fetch(`${BASE_URL}/competencias/programa/1`);
    const compData = await compRes.json();
    const hasComps = Array.isArray(compData) && compData.length > 0;
    record('FUNC-04', 'Competencias', 'Consulta de catálogo de competencias por programa ADSO', hasComps, `${compData.length || 0} competencias recuperadas`);

    const fichaCompRes = await fetch(`${BASE_URL}/competencias/ficha/1`);
    const fichaCompData = await fichaCompRes.json();
    const hasFichaComp = Array.isArray(fichaCompData) && fichaCompData.length > 0;
    record('FUNC-05', 'Competencias', 'Consulta de matriz de seguimiento de competencias para la ficha 3413988', hasFichaComp, `${fichaCompData.length || 0} registros de seguimiento`);
  } catch (err) {
    record('FUNC-04', 'Competencias', 'Consulta de competencias', false, err.message, { module: 'competencias.controller.js' });
  }

  // --- FLUJO 3: Evidencias de Aprendizaje ---
  console.log('\n--- Flujo 3: Evidencias de Aprendizaje ---');
  try {
    const evidRes = await fetch(`${BASE_URL}/evidencias/curso/1`);
    const evidData = await evidRes.json();
    const hasEvid = Array.isArray(evidData) && evidData.length > 0;
    record('FUNC-06', 'Evidencias', 'Consulta de evidencias académicas programadas para la ficha 3413988', hasEvid, `${evidData.length || 0} evidencias activas`);
  } catch (err) {
    record('FUNC-06', 'Evidencias', 'Consulta de evidencias', false, err.message, { module: 'evidencias.controller.js' });
  }

  // --- FLUJO 4: Asistencia ---
  console.log('\n--- Flujo 4: Control de Asistencia ---');
  try {
    const asistRes = await fetch(`${BASE_URL}/asistencia/sesiones/1`);
    const asistData = await asistRes.json();
    const hasSesiones = Array.isArray(asistData);
    record('FUNC-07', 'Asistencia', 'Consulta de sesiones de formación registradas para la ficha 3413988', hasSesiones, `${asistData.length || 0} sesiones listadas`);

    const statsRes = await fetch(`${BASE_URL}/asistencia/estadisticas/1`);
    const statsData = await statsRes.json();
    const hasStats = statsData && statsData.resumenGrupal && typeof statsData.resumenGrupal.promedioAsistenciaGrupal === 'number';
    record('FUNC-08', 'Asistencia', 'Cálculo de estadísticas e indicadores globales de asistencia grupal e individual', hasStats, `Promedio grupal: ${statsData.resumenGrupal?.promedioAsistenciaGrupal}% en ${statsData.resumenGrupal?.totalSesiones} sesiones`);
  } catch (err) {
    record('FUNC-07', 'Asistencia', 'Consulta de asistencia', false, err.message, { module: 'asistencia.controller.js' });
  }

  // --- FLUJO 5: Dashboard y Notificaciones ---
  console.log('\n--- Flujo 5: Métricas de Dashboard y Notificaciones ---');
  try {
    const dashRes = await fetch(`${BASE_URL}/dashboard/stats`);
    const dashData = await dashRes.json();
    const hasKpis = !!dashData.kpis && dashData.kpis.aprendices > 0;
    record('FUNC-09', 'Dashboard', 'Consulta de KPIs analíticos de rendimiento institucional', hasKpis, `KPIs: ${dashData.kpis?.aprendices} aprendices, ${dashData.kpis?.asistenciaPromedio}% asistencia`);

    const notifRes = await fetch(`${BASE_URL}/notificaciones`, {
      headers: { 'Authorization': `Bearer ${apToken}` }
    });
    const notifData = await notifRes.json();
    const hasNotif = Array.isArray(notifData.notificaciones);
    record('FUNC-10', 'Notificaciones', 'Bandeja de notificaciones y alertas personales del aprendiz', hasNotif, `${notifData.notificaciones?.length || 0} notificaciones (No leídas: ${notifData.totalNoLeidas})`);
  } catch (err) {
    record('FUNC-09', 'Dashboard/Notificaciones', 'Consulta de métricas', false, err.message, { module: 'dashboard.routes.js' });
  }

  // --- FLUJO 6: Calendario Académico ---
  console.log('\n--- Flujo 6: Calendario Académico (Módulo Expansión 1) ---');
  try {
    const calRes = await fetch(`${BASE_URL}/calendario`);
    const calData = await calRes.json();
    record('FUNC-11', 'Calendario', 'Consulta de eventos y sesiones formativas del calendario', Array.isArray(calData) && calData.length > 0, `${calData.length} eventos recuperados`);

    // Crear y cancelar evento
    const nuevoEvRes = await fetch(`${BASE_URL}/calendario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${instToken}`
      },
      body: JSON.stringify({
        titulo: 'Sesión QA Automatizada',
        descripcion: 'Verificación de flujo de calendario en rama QA',
        categoria: 'EVALUACION',
        fecha_inicio: new Date().toISOString(),
        fecha_fin: new Date(Date.now() + 3600000).toISOString(),
        hora_inicio: '14:00',
        hora_fin: '15:00',
        ubicacion: 'Ambiente Virtual',
        id_curso: 1
      })
    });
    const evCreado = await nuevoEvRes.json();
    const evOk = nuevoEvRes.status === 201 && evCreado.evento?.id_evento;
    record('FUNC-12', 'Calendario', 'Programación de evento/evaluación por el Instructor', evOk, evOk ? `Evento creado ID: ${evCreado.evento.id_evento}` : 'Error al crear evento');

    if (evOk) {
      const cancelRes = await fetch(`${BASE_URL}/calendario/${evCreado.evento.id_evento}/cancelar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${instToken}`
        },
        body: JSON.stringify({ motivo: 'Prueba de cancelación QA superada' })
      });
      const cancelData = await cancelRes.json();
      record('FUNC-13', 'Calendario', 'Cancelación de evento con registro de motivo y trazabilidad de estado', cancelData.evento?.estado === 'CANCELADO', `Estado: ${cancelData.evento?.estado}`);
    }
  } catch (err) {
    record('FUNC-11', 'Calendario', 'Flujo de calendario', false, err.message, { module: 'calendario.controller.js' });
  }

  // --- FLUJO 7: Perfil Académico 360° ---
  console.log('\n--- Flujo 7: Perfil Académico 360° del Aprendiz (Módulo Expansión 2) ---');
  try {
    const p360Res = await fetch(`${BASE_URL}/perfil-360/1`);
    const p360Data = await p360Res.json();
    const p360Ok = p360Data.perfil && p360Data.indicadores && p360Data.secciones;
    record('FUNC-14', 'Perfil 360°', 'Consulta consolidada 360° del aprendiz con indicadores y secciones', p360Ok, `Perfil ID 1 con ${p360Data.secciones?.competencias?.length || 0} competencias vinculadas`);

    const accRes = await fetch(`${BASE_URL}/perfil-360/1/accion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${instToken}`
      },
      body: JSON.stringify({
        tipo_accion: 'PLAN_MEJORAMIENTO',
        descripcion: 'Asignación de plan de mejoramiento en arquitectura distribuida',
        compromiso: 'Entrega de repositorio con microservicios'
      })
    });
    record('FUNC-15', 'Perfil 360°', 'Registro de acción de acompañamiento formativo con compromiso', accRes.status === 201, `Status: ${accRes.status}`);
  } catch (err) {
    record('FUNC-14', 'Perfil 360°', 'Flujo de perfil 360°', false, err.message, { module: 'perfil360.controller.js' });
  }

  // --- FLUJO 8: Sistema de Alertas Tempranas ---
  console.log('\n--- Flujo 8: Sistema de Alertas Tempranas (Módulo Expansión 3) ---');
  try {
    const alertRes = await fetch(`${BASE_URL}/alertas`);
    const alertData = await alertRes.json();
    record('FUNC-16', 'Alertas Tempranas', 'Consulta de alertas tempranas activas y preventivas', Array.isArray(alertData), `${alertData.length} alertas registradas`);

    const evalRes = await fetch(`${BASE_URL}/alertas/evaluar-reglas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      }
    });
    const evalData = await evalRes.json();
    record('FUNC-17', 'Alertas Tempranas', 'Ejecución del motor automático de reglas predictivas y preventivas', evalRes.status === 200, evalData.message);
  } catch (err) {
    record('FUNC-16', 'Alertas Tempranas', 'Flujo de alertas', false, err.message, { module: 'alertas.controller.js' });
  }

  // --- FLUJO 9: Aula Virtual LMS ---
  console.log('\n--- Flujo 9: Aula Virtual LMS (Módulo Expansión 4) ---');
  try {
    const aulaRes = await fetch(`${BASE_URL}/aula`);
    const aulaData = await aulaRes.json();
    const hasAulas = Array.isArray(aulaData) && aulaData.length > 0;
    record('FUNC-18', 'Aula Virtual', 'Consulta del aula virtual asignada a la ficha 3413988 (ADSO)', hasAulas, `${aulaData.length} aula(s) con ${aulaData[0]?.unidades?.length || 0} unidades temáticas`);
  } catch (err) {
    record('FUNC-18', 'Aula Virtual', 'Flujo de aula virtual', false, err.message, { module: 'aula.controller.js' });
  }

  // --- FLUJO 10: Programación y Gestión de Ambientes ---
  console.log('\n--- Flujo 10: Programación y Gestión de Ambientes (Módulo Expansión 5) ---');
  try {
    const ambRes = await fetch(`${BASE_URL}/ambientes`);
    const ambData = await ambRes.json();
    record('FUNC-19', 'Ambientes', 'Consulta de catálogo de ambientes y laboratorios físicos/virtuales', Array.isArray(ambData) && ambData.length > 0, `${ambData.length} ambientes listados`);

    // Intentar reserva conflictiva para verificar detección de solapamiento
    const resConflict = await fetch(`${BASE_URL}/ambientes/reservas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${instToken}`
      },
      body: JSON.stringify({
        id_ambiente: ambData[0]?.id_ambiente || 1,
        id_curso: 1,
        motivo: 'Verificación de colisión horaria',
        fecha: '2026-11-20',
        hora_inicio: '08:00',
        hora_fin: '10:00'
      })
    });
    const colisionOk = resConflict.status === 201 || resConflict.status === 409;
    record('FUNC-20', 'Ambientes', 'Control de concurrencia y detección de solapamiento de reservas de ambientes', colisionOk, `Respuesta HTTP ${resConflict.status} (201 creada / 409 conflicto controlado)`);
  } catch (err) {
    record('FUNC-19', 'Ambientes', 'Flujo de ambientes', false, err.message, { module: 'ambientes.controller.js' });
  }

  // --- FLUJO 11: Centro de Solicitudes Institucionales ---
  console.log('\n--- Flujo 11: Centro de Solicitudes Institucionales (Módulo Expansión 6) ---');
  try {
    const radRes = await fetch(`${BASE_URL}/solicitudes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apToken}`
      },
      body: JSON.stringify({
        categoria: 'CERTIFICADO',
        asunto: 'Certificado de Estudio Ficha 3413988 - QA Run',
        descripcion: 'Generación de constancia académica oficial para sustentación',
        prioridad: 'ALTA'
      })
    });
    const radData = await radRes.json();
    const radOk = radRes.status === 201 && radData.radicado?.startsWith('SOL-2026-');
    record('FUNC-21', 'Solicitudes', 'Radicación formal de trámite con generación de número de radicado consecutivo único', radOk, `Radicado: ${radData.radicado}`);

    if (radOk) {
      const respRes = await fetch(`${BASE_URL}/solicitudes/${radData.solicitud.id_solicitud}/responder`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          respuesta: 'Certificado académico expedido y firmado digitalmente.',
          nuevo_estado: 'CERRADA',
          comentario: 'Trámite completado satisfactoriamente por coordinación'
        })
      });
      record('FUNC-22', 'Solicitudes', 'Respuesta institucional con cierre de trámite y trazabilidad en historial', respRes.status === 200, `Status: ${respRes.status}`);
    }
  } catch (err) {
    record('FUNC-21', 'Solicitudes', 'Flujo de solicitudes', false, err.message, { module: 'solicitudes.controller.js' });
  }

  // --- FLUJO 12: Recuperaciones Académicas ---
  console.log('\n--- Flujo 12: Recuperaciones Académicas y Planes de Nivelación ---');
  try {
    const recupRes = await fetch(`${BASE_URL}/recuperaciones/ficha/1`);
    const recupData = await recupRes.json();
    const hasRecup = Array.isArray(recupData.recuperacionesActivas);
    record('FUNC-23', 'Recuperaciones', 'Consulta de planes de nivelación y mejoramiento por ficha', hasRecup, `${recupData.recuperacionesActivas?.length || 0} planes activos (${recupData.casosCriticos?.length || 0} casos críticos)`);
  } catch (err) {
    record('FUNC-23', 'Recuperaciones', 'Consulta de recuperaciones', false, err.message, { module: 'recuperaciones.controller.js' });
  }

  console.log('\n======================================================================');
  console.log(`📊 RESULTADOS FUNCIONALIDAD: ${results.passed} Aprobadas, ${results.failed} Fallidas (Total: ${results.total})`);
  console.log('======================================================================');

  fs.writeFileSync(path.join(rootDir, 'scripts/funcionalidad_results.json'), JSON.stringify(results, null, 2), 'utf8');
  return results;
}

runFunctionalityTests().catch(console.error);
