import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  CalendarCheck, 
  Sparkles, 
  TrendingUp, 
  Award, 
  AlertCircle,
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  LogOut,
  Bell,
  Search,
  CheckCircle2,
  ChevronRight,
  School
} from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState('ADMIN'); // ADMIN, INSTRUCTOR, APRENDIZ

  return (
    <div className="flex h-screen bg-edunova-light font-sans text-edunova-dark overflow-hidden">
      
      {/* ============================================================ */}
      {/* 1. SIDEBAR (Azul Oscuro: #102A43)                           */}
      {/* ============================================================ */}
      <aside className="w-64 bg-edunova-navy text-white flex flex-col justify-between shrink-0 shadow-xl">
        <div>
          {/* Logo & Marca EDUNOVA */}
          <div className="p-6 border-b border-slate-700/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-edunova-primary flex items-center justify-center shadow-lg shadow-blue-500/30 text-white font-extrabold text-xl">
              E
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                EDUNOVA
              </h1>
              <p className="text-xs text-edunova-teal font-medium tracking-wider uppercase">
                Academic Management
              </p>
            </div>
          </div>

          {/* Estado de conexión / Badge */}
          <div className="px-6 py-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sistema activo · v1.0
            </div>
          </div>

          {/* Menú de Navegación */}
          <nav className="mt-2 px-3 space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-edunova-primary text-white shadow-md shadow-blue-600/30 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <LayoutDashboard size={18} />
              <span>Panel de Control</span>
            </button>

            <button
              onClick={() => setActiveTab('aprendices')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'aprendices'
                  ? 'bg-edunova-primary text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Users size={18} />
              <span>Aprendices</span>
            </button>

            <button
              onClick={() => setActiveTab('instructores')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'instructores'
                  ? 'bg-edunova-primary text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <GraduationCap size={18} />
              <span>Instructores</span>
            </button>

            <button
              onClick={() => setActiveTab('cursos')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'cursos'
                  ? 'bg-edunova-primary text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <BookOpen size={18} />
              <span>Cursos & Fichas</span>
            </button>

            <button
              onClick={() => setActiveTab('calificaciones')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'calificaciones'
                  ? 'bg-edunova-primary text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <ClipboardList size={18} />
              <span>Calificaciones</span>
            </button>

            <button
              onClick={() => setActiveTab('asistencia')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'asistencia'
                  ? 'bg-edunova-primary text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <CalendarCheck size={18} />
              <span>Control de Asistencia</span>
            </button>

            <button
              onClick={() => setActiveTab('reportes')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'reportes'
                  ? 'bg-edunova-primary text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <BarChart3 size={18} />
              <span>Reportes Estadísticos</span>
            </button>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('ai')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all border ${
                  activeTab === 'ai'
                    ? 'bg-gradient-to-r from-teal-500/20 to-blue-500/20 border-edunova-teal text-white font-semibold'
                    : 'border-teal-500/30 text-teal-300 hover:bg-teal-500/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles size={18} className="text-edunova-teal animate-spin-slow" />
                  <span>EDUNOVA AI</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-edunova-teal/20 text-edunova-teal border border-edunova-teal/40">
                  Nuevo
                </span>
              </button>
            </div>
          </nav>
        </div>

        {/* Perfil del Usuario en el pie del Sidebar */}
        <div className="p-4 border-t border-slate-700/60 bg-slate-900/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                AV
              </div>
              <div className="truncate">
                <p className="text-sm font-semibold text-white truncate">Anyely Valeria</p>
                <p className="text-xs text-slate-400">SENA · ADSO Neiva</p>
              </div>
            </div>
            <button 
              title="Cambiar rol de prueba"
              onClick={() => setUserRole(userRole === 'ADMIN' ? 'INSTRUCTOR' : userRole === 'INSTRUCTOR' ? 'APRENDIZ' : 'ADMIN')}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] rounded text-slate-300 uppercase font-mono tracking-wider border border-slate-700"
            >
              {userRole}
            </button>
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. CONTENIDO PRINCIPAL                                        */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-4 flex-1 max-w-lg">
            <div className="relative w-full">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar aprendiz, instructor, curso o evidencia..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-transparent rounded-lg text-sm focus:bg-white focus:border-edunova-primary focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-edunova-warning"></span>
            </button>

            <div className="h-6 w-px bg-slate-200"></div>

            <div className="text-right">
              <p className="text-xs font-semibold text-edunova-navy">Centro de Formación Industrial</p>
              <p className="text-[11px] text-slate-500">SENA Regional Huila · 2026</p>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* Header de Bienvenida */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-edunova-primary mb-1">
                <School size={15} />
                <span>Gestión Académica Integral</span>
              </div>
              <h2 className="text-3xl font-extrabold text-edunova-navy tracking-tight">
                Panel de control
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Bienvenido al sistema de gestión académica <strong className="text-edunova-navy">EDUNOVA</strong>. Resumen general en tiempo real.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2">
                <BarChart3 size={16} />
                Exportar Informe
              </button>
              <button className="px-4 py-2.5 bg-edunova-primary hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2">
                + Nueva Matrícula
              </button>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 4 CARDS DE INDICADORES PRINCIPALES                           */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. Aprendices */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">Aprendices</p>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-edunova-primary flex items-center justify-center font-bold">
                  <Users size={22} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-4xl font-extrabold text-edunova-navy tracking-tight">250</h3>
                <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                  <span>↑ +12 inscripciones</span>
                  <span className="text-slate-400 font-normal">este mes</span>
                </p>
              </div>
            </div>

            {/* 2. Cursos Activos */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">Cursos activos</p>
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-edunova-teal flex items-center justify-center font-bold">
                  <BookOpen size={22} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-4xl font-extrabold text-edunova-navy tracking-tight">12</h3>
                <p className="text-xs text-edunova-teal font-medium mt-1 flex items-center gap-1">
                  <span>En ejecución activa</span>
                  <span className="text-slate-400 font-normal">ADSO</span>
                </p>
              </div>
            </div>

            {/* 3. Instructores */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">Instructores</p>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <GraduationCap size={22} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-4xl font-extrabold text-edunova-navy tracking-tight">18</h3>
                <p className="text-xs text-indigo-600 font-medium mt-1 flex items-center gap-1">
                  <span>100% asignados</span>
                  <span className="text-slate-400 font-normal">a fichas</span>
                </p>
              </div>
            </div>

            {/* 4. Asistencia Promedio */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">Asistencia promedio</p>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-edunova-success flex items-center justify-center font-bold">
                  <CalendarCheck size={22} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-4xl font-extrabold text-edunova-navy tracking-tight">85%</h3>
                <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                  <span>↑ 3.2% vs periodo anterior</span>
                </p>
              </div>
            </div>

          </div>

          {/* ============================================================ */}
          {/* SECCIÓN RENDIMIENTO + MÓDULO EDUNOVA AI                       */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Tarjeta de Rendimiento Académico (2 columnas) */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h4 className="text-lg font-bold text-edunova-navy">Rendimiento académico</h4>
                  <p className="text-xs text-slate-500">Ejemplo de distribución de resultados y progreso formativo</p>
                </div>
                <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600">
                  Corte Evaluativo 1 · 2026
                </span>
              </div>

              <div className="space-y-6">
                
                {/* Desempeño Satisfactorio */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-edunova-success"></span>
                      <span className="text-sm font-semibold text-slate-700">Desempeño satisfactorio</span>
                    </div>
                    <span className="text-sm font-extrabold text-edunova-success">75%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                    <div 
                      className="bg-edunova-success h-full rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">187 aprendices con todas las evidencias al día</p>
                </div>

                {/* Requiere Seguimiento */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-edunova-warning"></span>
                      <span className="text-sm font-semibold text-slate-700">Requiere seguimiento</span>
                    </div>
                    <span className="text-sm font-extrabold text-edunova-warning">25%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                    <div 
                      className="bg-edunova-warning h-full rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: '25%' }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">63 aprendices con evidencias pendientes o inasistencias por justificar</p>
                </div>

              </div>

              {/* Botón de acción */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500">Métricas consolidadas de las fichas activas</p>
                <button className="text-sm font-semibold text-edunova-primary hover:text-blue-700 flex items-center gap-1">
                  <span>Ver listado detallado</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Tarjeta Destacada EDUNOVA AI (1 columna) */}
            <div className="bg-gradient-to-br from-edunova-navy via-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-xl border border-teal-500/30 flex flex-col justify-between relative overflow-hidden">
              
              {/* Resplandor visual decorativo */}
              <div className="absolute -top-16 -right-16 w-44 h-44 bg-edunova-teal/20 rounded-full blur-3xl pointer-events-none"></div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-edunova-teal/20 border border-edunova-teal/40 flex items-center justify-center text-edunova-teal">
                    <Sparkles size={20} />
                  </div>
                  <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-edunova-teal text-slate-950 font-mono">
                    MÓDULO DE IA
                  </span>
                </div>

                <h4 className="text-2xl font-extrabold tracking-tight text-white mb-2">
                  EDUNOVA AI
                </h4>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Asistente inteligente para el seguimiento académico y recomendaciones de aprendizaje.
                </p>

                <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-edunova-teal">
                    <CheckCircle2 size={14} />
                    <span>Recomendación preventiva activa</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    4 aprendices presentan dificultades en la evidencia de <em>React Hooks</em>. Se recomienda taller de refuerzo práctico.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <button className="w-full py-2.5 px-4 bg-edunova-teal hover:bg-teal-400 text-slate-950 font-bold rounded-lg text-sm transition-all shadow-md shadow-teal-500/20 flex items-center justify-center gap-2">
                  <Sparkles size={16} />
                  Consultar Diagnóstico IA
                </button>
              </div>

            </div>

          </div>

          {/* ============================================================ */}
          {/* TABLA DE CURSOS ACTIVOS Y SEGUIMIENTO                        */}
          {/* ============================================================ */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-edunova-navy">Cursos y Fichas en Ejecución</h4>
                <p className="text-xs text-slate-500">Programa: Tecnólogo en Análisis y Desarrollo de Software (ADSO)</p>
              </div>
              <span className="text-xs font-semibold text-edunova-primary bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                Regional Huila · Neiva
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Ficha / Curso</th>
                    <th className="px-6 py-4">Instructor Titular</th>
                    <th className="px-6 py-4">Aprendices</th>
                    <th className="px-6 py-4">Progreso</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-edunova-navy">
                      <div>Desarrollo Web Frontend (React & Tailwind)</div>
                      <div className="text-xs font-normal text-slate-400">Ficha ADSO-2026-A · Código #2874102</div>
                    </td>
                    <td className="px-6 py-4">Carlos Mendoza</td>
                    <td className="px-6 py-4 font-medium">32 aprendices</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-edunova-primary h-full rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <span className="text-xs font-bold text-slate-700">65%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        Activo
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-semibold text-edunova-primary hover:underline">
                        Ver ficha →
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-edunova-navy">
                      <div>Arquitectura Backend y APIs RESTful (Node.js)</div>
                      <div className="text-xs font-normal text-slate-400">Ficha ADSO-2026-B · Código #2874103</div>
                    </td>
                    <td className="px-6 py-4">Laura Gómez</td>
                    <td className="px-6 py-4 font-medium">28 aprendices</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-edunova-teal h-full rounded-full" style={{ width: '40%' }}></div>
                        </div>
                        <span className="text-xs font-bold text-slate-700">40%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        Activo
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-semibold text-edunova-primary hover:underline">
                        Ver ficha →
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

    </div>
  );
}

