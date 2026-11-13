import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Sparkles,
  Command
} from 'lucide-react';

export default function Header({ user, onLogout, onToggleMobileSidebar }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Evidencia Calificada',
      desc: 'Tu entrega de "Prototipo en Figma" fue calificada con 4.8 / 5.0 (Aprobado).',
      time: 'Hace 2 horas',
      icon: CheckCircle2,
      color: 'text-edunova-success bg-emerald-50'
    },
    {
      id: 2,
      title: 'Sugerencia de EDUNOVA AI',
      desc: 'Nuevo taller práctico recomendado para profundizar en Axios REST API.',
      time: 'Hace 5 horas',
      icon: Sparkles,
      color: 'text-edunova-violet bg-purple-50'
    },
    {
      id: 3,
      title: 'Próxima Entrega',
      desc: 'Evidencia 2: Maquetación con React & Tailwind vence en 4 días.',
      time: 'Ayer',
      icon: Clock,
      color: 'text-edunova-gold bg-amber-50'
    }
  ];

  return (
    <header className="h-20 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-saas-sm sticky top-0 z-30">
      
      {/* Botón Móvil & Buscador Global */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        
        {/* Toggle para Drawer Móvil */}
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200"
          title="Abrir menú"
        >
          <Menu size={20} />
        </button>

        {/* Buscador SaaS con atajo visual */}
        <div className="relative w-full">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por evidencia, curso, competencia o instructor..."
            className="w-full pl-10 pr-20 py-2.5 bg-edunova-canvas border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-edunova-electric focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-slate-400"
          />
          <div className="hidden sm:flex items-center gap-1 absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-400">
            <Command size={10} />
            <span>K</span>
          </div>
        </div>

      </div>

      {/* Lado Derecho: Notificaciones, Institución & Acciones */}
      <div className="flex items-center gap-3 sm:gap-5 ml-4">
        
        {/* Identificación de la Institución */}
        <div className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-edunova-midnight/5 border border-slate-200">
          <img src="/edunova-logo.png" alt="Escudo" className="w-6 h-6 object-contain" />
          <div className="text-left">
            <p className="text-xs font-bold text-edunova-midnight leading-tight">Centro de Formación Industrial</p>
            <p className="text-[10px] font-semibold text-edunova-gold leading-tight">SENA Regional Huila · Neiva</p>
          </div>
        </div>

        {/* Icono de Notificaciones con Badge */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notificaciones académicas"
            className="relative p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-edunova-electric ring-2 ring-white animate-pulse"></span>
          </button>

          {/* Menú de Notificaciones */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-saas-hover z-50 p-4 animate-slideUp">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-edunova-textPrimary">Novedades Académicas</h4>
                  <span className="px-1.5 py-0.5 bg-blue-100 text-edunova-electric text-[10px] font-bold rounded-full">
                    3 nuevas
                  </span>
                </div>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-edunova-electric hover:underline font-semibold"
                >
                  Marcar leídas
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div key={n.id} className="py-3 flex items-start gap-3 hover:bg-slate-50/80 p-2 rounded-xl transition-colors">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.color}`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-800">{n.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{n.desc}</p>
                        <span className="text-[10px] text-slate-400 font-medium mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Separador */}
        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

        {/* Chip de Perfil */}
        <div className="hidden sm:flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-edunova-electric to-blue-400 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0)}
          </div>
          <div className="text-left hidden lg:block">
            <p className="text-xs font-bold text-edunova-textPrimary leading-none">{user?.nombre} {user?.apellido}</p>
            <p className="text-[10px] text-slate-400 font-medium leading-none mt-1">{user?.correo}</p>
          </div>
        </div>

        {/* Botón Salir */}
        <button
          onClick={onLogout}
          title="Cerrar Sesión"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-all shadow-sm"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Salir</span>
        </button>

      </div>

    </header>
  );
}

