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
  ShieldCheck, 
  Award, 
  RotateCcw, 
  Bell, 
  Calendar, 
  UserCheck, 
  AlertTriangle, 
  Building2, 
  FileText,
  Layers
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  user, 
  onLogout,
  isMobileOpen,
  setIsMobileOpen,
  onOpenPerfil
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const initials = `${user?.nombre?.charAt(0) || 'U'}${user?.apellido?.charAt(0) || ''}`;

  const navItems = [
    {
      group: 'NÚCLEO ACADÉMICO',
      items: [
        { 
          id: 'dashboard', 
          label: 'Panel de Control', 
          icon: LayoutDashboard,
          code: '01'
        },
        { 
          id: 'competencias', 
          label: 'M1. Competencias & RAPs', 
          icon: Award,
          code: '02'
        },
        { 
          id: 'evidencias', 
          label: 'M2. Gestión de Evidencias', 
          icon: ClipboardList,
          code: '03'
        },
        { 
          id: 'recuperaciones', 
          label: 'M3. Recuperaciones', 
          icon: RotateCcw,
          code: '04'
        },
        { 
          id: 'asistencia', 
          label: 'M4. Control Asistencia', 
          icon: CalendarCheck,
          code: '05'
        },
      ]
    },
    ...(user?.rol === 'ADMIN' || user?.rol === 'INSTRUCTOR' ? [{
      group: 'GESTIÓN INSTITUCIONAL',
      items: [
        {
          id: 'usuarios',
          label: 'Directorio de Usuarios',
          icon: Users,
          code: 'U1'
        },
        {
          id: 'academico',
          label: 'Estructura Curricular',
          icon: Layers,
          code: 'U2'
        }
      ]
    }] : []),
    {
      group: 'ANALÍTICA Y COMUNICACIONES',
      items: [
        { 
          id: 'reportes', 
          label: 'M5. Reportes PDF & Excel', 
          icon: BarChart3,
          code: '06'
        },
        { 
          id: 'notificaciones', 
          label: 'M6. Notificaciones', 
          icon: Bell,
          code: '07'
        },
      ]
    },
    {
      group: 'INTELIGENCIA ARTIFICIAL',
      items: [
        { 
          id: 'ai', 
          label: 'M7. EDUNOVA AI (MySQL 8)', 
          icon: Sparkles, 
          badge: 'EN VIVO',
          isAI: true,
          code: '08'
        },
      ]
    },
    {
      group: 'MÓDULOS DE EXPANSIÓN',
      items: [
        { 
          id: 'calendario', 
          label: 'Calendario Académico', 
          icon: Calendar,
          code: '09'
        },
        { 
          id: 'perfil360', 
          label: 'Perfil Académico 360°', 
          icon: UserCheck,
          code: '10'
        },
        { 
          id: 'alertas', 
          label: 'Alertas Tempranas', 
          icon: AlertTriangle,
          badge: 'PREVENTIVO',
          code: '11'
        },
        { 
          id: 'aula_virtual', 
          label: 'Aula Virtual LMS', 
          icon: BookOpen,
          code: '12'
        },
        { 
          id: 'ambientes', 
          label: 'Gestión de Ambientes', 
          icon: Building2,
          code: '13'
        },
        { 
          id: 'solicitudes', 
          label: 'Centro de Solicitudes', 
          icon: FileText,
          code: '14'
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
      {/* Fondo en móvil */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Contenedor del Sidebar */}
      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50
        bg-[#101010] border-r border-[#3d3a39] flex flex-col justify-between
        transition-all duration-200 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Cabecera del Sidebar */}
        <div className="h-16 px-4 border-b border-[#3d3a39] flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-[3px] bg-[#1d1a18] border border-[#3d3a39] flex items-center justify-center font-bold text-[#ee6018] shrink-0">
              E
            </div>
            
            {!isCollapsed && (
              <div className="truncate">
                <span className="font-mono text-xs font-medium uppercase tracking-wider text-[#eeeeee] block truncate">
                  EDUNOVA // AMS
                </span>
                <span className="font-mono text-[10px] text-[#8a8380] uppercase block">
                  ADSO SENA HUILA
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-[3px] text-[#8a8380] hover:text-[#eeeeee] hover:bg-[#1d1a18] border border-transparent hover:border-[#3d3a39] transition-colors"
            title={isCollapsed ? "Expandir menú" : "Contraer menú"}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Lista de Navegación Scrolleable */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
          <nav className="space-y-4">
            
            {navItems.map((section, idx) => (
              <div key={idx} className="space-y-1">
                {!isCollapsed && (
                  <div className="px-2.5 pb-1">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#8a8380]">
                      {section.group}
                    </span>
                  </div>
                )}

                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <div key={item.id} className="relative group">
                      <button
                        onClick={() => handleNavClick(item.id)}
                        className={`
                          w-full flex items-center rounded-[3px] text-xs font-normal transition-all duration-150
                          ${isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'}
                          ${isActive 
                            ? 'bg-[#1d1a18] text-[#eeeeee] border border-[#3d3a39]' 
                            : 'text-[#8a8380] hover:bg-[#1d1a18]/60 hover:text-[#eeeeee] border border-transparent'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon size={15} className={isActive ? 'text-[#eeeeee]' : 'text-[#8a8380]'} />
                          {!isCollapsed && (
                            <span className="tracking-tight">{item.label}</span>
                          )}
                        </div>

                        {!isCollapsed && (
                          <div className="flex items-center gap-1.5">
                            {item.badge && (
                              <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-[3px] bg-[#ee6018]/10 text-[#ee6018] border border-[#ee6018]/30">
                                {item.badge}
                              </span>
                            )}
                            <span className="font-mono text-[10px] text-[#3d3a39] group-hover:text-[#8a8380]">
                              {item.code}
                            </span>
                          </div>
                        )}
                      </button>

                      {/* Tooltip cuando está contraído */}
                      {isCollapsed && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 bg-[#1d1a18] text-[#eeeeee] border border-[#3d3a39] font-mono text-[11px] uppercase rounded-[3px] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
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

        {/* Pie de Página de Usuario */}
        <div className="p-3 border-t border-[#3d3a39] bg-[#101010] relative">
          
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`flex items-center gap-2.5 rounded-[3px] hover:bg-[#1d1a18] p-1.5 transition-all text-left flex-1 min-w-0 ${isCollapsed ? 'justify-center' : ''}`}
            >
              <div className="w-8 h-8 rounded-[3px] bg-[#1d1a18] border border-[#3d3a39] text-[#eeeeee] font-mono text-xs flex items-center justify-center shrink-0">
                {initials}
              </div>

              {!isCollapsed && (
                <div className="truncate">
                  <p className="text-xs text-[#eeeeee] font-normal truncate">
                    {user?.nombre} {user?.apellido}
                  </p>
                  <p className="font-mono text-[10px] text-[#8a8380] uppercase truncate">
                    {user?.rol || 'APRENDIZ'}
                  </p>
                </div>
              )}
            </button>

            {!isCollapsed && (
              <button
                onClick={onLogout}
                title="Cerrar sesión segura (HU-05)"
                className="p-1.5 text-[#8a8380] hover:text-[#ee6018] hover:bg-[#1d1a18] rounded-[3px] border border-transparent hover:border-[#3d3a39] transition-colors ml-1"
              >
                <LogOut size={15} />
              </button>
            )}
          </div>

          {/* Menú Desplegable de Perfil */}
          {showProfileMenu && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-[#1d1a18] border border-[#3d3a39] rounded-[3px] p-2 shadow-2xl space-y-1 text-xs z-50">
              <div className="px-2 py-1.5 border-b border-[#3d3a39]">
                <p className="text-[#eeeeee] font-normal">{user?.nombre} {user?.apellido}</p>
                <p className="font-mono text-[11px] text-[#8a8380] truncate">{user?.correo}</p>
              </div>
              
              <button 
                onClick={() => { 
                  if (onOpenPerfil) onOpenPerfil(); 
                  setShowProfileMenu(false); 
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-[3px] text-[#eeeeee] hover:bg-[#101010] transition-colors text-left"
              >
                <User size={13} className="text-[#a0ca92]" />
                <span>Perfil de Usuario (HU-04)</span>
              </button>

              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-[3px] text-[#ee6018] hover:bg-[#101010] transition-colors font-mono uppercase text-[11px] text-left"
              >
                <LogOut size={13} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}

        </div>

      </aside>
    </>
  );
}
