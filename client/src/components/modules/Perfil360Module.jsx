import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  UserCheck, 
  Award, 
  CalendarCheck, 
  ClipboardList, 
  AlertTriangle, 
  FileText, 
  HeartHandshake, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Plus,
  X,
  FileCheck2,
  Users
} from 'lucide-react';

export default function Perfil360Module({ user }) {
  const [perfilData, setPerfilData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('competencias');
  const [aprendicesFicha, setAprendicesFicha] = useState([]);
  const [selectedAprendizId, setSelectedAprendizId] = useState(1);
  const [showAccionModal, setShowAccionModal] = useState(false);
  const [accionForm, setAccionForm] = useState({
    tipo_accion: 'TUTORIA',
    descripcion: '',
    compromiso: ''
  });
  const [feedback, setFeedback] = useState(null);

  const cargarPerfil = async (idAp) => {
    try {
      setLoading(true);
      let data;
      if (user.rol === 'APRENDIZ') {
        data = await api.perfil360.getMiPerfil();
      } else {
        data = await api.perfil360.getPorId(idAp || 1);
      }
      setPerfilData(data);
    } catch (err) {
      console.error('Error al cargar perfil 360:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarListaAprendices = async () => {
    try {
      const lista = await api.perfil360.getAprendicesFicha(1);
      setAprendicesFicha(Array.isArray(lista) ? lista : []);
    } catch (err) {
      console.error('Error al cargar aprendices de ficha:', err);
    }
  };

  useEffect(() => {
    if (user.rol !== 'APRENDIZ') {
      cargarListaAprendices();
    }
    cargarPerfil(selectedAprendizId);
  }, [selectedAprendizId]);

  const handleRegistrarAccion = async (e) => {
    e.preventDefault();
    if (!accionForm.descripcion.trim()) return;

    try {
      await api.perfil360.registrarAccion(selectedAprendizId, accionForm);
      setShowAccionModal(false);
      setAccionForm({ tipo_accion: 'TUTORIA', descripcion: '', compromiso: '' });
      setFeedback({ type: 'success', message: 'Acción de acompañamiento registrada con éxito' });
      cargarPerfil(selectedAprendizId);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error al registrar acción' });
    }
  };

  if (loading && !perfilData) {
    return (
      <div className="p-8 text-center font-mono text-xs text-[#8c8682]">
        <div className="w-6 h-6 border-2 border-[#ee6018] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Compilando expediente académico 360°...
      </div>
    );
  }

  const { perfil, indicadores, secciones } = perfilData || {};

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn font-sans text-[#eeeeee]">
      
      {/* Encabezado y Selector para Instructores / Directores */}
      <div className="bg-[#1d1a18] p-6 rounded-[10px] border border-[#3d3a39] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-[#101010] text-[#fafafa] font-mono text-[10px] uppercase tracking-wider mb-2 border border-[#3d3a39]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a0ca92] animate-pulse"></span>
            <span>MÓDULO 2 // EXPEDIENTE DIGITAL DEL APRENDIZ 360°</span>
          </div>
          <h2 className="text-2xl font-normal text-[#eeeeee] tracking-tight">
            Perfil Académico Integral
          </h2>
          <p className="text-xs text-[#8c8682] mt-0.5">
            Consolidación unificada de competencias, evidencias, asistencia, alertas y trazabilidad formativa.
          </p>
        </div>

        {user.rol !== 'APRENDIZ' && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#8c8682]">Seleccionar Aprendiz:</span>
            <select
              value={selectedAprendizId}
              onChange={e => setSelectedAprendizId(Number(e.target.value))}
              className="bg-[#101010] border border-[#3d3a39] text-[#eeeeee] text-xs font-mono px-3 py-2 rounded-[4px] outline-none focus:border-[#ee6018]"
            >
              {aprendicesFicha.map(ap => (
                <option key={ap.id_aprendiz} value={ap.id_aprendiz}>
                  {ap.nombre} ({ap.documento})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {feedback && (
        <div className={`p-4 rounded-[6px] border flex items-center justify-between font-mono text-xs ${
          feedback.type === 'success' ? 'bg-[#a0ca92]/10 border-[#a0ca92] text-[#a0ca92]' : 'bg-[#ef4444]/10 border-[#ef4444] text-[#ef4444]'
        }`}>
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)}><X size={14} /></button>
        </div>
      )}

      {/* Signature Card: Datos Generales del Aprendiz */}
      {perfil && (
        <div className="bg-[#1d1a18] rounded-[10px] border border-[#3d3a39] p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#3d3a39]">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-[8px] bg-[#101010] border border-[#3d3a39] flex items-center justify-center text-xl font-mono text-[#ee6018] font-bold">
                {perfil.nombre?.charAt(0)}{perfil.apellido?.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-normal text-[#eeeeee]">{perfil.nombre} {perfil.apellido}</h3>
                  <span className="px-2 py-0.5 rounded-[3px] text-[10px] font-mono bg-[#101010] text-[#a0ca92] border border-[#a0ca92]/30">
                    {perfil.estado}
                  </span>
                </div>
                <p className="text-xs text-[#8c8682] font-mono mt-0.5">
                  CC: {perfil.documento} · {perfil.correo}
                </p>
                <p className="text-xs text-[#eeeeee]/90 mt-1">
                  {perfil.programa?.nombre} — <strong className="text-[#ee6018]">Ficha 3413988</strong>
                </p>
              </div>
            </div>

            {(user.rol === 'ADMIN' || user.rol === 'INSTRUCTOR') && (
              <button
                onClick={() => setShowAccionModal(true)}
                className="px-4 py-2 bg-[#101010] hover:bg-[#3d3a39] text-[#fafafa] border border-[#3d3a39] rounded-[3px] font-mono text-xs transition-colors flex items-center gap-2 self-start md:self-auto"
              >
                <Plus size={14} className="text-[#ee6018]" />
                <span>Registrar Acompañamiento</span>
              </button>
            )}
          </div>

          {/* 6 Tarjetas de Indicadores en tiempo real */}
          {indicadores && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
              <div className="bg-[#101010] p-3 rounded-[6px] border border-[#3d3a39]">
                <span className="text-[10px] font-mono text-[#8c8682] uppercase block">Avance Competencias</span>
                <span className="text-2xl font-mono text-[#a0ca92] font-normal block mt-1">
                  {indicadores.porcentajeAvanceCompetencias}%
                </span>
                <span className="text-[10px] font-mono text-[#8c8682]">
                  {indicadores.competenciasAprobadas}/{indicadores.totalCompetencias} Aprobadas
                </span>
              </div>

              <div className="bg-[#101010] p-3 rounded-[6px] border border-[#3d3a39]">
                <span className="text-[10px] font-mono text-[#8c8682] uppercase block">Asistencia Presencial</span>
                <span className="text-2xl font-mono text-[#38bdf8] font-normal block mt-1">
                  {indicadores.porcentajeAsistencia}%
                </span>
                <span className="text-[10px] font-mono text-[#8c8682]">
                  {indicadores.inasistencias} Ausencias
                </span>
              </div>

              <div className="bg-[#101010] p-3 rounded-[6px] border border-[#3d3a39]">
                <span className="text-[10px] font-mono text-[#8c8682] uppercase block">Evidencias Aprobadas</span>
                <span className="text-2xl font-mono text-[#eeeeee] font-normal block mt-1">
                  {indicadores.entregasAprobadas}
                </span>
                <span className="text-[10px] font-mono text-[#8c8682]">
                  de {indicadores.totalEntregas} entregas
                </span>
              </div>

              <div className="bg-[#101010] p-3 rounded-[6px] border border-[#3d3a39]">
                <span className="text-[10px] font-mono text-[#8c8682] uppercase block">Recuperaciones</span>
                <span className={`text-2xl font-mono font-normal block mt-1 ${indicadores.recuperacionesActivas > 0 ? 'text-[#facc15]' : 'text-[#8c8682]'}`}>
                  {indicadores.recuperacionesActivas}
                </span>
                <span className="text-[10px] font-mono text-[#8c8682]">Activas</span>
              </div>

              <div className="bg-[#101010] p-3 rounded-[6px] border border-[#3d3a39]">
                <span className="text-[10px] font-mono text-[#8c8682] uppercase block">Alertas Tempranas</span>
                <span className={`text-2xl font-mono font-normal block mt-1 ${indicadores.alertasActivas > 0 ? 'text-[#ef4444]' : 'text-[#8c8682]'}`}>
                  {indicadores.alertasActivas}
                </span>
                <span className="text-[10px] font-mono text-[#8c8682]">Requieren atención</span>
              </div>

              <div className="bg-[#101010] p-3 rounded-[6px] border border-[#3d3a39]">
                <span className="text-[10px] font-mono text-[#8c8682] uppercase block">Solicitudes Radicadas</span>
                <span className="text-2xl font-mono text-[#c084fc] font-normal block mt-1">
                  {secciones?.solicitudes?.length || 0}
                </span>
                <span className="text-[10px] font-mono text-[#8c8682]">Gestión formal</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pestañas de Navegación del Expediente */}
      <div className="flex border-b border-[#3d3a39] gap-1 overflow-x-auto">
        {[
          { id: 'competencias', label: 'Competencias & RAPs', icon: Award },
          { id: 'evidencias', label: 'Evidencias y Calificaciones', icon: ClipboardList },
          { id: 'asistencia', label: 'Asistencia y Novedades', icon: CalendarCheck },
          { id: 'recuperaciones', label: 'Planes de Recuperación', icon: TrendingUp },
          { id: 'alertas', label: 'Alertas Activas', icon: AlertTriangle },
          { id: 'solicitudes', label: 'Solicitudes', icon: FileText },
          { id: 'acompanamiento', label: 'Acompañamiento Formativo', icon: HeartHandshake }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 text-xs font-mono flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                isActive 
                  ? 'border-[#ee6018] text-[#ee6018] font-medium bg-[#1d1a18]/40' 
                  : 'border-transparent text-[#8c8682] hover:text-[#eeeeee]'
              }`}
            >
              <Icon size={14} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* CONTENIDO DE PESTAÑAS */}
      <div className="bg-[#1d1a18] rounded-[10px] border border-[#3d3a39] p-6">
        
        {/* TAB 1: COMPETENCIAS */}
        {activeTab === 'competencias' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-[#eeeeee]">Matriz de Competencias y Resultados de Aprendizaje</h4>
            <div className="space-y-3">
              {secciones?.competencias?.map(comp => (
                <div key={comp.id_seguimiento} className="p-4 bg-[#101010] rounded-[6px] border border-[#3d3a39] space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-[#ee6018]">{comp.competencia?.codigo}</span>
                      <h5 className="text-sm text-[#eeeeee] font-medium">{comp.competencia?.nombre}</h5>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-[3px] ${
                      comp.estado === 'APROBADA' ? 'bg-[#a0ca92]/20 text-[#a0ca92]' : 'bg-[#ee6018]/20 text-[#ee6018]'
                    }`}>
                      {comp.estado} ({comp.porcentaje_avance}%)
                    </span>
                  </div>
                  <p className="text-xs text-[#8c8682]">{comp.observaciones || 'En proceso regular de formación.'}</p>
                  {comp.instructor && (
                    <span className="text-[10px] font-mono text-[#8c8682] block">
                      Evaluador: {comp.instructor.usuario?.nombre} {comp.instructor.usuario?.apellido}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: EVIDENCIAS */}
        {activeTab === 'evidencias' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-[#eeeeee]">Historial de Entregas y Retroalimentación</h4>
            <div className="space-y-3">
              {secciones?.evidencias?.map(ent => (
                <div key={ent.id_entrega} className="p-4 bg-[#101010] rounded-[6px] border border-[#3d3a39] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-[#38bdf8]">Versión {ent.version}</span>
                    <h5 className="text-sm text-[#eeeeee] font-medium">{ent.evidencia?.nombre}</h5>
                    <p className="text-xs text-[#8c8682] mt-0.5">{ent.comentario_aprendiz || 'Sin comentarios adicionales.'}</p>
                    {ent.retroalimentacion && (
                      <div className="mt-2 p-2 bg-[#1d1a18] rounded-[4px] border border-[#3d3a39] text-xs text-[#a0ca92]">
                        <strong>Retroalimentación:</strong> {ent.retroalimentacion}
                      </div>
                    )}
                  </div>
                  <div className="text-right font-mono text-xs">
                    <span className="text-xl font-bold text-[#a0ca92] block">{ent.calificacion ? `${ent.calificacion}/5.0` : 'Pendiente'}</span>
                    <span className="text-[10px] text-[#8c8682]">{new Date(ent.fecha_entrega).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ASISTENCIA */}
        {activeTab === 'asistencia' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-[#eeeeee]">Registro de Asistencia por Sesión</h4>
            <div className="space-y-2">
              {secciones?.asistencia?.map(reg => (
                <div key={reg.id_registro} className="p-3 bg-[#101010] rounded-[4px] border border-[#3d3a39] flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[#eeeeee] font-medium block">{reg.sesion?.tema || 'Sesión Académica'}</span>
                    <span className="text-[10px] font-mono text-[#8c8682]">Fecha: {new Date(reg.fecha_registro).toLocaleDateString()} · {reg.sesion?.hora_inicio} - {reg.sesion?.hora_fin}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-[3px] font-mono text-[10px] ${
                    reg.estado === 'ASISTIO' ? 'bg-[#a0ca92]/20 text-[#a0ca92]' : 'bg-[#ef4444]/20 text-[#ef4444]'
                  }`}>
                    {reg.estado}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RECUPERACIONES */}
        {activeTab === 'recuperaciones' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-[#eeeeee]">Planes de Mejoramiento y Refuerzo</h4>
            {secciones?.recuperaciones?.length === 0 ? (
              <p className="text-xs text-[#8c8682] font-mono">No registra planes de recuperación activos.</p>
            ) : (
              secciones?.recuperaciones?.map(rec => (
                <div key={rec.id_recuperacion} className="p-4 bg-[#101010] rounded-[6px] border border-[#3d3a39] space-y-2">
                  <div className="flex justify-between items-start">
                    <h5 className="text-sm text-[#eeeeee] font-medium">{rec.actividad_refuerzo}</h5>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#facc15]/20 text-[#facc15] rounded-[3px]">
                      {rec.estado}
                    </span>
                  </div>
                  <p className="text-xs text-[#8c8682]">Fecha límite: {new Date(rec.fecha_limite).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 5: ALERTAS */}
        {activeTab === 'alertas' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-[#eeeeee]">Historial de Alertas Tempranas del Aprendiz</h4>
            {secciones?.alertas?.length === 0 ? (
              <p className="text-xs text-[#a0ca92] font-mono flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Sin alertas registradas. Proceso formativo al día.
              </p>
            ) : (
              secciones?.alertas?.map(al => (
                <div key={al.id_alerta} className="p-4 bg-[#101010] rounded-[6px] border border-[#3d3a39] space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium text-[#eeeeee]">{al.titulo}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-[3px] ${
                      al.prioridad === 'CRITICA' || al.prioridad === 'ALTA' ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-[#facc15]/20 text-[#facc15]'
                    }`}>
                      {al.prioridad} · {al.estado}
                    </span>
                  </div>
                  <p className="text-xs text-[#8c8682]">{al.descripcion}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 6: SOLICITUDES */}
        {activeTab === 'solicitudes' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-[#eeeeee]">Solicitudes Radicadas por el Aprendiz</h4>
            {secciones?.solicitudes?.length === 0 ? (
              <p className="text-xs text-[#8c8682] font-mono">No hay solicitudes radicadas.</p>
            ) : (
              secciones?.solicitudes?.map(sol => (
                <div key={sol.id_solicitud} className="p-4 bg-[#101010] rounded-[6px] border border-[#3d3a39] space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-[#c084fc] block">{sol.radicado}</span>
                      <h5 className="text-xs text-[#eeeeee] font-medium">{sol.asunto}</h5>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#1d1a18] border border-[#3d3a39] text-[#eeeeee] rounded-[3px]">
                      {sol.estado}
                    </span>
                  </div>
                  <p className="text-xs text-[#8c8682]">{sol.descripcion}</p>
                  {sol.respuesta && (
                    <div className="p-2 bg-[#1d1a18] rounded-[4px] border border-[#3d3a39] text-xs text-[#38bdf8]">
                      <strong>Respuesta:</strong> {sol.respuesta}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 7: ACOMPAÑAMIENTO */}
        {activeTab === 'acompanamiento' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-[#eeeeee]">Registro de Tutorías y Acompañamiento Formativo</h4>
              {(user.rol === 'ADMIN' || user.rol === 'INSTRUCTOR') && (
                <button
                  onClick={() => setShowAccionModal(true)}
                  className="px-3 py-1.5 bg-[#ee6018] text-white rounded-[3px] text-xs font-mono flex items-center gap-1.5"
                >
                  <Plus size={13} />
                  <span>Nueva Acción</span>
                </button>
              )}
            </div>

            {secciones?.accionesAcompanamiento?.length === 0 ? (
              <p className="text-xs text-[#8c8682] font-mono">No se han registrado sesiones de acompañamiento aún.</p>
            ) : (
              secciones?.accionesAcompanamiento?.map(acc => (
                <div key={acc.id_accion} className="p-4 bg-[#101010] rounded-[6px] border border-[#3d3a39] space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#ee6018]/20 text-[#ee6018] rounded-[3px]">
                      {acc.tipo_accion}
                    </span>
                    <span className="text-[10px] font-mono text-[#8c8682]">{new Date(acc.fecha).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-[#eeeeee]">{acc.descripcion}</p>
                  {acc.compromiso && (
                    <p className="text-xs text-[#a0ca92] bg-[#1d1a18] p-2 rounded-[4px] border border-[#3d3a39]">
                      <strong>Compromiso:</strong> {acc.compromiso}
                    </p>
                  )}
                  {acc.instructor && (
                    <span className="text-[10px] font-mono text-[#8c8682] block">
                      Docente: {acc.instructor.usuario?.nombre} {acc.instructor.usuario?.apellido}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* MODAL REGISTRAR ACCIÓN DE ACOMPAÑAMIENTO */}
      {showAccionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] max-w-md w-full p-6 space-y-4 relative">
            <button
              onClick={() => setShowAccionModal(false)}
              className="absolute top-4 right-4 text-[#8c8682] hover:text-[#eeeeee]"
            >
              <X size={18} />
            </button>

            <div>
              <h3 className="text-base font-normal text-[#eeeeee]">Registrar Acompañamiento Formativo</h3>
              <p className="text-xs text-[#8c8682]">Tutoría, citación o compromiso para el aprendiz.</p>
            </div>

            <form onSubmit={handleRegistrarAccion} className="space-y-3 text-xs font-sans">
              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Tipo de Acción</label>
                <select
                  value={accionForm.tipo_accion}
                  onChange={e => setAccionForm({ ...accionForm, tipo_accion: e.target.value })}
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                >
                  <option value="TUTORIA">Tutoría Técnica Individual</option>
                  <option value="CITACION">Citación Preventiva</option>
                  <option value="COMPROMISO">Compromiso Académico</option>
                  <option value="REMISION_BIENESTAR">Remisión a Bienestar</option>
                </select>
              </div>

              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Descripción de la Sesión</label>
                <textarea
                  rows="3"
                  required
                  value={accionForm.descripcion}
                  onChange={e => setAccionForm({ ...accionForm, descripcion: e.target.value })}
                  placeholder="Aspectos tratados y observaciones docentes..."
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Compromiso Adquirido</label>
                <textarea
                  rows="2"
                  value={accionForm.compromiso}
                  onChange={e => setAccionForm({ ...accionForm, compromiso: e.target.value })}
                  placeholder="Acción concreta que realizará el aprendiz..."
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#3d3a39]">
                <button
                  type="button"
                  onClick={() => setShowAccionModal(false)}
                  className="px-4 py-2 border border-[#3d3a39] text-[#8c8682] rounded-[3px] text-xs font-mono"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ee6018] text-white rounded-[3px] text-xs font-mono font-medium"
                >
                  Guardar Acompañamiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
