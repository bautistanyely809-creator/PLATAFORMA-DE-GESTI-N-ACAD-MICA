import React, { useState } from 'react';
import { 
  ShieldCheck, 
  GraduationCap, 
  Users, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles,
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

export default function Auth({ onLoginSuccess }) {
  const [mode, setMode] = useState('login');
  const [selectedRole, setSelectedRole] = useState('APRENDIZ');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Estados del Formulario Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Estados del Formulario Registro
  const [regData, setRegData] = useState({
    nombre: '',
    apellido: '',
    documento: '',
    tipoDocumento: 'CC',
    telefono: '',
    correo: '',
    password: '',
    confirmPassword: '',
    ficha: 'ADSO-2874102',
    especialidad: 'Desarrollo Web & Software',
    codigoSeguridad: ''
  });

  const roleConfig = {
    APRENDIZ: {
      title: 'Portal del Aprendiz',
      subtitle: 'Consulta de calificaciones, control de asistencia y tutoría con IA',
      icon: Users,
      badge: 'Aprendiz ADSO',
      demoEmail: 'anyely.valeria@edunova.edu.co',
      demoPass: 'Aprendiz123*',
      activeTheme: 'from-[#123B50] via-[#17365D] to-[#19B5A5]'
    },
    INSTRUCTOR: {
      title: 'Portal del Instructor',
      subtitle: 'Calificación de evidencias, planilla de asistencia y seguimiento pedagógico',
      icon: GraduationCap,
      badge: 'Docente Titular',
      demoEmail: 'carlos.mendoza@edunova.edu.co',
      demoPass: 'Instructor123*',
      activeTheme: 'from-[#102A43] via-[#17365D] to-[#48BFE3]'
    },
    ADMIN: {
      title: 'Gestión Administrativa',
      subtitle: 'Administración de usuarios, fichas formativas y reportes institucionales',
      icon: ShieldCheck,
      badge: 'Administrador General',
      demoEmail: 'admin@edunova.edu.co',
      demoPass: 'Admin123*',
      activeTheme: 'from-[#102A43] via-[#123B50] to-[#E9B949]'
    }
  };

  const currentRoleInfo = roleConfig[selectedRole];
  const CurrentRoleIcon = currentRoleInfo.icon;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginEmail || !loginPassword) {
      setErrorMsg('Por favor completa todos los campos.');
      return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem('edunova_registered_users') || '[]');
    const localUser = registeredUsers.find(
      u => u.correo.toLowerCase() === loginEmail.toLowerCase() && u.password === loginPassword && u.rol === selectedRole
    );

    const isMockMatch = 
      (selectedRole === 'APRENDIZ' && loginEmail === 'anyely.valeria@edunova.edu.co') ||
      (selectedRole === 'INSTRUCTOR' && loginEmail === 'carlos.mendoza@edunova.edu.co') ||
      (selectedRole === 'ADMIN' && loginEmail === 'admin@edunova.edu.co');

    if (localUser) {
      const userObj = {
        id: localUser.id || 10,
        nombre: localUser.nombre,
        apellido: localUser.apellido,
        correo: localUser.correo,
        rol: localUser.rol,
        documento: localUser.documento || '1075000000',
        especialidad: localUser.especialidad || 'ADSO'
      };
      localStorage.setItem('edunova_current_user', JSON.stringify(userObj));
      onLoginSuccess(userObj);
    } else if (isMockMatch || loginPassword === '123456' || loginPassword.length >= 6) {
      const names = {
        APRENDIZ: { nombre: 'Anyely Valeria', apellido: 'Bautista', doc: '1075689123' },
        INSTRUCTOR: { nombre: 'Carlos', apellido: 'Mendoza', doc: '19876543' },
        ADMIN: { nombre: 'Administrador', apellido: 'General', doc: '10000001' }
      }[selectedRole];

      const userObj = {
        id: selectedRole === 'ADMIN' ? 1 : selectedRole === 'INSTRUCTOR' ? 2 : 4,
        nombre: names.nombre,
        apellido: names.apellido,
        correo: loginEmail,
        rol: selectedRole,
        documento: names.doc
      };
      localStorage.setItem('edunova_current_user', JSON.stringify(userObj));
      onLoginSuccess(userObj);
    } else {
      setErrorMsg('Credenciales incorrectas para la sección seleccionada.');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regData.nombre || !regData.apellido || !regData.correo || !regData.password) {
      setErrorMsg('Por favor diligencia los campos obligatorios (*).');
      return;
    }

    if (regData.password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (regData.password !== regData.confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    if (selectedRole === 'ADMIN') {
      if (regData.codigoSeguridad !== 'SENA2026' && regData.codigoSeguridad !== 'EDUNOVA') {
        setErrorMsg('Código de autorización administrativa inválido. (Usa "SENA2026" para la prueba)');
        return;
      }
    }

    const registeredUsers = JSON.parse(localStorage.getItem('edunova_registered_users') || '[]');
    const exists = registeredUsers.some(u => u.correo.toLowerCase() === regData.correo.toLowerCase());
    if (exists) {
      setErrorMsg('Ya existe un usuario registrado con este correo.');
      return;
    }

    const newUser = {
      id: Date.now(),
      nombre: regData.nombre,
      apellido: regData.apellido,
      correo: regData.correo,
      documento: regData.documento,
      tipoDocumento: regData.tipoDocumento,
      telefono: regData.telefono,
      password: regData.password,
      rol: selectedRole,
      especialidad: regData.especialidad,
      ficha: regData.ficha
    };

    registeredUsers.push(newUser);
    localStorage.setItem('edunova_registered_users', JSON.stringify(registeredUsers));

    setSuccessMsg('¡Cuenta creada con éxito! Ingresando...');
    setTimeout(() => {
      localStorage.setItem('edunova_current_user', JSON.stringify(newUser));
      onLoginSuccess(newUser);
    }, 900);
  };

  const loadDemoCredentials = (role) => {
    setSelectedRole(role);
    setLoginEmail(roleConfig[role].demoEmail);
    setLoginPassword(roleConfig[role].demoPass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] font-sans text-edunova-textPrimary relative flex flex-col justify-between overflow-hidden">
      
      {/* Orbes de luz ambiental Ocean Tech */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-[#DCEEF5]/70 rounded-full blur-[130px] pointer-events-none -translate-x-1/3 -translate-y-1/3"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-[#19B5A5]/20 rounded-full blur-[150px] pointer-events-none translate-x-1/3 translate-y-1/3"></div>
      <div className="fixed top-1/2 left-1/2 w-80 h-80 bg-[#48BFE3]/20 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>

      {/* Header Institucional Flotante */}
      <header className="p-4 sm:p-6 z-10">
        <div className="max-w-6xl mx-auto glass-panel h-16 rounded-[24px] px-6 flex items-center justify-between shadow-glass">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white p-1 border border-slate-200 shadow-sm flex items-center justify-center">
              <img src="/edunova-logo.png" alt="Escudo EDUNOVA" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-extrabold text-base text-[#123B50] tracking-tight leading-none">
                EDUNOVA
              </h1>
              <p className="text-[10px] font-bold text-[#19B5A5] uppercase tracking-wider mt-0.5">
                Academic Management System
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-edunova-textSecondary bg-white/80 px-3.5 py-1.5 rounded-full border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-[#19B5A5] animate-pulse"></span>
            <span>Centro de Formación Industrial · SENA Regional Huila</span>
          </div>
        </div>
      </header>

      {/* Contenedor Principal de Autenticación */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 my-auto">
        
        <div className="w-full max-w-4xl glass-panel rounded-[32px] border-2 border-white/95 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-glass-hover">
          
          {/* ========================================================= */}
          {/* PANEL IZQUIERDO: SELECCIÓN DE ROL OCEAN TECH              */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#102A43] via-[#123B50] to-[#17365D] p-8 flex flex-col justify-between border-r border-[#17365D] relative text-white">
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#48BFE3] text-xs font-extrabold uppercase tracking-wider shadow-sm">
                <Sparkles size={13} className="text-[#19B5A5]" />
                <span>Acceso Institucional Obligatorio</span>
              </div>

              <h2 className="text-2xl font-black tracking-tight text-white leading-tight">
                Selecciona tu Rol de Ingreso
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed">
                Ingresa a través del portal autorizado correspondiente a tu rol en la institución formativa.
              </p>

              {/* Selector de los 3 Roles */}
              <div className="space-y-3 pt-2">
                
                {/* 1. ROL APRENDIZ */}
                <button
                  type="button"
                  onClick={() => { setSelectedRole('APRENDIZ'); setErrorMsg(''); }}
                  className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl border text-left transition-all ${
                    selectedRole === 'APRENDIZ'
                      ? 'bg-gradient-to-r from-[#17365D] via-[#123B50] to-[#19B5A5] text-white border-[#19B5A5]/60 shadow-ocean-glow font-extrabold'
                      : 'bg-white/10 border-white/10 text-slate-300 hover:bg-white/15'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    selectedRole === 'APRENDIZ' ? 'bg-[#19B5A5] text-white shadow-sm' : 'bg-white/15 text-[#19B5A5]'
                  }`}>
                    <Users size={20} />
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-sm font-bold truncate">Portal Aprendiz</p>
                    <p className="text-[11px] text-slate-300">Calificaciones, notas y tutor IA</p>
                  </div>
                  {selectedRole === 'APRENDIZ' && <CheckCircle2 size={18} className="text-[#19B5A5]" />}
                </button>

                {/* 2. ROL INSTRUCTOR */}
                <button
                  type="button"
                  onClick={() => { setSelectedRole('INSTRUCTOR'); setErrorMsg(''); }}
                  className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl border text-left transition-all ${
                    selectedRole === 'INSTRUCTOR'
                      ? 'bg-gradient-to-r from-[#102A43] via-[#17365D] to-[#48BFE3] text-white border-[#48BFE3]/60 shadow-cyan-glow font-extrabold'
                      : 'bg-white/10 border-white/10 text-slate-300 hover:bg-white/15'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    selectedRole === 'INSTRUCTOR' ? 'bg-[#48BFE3] text-[#102A43] shadow-sm' : 'bg-white/15 text-[#48BFE3]'
                  }`}>
                    <GraduationCap size={20} />
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-sm font-bold truncate">Portal Docente</p>
                    <p className="text-[11px] text-slate-300">Calificar y tomar asistencia</p>
                  </div>
                  {selectedRole === 'INSTRUCTOR' && <CheckCircle2 size={18} className="text-[#48BFE3]" />}
                </button>

                {/* 3. ROL ADMIN */}
                <button
                  type="button"
                  onClick={() => { setSelectedRole('ADMIN'); setErrorMsg(''); }}
                  className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl border text-left transition-all ${
                    selectedRole === 'ADMIN'
                      ? 'bg-gradient-to-r from-[#102A43] via-[#123B50] to-[#E9B949] text-white border-[#E9B949]/60 shadow-md font-extrabold'
                      : 'bg-white/10 border-white/10 text-slate-300 hover:bg-white/15'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    selectedRole === 'ADMIN' ? 'bg-[#E9B949] text-[#102A43] shadow-sm' : 'bg-white/15 text-[#E9B949]'
                  }`}>
                    <ShieldCheck size={20} />
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-sm font-bold truncate">Administración</p>
                    <p className="text-[11px] text-slate-300">Control general y cursos</p>
                  </div>
                  {selectedRole === 'ADMIN' && <CheckCircle2 size={18} className="text-[#E9B949]" />}
                </button>

              </div>
            </div>

            {/* Accesos Rápidos Demo 1-Click */}
            <div className="pt-6 mt-6 border-t border-[#17365D]">
              <p className="text-[10px] font-extrabold text-[#48BFE3] uppercase tracking-wider mb-2">
                Acceso Rápido para Demostración:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => loadDemoCredentials('APRENDIZ')}
                  className="px-2 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold text-white border border-white/15 truncate shadow-sm"
                >
                  ⚡ Anyely (ADSO)
                </button>
                <button
                  type="button"
                  onClick={() => loadDemoCredentials('INSTRUCTOR')}
                  className="px-2 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold text-white border border-white/15 truncate shadow-sm"
                >
                  👨‍🏫 Instructor
                </button>
                <button
                  type="button"
                  onClick={() => loadDemoCredentials('ADMIN')}
                  className="px-2 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold text-white border border-white/15 truncate shadow-sm"
                >
                  🛡️ Admin
                </button>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* PANEL DERECHO: FORMULARIO GLASSMORPHISM                  */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-white/85">
            
            <div>
              {/* Switcher de Modo: Iniciar Sesión / Registrarse */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-[#123B50] tracking-tight flex items-center gap-2">
                    <CurrentRoleIcon size={20} className="text-[#19B5A5]" />
                    <span>{currentRoleInfo.title}</span>
                  </h3>
                  <p className="text-xs text-edunova-textSecondary mt-0.5">
                    {mode === 'login' ? 'Ingresa con tus credenciales asignadas' : 'Crea tu cuenta obligatoria para el periodo formativo'}
                  </p>
                </div>

                <div className="flex bg-[#EDF2F7] p-1 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      mode === 'login' ? 'bg-white text-[#123B50] shadow-sm' : 'text-edunova-textSecondary hover:text-edunova-textPrimary'
                    }`}
                  >
                    Ingresar
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      mode === 'register' ? 'bg-gradient-to-r from-[#17365D] to-[#19B5A5] text-white shadow-sm font-extrabold' : 'text-edunova-textSecondary hover:text-edunova-textPrimary'
                    }`}
                  >
                    Registrarse
                  </button>
                </div>
              </div>

              {/* Mensajes de Alerta */}
              {errorMsg && (
                <div className="mb-5 p-3.5 rounded-2xl bg-red-50/90 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-5 p-3.5 rounded-2xl bg-[#E8F8F5] border border-emerald-200 text-[#19B5A5] text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* FORMULARIO LOGIN */}
              {mode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  
                  <div>
                    <label className="block text-xs font-extrabold text-[#123B50] uppercase tracking-wider mb-1.5">
                      Correo Institucional ({currentRoleInfo.badge})
                    </label>
                    <div className="relative">
                      <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-edunova-textSecondary" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="ej. nombre@edunova.edu.co"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-edunova-textPrimary focus:bg-white focus:border-[#19B5A5] focus:ring-4 focus:ring-[#19B5A5]/15 focus:outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#123B50] uppercase tracking-wider mb-1.5">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-edunova-textSecondary" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-11 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-edunova-textPrimary focus:bg-white focus:border-[#19B5A5] focus:ring-4 focus:ring-[#19B5A5]/15 focus:outline-none transition-all shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-edunova-textSecondary hover:text-edunova-textPrimary"
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-edunova-textSecondary">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#19B5A5] focus:ring-[#19B5A5]" />
                      <span>Recordar sesión</span>
                    </label>
                    <a href="#olvide" onClick={(e) => { e.preventDefault(); alert('Utiliza los botones de demostración 1-Click para acceder de inmediato.'); }} className="text-[#19B5A5] font-bold hover:underline">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-3.5 px-4 bg-gradient-to-r from-[#123B50] via-[#17365D] to-[#19B5A5] hover:opacity-95 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-ocean-glow transition-all flex items-center justify-center gap-2"
                  >
                    <span>Ingresar como {currentRoleInfo.badge}</span>
                    <ArrowRight size={17} />
                  </button>

                </form>
              ) : (
                
                /* FORMULARIO REGISTRO */
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#123B50] mb-1">Nombres *</label>
                      <input
                        type="text"
                        required
                        value={regData.nombre}
                        onChange={(e) => setRegData({...regData, nombre: e.target.value})}
                        placeholder="ej. Anyely Valeria"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#19B5A5]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#123B50] mb-1">Apellidos *</label>
                      <input
                        type="text"
                        required
                        value={regData.apellido}
                        onChange={(e) => setRegData({...regData, apellido: e.target.value})}
                        placeholder="ej. Bautista"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#19B5A5]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#123B50] mb-1">Documento de Identidad *</label>
                    <input
                      type="text"
                      required
                      value={regData.documento}
                      onChange={(e) => setRegData({...regData, documento: e.target.value})}
                      placeholder="ej. 1075689123"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#19B5A5]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#123B50] mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      value={regData.correo}
                      onChange={(e) => setRegData({...regData, correo: e.target.value})}
                      placeholder="ej. anyely@edunova.edu.co"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#19B5A5]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#123B50] mb-1">Contraseña *</label>
                      <input
                        type="password"
                        required
                        value={regData.password}
                        onChange={(e) => setRegData({...regData, password: e.target.value})}
                        placeholder="Mínimo 6 carácteres"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#19B5A5]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#123B50] mb-1">Confirmar *</label>
                      <input
                        type="password"
                        required
                        value={regData.confirmPassword}
                        onChange={(e) => setRegData({...regData, confirmPassword: e.target.value})}
                        placeholder="Repite la contraseña"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#19B5A5]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-3 py-3.5 px-4 bg-gradient-to-r from-[#123B50] via-[#17365D] to-[#19B5A5] text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-ocean-glow transition-all flex items-center justify-center gap-2"
                  >
                    <span>Completar Registro como {currentRoleInfo.badge}</span>
                    <ArrowRight size={17} />
                  </button>
                </form>
              )}

            </div>

            {/* Footer */}
            <div className="pt-6 mt-6 border-t border-slate-200 text-center">
              <p className="text-xs text-edunova-textSecondary">
                {mode === 'login' ? '¿Aún no tienes cuenta registrada?' : '¿Ya tienes una cuenta activa?'}
                {' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-[#19B5A5] font-extrabold hover:underline"
                >
                  {mode === 'login' ? 'Crear cuenta obligatoria' : 'Iniciar sesión ahora'}
                </button>
              </p>
            </div>

          </div>

        </div>

      </main>

      {/* Footer Legal */}
      <footer className="py-4 text-center text-xs text-edunova-textSecondary z-10">
        <p>EDUNOVA · Academic Management System · SENA Regional Huila 2026</p>
      </footer>

    </div>
  );
}
