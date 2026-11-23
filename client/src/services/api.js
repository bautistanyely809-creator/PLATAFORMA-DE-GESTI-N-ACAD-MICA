/**
 * Servicio Centralizado de API REST para los 7 Módulos Avanzados de EDUNOVA
 * Conectado directamente a los endpoints de Node.js + Express + Prisma + MySQL 8
 */

const API_BASE = '/api';

// Helper para peticiones fetch con manejo de JSON y errores
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  // Obtener token JWT si existe en sesión
  let token = null;
  try {
    const saved = localStorage.getItem('edunova_current_user');
    if (saved) {
      const u = JSON.parse(saved);
      token = u.token;
    }
  } catch (_) {}

  const authHeader = token ? { 'Authorization': `Bearer ${token}` } : {};

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
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
  // AUTENTICACIÓN Y GESTIÓN DE PERFIL (HU-01, HU-02, HU-03, HU-04, HU-05)
  // =========================================================================
  auth: {
    login: (data) => request('/auth/login', { method: 'POST', body: data }),
    registro: (data) => request('/auth/registro', { method: 'POST', body: data }),
    solicitarRecuperacion: (correo) => request('/auth/recuperar-password', { method: 'POST', body: { correo } }),
    restablecerPassword: (data) => request('/auth/restablecer-password', { method: 'POST', body: data }),
    getPerfil: () => request('/auth/perfil'),
    actualizarPerfil: (data) => request('/auth/perfil', { method: 'PUT', body: data })
  },

  // =========================================================================
  // GESTIÓN INSTITUCIONAL DE USUARIOS (HU-06, HU-07)
  // =========================================================================
  usuarios: {
    getUsuarios: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/usuarios${qs ? `?${qs}` : ''}`);
    },
    crearUsuario: (data) => request('/usuarios', { method: 'POST', body: data }),
    cambiarEstado: (id_usuario, estado) => request(`/usuarios/${id_usuario}/estado`, { method: 'PATCH', body: { estado } })
  },

  // =========================================================================
  // GESTIÓN ACADÉMICA: PROGRAMAS, FICHAS Y MATRÍCULAS (HU-08, HU-09, HU-10, HU-11)
  // =========================================================================
  academico: {
    getProgramas: () => request('/academico/programas'),
    crearPrograma: (data) => request('/academico/programas', { method: 'POST', body: data }),
    getFichas: () => request('/academico/fichas'),
    crearFicha: (data) => request('/academico/fichas', { method: 'POST', body: data }),
    asignarInstructor: (id_curso, data) => request(`/academico/fichas/${id_curso}/instructores`, { method: 'POST', body: data }),
    matricularAprendiz: (id_curso, data) => request(`/academico/fichas/${id_curso}/matricular`, { method: 'POST', body: data })
  },
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
  },

  // =========================================================================
  // EXPANSIÓN M1: CALENDARIO ACADÉMICO CENTRALIZADO
  // =========================================================================
  calendario: {
    getEventos: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/calendario${qs ? `?${qs}` : ''}`);
    },
    getEventoById: (id) => request(`/calendario/${id}`),
    crear: (data) => request('/calendario', { method: 'POST', body: data }),
    actualizar: (id, data) => request(`/calendario/${id}`, { method: 'PUT', body: data }),
    cancelar: (id, motivo) => request(`/calendario/${id}/cancelar`, { method: 'PATCH', body: { motivo } })
  },

  // =========================================================================
  // EXPANSIÓN M2: PERFIL ACADÉMICO 360° DEL APRENDIZ
  // =========================================================================
  perfil360: {
    getMiPerfil: () => request('/perfil-360/me'),
    getPorId: (id_aprendiz = 1) => request(`/perfil-360/${id_aprendiz}`),
    getAprendicesFicha: (id_curso = 1) => request(`/perfil-360/ficha/${id_curso}`),
    registrarAccion: (id_aprendiz, data) => request(`/perfil-360/${id_aprendiz}/accion`, { method: 'POST', body: data })
  },

  // =========================================================================
  // EXPANSIÓN M3: SISTEMA DE ALERTAS TEMPRANAS
  // =========================================================================
  alertas: {
    getAlertas: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/alertas${qs ? `?${qs}` : ''}`);
    },
    getPorId: (id) => request(`/alertas/${id}`),
    crear: (data) => request('/alertas', { method: 'POST', body: data }),
    cambiarEstado: (id, data) => request(`/alertas/${id}/estado`, { method: 'PATCH', body: data }),
    evaluarReglas: () => request('/alertas/evaluar-reglas', { method: 'POST' })
  },

  // =========================================================================
  // EXPANSIÓN M4: AULA VIRTUAL (LMS INTEGRADO)
  // =========================================================================
  aula: {
    getAulas: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/aula${qs ? `?${qs}` : ''}`);
    },
    getPorId: (id) => request(`/aula/${id}`),
    crearAula: (data) => request('/aula', { method: 'POST', body: data }),
    crearUnidad: (id_aula, data) => request(`/aula/${id_aula}/unidades`, { method: 'POST', body: data }),
    publicarMaterial: (id_unidad, data) => request(`/aula/unidades/${id_unidad}/materiales`, { method: 'POST', body: data }),
    publicarActividad: (id_unidad, data) => request(`/aula/unidades/${id_unidad}/actividades`, { method: 'POST', body: data }),
    entregarActividad: (id_actividad, data) => request(`/aula/actividades/${id_actividad}/entregar`, { method: 'POST', body: data }),
    evaluarEntrega: (id_entrega, data) => request(`/aula/entregas/${id_entrega}/evaluar`, { method: 'POST', body: data })
  },

  // =========================================================================
  // EXPANSIÓN M5: PROGRAMACIÓN Y GESTIÓN DE AMBIENTES
  // =========================================================================
  ambientes: {
    getAmbientes: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/ambientes${qs ? `?${qs}` : ''}`);
    },
    getPorId: (id) => request(`/ambientes/${id}`),
    crear: (data) => request('/ambientes', { method: 'POST', body: data }),
    actualizar: (id, data) => request(`/ambientes/${id}`, { method: 'PUT', body: data }),
    getDisponibilidad: (id, fecha = '') => request(`/ambientes/${id}/disponibilidad${fecha ? `?fecha=${fecha}` : ''}`),
    crearReserva: (data) => request('/ambientes/reservas', { method: 'POST', body: data }),
    cancelarReserva: (id, motivo) => request(`/ambientes/reservas/${id}/cancelar`, { method: 'PATCH', body: { motivo } })
  },

  // =========================================================================
  // EXPANSIÓN M6: CENTRO DE SOLICITUDES INSTITUCIONALES
  // =========================================================================
  solicitudes: {
    getSolicitudes: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/solicitudes${qs ? `?${qs}` : ''}`);
    },
    getPorId: (id) => request(`/solicitudes/${id}`),
    crear: (data) => request('/solicitudes', { method: 'POST', body: data }),
    asignar: (id, data) => request(`/solicitudes/${id}/asignar`, { method: 'PATCH', body: data }),
    responder: (id, data) => request(`/solicitudes/${id}/responder`, { method: 'PATCH', body: data })
  }
};

