import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  CalendarCheck, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  RefreshCw,
  FileText,
  Save,
  Users
} from 'lucide-react';

export default function AsistenciaModule({ user }) {
  const [loading, setLoading] = useState(true);
  const [sesiones, setSesiones] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [selectedSesionId, setSelectedSesionId] = useState(null);
  const [planilla, setPlanilla] = useState([]);
  const [statusMsg, setStatusMsg] = useState('');

  // Modales
  const [nuevaSesionModal, setNuevaSesionModal] = useState(false);
  const [justificarModal, setJustificarModal] = useState(false);
  const [selectedRegistroId, setSelectedRegistroId] = useState(null);

  // Formularios
  const [sesionForm, setSesionForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    hora_inicio: '07:00',
    hora_fin: '13:00',
    tema: ''
  });

  const [justificarForm, setJustificarForm] = useState({
    motivo: '',
    soporte_url: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [sesRes, statsRes] = await Promise.all([
        api.asistencia.getSesiones(1),
        api.asistencia.getEstadisticas(1)
      ]);
      setSesiones(sesRes);
      setEstadisticas(statsRes);

      if (sesRes.length > 0 && !selectedSesionId) {
        loadPlanilla(sesRes[0].id_sesion);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadPlanilla = async (id_sesion) => {
    try {
      setSelectedSesionId(id_sesion);
      const res = await api.asistencia.getPlanillaSesion(id_sesion);
      setPlanilla(res.planilla || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCrearSesion = async (e) => {
    e.preventDefault();
    try {
      await api.asistencia.crearSesion({
        ...sesionForm,
        id_curso: 1,
        id_instructor: 1
      });
      setStatusMsg('✅ Sesión de formación programada en la base de datos.');
      setNuevaSesionModal(false);
      setSesionForm({ fecha: new Date().toISOString().split('T')[0], hora_inicio: '07:00', hora_fin: '13:00', tema: '' });
      loadData();
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEstadoChange = (id_inscripcion, nuevoEstado) => {
    setPlanilla(prev => prev.map(p => 
      p.id_inscripcion === id_inscripcion ? { ...p, estado: nuevoEstado } : p
    ));
  };

  const handleGuardarPlanilla = async () => {
    try {
      const registros = planilla.map(p => ({
        id_inscripcion: p.id_inscripcion,
        estado: p.estado,
        observacion: p.observacion || ''
      }));

      await api.asistencia.registrar({
        id_sesion: selectedSesionId,
        registros
      });

      setStatusMsg('✅ Planilla de asistencia sincronizada y guardada en MySQL 8.');
      loadData();
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleJustificar = async (e) => {
    e.preventDefault();
    try {
      await api.asistencia.justificar({
        id_registro: selectedRegistroId,
        motivo: justificarForm.motivo,
        soporte_url: justificarForm.soporte_url
      });
      setStatusMsg('✅ Justificación médica o laboral radicada exitosamente.');
      setJustificarModal(false);
      setJustificarForm({ motivo: '', soporte_url: '' });
      loadPlanilla(selectedSesionId);
      loadData();
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  const resumen = estadisticas?.resumenGrupal || {};
  const aprendicesStats = estadisticas?.aprendices || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn font-sans">
      
      {/* Header Módulo 4 */}
      <div className="bg-[#1d1a18] p-6 rounded-[10px] border border-[#3d3a39] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-[#101010] text-[#fafafa] font-mono text-[10px] uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ee6018] animate-pulse"></span>
            <span>MÓDULO 04 // CONTROL DE ASISTENCIA AUTOMATIZADO</span>
          </div>
          <h2 className="text-xl font-normal text-[#eeeeee] tracking-tight">
            Control Biométrico de Asistencia & Detección de Ausencias
          </h2>
          <p className="text-xs text-[#8c8682] mt-0.5">
            Registro por sesión, cálculo acumulado en tiempo real y detección de umbrales institucionales
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {(user.rol === 'INSTRUCTOR' || user.rol === 'ADMIN') && (
            <button
              onClick={() => setNuevaSesionModal(true)}
              className="px-4 py-2 bg-[#fafafa] hover:bg-white text-[#101010] rounded-[3px] font-mono text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Plus size={14} className="text-[#ee6018]" />
              <span>Programar Sesión</span>
            </button>
          )}
          <button 
            onClick={loadData}
            className="px-3 py-2 bg-[#101010] hover:bg-[#1d1a18] text-[#eeeeee] border border-[#3d3a39] rounded-[3px] font-mono text-xs flex items-center gap-1.5"
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

      {/* 4 Indicadores Automatizados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1d1a18] p-5 rounded-[10px] border border-[#3d3a39]">
          <span className="font-mono text-[10px] uppercase text-[#8c8682]">SESIONES REGISTRADAS</span>
          <h3 className="text-3xl font-normal text-[#eeeeee] mt-2">{resumen.totalSesiones || 0}</h3>
          <p className="text-xs font-mono text-[#8c8682] mt-1">Calendario formativo</p>
        </div>

        <div className="bg-[#1d1a18] p-5 rounded-[10px] border border-[#3d3a39]">
          <span className="font-mono text-[10px] uppercase text-[#8c8682]">ASISTENCIA PROMEDIO</span>
          <h3 className="text-3xl font-normal text-[#a0ca92] mt-2">{resumen.promedioAsistenciaGrupal || 0}%</h3>
          <p className="text-xs font-mono text-[#a0ca92] mt-1">Ficha ADSO 2874102</p>
        </div>

        <div className="bg-[#1d1a18] p-5 rounded-[10px] border border-[#3d3a39]">
          <span className="font-mono text-[10px] uppercase text-[#8c8682]">APRENDICES EN SEGUIMIENTO</span>
          <h3 className="text-3xl font-normal text-[#ee6018] mt-2">{resumen.aprendicesEnRiesgo || 0}</h3>
          <p className="text-xs font-mono text-[#ee6018] mt-1">Asistencia &lt; 85% o ausencias</p>
        </div>

        <div className="bg-[#1d1a18] p-5 rounded-[10px] border border-[#3d3a39]">
          <span className="font-mono text-[10px] uppercase text-[#8c8682]">APRENDICES ACTIVOS</span>
          <h3 className="text-3xl font-normal text-[#fafafa] mt-2">{resumen.aprendicesActivos || 0}</h3>
          <p className="text-xs font-mono text-[#8c8682] mt-1">Ficha matriculada</p>
        </div>
      </div>

      {/* Selector de Sesiones y Planilla */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Columna Izquierda: Sesiones */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-mono text-[#fafafa] uppercase tracking-wider block">
            Sesiones de Formación:
          </span>
          <div className="space-y-2">
            {sesiones.map(s => (
              <div 
                key={s.id_sesion}
                onClick={() => loadPlanilla(s.id_sesion)}
                className={`p-3.5 rounded-[6px] border cursor-pointer transition-all ${
                  selectedSesionId === s.id_sesion 
                    ? 'bg-[#101010] border-[#ee6018] shadow-sm' 
                    : 'bg-[#1d1a18] border-[#3d3a39] hover:border-[#4d4947]'
                }`}
              >
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#ee6018]">{new Date(s.fecha).toLocaleDateString()}</span>
                  <span className="text-[#8c8682]">{s.hora_inicio} - {s.hora_fin}</span>
                </div>
                <h5 className="text-xs text-[#eeeeee] font-medium mt-1 truncate">{s.tema}</h5>
                <span className="text-[10px] font-mono text-[#8c8682] block mt-1">
                  Instructor: {s.instructor?.usuario?.nombre} {s.instructor?.usuario?.apellido}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Columna Derecha: Planilla de Toma de Lista */}
        <div className="lg:col-span-8 bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#3d3a39]">
            <div>
              <h4 className="text-sm font-normal text-[#eeeeee] tracking-tight">Planilla de Asistencia de la Sesión</h4>
              <p className="text-[11px] font-mono text-[#8c8682]">
                Sesión seleccionada: #{selectedSesionId} · Validación sin registros duplicados
              </p>
            </div>
            
            {(user.rol === 'INSTRUCTOR' || user.rol === 'ADMIN') && (
              <button
                onClick={handleGuardarPlanilla}
                className="px-4 py-1.5 bg-[#fafafa] hover:bg-white text-[#101010] rounded-[3px] text-xs font-mono font-medium flex items-center gap-1.5 transition-colors"
              >
                <Save size={13} className="text-[#ee6018]" />
                <span>Guardar Asistencia</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#101010] text-[#8c8682] uppercase text-[10px] border-b border-[#3d3a39]">
                <tr>
                  <th className="p-3">Aprendiz</th>
                  <th className="p-3">Documento</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Justificación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3d3a39]">
                {planilla.map(p => (
                  <tr key={p.id_inscripcion} className="hover:bg-[#101010]/40 transition-colors">
                    <td className="p-3 text-[#eeeeee] font-sans font-medium">{p.nombre}</td>
                    <td className="p-3 text-[#8c8682]">{p.documento}</td>
                    <td className="p-3">
                      {user.rol === 'INSTRUCTOR' || user.rol === 'ADMIN' ? (
                        <select
                          value={p.estado}
                          onChange={(e) => handleEstadoChange(p.id_inscripcion, e.target.value)}
                          className="bg-[#101010] border border-[#3d3a39] text-[#eeeeee] rounded-[3px] px-2 py-1 text-xs"
                        >
                          <option value="ASISTIO">ASISTIÓ</option>
                          <option value="AUSENTE">AUSENTE</option>
                          <option value="RETARDO">RETARDO</option>
                          <option value="JUSTIFICADA">JUSTIFICADA</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-0.5 rounded-[2px] text-[10px] ${
                          p.estado === 'ASISTIO' ? 'text-[#a0ca92] bg-[#a0ca92]/10' :
                          p.estado === 'AUSENTE' ? 'text-[#e05252] bg-[#e05252]/10' :
                          p.estado === 'RETARDO' ? 'text-[#ee6018] bg-[#ee6018]/10' :
                          'text-[#3978F6] bg-[#3978F6]/10'
                        }`}>
                          {p.estado}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {p.justificacion ? (
                        <span className="text-[10px] text-[#a0ca92]">✓ Radicada ({p.justificacion.estado})</span>
                      ) : p.estado === 'AUSENTE' && p.id_registro ? (
                        <button
                          onClick={() => { setSelectedRegistroId(p.id_registro); setJustificarModal(true); }}
                          className="text-[10px] text-[#ee6018] underline hover:text-[#fafafa]"
                        >
                          Radicar Excusa
                        </button>
                      ) : (
                        <span className="text-[#8c8682] text-[10px]">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Tabla Automatizada: Informe de Aprendices en Riesgo y Ausencias Consecutivas */}
      <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] p-6 space-y-4">
        <h4 className="text-sm font-mono text-[#fafafa] uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle size={15} className="text-[#ee6018]" />
          <span>Monitor de Ausencias Consecutivas y Umbral de Asistencia (Regla &lt; 85%)</span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#101010] text-[#8c8682] uppercase text-[10px] border-b border-[#3d3a39]">
              <tr>
                <th className="p-3">Aprendiz</th>
                <th className="p-3">Sesiones Válidas</th>
                <th className="p-3">Retardos</th>
                <th className="p-3">Ausencias</th>
                <th className="p-3">% Acumulado</th>
                <th className="p-3">Consecutivas</th>
                <th className="p-3">Diagnóstico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3d3a39]">
              {aprendicesStats.map(a => (
                <tr key={a.id_inscripcion} className="hover:bg-[#101010]/40 transition-colors">
                  <td className="p-3 text-[#eeeeee] font-sans font-medium">{a.aprendiz}</td>
                  <td className="p-3 text-[#a0ca92]">{a.asistenciasValidas} / {a.totalSesiones}</td>
                  <td className="p-3 text-[#ee6018]">{a.retardos}</td>
                  <td className="p-3 text-[#e05252]">{a.ausencias}</td>
                  <td className="p-3 font-bold text-[#fafafa]">{a.porcentajeAsistencia}%</td>
                  <td className="p-3 text-[#8c8682]">{a.maxAusenciasConsecutivas}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-[2px] text-[10px] ${
                      a.alertaSeguimiento 
                        ? 'bg-[#e05252]/10 text-[#e05252] border border-[#e05252]/30' 
                        : 'bg-[#a0ca92]/10 text-[#a0ca92] border border-[#a0ca92]/30'
                    }`}>
                      {a.motivoAlerta}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Programar Nueva Sesión */}
      {nuevaSesionModal && (
        <div className="fixed inset-0 z-50 bg-[#101010]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] p-6 max-w-lg w-full space-y-4">
            <h4 className="text-base font-normal text-[#eeeeee] tracking-tight">Programar Sesión de Formación</h4>

            <form onSubmit={handleCrearSesion} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[#8c8682] mb-1">Fecha de la Sesión:</label>
                <input
                  type="date"
                  required
                  value={sesionForm.fecha}
                  onChange={(e) => setSesionForm({ ...sesionForm, fecha: e.target.value })}
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8c8682] mb-1">Hora Inicio:</label>
                  <input
                    type="time"
                    value={sesionForm.hora_inicio}
                    onChange={(e) => setSesionForm({ ...sesionForm, hora_inicio: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                  />
                </div>
                <div>
                  <label className="block text-[#8c8682] mb-1">Hora Fin:</label>
                  <input
                    type="time"
                    value={sesionForm.hora_fin}
                    onChange={(e) => setSesionForm({ ...sesionForm, hora_fin: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8c8682] mb-1">Tema / Actividad de la Sesión:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Normalización a 3FN y creación de triggers"
                  value={sesionForm.tema}
                  onChange={(e) => setSesionForm({ ...sesionForm, tema: e.target.value })}
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNuevaSesionModal(false)}
                  className="px-3 py-1.5 border border-[#3d3a39] text-[#8c8682] rounded-[3px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#fafafa] text-[#101010] font-medium rounded-[3px]"
                >
                  Crear Sesión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Radicar Justificación */}
      {justificarModal && (
        <div className="fixed inset-0 z-50 bg-[#101010]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] p-6 max-w-lg w-full space-y-4">
            <h4 className="text-base font-normal text-[#eeeeee] tracking-tight">Radicar Justificación de Inasistencia</h4>

            <form onSubmit={handleJustificar} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[#8c8682] mb-1">Motivo de la Falta:</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Incapacidad médica EPS, cita prioritaria, fuerza mayor..."
                  value={justificarForm.motivo}
                  onChange={(e) => setJustificarForm({ ...justificarForm, motivo: e.target.value })}
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                />
              </div>

              <div>
                <label className="block text-[#8c8682] mb-1">Enlace o Soporte Digital:</label>
                <input
                  type="text"
                  placeholder="URL del certificado médico o constancia..."
                  value={justificarForm.soporte_url}
                  onChange={(e) => setJustificarForm({ ...justificarForm, soporte_url: e.target.value })}
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setJustificarModal(false)}
                  className="px-3 py-1.5 border border-[#3d3a39] text-[#8c8682] rounded-[3px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#fafafa] text-[#101010] font-medium rounded-[3px]"
                >
                  Radicar Excusa en BD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
