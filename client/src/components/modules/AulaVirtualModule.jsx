import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  GraduationCap, 
  BookOpen, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Plus, 
  X, 
  MessageSquare, 
  Calendar,
  Layers,
  ChevronRight,
  FolderOpen
} from 'lucide-react';

export default function AulaVirtualModule({ user }) {
  const [aulas, setAulas] = useState([]);
  const [selectedAula, setSelectedAula] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // Modales
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showEntregaModal, setShowEntregaModal] = useState(false);
  const [showEvalModal, setShowEvalModal] = useState(false);

  const [targetUnidadId, setTargetUnidadId] = useState(null);
  const [targetActividad, setTargetActividad] = useState(null);
  const [targetEntrega, setTargetEntrega] = useState(null);

  // Formularios
  const [unitForm, setUnitForm] = useState({ titulo: '', descripcion: '' });
  const [materialForm, setMaterialForm] = useState({ titulo: '', descripcion: '', tipo: 'PDF', url_recurso: '', peso_mb: '2.5' });
  const [activityForm, setActivityForm] = useState({
    titulo: '',
    descripcion: '',
    instrucciones: '',
    fecha_limite: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  });
  const [entregaForm, setEntregaForm] = useState({ archivo_url: '', archivo_nombre: '', comentario: '' });
  const [evalForm, setEvalForm] = useState({ calificacion: '4.5', retroalimentacion: '', estado: 'APROBADA' });

  const cargarAulas = async () => {
    try {
      setLoading(true);
      const data = await api.aula.getAulas({ id_curso: 1 });
      const lista = Array.isArray(data) ? data : [];
      setAulas(lista);
      if (lista.length > 0) {
        setSelectedAula(lista[0]);
      }
    } catch (err) {
      console.error('Error al cargar aulas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAulas();
  }, []);

  const handleCrearUnidad = async (e) => {
    e.preventDefault();
    if (!unitForm.titulo.trim() || !selectedAula) return;

    try {
      await api.aula.crearUnidad(selectedAula.id_aula, unitForm);
      setShowUnitModal(false);
      setUnitForm({ titulo: '', descripcion: '' });
      setFeedback({ type: 'success', message: 'Unidad temática agregada al aula virtual' });
      const updatedAula = await api.aula.getPorId(selectedAula.id_aula);
      setSelectedAula(updatedAula);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error al crear unidad' });
    }
  };

  const handlePublicarMaterial = async (e) => {
    e.preventDefault();
    if (!materialForm.titulo.trim() || !materialForm.url_recurso.trim()) return;

    try {
      await api.aula.publicarMaterial(targetUnidadId, materialForm);
      setShowMaterialModal(false);
      setMaterialForm({ titulo: '', descripcion: '', tipo: 'PDF', url_recurso: '', peso_mb: '2.5' });
      setFeedback({ type: 'success', message: 'Material pedagógico publicado en el aula' });
      const updatedAula = await api.aula.getPorId(selectedAula.id_aula);
      setSelectedAula(updatedAula);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error al publicar material' });
    }
  };

  const handlePublicarActividad = async (e) => {
    e.preventDefault();
    if (!activityForm.titulo.trim()) return;

    try {
      await api.aula.publicarActividad(targetUnidadId, activityForm);
      setShowActivityModal(false);
      setActivityForm({
        titulo: '',
        descripcion: '',
        instrucciones: '',
        fecha_limite: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
      });
      setFeedback({ type: 'success', message: 'Actividad formativa creada y sincronizada en el Calendario Académico' });
      const updatedAula = await api.aula.getPorId(selectedAula.id_aula);
      setSelectedAula(updatedAula);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error al publicar actividad' });
    }
  };

  const handleEntregarActividad = async (e) => {
    e.preventDefault();
    if (!entregaForm.archivo_url.trim()) return;

    try {
      await api.aula.entregarActividad(targetActividad.id_actividad, {
        archivo_url: entregaForm.archivo_url,
        archivo_nombre: entregaForm.archivo_nombre || 'solucion_actividad.pdf',
        comentario: entregaForm.comentario
      });
      setShowEntregaModal(false);
      setEntregaForm({ archivo_url: '', archivo_nombre: '', comentario: '' });
      setFeedback({ type: 'success', message: 'Actividad entregada exitosamente al instructor' });
      const updatedAula = await api.aula.getPorId(selectedAula.id_aula);
      setSelectedAula(updatedAula);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error al entregar' });
    }
  };

  const handleEvaluarEntrega = async (e) => {
    e.preventDefault();
    try {
      await api.aula.evaluarEntrega(targetEntrega.id_entrega_actividad, evalForm);
      setShowEvalModal(false);
      setFeedback({ type: 'success', message: 'Calificación y retroalimentación guardadas' });
      const updatedAula = await api.aula.getPorId(selectedAula.id_aula);
      setSelectedAula(updatedAula);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error al evaluar' });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn font-sans text-[#eeeeee]">
      
      {/* Banner Principal */}
      <div className="bg-[#1d1a18] p-6 rounded-[10px] border border-[#3d3a39] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-[#101010] text-[#fafafa] font-mono text-[10px] uppercase tracking-wider mb-2 border border-[#3d3a39]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse"></span>
            <span>MÓDULO 4 // ENTORNO VIRTUAL DE APRENDIZAJE LMS</span>
          </div>
          <h2 className="text-2xl font-normal text-[#eeeeee] tracking-tight">
            Aula Virtual — Ficha ADSO 3413988
          </h2>
          <p className="text-xs text-[#8c8682] mt-0.5">
            Espacio formativo digital: guías de aprendizaje, recursos multimedia, talleres prácticos y retroalimentación docente.
          </p>
        </div>

        {(user.rol === 'ADMIN' || user.rol === 'INSTRUCTOR') && selectedAula && (
          <button
            onClick={() => setShowUnitModal(true)}
            className="px-4 py-2 bg-[#ee6018] hover:bg-[#d55212] text-white rounded-[3px] font-mono text-xs font-medium transition-colors flex items-center gap-2"
          >
            <Plus size={15} />
            <span>Agregar Unidad Temática</span>
          </button>
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

      {/* Contenido del Aula Virtual */}
      {selectedAula && (
        <div className="space-y-6">
          
          {/* Tarjeta de Presentación del Aula */}
          <div className="bg-[#1d1a18] p-6 rounded-[10px] border border-[#3d3a39] relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#a0ca92] bg-[#101010] px-2 py-0.5 rounded-[3px] border border-[#3d3a39]">
                  {selectedAula.estado} · MODALIDAD HÍBRIDA
                </span>
                <h3 className="text-xl font-normal text-[#eeeeee] mt-2">{selectedAula.nombre}</h3>
                <p className="text-xs text-[#8c8682] mt-1 max-w-2xl leading-relaxed">{selectedAula.descripcion}</p>
                {selectedAula.instructor && (
                  <p className="text-xs font-mono text-[#8c8682] mt-3">
                    Instructor Titular: <strong className="text-[#eeeeee]">{selectedAula.instructor.usuario?.nombre} {selectedAula.instructor.usuario?.apellido}</strong> ({selectedAula.instructor.usuario?.correo})
                  </p>
                )}
              </div>

              <div className="bg-[#101010] p-4 rounded-[6px] border border-[#3d3a39] text-center min-w-[140px]">
                <span className="text-3xl font-mono text-[#38bdf8] font-bold block">{selectedAula.unidades?.length || 0}</span>
                <span className="text-[10px] font-mono text-[#8c8682] uppercase">Unidades Activas</span>
              </div>
            </div>
          </div>

          {/* Listado de Unidades Temáticas */}
          <div className="space-y-6">
            {selectedAula.unidades?.map((unidad, idx) => (
              <div key={unidad.id_unidad} className="bg-[#1d1a18] rounded-[10px] border border-[#3d3a39] p-6 space-y-4">
                
                {/* Cabecera de la Unidad */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-[#3d3a39]">
                  <div>
                    <span className="text-[10px] font-mono text-[#ee6018] uppercase">Sección {unidad.orden || idx + 1}</span>
                    <h4 className="text-base font-normal text-[#eeeeee]">{unidad.titulo}</h4>
                    {unidad.descripcion && <p className="text-xs text-[#8c8682] mt-0.5">{unidad.descripcion}</p>}
                  </div>

                  {(user.rol === 'ADMIN' || user.rol === 'INSTRUCTOR') && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setTargetUnidadId(unidad.id_unidad);
                          setShowMaterialModal(true);
                        }}
                        className="px-3 py-1.5 bg-[#101010] hover:bg-[#3d3a39] border border-[#3d3a39] text-[#eeeeee] rounded-[3px] text-xs font-mono flex items-center gap-1.5"
                      >
                        <Plus size={13} className="text-[#38bdf8]" />
                        <span>Subir Material</span>
                      </button>
                      <button
                        onClick={() => {
                          setTargetUnidadId(unidad.id_unidad);
                          setShowActivityModal(true);
                        }}
                        className="px-3 py-1.5 bg-[#101010] hover:bg-[#3d3a39] border border-[#3d3a39] text-[#eeeeee] rounded-[3px] text-xs font-mono flex items-center gap-1.5"
                      >
                        <Plus size={13} className="text-[#ee6018]" />
                        <span>Crear Actividad</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Subsección: Materiales Pedagógicos */}
                <div className="space-y-2">
                  <h5 className="text-xs font-mono text-[#8c8682] uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen size={13} className="text-[#38bdf8]" />
                    Materiales y Recursos de Aprendizaje ({unidad.materiales?.length || 0})
                  </h5>

                  {unidad.materiales?.length === 0 ? (
                    <p className="text-xs text-[#8c8682] font-mono italic">No hay materiales publicados en esta unidad aún.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {unidad.materiales?.map(mat => (
                        <div key={mat.id_material} className="p-3 bg-[#101010] rounded-[6px] border border-[#3d3a39] flex justify-between items-center text-xs">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-mono text-[#38bdf8] px-1.5 py-0.5 rounded-[2px] bg-[#38bdf8]/10 border border-[#38bdf8]/30">
                              {mat.tipo}
                            </span>
                            <h6 className="text-[#eeeeee] font-medium">{mat.titulo}</h6>
                            <p className="text-[11px] text-[#8c8682]">{mat.descripcion}</p>
                          </div>
                          <a
                            href={mat.url_recurso}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-[#1d1a18] hover:bg-[#3d3a39] border border-[#3d3a39] rounded-[4px] text-[#38bdf8] flex items-center gap-1 font-mono text-[11px]"
                          >
                            <ExternalLink size={13} />
                            <span>Abrir</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subsección: Actividades y Entregas */}
                <div className="space-y-2 pt-2">
                  <h5 className="text-xs font-mono text-[#8c8682] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText size={13} className="text-[#ee6018]" />
                    Actividades y Evidencias Calificables ({unidad.actividades?.length || 0})
                  </h5>

                  {unidad.actividades?.length === 0 ? (
                    <p className="text-xs text-[#8c8682] font-mono italic">No hay actividades asignadas en esta unidad.</p>
                  ) : (
                    <div className="space-y-3">
                      {unidad.actividades?.map(act => (
                        <div key={act.id_actividad} className="p-4 bg-[#101010] rounded-[6px] border border-[#3d3a39] space-y-3">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#ee6018]/20 text-[#ee6018] rounded-[3px]">
                                  ACTIVIDAD FORMATIVA
                                </span>
                                {act.fecha_limite && (
                                  <span className="text-[10px] font-mono text-[#8c8682] flex items-center gap-1">
                                    <Clock size={11} className="text-[#ee6018]" />
                                    Límite: {new Date(act.fecha_limite).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              <h6 className="text-sm font-medium text-[#eeeeee] mt-1">{act.titulo}</h6>
                              <p className="text-xs text-[#8c8682] mt-0.5">{act.descripcion}</p>
                            </div>

                            {user.rol === 'APRENDIZ' && (
                              <button
                                onClick={() => {
                                  setTargetActividad(act);
                                  setShowEntregaModal(true);
                                }}
                                className="px-3.5 py-1.5 bg-[#ee6018] hover:bg-[#d55212] text-white rounded-[3px] text-xs font-mono flex items-center gap-1.5 self-start md:self-auto"
                              >
                                <UploadCloud size={14} />
                                <span>Entregar Solución</span>
                              </button>
                            )}
                          </div>

                          {act.instrucciones && (
                            <div className="p-2.5 bg-[#1d1a18] rounded-[4px] border border-[#3d3a39] text-xs text-[#8c8682]">
                              <strong className="text-[#eeeeee]">Instrucciones:</strong> {act.instrucciones}
                            </div>
                          )}

                          {/* Lista de Entregas recibidas */}
                          {act.entregas && act.entregas.length > 0 && (
                            <div className="pt-2 border-t border-[#3d3a39]/60 space-y-2">
                              <span className="text-[10px] font-mono text-[#8c8682] uppercase block">
                                Entregas Recibidas ({act.entregas.length})
                              </span>
                              {act.entregas.map(ent => (
                                <div key={ent.id_entrega_actividad} className="p-3 bg-[#1d1a18] rounded-[4px] border border-[#3d3a39] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[#eeeeee] font-medium">
                                        {ent.inscripcion?.aprendiz?.usuario ? `${ent.inscripcion.aprendiz.usuario.nombre} ${ent.inscripcion.aprendiz.usuario.apellido}` : 'Aprendiz'}
                                      </span>
                                      <span className="text-[10px] font-mono px-2 py-0.5 bg-[#a0ca92]/20 text-[#a0ca92] rounded-[3px]">
                                        {ent.estado}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-[#8c8682] mt-0.5">{ent.comentario || 'Entrega completada.'}</p>
                                    {ent.retroalimentacion && (
                                      <p className="text-[11px] text-[#a0ca92] mt-1 font-mono">
                                        Nota: {ent.calificacion}/5.0 · Feedback: {ent.retroalimentacion}
                                      </p>
                                    )}
                                  </div>

                                  {(user.rol === 'ADMIN' || user.rol === 'INSTRUCTOR') && (
                                    <button
                                      onClick={() => {
                                        setTargetEntrega(ent);
                                        setShowEvalModal(true);
                                      }}
                                      className="px-3 py-1 bg-[#3d3a39] hover:bg-[#4d4947] text-[#eeeeee] rounded-[3px] text-xs font-mono whitespace-nowrap self-start sm:self-auto"
                                    >
                                      Calificar / Retroalimentar
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL CREAR UNIDAD */}
      {showUnitModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] max-w-md w-full p-6 space-y-4 relative">
            <button onClick={() => setShowUnitModal(false)} className="absolute top-4 right-4 text-[#8c8682] hover:text-[#eeeeee]"><X size={18} /></button>
            <h3 className="text-base font-normal text-[#eeeeee]">Nueva Unidad Temática</h3>
            <form onSubmit={handleCrearUnidad} className="space-y-3 text-xs font-sans">
              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Título de la Unidad</label>
                <input
                  type="text"
                  required
                  value={unitForm.titulo}
                  onChange={e => setUnitForm({ ...unitForm, titulo: e.target.value })}
                  placeholder="Ej: Unidad 3: Pruebas Unitarias y Automatización"
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>
              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Descripción</label>
                <textarea
                  rows="2"
                  value={unitForm.descripcion}
                  onChange={e => setUnitForm({ ...unitForm, descripcion: e.target.value })}
                  placeholder="Alcance temático..."
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-[#3d3a39]">
                <button type="button" onClick={() => setShowUnitModal(false)} className="px-4 py-2 border border-[#3d3a39] text-[#8c8682] rounded-[3px] font-mono">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#ee6018] text-white rounded-[3px] font-mono font-medium">Crear Unidad</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PUBLICAR MATERIAL */}
      {showMaterialModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] max-w-md w-full p-6 space-y-4 relative">
            <button onClick={() => setShowMaterialModal(false)} className="absolute top-4 right-4 text-[#8c8682] hover:text-[#eeeeee]"><X size={18} /></button>
            <h3 className="text-base font-normal text-[#eeeeee]">Publicar Recurso / Material Pedagógico</h3>
            <form onSubmit={handlePublicarMaterial} className="space-y-3 text-xs font-sans">
              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Título del Recurso</label>
                <input
                  type="text"
                  required
                  value={materialForm.titulo}
                  onChange={e => setMaterialForm({ ...materialForm, titulo: e.target.value })}
                  placeholder="Ej: Guía de Aprendizaje 03: Mocking con Jest"
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Tipo de Archivo</label>
                  <select
                    value={materialForm.tipo}
                    onChange={e => setMaterialForm({ ...materialForm, tipo: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                  >
                    <option value="PDF">PDF / Documento</option>
                    <option value="ENLACE">Enlace Web Externo</option>
                    <option value="VIDEO">Video Tutorial</option>
                    <option value="IMAGEN">Diagrama / Imagen</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Peso Estimado (MB)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={materialForm.peso_mb}
                    onChange={e => setMaterialForm({ ...materialForm, peso_mb: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">URL del Recurso o Enlace</label>
                <input
                  type="text"
                  required
                  value={materialForm.url_recurso}
                  onChange={e => setMaterialForm({ ...materialForm, url_recurso: e.target.value })}
                  placeholder="https://edunova.edu.co/docs/guia-03.pdf"
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-[#3d3a39]">
                <button type="button" onClick={() => setShowMaterialModal(false)} className="px-4 py-2 border border-[#3d3a39] text-[#8c8682] rounded-[3px] font-mono">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#ee6018] text-white rounded-[3px] font-mono font-medium">Publicar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREAR ACTIVIDAD */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] max-w-md w-full p-6 space-y-4 relative">
            <button onClick={() => setShowActivityModal(false)} className="absolute top-4 right-4 text-[#8c8682] hover:text-[#eeeeee]"><X size={18} /></button>
            <h3 className="text-base font-normal text-[#eeeeee]">Publicar Actividad Formativa</h3>
            <p className="text-xs text-[#8c8682]">Se creará un recordatorio automático en el Calendario Académico.</p>
            <form onSubmit={handlePublicarActividad} className="space-y-3 text-xs font-sans">
              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Título de la Actividad</label>
                <input
                  type="text"
                  required
                  value={activityForm.titulo}
                  onChange={e => setActivityForm({ ...activityForm, titulo: e.target.value })}
                  placeholder="Ej: Taller 03: Pruebas de Integración con Supertest"
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>
              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Fecha Límite</label>
                <input
                  type="date"
                  required
                  value={activityForm.fecha_limite}
                  onChange={e => setActivityForm({ ...activityForm, fecha_limite: e.target.value })}
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>
              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Instrucciones</label>
                <textarea
                  rows="3"
                  value={activityForm.instrucciones}
                  onChange={e => setActivityForm({ ...activityForm, instrucciones: e.target.value })}
                  placeholder="Detallar entregables esperados..."
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-[#3d3a39]">
                <button type="button" onClick={() => setShowActivityModal(false)} className="px-4 py-2 border border-[#3d3a39] text-[#8c8682] rounded-[3px] font-mono">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#ee6018] text-white rounded-[3px] font-mono font-medium">Publicar Actividad</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ENTREGAR ACTIVIDAD (APRENDIZ) */}
      {showEntregaModal && targetActividad && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] max-w-md w-full p-6 space-y-4 relative">
            <button onClick={() => setShowEntregaModal(false)} className="absolute top-4 right-4 text-[#8c8682] hover:text-[#eeeeee]"><X size={18} /></button>
            <h3 className="text-base font-normal text-[#eeeeee]">Entregar Solución de Actividad</h3>
            <p className="text-xs text-[#8c8682]">{targetActividad.titulo}</p>
            <form onSubmit={handleEntregarActividad} className="space-y-3 text-xs font-sans">
              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Enlace al Archivo / Repositorio</label>
                <input
                  type="text"
                  required
                  value={entregaForm.archivo_url}
                  onChange={e => setEntregaForm({ ...entregaForm, archivo_url: e.target.value })}
                  placeholder="https://github.com/usuario/taller-adso o URL de Drive"
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>
              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Nombre del Archivo</label>
                <input
                  type="text"
                  value={entregaForm.archivo_nombre}
                  onChange={e => setEntregaForm({ ...entregaForm, archivo_nombre: e.target.value })}
                  placeholder="ej: anyely_bautista_taller03.pdf"
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>
              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Comentario para el Instructor</label>
                <textarea
                  rows="2"
                  value={entregaForm.comentario}
                  onChange={e => setEntregaForm({ ...entregaForm, comentario: e.target.value })}
                  placeholder="Observaciones de la entrega..."
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-[#3d3a39]">
                <button type="button" onClick={() => setShowEntregaModal(false)} className="px-4 py-2 border border-[#3d3a39] text-[#8c8682] rounded-[3px] font-mono">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#ee6018] text-white rounded-[3px] font-mono font-medium">Enviar Entrega</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CALIFICAR ENTREGA (INSTRUCTOR) */}
      {showEvalModal && targetEntrega && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] max-w-md w-full p-6 space-y-4 relative">
            <button onClick={() => setShowEvalModal(false)} className="absolute top-4 right-4 text-[#8c8682] hover:text-[#eeeeee]"><X size={18} /></button>
            <h3 className="text-base font-normal text-[#eeeeee]">Evaluar Entrega</h3>
            <form onSubmit={handleEvaluarEntrega} className="space-y-3 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Calificación (0.0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    required
                    value={evalForm.calificacion}
                    onChange={e => setEvalForm({ ...evalForm, calificacion: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Estado</label>
                  <select
                    value={evalForm.estado}
                    onChange={e => setEvalForm({ ...evalForm, estado: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                  >
                    <option value="APROBADA">Aprobada</option>
                    <option value="REQUIERE_CORRECCION">Requiere Corrección</option>
                    <option value="NO_APROBADA">No Aprobada</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[#8c8682] font-mono text-[10px] uppercase mb-1">Retroalimentación Docente</label>
                <textarea
                  rows="3"
                  required
                  value={evalForm.retroalimentacion}
                  onChange={e => setEvalForm({ ...evalForm, retroalimentacion: e.target.value })}
                  placeholder="Aspectos destacados y recomendaciones de mejora..."
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[4px] p-2 text-[#eeeeee] outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-[#3d3a39]">
                <button type="button" onClick={() => setShowEvalModal(false)} className="px-4 py-2 border border-[#3d3a39] text-[#8c8682] rounded-[3px] font-mono">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#ee6018] text-white rounded-[3px] font-mono font-medium">Guardar Evaluación</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

