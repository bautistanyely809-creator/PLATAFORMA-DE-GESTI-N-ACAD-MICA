import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  X, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  User, 
  Send, 
  FileCheck2,
  Tag,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

const CATEGORIAS_SOLICITUD = [
  { id: 'TODAS', label: 'Todas las Categorías' },
  { id: 'ACADEMICA', label: 'Académica / Evidencias' },
  { id: 'CERTIFICADO', label: 'Certificado / Constancia' },
  { id: 'ASISTENCIA', label: 'Novedad de Asistencia' },
  { id: 'ADMINISTRATIVA', label: 'Administrativa' },
  { id: 'SOPORTE', label: 'Soporte Técnico' }
];

const ESTADOS_SOLICITUD = [
  { id: 'TODOS', label: 'Todos los Estados' },
  { id: 'RECIBIDA', label: 'Recibida', color: 'bg-[#38bdf8]/20 text-[#38bdf8]' },
  { id: 'EN_PROCESO', label: 'En Proceso', color: 'bg-[#facc15]/20 text-[#facc15]' },
  { id: 'RESPONDIDA', label: 'Respondida', color: 'bg-[#a0ca92]/20 text-[#a0ca92]' },
  { id: 'CERRADA', label: 'Cerrada', color: 'bg-[#8c8682]/20 text-[#8c8682]' },
  { id: 'RECHAZADA', label: 'Rechazada', color: 'bg-[#ef4444]/20 text-[#ef4444]' }
];

export default function SolicitudesModule({ user }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoria, setSelectedCategoria] = useState('TODAS');
  const [selectedEstado, setSelectedEstado] = useState('TODOS');
  const [searchRadicado, setSearchRadicado] = useState('');
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);

  // Formularios
  const [createForm, setCreateForm] = useState({
    categoria: 'ACADEMICA',
    asunto: '',
    descripcion: '',
    prioridad: 'MEDIA',
    archivo_adjunto: ''
  });

  const [responseForm, setResponseForm] = useState({
    respuesta: '',
    nuevo_estado: 'RESPONDIDA',
    comentario: ''
  });

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategoria !== 'TODAS') params.categoria = selectedCategoria;
      if (selectedEstado !== 'TODOS') params.estado = selectedEstado;
      if (searchRadicado.trim()) params.radicado = searchRadicado.trim();

      const data = await api.solicitudes.getSolicitudes(params);
      setSolicitudes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar solicitudes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, [selectedCategoria, selectedEstado, searchRadicado]);

  const handleCrearSolicitud = async (e) => {
    e.preventDefault();
    if (!createForm.asunto.trim() || !createForm.descripcion.trim()) return;

    try {
      const res = await api.solicitudes.crear(createForm);
      setShowCreateModal(false);
      setCreateForm({ categoria: 'ACADEMICA', asunto: '', descripcion: '', prioridad: 'MEDIA', archivo_adjunto: '' });
      setFeedback({ type: 'success', message: `Solicitud radicada con éxito con número ${res.radicado}` });
      cargarSolicitudes();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error al radicar solicitud' });
    }
  };

  const handleResponderSolicitud = async (e) => {
    e.preventDefault();
    if (!responseForm.respuesta.trim()) return;

    try {
      await api.solicitudes.responder(selectedSolicitud.id_solicitud, responseForm);
      setShowResponseModal(false);
      setSelectedSolicitud(null);
      setResponseForm({ respuesta: '', nuevo_estado: 'RESPONDIDA', comentario: '' });
      setFeedback({ type: 'success', message: 'Respuesta oficial y estado registrados exitosamente' });
      cargarSolicitudes();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error al responder solicitud' });
    }
  };

  const getEstadoBadge = (estado) => {
    const f = ESTADOS_SOLICITUD.find(e => e.id === estado);
    return f ? f.color : 'bg-[#3d3a39] text-[#eeeeee]';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn font-sans text-[#eeeeee]">
      
      {/* Banner Principal */}
      <div className="bg-[#1d1a18] p-6 rounded-[10px] border border-[#3d3a39] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-[#101010] text-[#fafafa] font-mono text-[10px] uppercase tracking-wider mb-2 border border-[#3d3a39]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc] animate-pulse"></span>
            <span>MÓDULO 6 // CENTRO DE ATENCIÓN Y SOLICITUDES INSTITUCIONALES</span>
          </div>
          <h2 className="text-2xl font-normal text-[#eeeeee] tracking-tight">
            Ventanilla Digital de Trámites & Solicitudes
          </h2>
          <p className="text-xs text-[#8c8682] mt-0.5">
            Radicación oficial de peticiones académicas, constancias de estudio, justificaciones y soporte técnico.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#ee6018] hover:bg-[#d55212] text-white rounded-[3px] font-mono text-xs font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={15} />
          <span>Radicar Nueva Solicitud</span>
        </button>
      </div>

      {feedback && (
        <div className={`p-4 rounded-[6px] border flex items-center justify-between font-mono text-xs ${
          feedback.type === 'success' ? 'bg-[#a0ca92]/10 border-[#a0ca92] text-[#a0ca92]' : 'bg-[#ef4444]/10 border-[#ef4444] text-[#ef4444]'
        }`}>
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)}><X size={14} /></button>
        </div>
      )}

      {/* Filtros y Búsqueda por Radicado */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter size={14} className="text-[#8c8682]" />
          {CATEGORIAS_SOLICITUD.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategoria(c.id)}
              className={`px-3 py-1 text-xs font-mono rounded-[3px] border transition-colors whitespace-nowrap ${
                selectedCategoria === c.id 
                  ? 'bg-[#eeeeee] text-[#101010] border-[#eeeeee] font-medium' 
                  : 'bg-[#101010] text-[#8c8682] border-[#3d3a39] hover:border-[#8c8682]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search size={14} className="absolute left-3 top-2.5 text-[#8c8682]" />
          <input
            type="text"
            value={searchRadicado}
            onChange={e => setSearchRadicado(e.target.value)}
            placeholder="Buscar por radicado (SOL-2026)..."
            className="w-full bg-[#101010] border border-[#3d3a39] text-[#eeeeee] text-xs font-mono pl-9 pr-3 py-1.5 rounded-[4px] outline-none focus:border-[#ee6018]"
          />
        </div>
      </div>

      {/* Lista de Solicitudes */}
      <div className="bg-[#1d1a18] rounded-[10px] border border-[#3d3a39] p-6 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-[#3d3a39]">
          <h3 className="text-sm font-medium text-[#eeeeee]">Registro de Trámites Radicados ({solicitudes.length})</h3>
          <span className="text-xs font-mono text-[#8c8682]">Trazabilidad e historial permanente</span>
        </div>

        {solicitudes.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-[#8c8682]">
            <FileText size={24} className="mx-auto mb-2 text-[#8c8682]" />
            No se encontraron solicitudes con los filtros indicados.
          </div>
        ) : (
          <div className="space-y-3">
            {solicitudes.map(sol => (
              <div
                key={sol.id_solicitud}
                className="bg-[#101010] p-4 rounded-[6px] border border-[#3d3a39] hover:border-[#4d4947] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[#c084fc] font-bold">
                      {sol.radicado}
                    </span>
                    <span className="text-[10px] font-mono text-[#8c8682] px-2 py-0.5 rounded-[3px] bg-[#1d1a18] border border-[#3d3a39]">
                      {sol.categoria}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-[3px] ${getEstadoBadge(sol.estado)}`}>
                      {sol.estado}
                    </span>
                    <span className="text-[10px] font-mono text-[#8c8682]">
                      Prioridad: {sol.prioridad}
                    </span>
                  </div>

                  <h4 className="text-sm font-medium text-[#eeeeee]">{sol.asunto}</h4>
                  <p className="text-xs text-[#8c8682] line-clamp-2">{sol.descripcion}</p>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-[#8c8682] pt-1">
                    <span>Radicado por: <strong className="text-[#eeeeee]">{sol.solicitante?.nombre} {sol.solicitante?.apellido}</strong> ({sol.solicitante?.rol})</span>
                    {sol.responsable && (
                      <span>· Asignado a: <strong className="text-[#a0ca92]">{sol.responsable.nombre} {sol.responsable.apellido}</strong></span>
                    )}
                  </div>

                  {sol.respuesta && (
                    <div className="p-2.5 bg-[#1d1a18] rounded-[4px] border border-[#3d3a39] text-xs text-[#a0ca92] mt-2">
                      <strong>Respuesta Oficial:</strong> {sol.respuesta}
                    </div>
                  )}
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between gap-2 flex-shrink-0">
                  <span className="text-[10px] font-mono text-[#8c8682]">
                    {new Date(sol.fecha_creacion).toLocaleDateString()}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedSolicitud(sol)}
                      className="px-3 py-1.5 bg-[#1d1a18] hover:bg-[#3d3a39] border border-[#3d3a39] text-[#eeeeee] rounded-[3px] text-xs font-mono"
                    >
                      Ver Trazabilidad
                    </button>

                    {(user.rol === 'ADMIN' || user.rol === 'INSTRUCTOR') && sol.estado !== 'CERRADA' && sol.estado !== 'RECHAZADA' && (
                      <button
                        onClick={() => {
                          setSelectedSolicitud(sol);
                          setShowResponseModal(true);
                        }}
                        className="px-3 py-1.5 bg-[#ee6018] hover:bg-[#d55212] text-white rounded-[3px] text-xs font-mono"
                      >
                        Responder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DETALLE Y TRAZABILIDAD */}
      {selectedSolicitud && !showResponseModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] max-w-lg w-full p-6 space-y-4 relative">
            <button onClick={() => setSelectedSolicitud(null)} className="absolute top-4 right-4 text-[#8c8682] hover:text-[#eeeeee]"><X size={18} /></button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-[#c084fc] font-bold">{selectedSolicitud.radicado}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-[3px] ${getEstadoBadge(selectedSolicitud.estado)}`}>
                  {selectedSolicitud.estado}
                </span>
              </div>
              <h3 className="text-base font-normal text-[#eeeeee]">{selectedSolicitud.asunto}</h3>
              <p className="text-xs text-[#8c8682] mt-1">{selectedSolicitud.descripcion}</p>
            </div>

            {selectedSolicitud.respuesta && (
              <div className="p-3 bg-[#101010] rounded-[6px] border border-[#a0ca92]/40 text-xs text-[#a0ca92]">
                <strong className="block text-[#a0ca92] uppercase font-mono text-[10px] mb-1">Respuesta Oficial del Centro</strong>
                {selectedSolicitud.respuesta}
              </div>
            )}

            <div className="border-t border-[#3d3a39] pt-3 space-y-2">
              <h4 className="text-xs font-mono text-[#8c8682] uppercase tracking-wider">Historial de Trazabilidad</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedSolicitud.historial?.map((h, i) => (
                  <div key={h.id_historial || i} className="p-2.5 bg-[#101010] rounded-[4px] border border-[#3d3a39] text-xs space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono text-[#8c8682]">
                      <span>{h.estado_anterior} → <strong className="text-[#c084fc]">{h.estado_nuevo}</strong></span>
                      <span>{new Date(h.fecha).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[#eeeeee]">{h.comentario}</p>
                    {h.usuario && (
                      <span className="text-[10px] text-[#8c8682] block">Responsable: {h.usuario.nombre} {h.usuario.apellido}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedSolicitud(null)}
                className="px-4 py-2 bg-[#3d3a39] text-[#eeeeee] rounded-[3px] text-xs font-mono"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RESPONDER SOLICITUD */}
      {showResponseModal && selectedSolicitud && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] max-w-md w-full p-6 space-y-4 relative">
            <button onClick={() => setShowResponseModal(false)} className="absolute top-4 right-4 text-[#8c8682] hover:text-[#eeeeee]"><X size={18} /></button>

            <div>
              <span className="text-xs font-mono text-[#c084fc]">{selectedSolicitud.radicado}</span>
              <h3 className="text-base font-normal text-[#eeeeee]">Emitir Respuesta Institucional</h3>
              <p className="text-xs text-[#8c8682]">{selectedSolicitud.asunto}</p>
            </div>

            <form onSubmit={handleResponderSolicitud} className="space-y-3 text-xs font-sans">
              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Nuevo Estado</label>
                <select
                  value={responseForm.nuevo_estado}
                  onChange={e => setResponseForm({ ...responseForm, nuevo_estado: e.target.value })}
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                >
                  <option value="RESPONDIDA">Respondida (Trámite atendido)</option>
                  <option value="EN_PROCESO">En Proceso (Requiere trámite adicional)</option>
                  <option value="CERRADA">Cerrada Definitivamente</option>
                  <option value="RECHAZADA">Rechazada (No cumple requisitos)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Respuesta Oficial para el Solicitante</label>
                <textarea
                  rows="3"
                  required
                  value={responseForm.respuesta}
                  onChange={e => setResponseForm({ ...responseForm, respuesta: e.target.value })}
                  placeholder="Detallar la resolución formal, indicaciones o link de descarga..."
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Observación Interna de Trazabilidad</label>
                <input
                  type="text"
                  value={responseForm.comentario}
                  onChange={e => setResponseForm({ ...responseForm, comentario: e.target.value })}
                  placeholder="Nota interna de expediente..."
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#3d3a39]">
                <button type="button" onClick={() => setShowResponseModal(false)} className="px-4 py-2 border border-[#3d3a39] text-[#8c8682] rounded-[3px] font-mono">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#ee6018] text-white rounded-[3px] font-mono font-medium">Enviar Respuesta</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL RADICAR SOLICITUD */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] max-w-lg w-full p-6 space-y-4 relative">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-[#8c8682] hover:text-[#eeeeee]"><X size={18} /></button>

            <div>
              <h3 className="text-base font-normal text-[#eeeeee]">Radicar Nueva Solicitud Institucional</h3>
              <p className="text-xs text-[#8c8682]">Se generará un número único de seguimiento oficial (SOL-2026-XXXX).</p>
            </div>

            <form onSubmit={handleCrearSolicitud} className="space-y-3 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Categoría</label>
                  <select
                    value={createForm.categoria}
                    onChange={e => setCreateForm({ ...createForm, categoria: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                  >
                    <option value="ACADEMICA">Académica / Evidencias</option>
                    <option value="CERTIFICADO">Certificado de Estudio</option>
                    <option value="ASISTENCIA">Novedad de Asistencia</option>
                    <option value="ADMINISTRATIVA">Administrativa</option>
                    <option value="SOPORTE">Soporte Técnico</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Prioridad</label>
                  <select
                    value={createForm.prioridad}
                    onChange={e => setCreateForm({ ...createForm, prioridad: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                  >
                    <option value="BAJA">Baja</option>
                    <option value="MEDIA">Media</option>
                    <option value="ALTA">Alta</option>
                    <option value="URGENTE">Urgente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Asunto de la Petición</label>
                <input
                  type="text"
                  required
                  value={createForm.asunto}
                  onChange={e => setCreateForm({ ...createForm, asunto: e.target.value })}
                  placeholder="Ej: Solicitud de constancia de estudio con intensidad horaria"
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Descripción y Argumentos</label>
                <textarea
                  rows="3"
                  required
                  value={createForm.descripcion}
                  onChange={e => setCreateForm({ ...createForm, descripcion: e.target.value })}
                  placeholder="Explica detalladamente la solicitud y adjunta información relevante..."
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Enlace a Archivos Adjuntos (Opcional)</label>
                <input
                  type="text"
                  value={createForm.archivo_adjunto}
                  onChange={e => setCreateForm({ ...createForm, archivo_adjunto: e.target.value })}
                  placeholder="https://drive.google.com/... o enlace de soporte"
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#3d3a39]">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-[#3d3a39] text-[#8c8682] rounded-[3px] font-mono">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#ee6018] text-white rounded-[3px] font-mono font-medium">Radicar Trámite</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

