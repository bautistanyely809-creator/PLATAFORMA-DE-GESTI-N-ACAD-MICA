import React, { useState } from 'react';
import { api } from '../services/api';
import { 
  ShieldCheck, 
  GraduationCap, 
  Users, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Terminal,
  KeyRound,
  RotateCcw
} from 'lucide-react';

export default function Auth({ onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'registro' | 'recuperar'
  const [selectedRole, setSelectedRole] = useState('APRENDIZ');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [cargando, setCargando] = useState(false);

  // Estados del Formulario Login (HU-01)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Estados del Formulario Registro (HU-02)
  const [regData, setRegData] = useState({
    nombre: '',
    apellido: '',
    documento: '',
    telefono: '',
    correo: '',
    password: '',
    confirmPassword: '',
    ficha: 'ADSO-3413988'
  });

  // Estados del Formulario Recuperación (HU-03)
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryToken, setRecoveryToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [stepRecovery, setStepRecovery] = useState(1); // 1: pedir token, 2: resetear clave

  const roleConfig = {
    APRENDIZ: {
      code: 'PORTAL_01',
      title: 'Portal del Aprendiz',
      subtitle: 'Calificaciones, asistencia y tutor de IA',
      icon: Users,
      badge: 'APRENDIZ ADSO',
      demoEmail: 'anyely.valeria@edunova.edu.co',
      demoPass: 'edunova2026'
    },
    INSTRUCTOR: {
      code: 'PORTAL_02',
      title: 'Portal del Instructor',
      subtitle: 'Evaluación de evidencias, libro de notas y fichas',
      icon: GraduationCap,
      badge: 'DOCENTE TITULAR',
      demoEmail: 'carlos.mendoza@edunova.edu.co',
      demoPass: 'edunova2026'
    },
    ADMIN: {
      code: 'PORTAL_03',
      title: 'Administración Central',
      subtitle: 'Gestión de directorio, rutas curriculares y telemetría',
      icon: ShieldCheck,
      badge: 'ADMINISTRADOR',
      demoEmail: 'admin@edunova.edu.co',
      demoPass: 'edunova2026'
    }
  };

  const currentRoleInfo = roleConfig[selectedRole];
  const CurrentRoleIcon = currentRoleInfo.icon;

  // HU-01: Login con backend y control de roles
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginEmail || !loginPassword) {
      setErrorMsg('Por favor ingrese su correo institucional y contraseña.');
      return;
    }

    setCargando(true);
    try {
      // Petición real al backend
      const res = await api.auth.login({
        correo: loginEmail,
        password: loginPassword,
        rol: selectedRole
      });

      const userObj = {
        ...res.user,
        token: res.token
      };

      localStorage.setItem('edunova_current_user', JSON.stringify(userObj));
      setSuccessMsg('Acceso autorizado. Redirigiendo a la consola...');
      setTimeout(() => {
        onLoginSuccess(userObj);
      }, 500);
    } catch (err) {
      // Fallback local ágil si el backend estuviese offline
      const msg = err.message || 'Credenciales de autenticación no válidas para el portal seleccionado.';
      setErrorMsg(msg);
    } finally {
      setCargando(false);
    }
  };

  // HU-02: Registro autónomo de aprendices
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regData.nombre || !regData.apellido || !regData.correo || !regData.documento || !regData.password) {
      setErrorMsg('Todos los campos obligatorios deben ser diligenciados.');
      return;
    }

    if (regData.password.length < 6) {
      setErrorMsg('La contraseña secreta debe contener al menos 6 caracteres.');
      return;
    }

    if (regData.password !== regData.confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    setCargando(true);
    try {
      const res = await api.auth.registro({
        nombre: regData.nombre,
        apellido: regData.apellido,
        correo: regData.correo,
        documento: regData.documento,
        telefono: regData.telefono,
        password: regData.password,
        confirmPassword: regData.confirmPassword
      });

      setSuccessMsg(res.message || 'Cuenta de aprendiz creada exitosamente. Iniciando sesión...');
      const userObj = {
        ...res.user,
        token: res.token
      };
      localStorage.setItem('edunova_current_user', JSON.stringify(userObj));
      setTimeout(() => {
        onLoginSuccess(userObj);
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || 'Error al procesar el registro de la cuenta.');
    } finally {
      setCargando(false);
    }
  };

  // HU-03: Paso 1 - Solicitar token de recuperación
  const handleSolicitarToken = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!recoveryEmail) {
      setErrorMsg('Por favor ingrese su correo institucional.');
      return;
    }

    setCargando(true);
    try {
      const res = await api.auth.solicitarRecuperacion(recoveryEmail);
      setSuccessMsg(res.message);
      if (res.tokenRecuperacion) {
        setRecoveryToken(res.tokenRecuperacion);
      }
      setStepRecovery(2);
    } catch (err) {
      setErrorMsg(err.message || 'Error al solicitar el restablecimiento.');
    } finally {
      setCargando(false);
    }
  };

  // HU-03: Paso 2 - Restablecer contraseña con el token
  const handleRestablecerPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!recoveryToken || !newPassword) {
      setErrorMsg('El token y la nueva contraseña son requeridos.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    setCargando(true);
    try {
      const res = await api.auth.restablecerPassword({
        token: recoveryToken,
        nuevoPassword: newPassword,
        confirmPassword: confirmNewPassword
      });

      setSuccessMsg(res.message || 'Contraseña actualizada.');
      setTimeout(() => {
        setMode('login');
        setLoginEmail(recoveryEmail);
        setLoginPassword(newPassword);
        setStepRecovery(1);
        setSuccessMsg('Ahora puede iniciar sesión con sus nuevas credenciales.');
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || 'El token es inválido o ha expirado (límite 15 minutos).');
    } finally {
      setCargando(false);
    }
  };

  const loadDemoCredentials = (role) => {
    setSelectedRole(role);
    setLoginEmail(roleConfig[role].demoEmail);
    setLoginPassword(roleConfig[role].demoPass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#101010] text-[#eeeeee] flex flex-col justify-between font-sans antialiased selection:bg-[#eeeeee] selection:text-[#101010]">
      
      {/* Encabezado Superior */}
      <header className="h-16 px-6 border-b border-[#3d3a39] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[3px] bg-[#1d1a18] border border-[#3d3a39] flex items-center justify-center font-bold text-[#ee6018]">
            E
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#eeeeee]">EDUNOVA // SISTEMA ACADÉMICO</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ee6018] animate-pulse"></span>
            </div>
            <p className="font-mono text-[10px] text-[#8a8380] uppercase">
              Sistema de Gestión Académica · Versión 2.1
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-[#8a8380] uppercase px-3 py-1 rounded-[3px] border border-[#3d3a39]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a0ca92]"></span>
          <span>Centro de Formación Industrial · SENA Huila</span>
        </div>
      </header>

      {/* Contenedor Principal */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex items-center justify-center my-auto">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-[10px] border border-[#3d3a39] bg-[#1d1a18] overflow-hidden shadow-2xl">
          
          {/* Panel Izquierdo: Selector de Rol y Terminal */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-[#101010] border-b lg:border-b-0 lg:border-r border-[#3d3a39] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#8a8380] uppercase tracking-wider">
                <Terminal size={12} className="text-[#ee6018]" />
                <span>Seleccionar Rol de Destino</span>
              </div>

              <h2 className="text-2xl font-normal tracking-tight text-[#eeeeee]">
                Puerta de Acceso // Control
              </h2>

              <p className="text-xs text-[#8a8380] leading-relaxed">
                Seleccione el portal operativo correspondiente a su rol asignado en el centro de formación.
              </p>

              {/* Botones de Roles */}
              <div className="space-y-2 pt-2">
                {/* 1. APRENDIZ */}
                <button
                  type="button"
                  onClick={() => loadDemoCredentials('APRENDIZ')}
                  className={`w-full flex items-center justify-between p-3 rounded-[3px] border text-left transition-colors duration-150 ${
                    selectedRole === 'APRENDIZ'
                      ? 'bg-[#1d1a18] border-[#eeeeee] text-[#eeeeee]'
                      : 'bg-[#101010] border-[#3d3a39] text-[#8a8380] hover:text-[#eeeeee] hover:border-[#8a8380]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users size={16} className={selectedRole === 'APRENDIZ' ? 'text-[#a0ca92]' : 'text-[#8a8380]'} />
                    <div>
                      <p className="text-xs font-normal text-[#eeeeee]">Portal del Aprendiz</p>
                      <p className="font-mono text-[10px] text-[#8a8380]">Calificaciones, asistencia y tutor de IA</p>
                    </div>
                  </div>
                  <span className="font-mono text-[9px] text-[#a0ca92] bg-[#a0ca92]/10 px-1.5 py-0.5 rounded-[2px] border border-[#a0ca92]/20">
                    ADSO
                  </span>
                </button>

                {/* 2. INSTRUCTOR */}
                <button
                  type="button"
                  onClick={() => loadDemoCredentials('INSTRUCTOR')}
                  className={`w-full flex items-center justify-between p-3 rounded-[3px] border text-left transition-colors duration-150 ${
                    selectedRole === 'INSTRUCTOR'
                      ? 'bg-[#1d1a18] border-[#eeeeee] text-[#eeeeee]'
                      : 'bg-[#101010] border-[#3d3a39] text-[#8a8380] hover:text-[#eeeeee] hover:border-[#8a8380]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap size={16} className={selectedRole === 'INSTRUCTOR' ? 'text-[#ee6018]' : 'text-[#8a8380]'} />
                    <div>
                      <p className="text-xs font-normal text-[#eeeeee]">Portal del Instructor</p>
                      <p className="font-mono text-[10px] text-[#8a8380]">Evaluación de evidencias y libro de notas</p>
                    </div>
                  </div>
                  <span className="font-mono text-[9px] text-[#ee6018] bg-[#ee6018]/10 px-1.5 py-0.5 rounded-[2px] border border-[#ee6018]/20">
                    DOCENTE
                  </span>
                </button>

                {/* 3. ADMIN */}
                <button
                  type="button"
                  onClick={() => loadDemoCredentials('ADMIN')}
                  className={`w-full flex items-center justify-between p-3 rounded-[3px] border text-left transition-colors duration-150 ${
                    selectedRole === 'ADMIN'
                      ? 'bg-[#1d1a18] border-[#eeeeee] text-[#eeeeee]'
                      : 'bg-[#101010] border-[#3d3a39] text-[#8a8380] hover:text-[#eeeeee] hover:border-[#8a8380]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={16} className={selectedRole === 'ADMIN' ? 'text-[#fafafa]' : 'text-[#8a8380]'} />
                    <div>
                      <p className="text-xs font-normal text-[#eeeeee]">Administración Central</p>
                      <p className="font-mono text-[10px] text-[#8a8380]">Directorio, rutas curriculares y telemetría</p>
                    </div>
                  </div>
                  <span className="font-mono text-[9px] text-[#fafafa] bg-[#eeeeee]/10 px-1.5 py-0.5 rounded-[2px] border border-[#3d3a39]">
                    ADMIN
                  </span>
                </button>
              </div>
            </div>

            {/* Credenciales Demo Rápidas */}
            <div className="p-3 bg-[#1d1a18] border border-[#3d3a39] rounded-[3px] font-mono text-[10px] text-[#8a8380] space-y-1">
              <span className="text-[#a0ca92] uppercase font-bold block mb-1">ACCESO RÁPIDO DISPONIBLE</span>
              <p>Correo: <span className="text-[#eeeeee]">{currentRoleInfo.demoEmail}</span></p>
              <p>Clave: <span className="text-[#eeeeee]">{currentRoleInfo.demoPass}</span></p>
            </div>
          </div>

          {/* Panel Derecho: Formularios Dinámicos */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            {/* Pestañas de Modo */}
            <div className="flex items-center justify-between border-b border-[#3d3a39] pb-4 mb-6">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`px-3 py-1.5 font-mono text-xs uppercase rounded-[3px] transition-colors ${
                    mode === 'login'
                      ? 'bg-[#eeeeee] text-[#101010] font-medium'
                      : 'text-[#8a8380] hover:text-[#eeeeee]'
                  }`}
                >
                  Iniciar Sesión
                </button>

                <button
                  type="button"
                  onClick={() => { setMode('registro'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`px-3 py-1.5 font-mono text-xs uppercase rounded-[3px] transition-colors ${
                    mode === 'registro'
                      ? 'bg-[#eeeeee] text-[#101010] font-medium'
                      : 'text-[#8a8380] hover:text-[#eeeeee]'
                  }`}
                >
                  Registrar Cuenta
                </button>

                <button
                  type="button"
                  onClick={() => { setMode('recuperar'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`px-3 py-1.5 font-mono text-xs uppercase rounded-[3px] transition-colors ${
                    mode === 'recuperar'
                      ? 'bg-[#eeeeee] text-[#101010] font-medium'
                      : 'text-[#8a8380] hover:text-[#eeeeee]'
                  }`}
                >
                  Recuperar Clave
                </button>
              </div>
            </div>

            {/* Mensajes de Alerta */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-[#ee6018]/10 border border-[#ee6018]/30 rounded-[3px] text-xs font-mono text-[#ee6018] flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 bg-[#a0ca92]/10 border border-[#a0ca92]/30 rounded-[3px] text-xs font-mono text-[#a0ca92] flex items-center gap-2">
                <CheckCircle2 size={15} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* 1. MODO: INICIAR SESIÓN (HU-01) */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">
                    Correo Institucional
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8380]" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="usuario@edunova.edu.co"
                      className="w-full pl-9 pr-3 py-2 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none focus:border-[#eeeeee]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-mono text-[10px] text-[#8a8380] uppercase">
                      Contraseña Secreta
                    </label>
                    <button
                      type="button"
                      onClick={() => setMode('recuperar')}
                      className="font-mono text-[10px] text-[#8a8380] hover:text-[#eeeeee] transition-colors"
                    >
                      ¿Olvidó su contraseña?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8380]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-10 py-2 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none focus:border-[#eeeeee]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8380] hover:text-[#eeeeee]"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full py-2.5 bg-[#eeeeee] hover:bg-white text-[#101010] font-mono text-xs uppercase font-medium rounded-[3px] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  <span>{cargando ? 'Autenticando...' : 'Acceder al Sistema'}</span>
                  <ArrowRight size={13} />
                </button>
              </form>
            )}

            {/* 2. MODO: REGISTRO AUTÓNOMO DE APRENDICES (HU-02) */}
            {mode === 'registro' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Nombres *</label>
                    <input
                      type="text"
                      required
                      value={regData.nombre}
                      onChange={(e) => setRegData({ ...regData, nombre: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none focus:border-[#eeeeee]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Apellidos *</label>
                    <input
                      type="text"
                      required
                      value={regData.apellido}
                      onChange={(e) => setRegData({ ...regData, apellido: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none focus:border-[#eeeeee]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Documento Identidad *</label>
                    <input
                      type="text"
                      required
                      value={regData.documento}
                      onChange={(e) => setRegData({ ...regData, documento: e.target.value })}
                      placeholder="Ej. 1075689123"
                      className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Teléfono</label>
                    <input
                      type="text"
                      value={regData.telefono}
                      onChange={(e) => setRegData({ ...regData, telefono: e.target.value })}
                      placeholder="Ej. 3101234567"
                      className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={regData.correo}
                    onChange={(e) => setRegData({ ...regData, correo: e.target.value })}
                    placeholder="aprendiz@edunova.edu.co"
                    className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none focus:border-[#eeeeee]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Contraseña (Mín. 6) *</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={regData.password}
                      onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none focus:border-[#eeeeee]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Confirmar Contraseña *</label>
                    <input
                      type="password"
                      required
                      value={regData.confirmPassword}
                      onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none focus:border-[#eeeeee]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full py-2.5 bg-[#eeeeee] hover:bg-white text-[#101010] font-mono text-xs uppercase font-medium rounded-[3px] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  <span>{cargando ? 'Creando cuenta...' : 'Crear Cuenta de Aprendiz'}</span>
                  <ArrowRight size={13} />
                </button>
              </form>
            )}

            {/* 3. MODO: RESTABLECIMIENTO DE CONTRASEÑA (HU-03) */}
            {mode === 'recuperar' && (
              <div className="space-y-4">
                <div className="p-3 bg-[#101010] border border-[#3d3a39] rounded-[4px] text-xs text-[#8a8380] space-y-1">
                  <span className="font-mono text-[10px] uppercase text-[#a0ca92] block font-bold">
                    Seguridad Criptográfica (HU-03)
                  </span>
                  <p>El sistema genera un token seguro con vigencia de 15 minutos para restablecer su clave.</p>
                </div>

                {stepRecovery === 1 ? (
                  <form onSubmit={handleSolicitarToken} className="space-y-3">
                    <div>
                      <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">
                        Correo Institucional Registrado
                      </label>
                      <input
                        type="email"
                        required
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        placeholder="ejemplo@edunova.edu.co"
                        className="w-full px-3 py-2 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none focus:border-[#eeeeee]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={cargando}
                      className="w-full py-2.5 bg-[#eeeeee] hover:bg-white text-[#101010] font-mono text-xs uppercase font-medium rounded-[3px] transition-colors disabled:opacity-50"
                    >
                      {cargando ? 'Generando token...' : 'Solicitar Token de Recuperación (15 min)'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRestablecerPassword} className="space-y-3">
                    <div>
                      <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">
                        Token de Recuperación Temporal *
                      </label>
                      <input
                        type="text"
                        required
                        value={recoveryToken}
                        onChange={(e) => setRecoveryToken(e.target.value)}
                        placeholder="RST-XXXX-XXXX"
                        className="w-full px-3 py-2 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] font-mono focus:outline-none focus:border-[#eeeeee]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Nueva Clave (Mín. 6) *</label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3 py-2 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Confirmar Nueva Clave *</label>
                        <input
                          type="password"
                          required
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3 py-2 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={cargando}
                      className="w-full py-2.5 bg-[#a0ca92] hover:bg-[#8eb880] text-[#101010] font-mono text-xs uppercase font-medium rounded-[3px] transition-colors disabled:opacity-50"
                    >
                      {cargando ? 'Actualizando...' : 'Confirmar Nueva Contraseña'}
                    </button>
                  </form>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-[#3d3a39] text-center font-mono text-[10px] text-[#8a8380]">
              EDUNOVA AMS · SENA Centro de Formación Industrial (Neiva)
            </div>
          </div>

        </div>
      </main>

      {/* Pie de Página */}
      <footer className="h-10 px-6 border-t border-[#3d3a39] flex items-center justify-between text-xs font-mono text-[#8a8380]">
        <span>EDUNOVA AMS 2026</span>
        <span>Tecnología ADSO · MySQL 8 · Express · React · Prisma</span>
      </footer>
    </div>
  );
}
