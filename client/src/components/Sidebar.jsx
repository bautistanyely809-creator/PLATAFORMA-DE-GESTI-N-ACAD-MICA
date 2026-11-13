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

  // Secciones de navegación con identidades cromáticas Ocean Tech
  const navItems = [
    {
      group: 'PANEL EDUCATIVO',
      items: [
        { 
          id: 'dashboard', 
          label: 'Panel de Control', 
          icon: LayoutDashboard,
          bgCircle: 'bg-[#17365D] text-[#48BFE3]' 
        },
        { 
          id: 'cursos', 
          label: user.rol === 'APRENDIZ' ? 'Mis Cursos' : 'Cursos & Fichas', 
          icon: BookOpen,
          bgCircle: 'bg-[#17365D] text-[#19B5A5]' 
        },
        { 
          id: 'calificaciones', 
          label: user.rol === 'APRENDIZ' ? 'Mis Calificaciones' : 'Calificaciones', 
          icon: ClipboardList,
          bgCircle: 'bg-[#17365D] text-[#70D6B3]' 
        },
        { 
          id: 'asistencia', 
          label: user.rol === 'APRENDIZ' ? 'Mi Asistencia' : 'Control Asistencia', 
          icon: CalendarCheck,
          bgCircle: 'bg-[#17365D] text-[#E9B949]' 
        },
      ]
    },
    {
      group: 'GESTIÓN & ANALÍTICA',
      items: [
        ...(user.rol === 'ADMIN' || user.rol === 'INSTRUCTOR' ? [
          { id: 'aprendices', label: 'Aprendices', icon: Users, bgCircle: 'bg-[#17365D] text-[#48BFE3]' },
        ] : []),
        ...(user.rol === 'ADMIN' ? [
          { id: 'instructores', label: 'Instructores', icon: GraduationCap, bgCircle: 'bg-[#17365D] text-[#19B5A5]' },
        ] : []),
        { 
          id: 'reportes', 
          label: 'Reportes & Métricas', 
          icon: BarChart3,
          bgCircle: 'bg-[#17365D] text-[#48BFE3]' 
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
          bgCircle: 'bg-gradient-to-tr from-[#123B50] to-[#19B5A5] text-[#48BFE3] shadow-sm'
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
          className="fixed inset-0 bg-[#102A43]/60 backdrop-blur-md z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Ocean Tech Container */}
      <aside className={`
        fixed lg:static top-0 left-0 h-screen z-50
        p-3 sm:p-4 transition-all duration-300 ease-in-out select-none
        ${isCollapsed ? 'w-24' : 'w-72'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Panel de Cristal Azul Petróleo / Noche */}
        <div className="h-full bg-[#123B50]/95 backdrop-blur-2xl border border-[#17365D]/60 rounded-[28px] shadow-glass flex flex-col justify-between overflow-hidden text-white">
          
          {/* ========================================================== */}
          {/* HEADER: LOGO & BOTÓN DE COLAPSO                            */}
          {/* ========================================================== */}
          <div>
            <div className="h-20 px-5 flex items-center justify-between border-b border-[#17365D]/70 bg-gradient-to-r from-[#102A43]/80 to-[#123B50]/80">
              
              <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
                <div className="relative group shrink-0">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#102A43] via-[#17365D] to-[#19B5A5] p-1.5 shadow-md shadow-[#19B5A5]/20 border border-[#19B5A5]/40 flex items-center justify-center transition-transform group-hover:scale-105">
                    <img 
                      src="/edunova-logo.png" 
                      alt="EDUNOVA" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#19B5A5] border-2 border-[#123B50]"></span>
                </div>

                {!isCollapsed && (
                  <div className="truncate animate-fadeIn">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-base text-white tracking-tight">EDUNOVA</span>
                      <span className="text-[9px] uppercase font-bold text-[#48BFE3] bg-[#17365D] px-1.5 py-0.5 rounded-full font-mono border border-[#48BFE3]/30">
                        Tech
                      </span>
                    </div>
                    <p className="text-[10px] text-[#DCEEF5]/70 font-semibold tracking-wider uppercase truncate">
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
                  className="hidden lg:flex p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
              )}
            </div>

            {/* Botón para expandir cuando está colapsado */}
            {isCollapsed && (
              <div className="hidden lg:flex justify-center py-2 border-b border-[#17365D]/40">
                <button 
                  onClick={() => setIsCollapsed(false)}
                  title="Expandir menú"
                  className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* ========================================================== */}
            {/* LISTA DE NAVEGACIÓN OCEAN TECH                             */}
            {/* ========================================================== */}
            <nav className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-180px)]">
              
              {navItems.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1.5">
                  {!isCollapsed && (
                    <p className="px-3 text-[10px] font-extrabold text-[#718096] uppercase tracking-wider">
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
                              ? 'bg-gradient-to-r from-[#17365D] via-[#123B50] to-[#19B5A5] text-white shadow-ocean-glow border border-[#19B5A5]/30'
                              : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                              isActive ? 'bg-[#19B5A5] text-white' : item.bgCircle
                            }`}>
                              <Icon size={16} />
                            </div>
                            {!isCollapsed && <span>{item.label}</span>}
                          </div>

                          {!isCollapsed && item.badge && (
                            <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                              isActive ? 'bg-white/20 text-white' : 'bg-[#17365D] text-[#48BFE3] border border-[#48BFE3]/30'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </button>

                        {/* Tooltip flotante al estar colapsado */}
                        {isCollapsed && (
                          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-[#102A43] text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 border border-[#17365D]">
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
          {/* PERFIL DEL USUARIO OCEAN TECH                              */}
          {/* ========================================================== */}
          <div className="p-3 border-t border-[#17365D]/70 bg-gradient-to-b from-[#102A43]/50 to-[#123B50]/90 relative">
            
            <div className="flex items-center justify-between">
              
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`flex items-center gap-3 rounded-2xl hover:bg-white/10 p-2 transition-all text-left flex-1 min-w-0 ${isCollapsed ? 'justify-center' : ''}`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#17365D] to-[#19B5A5] text-white font-extrabold text-xs flex items-center justify-center shadow-md shadow-[#19B5A5]/20 shrink-0 border border-[#19B5A5]/40">
                  {initials}
                </div>

                {!isCollapsed && (
                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate">
                      {user?.nombre} {user?.apellido}
                    </p>
                    <span className="inline-block text-[10px] font-bold text-[#48BFE3] uppercase">
                      {user?.rol || 'APRENDIZ'}
                    </span>
                  </div>
                )}
              </button>

              {!isCollapsed && (
                <button
                  onClick={onLogout}
                  title="Cerrar sesión"
                  className="p-2 text-slate-300 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors ml-1"
                >
                  <LogOut size={16} />
                </button>
              )}

            </div>

            {/* Menú Desplegable de Perfil */}
            {showProfileMenu && (
              <div className="absolute bottom-full left-3 right-3 mb-2 bg-[#102A43] border border-[#17365D] rounded-2xl p-2 shadow-2xl space-y-1 animate-slideUp text-xs z-50">
                <div className="px-3 py-2 border-b border-[#17365D]/70">
                  <p className="font-bold text-white">{user?.nombre} {user?.apellido}</p>
                  <p className="text-[11px] text-[#718096] truncate">{user?.correo}</p>
                </div>
                
                <button 
                  onClick={() => { setActiveTab('dashboard'); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:bg-white/10 transition-colors"
                >
                  <User size={14} className="text-[#48BFE3]" />
                  <span>Mi Perfil Académico</span>
                </button>

                <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-bold"
                >
                  <LogOut size={14} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}

          </div>

        </div>

      </aside>
    </>
  );
}
