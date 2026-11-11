import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  CalendarCheck, 
  Sparkles, 
  Award, 
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Bell,
  Search,
  CheckCircle2,
  ChevronRight,
  School,
  FileCheck2,
  ShieldCheck,
  TrendingUp,
  Clock
} from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState('ADMIN'); // ADMIN, INSTRUCTOR, APRENDIZ

  return (
    <div className="flex h-screen bg-edunova-canvas font-sans text-edunova-text overflow-hidden">
      
      {/* ============================================================ */}
      {/* 1. SIDEBAR (Azul Marino del Escudo: #0A2540)                */}
      {/* ============================================================ */}
      <aside className="w-72 bg-gradient-to-b from-edunova-navy via-edunova-navy-dark to-[#040E1B] text-white flex flex-col justify-between shrink-0 shadow-2xl border-r border-edunova-gold/20">
        <div>
          
          {/* Header con el Escudo / Logo Oficial */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3.5 bg-black/10">
            <div className="relative group shrink-0">
              <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-md shadow-black/30 border-2 border-edunova-gold flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                <img 
                  src="/edunova-logo.png" 
                  alt="Escudo Oficial EDUNOVA" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-edunova-emerald border-2 border-edunova-navy"></span>
            </div>

            <div className="overflow-hidden">
              <h1 className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                EDUNOVA
              </h1>
              <p className="text-[11px] text-edunova-gold font-semibold tracking-wider uppercase truncate">
                Academic Management
              </p>
            </div>
          </div>

          {/* Insignia de Estado */}
          <div className="px-6 py-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-edunova-gold/30 rounded-full text-xs font-medium text-slate-200 w-full justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-edunova-emerald animate-pulse"></span>
                <span>Plataforma Activa</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-edunova-gold tracking-wider">
                ADSO · v1.0
              </span>
            </div>
          </div>

          {/* Menú de Navegación con los Colores del Escudo */}
          <nav className="mt-2 px-3 space-y-1.5">
            
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-edunova-gold text-slate-950 font-bold shadow-gold'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard size={19} className={activeTab === 'dashboard' ? 'text-slate-950' : 'text-edunova-gold'} />
                <span>Panel de Control</span>
              </div>
              {activeTab === 'dashboard' && <span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span>}
            </button>

            <button
              onClick={() => setActiveTab('aprendices')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'aprendices'
                  ? 'bg-edunova-gold text-slate-950 font-bold shadow-gold'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Users size={19} className={activeTab === 'aprendices' ? 'text-slate-950' : 'text-slate-400'} />
              <span>Aprendices</span>
            </button>

            <button
              onClick={() => setActiveTab('instructores')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'instructores'
                  ? 'bg-edunova-gold text-slate-950 font-bold shadow-gold'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <GraduationCap size={19} className={activeTab === 'instructores' ? 'text-slate-950' : 'text-slate-400'} />
              <span>Instructores</span>
            </button>

            <button
              onClick={() => setActiveTab('cursos')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'cursos'
                  ? 'bg-edunova-gold text-slate-950 font-bold shadow-gold'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <BookOpen size={19} className={activeTab === 'cursos' ? 'text-slate-950' : 'text-slate-400'} />
              <span>Cursos & Fichas</span>
            </button>

            <button
              onClick={() => setActiveTab('calificaciones')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'calificaciones'
                  ? 'bg-edunova-gold text-slate-950 font-bold shadow-gold'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FileCheck2 size={19} className={activeTab === 'calificaciones' ? 'text-slate-950' : 'text-slate-400'} />
              <span>Calificaciones</span>
            </button>

            <button
              onClick={() => setActiveTab('asistencia')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'asistencia'
                  ? 'bg-edunova-gold text-slate-950 font-bold shadow-gold'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <CalendarCheck size={19} className={activeTab === 'asistencia' ? 'text-slate-950' : 'text-slate-400'} />
              <span>Control Asistencia</span>
            </button>

            <button
              onClick={() => setActiveTab('reportes')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'reportes'
                  ? 'bg-edunova-gold text-slate-950 font-bold shadow-gold'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <BarChart3 size={19} className={activeTab === 'reportes' ? 'text-slate-950' : 'text-slate-400'} />
              <span>Reportes & Métricas</span>
            </button>

            {/* Módulo EDUNOVA AI */}
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('ai')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                  activeTab === 'ai'
                    ? 'bg-edunova-gold text-slate-950 font-bold border-edunova-gold shadow-gold'
                    : 'border-edunova-gold/40 text-edunova-gold hover:bg-edunova-gold/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles size={19} className={activeTab === 'ai' ? 'text-slate-950' : 'text-edunova-gold'} />
                  <span>EDUNOVA AI</span>
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                  activeTab === 'ai' ? 'bg-slate-950 text-edunova-gold' : 'bg-edunova-gold text-slate-950'
                }`}>
                  IA
                </span>
              </button>
            </div>

          </nav>
        </div>

        {/* Perfil del Usuario en el pie del Sidebar */}
        <div className="p-4 border-t border-white/10 bg-black/25">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-edunova-gold to-amber-200 border border-edunova-gold flex items-center justify-center text-slate-950 font-black text-sm shrink-0 shadow-sm">
                AV
              </div>
              <div className="truncate">
                <p className="text-sm font-bold text-white truncate">Anyely Valeria</p>
                <p className="text-xs text-edunova-gold font-medium">SENA · ADSO Neiva</p>
              </div>
            </div>
            <button 
              title="Cambiar rol"
              onClick={() => setUserRole(userRole === 'ADMIN' ? 'INSTRUCTOR' : userRole === 'INSTRUCTOR' ? 'APRENDIZ' : 'ADMIN')}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-[10px] rounded-lg text-edunova-gold font-mono font-bold tracking-wider border border-edunova-gold/30"
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
        <header className="h-18 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 shadow-sm">
          
          <div className="flex items-center gap-4 flex-1 max-w-lg">
            <div className="relative w-full">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por aprendiz, documento, curso o instructor..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-edunova-navy focus:ring-2 focus:ring-edunova-gold/30 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            
            {/* Escudo mini en Navbar */}
            <div className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-edunova-gold/10 border border-edunova-gold/30">
              <img src="/edunova-logo.png" alt="Escudo" className="w-6 h-6 object-contain" />
              <div className="text-left">
                <p className="text-xs font-bold text-edunova-navy leading-none">Centro de Formación Industrial</p>
                <p className="text-[10px] font-semibold text-edunova-gold leading-none mt-1">SENA Regional Huila</p>
              </div>
            </div>

            <button className="relative p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-edunova-gold border-2 border-white"></span>
            </button>

          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* Banner de Bienvenida con Estética Académica y Colores del Escudo */}
          <div className="bg-gradient-to-r from-edunova-navy via-edunova-navy-light to-edunova-navy p-7 rounded-3xl text-white shadow-navy border-2 border-edunova-gold/40 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Marca de agua del escudo en el fondo */}
            <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 pointer-events-none">
              <img src="/edunova-logo.png" alt="" className="w-full h-full object-contain filter invert" />
            </div>

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-edunova-gold/20 border border-edunova-gold/50 text-edunova-gold text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck size={14} />
                <span>Gestión Académica de Excelencia · ADSO</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                Panel de control EDUNOVA
              </h2>
              <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                Bienvenido al sistema inteligente de gestión académica. Centraliza aprendices, calificaciones, asistencia y acompañamiento formativo con el respaldo institucional.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-3 shrink-0">
              <button className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 backdrop-blur-sm">
                <BarChart3 size={16} className="text-edunova-gold" />
                Reporte Consolidado
              </button>
              <button className="px-5 py-2.5 bg-edunova-gold hover:bg-edunova-gold-hover text-slate-950 rounded-xl text-sm font-extrabold shadow-gold transition-all flex items-center gap-2">
                + Nueva Matrícula
              </button>
            </div>

          </div>

          {/* ============================================================ */}
          {/* 4 CARDS DE INDICADORES PRINCIPALES                           */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. Aprendices */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-edunova-navy"></div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider text-[11px]">Aprendices</p>
                <div className="w-12 h-12 rounded-xl bg-edunova-navy text-edunova-gold flex items-center justify-center font-bold shadow-sm">
                  <Users size={22} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-4xl font-extrabold text-edunova-navy tracking-tight">250</h3>
                <p className="text-xs text-edunova-emerald font-bold mt-1.5 flex items-center gap-1">
                  <span>↑ +12 inscripciones</span>
                  <span className="text-slate-400 font-normal">este periodo</span>
                </p>
              </div>
            </div>

            {/* 2. Cursos Activos */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-edunova-gold"></div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider text-[11px]">Cursos activos</p>
                <div className="w-12 h-12 rounded-xl bg-edunova-gold/20 text-edunova-gold-hover flex items-center justify-center font-bold border border-edunova-gold/30">
                  <BookOpen size={22} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-4xl font-extrabold text-edunova-navy tracking-tight">12</h3>
                <p className="text-xs text-slate-600 font-medium mt-1.5 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-edunova-gold"></span>
                  <span>En ejecución activa · ADSO</span>
                </p>
              </div>
            </div>

            {/* 3. Instructores */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-edunova-navy"></div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider text-[11px]">Instructores</p>
                <div className="w-12 h-12 rounded-xl bg-edunova-navy text-white flex items-center justify-center font-bold shadow-sm">
                  <GraduationCap size={22} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-4xl font-extrabold text-edunova-navy tracking-tight">18</h3>
                <p className="text-xs text-slate-600 font-medium mt-1.5 flex items-center gap-1">
                  <span className="text-edunova-navy font-bold">100% asignados</span>
                  <span className="text-slate-400 font-normal">a fichas</span>
                </p>
              </div>
            </div>

            {/* 4. Asistencia Promedio */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-edunova-emerald"></div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider text-[11px]">Asistencia promedio</p>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-edunova-emerald flex items-center justify-center font-bold border border-emerald-200">
                  <CalendarCheck size={22} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-4xl font-extrabold text-edunova-navy tracking-tight">85%</h3>
                <p className="text-xs text-edunova-emerald font-bold mt-1.5 flex items-center gap-1">
                  <span>↑ +3.2%</span>
                  <span className="text-slate-400 font-normal">índice de participación</span>
                </p>
              </div>
            </div>

          </div>

          {/* ============================================================ */}
          {/* SECCIÓN RENDIMIENTO + MÓDULO EDUNOVA AI                       */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Tarjeta de Rendimiento Académico (2 columnas) */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Award size={20} className="text-edunova-gold" />
                    <h4 className="text-lg font-bold text-edunova-navy">Rendimiento académico</h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Distribución general de competencias y resultados formativos</p>
                </div>
                <span className="px-3.5 py-1.5 bg-edunova-gold/10 text-slate-900 border border-edunova-gold/30 rounded-xl text-xs font-bold">
                  Corte Evaluativo 1 · 2026
                </span>
              </div>

              <div className="space-y-6">
                
                {/* Desempeño Satisfactorio (Verde Esmeralda del Checkmark) */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-edunova-emerald text-white flex items-center justify-center font-bold">
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-800">Desempeño satisfactorio</span>
                        <p className="text-[11px] text-slate-500">187 aprendices con evidencias aprobadas (A)</p>
                      </div>
                    </div>
                    <span className="text-lg font-extrabold text-edunova-emerald">75%</span>
                  </div>
                  <div className="w-full bg-emerald-200/60 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-edunova-emerald h-full rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                </div>

                {/* Requiere Seguimiento (Dorado / Alerta del Escudo) */}
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-edunova-gold text-slate-950 flex items-center justify-center font-bold">
                        <Clock size={16} />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-800">Requiere seguimiento</span>
                        <p className="text-[11px] text-slate-500">63 aprendices con evidencias pendientes o inasistencias</p>
                      </div>
                    </div>
                    <span className="text-lg font-extrabold text-amber-700">25%</span>
                  </div>
                  <div className="w-full bg-amber-200/60 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-edunova-gold h-full rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: '25%' }}
                    ></div>
                  </div>
                </div>

              </div>

              {/* Botón de acción */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500">Calificaciones basadas en escala de 0.00 a 5.00 con retroalimentación.</p>
                <button className="text-xs font-bold text-edunova-navy hover:text-edunova-gold transition-colors flex items-center gap-1">
                  <span>Ver listado de evidencias</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            {/* Tarjeta Destacada EDUNOVA AI con los Colores del Escudo */}
            <div className="bg-gradient-to-br from-edunova-navy via-edunova-navy-dark to-[#030B14] text-white rounded-3xl p-7 shadow-2xl border-2 border-edunova-gold/40 flex flex-col justify-between relative overflow-hidden">
              
              {/* Resplandor visual dorado */}
              <div className="absolute -top-16 -right-16 w-44 h-44 bg-edunova-gold/20 rounded-full blur-3xl pointer-events-none"></div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-edunova-gold/50 flex items-center justify-center p-2 shadow-inner">
                    <img src="/edunova-logo.png" alt="Logo IA" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-edunova-gold text-slate-950 font-mono shadow-gold">
                    ASISTENTE IA
                  </span>
                </div>

                <h4 className="text-2xl font-black tracking-tight text-white mb-2 flex items-center gap-2">
                  <span>EDUNOVA AI</span>
                  <Sparkles size={18} className="text-edunova-gold" />
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Asistente inteligente para el seguimiento académico, detección de rezago y recomendaciones personalizadas de aprendizaje.
                </p>

                <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-edunova-gold/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-edunova-gold">
                    <CheckCircle2 size={15} className="text-edunova-emerald" />
                    <span>Recomendación pedagógica activa</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    4 aprendices de la ficha ADSO presentan oportunidad de mejora en la evidencia de <em>React & Tailwind</em>. Se sugiere taller de refuerzo práctico.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <button className="w-full py-3 px-4 bg-edunova-gold hover:bg-edunova-gold-hover text-slate-950 font-extrabold rounded-xl text-sm transition-all shadow-gold flex items-center justify-center gap-2">
                  <Sparkles size={16} />
                  Generar Diagnóstico con IA
                </button>
              </div>

            </div>

          </div>

          {/* ============================================================ */}
          {/* TABLA DE CURSOS ACTIVOS Y SEGUIMIENTO                        */}
          {/* ============================================================ */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-bold text-edunova-navy flex items-center gap-2">
                  <BookOpen size={20} className="text-edunova-gold" />
                  <span>Cursos y Fichas en Ejecución</span>
                </h4>
                <p className="text-xs text-slate-500">Programa: Tecnólogo en Análisis y Desarrollo de Software (ADSO)</p>
              </div>
              <span className="text-xs font-bold text-edunova-navy bg-edunova-gold/15 border border-edunova-gold/30 px-3.5 py-1.5 rounded-xl self-start sm:self-auto">
                SENA Regional Huila · Neiva
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
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
                      <div className="font-bold text-edunova-navy">Desarrollo Web Frontend (React & Tailwind)</div>
                      <div className="text-xs font-normal text-slate-400">Ficha ADSO-2026-A · Código #2874102</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">Carlos Mendoza</td>
                    <td className="px-6 py-4 font-bold text-slate-800">32 aprendices</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                          <div className="bg-edunova-navy h-full rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <span className="text-xs font-bold text-edunova-navy">65%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Activo
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-bold text-edunova-gold-hover hover:text-slate-950 transition-colors">
                        Ver ficha →
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-edunova-navy">
                      <div className="font-bold text-edunova-navy">Arquitectura Backend y APIs RESTful (Node.js)</div>
                      <div className="text-xs font-normal text-slate-400">Ficha ADSO-2026-B · Código #2874103</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">Laura Gómez</td>
                    <td className="px-6 py-4 font-bold text-slate-800">28 aprendices</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                          <div className="bg-edunova-gold h-full rounded-full" style={{ width: '40%' }}></div>
                        </div>
                        <span className="text-xs font-bold text-amber-700">40%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Activo
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-bold text-edunova-gold-hover hover:text-slate-950 transition-colors">
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
