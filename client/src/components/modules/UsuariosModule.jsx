import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  GraduationCap, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Mail, 
  Phone, 
  FileText, 
  RefreshCw,
  Power
} from 'lucide-react';

export default function UsuariosModule({ currentUser }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroRol, setFiltroRol] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busqueda, setBusqueda] = useState('');
  
  // Modal de Creación (HU-06)
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    rol: 'APRENDIZ',
    password: '',
    documento: '',
    telefono: '',
    especialidad: 'Análisis y Desarrollo de Software'
  });
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  // Modal de Confirmación de Suspensión (HU-07)
  const [usuarioAConmutar, setUsuarioAConmutar] = useState(null);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const data = await api.usuarios.getUsuarios({
        rol: filtroRol,
        estado: filtroEstado,
        busqueda
      });
      setUsuarios(data);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, [filtroRol, filtroEstado, busqueda]);

  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    setMensajeError('');
    setMensajeExito('');

    if (!nuevoUsuario.nombre || !nuevoUsuario.apellido || !nuevoUsuario.correo || !nuevoUsuario.password) {
      setMensajeError('Todos los campos obligatorios deben ser diligenciados.');
      return;
    }

    if (nuevoUsuario.password.length < 6) {
      setMensajeError('La contraseña debe contener al menos 6 caracteres.');
      return;
    }

    try {
      const res = await api.usuarios.crearUsuario(nuevoUsuario);
      setMensajeExito(res.message || 'Cuenta creada exitosamente.');
      setNuevoUsuario({
        nombre: '',
        apellido: '',
        correo: '',
        rol: 'APRENDIZ',
        password: '',
        documento: '',
        telefono: '',
        especialidad: 'Análisis y Desarrollo de Software'
      });
      setTimeout(() => {
        setModalCrearAbierto(false);
        setMensajeExito('');
        cargarUsuarios();
      }, 1200);
    } catch (err) {
      setMensajeError(err.message || 'Error al crear la cuenta institucional.');
    }
  };

  const handleConmutarEstado = async () => {
    if (!usuarioAConmutar) return;
    setMensajeError('');
    setMensajeExito('');

    const nuevoEstado = usuarioAConmutar.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';

    try {
      const res = await api.usuarios.cambiarEstado(usuarioAConmutar.id_usuario, nuevoEstado);
      setMensajeExito(res.message);
      setUsuarioAConmutar(null);
      cargarUsuarios();
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (err) {
      setMensajeError(err.message || 'Error al cambiar estado.');
      setUsuarioAConmutar(null);
      setTimeout(() => setMensajeError(''), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Encabezado del Módulo */}
      <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#a0ca92] mb-1">
            <Users size={14} />
            <span>DIRECTORIO INSTITUCIONAL // ROLES Y ACCESOS</span>
          </div>
          <h2 className="text-2xl font-normal text-[#eeeeee] tracking-tight">
            Gestión Institucional de Usuarios
          </h2>
          <p className="text-xs text-[#8a8380] mt-1">
            Control centralizado de cuentas, roles RBAC y estados de permanencia institucional (HU-06 y HU-07).
          </p>
        </div>

        {currentUser?.rol === 'ADMIN' && (
          <button
            onClick={() => setModalCrearAbierto(true)}
            className="px-4 py-2.5 bg-[#eeeeee] hover:bg-white text-[#101010] rounded-[3px] text-xs font-mono uppercase font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <UserPlus size={14} className="text-[#ee6018]" />
            <span>Crear Nueva Cuenta</span>
          </button>
        )}
      </div>

      {/* Mensajes de Alerta */}
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

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[6px] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8380]" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o correo..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] placeholder:text-[#8a8380] focus:outline-none focus:border-[#eeeeee]"
            />
          </div>

          <select
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
            className="bg-[#101010] border border-[#3d3a39] rounded-[3px] px-3 py-1.5 text-xs text-[#eeeeee] focus:outline-none"
          >
            <option value="">Todos los Roles</option>
            <option value="ADMIN">Administrador</option>
            <option value="INSTRUCTOR">Instructor</option>
            <option value="APRENDIZ">Aprendiz</option>
          </select>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="bg-[#101010] border border-[#3d3a39] rounded-[3px] px-3 py-1.5 text-xs text-[#eeeeee] focus:outline-none"
          >
            <option value="">Todos los Estados</option>
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </select>
        </div>

        <button
          onClick={cargarUsuarios}
          className="p-1.5 text-[#8a8380] hover:text-[#eeeeee] hover:bg-[#101010] border border-[#3d3a39] rounded-[3px] transition-colors"
          title="Recargar directorio"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[8px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101010] font-mono text-[10px] uppercase text-[#8a8380] border-b border-[#3d3a39]">
              <tr>
                <th className="px-4 py-3">Usuario / Identidad</th>
                <th className="px-4 py-3">Rol Institucional</th>
                <th className="px-4 py-3">Documento & Contacto</th>
                <th className="px-4 py-3">Ficha / Asignación</th>
                <th className="px-4 py-3">Estado</th>
                {currentUser?.rol === 'ADMIN' && <th className="px-4 py-3 text-right">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3d3a39]">
              {usuarios.length > 0 ? (
                usuarios.map((u) => {
                  const doc = u.aprendiz?.documento || u.instructor?.documento || 'Sin asignar';
                  const tel = u.aprendiz?.telefono || u.instructor?.telefono || 'N/A';
                  const cursoNombre = u.aprendiz?.inscripciones?.[0]?.curso?.nombre || 
                                     u.instructor?.cursos?.[0]?.curso?.nombre || 'General';

                  return (
                    <tr key={u.id_usuario} className="hover:bg-[#101010]/40 transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="text-xs text-[#eeeeee] font-medium">{u.nombre} {u.apellido}</p>
                        <p className="font-mono text-[11px] text-[#8a8380]">{u.correo}</p>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase px-2 py-0.5 rounded-[3px] border ${
                          u.rol === 'ADMIN' 
                            ? 'bg-[#ee6018]/10 text-[#ee6018] border-[#ee6018]/30' 
                            : u.rol === 'INSTRUCTOR' 
                            ? 'bg-[#a0ca92]/10 text-[#a0ca92] border-[#a0ca92]/30'
                            : 'bg-[#eeeeee]/10 text-[#eeeeee] border-[#3d3a39]'
                        }`}>
                          {u.rol === 'ADMIN' && <ShieldCheck size={11} />}
                          {u.rol === 'INSTRUCTOR' && <GraduationCap size={11} />}
                          {u.rol === 'APRENDIZ' && <Users size={11} />}
                          <span>{u.rol}</span>
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-[11px] text-[#8a8380]">
                        <p className="text-[#eeeeee]">{doc}</p>
                        <p className="text-[10px]">{tel}</p>
                      </td>

                      <td className="px-4 py-3.5 text-xs text-[#8a8380] truncate max-w-xs">
                        {cursoNombre}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded-[3px] ${
                          u.estado === 'ACTIVO'
                            ? 'bg-[#a0ca92]/10 text-[#a0ca92] border border-[#a0ca92]/30'
                            : 'bg-[#ee6018]/10 text-[#ee6018] border border-[#ee6018]/30'
                        }`}>
                          {u.estado}
                        </span>
                      </td>

                      {currentUser?.rol === 'ADMIN' && (
                        <td className="px-4 py-3.5 text-right">
                          {u.id_usuario === currentUser.id_usuario ? (
                            <span className="font-mono text-[10px] text-[#8a8380]">Sesión actual</span>
                          ) : (
                            <button
                              onClick={() => setUsuarioAConmutar(u)}
                              className={`px-2.5 py-1 rounded-[3px] font-mono text-[10px] uppercase inline-flex items-center gap-1.5 transition-colors border ${
                                u.estado === 'ACTIVO'
                                  ? 'bg-[#101010] text-[#ee6018] border-[#ee6018]/40 hover:bg-[#ee6018]/10'
                                  : 'bg-[#101010] text-[#a0ca92] border-[#a0ca92]/40 hover:bg-[#a0ca92]/10'
                              }`}
                            >
                              <Power size={11} />
                              <span>{u.estado === 'ACTIVO' ? 'Suspender' : 'Reactivar'}</span>
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center font-mono text-xs text-[#8a8380]">
                    {loading ? 'Cargando usuarios...' : 'No se encontraron registros de usuarios.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Crear Cuenta Institucional (HU-06) */}
      {modalCrearAbierto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#3d3a39]">
              <div className="flex items-center gap-2">
                <UserPlus size={16} className="text-[#ee6018]" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-[#eeeeee]">
                  Registro Institucional de Cuenta (HU-06)
                </h3>
              </div>
              <button
                onClick={() => setModalCrearAbierto(false)}
                className="text-[#8a8380] hover:text-[#eeeeee] text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCrearUsuario} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Nombre *</label>
                  <input
                    type="text"
                    required
                    value={nuevoUsuario.nombre}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none focus:border-[#eeeeee]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Apellido *</label>
                  <input
                    type="text"
                    required
                    value={nuevoUsuario.apellido}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, apellido: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none focus:border-[#eeeeee]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Correo Institucional *</label>
                <input
                  type="email"
                  required
                  value={nuevoUsuario.correo}
                  onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })}
                  placeholder="usuario@edunova.edu.co"
                  className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none focus:border-[#eeeeee]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Rol *</label>
                  <select
                    value={nuevoUsuario.rol}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none"
                  >
                    <option value="APRENDIZ">Aprendiz</option>
                    <option value="INSTRUCTOR">Instructor</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Contraseña (Bcrypt) *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={nuevoUsuario.password}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none focus:border-[#eeeeee]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Documento de Identidad</label>
                  <input
                    type="text"
                    value={nuevoUsuario.documento}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, documento: e.target.value })}
                    placeholder="Ej. 1075689000"
                    className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={nuevoUsuario.telefono}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, telefono: e.target.value })}
                    placeholder="Ej. 3101234567"
                    className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none"
                  />
                </div>
              </div>

              {mensajeError && (
                <p className="text-[11px] text-[#ee6018] font-mono">{mensajeError}</p>
              )}

              {mensajeExito && (
                <p className="text-[11px] text-[#a0ca92] font-mono">{mensajeExito}</p>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-[#3d3a39]">
                <button
                  type="button"
                  onClick={() => setModalCrearAbierto(false)}
                  className="px-3 py-1.5 rounded-[3px] border border-[#3d3a39] text-[#8a8380] hover:text-[#eeeeee] text-xs font-mono"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#eeeeee] hover:bg-white text-[#101010] rounded-[3px] text-xs font-mono font-medium"
                >
                  Guardar Cuenta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmación de Suspensión / Reactivación (HU-07) */}
      {usuarioAConmutar && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-[#ee6018]">
              <AlertTriangle size={18} />
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#eeeeee]">
                Confirmación de Estado (HU-07)
              </h3>
            </div>

            <p className="text-xs text-[#eeeeee] leading-relaxed">
              ¿Está seguro de que desea cambiar el estado de la cuenta de{' '}
              <strong>{usuarioAConmutar.nombre} {usuarioAConmutar.apellido}</strong> a{' '}
              <strong className={usuarioAConmutar.estado === 'ACTIVO' ? 'text-[#ee6018]' : 'text-[#a0ca92]'}>
                {usuarioAConmutar.estado === 'ACTIVO' ? 'INACTIVO (SUSPENDIDO)' : 'ACTIVO'}
              </strong>?
            </p>

            <p className="text-[11px] text-[#8a8380]">
              {usuarioAConmutar.estado === 'ACTIVO' 
                ? 'El usuario no podrá iniciar sesión ni realizar peticiones a la API mientras permanezca inactivo.'
                : 'El usuario recuperará inmediatamente el acceso a su portal correspondiente.'}
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#3d3a39]">
              <button
                onClick={() => setUsuarioAConmutar(null)}
                className="px-3 py-1.5 rounded-[3px] border border-[#3d3a39] text-[#8a8380] hover:text-[#eeeeee] text-xs font-mono"
              >
                Cancelar
              </button>
              <button
                onClick={handleConmutarEstado}
                className={`px-4 py-1.5 rounded-[3px] text-xs font-mono font-medium ${
                  usuarioAConmutar.estado === 'ACTIVO'
                    ? 'bg-[#ee6018] text-white hover:bg-[#d55212]'
                    : 'bg-[#a0ca92] text-[#101010] hover:bg-[#8eb880]'
                }`}
              >
                Confirmar Acción
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
