import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileCheck2, 
  TrendingUp, 
  RefreshCw, 
  Award,
  ChevronRight,
  BookOpen,
  Filter
} from 'lucide-react';

export default function CompetenciasModule({ user }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedSeguimiento, setSelectedSeguimiento] = useState(null);
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [evalForm, setEvalForm] = useState({ estado: 'APROBADA', porcentaje: 100, observaciones: '' });
  const [statusMsg, setStatusMsg] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      // Si es aprendiz consultamos su inscripción (id 1 por defecto para Anyely)
      const res = await api.competencias.getSeguimientoAprendiz(1);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenEval = (seg) => {
    setSelectedSeguimiento(seg);
    setEvalForm({
      estado: seg.estado,
      porcentaje: Number(seg.porcentaje_avance),
      observaciones: seg.observaciones || ''
    });
    setEvalModalOpen(true);
  };

  const handleSaveEval = async (e) => {
    e.preventDefault();
    try {
      await api.competencias.evaluar({
        id_seguimiento: selectedSeguimiento.id_seguimiento,
        estado_nuevo: evalForm.estado,
        porcentaje_avance: Number(evalForm.porcentaje),
        observaciones: evalForm.observaciones
      });
      setStatusMsg('✅ Evaluación registrada exitosamente en MySQL.');
      setEvalModalOpen(false);
      loadData();
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center font-mono text-xs text-[#8c8682]">
        <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-[#ee6018]" />
        CARGANDO SEGUIMIENTO DE COMPETENCIAS DESDE MYSQL 8...
      </div>
    );
  }

  const resumen = data?.resumen || {};
  const seguimientos = data?.seguimientos || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn font-sans">
      
      {/* Header del Módulo 1 */}
      <div className="bg-[#1d1a18] p-6 rounded-[10px] border border-[#3d3a39] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-[#101010] text-[#fafafa] font-mono text-[10px] uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ee6018] animate-pulse"></span>
            <span>MÓDULO 01 // SEGUIMIENTO POR COMPETENCIAS Y RAPS</span>
          </div>
          <h2 className="text-xl font-normal text-[#eeeeee] tracking-tight">
            Progreso Formativo por Competencias Laborales
          </h2>
          <p className="text-xs text-[#8c8682] mt-0.5">
            Programa: Tecnólogo en Análisis y Desarrollo de Software (ADSO) · Ficha 2874102
          </p>
        </div>

        <button 
          onClick={loadData}
          className="px-3 py-1.5 bg-[#101010] hover:bg-[#1d1a18] text-[#eeeeee] border border-[#3d3a39] rounded-[3px] font-mono text-xs flex items-center gap-2 self-start md:self-auto"
        >
          <RefreshCw size={13} />
          <span>Sincronizar BD</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-3 bg-[#101010] border border-[#a0ca92] text-[#a0ca92] text-xs font-mono rounded-[3px]">
          {statusMsg}
        </div>
      )}

      {/* 4 Métricas de Cumplimiento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1d1a18] p-5 rounded-[10px] border border-[#3d3a39]">
          <span className="font-mono text-[10px] uppercase text-[#8c8682]">TOTAL COMPETENCIAS</span>
          <h3 className="text-3xl font-normal text-[#eeeeee] mt-2">{resumen.totalCompetencias}</h3>
          <p className="text-xs font-mono text-[#8c8682] mt-1">Plan curricular SENA</p>
        </div>

        <div className="bg-[#1d1a18] p-5 rounded-[10px] border border-[#3d3a39]">
          <span className="font-mono text-[10px] uppercase text-[#8c8682]">ACREDITADAS / APROBADAS</span>
          <h3 className="text-3xl font-normal text-[#a0ca92] mt-2">{resumen.aprobadas}</h3>
          <p className="text-xs font-mono text-[#a0ca92] mt-1">100% de cumplimiento</p>
        </div>

        <div className="bg-[#1d1a18] p-5 rounded-[10px] border border-[#3d3a39]">
          <span className="font-mono text-[10px] uppercase text-[#8c8682]">EN DESARROLLO</span>
          <h3 className="text-3xl font-normal text-[#ee6018] mt-2">{resumen.enDesarrollo}</h3>
          <p className="text-xs font-mono text-[#8c8682] mt-1">Fase de ejecución activa</p>
        </div>

        <div className="bg-[#1d1a18] p-5 rounded-[10px] border border-[#3d3a39]">
          <span className="font-mono text-[10px] uppercase text-[#8c8682]">AVANCE GLOBAL DEL PLAN</span>
          <h3 className="text-3xl font-normal text-[#fafafa] mt-2">{resumen.porcentajeGlobal}%</h3>
          <div className="w-full bg-[#101010] h-1.5 rounded-full mt-2.5 overflow-hidden border border-[#3d3a39]">
            <div 
              className="bg-[#a0ca92] h-full transition-all duration-500" 
              style={{ width: `${resumen.porcentajeGlobal}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lista Detallada de Competencias */}
      <div className="space-y-4">
        <h3 className="text-sm font-mono text-[#fafafa] uppercase tracking-wider flex items-center gap-2">
          <BookOpen size={15} className="text-[#ee6018]" />
          <span>Matriz Curricular de Competencias y Resultados de Aprendizaje</span>
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {seguimientos.map((s) => {
            const comp = s.competencia;
            const instructorNombre = s.instructor ? `${s.instructor.usuario.nombre} ${s.instructor.usuario.apellido}` : 'Docente Asignado';
            
            const badgeColor = 
              s.estado === 'APROBADA' ? 'border-[#a0ca92]/40 text-[#a0ca92] bg-[#101010]' :
              s.estado === 'REQUIERE_REFUERZO' ? 'border-[#e05252]/40 text-[#e05252] bg-[#101010]' :
              'border-[#ee6018]/40 text-[#ee6018] bg-[#101010]';

            return (
              <div key={s.id_seguimiento} className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] p-6 hover:border-[#4d4947] transition-colors space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#3d3a39]">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded-[3px] text-[10px] font-mono bg-[#101010] text-[#fafafa] border border-[#3d3a39]">
                      {comp.codigo}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-[3px] text-[10px] font-mono border ${badgeColor}`}>
                      {s.estado}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#8c8682]">
                      Avance: <strong className="text-[#eeeeee]">{s.porcentaje_avance}%</strong>
                    </span>
                    {(user.rol === 'INSTRUCTOR' || user.rol === 'ADMIN') && (
                      <button
                        onClick={() => handleOpenEval(s)}
                        className="px-3 py-1 bg-[#fafafa] hover:bg-white text-[#101010] rounded-[3px] text-xs font-mono font-medium transition-colors"
                      >
                        Evaluar / Ajustar
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-normal text-[#eeeeee] tracking-tight">{comp.nombre}</h4>
                  <p className="text-xs text-[#8c8682] mt-1 leading-relaxed">{comp.descripcion}</p>
                </div>

                {/* Resultados de Aprendizaje (RAPs) vinculados */}
                {comp.resultados && comp.resultados.length > 0 && (
                  <div className="bg-[#101010] border border-[#3d3a39] rounded-[4px] p-3 space-y-2">
                    <span className="text-[10px] font-mono text-[#8c8682] uppercase tracking-wider block">
                      Resultados de Aprendizaje (RAP) Vinculados:
                    </span>
                    {comp.resultados.map(r => (
                      <div key={r.id_rap} className="flex items-start gap-2 text-xs font-mono text-[#eeeeee]">
                        <span className="text-[#ee6018] shrink-0">[{r.codigo}]</span>
                        <span className="text-[#8c8682] font-sans">{r.descripcion}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer de Competencia */}
                <div className="pt-2 flex flex-wrap justify-between items-center text-xs font-mono text-[#8c8682] gap-2 border-t border-[#3d3a39]">
                  <span>Instructor Responsable: <strong className="text-[#eeeeee] font-medium">{instructorNombre}</strong></span>
                  {s.fecha_evaluacion && (
                    <span>Evaluado el: {new Date(s.fecha_evaluacion).toLocaleDateString()}</span>
                  )}
                  {s.observaciones && (
                    <span className="italic text-[#8c8682] w-full text-[11px] font-sans">
                      "{s.observaciones}"
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Evaluación para Instructor */}
      {evalModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#101010]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] p-6 max-w-lg w-full space-y-4">
            <h4 className="text-base font-normal text-[#eeeeee] tracking-tight">
              Evaluar Competencia // {selectedSeguimiento?.competencia?.codigo}
            </h4>
            <p className="text-xs text-[#8c8682]">
              {selectedSeguimiento?.competencia?.nombre}
            </p>

            <form onSubmit={handleSaveEval} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[#8c8682] mb-1">Estado de Cumplimiento:</label>
                <select
                  value={evalForm.estado}
                  onChange={(e) => setEvalForm({ ...evalForm, estado: e.target.value })}
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                >
                  <option value="APROBADA">APROBADA (Acreditada)</option>
                  <option value="EN_DESARROLLO">EN_DESARROLLO (En curso)</option>
                  <option value="EN_EVALUACION">EN_EVALUACION (Revisión de evidencias)</option>
                  <option value="REQUIERE_REFUERZO">REQUIERE_REFUERZO (Plan de mejoramiento)</option>
                  <option value="PENDIENTE">PENDIENTE (Sin iniciar)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#8c8682] mb-1">Porcentaje de Avance (%):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={evalForm.porcentaje}
                  onChange={(e) => setEvalForm({ ...evalForm, porcentaje: e.target.value })}
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                />
              </div>

              <div>
                <label className="block text-[#8c8682] mb-1">Observaciones Pedagógicas:</label>
                <textarea
                  rows="3"
                  value={evalForm.observaciones}
                  onChange={(e) => setEvalForm({ ...evalForm, observaciones: e.target.value })}
                  placeholder="Retroalimentación sobre las evidencias y desempeño formativo..."
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEvalModalOpen(false)}
                  className="px-3 py-1.5 border border-[#3d3a39] text-[#8c8682] rounded-[3px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#fafafa] text-[#101010] font-medium rounded-[3px]"
                >
                  Guardar Evaluación en BD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
