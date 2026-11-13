import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  ClipboardList, 
  CalendarCheck, 
  BarChart3, 
  Sparkles, 
  Users, 
  GraduationCap, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  User, 
  Settings,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  user, 
  onLogout,
  isMobileOpen,
  setIsMobileOpen 
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const initials = `${user?.nombre?.charAt(0) || 'U'}${user?.apellido?.charAt(0) || ''}`;

  // Secciones de navegación con identidades cromáticas pastel
  const navItems = [
    {
      group: 'PANEL EDUCATIVO',
      items: [
        { 
          id: 'dashboard', 
          label: 'Panel de Control', 
          icon: LayoutDashboard,
          bgCircle: 'bg-[#FCE4F2] text-[#8064D8]' 
        },
        { 
          id: 'cursos', 
          label: user.rol === 'APRENDIZ' ? 'Mis Cursos' : 'Cursos & Fichas', 
          icon: BookOpen,
          bgCircle: 'bg-[#DCEBFA] text-[#3978F6]' 
        },
        { 
          id: 'calificaciones', 
          label: user.rol === 'APRENDIZ' ? 'Mis Calificaciones' : 'Calificaciones', 
          icon: ClipboardList,
          bgCircle: 'bg-[#E6F9F2] text-[#16A36A]' 
        },
        { 
          id: 'asistencia', 
          label: user.rol === 'APRENDIZ' ? 'Mi Asistencia' : 'Control Asistencia', 
          icon: CalendarCheck,
          bgCircle: 'bg-[#FFF6DC] text-[#DCA91F]' 
        },
      ]
    },
    {
      group: 'GESTIÓN & ANALÍTICA',
      items: [
        ...(user.rol === 'ADMIN' || user.rol === 'INSTRUCTOR' ? [
          { id: 'aprendices', label: 'Aprendices', icon: Users, bgCircle: 'bg-[#FCE4F2] text-[#D6409B]' },
        ] : []),
        ...(user.rol === 'ADMIN' ? [
          { id: 'instructores', label: 'Instructores', icon: GraduationCap, bgCircle: 'bg-[#EDE7FA] text-[#8064D8]' },
        ] : []),
        { 
          id: 'reportes', 
          label: 'Reportes & Métricas', 
          icon: BarChart3,
          bgCircle: 'bg-[#E9F4FE] text-[#3978F6]' 
        },
      ]
    },
    {
      group: 'INTELIGENCIA ARTIFICIAL',
      items: [
        { 
          id: 'ai', 
          label: 'EDUNOVA AI', 
          icon: Sparkles, 
          badge: 'Tutor IA',
          isAI: true,
          bgCircle: 'bg-gradient-to-tr from-[#F7B8DC] to-[#C8B5F5] text-white shadow-sm'
        },
      ]
    }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Overlay para móviles */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-[#392C52]/30 backdrop-blur-md z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Glassmorphism Container */}
      <aside className={`
        fixed lg:static top-0 left-0 h-screen z-50
        p-3 sm:p-4 transition-all duration-300 ease-in-out select-none
        ${isCollapsed ? 'w-24' : 'w-72'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Panel de Cristal */}
        <div className="h-full bg-white/80 backdrop-blur-2xl border border-white/80 rounded-[28px] shadow-glass flex flex-col justify-between overflow-hidden">
          
          {/* ========================================================== */}
          {/* HEADER: LOGO & BOTÓN DE COLAPSO                            */}
          {/* ========================================================== */}
          <div>
            <div className="h-20 px-5 flex items-center justify-between border-b border-purple-100/60 bg-gradient-to-r from-white/90 to-purple-50/40">
              
              <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
                <div className="relative group shrink-0">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FCE4F2] via-white to-[#DCEBFA] p-1.5 shadow-md shadow-purple-200/50 border border-white flex items-center justify-center transition-transform group-hover:scale-105">
                    <img 
                      src="/edunova-logo.png" 
                      alt="EDUNOVA" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-edunova-mint border-2 border-white"></span>
                </div>

                {!isCollapsed && (
                  <div className="truncate animate-fadeIn">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-base text-edunova-textPrimary tracking-tight">EDUNOVA</span>
                      <span className="text-[9px] uppercase font-bold text-[#8064D8] bg-[#EDE7FA] px-1.5 py-0.5 rounded-full font-mono">
                        Soft UI
                      </span>
                    </div>
                    <p className="text-[10px] text-edunova-textSecondary font-semibold tracking-wider uppercase truncate">
                      Academic Management
                    </p>
                  </div>
                )}
              </div>

              {/* Botón para contraer/expandir en escritorio */}
              {!isCollapsed && (
                <button 
                  onClick={() => setIsCollapsed(true)}
                  title="Contraer menú"
                  className="hidden lg:flex p-1.5 rounded-xl text-edunova-textSecondary hover:text-edunova-textPrimary hover:bg-purple-50/80 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
              )}
            </div>

            {/* Botón para expandir cuando está colapsado */}
            {isCollapsed && (
              <div className="hidden lg:flex justify-center py-2 border-b border-purple-100/40">
                <button 
                  onClick={() => setIsCollapsed(false)}
                  title="Expandir menú"
                  className="p-1.5 rounded-xl text-edunova-textSecondary hover:text-edunova-textPrimary hover:bg-purple-50/80 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* ========================================================== */}
            {/* LISTA DE NAVEGACIÓN PASTEL GLASS                           */}
            {/* ========================================================== */}
            <nav className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-180px)]">
              
              {navItems.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1.5">
                  {!isCollapsed && (
                    <p className="px-3 text-[10px] font-extrabold text-[#9A90AC] uppercase tracking-wider">
                      {group.group}
                    </p>
                  )}

                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <div key={item.id} className="relative group">
                        <button
                          onClick={() => handleNavClick(item.id)}
                          className={`
                            w-full flex items-center rounded-2xl text-xs font-bold transition-all duration-300
                            ${isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'}
                            ${isActive 
                              ? item.isAI
                                ? 'bg-gradient-to-r from-edunova-pinkPastel via-edunova-lavender to-edunova-violet text-white shadow-pastel-violet'
                                : 'bg-gradient-to-r from-edunova-pinkPastel via-[#E9D9FC] to-edunova-lavender text-edunova-textPrimary shadow-pastel-pink'
                              : 'text-edunova-textSecondary hover:bg-purple-50/70 hover:text-edunova-textPrimary'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${item.bgCircle}`}>
                              <Icon size={16} />
                            </div>
                            {!isCollapsed && <span>{item.label}</span>}
                          </div>

                          {!isCollapsed && item.badge && (
                            <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                              isActive ? 'bg-white/30 text-white' : 'bg-[#EDE7FA] text-edunova-violet'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </button>

                        {/* Tooltip flotante al estar colapsado */}
                        {isCollapsed && (
                          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-edunova-textPrimary text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                            {item.label}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

            </nav>
          </div>

          {/* ========================================================== */}
          {/* PERFIL DEL USUARIO EN PASTEL GLASS                         */}
          {/* ========================================================== */}
          <div className="p-3 border-t border-purple-100/60 bg-gradient-to-b from-white/40 to-purple-50/60 relative">
            
            <div className="flex items-center justify-between">
              
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`flex items-center gap-3 overflow-hidden text-left p-1.5 rounded-2xl hover:bg-white/80 transition-all w-full ${isCollapsed ? 'justify-center' : ''}`}
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F7B8DC] via-[#C8B5F5] to-[#A5D8FA] p-0.5 shadow-md shadow-purple-200/50 shrink-0">
                  <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-edunova-violet font-extrabold text-xs">
                    {initials}
                  </div>
                </div>

                {!isCollapsed && (
                  <div className="truncate flex-1">
                    <p className="text-xs font-bold text-edunova-textPrimary truncate">
                      {user?.nombre} {user?.apellido}
                    </p>
                    <p className="text-[10px] text-edunova-violet font-semibold truncate">
                      {user?.rol === 'APRENDIZ' ? 'Aprendiz ADSO' : user?.rol === 'INSTRUCTOR' ? 'Docente Titular' : 'Administrador'}
                    </p>
                  </div>
                )}
              </button>

              {!isCollapsed && (
                <button 
                  onClick={onLogout}
                  title="Cerrar sesión"
                  className="p-2 text-edunova-textSecondary hover:text-red-500 hover:bg-red-50/80 rounded-xl transition-colors ml-1 shrink-0"
                >
                  <LogOut size={16} />
                </button>
              )}

            </div>

            {/* Menú emergente de perfil */}
            {showProfileMenu && (
              <div className={`absolute bottom-full mb-3 bg-white/95 backdrop-blur-2xl border border-white rounded-3xl p-3 shadow-2xl z-50 animate-slideUp ${isCollapsed ? 'left-4 w-60' : 'left-3 right-3'}`}>
                <div className="px-3 py-2 border-b border-purple-100/80">
                  <p className="text-xs font-bold text-edunova-textPrimary truncate">{user?.nombre} {user?.apellido}</p>
                  <p className="text-[10px] text-edunova-textSecondary truncate">{user?.correo}</p>
                  <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-[#EDE7FA] text-edunova-violet text-[9px] font-mono font-bold uppercase">
                    {user?.rol}
                  </span>
                </div>
                <div className="py-1.5">
                  <button 
                    onClick={() => { setShowProfileMenu(false); setActiveTab('dashboard'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-edunova-textPrimary hover:bg-purple-50/80 rounded-xl transition-colors font-semibold"
                  >
                    <User size={15} className="text-edunova-violet" />
                    <span>Mi Perfil Académico</span>
                  </button>
                </div>
                <div className="pt-1.5 border-t border-purple-100/80">
                  <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded-xl transition-colors font-bold"
                  >
                    <LogOut size={15} />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </aside>
    </>
  );
}
