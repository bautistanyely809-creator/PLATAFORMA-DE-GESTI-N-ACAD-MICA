/**
 * Servicio Centralizado de API REST para los 7 Módulos Avanzados de EDUNOVA
 * Conectado directamente a los endpoints de Node.js + Express + Prisma + MySQL 8
 */

const API_BASE = '/api';

// Helper para peticiones fetch con manejo de JSON y errores
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  if (!response.ok) {
    let errorMsg = `Error ${response.status}: ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson.message) errorMsg = errJson.message;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return response;
}

export const api = {
  // =========================================================================
  // MÓDULO 1: SEGUIMIENTO ACADÉMICO POR COMPETENCIAS
  // =========================================================================
  competencias: {
    getPorPrograma: (id_programa = 1) => request(`/competencias/programa/${id_programa}`),
    getSeguimientoAprendiz: (id_inscripcion = 1) => request(`/competencias/seguimiento/${id_inscripcion}`),
    getSeguimientoFicha: (id_curso = 1) => request(`/competencias/ficha/${id_curso}`),
    evaluar: (data) => request('/competencias/evaluar', { method: 'POST', body: data })
  },

  // =========================================================================
  // MÓDULO 2: GESTIÓN COMPLETA DE EVIDENCIAS Y ENTREGAS VERSIONADAS
  // =========================================================================
  evidencias: {
    getPorCurso: (id_curso = 1, estado = '') => {
      const q = estado ? `?estado=${estado}` : '';
      return request(`/evidencias/curso/${id_curso}${q}`);
    },
    crear: (data) => request('/evidencias', { method: 'POST', body: data }),
    entregar: (id_evidencia, data) => request(`/evidencias/${id_evidencia}/entregar`, { method: 'POST', body: data }),
    calificar: (id_entrega, data) => request(`/evidencias/entregas/${id_entrega}/calificar`, { method: 'POST', body: data })
  },

  // =========================================================================
  // MÓDULO 3: SISTEMA DE RECUPERACIÓN DE COMPETENCIAS
  // =========================================================================
  recuperaciones: {
    getPorAprendiz: (id_inscripcion = 1) => request(`/recuperaciones/aprendiz/${id_inscripcion}`),
    getPorFicha: (id_curso = 1) => request(`/recuperaciones/ficha/${id_curso}`),
    asignar: (data) => request('/recuperaciones/asignar', { method: 'POST', body: data }),
    entregar: (id_recuperacion, data) => request(`/recuperaciones/${id_recuperacion}/entregar`, { method: 'POST', body: data }),
    evaluar: (id_recuperacion, data) => request(`/recuperaciones/${id_recuperacion}/evaluar`, { method: 'POST', body: data })
  },

  // =========================================================================
  // MÓDULO 4: CONTROL DE ASISTENCIA AUTOMATIZADO
  // =========================================================================
  asistencia: {
    getSesiones: (id_curso = 1) => request(`/asistencia/sesiones/${id_curso}`),
    crearSesion: (data) => request('/asistencia/sesiones', { method: 'POST', body: data }),
    getPlanillaSesion: (id_sesion) => request(`/asistencia/sesion/${id_sesion}`),
    registrar: (data) => request('/asistencia/registrar', { method: 'POST', body: data }),
    justificar: (data) => request('/asistencia/justificar', { method: 'POST', body: data }),
    getEstadisticas: (id_curso = 1) => request(`/asistencia/estadisticas/${id_curso}`)
  },

  // =========================================================================
  // MÓDULO 5: CENTRO DE REPORTES PDF Y EXCEL
  // =========================================================================
  reportes: {
    getReporteAprendiz: (id_inscripcion = 1) => request(`/reportes/aprendiz/${id_inscripcion}`),
    getReporteFicha: (id_curso = 1) => request(`/reportes/ficha/${id_curso}`),
    descargarExcelUrl: (id_curso = 1) => `${API_BASE}/reportes/exportar/excel?id_curso=${id_curso}`
  },

  // =========================================================================
  // MÓDULO 6: CENTRO DE NOTIFICACIONES AUTOMÁTICAS
  // =========================================================================
  notificaciones: {
    get: (id_usuario, categoria = '') => {
      const params = new URLSearchParams();
      if (id_usuario) params.append('id_usuario', id_usuario);
      if (categoria) params.append('categoria', categoria);
      return request(`/notificaciones?${params.toString()}`);
    },
    marcarLeida: (id) => request(`/notificaciones/${id}/leida`, { method: 'PUT' }),
    marcarTodas: (id_usuario) => request('/notificaciones/marcar-todas/todas', { method: 'PUT', body: { id_usuario } })
  },

  // =========================================================================
  // MÓDULO 7: EDUNOVA AI CON DATOS ACADÉMICOS REALES
  // =========================================================================
  ai: {
    consultar: (data) => request('/ai/query', { method: 'POST', body: data })
  }
};
