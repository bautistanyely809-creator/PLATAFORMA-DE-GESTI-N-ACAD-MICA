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
  FolderOpen,
  Zap,
  ChevronLeft,
  RefreshCw,
  Terminal,
  Activity
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
import Hero3DCanvas from './Hero3DCanvas';

export default function ApprenticeDashboard({ user, onNavigate }) {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePrompt, setActivePrompt] = useState(null);
  const [aiStreamedText, setAiStreamedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const fichaInfo = {
    codigo: '2874102',
    programa: 'Technologist in Software Analysis & Development (ADSO)',
    centro: 'Center for Industrial Training – SENA Huila',
    aprendicesCount: 32,
    asistenciaPorcentaje: 92,
    asistenciasCount: 23,
    sesionesTotales: 25,
    evidenciasAprobadas: 8,
    evidenciasTotales: 10
  };

  const [cursosList, setCursosList] = useState([
    {
      id: 1,
      nombre: 'Modern Frontend Engineering (React & Tailwind)',
      codigo: 'ADSO-2026-A',
      instructor: 'Carlos Mendoza',
      especialidad: 'Frontend & UI Architecture',
      fechaFin: '15 APR 2026',
      progreso: 85,
      notaActual: 4.8,
      status: 'VERIFIED',
      evidencias: [
        { nombre: 'Figma UI Prototype Dispatch', nota: 4.8, estado: 'PASSED', fecha: '10 MAR 2026' },
        { nombre: 'React Scaffold & Tailwind Layout', nota: 4.6, estado: 'PASSED', fecha: '25 MAR 2026' },
        { nombre: 'REST Consumer with Axios & JWT', nota: null, estado: 'PENDING', fecha: '10 APR 2026' }
      ]
    },
    {
      id: 2,
      nombre: 'Backend Systems & RESTful APIs (Node & Express)',
      codigo: 'ADSO-2026-B',
      instructor: 'Laura Gómez',
      especialidad: 'Backend & Relational DBs',
      fechaFin: '30 APR 2026',
      progreso: 70,
      notaActual: 4.5,
      status: 'VERIFIED',
      evidencias: [
        { nombre: 'MySQL 8 Relational Schema Script', nota: 4.7, estado: 'PASSED', fecha: '18 MAR 2026' },
        { nombre: 'Express Server Routes & JWT Middleware', nota: 4.4, estado: 'PASSED', fecha: '02 APR 2026' },
        { nombre: 'Integration Test Suite with Postman', nota: null, estado: 'PENDING', fecha: '20 APR 2026' }
      ]
    },
    {
      id: 3,
      nombre: 'Agile Methodologies & Scrum Architecture',
      codigo: 'ADSO-2026-C',
      instructor: 'Andrés Morales',
      especialidad: 'Agile Delivery Systems',
      fechaFin: '20 MAY 2026',
      progreso: 90,
      notaActual: 4.9,
      status: 'VERIFIED',
      evidencias: [
        { nombre: 'Product Backlog & Sprint Planning', nota: 4.9, estado: 'PASSED', fecha: '15 MAR 2026' },
        { nombre: 'Requirements Traceability Matrix', nota: 5.0, estado: 'PASSED', fecha: '28 MAR 2026' }
      ]
    }
  ]);

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

  // Factory Chart Colors: Metric Green #a0ca92 & Ash Stroke #4d4947
  const pieData = [
    { name: 'Completed & Passed', value: 8, color: '#a0ca92' },
    { name: 'Pending Deliverables', value: 2, color: '#4d4947' },
  ];

  const streamIntervalRef = useRef(null);

  const handleAiPromptClick = (promptKey) => {
    setActivePrompt(promptKey);
    setIsStreaming(true);
    setAiStreamedText('');

    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);

    let fullText = '';
    if (promptKey === 'analisis') {
      fullText = 'FACTORY // DISPATCH: Operator Anyely Valeria reports 4.65 / 5.0 weighted GPA. Competency telemetry shows superior proficiency in UI engineering and relational MySQL models. Attendance stands verified at 92% with 0 unauthorized absences.';
    } else if (promptKey === 'pendientes') {
      fullText = 'FACTORY // CRITICAL PATH: Next priority target is "REST Consumer with Axios & JWT" due 10 APR 2026. Verify token interceptor error handling and environment variable decoupling before PR submission.';
    } else if (promptKey === 'ruta') {
      fullText = 'FACTORY // DIRECTIVE: Allocate sprint capacity to custom React hooks (useDebounce, useAuth) and indexed Prisma queries to guarantee sub-50ms latency for the upcoming SENA panel review.';
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
    }, 15);
  };

  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, []);

  const filteredCursos = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    if (!q) return cursosList;
    return cursosList.filter(c => 
      c.nombre.toLowerCase().includes(q) ||
      c.instructor.toLowerCase().includes(q) ||
      c.codigo.toLowerCase().includes(q)
    );
  }, [cursosList, debouncedSearch]);

  const totalPages = Math.ceil(filteredCursos.length / pageSize) || 1;
  const paginatedCursos = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCursos.slice(start, start + pageSize);
  }, [filteredCursos, currentPage, pageSize]);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        <BannerSkeleton />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7"><ChartSkeleton /></div>
          <div className="lg:col-span-5"><ChartSkeleton /></div>
        </div>
        <TableSkeleton rows={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-sans">
      
      {/* ============================================================ */}
      {/* 1. FACTORY SIGNATURE MOVE: BONE CARD HERO CON NÚCLEO 3D THREE.JS */}
      {/* ============================================================ */}
      <div className="bone-card p-6 sm:p-7 relative overflow-hidden">
        
        {/* Eyebrow in Factory Mono */}
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#101010] mb-3">
          <span className="status-pulse-orange"></span>
          <span>OPERATOR TERMINAL // COHORT 2874102</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-7 space-y-3.5">
            <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#101010] leading-none">
              Control Surface // Anyely Valeria
            </h1>
            <p className="text-sm text-[#4d4947] leading-relaxed max-w-xl font-sans">
              Software engineering training telemetry in real time. Cumulative curriculum completion stands at <strong className="text-[#101010] font-medium">92% verified</strong> across the <strong className="text-[#101010] font-medium">{fichaInfo.programa}</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#101010]">
              <span className="px-2.5 py-1 rounded-[3px] bg-[#101010]/5 border border-[#101010]/15">
                COHORT #{fichaInfo.codigo}
              </span>
              <span className="px-2.5 py-1 rounded-[3px] bg-[#101010]/5 border border-[#101010]/15">
                CENTER FOR INDUSTRIAL TRAINING · NEIVA
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={() => onNavigate && onNavigate('calificaciones')}
                className="px-4 h-9 bg-[#101010] hover:bg-[#1d1a18] text-[#eeeeee] font-normal text-xs rounded-[3px] flex items-center justify-center gap-2 transition-colors border border-[#3d3a39]"
              >
                <span>View Gradebook</span>
                <ArrowRight size={13} />
              </button>
              <button
                onClick={() => onNavigate && onNavigate('reportes')}
                className="px-4 h-9 bg-transparent hover:bg-[#101010]/10 text-[#101010] border border-[#101010]/20 font-normal text-xs rounded-[3px] flex items-center justify-center gap-2 transition-colors"
              >
                <FileText size={13} />
                <span>Telemetry Dossier</span>
              </button>
            </div>
          </div>

          {/* Módulo 3D Animable Three.js integrado en el HERO */}
          <div className="lg:col-span-5 bg-[#ffffff]/60 border border-[#3d3a39]/20 rounded-[8px] p-2.5 shadow-sm">
            <Hero3DCanvas variant="bone" />
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* 2. FACTORY METRIC TILES: 1PX HAIRLINE DIVIDERS & SPARKLINES   */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Peers */}
        <div className="metric-tile">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#b8b3b0]">
              PEER OPERATORS
            </span>
            <Users size={15} className="text-[#8a8380]" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-normal text-[#eeeeee] tracking-tight">
                {fichaInfo.aprendicesCount}
              </span>
              <span className="font-mono text-xs text-[#8a8380]">ACTIVE</span>
            </div>
            {/* Flat Sparkline Trace */}
            <div className="mt-3 h-1 w-full bg-[#1d1a18] rounded-[2px] overflow-hidden">
              <div className="h-full bg-[#eeeeee] w-full"></div>
            </div>
          </div>
        </div>

        {/* Metric 2: Active Modules */}
        <div className="metric-tile">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#b8b3b0]">
              ACTIVE MODULES
            </span>
            <BookOpen size={15} className="text-[#8a8380]" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-normal text-[#eeeeee] tracking-tight">
                {cursosList.length}
              </span>
              <span className="font-mono text-xs text-[#a0ca92]">ALL CURRENT</span>
            </div>
            <div className="mt-3 h-1 w-full bg-[#1d1a18] rounded-[2px] overflow-hidden">
              <div className="h-full bg-[#a0ca92] w-full"></div>
            </div>
          </div>
        </div>

        {/* Metric 3: Verified Deliverables */}
        <div className="metric-tile">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#b8b3b0]">
              VERIFIED WORK
            </span>
            <CheckCircle2 size={15} className="text-[#a0ca92]" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-normal text-[#eeeeee] tracking-tight">
                {fichaInfo.evidenciasAprobadas}
              </span>
              <span className="font-mono text-xs text-[#8a8380]">/ {fichaInfo.evidenciasTotales} (80%)</span>
            </div>
            <div className="mt-3 h-1 w-full bg-[#1d1a18] rounded-[2px] overflow-hidden">
              <div className="h-full bg-[#a0ca92]" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>

        {/* Metric 4: Attendance Log */}
        <div className="metric-tile">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#b8b3b0]">
              SESSION ATTENDANCE
            </span>
            <CalendarCheck size={15} className="text-[#ee6018]" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-normal text-[#eeeeee] tracking-tight">
                {fichaInfo.asistenciaPorcentaje}%
              </span>
              <span className="font-mono text-xs text-[#8a8380]">({fichaInfo.asistenciasCount}/{fichaInfo.sesionesTotales})</span>
            </div>
            <div className="mt-3 h-1 w-full bg-[#1d1a18] rounded-[2px] overflow-hidden">
              <div className="h-full bg-[#ee6018]" style={{ width: `${fichaInfo.asistenciaPorcentaje}%` }}></div>
            </div>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 3. PERFORMANCE FRAME + MACHINE DISPATCH TERMINAL              */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Performance Chart Frame */}
        <div className="lg:col-span-7 carbon-panel p-6 space-y-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-[#3d3a39]">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-wider text-[#eeeeee]">
                  Curricular Performance Spectrum
                </span>
              </div>
              <p className="font-mono text-[11px] text-[#8a8380] mt-0.5">
                Evaluation distribution and competency index
              </p>
            </div>
            
            <span className="px-2 py-0.5 rounded-[3px] bg-[#a0ca92]/10 border border-[#a0ca92]/30 font-mono text-[10px] text-[#a0ca92] uppercase">
              STATE // SUPERIOR (A)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            
            {/* Recharts Donut in Factory monochrome + metric green */}
            <div className="sm:col-span-5 h-48 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#1d1a18', 
                      borderRadius: '3px', 
                      border: '1px solid #3d3a39', 
                      color: '#eeeeee', 
                      fontSize: '11px',
                      fontFamily: 'Geist Mono',
                      boxShadow: 'none' 
                    }}
                  />
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="#101010"
                    strokeWidth={2}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-normal text-[#eeeeee] tracking-tight">80%</span>
                <span className="font-mono text-[9px] text-[#8a8380] uppercase">VERIFIED</span>
              </div>
            </div>

            {/* Split breakdown tiles */}
            <div className="sm:col-span-7 space-y-2">
              <div className="p-3 bg-[#101010] border border-[#3d3a39] rounded-[3px] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="status-pulse-green"></span>
                  <div>
                    <p className="text-xs text-[#eeeeee]">8 Work Deliverables Passed</p>
                    <p className="font-mono text-[10px] text-[#8a8380]">Average: 4.65 / 5.0</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-[#a0ca92]">80%</span>
              </div>

              <div className="p-3 bg-[#101010] border border-[#3d3a39] rounded-[3px] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4d4947]"></span>
                  <div>
                    <p className="text-xs text-[#eeeeee]">2 Deliverables Pending</p>
                    <p className="font-mono text-[10px] text-[#8a8380]">Target completion April 2026</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-[#8a8380]">20%</span>
              </div>
            </div>

          </div>

          {/* Module Bars */}
          <div className="pt-4 border-t border-[#3d3a39] space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#8a8380]">
              Performance by Technical Track
            </p>

            <div className="space-y-2">
              {cursosList.map((c) => (
                <div key={c.id} className="p-2.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#eeeeee] font-normal truncate">{c.nombre}</span>
                    <span className="font-mono text-[#a0ca92] text-[11px]">{c.notaActual} / 5.0 (A)</span>
                  </div>
                  <div className="w-full bg-[#1d1a18] h-1 rounded-[1px] overflow-hidden">
                    <div 
                      className="bg-[#eeeeee] h-full transition-all duration-500"
                      style={{ width: `${(c.notaActual / 5.0) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Machine Dispatch Terminal (EDUNOVA AI) */}
        <div className="lg:col-span-5 carbon-panel p-6 flex flex-col justify-between space-y-4">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#3d3a39]">
              <div className="flex items-center gap-2">
                <Terminal size={15} className="text-[#ee6018]" />
                <span className="font-mono text-xs uppercase tracking-wider text-[#eeeeee]">
                  EDUNOVA AI // ADVISORY DISPATCH
                </span>
              </div>
              <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-[3px] bg-[#ee6018]/10 text-[#ee6018] border border-[#ee6018]/30">
                {isStreaming ? 'STREAMING' : 'ONLINE'}
              </span>
            </div>

            <p className="text-xs text-[#8a8380] leading-relaxed">
              Real-time heuristic evaluation of curriculum progression, code scaffolds, and attendance telemetry.
            </p>

            {/* Daily Memo Tile */}
            <div className="p-3 bg-[#101010] border border-[#3d3a39] rounded-[3px] space-y-1.5">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#eeeeee] uppercase">
                <Lightbulb size={12} className="text-[#a0ca92]" />
                <span>Heuristic Recommendation</span>
              </div>
              <p className="text-xs text-[#8a8380] leading-relaxed">
                "Robust understanding of component isolation. Recommend testing <strong className="text-[#eeeeee]">Axios error interceptors</strong> prior to end-of-week sprint review."
              </p>
            </div>

            {/* Quick Dispatch Triggers */}
            <div className="space-y-2">
              <p className="font-mono text-[10px] text-[#8a8380] uppercase tracking-wider">
                Run Diagnostics:
              </p>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleAiPromptClick('analisis')}
                  disabled={isStreaming}
                  className="px-2 py-2 bg-[#101010] hover:bg-[#151515] border border-[#3d3a39] hover:border-[#8a8380] rounded-[3px] font-mono text-[10px] text-[#eeeeee] uppercase text-center transition-colors disabled:opacity-40"
                >
                  Status
                </button>
                <button
                  onClick={() => handleAiPromptClick('pendientes')}
                  disabled={isStreaming}
                  className="px-2 py-2 bg-[#101010] hover:bg-[#151515] border border-[#3d3a39] hover:border-[#8a8380] rounded-[3px] font-mono text-[10px] text-[#eeeeee] uppercase text-center transition-colors disabled:opacity-40"
                >
                  Critical Path
                </button>
                <button
                  onClick={() => handleAiPromptClick('ruta')}
                  disabled={isStreaming}
                  className="px-2 py-2 bg-[#101010] hover:bg-[#151515] border border-[#3d3a39] hover:border-[#8a8380] rounded-[3px] font-mono text-[10px] text-[#eeeeee] uppercase text-center transition-colors disabled:opacity-40"
                >
                  Directive
                </button>
              </div>
            </div>

            {/* Streaming Output Box */}
            {(isStreaming || aiStreamedText) && (
              <div className="p-3 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs font-mono text-[#eeeeee] leading-relaxed">
                <span>{aiStreamedText}</span>
                {isStreaming && <span className="inline-block w-2 h-3.5 bg-[#ee6018] animate-pulse ml-1">▍</span>}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#3d3a39]">
            <button
              onClick={() => handleAiPromptClick('analisis')}
              disabled={isStreaming}
              className="w-full h-9 bg-[#1d1a18] hover:bg-[#252220] border border-[#3d3a39] text-[#eeeeee] font-mono text-xs uppercase rounded-[3px] flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Brain size={13} className="text-[#ee6018]" />
              <span>{isStreaming ? 'Receiving Stream...' : 'Trigger Advisory Telemetry'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* 4. WORK DELIVERABLES TABLE (HAIRLINE DIVIDERS, DEBOUNCE)       */}
      {/* ============================================================ */}
      <div className="carbon-panel overflow-hidden">
        
        {/* Table Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-[#3d3a39] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#101010]">
          <div>
            <div className="flex items-center gap-2">
              <FolderOpen size={16} className="text-[#a0ca92]" />
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#eeeeee]">
                Enrolled Curricular Units
              </h3>
            </div>
            <p className="font-mono text-[10px] text-[#8a8380] mt-0.5">
              ADSO Cohort #{fichaInfo.codigo} · Filtered with 300ms Debounce
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-60">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8a8380]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Filter track..."
                className="w-full pl-8 pr-3 py-1 bg-[#1d1a18] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] font-sans placeholder:text-[#8a8380] focus:outline-none focus:border-[#eeeeee]"
              />
            </div>

            <span className="font-mono text-[10px] text-[#8a8380] bg-[#1d1a18] border border-[#3d3a39] px-2 py-1 rounded-[3px]">
              {filteredCursos.length} TRACKS
            </span>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101010] font-mono text-[10px] uppercase text-[#8a8380] border-b border-[#3d3a39]">
              <tr>
                <th className="px-4 py-3">Module / Identifier</th>
                <th className="px-4 py-3">Lead Instructor</th>
                <th className="px-4 py-3">Target Completion</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Verified GPA</th>
                <th className="px-4 py-3 text-right">Dispatch Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3d3a39]">
              {paginatedCursos.length > 0 ? (
                paginatedCursos.map((c) => (
                  <tr key={c.id} className="hover:bg-[#101010]/50 transition-colors">
                    
                    <td className="px-4 py-3.5">
                      <p className="text-xs text-[#eeeeee] font-normal">{c.nombre}</p>
                      <p className="font-mono text-[10px] text-[#8a8380] mt-0.5">{c.codigo}</p>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="text-xs text-[#eeeeee]">{c.instructor}</p>
                      <p className="font-mono text-[10px] text-[#8a8380]">{c.especialidad}</p>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-[11px] text-[#8a8380]">
                      {c.fechaFin}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="w-28 space-y-1">
                        <span className="font-mono text-[10px] text-[#eeeeee]">{c.progreso}%</span>
                        <div className="w-full bg-[#101010] h-1 rounded-[1px] overflow-hidden">
                          <div className="bg-[#a0ca92] h-full" style={{ width: `${c.progreso}%` }}></div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-mono text-[11px] text-[#a0ca92] bg-[#a0ca92]/10 border border-[#a0ca92]/30 px-2 py-0.5 rounded-[3px]">
                        {c.notaActual} / 5.0
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleOptimisticSubmit(c.id)}
                        className="px-2.5 py-1 bg-[#101010] hover:bg-[#201d1b] border border-[#3d3a39] hover:border-[#8a8380] rounded-[3px] font-mono text-[10px] uppercase text-[#eeeeee] inline-flex items-center gap-1.5 transition-colors"
                      >
                        <RefreshCw size={11} className="text-[#a0ca92]" />
                        <span>Fast Commit</span>
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center font-mono text-xs text-[#8a8380]">
                    NO RECORDS MATCHING QUERY "{debouncedSearch}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="p-3 border-t border-[#3d3a39] flex items-center justify-between font-mono text-[11px] text-[#8a8380] bg-[#101010]">
          <span>
            PAGE <strong className="text-[#eeeeee]">{currentPage}</strong> OF <strong className="text-[#eeeeee]">{totalPages}</strong> ({filteredCursos.length} TOTAL)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 bg-[#1d1a18] hover:bg-[#252220] border border-[#3d3a39] rounded-[3px] text-[#eeeeee] disabled:opacity-30 transition-colors"
            >
              PREVIOUS
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 bg-[#1d1a18] hover:bg-[#252220] border border-[#3d3a39] rounded-[3px] text-[#eeeeee] disabled:opacity-30 transition-colors"
            >
              NEXT
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
