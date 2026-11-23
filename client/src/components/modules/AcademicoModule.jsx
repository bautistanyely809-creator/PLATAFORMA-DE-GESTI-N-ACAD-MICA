import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  BookOpen, 
  Layers, 
  UserCheck, 
  GraduationCap, 
  Users, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  FolderPlus, 
  RefreshCw,
  Search,
  Award
} from 'lucide-react';

export default function AcademicoModule({ currentUser }) {
  const [activeTab, setActiveTab] = useState('programas');
  const [loading, setLoading] = useState(true);
  const [programas, setProgramas] = useState([]);
  const [fichas, setFichas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // Notificaciones locales
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  // Estados Formulario Programa (HU-08)
  const [nuevoPrograma, setNuevoPrograma] = useState({
    codigo: '',
    nombre: '',
    version: '1.0',
    nivel: 'TECNOLOGO'
  });

  // Estados Formulario Ficha (HU-09)
  const [nuevaFicha, setNuevaFicha] = useState({
    id_programa: '',
    codigo: '',
    nombre: '',
    fecha_inicio: '',
    fecha_fin: ''
  });

  // Estados Asignación Docente (HU-10)
  const [asignacion, setAsignacion] = useState({
    id_curso: '',
    id_instructor: '',
    rol_docente: 'TITULAR'
  });

  // Estados Matrícula (HU-11)
  const [matricula, setMatricula] = useState({
    id_curso: '',
    id_aprendiz: ''
  });

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [progsData, fichasData, usersData] = await Promise.all([
        api.academico.getProgramas(),
        api.academico.getFichas(),
        api.usuarios.getUsuarios()
      ]);
      setProgramas(progsData || []);
      setFichas(fichasData || []);
      setUsuarios(usersData || []);
    } catch (err) {
      console.error('Error al cargar datos académicos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const instructoresDisponibles = usuarios.filter(u => u.rol === 'INSTRUCTOR' && u.estado === 'ACTIVO');
  const aprendicesDisponibles = usuarios.filter(u => u.rol === 'APRENDIZ' && u.estado === 'ACTIVO');

  // HU-08: Registrar Programa
  const handleCrearPrograma = async (e) => {
    e.preventDefault();
    setMensajeError('');
    setMensajeExito('');

    try {
      const res = await api.academico.crearPrograma(nuevoPrograma);
      setMensajeExito(res.message);
      setNuevoPrograma({ codigo: '', nombre: '', version: '1.0', nivel: 'TECNOLOGO' });
      cargarDatos();
      setTimeout(() => setMensajeExito(''), 4000);
    } catch (err) {
      setMensajeError(err.message || 'Error al registrar programa');
    }
  };

  // HU-09: Aperturar Ficha
  const handleCrearFicha = async (e) => {
    e.preventDefault();
    setMensajeError('');
    setMensajeExito('');

    try {
      const res = await api.academico.crearFicha(nuevaFicha);
      setMensajeExito(res.message);
      setNuevaFicha({ id_programa: '', codigo: '', nombre: '', fecha_inicio: '', fecha_fin: '' });
      cargarDatos();
      setTimeout(() => setMensajeExito(''), 4000);
    } catch (err) {
      setMensajeError(err.message || 'Error al aperturar ficha');
    }
  };

  // HU-10: Asignar Instructor
  const handleAsignarInstructor = async (e) => {
    e.preventDefault();
    setMensajeError('');
    setMensajeExito('');

    if (!asignacion.id_curso || !asignacion.id_instructor) {
      setMensajeError('Debe seleccionar la ficha y el instructor.');
      return;
    }

    try {
      const res = await api.academico.asignarInstructor(asignacion.id_curso, {
        id_instructor: asignacion.id_instructor,
        rol_docente: asignacion.rol_docente
      });
      setMensajeExito(res.message);
      cargarDatos();
      setTimeout(() => setMensajeExito(''), 4000);
    } catch (err) {
      setMensajeError(err.message || 'Error al asignar instructor');
    }
  };

  // HU-11: Matricular Aprendiz
  const handleMatricularAprendiz = async (e) => {
    e.preventDefault();
    setMensajeError('');
    setMensajeExito('');

    if (!matricula.id_curso || !matricula.id_aprendiz) {
      setMensajeError('Debe seleccionar la ficha y el aprendiz.');
      return;
    }

    try {
      const res = await api.academico.matricularAprendiz(matricula.id_curso, {
        id_aprendiz: matricula.id_aprendiz
      });
      setMensajeExito(res.message);
      cargarDatos();
      setTimeout(() => setMensajeExito(''), 4000);
    } catch (err) {
      setMensajeError(err.message || 'Error al matricular aprendiz');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Encabezado */}
      <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#a0ca92] mb-1">
            <Layers size={14} />
            <span>ESTRUCTURA CURRICULAR SENA // GESTIÓN ACADÉMICA</span>
          </div>
          <h2 className="text-2xl font-normal text-[#eeeeee] tracking-tight">
            Gestión Curricular y Fichas de Formación
          </h2>
          <p className="text-xs text-[#8a8380] mt-1">
            Administración de programas curriculares, apertura de fichas, asignación docente y matrículas (HU-08 a HU-11).
          </p>
        </div>

        <button
          onClick={cargarDatos}
          className="p-2 text-[#8a8380] hover:text-[#eeeeee] hover:bg-[#101010] border border-[#3d3a39] rounded-[3px] transition-colors self-start md:self-auto"
          title="Recargar datos académicos"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Alertas */}
      {mensajeExito && (
        <div className="p-3 bg-[#a0ca92]/10 border border-[#a0ca92]/30 text-[#a0ca92] rounded-[3px] text-xs flex items-center gap-2 font-mono">
          <CheckCircle2 size={15} />
          <span>{mensajeExito}</span>
        </div>
      )}

      {mensajeError && (
        <div className="p-3 bg-[#ee6018]/10 border border-[#ee6018]/30 text-[#ee6018] rounded-[3px] text-xs flex items-center gap-2 font-mono">
          <AlertTriangle size={15} />
          <span>{mensajeError}</span>
        </div>
      )}

      {/* Pestañas de Navegación del Módulo */}
      <div className="flex flex-wrap gap-2 border-b border-[#3d3a39] pb-2 font-mono text-xs">
        <button
          onClick={() => setActiveTab('programas')}
          className={`px-3 py-1.5 rounded-[3px] transition-colors flex items-center gap-2 ${
            activeTab === 'programas'
              ? 'bg-[#eeeeee] text-[#101010] font-medium'
              : 'bg-[#101010] text-[#8a8380] hover:text-[#eeeeee] border border-[#3d3a39]'
          }`}
        >
          <BookOpen size={13} />
          <span>HU-08. Programas ({programas.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('fichas')}
          className={`px-3 py-1.5 rounded-[3px] transition-colors flex items-center gap-2 ${
            activeTab === 'fichas'
              ? 'bg-[#eeeeee] text-[#101010] font-medium'
              : 'bg-[#101010] text-[#8a8380] hover:text-[#eeeeee] border border-[#3d3a39]'
          }`}
        >
          <Layers size={13} />
          <span>HU-09. Fichas ({fichas.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('instructores')}
          className={`px-3 py-1.5 rounded-[3px] transition-colors flex items-center gap-2 ${
            activeTab === 'instructores'
              ? 'bg-[#eeeeee] text-[#101010] font-medium'
              : 'bg-[#101010] text-[#8a8380] hover:text-[#eeeeee] border border-[#3d3a39]'
          }`}
        >
          <GraduationCap size={13} />
          <span>HU-10. Asignación Docente</span>
        </button>

        <button
          onClick={() => setActiveTab('matriculas')}
          className={`px-3 py-1.5 rounded-[3px] transition-colors flex items-center gap-2 ${
            activeTab === 'matriculas'
              ? 'bg-[#eeeeee] text-[#101010] font-medium'
              : 'bg-[#101010] text-[#8a8380] hover:text-[#eeeeee] border border-[#3d3a39]'
          }`}
        >
          <UserCheck size={13} />
          <span>HU-11. Matrículas Formales</span>
        </button>
      </div>

      {/* CONTENIDO PESTAÑA 1: PROGRAMAS DE FORMACIÓN (HU-08) */}
      {activeTab === 'programas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Formulario Crear Programa */}
          <div className="lg:col-span-4 bg-[#1d1a18] border border-[#3d3a39] rounded-[8px] p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#3d3a39]">
              <FolderPlus size={15} className="text-[#ee6018]" />
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#eeeeee]">
                Registrar Nuevo Programa (HU-08)
              </h3>
            </div>

            <form onSubmit={handleCrearPrograma} className="space-y-3">
              <div>
                <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Código Oficial SENA *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. ADSO-2026"
                  value={nuevoPrograma.codigo}
                  onChange={(e) => setNuevoPrograma({ ...nuevoPrograma, codigo: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none focus:border-[#eeeeee]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Denominación del Programa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Análisis y Desarrollo de Software"
                  value={nuevoPrograma.nombre}
                  onChange={(e) => setNuevoPrograma({ ...nuevoPrograma, nombre: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none focus:border-[#eeeeee]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Versión</label>
                  <input
                    type="text"
                    value={nuevoPrograma.version}
                    onChange={(e) => setNuevoPrograma({ ...nuevoPrograma, version: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Nivel</label>
                  <select
                    value={nuevoPrograma.nivel}
                    onChange={(e) => setNuevoPrograma({ ...nuevoPrograma, nivel: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none"
                  >
                    <option value="TECNOLOGO">Tecnólogo</option>
                    <option value="TECNICO">Técnico</option>
                    <option value="ESPECIALIZACION">Especialización</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#eeeeee] hover:bg-white text-[#101010] rounded-[3px] font-mono text-xs font-medium uppercase transition-colors"
              >
                Guardar Programa
              </button>
            </form>
          </div>

          {/* Listado de Programas */}
          <div className="lg:col-span-8 bg-[#1d1a18] border border-[#3d3a39] rounded-[8px] overflow-hidden">
            <div className="p-4 border-b border-[#3d3a39] bg-[#101010] flex items-center justify-between">
              <span className="font-mono text-xs text-[#eeeeee] uppercase">
                Catálogo de Oferta Curricular Registrada
              </span>
              <span className="font-mono text-[10px] text-[#8a8380]">
                {programas.length} Programas Activos
              </span>
            </div>

            <div className="divide-y divide-[#3d3a39]">
              {programas.map((p) => (
                <div key={p.id_programa} className="p-4 hover:bg-[#101010]/40 transition-colors flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#ee6018]">{p.codigo}</span>
                      <span className="font-mono text-[10px] text-[#a0ca92] bg-[#a0ca92]/10 border border-[#a0ca92]/30 px-1.5 py-0.2 rounded-[2px]">
                        {p.nivel} · v{p.version}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-[#eeeeee] mt-1">{p.nombre}</h4>
                    <p className="font-mono text-[11px] text-[#8a8380] mt-0.5">
                      {p.cursos?.length || 0} Fichas Vinculadas · {p.competencias?.length || 0} Normas de Competencia
                    </p>
                  </div>

                  <span className="font-mono text-[10px] uppercase px-2 py-0.5 bg-[#a0ca92]/10 text-[#a0ca92] rounded-[3px] border border-[#a0ca92]/30">
                    {p.estado}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO PESTAÑA 2: FICHAS DE CARACTERIZACIÓN (HU-09) */}
      {activeTab === 'fichas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Formulario Crear Ficha */}
          <div className="lg:col-span-4 bg-[#1d1a18] border border-[#3d3a39] rounded-[8px] p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#3d3a39]">
              <Plus size={15} className="text-[#a0ca92]" />
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#eeeeee]">
                Apertura de Ficha de Caracterización (HU-09)
              </h3>
            </div>

            <form onSubmit={handleCrearFicha} className="space-y-3">
              <div>
                <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Programa Vinculado *</label>
                <select
                  required
                  value={nuevaFicha.id_programa}
                  onChange={(e) => setNuevaFicha({ ...nuevaFicha, id_programa: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none"
                >
                  <option value="">Seleccione un programa...</option>
                  {programas.map((p) => (
                    <option key={p.id_programa} value={p.id_programa}>
                      {p.codigo} - {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Número de Ficha Oficial (ID) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 3413988"
                  value={nuevaFicha.codigo}
                  onChange={(e) => setNuevaFicha({ ...nuevaFicha, codigo: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none focus:border-[#eeeeee]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Denominación de la Cohorte *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Ficha ADSO 3413988 - Diurna"
                  value={nuevaFicha.nombre}
                  onChange={(e) => setNuevaFicha({ ...nuevaFicha, nombre: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none focus:border-[#eeeeee]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    value={nuevaFicha.fecha_inicio}
                    onChange={(e) => setNuevaFicha({ ...nuevaFicha, fecha_inicio: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Fecha Fin (Valida fin &gt; inicio)</label>
                  <input
                    type="date"
                    value={nuevaFicha.fecha_fin}
                    onChange={(e) => setNuevaFicha({ ...nuevaFicha, fecha_fin: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#eeeeee] hover:bg-white text-[#101010] rounded-[3px] font-mono text-xs font-medium uppercase transition-colors"
              >
                Aperturar Ficha
              </button>
            </form>
          </div>

          {/* Listado de Fichas */}
          <div className="lg:col-span-8 bg-[#1d1a18] border border-[#3d3a39] rounded-[8px] overflow-hidden">
            <div className="p-4 border-b border-[#3d3a39] bg-[#101010] flex items-center justify-between">
              <span className="font-mono text-xs text-[#eeeeee] uppercase">
                Cohortes y Fichas en Ejecución Formativa
              </span>
              <span className="font-mono text-[10px] text-[#8a8380]">
                {fichas.length} Fichas Registradas
              </span>
            </div>

            <div className="divide-y divide-[#3d3a39]">
              {fichas.map((f) => (
                <div key={f.id_curso} className="p-4 hover:bg-[#101010]/40 transition-colors space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#a0ca92]">FICHA #{f.codigo}</span>
                      <span className="font-mono text-[10px] text-[#8a8380] bg-[#101010] border border-[#3d3a39] px-2 py-0.5 rounded-[2px]">
                        {f.programa?.codigo || 'ADSO'}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] uppercase px-2 py-0.5 bg-[#a0ca92]/10 text-[#a0ca92] rounded-[3px] border border-[#a0ca92]/30">
                      {f.estado}
                    </span>
                  </div>

                  <h4 className="text-sm font-medium text-[#eeeeee]">{f.nombre}</h4>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#8a8380] pt-1">
                    <span className="flex items-center gap-1.5">
                      <Users size={12} className="text-[#a0ca92]" />
                      <span>{f.total_aprendices} Aprendices Matriculados</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <GraduationCap size={12} className="text-[#ee6018]" />
                      <span>{f.total_instructores} Docentes Asignados</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO PESTAÑA 3: ASIGNACIÓN DE INSTRUCTORES (HU-10) */}
      {activeTab === 'instructores' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-[#1d1a18] border border-[#3d3a39] rounded-[8px] p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#3d3a39]">
              <GraduationCap size={16} className="text-[#ee6018]" />
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#eeeeee]">
                Vincular Instructor a Ficha (HU-10)
              </h3>
            </div>

            <form onSubmit={handleAsignarInstructor} className="space-y-3">
              <div>
                <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Ficha de Destino *</label>
                <select
                  required
                  value={asignacion.id_curso}
                  onChange={(e) => setAsignacion({ ...asignacion, id_curso: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none"
                >
                  <option value="">Seleccione una ficha...</option>
                  {fichas.map((f) => (
                    <option key={f.id_curso} value={f.id_curso}>
                      Ficha #{f.codigo} - {f.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Docente / Instructor Disponible *</label>
                <select
                  required
                  value={asignacion.id_instructor}
                  onChange={(e) => setAsignacion({ ...asignacion, id_instructor: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none"
                >
                  <option value="">Seleccione un instructor...</option>
                  {instructoresDisponibles.map((i) => (
                    <option key={i.id_usuario} value={i.instructor?.id_instructor || i.id_usuario}>
                      {i.nombre} {i.apellido} ({i.correo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Rol Docente</label>
                <select
                  value={asignacion.rol_docente}
                  onChange={(e) => setAsignacion({ ...asignacion, rol_docente: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none"
                >
                  <option value="TITULAR">Docente Titular / Líder</option>
                  <option value="TECNICO">Instructor Técnico</option>
                  <option value="TRANSVERSAL">Instructor Transversal</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#eeeeee] hover:bg-white text-[#101010] rounded-[3px] font-mono text-xs font-medium uppercase transition-colors"
              >
                Formalizar Asignación
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-[#1d1a18] border border-[#3d3a39] rounded-[8px] p-5 space-y-4">
            <h4 className="font-mono text-xs uppercase text-[#eeeeee] tracking-wider pb-3 border-b border-[#3d3a39]">
              Asignaciones Docentes por Ficha
            </h4>

            <div className="space-y-3">
              {fichas.map((f) => (
                <div key={f.id_curso} className="p-3 bg-[#101010] border border-[#3d3a39] rounded-[4px] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#eeeeee]">Ficha #{f.codigo}</span>
                    <span className="font-mono text-[10px] text-[#8a8380]">{f.instructores.length} docentes</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {f.instructores.length > 0 ? (
                      f.instructores.map((inst, idx) => (
                        <span key={idx} className="font-mono text-[10px] bg-[#1d1a18] border border-[#3d3a39] px-2 py-0.5 rounded-[2px] text-[#a0ca92]">
                          {inst.nombre} ({inst.rol_docente})
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] font-mono text-[#8a8380]">Sin instructores asignados</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO PESTAÑA 4: MATRÍCULAS FORMALES (HU-11) */}
      {activeTab === 'matriculas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-[#1d1a18] border border-[#3d3a39] rounded-[8px] p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#3d3a39]">
              <UserCheck size={16} className="text-[#a0ca92]" />
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#eeeeee]">
                Matricular Aprendiz en Ficha (HU-11)
              </h3>
            </div>

            <p className="text-xs text-[#8a8380]">
              Control de cupos máximos institucional (35 aprendices) y validación de matrículas no duplicadas.
            </p>

            <form onSubmit={handleMatricularAprendiz} className="space-y-3">
              <div>
                <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Ficha de Caracterización *</label>
                <select
                  required
                  value={matricula.id_curso}
                  onChange={(e) => setMatricula({ ...matricula, id_curso: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none"
                >
                  <option value="">Seleccione una ficha...</option>
                  {fichas.map((f) => (
                    <option key={f.id_curso} value={f.id_curso}>
                      Ficha #{f.codigo} - {f.nombre} ({f.total_aprendices}/35 cupos)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Aprendiz Registrado *</label>
                <select
                  required
                  value={matricula.id_aprendiz}
                  onChange={(e) => setMatricula({ ...matricula, id_aprendiz: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none"
                >
                  <option value="">Seleccione un aprendiz...</option>
                  {aprendicesDisponibles.map((a) => (
                    <option key={a.id_usuario} value={a.aprendiz?.id_aprendiz || a.id_usuario}>
                      {a.nombre} {a.apellido} - Doc: {a.aprendiz?.documento || 'Sin doc'} ({a.correo})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#eeeeee] hover:bg-white text-[#101010] rounded-[3px] font-mono text-xs font-medium uppercase transition-colors"
              >
                Procesar Matrícula Formal
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-[#1d1a18] border border-[#3d3a39] rounded-[8px] p-5 space-y-4">
            <h4 className="font-mono text-xs uppercase text-[#eeeeee] tracking-wider pb-3 border-b border-[#3d3a39]">
              Aprendices Matriculados por Ficha
            </h4>

            <div className="space-y-3">
              {fichas.map((f) => (
                <div key={f.id_curso} className="p-3 bg-[#101010] border border-[#3d3a39] rounded-[4px] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#eeeeee]">Ficha #{f.codigo}</span>
                    <span className="font-mono text-[10px] text-[#a0ca92] bg-[#a0ca92]/10 border border-[#a0ca92]/30 px-2 py-0.5 rounded-[2px]">
                      {f.total_aprendices} / 35 Cupos Utilizados
                    </span>
                  </div>

                  <div className="max-h-40 overflow-y-auto divide-y divide-[#3d3a39]/50">
                    {f.aprendices?.length > 0 ? (
                      f.aprendices.map((ap, idx) => (
                        <div key={idx} className="py-1.5 flex items-center justify-between text-xs">
                          <span className="text-[#eeeeee]">{ap.nombre}</span>
                          <span className="font-mono text-[10px] text-[#8a8380]">Doc: {ap.documento}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] font-mono text-[#8a8380] py-2">Sin aprendices matriculados en esta cohorte.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
