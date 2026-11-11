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
  UserCheck, 
  Phone, 
  IdCard, 
  BookOpen, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function Auth({ onLoginSuccess }) {
  // Modo: 'login' o 'register'
  const [mode, setMode] = useState('login');
  // Rol seleccionado: 'APRENDIZ', 'INSTRUCTOR', 'ADMIN'
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
    // Específico Aprendiz
    ficha: 'ADSO-2874102',
    // Específico Instructor
    especialidad: 'Desarrollo Web & Software',
    // Específico Admin
    codigoSeguridad: ''
  });

  // Configuración temática por Rol
  const roleConfig = {
    APRENDIZ: {
      title: 'Portal del Aprendiz',
      subtitle: 'Consulta de calificaciones, seguimiento de asistencia y recomendaciones con IA',
      icon: Users,
      badge: 'Aprendiz ADSO',
      demoEmail: 'anyely.valeria@edunova.edu.co',
      demoPass: 'Aprendiz123*'
    },
    INSTRUCTOR: {
      title: 'Portal del Instructor',
      subtitle: 'Registro de calificaciones, planilla de asistencia y seguimiento formativo',
      icon: GraduationCap,
      badge: 'Docente / Instructor',
      demoEmail: 'carlos.mendoza@edunova.edu.co',
      demoPass: 'Instructor123*'
    },
    ADMIN: {
      title: 'Gestión Administrativa',
      subtitle: 'Administración de usuarios, programas, cursos e indicadores generales',
      icon: ShieldCheck,
      badge: 'Administrador General',
      demoEmail: 'admin@edunova.edu.co',
      demoPass: 'Admin123*'
    }
  };

  const currentRoleInfo = roleConfig[selectedRole];
  const CurrentRoleIcon = currentRoleInfo.icon;

  // Manejar Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginEmail || !loginPassword) {
      setErrorMsg('Por favor completa todos los campos.');
      return;
    }

    // Comprobar credenciales de prueba o usuarios guardados localmente
    const registeredUsers = JSON.parse(localStorage.getItem('edunova_registered_users') || '[]');
    const localUser = registeredUsers.find(
      u => u.correo.toLowerCase() === loginEmail.toLowerCase() && u.password === loginPassword && u.rol === selectedRole
    );

    // Cuentas predefinidas del sistema
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
      // Permitir acceso con datos oficiales
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

  // Manejar Registro
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

    // Validación de seguridad para Administrador
    if (selectedRole === 'ADMIN') {
      if (regData.codigoSeguridad !== 'SENA2026' && regData.codigoSeguridad !== 'EDUNOVA') {
        setErrorMsg('Código de autorización administrativa inválido. (Usa "SENA2026" para la prueba)');
        return;
      }
    }

    // Guardar usuario en localStorage
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

    setSuccessMsg('¡Cuenta creada exitosamente! Iniciando sesión...');
    setTimeout(() => {
      localStorage.setItem('edunova_current_user', JSON.stringify(newUser));
      onLoginSuccess(newUser);
    }, 900);
  };

  // Cargar credenciales de demostración
  const loadDemoCredentials = (role) => {
    setSelectedRole(role);
    setLoginEmail(roleConfig[role].demoEmail);
    setLoginPassword(roleConfig[role].demoPass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-edunova-canvas flex flex-col justify-between font-sans text-edunova-text">
      
      {/* Top Banner Institucional */}
      <header className="bg-white border-b border-slate-200 px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white p-1 border-2 border-edunova-gold shadow-sm flex items-center justify-center">
              <img src="/edunova-logo.png" alt="Escudo EDUNOVA" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-edunova-navy tracking-tight leading-none">
                EDUNOVA
              </h1>
              <p className="text-[11px] font-bold text-edunova-gold uppercase tracking-wider mt-0.5">
                Academic Management System
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600 bg-edunova-gold/10 px-3.5 py-1.5 rounded-full border border-edunova-gold/30">
            <span className="w-2 h-2 rounded-full bg-edunova-emerald animate-pulse"></span>
            <span>Centro de Formación Industrial · SENA Regional Huila</span>
          </div>

        </div>
      </header>

      {/* Contenido Central */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-navy border-2 border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* ========================================================= */}
          {/* PANEL IZQUIERDO: SELECCIÓN DE LAS 3 SECCIONES (ROLES)    */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 bg-gradient-to-b from-edunova-navy via-edunova-navy-dark to-[#030c17] text-white p-8 flex flex-col justify-between border-r border-edunova-gold/30 relative overflow-hidden">
            
            {/* Marca de agua decorativa del escudo */}
            <div className="absolute -bottom-10 -left-10 w-48 h-48 opacity-10 pointer-events-none">
              <img src="/edunova-logo.png" alt="" className="w-full h-full object-contain filter invert" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-edunova-gold/20 border border-edunova-gold/40 text-edunova-gold text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles size={13} />
                <span>Acceso por Rol Obligatorio</span>
              </div>

              <h2 className="text-2xl font-black tracking-tight text-white mb-2">
                Selecciona tu Sección
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Para garantizar la seguridad y privacidad académica, ingresa únicamente a través de la sección correspondiente a tu rol.
              </p>

              {/* Botones de las 3 Secciones */}
              <div className="space-y-3">
                
                {/* 1. SECCIÓN APRENDIZ */}
                <button
                  type="button"
                  onClick={() => { setSelectedRole('APRENDIZ'); setErrorMsg(''); }}
                  className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl border text-left transition-all ${
                    selectedRole === 'APRENDIZ'
                      ? 'bg-edunova-gold text-slate-950 border-edunova-gold shadow-gold font-bold'
                      : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    selectedRole === 'APRENDIZ' ? 'bg-slate-950 text-edunova-gold' : 'bg-white/10 text-edunova-gold'
                  }`}>
                    <Users size={20} />
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-sm font-extrabold truncate">Sección Aprendiz</p>
                    <p className={`text-[11px] ${selectedRole === 'APRENDIZ' ? 'text-slate-800' : 'text-slate-400'}`}>
                      Notas, asistencia e IA
                    </p>
                  </div>
                  {selectedRole === 'APRENDIZ' && <CheckCircle2 size={18} className="text-slate-950" />}
                </button>

                {/* 2. SECCIÓN INSTRUCTOR */}
                <button
                  type="button"
                  onClick={() => { setSelectedRole('INSTRUCTOR'); setErrorMsg(''); }}
                  className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl border text-left transition-all ${
                    selectedRole === 'INSTRUCTOR'
                      ? 'bg-edunova-gold text-slate-950 border-edunova-gold shadow-gold font-bold'
                      : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    selectedRole === 'INSTRUCTOR' ? 'bg-slate-950 text-edunova-gold' : 'bg-white/10 text-edunova-gold'
                  }`}>
                    <GraduationCap size={20} />
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-sm font-extrabold truncate">Sección Instructor</p>
                    <p className={`text-[11px] ${selectedRole === 'INSTRUCTOR' ? 'text-slate-800' : 'text-slate-400'}`}>
                      Calificar y pasar asistencia
                    </p>
                  </div>
                  {selectedRole === 'INSTRUCTOR' && <CheckCircle2 size={18} className="text-slate-950" />}
                </button>

                {/* 3. SECCIÓN ADMINISTRADOR */}
                <button
                  type="button"
                  onClick={() => { setSelectedRole('ADMIN'); setErrorMsg(''); }}
                  className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl border text-left transition-all ${
                    selectedRole === 'ADMIN'
                      ? 'bg-edunova-gold text-slate-950 border-edunova-gold shadow-gold font-bold'
                      : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    selectedRole === 'ADMIN' ? 'bg-slate-950 text-edunova-gold' : 'bg-white/10 text-edunova-gold'
                  }`}>
                    <ShieldCheck size={20} />
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-sm font-extrabold truncate">Sección Administrador</p>
                    <p className={`text-[11px] ${selectedRole === 'ADMIN' ? 'text-slate-800' : 'text-slate-400'}`}>
                      Control general y matrículas
                    </p>
                  </div>
                  {selectedRole === 'ADMIN' && <CheckCircle2 size={18} className="text-slate-950" />}
                </button>

              </div>
            </div>

            {/* Accesos Rápidos de Demostración (1-Click Demo) */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/10">
              <p className="text-[11px] font-bold text-edunova-gold uppercase tracking-wider mb-2">
                Acceso Rápido para Pruebas (Demo 1-Click):
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => loadDemoCredentials('APRENDIZ')}
                  className="px-2 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-bold text-slate-200 truncate border border-white/10 text-center"
                >
                  Demo Aprendiz
                </button>
                <button
                  type="button"
                  onClick={() => loadDemoCredentials('INSTRUCTOR')}
                  className="px-2 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-bold text-slate-200 truncate border border-white/10 text-center"
                >
                  Demo Docente
                </button>
                <button
                  type="button"
                  onClick={() => loadDemoCredentials('ADMIN')}
                  className="px-2 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-bold text-slate-200 truncate border border-white/10 text-center"
                >
                  Demo Admin
                </button>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* PANEL DERECHO: FORMULARIOS (LOGIN / REGISTRO)            */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-white">
            
            <div>
              {/* Selector de Modo: Iniciar Sesión / Registrarse */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-edunova-navy tracking-tight flex items-center gap-2">
                    <CurrentRoleIcon size={22} className="text-edunova-gold" />
                    <span>{currentRoleInfo.title}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {mode === 'login' 
                      ? 'Ingresa tus credenciales autorizadas' 
                      : 'Crea tu cuenta institucional obligatoria'}
                  </p>
                </div>

                {/* Tabs Switcher */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      mode === 'login' 
                        ? 'bg-white text-edunova-navy shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Ingresar
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      mode === 'register' 
                        ? 'bg-edunova-gold text-slate-950 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Registrarse
                  </button>
                </div>
              </div>

              {/* Mensajes de Alerta */}
              {errorMsg && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-shake">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0 text-edunova-emerald" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* FORMULARIO DE INICIO DE SESIÓN                        */}
              {/* ---------------------------------------------------- */}
              {mode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Correo Institucional ({currentRoleInfo.badge})
                    </label>
                    <div className="relative">
                      <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder={`ej. nombre@edunova.edu.co`}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-edunova-navy focus:ring-2 focus:ring-edunova-gold/30 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-edunova-navy focus:ring-2 focus:ring-edunova-gold/30 focus:outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-edunova-gold focus:ring-edunova-gold" />
                      <span>Recordar en este equipo</span>
                    </label>
                    <a href="#olvide" onClick={(e) => { e.preventDefault(); alert('Para restablecer tu contraseña, contacta a la coordinación académica o utiliza los accesos de prueba.'); }} className="text-edunova-navy font-bold hover:underline">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-3.5 px-4 bg-edunova-gold hover:bg-edunova-gold-hover text-slate-950 font-extrabold rounded-xl text-sm shadow-gold transition-all flex items-center justify-center gap-2"
                  >
                    <span>Ingresar como {currentRoleInfo.badge}</span>
                    <ArrowRight size={17} />
                  </button>

                </form>
              ) : (
                
                /* ---------------------------------------------------- */
                /* FORMULARIO DE REGISTRO OBLIGATORIO                    */
                /* ---------------------------------------------------- */
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nombres *</label>
                      <input
                        type="text"
                        required
                        value={regData.nombre}
                        onChange={(e) => setRegData({...regData, nombre: e.target.value})}
                        placeholder="ej. Anyely Valeria"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-edunova-navy focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Apellidos *</label>
                      <input
                        type="text"
                        required
                        value={regData.apellido}
                        onChange={(e) => setRegData({...regData, apellido: e.target.value})}
                        placeholder="ej. Castellanos"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-edunova-navy focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Documento *</label>
                      <div className="flex gap-2">
                        <select
                          value={regData.tipoDocumento}
                          onChange={(e) => setRegData({...regData, tipoDocumento: e.target.value})}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-700"
                        >
                          <option value="CC">C.C.</option>
                          <option value="TI">T.I.</option>
                          <option value="CE">C.E.</option>
                        </select>
                        <input
                          type="text"
                          required
                          value={regData.documento}
                          onChange={(e) => setRegData({...regData, documento: e.target.value})}
                          placeholder="Número"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-edunova-navy focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono</label>
                      <input
                        type="tel"
                        value={regData.telefono}
                        onChange={(e) => setRegData({...regData, telefono: e.target.value})}
                        placeholder="ej. 3201234567"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-edunova-navy focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Campos específicos por rol */}
                  {selectedRole === 'APRENDIZ' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Ficha / Programa *</label>
                      <select
                        value={regData.ficha}
                        onChange={(e) => setRegData({...regData, ficha: e.target.value})}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
                      >
                        <option value="ADSO-2874102">ADSO (Ficha #2874102) - Desarrollo de Software</option>
                        <option value="REDES-2874103">Gestión de Redes (Ficha #2874103)</option>
                      </select>
                    </div>
                  )}

                  {selectedRole === 'INSTRUCTOR' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Especialidad Técnica *</label>
                      <input
                        type="text"
                        required
                        value={regData.especialidad}
                        onChange={(e) => setRegData({...regData, especialidad: e.target.value})}
                        placeholder="ej. Frontend React, Backend Node.js, Bases de Datos"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-edunova-navy focus:outline-none"
                      />
                    </div>
                  )}

                  {selectedRole === 'ADMIN' && (
                    <div>
                      <label className="block text-xs font-bold text-amber-700 mb-1">
                        Código de Autorización Institucional *
                      </label>
                      <input
                        type="password"
                        required
                        value={regData.codigoSeguridad}
                        onChange={(e) => setRegData({...regData, codigoSeguridad: e.target.value})}
                        placeholder="Código de seguridad (Usa: SENA2026)"
                        className="w-full px-3.5 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-xs focus:bg-white focus:border-edunova-navy focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      value={regData.correo}
                      onChange={(e) => setRegData({...regData, correo: e.target.value})}
                      placeholder="ej. tu.nombre@edunova.edu.co"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-edunova-navy focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Contraseña *</label>
                      <input
                        type="password"
                        required
                        value={regData.password}
                        onChange={(e) => setRegData({...regData, password: e.target.value})}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-edunova-navy focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Confirmar *</label>
                      <input
                        type="password"
                        required
                        value={regData.confirmPassword}
                        onChange={(e) => setRegData({...regData, confirmPassword: e.target.value})}
                        placeholder="Repite la contraseña"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-edunova-navy focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-3 py-3.5 px-4 bg-edunova-navy hover:bg-edunova-navy-light text-white font-extrabold rounded-xl text-sm shadow-navy transition-all flex items-center justify-center gap-2 border border-edunova-gold/40"
                  >
                    <span>Completar Registro como {currentRoleInfo.badge}</span>
                    <ArrowRight size={17} className="text-edunova-gold" />
                  </button>

                </form>
              )}

            </div>

            {/* Footer de Ayuda */}
            <div className="pt-6 mt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                {mode === 'login' ? '¿Aún no tienes cuenta registrada?' : '¿Ya tienes una cuenta activa?'}
                {' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-edunova-navy font-bold hover:underline"
                >
                  {mode === 'login' ? 'Crear cuenta obligatoria' : 'Iniciar sesión ahora'}
                </button>
              </p>
            </div>

          </div>

        </div>

      </main>

      {/* Footer Legal */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        <p>EDUNOVA · Academic Management System · SENA Regional Huila 2026</p>
      </footer>

    </div>
  );
}
