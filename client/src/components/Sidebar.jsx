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
  Shield, 
  Settings,
  HelpCircle,
  ExternalLink
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

  // Secciones de navegación
  const navItems = [
    {
      group: 'PRINCIPAL',
      items: [
        { id: 'dashboard', label: 'Panel de Control', icon: LayoutDashboard },
        { 
          id: 'cursos', 
          label: user.rol === 'APRENDIZ' ? 'Mis Cursos' : 'Cursos & Fichas', 
          icon: BookOpen 
        },
        { 
          id: 'calificaciones', 
          label: user.rol === 'APRENDIZ' ? 'Mis Calificaciones' : 'Calificaciones', 
          icon: ClipboardList 
        },
        { 
          id: 'asistencia', 
          label: user.rol === 'APRENDIZ' ? 'Mi Asistencia' : 'Control Asistencia', 
          icon: CalendarCheck 
        },
      ]
    },
    {
      group: 'GESTIÓN & MÉTRICAS',
      items: [
        ...(user.rol === 'ADMIN' || user.rol === 'INSTRUCTOR' ? [
          { id: 'aprendices', label: 'Aprendices', icon: Users },
        ] : []),
        ...(user.rol === 'ADMIN' ? [
          { id: 'instructores', label: 'Instructores', icon: GraduationCap },
        ] : []),
        { id: 'reportes', label: 'Reportes & Analítica', icon: BarChart3 },
      ]
    },
    {
      group: 'INTELIGENCIA ARTIFICIAL',
      items: [
        { 
          id: 'ai', 
          label: 'EDUNOVA AI', 
          icon: Sparkles, 
          badge: 'SaaS IA',
          isAI: true 
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static top-0 left-0 h-screen z-50
        bg-edunova-midnight text-white flex flex-col justify-between
        border-r border-slate-800/80 shadow-2xl transition-all duration-300 ease-in-out select-none
        ${isCollapsed ? 'w-20' : 'w-72'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* ========================================================== */}
        {/* HEADER DEL SIDEBAR: LOGO & BOTÓN DE COLAPSO                */}
        {/* ========================================================== */}
        <div>
          <div className="h-20 px-5 flex items-center justify-between border-b border-white/10 bg-black/20">
            
            <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
              <div className="relative group shrink-0">
                <div className="w-11 h-11 rounded-xl bg-white p-1 shadow-lg shadow-black/40 border-2 border-edunova-gold flex items-center justify-center transition-transform group-hover:scale-105">
                  <img 
                    src="/edunova-logo.png" 
                    alt="EDUNOVA" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-edunova-success border-2 border-edunova-midnight"></span>
              </div>

              {!isCollapsed && (
                <div className="truncate animate-fadeIn">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-lg text-white tracking-tight">EDUNOVA</span>
                    <span className="text-[10px] uppercase font-bold text-slate-900 bg-edunova-gold px-1.5 py-0.2 rounded font-mono">
                      SaaS
                    </span>
                  </div>
                  <p className="text-[11px] text-edunova-goldLight font-medium tracking-wide uppercase truncate">
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
                className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
            )}
          </div>

          {/* Botón para expandir cuando está colapsado */}
          {isCollapsed && (
            <div className="hidden lg:flex justify-center py-2 border-b border-white/5">
              <button 
                onClick={() => setIsCollapsed(false)}
                title="Expandir menú"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* ========================================================== */}
          {/* NAVEGACIÓN Y SECCIONES                                     */}
          {/* ========================================================== */}
          <nav className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-170px)]">
            
            {navItems.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {!isCollapsed && (
                  <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
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
                          w-full flex items-center rounded-xl text-xs font-semibold transition-all duration-200
                          ${isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'}
                          ${isActive 
                            ? item.isAI
                              ? 'bg-gradient-to-r from-edunova-violet to-edunova-electric text-white shadow-ai-glow'
                              : 'bg-gradient-to-r from-edunova-gold to-edunova-goldLight text-slate-950 font-bold shadow-gold-glow'
                            : item.isAI
                              ? 'text-edunova-violet hover:bg-white/5 hover:text-white'
                              : 'text-slate-300 hover:bg-white/10 hover:text-white'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <Icon 
                            size={18} 
                            className={`shrink-0 ${
                              isActive 
                                ? (item.isAI ? 'text-white' : 'text-slate-950')
                                : (item.isAI ? 'text-edunova-violet animate-pulseSlow' : 'text-slate-400 group-hover:text-white')
                            }`} 
                          />
                          {!isCollapsed && <span>{item.label}</span>}
                        </div>

                        {!isCollapsed && item.badge && (
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                            isActive ? 'bg-white/20 text-white' : 'bg-edunova-violet/20 text-edunova-violet border border-edunova-violet/30'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>

                      {/* Tooltip flotante al estar contraído */}
                      {isCollapsed && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-xl border border-slate-700 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
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
        {/* PERFIL DEL USUARIO & DROPDOWN EN EL PIE                     */}
        {/* ========================================================== */}
        <div className="p-3 border-t border-white/10 bg-black/25 relative">
          
          <div className="flex items-center justify-between">
            
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`flex items-center gap-3 overflow-hidden text-left p-1.5 rounded-xl hover:bg-white/5 transition-colors w-full ${isCollapsed ? 'justify-center' : ''}`}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-edunova-gold to-amber-200 border border-edunova-gold flex items-center justify-center text-slate-950 font-black text-sm shrink-0 shadow-md">
                {initials}
              </div>

              {!isCollapsed && (
                <div className="truncate flex-1">
                  <p className="text-xs font-bold text-white truncate">
                    {user?.nombre} {user?.apellido}
                  </p>
                  <p className="text-[11px] text-edunova-gold font-medium truncate">
                    {user?.rol === 'APRENDIZ' ? 'Aprendiz ADSO' : user?.rol === 'INSTRUCTOR' ? 'Docente Titular' : 'Administrador'}
                  </p>
                </div>
              )}
            </button>

            {!isCollapsed && (
              <button 
                onClick={onLogout}
                title="Cerrar sesión"
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors ml-1 shrink-0"
              >
                <LogOut size={17} />
              </button>
            )}

          </div>

          {/* Menú desplegable de perfil */}
          {showProfileMenu && (
            <div className={`absolute bottom-full mb-2 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 animate-slideUp ${isCollapsed ? 'left-4 w-56' : 'left-3 right-3'}`}>
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-bold text-white truncate">{user?.nombre} {user?.apellido}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.correo}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-edunova-gold/20 text-edunova-gold text-[10px] font-mono font-bold uppercase">
                  {user?.rol}
                </span>
              </div>
              <div className="py-1">
                <button 
                  onClick={() => { setShowProfileMenu(false); setActiveTab('dashboard'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                >
                  <User size={15} />
                  <span>Mi Perfil Académico</span>
                </button>
                <button 
                  onClick={() => { setShowProfileMenu(false); alert('Ajustes del sistema disponibles en versión final.'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                >
                  <Settings size={15} />
                  <span>Configuración</span>
                </button>
              </div>
              <div className="pt-1 border-t border-slate-800">
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-semibold"
                >
                  <LogOut size={15} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </aside>
    </>
  );
}

