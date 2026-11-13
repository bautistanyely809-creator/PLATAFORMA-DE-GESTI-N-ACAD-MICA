import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  CheckCircle2, 
  CalendarCheck, 
  Sparkles, 
  Award, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  TrendingUp, 
  FileText, 
  ShieldCheck, 
  Search, 
  Filter, 
  ExternalLink,
  Brain,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  GraduationCap
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';

export default function ApprenticeDashboard({ user, onNavigate }) {
  // Estado para filtro y búsqueda en cursos
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  
  // Estado para el asistente interactivo de EDUNOVA AI
  const [activePrompt, setActivePrompt] = useState(null);
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessingAi, setIsProcessingAi] = useState(false);

  // Datos reales del modelo de la base de datos para Anyely
  const fichaInfo = {
    codigo: '2874102',
    programa: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    centro: 'Centro de Formación Industrial - SENA Regional Huila',
    aprendicesCount: 32,
    asistenciaPorcentaje: 92,
    asistenciasCount: 23,
    sesionesTotales: 25,
    evidenciasAprobadas: 8,
    evidenciasTotales: 10
  };

  // Cursos en los que Anyely está inscrita (según edunova_db.sql)
  const misCursos = [
    {
      id: 1,
      nombre: 'Desarrollo Web Frontend Moderno (React & Tailwind)',
      codigo: 'ADSO-2026-A',
      instructor: 'Carlos Mendoza',
      especialidad: 'Frontend & Arquitectura UI',
      fechaFin: '15 Abr 2026',
      progreso: 85,
      notaActual: 4.8,
      estado: 'ACTIVO',
      evidencias: [
        { nombre: 'Prototipo UI en Figma', nota: 4.8, estado: 'APROBADO', fecha: '10 Mar 2026' },
        { nombre: 'Maquetación con React & Tailwind', nota: 4.6, estado: 'APROBADO', fecha: '25 Mar 2026' },
        { nombre: 'Consumo REST con Axios & JWT', nota: null, estado: 'PENDIENTE', fecha: '10 Abr 2026' }
      ]
    },
    {
      id: 2,
      nombre: 'Arquitectura Backend y APIs RESTful (Node & Express)',
      codigo: 'ADSO-2026-B',
      instructor: 'Laura Gómez',
      especialidad: 'Backend & Bases de Datos',
      fechaFin: '30 Abr 2026',
      progreso: 70,
      notaActual: 4.5,
      estado: 'ACTIVO',
      evidencias: [
        { nombre: 'Modelo de Datos y Script MySQL', nota: 4.7, estado: 'APROBADO', fecha: '18 Mar 2026' },
        { nombre: 'Servidor Express con Rutas y JWT', nota: 4.4, estado: 'APROBADO', fecha: '02 Abr 2026' },
        { nombre: 'Pruebas de Integración con Postman', nota: null, estado: 'PENDIENTE', fecha: '20 Abr 2026' }
      ]
    }
  ];

  // Datos para el Gráfico Donut de Recharts
  const pieData = [
    { name: 'Evidencias Aprobadas', value: 8, color: '#16A36A' }, // Verde de éxito
    { name: 'Evidencias Pendientes', value: 2, color: '#DCA91F' }, // Dorado principal
  ];

  // Datos de Rendimiento por Curso para Recharts
  const coursePerformanceData = [
    { curso: 'Frontend React', calificacion: 96, label: '4.8' },
    { curso: 'Backend Node', calificacion: 90, label: '4.5' },
    { curso: 'Bases de Datos', calificacion: 92, label: '4.6' },
    { curso: 'Metodologías Ágiles', calificacion: 98, label: '4.9' },
  ];

  // Disparador de sugerencias rápidas de EDUNOVA AI
  const handleAiPromptClick = (promptKey) => {
    setActivePrompt(promptKey);
    setIsProcessingAi(true);
    setAiResponse('');

    setTimeout(() => {
      setIsProcessingAi(false);
      if (promptKey === 'analisis') {
        setAiResponse(
          '🔍 Análisis de Desempeño: Anyely, tu promedio general es de 4.65 / 5.0 (Sobresaliente). Tu tasa de asistencia (92%) te posiciona en el 10% superior de la ficha ADSO-2874102. Tienes una alta destreza en componentización con React.'
        );
      } else if (promptKey === 'pendientes') {
        setAiResponse(
          '⚠️ Evidencias Prioritarias: Tienes pendiente la entrega de "Consumo REST con Axios & JWT" para el 10 de Abril en el curso de Frontend. Se sugiere verificar el manejo de tokens en LocalStorage y encabezados Authorization.'
        );
      } else if (promptKey === 'estudio') {
        setAiResponse(
          '💡 Recomendación Pedagógica: Dedica 45 minutos esta semana a practicar la gestión asíncrona de llamadas HTTP con useEffect y hooks personalizados. Esto garantizará una sustentación impecable ante el comité de instructores.'
        );
      }
    }, 600);
  };

  // Filtrado de cursos
  const filteredCursos = misCursos.filter(c => {
    const matchesSearch = c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-12">
      
      {/* ============================================================ */}
      {/* 1. HERO BANNER DE BIENVENIDA CON DEGRADADO PREMIUM          */}
      {/* ============================================================ */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-edunova-midnight via-edunova-darkNavy to-edunova-electric p-7 sm:p-9 text-white shadow-saas-card border border-white/10">
        
        {/* Detalles geométricos de fondo en SVG */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" r="180" stroke="white" strokeWidth="2" strokeDasharray="10 10" />
            <circle cx="200" cy="200" r="130" stroke="#3978F6" strokeWidth="3" />
            <circle cx="200" cy="200" r="70" stroke="#DCA91F" strokeWidth="2" />
            <path d="M50 200L350 200M200 50L200 350" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
          </svg>
        </div>

        {/* Resplandor decorativo */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-edunova-electric/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-edunova-gold text-xs font-bold uppercase tracking-wider">
              <ShieldCheck size={14} className="text-edunova-gold" />
              <span>Portal Académico Oficial · ADSO</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              ¡Hola, {user?.nombre || 'Anyely Valeria'}! 👋
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
              Bienvenida a tu espacio de formación tecnológica. Tu rendimiento acumulado está al <strong className="text-edunova-goldLight font-bold">92% de cumplimiento</strong> con 8 evidencias aprobadas en el programa <strong className="text-white">{fichaInfo.programa}</strong>.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <BookOpen size={15} className="text-edunova-gold" />
                <span>Ficha: <strong>#{fichaInfo.codigo}</strong></span>
              </span>
              <span className="hidden sm:inline text-slate-500">•</span>
              <span className="flex items-center gap-1.5">
                <GraduationCap size={15} className="text-edunova-teal" />
                <span>Centro de Formación Industrial · Neiva</span>
              </span>
            </div>

          </div>

          {/* Botones de Acción del Banner */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button 
              onClick={() => onNavigate && onNavigate('reportes')}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 backdrop-blur-md shadow-sm"
            >
              <FileText size={16} className="text-edunova-gold" />
              <span>Consultar Reporte Académico</span>
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('calificaciones')}
              className="px-5 py-3 bg-gradient-to-r from-edunova-gold to-edunova-goldLight hover:from-amber-500 hover:to-amber-400 text-slate-950 rounded-xl text-xs sm:text-sm font-extrabold shadow-gold-glow transition-all flex items-center justify-center gap-2"
            >
              <span>Ver Evidencias</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* 2. TARJETAS ESTADÍSTICAS CON HOVER ELEVATION Y PROGRESO      */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Tarjeta 1: Compañeros de Ficha */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-saas-card hover:-translate-y-1 hover:shadow-saas-hover transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-edunova-midnight"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-edunova-textSecondary uppercase tracking-wider">
              Compañeros de Ficha
            </span>
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-edunova-midnight flex items-center justify-center group-hover:bg-edunova-midnight group-hover:text-edunova-gold transition-colors shadow-sm">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-edunova-textPrimary tracking-tight">
                {fichaInfo.aprendicesCount}
              </h3>
              <span className="text-xs font-semibold text-slate-500">aprendices</span>
            </div>
            <p className="text-xs text-edunova-teal font-bold mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-edunova-teal animate-pulse"></span>
              <span>Ficha Activa #{fichaInfo.codigo}</span>
            </p>
          </div>
        </div>

        {/* Tarjeta 2: Mis Cursos */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-saas-card hover:-translate-y-1 hover:shadow-saas-hover transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-edunova-electric"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-edunova-textSecondary uppercase tracking-wider">
              Mis Cursos
            </span>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-edunova-electric flex items-center justify-center group-hover:bg-edunova-electric group-hover:text-white transition-colors shadow-sm">
              <BookOpen size={20} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-edunova-textPrimary tracking-tight">
                {misCursos.length}
              </h3>
              <span className="text-xs font-semibold text-slate-500">en ejecución</span>
            </div>
            <p className="text-xs text-edunova-electric font-bold mt-2 flex items-center gap-1.5">
              <span>Frontend React + Backend Node</span>
            </p>
          </div>
        </div>

        {/* Tarjeta 3: Evidencias Aprobadas */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-saas-card hover:-translate-y-1 hover:shadow-saas-hover transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-edunova-success"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-edunova-textSecondary uppercase tracking-wider">
              Evidencias Aprobadas
            </span>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-edunova-success flex items-center justify-center group-hover:bg-edunova-success group-hover:text-white transition-colors shadow-sm">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-edunova-textPrimary tracking-tight">
                {fichaInfo.evidenciasAprobadas} <span className="text-lg font-bold text-slate-400">/ {fichaInfo.evidenciasTotales}</span>
              </h3>
              <span className="text-xs font-bold text-edunova-success">80%</span>
            </div>
            
            {/* Barra de progreso */}
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div 
                className="bg-edunova-success h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: '80%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tarjeta 4: Mi Asistencia */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-saas-card hover:-translate-y-1 hover:shadow-saas-hover transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-edunova-gold"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-edunova-textSecondary uppercase tracking-wider">
              Mi Asistencia
            </span>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-edunova-gold flex items-center justify-center group-hover:bg-edunova-gold group-hover:text-slate-950 transition-colors shadow-sm">
              <CalendarCheck size={20} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-edunova-textPrimary tracking-tight">
                {fichaInfo.asistenciaPorcentaje}%
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                ({fichaInfo.asistenciasCount}/{fichaInfo.sesionesTotales} sesiones)
              </span>
            </div>
            
            {/* Barra de progreso */}
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div 
                className="bg-edunova-gold h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${fichaInfo.asistenciaPorcentaje}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 3. SECCIÓN DE RENDIMIENTO ACADÉMICO + EDUNOVA AI            */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Rendimiento Formativo con Recharts Interactivo (7 Columnas) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-saas-card space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Award size={20} className="text-edunova-gold" />
                <h3 className="text-lg font-bold text-edunova-textPrimary">
                  Rendimiento Formativo Acumulado
                </h3>
              </div>
              <p className="text-xs text-edunova-textSecondary mt-0.5">
                Distribución de evidencias de aprendizaje y promedio por competencias
              </p>
            </div>
            
            <span className="self-start sm:self-auto px-3 py-1 bg-emerald-50 text-edunova-success border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              <span>Estado: Al Día (A)</span>
            </span>
          </div>

          {/* Gráfico Donut y Métricas Clave */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            
            {/* Gráfico Recharts Donut (5 columnas) */}
            <div className="sm:col-span-5 h-52 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#0B1D33', 
                      borderRadius: '12px', 
                      border: 'none', 
                      color: '#FFF', 
                      fontSize: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.2)' 
                    }}
                  />
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Texto en el centro del Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-edunova-textPrimary">80%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aprobado</span>
              </div>
            </div>

            {/* Desglose de Evidencias (7 columnas) */}
            <div className="sm:col-span-7 space-y-3.5">
              
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-edunova-success text-white flex items-center justify-center font-bold shrink-0">
                    <CheckCircle2 size={17} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">8 Evidencias Aprobadas</p>
                    <p className="text-[11px] text-slate-500">Promedio general: 4.65 / 5.0</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-edunova-success bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                  80%
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-edunova-gold text-slate-950 flex items-center justify-center font-bold shrink-0">
                    <Clock size={17} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">2 Evidencias Pendientes</p>
                    <p className="text-[11px] text-slate-500">Entrega programada para Abril 2026</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-amber-700 bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                  20%
                </span>
              </div>

            </div>

          </div>

          {/* Gráfico de Barras de Rendimiento por Curso */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <p className="text-xs font-bold text-edunova-textPrimary uppercase tracking-wider">
              Desempeño por Asignatura / Módulo
            </p>

            <div className="space-y-3">
              {misCursos.map((c) => (
                <div key={c.id} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 truncate max-w-xs">{c.nombre}</span>
                    <span className="font-extrabold text-edunova-electric">{c.notaActual} / 5.0</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-edunova-electric to-blue-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${(c.notaActual / 5.0) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Módulo EDUNOVA AI Inteligente (5 Columnas) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-edunova-midnight via-edunova-darkNavy to-[#181136] text-white rounded-3xl p-6 sm:p-7 shadow-ai-glow border border-edunova-violet/40 flex flex-col justify-between relative overflow-hidden">
          
          {/* Resplandor violeta de fondo */}
          <div className="absolute -top-16 -right-16 w-52 h-52 bg-edunova-violet/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-4">
            
            {/* Header del Asistente */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-edunova-violet to-edunova-electric flex items-center justify-center p-2.5 shadow-md shadow-violet-900/40">
                  <Sparkles size={22} className="text-white animate-spin-slow" />
                </div>
                <div>
                  <h4 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                    EDUNOVA AI
                  </h4>
                  <p className="text-[11px] text-edunova-goldLight font-medium">
                    Tutor Inteligente de Aprendizaje
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-edunova-violet/30 border border-edunova-violet/50 text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                IA ACTIVA
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Analizo tu desempeño académico en tiempo real para recomendarte estrategias de estudio, detectar dudas formativas y ayudarte a sustentar con éxito.
            </p>

            {/* Tarjeta de Sugerencia Predefinida */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-edunova-gold">
                <Lightbulb size={16} />
                <span>Diagnóstico Personalizado de Hoy</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "Excelente progreso en React Hooks y diseño responsive con Tailwind. Te recomendamos repasar los <strong>interceptores de Axios</strong> antes de la entrega del 10 de Abril."
              </p>
            </div>

            {/* Botones de Consulta Rápida */}
            <div className="space-y-2 pt-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Consultas Rápidas de IA:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => handleAiPromptClick('analisis')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[11px] font-semibold text-slate-200 transition-colors border border-white/10 text-center truncate"
                >
                  📊 Mi Resumen
                </button>
                <button
                  onClick={() => handleAiPromptClick('pendientes')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[11px] font-semibold text-slate-200 transition-colors border border-white/10 text-center truncate"
                >
                  ⏳ Pendientes
                </button>
                <button
                  onClick={() => handleAiPromptClick('estudio')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[11px] font-semibold text-slate-200 transition-colors border border-white/10 text-center truncate"
                >
                  🎯 Plan Estudio
                </button>
              </div>
            </div>

            {/* Respuesta dinámica de la IA */}
            {(isProcessingAi || aiResponse) && (
              <div className="p-4 rounded-2xl bg-edunova-violet/20 border border-edunova-violet/40 text-xs text-slate-100 animate-slideUp">
                {isProcessingAi ? (
                  <div className="flex items-center gap-2 text-edunova-gold">
                    <span className="w-2 h-2 rounded-full bg-edunova-gold animate-ping"></span>
                    <span>Procesando análisis formativo con EDUNOVA AI...</span>
                  </div>
                ) : (
                  <p className="leading-relaxed">{aiResponse}</p>
                )}
              </div>
            )}

          </div>

          {/* Botón Principal del Módulo IA */}
          <div className="relative z-10 pt-5 mt-4 border-t border-white/10">
            <button 
              onClick={() => handleAiPromptClick('analisis')}
              className="w-full py-3 px-4 bg-gradient-to-r from-edunova-violet to-edunova-electric hover:from-purple-600 hover:to-blue-600 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-ai-glow transition-all flex items-center justify-center gap-2"
            >
              <Brain size={16} />
              <span>Generar Informe de Aprendizaje con IA</span>
            </button>
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* 4. TABLA MODERNA: MIS CURSOS & FICHAS EN EJECUCIÓN           */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-saas-card overflow-hidden">
        
        {/* Cabecera de la Tabla con Buscador Dinámico */}
        <div className="p-6 sm:p-7 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-edunova-textPrimary flex items-center gap-2">
              <BookOpen size={20} className="text-edunova-gold" />
              <span>Mis Cursos Matriculados</span>
            </h3>
            <p className="text-xs text-edunova-textSecondary mt-0.5">
              Cursos técnicos del tecnólogo en Análisis y Desarrollo de Software (ADSO)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar por curso o instructor..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-edunova-electric focus:outline-none transition-all"
              />
            </div>
            
            <span className="hidden sm:inline-flex px-3 py-2 bg-edunova-canvas border border-slate-200 rounded-xl text-xs font-semibold text-slate-600">
              {filteredCursos.length} Cursos
            </span>
          </div>
        </div>

        {/* Tabla SaaS Responsive */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Curso / Ficha</th>
                <th className="px-6 py-4">Instructor Titular</th>
                <th className="px-6 py-4">Fecha Finalización</th>
                <th className="px-6 py-4">Avance</th>
                <th className="px-6 py-4">Nota Promedio</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {filteredCursos.length > 0 ? (
                filteredCursos.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Curso */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-edunova-textPrimary text-xs sm:text-sm">
                        {c.nombre}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        {c.codigo} · Programa ADSO
                      </div>
                    </td>

                    {/* Instructor */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-edunova-midnight text-edunova-gold font-bold text-xs flex items-center justify-center shrink-0">
                          {c.instructor.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{c.instructor}</p>
                          <p className="text-[11px] text-slate-400">{c.especialidad}</p>
                        </div>
                      </div>
                    </td>

                    {/* Fecha */}
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">
                      {c.fechaFin}
                    </td>

                    {/* Progreso */}
                    <td className="px-6 py-4">
                      <div className="w-32 space-y-1">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700">
                          <span>{c.progreso}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-edunova-electric h-full rounded-full transition-all duration-700"
                            style={{ width: `${c.progreso}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Nota */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-50 text-edunova-success border border-emerald-200">
                        {c.notaActual} / 5.0 (A)
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onNavigate && onNavigate('calificaciones')}
                        className="text-xs font-bold text-edunova-electric hover:text-blue-700 transition-colors inline-flex items-center gap-1"
                      >
                        <span>Ver Evidencias</span>
                        <ChevronRight size={15} />
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-400 text-xs">
                    No se encontraron cursos coincidentes con la búsqueda.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}

