import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Command,
  ChevronDown
} from 'lucide-react';

export default function Header({ user, onLogout, onToggleMobileSidebar }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Evidencia Aprobada ⚡',
      desc: 'Tu entrega de "Prototipo en Figma" fue calificada con 4.8 / 5.0 (Aprobado).',
      time: 'Hace 2 horas',
      badge: 'bg-[#E8F8F5] text-[#19B5A5] border border-[#19B5A5]/20'
    },
    {
      id: 2,
      title: 'Consejo de EDUNOVA AI 💡',
      desc: 'Nuevo taller práctico sugerido para dominar llamadas asíncronas con Axios.',
      time: 'Hace 5 horas',
      badge: 'bg-[#EBF7FC] text-[#48BFE3] border border-[#48BFE3]/20'
    },
    {
      id: 3,
      title: 'Próxima Entrega ⏳',
      desc: 'Evidencia 2: Maquetación con React & Tailwind vence en 4 días.',
      time: 'Ayer',
      badge: 'bg-[#FEF8EC] text-[#E9B949] border border-[#E9B949]/20'
    }
  ];

  return (
    <header className="p-3 sm:p-4 shrink-0">
      
      {/* Contenedor Flotante Glassmorphism */}
      <div className="h-20 bg-white/85 backdrop-blur-2xl border border-white/90 rounded-[28px] px-5 sm:px-8 flex items-center justify-between shadow-glass">
        
        {/* Lado Izquierdo: Botón Móvil & Buscador Global Pill */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2.5 rounded-2xl text-edunova-textSecondary hover:bg-white/80 transition-colors border border-white shadow-sm"
            title="Abrir menú"
          >
            <Menu size={20} />
          </button>

          {/* Buscador Redondeado con Sombra Suave */}
          <div className="relative w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-edunova-textSecondary" />
            <input
              type="text"
              placeholder="Buscar evidencias, cursos, instructores o materias..."
              className="w-full pl-11 pr-20 py-2.5 bg-[#F4F7FA]/90 border border-slate-200/80 rounded-full text-xs sm:text-sm text-edunova-textPrimary focus:bg-white focus:border-[#19B5A5] focus:ring-4 focus:ring-[#19B5A5]/15 focus:outline-none transition-all placeholder:text-[#718096]"
            />
            <div className="hidden sm:flex items-center gap-1 absolute right-3.5 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-[#EDF2F7] border border-slate-200 rounded-full text-[10px] font-mono text-[#17365D] font-semibold">
              <Command size={10} />
              <span>K</span>
            </div>
          </div>

        </div>

        {/* Lado Derecho: Notificaciones, Institución & Perfil */}
        <div className="flex items-center gap-3 sm:gap-5 ml-4">
          
          {/* Identificación de la Institución SENA Ocean Tech */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#DCEEF5]/80 to-[#EDF2F7]/80 border border-white/90 shadow-sm">
            <div className="w-7 h-7 rounded-xl bg-white p-1 shadow-sm flex items-center justify-center border border-slate-100">
              <img src="/edunova-logo.png" alt="Escudo" className="w-full h-full object-contain" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[#123B50] leading-tight">Centro de Formación Industrial</p>
              <p className="text-[10px] font-extrabold text-[#19B5A5] leading-tight mt-0.5">SENA Regional Huila · Neiva</p>
            </div>
          </div>

          {/* Notificaciones con Menú Glass */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notificaciones"
              className="relative p-3 rounded-2xl bg-[#F4F7FA] hover:bg-white text-edunova-textSecondary hover:text-edunova-textPrimary transition-all border border-slate-200/80 shadow-sm"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#19B5A5] ring-2 ring-white"></span>
            </button>

            {/* Dropdown de Notificaciones */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 backdrop-blur-2xl border border-slate-100 rounded-[24px] shadow-2xl p-4 space-y-3 z-50 animate-slideUp">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#123B50] uppercase tracking-wider">
                      Notificaciones
                    </span>
                    <span className="text-[10px] font-bold bg-[#E8F8F5] text-[#19B5A5] px-2 py-0.5 rounded-full">
                      3 Nuevas
                    </span>
                  </div>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] text-[#718096] hover:text-[#123B50] font-semibold"
                  >
                    Cerrar
                  </button>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto">
                  {notifications.map((item) => (
                    <div 
                      key={item.id}
                      className="p-3 rounded-2xl bg-[#F4F7FA]/80 hover:bg-[#DCEEF5]/40 transition-colors border border-slate-100/80 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${item.badge}`}>
                          {item.title}
                        </span>
                        <span className="text-[10px] text-[#718096] flex items-center gap-1">
                          <Clock size={10} />
                          {item.time}
                        </span>
                      </div>
                      <p className="text-xs text-[#263746] font-medium leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-center border-t border-slate-100">
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-bold text-[#19B5A5] hover:text-[#123B50] transition-colors"
                  >
                    Marcar todas como leídas
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Avatar del Usuario en Header */}
          <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-slate-200">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#123B50] via-[#17365D] to-[#19B5A5] text-white flex items-center justify-center font-extrabold text-xs shadow-md shadow-[#19B5A5]/20 border border-white">
              {user?.nombre?.charAt(0) || 'U'}{user?.apellido?.charAt(0) || ''}
            </div>
            
            <div className="hidden xl:block text-left">
              <p className="text-xs font-bold text-[#263746] truncate max-w-[120px]">
                {user?.nombre} {user?.apellido}
              </p>
              <p className="text-[10px] font-bold text-[#19B5A5] uppercase">
                {user?.rol || 'APRENDIZ'}
              </p>
            </div>

            <button
              onClick={onLogout}
              title="Cerrar sesión"
              className="hidden sm:flex p-2.5 rounded-xl text-[#718096] hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>

        </div>

      </div>

    </header>
  );
}
