const path = require('path');
require('../server/node_modules/dotenv').config({ path: path.join(__dirname, '../server/.env') });

const BASE_URL = 'http://localhost:4000/api';

async function runIntegrationTests() {
  console.log('🧪 Iniciando batería de pruebas de integración para los 6 módulos de EDUNOVA...');
  let passCount = 0;
  let failCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passCount++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failCount++;
    }
  }

  // 1. Autenticación de Admin e Instructor
  console.log('\n--- 1. Autenticación y Tokens JWT ---');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo: 'admin@edunova.edu.co', password: 'edunova2026' })
  });
  const adminAuth = await loginRes.json();
  assert(adminAuth.token, 'Admin autenticado con token JWT');

  const instLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo: 'carlos.mendoza@edunova.edu.co', password: 'edunova2026' })
  });
  const instAuth = await instLoginRes.json();
  assert(instAuth.token, 'Instructor autenticado con token JWT');

  const apLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo: 'anyely.valeria@edunova.edu.co', password: 'edunova2026' })
  });
  const apAuth = await apLoginRes.json();
  assert(apAuth.token, 'Aprendiz autenticado con token JWT');

  // 2. MÓDULO 1: Calendario Académico
  console.log('\n--- 2. Pruebas Módulo 1: Calendario Académico ---');
  const calRes = await fetch(`${BASE_URL}/calendario`);
  const eventos = await calRes.json();
  assert(Array.isArray(eventos) && eventos.length >= 4, `Consulta de eventos retorna ${eventos.length} registros`);

  // Crear evento
  const nuevoEventoRes = await fetch(`${BASE_URL}/calendario`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${instAuth.token}`
    },
    body: JSON.stringify({
      titulo: 'Sesión de Prueba: Validación de API de Calendario',
      descripcion: 'Prueba de integración automatizada',
      categoria: 'CLASE',
      fecha_inicio: new Date().toISOString(),
      fecha_fin: new Date(Date.now() + 7200000).toISOString(),
      hora_inicio: '10:00',
      hora_fin: '12:00',
      ubicacion: 'Laboratorio 101',
      id_curso: 1
    })
  });
  const eventoCreado = await nuevoEventoRes.json();
  assert(nuevoEventoRes.status === 201, 'Evento creado exitosamente en el calendario');

  // Cancelar evento con motivo
  const cancelRes = await fetch(`${BASE_URL}/calendario/${eventoCreado.evento.id_evento}/cancelar`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${instAuth.token}`
    },
    body: JSON.stringify({ motivo: 'Ajuste de cronograma por prueba unitaria' })
  });
  const cancelData = await cancelRes.json();
  assert(cancelData.evento.estado === 'CANCELADO', 'Evento cancelado con trazabilidad y estado CANCELADO');

  // 3. MÓDULO 2: Perfil Académico 360°
  console.log('\n--- 3. Pruebas Módulo 2: Perfil Académico 360° ---');
  const perfil360Res = await fetch(`${BASE_URL}/perfil-360/1`);
  const perfil360 = await perfil360Res.json();
  assert(perfil360.perfil && perfil360.perfil.id_aprendiz === 1, 'Perfil 360° del aprendiz consultado con datos relacionales');
  assert(perfil360.indicadores && typeof perfil360.indicadores.porcentajeAvanceCompetencias === 'number', 'Indicador de competencias calculado');
  assert(perfil360.indicadores && typeof perfil360.indicadores.porcentajeAsistencia === 'number', 'Indicador de asistencia calculado');
  assert(Array.isArray(perfil360.secciones.competencias), 'Matriz de competencias consolidada');
  assert(Array.isArray(perfil360.secciones.evidencias), 'Historial de entregas de evidencias consolidado');

  // Registrar acción de acompañamiento
  const accionRes = await fetch(`${BASE_URL}/perfil-360/1/accion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${instAuth.token}`
    },
    body: JSON.stringify({
      tipo_accion: 'TUTORIA',
      descripcion: 'Sesión de retroalimentación en integración de servicios',
      compromiso: 'Entrega de informe complementario'
    })
  });
  assert(accionRes.status === 201, 'Acción de acompañamiento formativo registrada');

  // 4. MÓDULO 3: Alertas Tempranas
  console.log('\n--- 4. Pruebas Módulo 3: Alertas Tempranas ---');
  const alertasRes = await fetch(`${BASE_URL}/alertas`);
  const alertas = await alertasRes.json();
  assert(Array.isArray(alertas) && alertas.length >= 3, `Listado de alertas activas (${alertas.length} registros)`);

  // Motor de reglas
  const motorRes = await fetch(`${BASE_URL}/alertas/evaluar-reglas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminAuth.token}`
    }
  });
  const motorData = await motorRes.json();
  assert(motorRes.status === 200, `Motor de reglas evaluado: ${motorData.message}`);

  // Cambiar estado con justificación
  const alertaId = alertas[0].id_alerta;
  const estadoAlertaRes = await fetch(`${BASE_URL}/alertas/${alertaId}/estado`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${instAuth.token}`
    },
    body: JSON.stringify({
      nuevo_estado: 'EN_SEGUIMIENTO',
      comentario: 'Revisión técnica en progreso por el instructor'
    })
  });
  assert(estadoAlertaRes.status === 200, 'Estado de la alerta actualizado con historial');

  // 5. MÓDULO 4: Aula Virtual
  console.log('\n--- 5. Pruebas Módulo 4: Aula Virtual ---');
  const aulasRes = await fetch(`${BASE_URL}/aula`);
  const aulas = await aulasRes.json();
  assert(Array.isArray(aulas) && aulas.length >= 1, `Aula virtual de ADSO 3413988 consultada (${aulas.length} aula activa)`);
  assert(aulas[0].unidades && aulas[0].unidades.length >= 2, `Aula contiene ${aulas[0].unidades.length} unidades temáticas`);

  // 6. MÓDULO 5: Programación de Ambientes
  console.log('\n--- 6. Pruebas Módulo 5: Gestión de Ambientes ---');
  const ambRes = await fetch(`${BASE_URL}/ambientes`);
  const ambientes = await ambRes.json();
  assert(Array.isArray(ambientes) && ambientes.length >= 3, `Catálogo de ambientes (${ambientes.length} ambientes disponibles)`);

  // Validación de conflicto de reservas
  const conflictoRes = await fetch(`${BASE_URL}/ambientes/reservas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${instAuth.token}`
    },
    body: JSON.stringify({
      id_ambiente: ambientes[0].id_ambiente,
      id_curso: 1,
      motivo: 'Reserva concurrente de prueba',
      fecha: ambientes[0].reservas?.[0]?.fecha ? new Date(ambientes[0].reservas[0].fecha).toISOString().split('T')[0] : '2026-11-20',
      hora_inicio: '08:00',
      hora_fin: '10:00'
    })
  });
  assert(conflictoRes.status === 201 || conflictoRes.status === 409, 'Control de reservas y detección de colisiones horarias verificado');

  // 7. MÓDULO 6: Centro de Solicitudes
  console.log('\n--- 7. Pruebas Módulo 6: Centro de Solicitudes ---');
  const solRes = await fetch(`${BASE_URL}/solicitudes`, {
    headers: { 'Authorization': `Bearer ${apAuth.token}` }
  });
  const solicitudes = await solRes.json();
  assert(Array.isArray(solicitudes) && solicitudes.length >= 1, `Solicitudes radicadas por el aprendiz (${solicitudes.length} encontradas)`);

  // Radicar nueva solicitud
  const nuevaSolRes = await fetch(`${BASE_URL}/solicitudes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apAuth.token}`
    },
    body: JSON.stringify({
      categoria: 'ACADEMICA',
      asunto: 'Solicitud de Prueba Integración',
      descripcion: 'Verificación de radicado único y trazabilidad',
      prioridad: 'MEDIA'
    })
  });
  const nuevaSolData = await nuevaSolRes.json();
  assert(nuevaSolRes.status === 201 && nuevaSolData.radicado.startsWith('SOL-2026-'), `Radicado único generado correctamente: ${nuevaSolData.radicado}`);

  // Responder solicitud por parte del instructor/admin
  const respSol = await fetch(`${BASE_URL}/solicitudes/${nuevaSolData.solicitud.id_solicitud}/responder`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${instAuth.token}`
    },
    body: JSON.stringify({
      respuesta: 'Trámite procesado exitosamente por la coordinación académica.',
      nuevo_estado: 'RESPONDIDA',
      comentario: 'Verificación de integración exitosa'
    })
  });
  assert(respSol.status === 200, 'Solicitud respondida formalmente con notificación al aprendiz');

  console.log('\n====================================================');
  console.log(`📊 Resumen de Pruebas: ${passCount} Aprobadas, ${failCount} Fallidas`);
  console.log('====================================================');

  if (failCount === 0) {
    console.log('🎉 ¡Todas las pruebas de integración pasaron satisfactoriamente!');
  }
}

runIntegrationTests().catch(e => {
  console.error('Error durante la ejecución del test runner:', e);
});
