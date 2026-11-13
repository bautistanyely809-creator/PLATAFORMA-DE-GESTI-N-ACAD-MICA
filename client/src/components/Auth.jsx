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
  AlertCircle,
  Terminal
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
      code: 'PORTAL_01',
      title: 'Apprentice Portal',
      subtitle: 'Grades telemetry, attendance tracking, and AI tutoring',
      icon: Users,
      badge: 'APRENDIZ ADSO',
      demoEmail: 'anyely.valeria@edunova.edu.co',
      demoPass: 'Aprendiz123*'
    },
    INSTRUCTOR: {
      code: 'PORTAL_02',
      title: 'Instructor Portal',
      subtitle: 'Evidence evaluation, gradebook records, and cohort monitoring',
      icon: GraduationCap,
      badge: 'DOCENTE TITULAR',
      demoEmail: 'carlos.mendoza@edunova.edu.co',
      demoPass: 'Instructor123*'
    },
    ADMIN: {
      code: 'PORTAL_03',
      title: 'Executive Admin',
      subtitle: 'Directory management, curricular tracks, and system telemetry',
      icon: ShieldCheck,
      badge: 'ADMINISTRADOR',
      demoEmail: 'admin@edunova.edu.co',
      demoPass: 'Admin123*'
    }
  };

  const currentRoleInfo = roleConfig[selectedRole];
  const CurrentRoleIcon = currentRoleInfo.icon;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter both identifier and secret key.');
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
      setErrorMsg('Invalid authentication credentials for the selected portal.');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regData.nombre || !regData.apellido || !regData.correo || !regData.password) {
      setErrorMsg('Mandatory registration fields cannot be blank.');
      return;
    }

    if (regData.password.length < 6) {
      setErrorMsg('Secret key must contain at least 6 characters.');
      return;
    }

    if (regData.password !== regData.confirmPassword) {
      setErrorMsg('Secret keys do not match.');
      return;
    }

    if (selectedRole === 'ADMIN') {
      if (regData.codigoSeguridad !== 'SENA2026' && regData.codigoSeguridad !== 'EDUNOVA') {
        setErrorMsg('Invalid administrative authorization code (Try "SENA2026").');
        return;
      }
    }

    const registeredUsers = JSON.parse(localStorage.getItem('edunova_registered_users') || '[]');
    const exists = registeredUsers.some(u => u.correo.toLowerCase() === regData.correo.toLowerCase());
    if (exists) {
      setErrorMsg('An operator with this email address already exists.');
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

    setSuccessMsg('Operator credentials created. Launching session...');
    setTimeout(() => {
      localStorage.setItem('edunova_current_user', JSON.stringify(newUser));
      onLoginSuccess(newUser);
    }, 800);
  };

  const loadDemoCredentials = (role) => {
    setSelectedRole(role);
    setLoginEmail(roleConfig[role].demoEmail);
    setLoginPassword(roleConfig[role].demoPass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#101010] text-[#eeeeee] flex flex-col justify-between font-sans antialiased selection:bg-[#eeeeee] selection:text-[#101010]">
      
      {/* Top Header */}
      <header className="h-16 px-6 border-b border-[#3d3a39] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[3px] bg-[#1d1a18] border border-[#3d3a39] flex items-center justify-center">
            <img src="/edunova-logo.png" alt="EDUNOVA" className="w-5 h-5 object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#eeeeee]">EDUNOVA // FACTORY</span>
              <span className="status-pulse-orange"></span>
            </div>
            <p className="font-mono text-[10px] text-[#8a8380] uppercase">
              Academic Management System · Release 2.1
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-[#8a8380] uppercase px-3 py-1 rounded-[3px] border border-[#3d3a39]">
          <span className="status-pulse-green"></span>
          <span>Center for Industrial Training · SENA Huila</span>
        </div>
      </header>

      {/* Main War Room Body: Split figure/ground */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex items-center justify-center my-auto">
        
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-[10px] border border-[#3d3a39] bg-[#1d1a18] overflow-hidden shadow-2xl">
          
          {/* Left Panel: Role Selector & System Terminal */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-[#101010] border-b lg:border-b-0 lg:border-r border-[#3d3a39] flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#8a8380] uppercase tracking-wider">
                <Terminal size={12} className="text-[#ee6018]" />
                <span>Select Target Role</span>
              </div>

              <h2 className="text-2xl font-normal tracking-tight text-[#eeeeee]">
                Access Gate // Control
              </h2>

              <p className="text-xs text-[#8a8380] leading-relaxed">
                Choose the operational portal corresponding to your assigned role in the training center.
              </p>

              {/* Role Selectors */}
              <div className="space-y-2 pt-2">
                
                {/* 1. APRENDIZ */}
                <button
                  type="button"
                  onClick={() => { setSelectedRole('APRENDIZ'); setErrorMsg(''); }}
                  className={`w-full flex items-center justify-between p-3 rounded-[3px] border text-left transition-colors duration-150 ${
                    selectedRole === 'APRENDIZ'
                      ? 'bg-[#1d1a18] border-[#eeeeee] text-[#eeeeee]'
                      : 'bg-[#101010] border-[#3d3a39] text-[#8a8380] hover:text-[#eeeeee] hover:border-[#8a8380]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users size={16} className={selectedRole === 'APRENDIZ' ? 'text-[#a0ca92]' : 'text-[#8a8380]'} />
                    <div>
                      <p className="text-xs font-normal text-[#eeeeee]">Apprentice Portal</p>
                      <p className="font-mono text-[10px] text-[#8a8380]">Grades, attendance & AI tutor</p>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-[#8a8380]">01</span>
                </button>

                {/* 2. INSTRUCTOR */}
                <button
                  type="button"
                  onClick={() => { setSelectedRole('INSTRUCTOR'); setErrorMsg(''); }}
                  className={`w-full flex items-center justify-between p-3 rounded-[3px] border text-left transition-colors duration-150 ${
                    selectedRole === 'INSTRUCTOR'
                      ? 'bg-[#1d1a18] border-[#eeeeee] text-[#eeeeee]'
                      : 'bg-[#101010] border-[#3d3a39] text-[#8a8380] hover:text-[#eeeeee] hover:border-[#8a8380]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap size={16} className={selectedRole === 'INSTRUCTOR' ? 'text-[#ee6018]' : 'text-[#8a8380]'} />
                    <div>
                      <p className="text-xs font-normal text-[#eeeeee]">Instructor Portal</p>
                      <p className="font-mono text-[10px] text-[#8a8380]">Grading and attendance logs</p>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-[#8a8380]">02</span>
                </button>

                {/* 3. ADMIN */}
                <button
                  type="button"
                  onClick={() => { setSelectedRole('ADMIN'); setErrorMsg(''); }}
                  className={`w-full flex items-center justify-between p-3 rounded-[3px] border text-left transition-colors duration-150 ${
                    selectedRole === 'ADMIN'
                      ? 'bg-[#1d1a18] border-[#eeeeee] text-[#eeeeee]'
                      : 'bg-[#101010] border-[#3d3a39] text-[#8a8380] hover:text-[#eeeeee] hover:border-[#8a8380]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={16} className={selectedRole === 'ADMIN' ? 'text-[#eeeeee]' : 'text-[#8a8380]'} />
                    <div>
                      <p className="text-xs font-normal text-[#eeeeee]">Administration</p>
                      <p className="font-mono text-[10px] text-[#8a8380]">Cohorts, tracks & user catalog</p>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-[#8a8380]">03</span>
                </button>

              </div>
            </div>

            {/* 1-Click Demo Dispatch Triggers */}
            <div className="pt-4 border-t border-[#3d3a39] space-y-2">
              <p className="font-mono text-[10px] text-[#8a8380] uppercase tracking-wider">
                1-Click Dispatch Keys:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => loadDemoCredentials('APRENDIZ')}
                  className="px-2 py-1.5 bg-[#1d1a18] hover:bg-[#24211f] border border-[#3d3a39] rounded-[3px] font-mono text-[10px] text-[#eeeeee] truncate text-center transition-colors"
                >
                  Anyely (ADSO)
                </button>
                <button
                  type="button"
                  onClick={() => loadDemoCredentials('INSTRUCTOR')}
                  className="px-2 py-1.5 bg-[#1d1a18] hover:bg-[#24211f] border border-[#3d3a39] rounded-[3px] font-mono text-[10px] text-[#eeeeee] truncate text-center transition-colors"
                >
                  Instructor
                </button>
                <button
                  type="button"
                  onClick={() => loadDemoCredentials('ADMIN')}
                  className="px-2 py-1.5 bg-[#1d1a18] hover:bg-[#24211f] border border-[#3d3a39] rounded-[3px] font-mono text-[10px] text-[#eeeeee] truncate text-center transition-colors"
                >
                  Director
                </button>
              </div>
            </div>

          </div>

          {/* Right Panel: The Signature Bone Card (#eeeeee) or Crisp Carbon Surface */}
          <div className="lg:col-span-7 p-6 sm:p-8 bg-[#1d1a18] flex flex-col justify-between">
            
            <div>
              {/* Mode Switcher */}
              <div className="flex items-center justify-between border-b border-[#3d3a39] pb-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[#8a8380] uppercase tracking-wider">{currentRoleInfo.code}</span>
                    <span className="status-pulse-orange"></span>
                  </div>
                  <h3 className="text-lg font-normal text-[#eeeeee] tracking-tight mt-0.5">
                    {mode === 'login' ? `Authenticate as ${currentRoleInfo.badge}` : `Register New ${currentRoleInfo.badge}`}
                  </h3>
                </div>

                <div className="flex bg-[#101010] p-1 rounded-[3px] border border-[#3d3a39]">
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                    className={`px-3 py-1 rounded-[3px] font-mono text-xs transition-colors ${
                      mode === 'login' ? 'bg-[#1d1a18] text-[#eeeeee] border border-[#3d3a39]' : 'text-[#8a8380] hover:text-[#eeeeee]'
                    }`}
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                    className={`px-3 py-1 rounded-[3px] font-mono text-xs transition-colors ${
                      mode === 'register' ? 'bg-[#1d1a18] text-[#eeeeee] border border-[#3d3a39]' : 'text-[#8a8380] hover:text-[#eeeeee]'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              {/* Messages */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-[3px] bg-[#ee6018]/10 border border-[#ee6018]/40 text-[#ee6018] text-xs font-mono flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-3 rounded-[3px] bg-[#a0ca92]/10 border border-[#a0ca92]/40 text-[#a0ca92] text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 size={15} className="shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* LOGIN FORM */}
              {mode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  
                  <div>
                    <label className="block font-mono text-[11px] text-[#8a8380] uppercase tracking-wider mb-1.5">
                      Institutional Identifier ({currentRoleInfo.badge})
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8380]" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="operator@edunova.edu.co"
                        className="w-full pl-9 pr-3 py-2 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] font-sans placeholder:text-[#4d4947] focus:outline-none focus:border-[#eeeeee] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-[#8a8380] uppercase tracking-wider mb-1.5">
                      Access Key / Secret
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8380]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-10 py-2 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] font-sans placeholder:text-[#4d4947] focus:outline-none focus:border-[#eeeeee] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8380] hover:text-[#eeeeee]"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-[#8a8380]">
                      <input type="checkbox" defaultChecked className="rounded-[3px] bg-[#101010] border-[#3d3a39] text-[#eeeeee]" />
                      <span className="font-mono text-[11px]">Remember terminal session</span>
                    </label>
                    <a 
                      href="#recovery" 
                      onClick={(e) => { e.preventDefault(); alert('Use the 1-Click Dispatch buttons for instant session bypass.'); }} 
                      className="font-mono text-[11px] text-[#8a8380] hover:text-[#eeeeee]"
                    >
                      Lost access key?
                    </a>
                  </div>

                  {/* Primary Light Button (Chalk #fafafa on dark ground) */}
                  <button
                    type="submit"
                    className="w-full mt-3 py-2.5 px-4 bg-[#fafafa] hover:bg-[#ffffff] text-[#101010] font-normal rounded-[3px] text-xs flex items-center justify-center gap-2 transition-opacity"
                  >
                    <span>Commit Session as {currentRoleInfo.badge}</span>
                    <ArrowRight size={14} />
                  </button>

                </form>
              ) : (
                
                /* REGISTRATION FORM */
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        value={regData.nombre}
                        onChange={(e) => setRegData({...regData, nombre: e.target.value})}
                        placeholder="Anyely Valeria"
                        className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none focus:border-[#eeeeee]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={regData.apellido}
                        onChange={(e) => setRegData({...regData, apellido: e.target.value})}
                        placeholder="Bautista"
                        className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none focus:border-[#eeeeee]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Government ID (CC) *</label>
                    <input
                      type="text"
                      required
                      value={regData.documento}
                      onChange={(e) => setRegData({...regData, documento: e.target.value})}
                      placeholder="1075689123"
                      className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none focus:border-[#eeeeee]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Institutional Email *</label>
                    <input
                      type="email"
                      required
                      value={regData.correo}
                      onChange={(e) => setRegData({...regData, correo: e.target.value})}
                      placeholder="anyely@edunova.edu.co"
                      className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none focus:border-[#eeeeee]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Secret Key *</label>
                      <input
                        type="password"
                        required
                        value={regData.password}
                        onChange={(e) => setRegData({...regData, password: e.target.value})}
                        placeholder="Min. 6 chars"
                        className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none focus:border-[#eeeeee]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Confirm Secret *</label>
                      <input
                        type="password"
                        required
                        value={regData.confirmPassword}
                        onChange={(e) => setRegData({...regData, confirmPassword: e.target.value})}
                        placeholder="Repeat secret"
                        className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none focus:border-[#eeeeee]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-2.5 px-4 bg-[#fafafa] hover:bg-[#ffffff] text-[#101010] font-normal rounded-[3px] text-xs flex items-center justify-center gap-2 transition-opacity"
                  >
                    <span>Register {currentRoleInfo.badge} Credentials</span>
                    <ArrowRight size={14} />
                  </button>
                </form>
              )}

            </div>

            {/* Footer switcher */}
            <div className="pt-4 mt-4 border-t border-[#3d3a39] text-center font-mono text-[11px] text-[#8a8380]">
              {mode === 'login' ? 'Unregistered operator? ' : 'Already provisioned? '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-[#eeeeee] hover:underline uppercase"
              >
                {mode === 'login' ? 'Provision Credentials' : 'Login Existing Terminal'}
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="h-12 border-t border-[#3d3a39] px-6 flex items-center justify-between font-mono text-[11px] text-[#8a8380]">
        <span>FACTORY // EDUNOVA ACADEMIC WAR ROOM</span>
        <span>SENA REGIONAL HUILA · ADSO 2026</span>
      </footer>

    </div>
  );
}
