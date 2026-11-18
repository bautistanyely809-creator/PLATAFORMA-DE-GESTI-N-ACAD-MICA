import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  LogOut, 
  Clock, 
  Command, 
  BookOpen,
  ArrowRight,
  Activity
} from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

export default function Header({ user, onLogout, onToggleMobileSidebar, onNavigate }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [rawQuery, setRawQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced search (300ms)
  const debouncedQuery = useDebounce(rawQuery, 300);

  const catalog = [
    { title: 'Frontend Engineering (React & Tailwind)', type: 'Course', tab: 'cursos' },
    { title: 'Backend Systems & REST (Node & Express)', type: 'Course', tab: 'cursos' },
    { title: 'Figma UI Prototype Dispatch', type: 'Work', tab: 'calificaciones' },
    { title: 'MySQL 8 Relational Schema', type: 'Work', tab: 'calificaciones' },
    { title: 'Axios & JWT Interceptors', type: 'Work', tab: 'calificaciones' },
    { title: 'Carlos Mendoza (Lead)', type: 'Staff', tab: 'cursos' },
    { title: 'Laura Gómez (Backend Lead)', type: 'Staff', tab: 'cursos' }
  ];

  const filteredSuggestions = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase();
    return catalog.filter(item => item.title.toLowerCase().includes(q)).slice(0, 4);
  }, [debouncedQuery]);

  const notifications = [
    {
      id: 1,
      title: 'EVIDENCE COMMITTED',
      desc: '"Prototipo en Figma" verified and graded 4.8 / 5.0 (Passed).',
      time: '2H AGO',
      accent: 'border-l-2 border-[#a0ca92]'
    },
    {
      id: 2,
      title: 'EDUNOVA AI ADVISORY',
      desc: 'Target practice module suggested for asynchronous Axios error handling.',
      time: '5H AGO',
      accent: 'border-l-2 border-[#ee6018]'
    },
    {
      id: 3,
      title: 'UPCOMING DEADLINE',
      desc: 'Deliverable 2: React & Tailwind Scaffold due in 4 days.',
      time: 'YESTERDAY',
      accent: 'border-l-2 border-[#8a8380]'
    }
  ];

  return (
    <header className="h-16 px-4 sm:px-6 bg-[#101010] border-b border-[#3d3a39] flex items-center justify-between shrink-0">
      
      {/* Search Input Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-lg relative">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-1.5 rounded-[3px] text-[#8a8380] hover:text-[#eeeeee] hover:bg-[#1d1a18] border border-[#3d3a39]"
          title="Open menu"
        >
          <Menu size={16} />
        </button>

        <div className="relative w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8380]" />
          <input
            type="text"
            value={rawQuery}
            onChange={(e) => {
              setRawQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search work, courses, telemetry..."
            className="w-full pl-9 pr-16 py-1.5 bg-[#1d1a18] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] font-sans placeholder:text-[#8a8380] focus:outline-none focus:border-[#eeeeee] transition-colors"
          />
          <div className="hidden sm:flex items-center gap-1 absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-[10px] font-mono text-[#8a8380]">
            <span>⌘K</span>
          </div>

          {/* Autocomplete Dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#1d1a18] border border-[#3d3a39] rounded-[3px] p-1.5 shadow-2xl z-50">
              <div className="font-mono text-[10px] text-[#8a8380] px-2 py-1 uppercase tracking-wider">
                Instant Matches ({filteredSuggestions.length})
              </div>
              {filteredSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setShowSuggestions(false);
                    setRawQuery('');
                    if (onNavigate) onNavigate(item.tab);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-[3px] hover:bg-[#101010] text-left text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen size={13} className="text-[#a0ca92]" />
                    <span className="text-[#eeeeee]">{item.title}</span>
                  </div>
                  <span className="font-mono text-[10px] uppercase text-[#8a8380] bg-[#101010] px-1.5 py-0.5 rounded-[3px] border border-[#3d3a39]">
                    {item.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4 ml-4">
        
        {/* Live Network Status */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-[#1d1a18] border border-[#3d3a39] text-xs font-mono">
          <span className="status-pulse-green"></span>
          <span className="text-[11px] text-[#eeeeee] uppercase tracking-tight">NODE 01 // LIVE</span>
        </div>

        {/* Institution Badge */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-[3px] border border-[#3d3a39] font-mono text-[11px] text-[#8a8380] uppercase">
          <span>SENA · REGIONAL HUILA</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
            className="p-1.5 rounded-[3px] bg-[#1d1a18] hover:bg-[#24211f] text-[#8a8380] hover:text-[#eeeeee] border border-[#3d3a39] transition-colors relative"
          >
            <Bell size={15} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#ee6018]"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#1d1a18] border border-[#3d3a39] rounded-[3px] shadow-2xl p-3 space-y-2 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#3d3a39]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#eeeeee]">
                    Telemetry Feed
                  </span>
                  <span className="font-mono text-[10px] bg-[#ee6018]/15 text-[#ee6018] px-1.5 py-0.5 rounded-[3px] border border-[#ee6018]/30">
                    3 New
                  </span>
                </div>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="font-mono text-[10px] text-[#8a8380] hover:text-[#eeeeee] uppercase"
                >
                  Dismiss
                </button>
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div 
                    key={item.id}
                    className={`p-2.5 bg-[#101010] hover:bg-[#151515] rounded-[3px] border border-[#3d3a39] space-y-1 ${item.accent}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[#eeeeee] uppercase tracking-wide">
                        {item.title}
                      </span>
                      <span className="font-mono text-[10px] text-[#8a8380] flex items-center gap-1">
                        <Clock size={10} />
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-[#8a8380] leading-snug">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setShowNotifications(false); onNavigate && onNavigate('notificaciones'); }}
                className="w-full py-1.5 bg-[#101010] hover:bg-[#151515] border border-[#3d3a39] text-[#ee6018] rounded-[3px] font-mono text-[10px] uppercase text-center mt-2 block transition-colors"
              >
                Abrir Centro de Notificaciones →
              </button>
            </div>
          )}
        </div>

        {/* User Identity */}
        <div className="flex items-center gap-2.5 pl-2 sm:border-l sm:border-[#3d3a39]">
          <div className="w-7 h-7 rounded-[3px] bg-[#1d1a18] border border-[#3d3a39] text-[#eeeeee] flex items-center justify-center font-mono text-xs font-normal">
            {user?.nombre?.charAt(0) || 'U'}{user?.apellido?.charAt(0) || ''}
          </div>
          
          <div className="hidden lg:block text-left">
            <p className="text-xs text-[#eeeeee] font-normal leading-tight truncate max-w-[110px]">
              {user?.nombre}
            </p>
            <p className="font-mono text-[10px] text-[#8a8380] uppercase leading-tight">
              {user?.rol || 'APRENDIZ'}
            </p>
          </div>

          <button
            onClick={onLogout}
            title="Log out"
            className="hidden sm:flex p-1.5 rounded-[3px] text-[#8a8380] hover:text-[#ee6018] hover:bg-[#1d1a18] border border-transparent hover:border-[#3d3a39] transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>

      </div>

    </header>
  );
}
