import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Building2, 
  MapPin, 
  Users, 
  Calendar, 
  Clock, 
  Plus, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Filter, 
  Search,
  Monitor,
  Wrench,
  Ban
} from 'lucide-react';

const TIPOS_AMBIENTE = [
  { id: 'TODOS', label: 'Todos los Ambientes' },
  { id: 'SISTEMAS', label: 'Laboratorios de Sistemas' },
  { id: 'LABORATORIO', label: 'Talleres Técnicos & Redes' },
  { id: 'AUDITORIO', label: 'Auditorios y Salones Magistrales' },
  { id: 'AULA_TEORICA', label: 'Aulas Teóricas' }
];

export default function AmbientesModule({ user }) {
  const [ambientes, setAmbientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTipo, setSelectedTipo] = useState('TODOS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAmbiente, setSelectedAmbiente] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Modales
  const [showReservaModal, setShowReservaModal] = useState(false);
  const [showAmbienteModal, setShowAmbienteModal] = useState(false);

  // Formularios
  const [reservaForm, setReservaForm] = useState({
    id_ambiente: '',
    id_curso: '1',
    motivo: '',
    fecha: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    hora_inicio: '08:00',
    hora_fin: '12:00',
    observaciones: ''
  });

  const [ambienteForm, setAmbienteForm] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    ubicacion: 'Bloque Tecnológico - Piso 1',
    capacidad: '35',
    tipo: 'SISTEMAS',
    equipamiento: '35 Computadores Core i7, Switch Cisco, Proyector interactivo',
    estado: 'DISPONIBLE'
  });

  const cargarAmbientes = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedTipo !== 'TODOS') params.tipo = selectedTipo;
      if (searchQuery.trim()) params.q = searchQuery.trim();
      const data = await api.ambientes.getAmbientes(params);
      const lista = Array.isArray(data) ? data : [];
      setAmbientes(lista);
      if (lista.length > 0 && !selectedAmbiente) {
        setSelectedAmbiente(lista[0]);
      }
    } catch (err) {
      console.error('Error al cargar ambientes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAmbientes();
  }, [selectedTipo, searchQuery]);

  const handleCrearReserva = async (e) => {
    e.preventDefault();
    if (!reservaForm.motivo.trim() || !reservaForm.id_ambiente) return;

    if (reservaForm.hora_fin <= reservaForm.hora_inicio) {
      setFeedback({ type: 'error', message: 'La hora final debe ser posterior a la hora inicial' });
      return;
    }

    try {
      await api.ambientes.crearReserva({
        ...reservaForm,
        id_ambiente: Number(reservaForm.id_ambiente),
        id_curso: Number(reservaForm.id_curso)
      });
      setShowReservaModal(false);
      setReservaForm({
        id_ambiente: selectedAmbiente?.id_ambiente || '',
        id_curso: '1',
        motivo: '',
        fecha: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        hora_inicio: '08:00',
        hora_fin: '12:00',
        observaciones: ''
      });
      setFeedback({ type: 'success', message: 'Reserva confirmada y reflejada en el Calendario Académico' });
      cargarAmbientes();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error al procesar reserva' });
    }
  };

  const handleCrearAmbiente = async (e) => {
    e.preventDefault();
    if (!ambienteForm.codigo.trim() || !ambienteForm.nombre.trim()) return;

    try {
      await api.ambientes.crear({
        ...ambienteForm,
        capacidad: Number(ambienteForm.capacidad)
      });
      setShowAmbienteModal(false);
      setFeedback({ type: 'success', message: 'Nuevo ambiente registrado en la sede' });
      cargarAmbientes();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error al registrar ambiente' });
    }
  };

  const handleCancelarReserva = async (idReserva) => {
    const motivo = prompt('Ingrese el motivo de la cancelación de la reserva:');
    if (!motivo) return;

    try {
      await api.ambientes.cancelarReserva(idReserva, motivo);
      setFeedback({ type: 'success', message: 'Reserva cancelada y horario liberado' });
      cargarAmbientes();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error al cancelar' });
    }
  };

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'DISPONIBLE':
        return 'bg-[#a0ca92]/20 text-[#a0ca92] border-[#a0ca92]/40';
      case 'OCUPADO':
        return 'bg-[#ee6018]/20 text-[#ee6018] border-[#ee6018]/40';
      case 'EN_MANTENIMIENTO':
        return 'bg-[#facc15]/20 text-[#facc15] border-[#facc15]/40';
      default:
        return 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/40';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn font-sans text-[#eeeeee]">
      
      {/* Banner Principal */}
      <div className="bg-[#1d1a18] p-6 rounded-[10px] border border-[#3d3a39] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-[#101010] text-[#fafafa] font-mono text-[10px] uppercase tracking-wider mb-2 border border-[#3d3a39]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#facc15] animate-pulse"></span>
            <span>MÓDULO 5 // PROGRAMACIÓN Y GESTIÓN DE AMBIENTES</span>
          </div>
          <h2 className="text-2xl font-normal text-[#eeeeee] tracking-tight">
            Ambientes Físicos & Recursos de Formación
          </h2>
          <p className="text-xs text-[#8c8682] mt-0.5">
            Control de disponibilidad, equipamiento tecnológico, detección de colisiones horarias y reservas de laboratorios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user.rol === 'ADMIN' && (
            <button
              onClick={() => setShowAmbienteModal(true)}
              className="px-3.5 py-2 bg-[#101010] hover:bg-[#3d3a39] border border-[#3d3a39] text-[#eeeeee] rounded-[3px] font-mono text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Nuevo Ambiente</span>
            </button>
          )}

          {(user.rol === 'ADMIN' || user.rol === 'INSTRUCTOR') && (
            <button
              onClick={() => {
                setReservaForm({ ...reservaForm, id_ambiente: selectedAmbiente?.id_ambiente || ambientes[0]?.id_ambiente || '' });
                setShowReservaModal(true);
              }}
              className="px-4 py-2 bg-[#ee6018] hover:bg-[#d55212] text-white rounded-[3px] font-mono text-xs font-medium transition-colors flex items-center gap-2"
            >
              <Calendar size={14} />
              <span>Reservar Ambiente</span>
            </button>
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

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter size={14} className="text-[#8c8682]" />
          {TIPOS_AMBIENTE.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTipo(t.id)}
              className={`px-3 py-1 text-xs font-mono rounded-[3px] border transition-colors whitespace-nowrap ${
                selectedTipo === t.id 
                  ? 'bg-[#eeeeee] text-[#101010] border-[#eeeeee] font-medium' 
                  : 'bg-[#101010] text-[#8c8682] border-[#3d3a39] hover:border-[#8c8682]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search size={14} className="absolute left-3 top-2.5 text-[#8c8682]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por código, sede..."
            className="w-full bg-[#101010] border border-[#3d3a39] text-[#eeeeee] text-xs font-mono pl-9 pr-3 py-1.5 rounded-[4px] outline-none focus:border-[#ee6018]"
          />
        </div>
      </div>

      {/* Grid de Ambientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ambientes.map(amb => {
          const isSelected = selectedAmbiente?.id_ambiente === amb.id_ambiente;
          const reservasConfirmadas = amb.reservas?.filter(r => r.estado === 'CONFIRMADA') || [];

          return (
            <div
              key={amb.id_ambiente}
              onClick={() => setSelectedAmbiente(amb)}
              className={`p-5 rounded-[10px] border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected 
                  ? 'bg-[#1d1a18] border-[#ee6018] shadow-md' 
                  : 'bg-[#101010] border-[#3d3a39] hover:border-[#4d4947]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-[3px] bg-[#1d1a18] border border-[#3d3a39] text-[#ee6018]">
                    {amb.codigo}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-[3px] border ${getStatusBadge(amb.estado)}`}>
                    {amb.estado}
                  </span>
                </div>

                <h3 className="text-base font-normal text-[#eeeeee]">{amb.nombre}</h3>
                <p className="text-xs text-[#8c8682] line-clamp-2">{amb.descripcion}</p>
              </div>

              <div className="pt-3 border-t border-[#3d3a39] space-y-2 font-mono text-xs text-[#8c8682]">
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#ee6018]" />
                  <span>{amb.ubicacion}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={13} />
                  <span>Capacidad: <strong className="text-[#eeeeee]">{amb.capacidad} puestos</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-[#a0ca92]" />
                  <span>{reservasConfirmadas.length} reservas programadas</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detalle y Cronograma del Ambiente Seleccionado */}
      {selectedAmbiente && (
        <div className="bg-[#1d1a18] rounded-[10px] border border-[#3d3a39] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-4 border-b border-[#3d3a39]">
            <div>
              <span className="text-[10px] font-mono text-[#ee6018] uppercase">Programación del Ambiente</span>
              <h3 className="text-lg font-normal text-[#eeeeee]">{selectedAmbiente.nombre} ({selectedAmbiente.codigo})</h3>
              <p className="text-xs text-[#8c8682] mt-0.5">Equipamiento: {selectedAmbiente.equipamiento}</p>
            </div>

            {(user.rol === 'ADMIN' || user.rol === 'INSTRUCTOR') && (
              <button
                onClick={() => {
                  setReservaForm({ ...reservaForm, id_ambiente: selectedAmbiente.id_ambiente });
                  setShowReservaModal(true);
                }}
                className="px-3.5 py-1.5 bg-[#ee6018] text-white rounded-[3px] text-xs font-mono self-start sm:self-auto"
              >
                + Reservar en este Ambiente
              </button>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono text-[#8c8682] uppercase tracking-wider">
              Reservas Confirmadas ({selectedAmbiente.reservas?.length || 0})
            </h4>

            {selectedAmbiente.reservas?.length === 0 ? (
              <p className="text-xs text-[#8c8682] font-mono italic">No hay reservas programadas para este ambiente. Horario 100% disponible.</p>
            ) : (
              <div className="space-y-2">
                {selectedAmbiente.reservas?.map(res => (
                  <div key={res.id_reserva} className="p-3 bg-[#101010] rounded-[6px] border border-[#3d3a39] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#eeeeee] font-medium">{res.motivo}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-[3px] ${
                          res.estado === 'CONFIRMADA' ? 'bg-[#a0ca92]/20 text-[#a0ca92]' : 'bg-[#ef4444]/20 text-[#ef4444]'
                        }`}>
                          {res.estado}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8c8682] mt-0.5 font-mono">
                        Fecha: {new Date(res.fecha).toLocaleDateString()} · {res.hora_inicio} - {res.hora_fin} · Ficha: ADSO 3413988
                      </p>
                    </div>

                    {(user.rol === 'ADMIN' || user.rol === 'INSTRUCTOR') && res.estado === 'CONFIRMADA' && (
                      <button
                        onClick={() => handleCancelarReserva(res.id_reserva)}
                        className="px-3 py-1 border border-[#ef4444]/60 text-[#ef4444] hover:bg-[#ef4444]/10 rounded-[3px] font-mono text-[11px]"
                      >
                        Cancelar Reserva
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL CREAR RESERVA */}
      {showReservaModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] max-w-md w-full p-6 space-y-4 relative">
            <button onClick={() => setShowReservaModal(false)} className="absolute top-4 right-4 text-[#8c8682] hover:text-[#eeeeee]"><X size={18} /></button>
            <h3 className="text-base font-normal text-[#eeeeee]">Programar Reserva de Ambiente</h3>
            <p className="text-xs text-[#8c8682]">El servidor validará colisiones horarias antes de confirmar.</p>
            
            <form onSubmit={handleCrearReserva} className="space-y-3 text-xs font-sans">
              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Ambiente Destino</label>
                <select
                  value={reservaForm.id_ambiente}
                  onChange={e => setReservaForm({ ...reservaForm, id_ambiente: e.target.value })}
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                >
                  {ambientes.map(a => (
                    <option key={a.id_ambiente} value={a.id_ambiente}>
                      {a.nombre} ({a.codigo}) — Capacidad: {a.capacidad}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Motivo / Actividad</label>
                <input
                  type="text"
                  required
                  value={reservaForm.motivo}
                  onChange={e => setReservaForm({ ...reservaForm, motivo: e.target.value })}
                  placeholder="Ej: Taller práctico de Node.js y MySQL 8"
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Fecha de la Reserva</label>
                <input
                  type="date"
                  required
                  value={reservaForm.fecha}
                  onChange={e => setReservaForm({ ...reservaForm, fecha: e.target.value })}
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Hora Inicio</label>
                  <input
                    type="time"
                    required
                    value={reservaForm.hora_inicio}
                    onChange={e => setReservaForm({ ...reservaForm, hora_inicio: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Hora Fin</label>
                  <input
                    type="time"
                    required
                    value={reservaForm.hora_fin}
                    onChange={e => setReservaForm({ ...reservaForm, hora_fin: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Observaciones</label>
                <textarea
                  rows="2"
                  value={reservaForm.observaciones}
                  onChange={e => setReservaForm({ ...reservaForm, observaciones: e.target.value })}
                  placeholder="Requerimientos de software, proyector..."
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#3d3a39]">
                <button type="button" onClick={() => setShowReservaModal(false)} className="px-4 py-2 border border-[#3d3a39] text-[#8c8682] rounded-[3px] font-mono">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#ee6018] text-white rounded-[3px] font-mono font-medium">Confirmar Reserva</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREAR AMBIENTE (ADMIN) */}
      {showAmbienteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] max-w-md w-full p-6 space-y-4 relative">
            <button onClick={() => setShowAmbienteModal(false)} className="absolute top-4 right-4 text-[#8c8682] hover:text-[#eeeeee]"><X size={18} /></button>
            <h3 className="text-base font-normal text-[#eeeeee]">Registrar Nuevo Ambiente Físico</h3>
            
            <form onSubmit={handleCrearAmbiente} className="space-y-3 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Código</label>
                  <input
                    type="text"
                    required
                    value={ambienteForm.codigo}
                    onChange={e => setAmbienteForm({ ...ambienteForm, codigo: e.target.value })}
                    placeholder="AMB-303"
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Capacidad</label>
                  <input
                    type="number"
                    required
                    value={ambienteForm.capacidad}
                    onChange={e => setAmbienteForm({ ...ambienteForm, capacidad: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Nombre del Ambiente</label>
                <input
                  type="text"
                  required
                  value={ambienteForm.nombre}
                  onChange={e => setAmbienteForm({ ...ambienteForm, nombre: e.target.value })}
                  placeholder="Laboratorio de Inteligencia Artificial"
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Tipo</label>
                  <select
                    value={ambienteForm.tipo}
                    onChange={e => setAmbienteForm({ ...ambienteForm, tipo: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                  >
                    <option value="SISTEMAS">Sistemas / Cómputo</option>
                    <option value="LABORATORIO">Laboratorio / Redes</option>
                    <option value="AUDITORIO">Auditorio</option>
                    <option value="AULA_TEORICA">Aula Teórica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Ubicación</label>
                  <input
                    type="text"
                    value={ambienteForm.ubicacion}
                    onChange={e => setAmbienteForm({ ...ambienteForm, ubicacion: e.target.value })}
                    placeholder="Bloque B - Piso 2"
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Equipamiento</label>
                <textarea
                  rows="2"
                  value={ambienteForm.equipamiento}
                  onChange={e => setAmbienteForm({ ...ambienteForm, equipamiento: e.target.value })}
                  placeholder="Detalle de estaciones, proyectores..."
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#3d3a39]">
                <button type="button" onClick={() => setShowAmbienteModal(false)} className="px-4 py-2 border border-[#3d3a39] text-[#8c8682] rounded-[3px] font-mono">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#ee6018] text-white rounded-[3px] font-mono font-medium">Registrar Ambiente</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
