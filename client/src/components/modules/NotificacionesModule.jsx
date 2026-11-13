import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Bell, 
  CheckCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Award, 
  Calendar, 
  RefreshCw,
  ExternalLink,
  Filter
} from 'lucide-react';

export default function NotificacionesModule({ user, onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [notificaciones, setNotificaciones] = useState([]);
  const [totalNoLeidas, setTotalNoLeidas] = useState(0);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.notificaciones.get(user?.id_usuario || 4, filtroCategoria);
      setNotificaciones(res.notificaciones || []);
      setTotalNoLeidas(res.totalNoLeidas || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filtroCategoria]);

  const handleMarcarLeida = async (id) => {
    try {
      await api.notificaciones.marcarLeida(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarcarTodas = async () => {
    try {
      await api.notificaciones.marcarTodas(user?.id_usuario || 4);
      setStatusMsg('✅ Todas las notificaciones fueron marcadas como leídas.');
      loadData();
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const getIconForCategory = (cat) => {
    switch (cat) {
      case 'CALIFICACION': return <CheckCircle2 size={16} className="text-[#a0ca92]" />;
      case 'COMPETENCIA': return <Award size={16} className="text-[#ee6018]" />;
      case 'ASISTENCIA': return <Calendar size={16} className="text-[#3978F6]" />;
      case 'RECUPERACION': return <RefreshCw size={16} className="text-[#e05252]" />;
      case 'EVIDENCIA': return <FileText size={16} className="text-[#fafafa]" />;
      default: return <AlertTriangle size={16} className="text-[#ee6018]" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn font-sans">
      
      {/* Header Módulo 6 */}
      <div className="bg-[#1d1a18] p-6 rounded-[10px] border border-[#3d3a39] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-[#101010] text-[#fafafa] font-mono text-[10px] uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ee6018] animate-pulse"></span>
            <span>MÓDULO 06 // SISTEMA DE NOTIFICACIONES AUTOMÁTICAS</span>
          </div>
          <h2 className="text-xl font-normal text-[#eeeeee] tracking-tight">
            Centro de Eventos y Notificaciones del Sistema
          </h2>
          <p className="text-xs text-[#8c8682] mt-0.5">
            Alertas en tiempo real conectadas a calificaciones, entregas, asistencias y recuperaciones
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {totalNoLeidas > 0 && (
            <button
              onClick={handleMarcarTodas}
              className="px-3.5 py-1.5 bg-[#fafafa] hover:bg-white text-[#101010] rounded-[3px] font-mono text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <CheckCheck size={14} className="text-[#ee6018]" />
              <span>Marcar Todas como Leídas</span>
            </button>
          )}
          <button 
            onClick={loadData}
            className="px-3 py-1.5 bg-[#101010] hover:bg-[#1d1a18] text-[#eeeeee] border border-[#3d3a39] rounded-[3px] font-mono text-xs flex items-center gap-1.5"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3 bg-[#101010] border border-[#a0ca92] text-[#a0ca92] text-xs font-mono rounded-[3px]">
          {statusMsg}
        </div>
      )}

      {/* Filtros por Categoría */}
      <div className="bg-[#1d1a18] p-4 rounded-[10px] border border-[#3d3a39] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-[#8c8682]">
          <Filter size={14} />
          <span>Filtrar:</span>
          {['', 'CALIFICACION', 'COMPETENCIA', 'EVIDENCIA', 'ASISTENCIA', 'RECUPERACION', 'ALERTA'].map(cat => (
            <button
              key={cat}
              onClick={() => setFiltroCategoria(cat)}
              className={`px-2.5 py-1 rounded-[3px] border transition-colors ${
                filtroCategoria === cat 
                  ? 'bg-[#101010] text-[#ee6018] border-[#ee6018]' 
                  : 'bg-transparent text-[#8c8682] border-[#3d3a39] hover:text-[#eeeeee]'
              }`}
            >
              {cat === '' ? 'TODAS' : cat}
            </button>
          ))}
        </div>
        <span className="text-[#8c8682]">{totalNoLeidas} no leídas</span>
      </div>

      {/* Lista de Notificaciones */}
      {loading ? (
        <div className="p-8 text-center font-mono text-xs text-[#8c8682]">
          <RefreshCw size={18} className="animate-spin mx-auto mb-2 text-[#ee6018]" />
          CARGANDO EVENTOS DE NOTIFICACIÓN...
        </div>
      ) : notificaciones.length === 0 ? (
        <div className="p-8 bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] text-center font-mono text-xs text-[#8c8682]">
          No hay notificaciones registradas en esta categoría.
        </div>
      ) : (
        <div className="space-y-3">
          {notificaciones.map(n => (
            <div 
              key={n.id_notificacion}
              className={`p-4 rounded-[8px] border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !n.leida 
                  ? 'bg-[#101010] border-[#ee6018]/60 shadow-sm' 
                  : 'bg-[#1d1a18] border-[#3d3a39]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-[3px] bg-[#101010] border border-[#3d3a39] flex items-center justify-center shrink-0 mt-0.5">
                  {getIconForCategory(n.categoria)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-mono font-medium text-[#eeeeee]">{n.titulo}</h4>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-[2px] bg-[#1d1a18] border border-[#3d3a39] text-[#8c8682]">
                      {n.categoria}
                    </span>
                    {!n.leida && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ee6018]"></span>
                    )}
                  </div>
                  <p className="text-xs text-[#8c8682] mt-1 font-sans leading-relaxed">
                    {n.mensaje}
                  </p>
                  <span className="text-[10px] font-mono text-[#8c8682] block mt-1">
                    {new Date(n.fecha_creacion).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {n.enlace && onNavigate && (
                  <button
                    onClick={() => {
                      const tab = n.enlace.split('tab=')[1] || 'dashboard';
                      onNavigate(tab);
                    }}
                    className="px-2.5 py-1 bg-[#101010] hover:bg-[#1d1a18] text-[#eeeeee] border border-[#3d3a39] rounded-[3px] text-xs font-mono flex items-center gap-1 transition-colors"
                  >
                    <span>Ir al Módulo</span>
                    <ExternalLink size={11} className="text-[#ee6018]" />
                  </button>
                )}

                {!n.leida && (
                  <button
                    onClick={() => handleMarcarLeida(n.id_notificacion)}
                    className="px-2.5 py-1 bg-[#fafafa] hover:bg-white text-[#101010] rounded-[3px] text-xs font-mono font-medium transition-colors"
                  >
                    Marcar Leída
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
