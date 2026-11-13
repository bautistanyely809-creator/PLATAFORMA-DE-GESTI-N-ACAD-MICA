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
      title: 'Evidencia Aprobada ✨',
      desc: 'Tu entrega de "Prototipo en Figma" fue calificada con 4.8 / 5.0 (Aprobado).',
      time: 'Hace 2 horas',
      badge: 'bg-[#E6F9F2] text-[#16A36A]'
    },
    {
      id: 2,
      title: 'Consejo de EDUNOVA AI 💡',
      desc: 'Nuevo taller práctico sugerido para dominar llamadas asíncronas con Axios.',
      time: 'Hace 5 horas',
      badge: 'bg-[#EDE7FA] text-[#8064D8]'
    },
    {
      id: 3,
      title: 'Próxima Entrega ⏳',
      desc: 'Evidencia 2: Maquetación con React & Tailwind vence en 4 días.',
      time: 'Ayer',
      badge: 'bg-[#FFF6DC] text-[#DCA91F]'
    }
  ];

  return (
    <header className="p-3 sm:p-4 shrink-0">
      
      {/* Contenedor Flotante Glassmorphism */}
      <div className="h-20 bg-white/75 backdrop-blur-2xl border border-white/80 rounded-[28px] px-5 sm:px-8 flex items-center justify-between shadow-glass">
        
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
              className="w-full pl-11 pr-20 py-2.5 bg-white/80 border border-purple-100 rounded-full text-xs sm:text-sm text-edunova-textPrimary focus:bg-white focus:border-edunova-lavender focus:ring-4 focus:ring-purple-200/40 focus:outline-none transition-all placeholder:text-[#9A90AC]"
            />
            <div className="hidden sm:flex items-center gap-1 absolute right-3.5 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-purple-50/80 border border-purple-100 rounded-full text-[10px] font-mono text-edunova-violet font-semibold">
              <Command size={10} />
              <span>K</span>
            </div>
          </div>

        </div>

        {/* Lado Derecho: Notificaciones, Institución & Perfil */}
        <div className="flex items-center gap-3 sm:gap-5 ml-4">
          
          {/* Identificación de la Institución SENA Pastel */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#FCE4F2]/70 to-[#DCEBFA]/70 border border-white/80 shadow-sm">
            <div className="w-7 h-7 rounded-xl bg-white p-1 shadow-sm flex items-center justify-center">
              <img src="/edunova-logo.png" alt="Escudo" className="w-full h-full object-contain" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-edunova-textPrimary leading-tight">Centro de Formación Industrial</p>
              <p className="text-[10px] font-extrabold text-edunova-violet leading-tight mt-0.5">SENA Regional Huila · Neiva</p>
            </div>
          </div>

          {/* Notificaciones con Menú Glass */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notificaciones"
              className="relative p-3 rounded-2xl bg-white/80 hover:bg-white text-edunova-textSecondary hover:text-edunova-textPrimary transition-all border border-white shadow-sm"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-edunova-pinkPastel ring-2 ring-white"></span>
            </button>

            {/* Dropdown de Notificaciones */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 backdrop-blur-2xl border border-white rounded-[24px] shadow-glass-hover z-50 p-4 animate-slideUp">
                <div className="flex items-center justify-between pb-3 border-b border-purple-100/80">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-extrabold text-edunova-textPrimary">Notificaciones</h4>
                    <span className="px-2 py-0.5 bg-[#FCE4F2] text-[#D6409B] text-[10px] font-bold rounded-full">
                      3 pendientes
                    </span>
                  </div>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] text-edunova-violet hover:underline font-bold"
                  >
                    Marcar leídas
                  </button>
                </div>

                <div className="divide-y divide-purple-50 max-h-72 overflow-y-auto mt-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-3 flex items-start gap-3 hover:bg-purple-50/50 p-2 rounded-2xl transition-colors">
                      <div className={`p-2 rounded-xl text-xs font-bold shrink-0 ${n.badge}`}>
                        ✨
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-edunova-textPrimary">{n.title}</p>
                        <p className="text-[11px] text-edunova-textSecondary mt-0.5 leading-relaxed">{n.desc}</p>
                        <span className="text-[10px] text-[#A59CB7] font-medium mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Separador Sutil */}
          <div className="h-6 w-px bg-purple-200/50 hidden sm:block"></div>

          {/* Avatar del Usuario */}
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/70 border border-white">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#F7B8DC] to-[#C8B5F5] text-edunova-textPrimary font-extrabold text-xs flex items-center justify-center shadow-sm">
              {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0)}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-bold text-edunova-textPrimary leading-none">{user?.nombre} {user?.apellido}</p>
              <p className="text-[10px] text-edunova-violet font-semibold leading-none mt-1">ADSO · Neiva</p>
            </div>
          </div>

          {/* Botón Salir */}
          <button
            onClick={onLogout}
            title="Cerrar Sesión"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold text-red-500 hover:text-red-600 bg-red-50/70 hover:bg-red-50 border border-red-100/80 transition-all shadow-sm"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Salir</span>
          </button>

        </div>

      </div>

    </header>
  );
}
