import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Play, 
  Plus, 
  X, 
  User, 
  History, 
  FileText,
  AlertOctagon,
  RefreshCw
} from 'lucide-react';

const PRIORIDADES = [
  { id: 'TODAS', label: 'Todas las Prioridades' },
  { id: 'CRITICA', label: 'Crítica', color: 'bg-[#ef4444] text-white' },
  { id: 'ALTA', label: 'Alta', color: 'bg-[#f97316] text-white' },
  { id: 'MEDIA', label: 'Media', color: 'bg-[#facc15] text-[#101010]' },
  { id: 'BAJA', label: 'Baja', color: 'bg-[#38bdf8] text-[#101010]' },
  { id: 'INFORMATIVA', label: 'Informativa', color: 'bg-[#8c8682] text-white' }
];

export default function AlertasModule({ user }) {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrioridad, setSelectedPrioridad] = useState('TODAS');
  const [selectedEstado, setSelectedEstado] = useState('TODOS');
  const [selectedAlerta, setSelectedAlerta] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusForm, setStatusForm] = useState({ nuevo_estado: 'EN_SEGUIMIENTO', comentario: '' });
  const [feedback, setFeedback] = useState(null);
  const [runningEngine, setRunningEngine] = useState(false);

  // Formulario nueva alerta manual
  const [createForm, setCreateForm] = useState({
    tipo: 'COMPETENCIA_SIN_AVANCE',
    titulo: '',
    descripcion: '',
    id_curso: '1',
    id_aprendiz: '1',
    prioridad: 'MEDIA'
  });

  const cargarAlertas = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedPrioridad !== 'TODAS') params.prioridad = selectedPrioridad;
      if (selectedEstado !== 'TODOS') params.estado = selectedEstado;
      const data = await api.alertas.getAlertas(params);
      setAlertas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar alertas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAlertas();
  }, [selectedPrioridad, selectedEstado]);

  const handleEjecutarMotor = async () => {
    try {
      setRunningEngine(true);
      const res = await api.alertas.evaluarReglas();
      setFeedback({ type: 'success', message: res.message || 'Motor de reglas evaluado con éxito.' });
      cargarAlertas();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error al ejecutar motor de reglas' });
    } finally {
      setRunningEngine(false);
    }
  };

  const handleCrearAlerta = async (e) => {
    e.preventDefault();
    if (!createForm.titulo.trim() || !createForm.descripcion.trim()) return;

    try {
      await api.alertas.crear({
        ...createForm,
        id_curso: Number(createForm.id_curso),
        id_aprendiz: Number(createForm.id_aprendiz)
      });
      setShowCreateModal(false);
      setFeedback({ type: 'success', message: 'Alerta temprana registrada exitosamente' });
      cargarAlertas();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error al crear alerta' });
    }
  };

  const handleCambiarEstado = async (e) => {
    e.preventDefault();
    if (!statusForm.comentario.trim()) {
      alert('Debe ingresar una observación o justificación');
      return;
    }

    try {
      await api.alertas.cambiarEstado(selectedAlerta.id_alerta, statusForm);
      setShowStatusModal(false);
      setSelectedAlerta(null);
      setFeedback({ type: 'success', message: 'Estado e historial de trazabilidad actualizados' });
      cargarAlertas();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error al cambiar estado' });
    }
  };

  // Contadores de métricas
  const criticas = alertas.filter(a => a.prioridad === 'CRITICA').length;
  const altas = alertas.filter(a => a.prioridad === 'ALTA').length;
  const enSeguimiento = alertas.filter(a => a.estado === 'EN_SEGUIMIENTO').length;
  const nuevas = alertas.filter(a => a.estado === 'NUEVA').length;

  const getPriorityBadge = (prio) => {
    const f = PRIORIDADES.find(p => p.id === prio);
    return f ? f.color : 'bg-[#3d3a39] text-white';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn font-sans text-[#eeeeee]">
      
      {/* Banner Encabezado */}
      <div className="bg-[#1d1a18] p-6 rounded-[10px] border border-[#3d3a39] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-[#101010] text-[#fafafa] font-mono text-[10px] uppercase tracking-wider mb-2 border border-[#3d3a39]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse"></span>
            <span>MÓDULO 3 // SISTEMA PREVENTIVO DE ALERTAS TEMPRANAS</span>
          </div>
          <h2 className="text-2xl font-normal text-[#eeeeee] tracking-tight">
            Consola de Alertas & Detección de Riesgos
          </h2>
          <p className="text-xs text-[#8c8682] mt-0.5">
            Monitoreo preventivo automatizado de inasistencias, evidencias vencidas y avance formativo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {(user.rol === 'ADMIN' || user.rol === 'INSTRUCTOR') && (
            <>
              <button
                onClick={handleEjecutarMotor}
                disabled={runningEngine}
                className="px-3.5 py-2 bg-[#101010] hover:bg-[#3d3a39] border border-[#3d3a39] text-[#eeeeee] rounded-[3px] font-mono text-xs font-medium transition-colors flex items-center gap-2"
                title="Escanear inasistencias y evidencias vencidas en MySQL"
              >
                <RefreshCw size={13} className={runningEngine ? 'animate-spin text-[#ee6018]' : 'text-[#ee6018]'} />
                <span>{runningEngine ? 'Evaluando...' : 'Evaluar Reglas'}</span>
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-[#ee6018] hover:bg-[#d55212] text-white rounded-[3px] font-mono text-xs font-medium transition-colors flex items-center gap-2"
              >
                <Plus size={15} />
                <span>Nueva Alerta</span>
              </button>
            </>
          )}
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-[6px] border flex items-center justify-between font-mono text-xs ${
          feedback.type === 'success' ? 'bg-[#a0ca92]/10 border-[#a0ca92] text-[#a0ca92]' : 'bg-[#ef4444]/10 border-[#ef4444] text-[#ef4444]'
        }`}>
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)}><X size={14} /></button>
        </div>
      )}

      {/* 4 Cards de Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1d1a18] p-4 rounded-[8px] border border-[#3d3a39]">
          <span className="text-[10px] font-mono text-[#ef4444] uppercase tracking-wider block">Prioridad Crítica</span>
          <span className="text-3xl font-mono text-[#eeeeee] font-normal block mt-1">{criticas}</span>
          <span className="text-xs text-[#8c8682]">Riesgo inmediato de deserción</span>
        </div>

        <div className="bg-[#1d1a18] p-4 rounded-[8px] border border-[#3d3a39]">
          <span className="text-[10px] font-mono text-[#f97316] uppercase tracking-wider block">Prioridad Alta</span>
          <span className="text-3xl font-mono text-[#eeeeee] font-normal block mt-1">{altas}</span>
          <span className="text-xs text-[#8c8682]">Inasistencias o refuerzo urgente</span>
        </div>

        <div className="bg-[#1d1a18] p-4 rounded-[8px] border border-[#3d3a39]">
          <span className="text-[10px] font-mono text-[#facc15] uppercase tracking-wider block">En Seguimiento</span>
          <span className="text-3xl font-mono text-[#eeeeee] font-normal block mt-1">{enSeguimiento}</span>
          <span className="text-xs text-[#8c8682]">Con docente asignado</span>
        </div>

        <div className="bg-[#1d1a18] p-4 rounded-[8px] border border-[#3d3a39]">
          <span className="text-[10px] font-mono text-[#38bdf8] uppercase tracking-wider block">Nuevas sin Atender</span>
          <span className="text-3xl font-mono text-[#eeeeee] font-normal block mt-1">{nuevas}</span>
          <span className="text-xs text-[#8c8682]">Requieren revisión inicial</span>
        </div>
      </div>

      {/* Filtros de Prioridad y Estado */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter size={14} className="text-[#8c8682]" />
          {PRIORIDADES.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPrioridad(p.id)}
              className={`px-3 py-1 text-xs font-mono rounded-[3px] border transition-colors whitespace-nowrap ${
                selectedPrioridad === p.id 
                  ? 'bg-[#eeeeee] text-[#101010] border-[#eeeeee] font-medium' 
                  : 'bg-[#101010] text-[#8c8682] border-[#3d3a39] hover:border-[#8c8682]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#8c8682]">Estado:</span>
          <select
            value={selectedEstado}
            onChange={e => setSelectedEstado(e.target.value)}
            className="bg-[#101010] border border-[#3d3a39] text-[#eeeeee] text-xs font-mono px-3 py-1 rounded-[3px] outline-none"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="NUEVA">Nueva</option>
            <option value="EN_SEGUIMIENTO">En Seguimiento</option>
            <option value="ATENDIDA">Atendida</option>
            <option value="CERRADA">Cerrada</option>
          </select>
        </div>
      </div>

      {/* Lista de Alertas */}
      <div className="bg-[#1d1a18] rounded-[10px] border border-[#3d3a39] p-6 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-[#3d3a39]">
          <h3 className="text-sm font-medium text-[#eeeeee]">Registro de Alertas Detectadas ({alertas.length})</h3>
          <span className="text-xs font-mono text-[#8c8682]">Ficha ADSO 3413988</span>
        </div>

        {alertas.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-[#a0ca92]">
            <CheckCircle2 size={24} className="mx-auto mb-2 text-[#a0ca92]" />
            No hay alertas que coincidan con los filtros seleccionados.
          </div>
        ) : (
          <div className="space-y-3">
            {alertas.map(al => (
              <div
                key={al.id_alerta}
                className="bg-[#101010] p-4 rounded-[6px] border border-[#3d3a39] hover:border-[#4d4947] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-[3px] ${getPriorityBadge(al.prioridad)}`}>
                      {al.prioridad}
                    </span>
                    <span className="text-[10px] font-mono text-[#8c8682] bg-[#1d1a18] px-2 py-0.5 rounded-[3px] border border-[#3d3a39]">
                      {al.tipo}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-[3px] ${
                      al.estado === 'CERRADA' || al.estado === 'ATENDIDA' ? 'bg-[#a0ca92]/20 text-[#a0ca92]' : 'bg-[#ee6018]/20 text-[#ee6018]'
                    }`}>
                      {al.estado}
                    </span>
                    <span className="text-[10px] font-mono text-[#8c8682]">
                      Origen: {al.origen}
                    </span>
                  </div>

                  <h4 className="text-sm font-medium text-[#eeeeee]">{al.titulo}</h4>
                  <p className="text-xs text-[#8c8682] leading-relaxed">{al.descripcion}</p>

                  {al.aprendiz && (
                    <span className="text-xs font-mono text-[#38bdf8] block">
                      Aprendiz: {al.aprendiz.usuario?.nombre} {al.aprendiz.usuario?.apellido}
                    </span>
                  )}
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between gap-2 flex-shrink-0">
                  <span className="text-[10px] font-mono text-[#8c8682]">
                    {new Date(al.fecha_generacion).toLocaleDateString()}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedAlerta(al)}
                      className="px-3 py-1.5 bg-[#1d1a18] hover:bg-[#3d3a39] border border-[#3d3a39] text-[#eeeeee] rounded-[3px] text-xs font-mono transition-colors"
                    >
                      Ver Historial
                    </button>
                    {(user.rol === 'ADMIN' || user.rol === 'INSTRUCTOR') && al.estado !== 'CERRADA' && (
                      <button
                        onClick={() => {
                          setSelectedAlerta(al);
                          setShowStatusModal(true);
                        }}
                        className="px-3 py-1.5 bg-[#ee6018] hover:bg-[#d55212] text-white rounded-[3px] text-xs font-mono transition-colors"
                      >
                        Gestionar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DETALLE E HISTORIAL DE TRAZABILIDAD */}
      {selectedAlerta && !showStatusModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] max-w-lg w-full p-6 space-y-4 relative">
            <button
              onClick={() => setSelectedAlerta(null)}
              className="absolute top-4 right-4 text-[#8c8682] hover:text-[#eeeeee]"
            >
              <X size={18} />
            </button>

            <div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-[3px] ${getPriorityBadge(selectedAlerta.prioridad)}`}>
                {selectedAlerta.prioridad} · {selectedAlerta.estado}
              </span>
              <h3 className="text-base font-normal text-[#eeeeee] mt-1">{selectedAlerta.titulo}</h3>
              <p className="text-xs text-[#8c8682]">{selectedAlerta.descripcion}</p>
            </div>

            <div className="border-t border-[#3d3a39] pt-3 space-y-3">
              <h4 className="text-xs font-mono text-[#8c8682] uppercase tracking-wider flex items-center gap-1.5">
                <History size={14} className="text-[#ee6018]" />
                Línea de Tiempo y Trazabilidad
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedAlerta.historial?.map((h, i) => (
                  <div key={h.id_historial || i} className="p-2.5 bg-[#101010] rounded-[4px] border border-[#3d3a39] text-xs space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono text-[#8c8682]">
                      <span>{h.estado_anterior} → <strong className="text-[#a0ca92]">{h.estado_nuevo}</strong></span>
                      <span>{new Date(h.fecha).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[#eeeeee]">{h.comentario}</p>
                    {h.usuario && (
                      <span className="text-[10px] text-[#8c8682] block">
                        Por: {h.usuario.nombre} {h.usuario.apellido}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedAlerta(null)}
                className="px-4 py-2 bg-[#3d3a39] hover:bg-[#4d4947] text-[#eeeeee] rounded-[3px] text-xs font-mono"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL GESTIONAR ESTADO DE ALERTA */}
      {showStatusModal && selectedAlerta && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] max-w-md w-full p-6 space-y-4 relative">
            <button
              onClick={() => setShowStatusModal(false)}
              className="absolute top-4 right-4 text-[#8c8682] hover:text-[#eeeeee]"
            >
              <X size={18} />
            </button>

            <div>
              <h3 className="text-base font-normal text-[#eeeeee]">Gestionar Alerta Temprana</h3>
              <p className="text-xs text-[#8c8682]">{selectedAlerta.titulo}</p>
            </div>

            <form onSubmit={handleCambiarEstado} className="space-y-3 text-xs font-sans">
              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Nuevo Estado</label>
                <select
                  value={statusForm.nuevo_estado}
                  onChange={e => setStatusForm({ ...statusForm, nuevo_estado: e.target.value })}
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                >
                  <option value="EN_SEGUIMIENTO">En Seguimiento (Asignar acción)</option>
                  <option value="ATENDIDA">Atendida (Sesión de refuerzo realizada)</option>
                  <option value="CERRADA">Cerrar Alerta (Justificación requerida)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">
                  {statusForm.nuevo_estado === 'CERRADA' ? 'Justificación de Cierre' : 'Observaciones y Compromisos'}
                </label>
                <textarea
                  rows="3"
                  required
                  value={statusForm.comentario}
                  onChange={e => setStatusForm({ ...statusForm, comentario: e.target.value })}
                  placeholder="Detalle de las acciones acordadas o motivo de cierre..."
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#3d3a39]">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 border border-[#3d3a39] text-[#8c8682] rounded-[3px] text-xs font-mono"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ee6018] text-white rounded-[3px] text-xs font-mono font-medium"
                >
                  Confirmar Cambio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREAR ALERTA MANUAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] max-w-lg w-full p-6 space-y-4 relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-[#8c8682] hover:text-[#eeeeee]"
            >
              <X size={18} />
            </button>

            <div>
              <h3 className="text-base font-normal text-[#eeeeee]">Generar Alerta Temprana Manual</h3>
              <p className="text-xs text-[#8c8682]">Registrar observación preventiva institucional.</p>
            </div>

            <form onSubmit={handleCrearAlerta} className="space-y-3 text-xs font-sans">
              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Título de la Alerta</label>
                <input
                  type="text"
                  required
                  value={createForm.titulo}
                  onChange={e => setCreateForm({ ...createForm, titulo: e.target.value })}
                  placeholder="Ej: Bajo rendimiento en algoritmos o ausentismo reiterado"
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Tipo de Riesgo</label>
                  <select
                    value={createForm.tipo}
                    onChange={e => setCreateForm({ ...createForm, tipo: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                  >
                    <option value="INASISTENCIA">Inasistencias Frecuentes</option>
                    <option value="EVIDENCIA_PENDIENTE">Evidencias Pendientes</option>
                    <option value="COMPETENCIA_SIN_AVANCE">Competencia sin Avance</option>
                    <option value="RECUPERACION_PENDIENTE">Recuperación Pendiente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Nivel Prioridad</label>
                  <select
                    value={createForm.prioridad}
                    onChange={e => setCreateForm({ ...createForm, prioridad: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                  >
                    <option value="CRITICA">Crítica</option>
                    <option value="ALTA">Alta</option>
                    <option value="MEDIA">Media</option>
                    <option value="BAJA">Baja</option>
                    <option value="INFORMATIVA">Informativa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Descripción Detallada</label>
                <textarea
                  rows="3"
                  required
                  value={createForm.descripcion}
                  onChange={e => setCreateForm({ ...createForm, descripcion: e.target.value })}
                  placeholder="Circunstancias detectadas y recomendaciones iniciales..."
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#3d3a39]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-[#3d3a39] text-[#8c8682] rounded-[3px] text-xs font-mono"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ee6018] text-white rounded-[3px] text-xs font-mono font-medium"
                >
                  Guardar Alerta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
