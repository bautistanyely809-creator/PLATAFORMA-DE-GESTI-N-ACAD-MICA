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
  Brain, 
  Lightbulb, 
  GraduationCap,
  Star,
  Check,
  FolderOpen
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip 
} from 'recharts';

export default function ApprenticeDashboard({ user, onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activePrompt, setActivePrompt] = useState(null);
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessingAi, setIsProcessingAi] = useState(false);

  // Información real de la ficha y programa de formación
  const fichaInfo = {
    codigo: '2874102',
    programa: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    centro: 'Centro de Formación Industrial – SENA Regional Huila',
    aprendicesCount: 32,
    asistenciaPorcentaje: 92,
    asistenciasCount: 23,
    sesionesTotales: 25,
    evidenciasAprobadas: 8,
    evidenciasTotales: 10
  };

  // Cursos matriculados reales
  const misCursos = [
    {
      id: 1,
      nombre: 'Desarrollo Web Frontend Moderno (React & Tailwind)',
      codigo: 'ADSO-2026-A',
      instructor: 'Carlos Mendoza',
      especialidad: 'Frontend & UI Engineering',
      fechaFin: '15 Abr 2026',
      progreso: 85,
      notaActual: 4.8,
      colorTag: 'bg-[#FCE4F2] text-[#D6409B]',
      progressBar: 'from-[#F7B8DC] to-[#A78BFA]',
      evidencias: [
        { nombre: 'Prototipo UI en Figma (Dashboard)', nota: 4.8, estado: 'APROBADO', fecha: '10 Mar 2026' },
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
      colorTag: 'bg-[#DCEBFA] text-[#3978F6]',
      progressBar: 'from-[#A5D8FA] to-[#8064D8]',
      evidencias: [
        { nombre: 'Modelo de Datos y Script MySQL', nota: 4.7, estado: 'APROBADO', fecha: '18 Mar 2026' },
        { nombre: 'Servidor Express con Rutas y JWT', nota: 4.4, estado: 'APROBADO', fecha: '02 Abr 2026' },
        { nombre: 'Pruebas de Integración con Postman', nota: null, estado: 'PENDIENTE', fecha: '20 Abr 2026' }
      ]
    }
  ];

  // Datos para el Donut Chart Pastel
  const pieData = [
    { name: 'Evidencias Aprobadas', value: 8, color: '#8CE2C2' }, // Verde menta
    { name: 'Evidencias Pendientes', value: 2, color: '#F7B8DC' }, // Rosa pastel
  ];

  // Disparador interactivo de EDUNOVA AI
  const handleAiPromptClick = (promptKey) => {
    setActivePrompt(promptKey);
    setIsProcessingAi(true);
    setAiResponse('');

    setTimeout(() => {
      setIsProcessingAi(false);
      if (promptKey === 'analisis') {
        setAiResponse(
          '🌸 Diagnóstico de Aprendizaje: ¡Excelente trabajo Anyely! Tu promedio ponderado es de 4.65 / 5.0. Tu mayor fortaleza se encuentra en diseño de interfaces limpias y componentes reactivos. Tu puntualidad y participación en el Centro de Formación Industrial están en el percentil superior.'
        );
      } else if (promptKey === 'pendientes') {
        setAiResponse(
          '⏳ Tareas Clave: Tu próxima evidencia por entregar es "Consumo REST con Axios & JWT" (fecha estimada: 10 de Abril). Recuerda verificar el manejo seguro de tokens en LocalStorage e interceptores para evitar fugas de autenticación.'
        );
      } else if (promptKey === 'ruta') {
        setAiResponse(
          '🎯 Plan de Refuerzo Sugerido: Dedica 40 minutos a experimentar con hooks personalizados (Custom Hooks) para la gestión del estado global en React. Te facilitará enormemente la sustentación técnica de ADSO.'
        );
      }
    }, 600);
  };

  const filteredCursos = misCursos.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fadeIn pb-12">
      
      {/* ============================================================ */}
      {/* 1. HERO BANNER: PASTEL GLASSMORPHISM CON DEGRADADO VIBRANTE  */}
      {/* ============================================================ */}
      <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-r from-[#F7B8DC] via-[#C8B5F5] to-[#8064D8] p-7 sm:p-10 text-white shadow-glass border border-white/60">
        
        {/* Orbes de luz y elementos flotantes decorativos */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#A5D8FA]/30 rounded-full blur-2xl pointer-events-none"></div>

        {/* Tarjeta flotante decorativa en el banner */}
        <div className="hidden xl:block absolute right-10 top-1/2 -translate-y-1/2 p-4 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/40 shadow-lg text-white max-w-xs">
          <div className="flex items-center gap-2 text-xs font-bold mb-1">
            <Sparkles size={16} className="text-[#FFE49B]" />
            <span>Progreso Sobresaliente</span>
          </div>
          <p className="text-[11px] text-white/90 leading-relaxed">
            Has completado el 80% de evidencias formativas con calificación superior a 4.5.
          </p>
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/25 backdrop-blur-md border border-white/40 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles size={14} className="text-[#FFE49B]" />
            <span>Portal del Aprendiz · ADSO 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            ¡Hola, {user?.nombre || 'Anyely Valeria'}! 🌸
          </h1>

          <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-medium">
            Bienvenida a tu espacio de formación tecnológica. Tu progreso académico actual alcanza el <strong className="text-[#FFE49B] underline decoration-wavy">92% de cumplimiento general</strong> en el programa <strong className="text-white font-extrabold">{fichaInfo.programa}</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-white/90 pt-1">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
              <BookOpen size={14} className="text-[#FFE49B]" />
              <span>Ficha: <strong>#{fichaInfo.codigo}</strong></span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
              <GraduationCap size={14} className="text-edunova-mint" />
              <span>Centro de Formación Industrial · Neiva</span>
            </span>
          </div>

          {/* Botones de Acción Rápida en Cristal */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button 
              onClick={() => onNavigate && onNavigate('calificaciones')}
              className="px-5 py-2.5 rounded-2xl bg-white text-edunova-violet font-extrabold text-xs sm:text-sm shadow-md hover:bg-white/90 hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <span>Mis Calificaciones</span>
              <ArrowRight size={15} />
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('reportes')}
              className="px-5 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm border border-white/40 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <FileText size={15} />
              <span>Ver Reporte Académico</span>
            </button>
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* 2. TARJETAS ESTADÍSTICAS: CADA UNA CON IDENTIDAD CROMÁTICA   */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Tarjeta 1: Compañeros de Ficha (Azul Cielo: #A5D8FA) */}
        <div className="glass-card glass-card-hover rounded-[26px] p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-edunova-textSecondary uppercase tracking-wider">
              Compañeros de Ficha
            </span>
            <div className="w-12 h-12 rounded-2xl bg-[#DCEBFA] text-[#3978F6] flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
              <Users size={22} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-edunova-textPrimary tracking-tight">
                {fichaInfo.aprendicesCount}
              </h3>
              <span className="text-xs font-semibold text-edunova-textSecondary">aprendices</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-bold text-[#3978F6] bg-[#DCEBFA]/50 px-3 py-1.5 rounded-xl border border-blue-100">
              <span>Ficha #{fichaInfo.codigo}</span>
              <span className="w-2 h-2 rounded-full bg-[#3978F6] animate-pulse"></span>
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Mis Cursos (Violeta / Lila: #C8B5F5) */}
        <div className="glass-card glass-card-hover rounded-[26px] p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-edunova-textSecondary uppercase tracking-wider">
              Mis Cursos
            </span>
            <div className="w-12 h-12 rounded-2xl bg-[#EDE7FA] text-edunova-violet flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
              <BookOpen size={22} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-edunova-textPrimary tracking-tight">
                {misCursos.length}
              </h3>
              <span className="text-xs font-semibold text-edunova-textSecondary">activos</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-bold text-edunova-violet bg-[#EDE7FA]/60 px-3 py-1.5 rounded-xl border border-purple-100">
              <span>Frontend + Backend</span>
              <span>100% al día</span>
            </div>
          </div>
        </div>

        {/* Tarjeta 3: Evidencias Aprobadas (Verde Menta: #8CE2C2) */}
        <div className="glass-card glass-card-hover rounded-[26px] p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-edunova-textSecondary uppercase tracking-wider">
              Evidencias Aprobadas
            </span>
            <div className="w-12 h-12 rounded-2xl bg-[#E6F9F2] text-[#16A36A] flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
              <CheckCircle2 size={22} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-edunova-textPrimary tracking-tight">
                {fichaInfo.evidenciasAprobadas} <span className="text-lg font-bold text-slate-400">/ {fichaInfo.evidenciasTotales}</span>
              </h3>
              <span className="text-xs font-extrabold text-[#16A36A]">80%</span>
            </div>
            
            {/* Barra de progreso menta */}
            <div className="w-full bg-[#E6F9F2] rounded-full h-2.5 mt-3 overflow-hidden border border-emerald-100">
              <div 
                className="bg-gradient-to-r from-edunova-mint to-[#16A36A] h-full rounded-full transition-all duration-1000"
                style={{ width: '80%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tarjeta 4: Mi Asistencia (Rosa Pastel: #F7B8DC) */}
        <div className="glass-card glass-card-hover rounded-[26px] p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-edunova-textSecondary uppercase tracking-wider">
              Mi Asistencia
            </span>
            <div className="w-12 h-12 rounded-2xl bg-[#FCE4F2] text-[#D6409B] flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
              <CalendarCheck size={22} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-edunova-textPrimary tracking-tight">
                {fichaInfo.asistenciaPorcentaje}%
              </h3>
              <span className="text-xs font-semibold text-edunova-textSecondary">
                ({fichaInfo.asistenciasCount}/{fichaInfo.sesionesTotales} sesiones)
              </span>
            </div>
            
            {/* Barra de progreso rosa */}
            <div className="w-full bg-[#FCE4F2] rounded-full h-2.5 mt-3 overflow-hidden border border-pink-100">
              <div 
                className="bg-gradient-to-r from-[#F7B8DC] to-[#D6409B] h-full rounded-full transition-all duration-1000"
                style={{ width: `${fichaInfo.asistenciaPorcentaje}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 3. SECCIÓN: RENDIMIENTO FORMATIVO + EDUNOVA AI GLASS         */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Tarjeta de Rendimiento Académico con Recharts Donut (7 Columnas) */}
        <div className="lg:col-span-7 glass-panel rounded-[30px] p-6 sm:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100/70 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFF6DC] text-[#DCA91F] flex items-center justify-center font-bold">
                  <Award size={18} />
                </div>
                <h3 className="text-lg font-bold text-edunova-textPrimary">
                  Rendimiento Formativo Integral
                </h3>
              </div>
              <p className="text-xs text-edunova-textSecondary mt-0.5">
                Distribución de evidencias de aprendizaje y promedio por competencias
              </p>
            </div>
            
            <span className="self-start sm:self-auto px-3 py-1 bg-[#E6F9F2] text-[#16A36A] border border-emerald-200/80 rounded-xl text-xs font-extrabold flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              <span>Estado: Sobresaliente (A)</span>
            </span>
          </div>

          {/* Gráfico Donut y Métricas Clave */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            
            {/* Donut Chart de Recharts (5 columnas) */}
            <div className="sm:col-span-5 h-52 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(57, 44, 82, 0.95)', 
                      borderRadius: '16px', 
                      border: 'none', 
                      color: '#FFF', 
                      fontSize: '12px',
                      boxShadow: '0 10px 30px rgba(128, 100, 216, 0.25)' 
                    }}
                  />
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Centro del Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-edunova-textPrimary">80%</span>
                <span className="text-[10px] font-bold text-edunova-textSecondary uppercase tracking-wider">Aprobado</span>
              </div>
            </div>

            {/* Desglose de Evidencias Pastel (7 columnas) */}
            <div className="sm:col-span-7 space-y-3">
              
              <div className="p-3.5 rounded-2xl bg-[#E6F9F2]/70 border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-edunova-mint text-[#16A36A] flex items-center justify-center font-bold shrink-0">
                    <CheckCircle2 size={17} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-edunova-textPrimary">8 Evidencias Aprobadas</p>
                    <p className="text-[11px] text-edunova-textSecondary">Promedio actual: 4.65 / 5.0</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#16A36A] bg-white px-2.5 py-1 rounded-xl shadow-sm border border-emerald-100">
                  80%
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FCE4F2]/70 border border-pink-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-edunova-pinkPastel text-[#D6409B] flex items-center justify-center font-bold shrink-0">
                    <Clock size={17} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-edunova-textPrimary">2 Evidencias Pendientes</p>
                    <p className="text-[11px] text-edunova-textSecondary">Entrega programada para Abril 2026</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#D6409B] bg-white px-2.5 py-1 rounded-xl shadow-sm border border-pink-100">
                  20%
                </span>
              </div>

            </div>

          </div>

          {/* Comparativa por Asignatura */}
          <div className="pt-4 border-t border-purple-100/70 space-y-3.5">
            <p className="text-xs font-extrabold text-edunova-textPrimary uppercase tracking-wider">
              Desempeño por Asignatura Técnica
            </p>

            <div className="space-y-3">
              {misCursos.map((c) => (
                <div key={c.id} className="space-y-1.5 p-3 rounded-2xl bg-white/70 border border-purple-50">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-edunova-textPrimary truncate">{c.nombre}</span>
                    <span className="font-extrabold text-edunova-violet">{c.notaActual} / 5.0 (A)</span>
                  </div>
                  <div className="w-full bg-purple-100/50 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`bg-gradient-to-r ${c.progressBar} h-full rounded-full transition-all duration-1000`}
                      style={{ width: `${(c.notaActual / 5.0) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Módulo EDUNOVA AI: Glassmorphism Violeta/Rosa (5 Columnas) */}
        <div className="lg:col-span-5 glass-panel rounded-[30px] p-6 sm:p-8 flex flex-col justify-between border-2 border-white/90 relative overflow-hidden bg-gradient-to-br from-white/90 via-[#FCE4F2]/40 to-[#EDE7FA]/60 shadow-glass">
          
          <div className="space-y-4">
            
            {/* Header del Tutor IA */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F7B8DC] via-[#C8B5F5] to-[#8064D8] flex items-center justify-center p-2.5 shadow-md shadow-purple-200/50">
                  <Sparkles size={22} className="text-white animate-spin-slow" />
                </div>
                <div>
                  <h4 className="text-lg font-black tracking-tight text-edunova-textPrimary flex items-center gap-1.5">
                    EDUNOVA AI
                  </h4>
                  <p className="text-[11px] text-edunova-violet font-semibold">
                    Tutor Pedagógico Inteligente
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#EDE7FA] border border-purple-200/80 text-edunova-violet text-[10px] font-mono font-bold uppercase tracking-wider">
                IA ACTIVA
              </span>
            </div>

            <p className="text-xs text-edunova-textSecondary leading-relaxed">
              Analizo tus calificaciones, asistencia y evidencias formativas en tiempo real para recomendarte estrategias de estudio personalizadas.
            </p>

            {/* Burbuja de Sugerencia del Asistente */}
            <div className="p-4 rounded-2xl bg-white/80 border border-purple-100/80 space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-edunova-violet">
                <Lightbulb size={16} className="text-[#FFE49B]" />
                <span>Recomendación del Día</span>
              </div>
              <p className="text-xs text-edunova-textPrimary leading-relaxed">
                "Excelente dominio de componentes y maquetación Tailwind. Te sugerimos repasar la configuración de <strong>interceptores en Axios</strong> para la entrega de la próxima semana."
              </p>
            </div>

            {/* Botones de Consulta Rápida Pastel */}
            <div className="space-y-2 pt-1">
              <p className="text-[10px] font-extrabold text-[#9A90AC] uppercase tracking-wider">
                Consultas Rápidas de IA:
              </p>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleAiPromptClick('analisis')}
                  className="px-2.5 py-2 bg-white/90 hover:bg-[#FCE4F2] rounded-xl text-[11px] font-bold text-edunova-textPrimary transition-all border border-purple-100 text-center truncate shadow-sm"
                >
                  🌸 Mi Estado
                </button>
                <button
                  onClick={() => handleAiPromptClick('pendientes')}
                  className="px-2.5 py-2 bg-white/90 hover:bg-[#FFF6DC] rounded-xl text-[11px] font-bold text-edunova-textPrimary transition-all border border-purple-100 text-center truncate shadow-sm"
                >
                  ⏳ Pendientes
                </button>
                <button
                  onClick={() => handleAiPromptClick('ruta')}
                  className="px-2.5 py-2 bg-white/90 hover:bg-[#DCEBFA] rounded-xl text-[11px] font-bold text-edunova-textPrimary transition-all border border-purple-100 text-center truncate shadow-sm"
                >
                  🎯 Plan Guía
                </button>
              </div>
            </div>

            {/* Respuesta Procesada en Vivo */}
            {(isProcessingAi || aiResponse) && (
              <div className="p-4 rounded-2xl bg-white/95 border border-purple-200 text-xs text-edunova-textPrimary animate-slideUp shadow-md">
                {isProcessingAi ? (
                  <div className="flex items-center gap-2 text-edunova-violet font-bold">
                    <span className="w-2 h-2 rounded-full bg-edunova-violet animate-ping"></span>
                    <span>Procesando análisis formativo con EDUNOVA AI...</span>
                  </div>
                ) : (
                  <p className="leading-relaxed">{aiResponse}</p>
                )}
              </div>
            )}

          </div>

          {/* Botón Principal del Módulo IA */}
          <div className="pt-5 mt-4 border-t border-purple-100/60">
            <button 
              onClick={() => handleAiPromptClick('analisis')}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#F7B8DC] via-[#C8B5F5] to-[#8064D8] hover:opacity-95 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-pastel-violet transition-all flex items-center justify-center gap-2"
            >
              <Brain size={16} />
              <span>Generar Informe de Aprendizaje con IA</span>
            </button>
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* 4. TABLA GLASSMORPHISM: MIS CURSOS MATRICULADOS             */}
      {/* ============================================================ */}
      <div className="glass-panel rounded-[30px] border border-white/80 overflow-hidden shadow-glass">
        
        {/* Cabecera con Buscador Dinámico */}
        <div className="p-6 sm:p-7 border-b border-purple-100/70 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-white/90 to-purple-50/30">
          <div>
            <h3 className="text-lg font-bold text-edunova-textPrimary flex items-center gap-2">
              <FolderOpen size={20} className="text-edunova-violet" />
              <span>Mis Cursos Matriculados</span>
            </h3>
            <p className="text-xs text-edunova-textSecondary mt-0.5">
              Cursos técnicos en ejecución · ADSO Ficha #{fichaInfo.codigo}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-edunova-textSecondary" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por curso o docente..."
                className="w-full pl-9 pr-3.5 py-2 bg-white/90 border border-purple-100 rounded-full text-xs text-edunova-textPrimary focus:bg-white focus:border-edunova-lavender focus:outline-none transition-all"
              />
            </div>
            
            <span className="hidden sm:inline-flex px-3 py-1.5 bg-white/80 border border-purple-100 rounded-full text-xs font-bold text-edunova-violet">
              {filteredCursos.length} Cursos
            </span>
          </div>
        </div>

        {/* Tabla Glassmorphism */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-edunova-textSecondary">
            <thead className="bg-[#FAF8FD] text-[11px] font-extrabold text-[#8A819C] uppercase tracking-wider border-b border-purple-100/60">
              <tr>
                <th className="px-6 py-4">Curso / Ficha</th>
                <th className="px-6 py-4">Instructor Titular</th>
                <th className="px-6 py-4">Finalización</th>
                <th className="px-6 py-4">Avance</th>
                <th className="px-6 py-4">Calificación</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              
              {filteredCursos.length > 0 ? (
                filteredCursos.map((c) => (
                  <tr key={c.id} className="hover:bg-white/60 transition-colors">
                    
                    {/* Curso */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-edunova-textPrimary text-xs sm:text-sm">
                        {c.nombre}
                      </div>
                      <div className="text-[11px] text-[#A59CB7] font-mono mt-0.5">
                        {c.codigo} · Programa ADSO
                      </div>
                    </td>

                    {/* Instructor */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FCE4F2] to-[#DCEBFA] text-edunova-violet font-extrabold text-xs flex items-center justify-center shrink-0 border border-white">
                          {c.instructor.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-edunova-textPrimary">{c.instructor}</p>
                          <p className="text-[11px] text-[#9A90AC]">{c.especialidad}</p>
                        </div>
                      </div>
                    </td>

                    {/* Fecha */}
                    <td className="px-6 py-4 text-xs font-semibold text-edunova-textSecondary">
                      {c.fechaFin}
                    </td>

                    {/* Progreso */}
                    <td className="px-6 py-4">
                      <div className="w-32 space-y-1">
                        <div className="flex justify-between text-[11px] font-bold text-edunova-textPrimary">
                          <span>{c.progreso}%</span>
                        </div>
                        <div className="w-full bg-purple-100/50 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`bg-gradient-to-r ${c.progressBar} h-full rounded-full transition-all duration-700`}
                            style={{ width: `${c.progreso}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Calificación */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-extrabold bg-[#E6F9F2] text-[#16A36A] border border-emerald-100 shadow-sm">
                        {c.notaActual} / 5.0 (A)
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onNavigate && onNavigate('calificaciones')}
                        className="text-xs font-extrabold text-edunova-violet hover:text-[#5B3EBD] transition-colors inline-flex items-center gap-1 bg-white/80 hover:bg-white px-3 py-1.5 rounded-xl border border-purple-100 shadow-sm"
                      >
                        <span>Evidencias</span>
                        <ChevronRight size={14} />
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-edunova-textSecondary text-xs">
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
