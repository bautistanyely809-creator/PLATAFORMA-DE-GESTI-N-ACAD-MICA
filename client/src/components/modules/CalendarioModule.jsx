import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  User, 
  BookOpen, 
  Filter, 
  X, 
  AlertCircle,
  CheckCircle2,
  CalendarDays,
  ListFilter
} from 'lucide-react';

const CATEGORIAS = [
  { id: 'TODAS', label: 'Todas las Categorías', color: 'bg-[#8c8682]' },
  { id: 'CLASE', label: 'Sesión Presencial / Clase', color: 'bg-[#a0ca92] text-[#101010]' },
  { id: 'EVALUACION', label: 'Evaluación Técnica', color: 'bg-[#ee6018] text-white' },
  { id: 'ENTREGA', label: 'Fecha Límite Entrega', color: 'bg-[#38bdf8] text-[#101010]' },
  { id: 'INSTITUCIONAL', label: 'Comité Institucional', color: 'bg-[#c084fc] text-[#101010]' },
  { id: 'RESERVA_AMBIENTE', label: 'Reserva de Ambiente', color: 'bg-[#facc15] text-[#101010]' }
];

export default function CalendarioModule({ user }) {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCategoria, setSelectedCategoria] = useState('TODAS');
  const [viewMode, setViewMode] = useState('mes'); // 'mes', 'semana', 'agenda'
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);

  // Formulario nuevo evento
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'CLASE',
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin: new Date().toISOString().split('T')[0],
    hora_inicio: '08:00',
    hora_fin: '12:00',
    ubicacion: 'Laboratorio de Desarrollo 101',
    id_curso: '1'
  });

  const cargarEventos = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategoria !== 'TODAS') {
        params.categoria = selectedCategoria;
      }
      const data = await api.calendario.getEventos(params);
      setEventos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar calendario:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, [selectedCategoria]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleCrearEvento = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) return;

    if (form.fecha_fin < form.fecha_inicio) {
      setActionFeedback({ type: 'error', message: 'La fecha de fin no puede ser anterior a la de inicio' });
      return;
    }

    try {
      await api.calendario.crear({
        ...form,
        id_curso: Number(form.id_curso)
      });
      setShowCreateModal(false);
      setActionFeedback({ type: 'success', message: 'Evento programado exitosamente' });
      cargarEventos();
    } catch (err) {
      setActionFeedback({ type: 'error', message: err.message || 'Error al programar evento' });
    }
  };

  const handleCancelarEvento = async (id) => {
    const motivo = prompt('Ingrese el motivo de la cancelación:');
    if (!motivo) return;

    try {
      await api.calendario.cancelar(id, motivo);
      setSelectedEvento(null);
      setActionFeedback({ type: 'success', message: 'Evento cancelado con trazabilidad' });
      cargarEventos();
    } catch (err) {
      setActionFeedback({ type: 'error', message: err.message || 'Error al cancelar' });
    }
  };

  // Construcción de la matriz mensual del calendario
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const firstDay = new Date(year, month, 1).getDay(); // 0 domingo, 1 lunes...
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (firstDay + 6) % 7; // Ajustar a inicio en lunes

  const calendarDays = [];
  for (let i = 0; i < offset; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(new Date(year, month, d));
  }

  const getEventosDelDia = (dia) => {
    if (!dia) return [];
    const diaStr = dia.toISOString().split('T')[0];
    return eventos.filter(ev => {
      const evDia = new Date(ev.fecha_inicio).toISOString().split('T')[0];
      return evDia === diaStr;
    });
  };

  const getBadgeColor = (cat) => {
    const found = CATEGORIAS.find(c => c.id === cat);
    return found ? found.color : 'bg-[#3d3a39] text-[#eeeeee]';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn font-sans text-[#eeeeee]">
      
      {/* Banner Encabezado */}
      <div className="bg-[#1d1a18] p-6 rounded-[10px] border border-[#3d3a39] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-[#101010] text-[#fafafa] font-mono text-[10px] uppercase tracking-wider mb-2 border border-[#3d3a39]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ee6018] animate-pulse"></span>
            <span>MÓDULO 1 // PLANIFICACIÓN ACADÉMICA CENTRALIZADA</span>
          </div>
          <h2 className="text-2xl font-normal text-[#eeeeee] tracking-tight">
            Calendario Académico Institucional
          </h2>
          <p className="text-xs text-[#8c8682] mt-0.5">
            Sincronización en tiempo real de sesiones de clase, entregas de aula, evaluaciones y reservas de ambientes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {(user.rol === 'ADMIN' || user.rol === 'INSTRUCTOR') && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-[#ee6018] hover:bg-[#d55212] text-white rounded-[3px] font-mono text-xs font-medium transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus size={15} />
              <span>Programar Evento</span>
            </button>
          )}

          <div className="flex bg-[#101010] p-1 rounded-[4px] border border-[#3d3a39]">
            <button
              onClick={() => setViewMode('mes')}
              className={`px-3 py-1 text-xs font-mono rounded-[3px] transition-colors ${viewMode === 'mes' ? 'bg-[#3d3a39] text-white font-bold' : 'text-[#8c8682] hover:text-white'}`}
            >
              Mes
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1 text-xs font-mono rounded-[3px] transition-colors ${viewMode === 'agenda' ? 'bg-[#3d3a39] text-white font-bold' : 'text-[#8c8682] hover:text-white'}`}
            >
              Agenda
            </button>
          </div>
        </div>
      </div>

      {/* Alerta de Feedback */}
      {actionFeedback && (
        <div className={`p-4 rounded-[6px] border flex items-center justify-between font-mono text-xs ${
          actionFeedback.type === 'success' 
            ? 'bg-[#a0ca92]/10 border-[#a0ca92] text-[#a0ca92]' 
            : 'bg-[#ef4444]/10 border-[#ef4444] text-[#ef4444]'
        }`}>
          <span>{actionFeedback.message}</span>
          <button onClick={() => setActionFeedback(null)} className="hover:opacity-75">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Barra de Filtro de Categorías */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <Filter size={14} className="text-[#8c8682] ml-1 flex-shrink-0" />
        {CATEGORIAS.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoria(cat.id)}
            className={`px-3 py-1 rounded-[3px] text-xs font-mono whitespace-nowrap border transition-all ${
              selectedCategoria === cat.id
                ? 'bg-[#eeeeee] text-[#101010] border-[#eeeeee] font-medium'
                : 'bg-[#101010] text-[#8c8682] border-[#3d3a39] hover:border-[#8c8682]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* VISTA MENSUAL */}
      {viewMode === 'mes' && (
        <div className="bg-[#1d1a18] rounded-[10px] border border-[#3d3a39] p-6 space-y-4">
          
          {/* Navegación de mes */}
          <div className="flex items-center justify-between border-b border-[#3d3a39] pb-4">
            <h3 className="text-lg font-normal text-[#eeeeee] capitalize flex items-center gap-2">
              <CalendarDays size={18} className="text-[#ee6018]" />
              {monthName}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 bg-[#101010] hover:bg-[#3d3a39] border border-[#3d3a39] rounded-[3px] text-[#eeeeee] transition-colors"
                title="Mes anterior"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-xs font-mono bg-[#101010] hover:bg-[#3d3a39] border border-[#3d3a39] rounded-[3px] text-[#8c8682] hover:text-white transition-colors"
              >
                Hoy
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 bg-[#101010] hover:bg-[#3d3a39] border border-[#3d3a39] rounded-[3px] text-[#eeeeee] transition-colors"
                title="Mes siguiente"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono text-[#8c8682] pb-1">
            <span>LUN</span>
            <span>MAR</span>
            <span>MIÉ</span>
            <span>JUE</span>
            <span>VIE</span>
            <span className="text-[#ee6018]/80">SÁB</span>
            <span className="text-[#ee6018]/80">DOM</span>
          </div>

          {/* Rejilla de días */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((dia, idx) => {
              if (!dia) {
                return (
                  <div key={`empty-${idx}`} className="h-28 bg-[#101010]/30 rounded-[4px] border border-dashed border-[#3d3a39]/30"></div>
                );
              }

              const diaEventos = getEventosDelDia(dia);
              const isToday = dia.toDateString() === new Date().toDateString();

              return (
                <div
                  key={dia.toISOString()}
                  className={`min-h-[110px] p-2 rounded-[4px] border transition-colors flex flex-col justify-between ${
                    isToday
                      ? 'bg-[#101010] border-[#ee6018] shadow-sm'
                      : 'bg-[#101010]/70 border-[#3d3a39] hover:border-[#4d4947]'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className={`w-5 h-5 flex items-center justify-center rounded-full ${
                      isToday ? 'bg-[#ee6018] text-white font-bold' : 'text-[#8c8682]'
                    }`}>
                      {dia.getDate()}
                    </span>
                    {diaEventos.length > 0 && (
                      <span className="text-[10px] text-[#8c8682]">
                        {diaEventos.length} ev
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mt-1 overflow-y-auto max-h-20 scrollbar-none">
                    {diaEventos.slice(0, 3).map(ev => (
                      <button
                        key={ev.id_evento}
                        onClick={() => setSelectedEvento(ev)}
                        className={`w-full text-left p-1 rounded-[2px] text-[10px] font-sans truncate transition-opacity hover:opacity-80 block ${getBadgeColor(ev.categoria)}`}
                        title={`${ev.titulo} (${ev.hora_inicio || ''})`}
                      >
                        {ev.hora_inicio ? `${ev.hora_inicio} ` : ''}{ev.titulo}
                      </button>
                    ))}
                    {diaEventos.length > 3 && (
                      <p className="text-[9px] text-[#8c8682] text-center">+{diaEventos.length - 3} más</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* VISTA AGENDA */}
      {viewMode === 'agenda' && (
        <div className="bg-[#1d1a18] rounded-[10px] border border-[#3d3a39] p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#3d3a39]">
            <h3 className="text-base font-normal text-[#eeeeee]">Listado Cronológico de Actividades</h3>
            <span className="text-xs font-mono text-[#8c8682]">{eventos.length} eventos registrados</span>
          </div>

          <div className="space-y-3">
            {eventos.map(ev => {
              const fIni = new Date(ev.fecha_inicio);
              return (
                <div
                  key={ev.id_evento}
                  onClick={() => setSelectedEvento(ev)}
                  className="bg-[#101010] p-4 rounded-[6px] border border-[#3d3a39] hover:border-[#4d4947] cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-center bg-[#1d1a18] p-2 rounded-[4px] border border-[#3d3a39] min-w-[65px]">
                      <span className="text-[10px] font-mono text-[#8c8682] uppercase block">
                        {fIni.toLocaleString('es-ES', { month: 'short' })}
                      </span>
                      <span className="text-xl font-mono text-[#eeeeee] font-bold block">
                        {fIni.getDate()}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-[3px] ${getBadgeColor(ev.categoria)}`}>
                          {ev.categoria}
                        </span>
                        {ev.estado === 'CANCELADO' && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-[3px] bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40">
                            CANCELADO
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-medium text-[#eeeeee]">{ev.titulo}</h4>
                      <p className="text-xs text-[#8c8682] mt-0.5">{ev.descripcion}</p>
                    </div>
                  </div>

                  <div className="text-xs font-mono text-[#8c8682] space-y-1 md:text-right">
                    <div className="flex items-center md:justify-end gap-1.5">
                      <Clock size={13} className="text-[#ee6018]" />
                      <span>{ev.hora_inicio || '00:00'} - {ev.hora_fin || '23:59'}</span>
                    </div>
                    {ev.ubicacion && (
                      <div className="flex items-center md:justify-end gap-1.5">
                        <MapPin size={13} />
                        <span>{ev.ubicacion}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL DETALLE DE EVENTO */}
      {selectedEvento && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] max-w-lg w-full p-6 space-y-5 relative">
            <button
              onClick={() => setSelectedEvento(null)}
              className="absolute top-4 right-4 text-[#8c8682] hover:text-[#eeeeee]"
            >
              <X size={18} />
            </button>

            <div className="space-y-2">
              <span className={`text-[10px] font-mono px-2.5 py-1 rounded-[3px] inline-block ${getBadgeColor(selectedEvento.categoria)}`}>
                {selectedEvento.categoria}
              </span>
              <h3 className="text-lg font-normal text-[#eeeeee]">{selectedEvento.titulo}</h3>
              <p className="text-xs text-[#8c8682] leading-relaxed">{selectedEvento.descripcion || 'Sin descripción adicional.'}</p>
            </div>

            <div className="bg-[#101010] p-4 rounded-[6px] border border-[#3d3a39] space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#8c8682]">Fecha:</span>
                <span className="text-[#eeeeee]">{new Date(selectedEvento.fecha_inicio).toLocaleDateString('es-CO')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8c8682]">Horario:</span>
                <span className="text-[#eeeeee]">{selectedEvento.hora_inicio || '--'} - {selectedEvento.hora_fin || '--'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8c8682]">Ubicación:</span>
                <span className="text-[#eeeeee]">{selectedEvento.ubicacion || 'Virtual / EDUNOVA'}</span>
              </div>
              {selectedEvento.curso && (
                <div className="flex justify-between items-center">
                  <span className="text-[#8c8682]">Ficha / Curso:</span>
                  <span className="text-[#a0ca92]">{selectedEvento.curso.nombre}</span>
                </div>
              )}
              {selectedEvento.estado === 'CANCELADO' && (
                <div className="pt-2 border-t border-[#3d3a39] text-[#ef4444]">
                  <span>Motivo cancelación: {selectedEvento.motivo_cancelacion}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {(user.rol === 'ADMIN' || user.rol === 'INSTRUCTOR') && selectedEvento.estado !== 'CANCELADO' && (
                <button
                  onClick={() => handleCancelarEvento(selectedEvento.id_evento)}
                  className="px-4 py-2 border border-[#ef4444]/60 text-[#ef4444] hover:bg-[#ef4444]/10 rounded-[3px] text-xs font-mono transition-colors"
                >
                  Cancelar Evento
                </button>
              )}
              <button
                onClick={() => setSelectedEvento(null)}
                className="px-4 py-2 bg-[#3d3a39] hover:bg-[#4d4947] text-[#eeeeee] rounded-[3px] text-xs font-mono transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR NUEVO EVENTO */}
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
              <h3 className="text-base font-normal text-[#eeeeee]">Programar Nuevo Evento</h3>
              <p className="text-xs text-[#8c8682]">Se notificará automáticamente a los aprendices relacionados.</p>
            </div>

            <form onSubmit={handleCrearEvento} className="space-y-3 font-sans text-xs">
              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Título del Evento</label>
                <input
                  type="text"
                  required
                  value={form.titulo}
                  onChange={e => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ej: Sesión Presencial: Diagramas UML y Casos de Uso"
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] focus:border-[#ee6018] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Descripción / Objetivos</label>
                <textarea
                  rows="2"
                  value={form.descripcion}
                  onChange={e => setForm({ ...form, descripcion: e.target.value })}
                  placeholder="Detalles sobre el contenido o requerimientos de la sesión..."
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] focus:border-[#ee6018] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Categoría</label>
                  <select
                    value={form.categoria}
                    onChange={e => setForm({ ...form, categoria: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] focus:border-[#ee6018] outline-none"
                  >
                    <option value="CLASE">Clase / Sesión</option>
                    <option value="EVALUACION">Evaluación Técnica</option>
                    <option value="ENTREGA">Fecha Límite Entrega</option>
                    <option value="INSTITUCIONAL">Comité / Reunión</option>
                    <option value="RESERVA_AMBIENTE">Reserva Ambiente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Ficha Asignada</label>
                  <select
                    value={form.id_curso}
                    onChange={e => setForm({ ...form, id_curso: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] focus:border-[#ee6018] outline-none"
                  >
                    <option value="1">ADSO Ficha 3413988</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    required
                    value={form.fecha_inicio}
                    onChange={e => setForm({ ...form, fecha_inicio: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] focus:border-[#ee6018] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Fecha Fin</label>
                  <input
                    type="date"
                    required
                    value={form.fecha_fin}
                    onChange={e => setForm({ ...form, fecha_fin: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] focus:border-[#ee6018] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Hora Inicio</label>
                  <input
                    type="time"
                    value={form.hora_inicio}
                    onChange={e => setForm({ ...form, hora_inicio: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] focus:border-[#ee6018] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Hora Fin</label>
                  <input
                    type="time"
                    value={form.hora_fin}
                    onChange={e => setForm({ ...form, hora_fin: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] focus:border-[#ee6018] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Ubicación / Ambiente</label>
                <input
                  type="text"
                  value={form.ubicacion}
                  onChange={e => setForm({ ...form, ubicacion: e.target.value })}
                  placeholder="Ej: Laboratorio de Sistemas 101"
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] focus:border-[#ee6018] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#3d3a39]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-[#3d3a39] hover:bg-[#101010] text-[#8c8682] rounded-[3px] text-xs font-mono"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ee6018] hover:bg-[#d55212] text-white rounded-[3px] text-xs font-mono font-medium"
                >
                  Guardar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
