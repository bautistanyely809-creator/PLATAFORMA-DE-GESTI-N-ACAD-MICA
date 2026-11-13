import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  RotateCcw, 
  Plus, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  RefreshCw,
  UserCheck,
  Award
} from 'lucide-react';

export default function RecuperacionesModule({ user }) {
  const [loading, setLoading] = useState(true);
  const [recuperaciones, setRecuperaciones] = useState([]);
  const [pendientesRefuerzo, setPendientesRefuerzo] = useState([]);
  const [statusMsg, setStatusMsg] = useState('');

  // Modales
  const [asignarModalOpen, setAsignarModalOpen] = useState(false);
  const [entregarModalOpen, setEntregarModalOpen] = useState(false);
  const [evaluarModalOpen, setEvaluarModalOpen] = useState(false);

  // Selecciones
  const [selectedRecuperacion, setSelectedRecuperacion] = useState(null);
  const [selectedPendiente, setSelectedPendiente] = useState(null);

  // Formularios
  const [asignarForm, setAsignarForm] = useState({
    id_inscripcion: 2,
    id_rap: 3,
    actividad_refuerzo: '',
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_limite: ''
  });

  const [entregarForm, setEntregarForm] = useState({
    archivo_entrega: '',
    comentario_entrega: ''
  });

  const [evaluarForm, setEvaluarForm] = useState({
    calificacion: 4.0,
    observacion: '',
    estado: 'SUPERADA'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      if (user.rol === 'APRENDIZ') {
        const res = await api.recuperaciones.getPorAprendiz(1);
        setRecuperaciones(res);
      } else {
        const res = await api.recuperaciones.getPorFicha(1);
        setRecuperaciones(res.recuperacionesActivas || []);
        setPendientesRefuerzo(res.pendientesPorAsignar || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAsignar = async (e) => {
    e.preventDefault();
    try {
      await api.recuperaciones.asignar({
        ...asignarForm,
        id_instructor: 2
      });
      setStatusMsg('✅ Plan de recuperación asignado exitosamente y notificado al aprendiz.');
      setAsignarModalOpen(false);
      loadData();
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEntregar = async (e) => {
    e.preventDefault();
    try {
      await api.recuperaciones.entregar(selectedRecuperacion.id_recuperacion, entregarForm);
      setStatusMsg('✅ Evidencia de recuperación radicada exitosamente.');
      setEntregarModalOpen(false);
      loadData();
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEvaluar = async (e) => {
    e.preventDefault();
    try {
      await api.recuperaciones.evaluar(selectedRecuperacion.id_recuperacion, {
        calificacion: Number(evaluarForm.calificacion),
        observacion: evaluarForm.observacion,
        estado: evaluarForm.estado
      });
      setStatusMsg(evaluarForm.estado === 'SUPERADA' 
        ? '✅ Recuperación SUPERADA: Competencia acreditada y actualizada a APROBADA en MySQL.' 
        : '✅ Evaluación registrada exitosamente.');
      setEvaluarModalOpen(false);
      loadData();
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn font-sans">
      
      {/* Header Módulo 3 */}
      <div className="bg-[#1d1a18] p-6 rounded-[10px] border border-[#3d3a39] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-[#101010] text-[#fafafa] font-mono text-[10px] uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ee6018] animate-pulse"></span>
            <span>MÓDULO 03 // SISTEMA DE RECUPERACIÓN DE COMPETENCIAS</span>
          </div>
          <h2 className="text-xl font-normal text-[#eeeeee] tracking-tight">
            Planes de Refuerzo Académico y Mejoramiento
          </h2>
          <p className="text-xs text-[#8c8682] mt-0.5">
            Gestión y seguimiento de recuperaciones para aprendices con competencias en refuerzo
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

      {/* Alerta de Aprendices que Requieren Asignación de Refuerzo (para Instructores / Admin) */}
      {(user.rol === 'INSTRUCTOR' || user.rol === 'ADMIN') && pendientesRefuerzo.length > 0 && (
        <div className="bg-[#1d1a18] border border-[#ee6018]/50 p-5 rounded-[10px] space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#ee6018] uppercase tracking-wider">
            <AlertCircle size={15} />
            <span>Aprendices con Competencias en Estado REQUIERE_REFUERZO ({pendientesRefuerzo.length})</span>
          </div>
          <div className="space-y-2">
            {pendientesRefuerzo.map(p => (
              <div key={p.id_seguimiento} className="bg-[#101010] border border-[#3d3a39] p-3 rounded-[4px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div>
                  <span className="text-[#eeeeee] font-medium">{p.inscripcion.aprendiz.usuario.nombre} {p.inscripcion.aprendiz.usuario.apellido}</span>
                  <span className="text-[#8c8682] block text-[11px] font-sans">
                    Competencia: {p.competencia.nombre} ({p.competencia.codigo})
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedPendiente(p);
                    setAsignarForm({
                      ...asignarForm,
                      id_inscripcion: p.id_inscripcion,
                      id_rap: p.competencia.resultados?.[0]?.id_rap || 3
                    });
                    setAsignarModalOpen(true);
                  }}
                  className="px-3 py-1 bg-[#ee6018] hover:bg-[#d85513] text-white rounded-[3px] text-xs font-mono font-medium transition-colors shrink-0"
                >
                  Asignar Plan de Refuerzo
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de Procesos de Recuperación */}
      <div className="space-y-4">
        <h3 className="text-sm font-mono text-[#fafafa] uppercase tracking-wider flex items-center gap-2">
          <RotateCcw size={15} className="text-[#ee6018]" />
          <span>Procesos de Recuperación Registrados en Base de Datos</span>
        </h3>

        {loading ? (
          <div className="p-8 text-center font-mono text-xs text-[#8c8682]">
            <RefreshCw size={18} className="animate-spin mx-auto mb-2 text-[#ee6018]" />
            CARGANDO RECUPERACIONES...
          </div>
        ) : recuperaciones.length === 0 ? (
          <div className="p-8 bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] text-center font-mono text-xs text-[#8c8682]">
            No hay procesos de recuperación activos para el usuario.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {recuperaciones.map(rec => {
              const rap = rec.rap;
              const badgeColor = 
                rec.estado === 'SUPERADA' ? 'border-[#a0ca92]/40 text-[#a0ca92]' :
                rec.estado === 'ENTREGADA' ? 'border-[#3978F6]/40 text-[#3978F6]' :
                'border-[#ee6018]/40 text-[#ee6018]';

              return (
                <div key={rec.id_recuperacion} className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] p-6 hover:border-[#4d4947] transition-colors space-y-4">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#3d3a39]">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-[3px] text-[10px] font-mono bg-[#101010] text-[#fafafa] border border-[#3d3a39]">
                        PROCESO #{rec.id_recuperacion}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-[3px] text-[10px] font-mono bg-[#101010] border ${badgeColor}`}>
                        {rec.estado}
                      </span>
                      {rec.inscripcion?.aprendiz && (
                        <span className="text-xs font-mono text-[#8c8682] hidden md:inline">
                          Aprendiz: <strong className="text-[#eeeeee]">{rec.inscripcion.aprendiz.usuario.nombre} {rec.inscripcion.aprendiz.usuario.apellido}</strong>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#8c8682]">
                        Límite: <strong className="text-[#eeeeee]">{new Date(rec.fecha_limite).toLocaleDateString()}</strong>
                      </span>
                      {user.rol === 'APRENDIZ' && rec.estado !== 'SUPERADA' && (
                        <button
                          onClick={() => { setSelectedRecuperacion(rec); setEntregarModalOpen(true); }}
                          className="px-3 py-1 bg-[#101010] hover:bg-[#1d1a18] text-[#fafafa] border border-[#3d3a39] rounded-[3px] text-xs font-mono flex items-center gap-1.5 transition-colors"
                        >
                          <Upload size={12} className="text-[#ee6018]" />
                          <span>Entregar Trabajo</span>
                        </button>
                      )}
                      {(user.rol === 'INSTRUCTOR' || user.rol === 'ADMIN') && rec.estado !== 'SUPERADA' && (
                        <button
                          onClick={() => { setSelectedRecuperacion(rec); setEvaluarModalOpen(true); }}
                          className="px-3 py-1 bg-[#fafafa] hover:bg-white text-[#101010] rounded-[3px] text-xs font-mono font-medium transition-colors"
                        >
                          Evaluar Plan
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-normal text-[#eeeeee] tracking-tight">
                      Recuperación de Competencia: {rap?.competencia?.nombre}
                    </h4>
                    <p className="text-xs text-[#ee6018] font-mono mt-0.5">
                      Resultado de Aprendizaje: [{rap?.codigo}] {rap?.descripcion}
                    </p>
                    <div className="mt-3 bg-[#101010] border border-[#3d3a39] p-3 rounded-[4px] text-xs font-mono text-[#eeeeee]">
                      <span className="text-[#8c8682] uppercase text-[10px] block mb-1">Actividad Asignada:</span>
                      {rec.actividad_refuerzo}
                    </div>
                  </div>

                  {rec.fecha_entrega && (
                    <div className="bg-[#101010] border border-[#3d3a39] p-3 rounded-[4px] text-xs font-mono space-y-1">
                      <span className="text-[#a0ca92] text-[10px] uppercase block">Evidencia Radicada por el Aprendiz:</span>
                      <p className="text-[#eeeeee]">Archivo: {rec.archivo_entrega}</p>
                      {rec.comentario_entrega && <p className="text-[#8c8682] italic">"{rec.comentario_entrega}"</p>}
                    </div>
                  )}

                  {rec.calificacion && (
                    <div className="pt-2 flex justify-between items-center text-xs font-mono border-t border-[#3d3a39]">
                      <span className="text-[#8c8682]">Nota de Recuperación: <strong className="text-[#a0ca92]">{rec.calificacion} / 5.0</strong></span>
                      <span className="text-[#8c8682] italic">{rec.observacion}</span>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Asignar Plan de Refuerzo */}
      {asignarModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#101010]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] p-6 max-w-lg w-full space-y-4">
            <h4 className="text-base font-normal text-[#eeeeee] tracking-tight">
              Asignar Plan de Refuerzo Académico
            </h4>

            <form onSubmit={handleAsignar} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[#8c8682] mb-1">Descripción de la Actividad de Refuerzo:</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Detalles del taller o evidencia que el aprendiz debe subsanar..."
                  value={asignarForm.actividad_refuerzo}
                  onChange={(e) => setAsignarForm({ ...asignarForm, actividad_refuerzo: e.target.value })}
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8c8682] mb-1">Fecha de Inicio:</label>
                  <input
                    type="date"
                    required
                    value={asignarForm.fecha_inicio}
                    onChange={(e) => setAsignarForm({ ...asignarForm, fecha_inicio: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                  />
                </div>
                <div>
                  <label className="block text-[#8c8682] mb-1">Fecha Límite:</label>
                  <input
                    type="date"
                    required
                    value={asignarForm.fecha_limite}
                    onChange={(e) => setAsignarForm({ ...asignarForm, fecha_limite: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAsignarModalOpen(false)}
                  className="px-3 py-1.5 border border-[#3d3a39] text-[#8c8682] rounded-[3px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#fafafa] text-[#101010] font-medium rounded-[3px]"
                >
                  Asignar y Notificar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Entregar Evidencia de Recuperación */}
      {entregarModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#101010]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] p-6 max-w-lg w-full space-y-4">
            <h4 className="text-base font-normal text-[#eeeeee] tracking-tight">
              Radicar Entrega de Recuperación
            </h4>

            <form onSubmit={handleEntregar} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[#8c8682] mb-1">Nombre o Enlace del Archivo Subsanado:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Taller_Refuerzo_Normalizacion_v1.zip o enlace GitHub"
                  value={entregarForm.archivo_entrega}
                  onChange={(e) => setEntregarForm({ ...entregarForm, archivo_entrega: e.target.value })}
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                />
              </div>

              <div>
                <label className="block text-[#8c8682] mb-1">Comentario para el Instructor:</label>
                <textarea
                  rows="3"
                  placeholder="Explicación de las correcciones implementadas..."
                  value={entregarForm.comentario_entrega}
                  onChange={(e) => setEntregarForm({ ...entregarForm, comentario_entrega: e.target.value })}
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEntregarModalOpen(false)}
                  className="px-3 py-1.5 border border-[#3d3a39] text-[#8c8682] rounded-[3px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#fafafa] text-[#101010] font-medium rounded-[3px]"
                >
                  Radicar Recuperación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Evaluar Recuperación */}
      {evaluarModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#101010]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] p-6 max-w-lg w-full space-y-4">
            <h4 className="text-base font-normal text-[#eeeeee] tracking-tight">
              Evaluar Proceso de Recuperación
            </h4>

            <form onSubmit={handleEvaluar} className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8c8682] mb-1">Calificación (0.0 - 5.0):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5.0"
                    required
                    value={evaluarForm.calificacion}
                    onChange={(e) => setEvaluarForm({ ...evaluarForm, calificacion: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                  />
                </div>
                <div>
                  <label className="block text-[#8c8682] mb-1">Resultado de la Recuperación:</label>
                  <select
                    value={evaluarForm.estado}
                    onChange={(e) => setEvaluarForm({ ...evaluarForm, estado: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                  >
                    <option value="SUPERADA">SUPERADA (Acredita competencia)</option>
                    <option value="PENDIENTE_NUEVA_ACTIVIDAD">PENDIENTE_NUEVA_ACTIVIDAD (Requiere nuevo intento)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#8c8682] mb-1">Observaciones Finales:</label>
                <textarea
                  rows="3"
                  value={evaluarForm.observacion}
                  onChange={(e) => setEvaluarForm({ ...evaluarForm, observacion: e.target.value })}
                  placeholder="Concepto evaluativo y sustentación..."
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEvaluarModalOpen(false)}
                  className="px-3 py-1.5 border border-[#3d3a39] text-[#8c8682] rounded-[3px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#fafafa] text-[#101010] font-medium rounded-[3px]"
                >
                  Registrar Evaluación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
