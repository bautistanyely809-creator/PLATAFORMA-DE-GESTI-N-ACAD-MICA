import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Plus, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter, 
  RefreshCw,
  Send,
  Eye,
  Check
} from 'lucide-react';

export default function EvidenciasModule({ user }) {
  const [loading, setLoading] = useState(true);
  const [evidencias, setEvidencias] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  // Modales
  const [crearModalOpen, setCrearModalOpen] = useState(false);
  const [entregarModalOpen, setEntregarModalOpen] = useState(false);
  const [calificarModalOpen, setCalificarModalOpen] = useState(false);

  // Estados seleccionados
  const [selectedEvidencia, setSelectedEvidencia] = useState(null);
  const [selectedEntrega, setSelectedEntrega] = useState(null);

  // Formularios
  const [crearForm, setCrearForm] = useState({
    nombre: '',
    descripcion: '',
    instrucciones: '',
    porcentaje: 30,
    fecha_limite: '',
    id_rap: 1
  });

  const [entregarForm, setEntregarForm] = useState({
    archivo_nombre: '',
    comentario_aprendiz: ''
  });

  const [calificarForm, setCalificarForm] = useState({
    calificacion: 4.5,
    retroalimentacion: '',
    estado: 'APROBADA'
  });

  const loadEvidencias = async () => {
    try {
      setLoading(true);
      const res = await api.evidencias.getPorCurso(1, filtroEstado);
      setEvidencias(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvidencias();
  }, [filtroEstado]);

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      await api.evidencias.crear({
        id_curso: 1,
        id_rap: Number(crearForm.id_rap),
        nombre: crearForm.nombre,
        descripcion: crearForm.descripcion,
        instrucciones: crearForm.instrucciones,
        porcentaje: Number(crearForm.porcentaje),
        fecha_limite: crearForm.fecha_limite || null,
        estado: 'PUBLICADA'
      });
      setStatusMsg('✅ Evidencia creada y publicada exitosamente en MySQL.');
      setCrearModalOpen(false);
      setCrearForm({ nombre: '', descripcion: '', instrucciones: '', porcentaje: 30, fecha_limite: '', id_rap: 1 });
      loadEvidencias();
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEntregar = async (e) => {
    e.preventDefault();
    try {
      await api.evidencias.entregar(selectedEvidencia.id_evidencia, {
        id_inscripcion: 1, // Inscripción de Anyely Valeria
        archivo_nombre: entregarForm.archivo_nombre || 'Evidencia_Radicada.zip',
        archivo_url: `/uploads/evidencias/${entregarForm.archivo_nombre || 'evidencia.zip'}`,
        comentario_aprendiz: entregarForm.comentario_aprendiz
      });
      setStatusMsg('✅ Evidencia entregada exitosamente (nueva versión registrada en MySQL).');
      setEntregarModalOpen(false);
      setEntregarForm({ archivo_nombre: '', comentario_aprendiz: '' });
      loadEvidencias();
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCalificar = async (e) => {
    e.preventDefault();
    try {
      await api.evidencias.calificar(selectedEntrega.id_entrega, {
        calificacion: Number(calificarForm.calificacion),
        retroalimentacion: calificarForm.retroalimentacion,
        estado: calificarForm.estado
      });
      setStatusMsg('✅ Calificación registrada y sincronizada con el libro de calificaciones.');
      setCalificarModalOpen(false);
      loadEvidencias();
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn font-sans">
      
      {/* Header Módulo 2 */}
      <div className="bg-[#1d1a18] p-6 rounded-[10px] border border-[#3d3a39] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-[#101010] text-[#fafafa] font-mono text-[10px] uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ee6018] animate-pulse"></span>
            <span>MÓDULO 02 // GESTIÓN DE EVIDENCIAS Y ENTREGAS VERSIONADAS</span>
          </div>
          <h2 className="text-xl font-normal text-[#eeeeee] tracking-tight">
            Catálogo y Flujo de Evidencias Formativas
          </h2>
          <p className="text-xs text-[#8c8682] mt-0.5">
            Publicación, radicación de archivos con control de versiones y evaluación pedagógica
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {(user.rol === 'INSTRUCTOR' || user.rol === 'ADMIN') && (
            <button
              onClick={() => setCrearModalOpen(true)}
              className="px-4 py-2 bg-[#fafafa] hover:bg-white text-[#101010] rounded-[3px] font-mono text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Plus size={14} className="text-[#ee6018]" />
              <span>Publicar Evidencia</span>
            </button>
          )}
          <button 
            onClick={loadEvidencias}
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

      {/* Barra de Filtros */}
      <div className="bg-[#1d1a18] p-4 rounded-[10px] border border-[#3d3a39] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-[#8c8682]">
          <Filter size={14} />
          <span>Filtrar por Estado:</span>
          {['', 'PUBLICADA', 'ENTREGADA', 'APROBADA', 'REQUIERE_CORRECCION'].map(st => (
            <button
              key={st}
              onClick={() => setFiltroEstado(st)}
              className={`px-2.5 py-1 rounded-[3px] border transition-colors ${
                filtroEstado === st 
                  ? 'bg-[#101010] text-[#ee6018] border-[#ee6018]' 
                  : 'bg-transparent text-[#8c8682] border-[#3d3a39] hover:text-[#eeeeee]'
              }`}
            >
              {st === '' ? 'TODAS' : st}
            </button>
          ))}
        </div>
        <span className="text-[#8c8682]">{evidencias.length} evidencias encontradas</span>
      </div>

      {/* Lista de Evidencias */}
      {loading ? (
        <div className="p-8 text-center font-mono text-xs text-[#8c8682]">
          <RefreshCw size={18} className="animate-spin mx-auto mb-2 text-[#ee6018]" />
          CARGANDO EVIDENCIAS Y ENTREGAS VERSIONADAS...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {evidencias.map((ev) => {
            const rap = ev.rap;
            const tieneEntregas = ev.entregas && ev.entregas.length > 0;
            const ultimaEntrega = tieneEntregas ? ev.entregas[0] : null;

            return (
              <div key={ev.id_evidencia} className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] p-6 hover:border-[#4d4947] transition-colors space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#3d3a39]">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-[3px] text-[10px] font-mono bg-[#101010] text-[#fafafa] border border-[#3d3a39]">
                      EVIDENCIA #{ev.id_evidencia}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-[3px] text-[10px] font-mono bg-[#101010] text-[#a0ca92] border border-[#a0ca92]/40">
                      PONDERACIÓN: {ev.porcentaje}%
                    </span>
                    {rap && (
                      <span className="px-2 py-0.5 text-[10px] font-mono text-[#8c8682] hidden md:inline">
                        RAP: [{rap.codigo}]
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#8c8682]">
                      Límite: <strong className="text-[#eeeeee]">{ev.fecha_limite ? new Date(ev.fecha_limite).toLocaleDateString() : 'Abierta'}</strong>
                    </span>
                    {user.rol === 'APRENDIZ' && (
                      <button
                        onClick={() => { setSelectedEvidencia(ev); setEntregarModalOpen(true); }}
                        className="px-3 py-1 bg-[#101010] hover:bg-[#1d1a18] text-[#fafafa] border border-[#3d3a39] rounded-[3px] text-xs font-mono flex items-center gap-1.5 transition-colors"
                      >
                        <Upload size={12} className="text-[#ee6018]" />
                        <span>Entregar Versión</span>
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-normal text-[#eeeeee] tracking-tight">{ev.nombre}</h4>
                  <p className="text-xs text-[#8c8682] mt-1 leading-relaxed">{ev.descripcion}</p>
                  {ev.instrucciones && (
                    <div className="mt-2 text-xs font-mono text-[#8c8682] bg-[#101010] p-2.5 rounded-[3px] border border-[#3d3a39]">
                      <strong className="text-[#fafafa]">Instrucciones: </strong>{ev.instrucciones}
                    </div>
                  )}
                </div>

                {/* Sub-sección: Historial de Entregas y Versiones */}
                {tieneEntregas && (
                  <div className="space-y-2 pt-2 border-t border-[#3d3a39]">
                    <span className="text-[10px] font-mono text-[#8c8682] uppercase tracking-wider block">
                      Entregas y Versiones Registradas ({ev.entregas.length}):
                    </span>
                    <div className="space-y-2">
                      {ev.entregas.map(ent => (
                        <div key={ent.id_entrega} className="bg-[#101010] border border-[#3d3a39] p-3 rounded-[4px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[#ee6018] font-bold">v{ent.version}</span>
                              <span className="text-[#eeeeee] font-medium">{ent.archivo_nombre}</span>
                              <span className={`px-2 py-0.2 rounded-[2px] text-[9px] ${
                                ent.estado === 'APROBADA' ? 'text-[#a0ca92] bg-[#a0ca92]/10' :
                                ent.estado === 'REQUIERE_CORRECCION' ? 'text-[#e05252] bg-[#e05252]/10' :
                                'text-[#ee6018] bg-[#ee6018]/10'
                              }`}>
                                {ent.estado}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#8c8682] mt-0.5 font-sans">
                              {ent.comentario_aprendiz || 'Sin notas del aprendiz'} · Fecha: {new Date(ent.fecha_entrega).toLocaleString()}
                            </p>
                            {ent.retroalimentacion && (
                              <p className="text-[11px] text-[#a0ca92] mt-1 font-sans">
                                💬 <em>Docente:</em> {ent.retroalimentacion} (Nota: {ent.calificacion})
                              </p>
                            )}
                          </div>

                          {(user.rol === 'INSTRUCTOR' || user.rol === 'ADMIN') && (
                            <button
                              onClick={() => { setSelectedEntrega(ent); setCalificarModalOpen(true); }}
                              className="px-3 py-1 bg-[#fafafa] hover:bg-white text-[#101010] rounded-[3px] text-[11px] font-medium transition-colors shrink-0"
                            >
                              Calificar / Retroalimentar
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Publicar Nueva Evidencia */}
      {crearModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#101010]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] p-6 max-w-lg w-full space-y-4">
            <h4 className="text-base font-normal text-[#eeeeee] tracking-tight">Publicar Nueva Evidencia</h4>
            
            <form onSubmit={handleCrear} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[#8c8682] mb-1">Nombre de la Evidencia:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Consumo de APIs RESTful con JWT"
                  value={crearForm.nombre}
                  onChange={(e) => setCrearForm({ ...crearForm, nombre: e.target.value })}
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                />
              </div>

              <div>
                <label className="block text-[#8c8682] mb-1">Descripción:</label>
                <textarea
                  rows="2"
                  value={crearForm.descripcion}
                  onChange={(e) => setCrearForm({ ...crearForm, descripcion: e.target.value })}
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                />
              </div>

              <div>
                <label className="block text-[#8c8682] mb-1">Instrucciones de Entrega:</label>
                <textarea
                  rows="2"
                  placeholder="Formato requerido, enlace de repositorio o requisitos..."
                  value={crearForm.instrucciones}
                  onChange={(e) => setCrearForm({ ...crearForm, instrucciones: e.target.value })}
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8c8682] mb-1">Ponderación (%):</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={crearForm.porcentaje}
                    onChange={(e) => setCrearForm({ ...crearForm, porcentaje: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                  />
                </div>
                <div>
                  <label className="block text-[#8c8682] mb-1">Fecha Límite:</label>
                  <input
                    type="date"
                    value={crearForm.fecha_limite}
                    onChange={(e) => setCrearForm({ ...crearForm, fecha_limite: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCrearModalOpen(false)}
                  className="px-3 py-1.5 border border-[#3d3a39] text-[#8c8682] rounded-[3px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#fafafa] text-[#101010] font-medium rounded-[3px]"
                >
                  Guardar y Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Entregar Evidencia */}
      {entregarModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#101010]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] p-6 max-w-lg w-full space-y-4">
            <h4 className="text-base font-normal text-[#eeeeee] tracking-tight">
              Radicar Entrega // {selectedEvidencia?.nombre}
            </h4>

            <form onSubmit={handleEntregar} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[#8c8682] mb-1">Nombre o Enlace del Archivo:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Proyecto_ADSO_Evidencia3.zip o https://github.com/..."
                  value={entregarForm.archivo_nombre}
                  onChange={(e) => setEntregarForm({ ...entregarForm, archivo_nombre: e.target.value })}
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                />
              </div>

              <div>
                <label className="block text-[#8c8682] mb-1">Comentario para el Instructor:</label>
                <textarea
                  rows="3"
                  placeholder="Detalles sobre la solución entregada..."
                  value={entregarForm.comentario_aprendiz}
                  onChange={(e) => setEntregarForm({ ...entregarForm, comentario_aprendiz: e.target.value })}
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
                  Radicar Entrega
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Calificar Entrega */}
      {calificarModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#101010]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] p-6 max-w-lg w-full space-y-4">
            <h4 className="text-base font-normal text-[#eeeeee] tracking-tight">
              Calificar Entrega v{selectedEntrega?.version}
            </h4>

            <form onSubmit={handleCalificar} className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8c8682] mb-1">Calificación (0.0 - 5.0):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5.0"
                    required
                    value={calificarForm.calificacion}
                    onChange={(e) => setCalificarForm({ ...calificarForm, calificacion: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                  />
                </div>
                <div>
                  <label className="block text-[#8c8682] mb-1">Estado de la Entrega:</label>
                  <select
                    value={calificarForm.estado}
                    onChange={(e) => setCalificarForm({ ...calificarForm, estado: e.target.value })}
                    className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                  >
                    <option value="APROBADA">APROBADA (Acreditada)</option>
                    <option value="REQUIERE_CORRECCION">REQUIERE_CORRECCION (Ajustar y nueva versión)</option>
                    <option value="NO_APROBADA">NO_APROBADA (Deficiente)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#8c8682] mb-1">Retroalimentación Formativa:</label>
                <textarea
                  rows="3"
                  placeholder="Aspectos sobresalientes y sugerencias de mejora..."
                  value={calificarForm.retroalimentacion}
                  onChange={(e) => setCalificarForm({ ...calificarForm, retroalimentacion: e.target.value })}
                  className="w-full bg-[#101010] border border-[#3d3a39] rounded-[3px] p-2 text-[#eeeeee]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCalificarModalOpen(false)}
                  className="px-3 py-1.5 border border-[#3d3a39] text-[#8c8682] rounded-[3px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#fafafa] text-[#101010] font-medium rounded-[3px]"
                >
                  Registrar Nota en MySQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
