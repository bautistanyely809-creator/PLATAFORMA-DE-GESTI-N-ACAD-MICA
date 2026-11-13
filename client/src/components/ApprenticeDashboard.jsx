import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  FolderOpen,
  Zap,
  ChevronLeft,
  RefreshCw,
  Send
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip 
} from 'recharts';
import { useDebounce } from '../hooks/useDebounce';
import { BannerSkeleton, StatCardSkeleton, ChartSkeleton, TableSkeleton } from './Skeletons';

export default function ApprenticeDashboard({ user, onNavigate }) {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePrompt, setActivePrompt] = useState(null);
  const [aiStreamedText, setAiStreamedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2; // Paginación optimizada

  // Simulación de carga paralela con Skeletons (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Búsqueda reactiva con Debounce (300ms) para evitar re-renders y llamadas duplicadas
  const debouncedSearch = useDebounce(searchTerm, 300);

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
  const [cursosList, setCursosList] = useState([
    {
      id: 1,
      nombre: 'Desarrollo Web Frontend Moderno (React & Tailwind)',
      codigo: 'ADSO-2026-A',
      instructor: 'Carlos Mendoza',
      especialidad: 'Frontend & UI Engineering',
      fechaFin: '15 Abr 2026',
      progreso: 85,
      notaActual: 4.8,
      colorTag: 'bg-[#EBF7FC] text-[#17365D]',
      progressBar: 'from-[#17365D] via-[#19B5A5] to-[#48BFE3]',
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
      colorTag: 'bg-[#E8F8F5] text-[#19B5A5]',
      progressBar: 'from-[#123B50] via-[#17365D] to-[#19B5A5]',
      evidencias: [
        { nombre: 'Modelo de Datos y Script MySQL', nota: 4.7, estado: 'APROBADO', fecha: '18 Mar 2026' },
        { nombre: 'Servidor Express con Rutas y JWT', nota: 4.4, estado: 'APROBADO', fecha: '02 Abr 2026' },
        { nombre: 'Pruebas de Integración con Postman', nota: null, estado: 'PENDIENTE', fecha: '20 Abr 2026' }
      ]
    },
    {
      id: 3,
      nombre: 'Metodologías Ágiles y Scrum para Desarrollo de Software',
      codigo: 'ADSO-2026-C',
      instructor: 'Andrés Morales',
      especialidad: 'Gestión Ágil de Proyectos',
      fechaFin: '20 May 2026',
      progreso: 90,
      notaActual: 4.9,
      colorTag: 'bg-[#FEF8EC] text-[#E9B949]',
      progressBar: 'from-[#102A43] via-[#19B5A5] to-[#70D6B3]',
      evidencias: [
        { nombre: 'Product Backlog y Sprint Planning', nota: 4.9, estado: 'APROBADO', fecha: '15 Mar 2026' },
        { nombre: 'Matriz de Trazabilidad de Requisitos', nota: 5.0, estado: 'APROBADO', fecha: '28 Mar 2026' }
      ]
    }
  ]);

  // Actualización Optimista de la interfaz (sin esperar al servidor)
  const handleOptimisticSubmit = (cursoId) => {
    setCursosList(prev => prev.map(c => {
      if (c.id === cursoId) {
        return {
          ...c,
          progreso: Math.min(100, c.progreso + 5),
          notaActual: 4.9
        };
      }
      return c;
    }));
  };

  // Datos para el Donut Chart Ocean Tech
  const pieData = [
    { name: 'Evidencias Aprobadas', value: 8, color: '#19B5A5' }, // Turquesa
    { name: 'Evidencias Pendientes', value: 2, color: '#E9B949' }, // Ámbar
  ];

  // Streaming Token a Token de EDUNOVA AI
  const streamIntervalRef = useRef(null);

  const handleAiPromptClick = (promptKey) => {
    setActivePrompt(promptKey);
    setIsStreaming(true);
    setAiStreamedText('');

    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);

    let fullText = '';
    if (promptKey === 'analisis') {
      fullText = '⚡ [EDUNOVA AI] Diagnóstico de Rendimiento: Tu promedio ponderado actual es 4.65 / 5.0. Sobresales en estructuración de arquitectura Frontend y buenas prácticas en bases de datos relacionales MySQL. Tu índice de asistencia supera el 92% en el Centro de Formación Industrial.';
    } else if (promptKey === 'pendientes') {
      fullText = '⏳ [EDUNOVA AI] Tareas Prioritarias: Tu próxima entrega es "Consumo REST con Axios & JWT" (10 de Abril). Recuerda verificar los interceptores de tokens y el manejo de variables de entorno.';
    } else if (promptKey === 'ruta') {
      fullText = '🎯 [EDUNOVA AI] Plan Guía Recomendado: Practica el desacoplamiento de Custom Hooks (useDebounce, useAuth) y consultas SQL indexadas en Prisma ORM para tu sustentación técnica de ADSO.';
    }

    let index = 0;
    streamIntervalRef.current = setInterval(() => {
      if (index < fullText.length) {
        setAiStreamedText(prev => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(streamIntervalRef.current);
        setIsStreaming(false);
      }
    }, 18); // Emite token a token cada 18ms
  };

  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, []);

  // Filtrado de cursos con useMemo y búsqueda debounced
  const filteredCursos = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    if (!q) return cursosList;
    return cursosList.filter(c => 
      c.nombre.toLowerCase().includes(q) ||
      c.instructor.toLowerCase().includes(q) ||
      c.codigo.toLowerCase().includes(q)
    );
  }, [cursosList, debouncedSearch]);

  // Paginación de resultados de la tabla
  const totalPages = Math.ceil(filteredCursos.length / pageSize) || 1;
  const paginatedCursos = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCursos.slice(start, start + pageSize);
  }, [filteredCursos, currentPage, pageSize]);

  // Si está en carga inicial, renderizar diseño Skeleton completo
  if (isLoading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        <BannerSkeleton />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7"><ChartSkeleton /></div>
          <div className="lg:col-span-5"><ChartSkeleton /></div>
        </div>
        <TableSkeleton rows={3} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fadeIn pb-12">
      
      {/* ============================================================ */}
      {/* 1. HERO BANNER: OCEAN TECH GRADIENT CON IMAGEN WEBP          */}
      {/* ============================================================ */}
      <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-r from-[#123B50] via-[#17365D] to-[#19B5A5] p-7 sm:p-10 text-white shadow-glass border border-white/30">
        
        {/* Orbes de luz tecnológica */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#48BFE3]/25 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#19B5A5]/25 rounded-full blur-2xl pointer-events-none"></div>

        {/* Ilustración Educativa WebP Lazy-Loaded */}
        <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 items-center gap-4">
          <div className="p-5 rounded-2xl bg-[#102A43]/60 backdrop-blur-xl border border-white/20 shadow-xl text-white max-w-xs">
            <div className="flex items-center gap-2 text-xs font-bold mb-1 text-[#48BFE3]">
              <Zap size={16} className="text-[#E9B949]" />
              <span>Rendimiento Sobresaliente</span>
            </div>
            <p className="text-[11px] text-slate-200 leading-relaxed">
              Has superado el 80% de evidencias formativas con calificación superior a 4.5 en el programa ADSO.
            </p>
          </div>
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles size={14} className="text-[#48BFE3]" />
            <span>Portal del Aprendiz · ADSO 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            ¡Hola, {user?.nombre || 'Anyely Valeria'}! ⚡
          </h1>

          <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
            Bienvenida a tu plataforma de gestión académica tecnológica. Tu avance formativo actual alcanza el <strong className="text-[#E9B949] font-bold">92% de cumplimiento general</strong> en el programa <strong className="text-white font-extrabold">{fichaInfo.programa}</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200 pt-1">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <BookOpen size={14} className="text-[#48BFE3]" />
              <span>Ficha: <strong className="text-white">#{fichaInfo.codigo}</strong></span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <GraduationCap size={14} className="text-[#70D6B3]" />
              <span>Centro de Formación Industrial · Neiva</span>
            </span>
          </div>

          {/* Botones de Acción Rápida */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button 
              onClick={() => onNavigate && onNavigate('calificaciones')}
              className="px-5 py-2.5 rounded-2xl bg-white text-[#123B50] font-extrabold text-xs sm:text-sm shadow-md hover:bg-[#DCEEF5] hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <span>Mis Calificaciones</span>
              <ArrowRight size={15} />
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('reportes')}
              className="px-5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm border border-white/30 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <FileText size={15} />
              <span>Ver Reporte Académico</span>
            </button>
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* 2. TARJETAS ESTADÍSTICAS: CADA UNA CON IDENTIDAD OCEAN TECH  */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Tarjeta 1: Compañeros de Ficha */}
        <div className="glass-card glass-card-hover rounded-[26px] p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-edunova-textSecondary uppercase tracking-wider">
              Compañeros de Ficha
            </span>
            <div className="w-12 h-12 rounded-2xl bg-[#DCEEF5] text-[#17365D] flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
              <Users size={22} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-[#123B50] tracking-tight">
                {fichaInfo.aprendicesCount}
              </h3>
              <span className="text-xs font-semibold text-edunova-textSecondary">aprendices</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-bold text-[#17365D] bg-[#DCEEF5]/60 px-3 py-1.5 rounded-xl border border-blue-100">
              <span>Ficha #{fichaInfo.codigo}</span>
              <span className="w-2 h-2 rounded-full bg-[#17365D] animate-pulse"></span>
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Mis Cursos */}
        <div className="glass-card glass-card-hover rounded-[26px] p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-edunova-textSecondary uppercase tracking-wider">
              Mis Cursos
            </span>
            <div className="w-12 h-12 rounded-2xl bg-[#EBF7FC] text-[#48BFE3] flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
              <BookOpen size={22} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-[#123B50] tracking-tight">
                {cursosList.length}
              </h3>
              <span className="text-xs font-semibold text-edunova-textSecondary">activos</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-bold text-[#123B50] bg-[#EBF7FC]/80 px-3 py-1.5 rounded-xl border border-cyan-100">
              <span>Frontend + Backend</span>
              <span className="text-[#19B5A5]">100% al día</span>
            </div>
          </div>
        </div>

        {/* Tarjeta 3: Evidencias Aprobadas */}
        <div className="glass-card glass-card-hover rounded-[26px] p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-edunova-textSecondary uppercase tracking-wider">
              Evidencias Aprobadas
            </span>
            <div className="w-12 h-12 rounded-2xl bg-[#E8F8F5] text-[#19B5A5] flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
              <CheckCircle2 size={22} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-[#123B50] tracking-tight">
                {fichaInfo.evidenciasAprobadas} <span className="text-lg font-bold text-slate-400">/ {fichaInfo.evidenciasTotales}</span>
              </h3>
              <span className="text-xs font-extrabold text-[#19B5A5]">80%</span>
            </div>
            
            {/* Barra de progreso turquesa */}
            <div className="w-full bg-[#E8F8F5] rounded-full h-2.5 mt-3 overflow-hidden border border-emerald-100">
              <div 
                className="bg-gradient-to-r from-[#70D6B3] to-[#19B5A5] h-full rounded-full transition-all duration-1000"
                style={{ width: '80%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tarjeta 4: Mi Asistencia */}
        <div className="glass-card glass-card-hover rounded-[26px] p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-edunova-textSecondary uppercase tracking-wider">
              Mi Asistencia
            </span>
            <div className="w-12 h-12 rounded-2xl bg-[#FEF8EC] text-[#E9B949] flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
              <CalendarCheck size={22} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-[#123B50] tracking-tight">
                {fichaInfo.asistenciaPorcentaje}%
              </h3>
              <span className="text-xs font-semibold text-edunova-textSecondary">
                ({fichaInfo.asistenciasCount}/{fichaInfo.sesionesTotales} sesiones)
              </span>
            </div>
            
            {/* Barra de progreso ámbar */}
            <div className="w-full bg-[#FEF8EC] rounded-full h-2.5 mt-3 overflow-hidden border border-amber-100">
              <div 
                className="bg-gradient-to-r from-[#F5C94A] to-[#E9B949] h-full rounded-full transition-all duration-1000"
                style={{ width: `${fichaInfo.asistenciaPorcentaje}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 3. SECCIÓN: RENDIMIENTO FORMATIVO + EDUNOVA AI STREAMING     */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Tarjeta de Rendimiento Académico con Recharts Donut (7 Columnas) */}
        <div className="lg:col-span-7 glass-panel rounded-[30px] p-6 sm:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E8F8F5] text-[#19B5A5] flex items-center justify-center font-bold">
                  <Award size={18} />
                </div>
                <h3 className="text-lg font-bold text-[#123B50]">
                  Rendimiento Formativo Integral
                </h3>
              </div>
              <p className="text-xs text-edunova-textSecondary mt-0.5">
                Distribución de evidencias de aprendizaje y promedio por competencias
              </p>
            </div>
            
            <span className="self-start sm:self-auto px-3 py-1 bg-[#E8F8F5] text-[#19B5A5] border border-[#19B5A5]/30 rounded-xl text-xs font-extrabold flex items-center gap-1.5">
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
                      backgroundColor: 'rgba(18, 59, 80, 0.95)', 
                      borderRadius: '16px', 
                      border: 'none', 
                      color: '#FFF', 
                      fontSize: '12px',
                      boxShadow: '0 10px 30px rgba(18, 59, 80, 0.25)' 
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
                <span className="text-2xl font-black text-[#123B50]">80%</span>
                <span className="text-[10px] font-bold text-edunova-textSecondary uppercase tracking-wider">Aprobado</span>
              </div>
            </div>

            {/* Desglose de Evidencias */}
            <div className="sm:col-span-7 space-y-3">
              
              <div className="p-3.5 rounded-2xl bg-[#E8F8F5]/80 border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#19B5A5] text-white flex items-center justify-center font-bold shrink-0">
                    <CheckCircle2 size={17} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#123B50]">8 Evidencias Aprobadas</p>
                    <p className="text-[11px] text-edunova-textSecondary">Promedio actual: 4.65 / 5.0</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#19B5A5] bg-white px-2.5 py-1 rounded-xl shadow-sm border border-emerald-100">
                  80%
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FEF8EC]/80 border border-amber-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#E9B949] text-white flex items-center justify-center font-bold shrink-0">
                    <Clock size={17} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#123B50]">2 Evidencias Pendientes</p>
                    <p className="text-[11px] text-edunova-textSecondary">Entrega programada para Abril 2026</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#E9B949] bg-white px-2.5 py-1 rounded-xl shadow-sm border border-amber-100">
                  20%
                </span>
              </div>

            </div>

          </div>

          {/* Comparativa por Asignatura */}
          <div className="pt-4 border-t border-slate-100 space-y-3.5">
            <p className="text-xs font-extrabold text-[#123B50] uppercase tracking-wider">
              Desempeño por Asignatura Técnica
            </p>

            <div className="space-y-3">
              {cursosList.map((c) => (
                <div key={c.id} className="space-y-1.5 p-3 rounded-2xl bg-[#F4F7FA]/70 border border-slate-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#123B50] truncate">{c.nombre}</span>
                    <span className="font-extrabold text-[#19B5A5]">{c.notaActual} / 5.0 (A)</span>
                  </div>
                  <div className="w-full bg-slate-200/60 rounded-full h-2.5 overflow-hidden">
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

        {/* Módulo EDUNOVA AI: Noche Tecnológica con Streaming Token a Token */}
        <div className="lg:col-span-5 rounded-[30px] p-6 sm:p-8 flex flex-col justify-between border border-[#17365D] relative overflow-hidden bg-gradient-to-br from-[#102A43] via-[#123B50] to-[#17365D] text-white shadow-2xl">
          
          {/* Luz ambiental cian */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#48BFE3]/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="space-y-4 relative z-10">
            
            {/* Header del Tutor IA */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#123B50] via-[#17365D] to-[#19B5A5] flex items-center justify-center p-2.5 shadow-md shadow-[#19B5A5]/30 border border-[#48BFE3]/40">
                  <Sparkles size={22} className="text-[#48BFE3] animate-spin-slow" />
                </div>
                <div>
                  <h4 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                    EDUNOVA AI
                  </h4>
                  <p className="text-[11px] text-[#48BFE3] font-semibold">
                    Tutor Pedagógico Streaming
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#19B5A5]/20 border border-[#19B5A5]/40 text-[#48BFE3] text-[10px] font-mono font-bold uppercase tracking-wider">
                {isStreaming ? 'STREAMING...' : 'IA ACTIVA'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Analizo tus calificaciones, asistencia y evidencias formativas en tiempo real mediante respuestas transmitidas token a token.
            </p>

            {/* Burbuja de Sugerencia del Asistente */}
            <div className="p-4 rounded-2xl bg-[#102A43]/80 border border-[#17365D] space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-[#48BFE3]">
                <Lightbulb size={16} className="text-[#E9B949]" />
                <span>Recomendación del Día</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                "Excelente dominio de componentes y maquetación Tailwind. Te sugerimos repasar la configuración de <strong className="text-white">interceptores en Axios</strong> para la entrega de la próxima semana."
              </p>
            </div>

            {/* Botones de Consulta Rápida */}
            <div className="space-y-2 pt-1">
              <p className="text-[10px] font-extrabold text-[#718096] uppercase tracking-wider">
                Consultas Rápidas de IA (Streaming Token a Token):
              </p>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleAiPromptClick('analisis')}
                  disabled={isStreaming}
                  className="px-2.5 py-2 bg-white/10 hover:bg-[#19B5A5]/25 rounded-xl text-[11px] font-bold text-white transition-all border border-white/10 hover:border-[#19B5A5]/40 text-center truncate shadow-sm disabled:opacity-50"
                >
                  ⚡ Mi Estado
                </button>
                <button
                  onClick={() => handleAiPromptClick('pendientes')}
                  disabled={isStreaming}
                  className="px-2.5 py-2 bg-white/10 hover:bg-[#E9B949]/25 rounded-xl text-[11px] font-bold text-white transition-all border border-white/10 hover:border-[#E9B949]/40 text-center truncate shadow-sm disabled:opacity-50"
                >
                  ⏳ Pendientes
                </button>
                <button
                  onClick={() => handleAiPromptClick('ruta')}
                  disabled={isStreaming}
                  className="px-2.5 py-2 bg-white/10 hover:bg-[#48BFE3]/25 rounded-xl text-[11px] font-bold text-white transition-all border border-white/10 hover:border-[#48BFE3]/40 text-center truncate shadow-sm disabled:opacity-50"
                >
                  🎯 Plan Guía
                </button>
              </div>
            </div>

            {/* Respuesta Streaming Token a Token con cursor parpadeante */}
            {(isStreaming || aiStreamedText) && (
              <div className="p-4 rounded-2xl bg-[#102A43] border border-[#19B5A5]/40 text-xs text-slate-200 animate-slideUp shadow-xl">
                <p className="leading-relaxed font-mono">
                  {aiStreamedText}
                  {isStreaming && <span className="inline-block w-2 h-4 bg-[#19B5A5] animate-pulse ml-1">▍</span>}
                </p>
              </div>
            )}

          </div>

          {/* Botón Principal del Módulo IA */}
          <div className="pt-5 mt-4 border-t border-[#17365D]/80 relative z-10">
            <button 
              onClick={() => handleAiPromptClick('analisis')}
              disabled={isStreaming}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#17365D] via-[#19B5A5] to-[#48BFE3] hover:opacity-95 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-ocean-glow transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Brain size={16} />
              <span>{isStreaming ? 'Transmitiendo respuesta...' : 'Generar Informe de Aprendizaje con IA'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* 4. TABLA GLASSMORPHISM PAGINADA CON BÚSQUEDA DEBOUNCED       */}
      {/* ============================================================ */}
      <div className="glass-panel rounded-[30px] border border-white/90 overflow-hidden shadow-glass">
        
        {/* Cabecera con Buscador Dinámico con Debounce */}
        <div className="p-6 sm:p-7 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-white/95 to-[#DCEEF5]/30">
          <div>
            <h3 className="text-lg font-bold text-[#123B50] flex items-center gap-2">
              <FolderOpen size={20} className="text-[#19B5A5]" />
              <span>Mis Cursos Matriculados</span>
            </h3>
            <p className="text-xs text-edunova-textSecondary mt-0.5">
              Cursos técnicos · ADSO Ficha #{fichaInfo.codigo} · Búsqueda con Debounce (300ms)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-edunova-textSecondary" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Regresa a la primera página al buscar
                }}
                placeholder="Buscar (Debounce 300ms)..."
                className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-full text-xs text-edunova-textPrimary focus:bg-white focus:border-[#19B5A5] focus:outline-none transition-all"
              />
            </div>
            
            <span className="hidden sm:inline-flex px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-[#17365D]">
              {filteredCursos.length} Cursos
            </span>
          </div>
        </div>

        {/* Tabla Glassmorphism Paginada */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-edunova-textSecondary">
            <thead className="bg-[#F4F7FA] text-[11px] font-extrabold text-[#718096] uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Curso / Ficha</th>
                <th className="px-6 py-4">Instructor Titular</th>
                <th className="px-6 py-4">Finalización</th>
                <th className="px-6 py-4">Avance</th>
                <th className="px-6 py-4">Calificación</th>
                <th className="px-6 py-4 text-right">Actualización Optimista</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {paginatedCursos.length > 0 ? (
                paginatedCursos.map((c) => (
                  <tr key={c.id} className="hover:bg-white/80 transition-colors">
                    
                    {/* Curso */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#123B50] text-xs sm:text-sm">
                        {c.nombre}
                      </div>
                      <div className="text-[11px] text-[#718096] font-mono mt-0.5">
                        {c.codigo} · Programa ADSO
                      </div>
                    </td>

                    {/* Instructor */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#DCEEF5] to-[#EBF7FC] text-[#17365D] font-extrabold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                          {c.instructor.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#123B50]">{c.instructor}</p>
                          <p className="text-[11px] text-[#718096]">{c.especialidad}</p>
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
                        <div className="flex justify-between text-[11px] font-bold text-[#123B50]">
                          <span>{c.progreso}%</span>
                        </div>
                        <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`bg-gradient-to-r ${c.progressBar} h-full rounded-full transition-all duration-700`}
                            style={{ width: `${c.progreso}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Calificación */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-extrabold bg-[#E8F8F5] text-[#19B5A5] border border-[#19B5A5]/20 shadow-sm">
                        {c.notaActual} / 5.0 (A)
                      </span>
                    </td>

                    {/* Acción Optimista (Actualiza UI de inmediato) */}
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleOptimisticSubmit(c.id)}
                        title="Simulación de Actualización Optimista sin esperar al servidor"
                        className="text-xs font-extrabold text-[#19B5A5] hover:text-[#123B50] inline-flex items-center gap-1.5 bg-[#E8F8F5] hover:bg-[#DCEEF5] px-3 py-1.5 rounded-xl border border-[#19B5A5]/30 transition-all shadow-sm"
                      >
                        <RefreshCw size={13} className="animate-spin-slow" />
                        <span>Entrega Rápida</span>
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-edunova-textSecondary text-xs">
                    No se encontraron cursos coincidentes con "{debouncedSearch}".
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* Barra de Paginación */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-[#F4F7FA]/50 text-xs">
          <span className="text-slate-500">
            Mostrando página <strong className="text-[#123B50]">{currentPage}</strong> de <strong className="text-[#123B50]">{totalPages}</strong> ({filteredCursos.length} resultados)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-[#123B50] disabled:opacity-40 hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              <ChevronLeft size={14} />
              <span>Anterior</span>
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-[#123B50] disabled:opacity-40 hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              <span>Siguiente</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
