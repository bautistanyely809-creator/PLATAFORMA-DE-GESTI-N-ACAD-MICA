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
  ShieldCheck,
  Terminal,
  Award,
  RotateCcw,
  Bell
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

  const navItems = [
    {
      group: 'ACADEMIC CORE',
      items: [
        { 
          id: 'dashboard', 
          label: 'Dashboard Operativo', 
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
    {
      group: 'ANALYTICS & COMMS',
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
      group: 'MACHINE INTELLIGENCE',
      items: [
        { 
          id: 'ai', 
          label: 'M7. EDUNOVA AI (MySQL 8)', 
          icon: Sparkles, 
          badge: 'LIVE',
          isAI: true,
          code: '08'
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
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-[#101010]/80 z-40 lg:hidden"
        />
      )}

      {/* Factory Sidebar */}
      <aside className={`
        fixed lg:static top-0 left-0 h-screen z-50
        transition-all duration-150 ease-in-out select-none
        bg-[#101010] border-r border-[#3d3a39] flex flex-col justify-between
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        <div>
          {/* Top Wordmark & Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-[#3d3a39]">
            
            <div className={`flex items-center gap-2.5 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
              <div className="w-8 h-8 rounded-[3px] bg-[#1d1a18] border border-[#3d3a39] flex items-center justify-center shrink-0">
                <img 
                  src="/edunova-logo.png" 
                  alt="EDUNOVA" 
                  className="w-5 h-5 object-contain"
                />
              </div>

              {!isCollapsed && (
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#eeeeee]">EDUNOVA</span>
                    <span className="status-pulse-orange"></span>
                  </div>
                  <p className="font-mono text-[10px] text-[#8a8380] uppercase tracking-tight">
                    FACTORY // CONTROL
                  </p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button 
                onClick={() => setIsCollapsed(true)}
                title="Collapse sidebar"
                className="hidden lg:flex p-1.5 rounded-[3px] text-[#8a8380] hover:text-[#eeeeee] hover:bg-[#1d1a18] border border-transparent hover:border-[#3d3a39] transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
            )}
          </div>

          {/* Expand button when collapsed */}
          {isCollapsed && (
            <div className="hidden lg:flex justify-center py-2 border-b border-[#3d3a39]">
              <button 
                onClick={() => setIsCollapsed(false)}
                title="Expand sidebar"
                className="p-1.5 rounded-[3px] text-[#8a8380] hover:text-[#eeeeee] hover:bg-[#1d1a18] transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Nav Items List */}
          <nav className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
            
            {navItems.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {!isCollapsed && (
                  <p className="px-3 pb-1 font-mono text-[11px] uppercase tracking-wider text-[#8a8380]">
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

                      {/* Tooltip on collapsed */}
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

        {/* User profile dock at bottom */}
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
                title="Log out"
                className="p-1.5 text-[#8a8380] hover:text-[#ee6018] hover:bg-[#1d1a18] rounded-[3px] border border-transparent hover:border-[#3d3a39] transition-colors ml-1"
              >
                <LogOut size={15} />
              </button>
            )}
          </div>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-[#1d1a18] border border-[#3d3a39] rounded-[3px] p-2 shadow-2xl space-y-1 text-xs z-50">
              <div className="px-2 py-1.5 border-b border-[#3d3a39]">
                <p className="text-[#eeeeee] font-normal">{user?.nombre} {user?.apellido}</p>
                <p className="font-mono text-[11px] text-[#8a8380] truncate">{user?.correo}</p>
              </div>
              
              <button 
                onClick={() => { setActiveTab('dashboard'); setShowProfileMenu(false); }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-[3px] text-[#eeeeee] hover:bg-[#101010] transition-colors"
              >
                <User size={13} className="text-[#8a8380]" />
                <span>Operator Profile</span>
              </button>

              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-[3px] text-[#ee6018] hover:bg-[#101010] transition-colors font-mono uppercase text-[11px]"
              >
                <LogOut size={13} />
                <span>Terminate Session</span>
              </button>
            </div>
          )}

        </div>

      </aside>
    </>
  );
}
