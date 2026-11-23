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
import { api } from '../services/api';

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
    codigo: '3413988',
    programa: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    centro: 'Centro de Formación Industrial – SENA Huila (Neiva)',
    aprendicesCount: 32,
    asistenciaPorcentaje: 94.2,
    asistenciasCount: 24,
    sesionesTotales: 25,
    evidenciasAprobadas: 8,
    evidenciasTotales: 10
  };

  const [cursosList, setCursosList] = useState([
    {
      id: 1,
      nombre: 'Ingeniería Frontend Moderna (React y Tailwind)',
      codigo: 'ADSO-2026-A',
      instructor: 'Carlos Mendoza',
      especialidad: 'Arquitectura Frontend & UI',
      fechaFin: '15 ABR 2026',
      progreso: 85,
      notaActual: 4.8,
      status: 'VERIFICADO',
      evidencias: [
        { nombre: 'Despacho de Prototipo UI en Figma', nota: 4.8, estado: 'APROBADO', fecha: '10 MAR 2026' },
        { nombre: 'Estructura React y Tailwind CSS', nota: 4.6, estado: 'APROBADO', fecha: '25 MAR 2026' },
        { nombre: 'Consumidor REST con Axios y JWT', nota: null, estado: 'PENDIENTE', fecha: '10 ABR 2026' }
      ]
    },
    {
      id: 2,
      nombre: 'Sistemas Backend y APIs RESTful (Node y Express)',
      codigo: 'ADSO-2026-B',
      instructor: 'Laura Gómez',
      especialidad: 'Backend & Bases de Datos Relacionales',
      fechaFin: '30 ABR 2026',
      progreso: 70,
      notaActual: 4.5,
      status: 'VERIFICADO',
      evidencias: [
        { nombre: 'Esquema Relacional en MySQL 8', nota: 4.7, estado: 'APROBADO', fecha: '18 MAR 2026' },
        { nombre: 'Rutas Express y Middleware JWT', nota: 4.4, estado: 'APROBADO', fecha: '02 ABR 2026' },
        { nombre: 'Suite de Pruebas con Postman', nota: null, estado: 'PENDIENTE', fecha: '20 ABR 2026' }
      ]
    },
    {
      id: 3,
      nombre: 'Metodologías Ágiles y Arquitectura Scrum',
      codigo: 'ADSO-2026-C',
      instructor: 'Andrés Morales',
      especialidad: 'Sistemas de Entrega Continua',
      fechaFin: '20 MAY 2026',
      progreso: 90,
      notaActual: 4.9,
      status: 'VERIFICADO',
      evidencias: [
        { nombre: 'Product Backlog y Planificación de Sprint', nota: 4.9, estado: 'APROBADO', fecha: '15 MAR 2026' },
        { nombre: 'Matriz de Trazabilidad de Requisitos', nota: 5.0, estado: 'APROBADO', fecha: '28 MAR 2026' }
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

  const pieData = [
    { name: 'Completadas y Aprobadas', value: 8, color: '#a0ca92' },
    { name: 'Evidencias Pendientes', value: 2, color: '#4d4947' },
  ];

  const streamIntervalRef = useRef(null);

  // HU-26: Consulta inteligente con datos reales y fallback
  const handleAiPromptClick = async (promptKey) => {
    setActivePrompt(promptKey);
    setIsStreaming(true);
    setAiStreamedText('');

    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);

    const promptsMap = {
      analisis: '¿Cuál es mi rendimiento general y diagnóstico de competencias?',
      pendientes: '¿Cuáles son mis evidencias y actividades pendientes más urgentes?',
      ruta: '¿Cuál es la recomendación formativa para el próximo sprint del SENA?'
    };

    const pregunta = promptsMap[promptKey] || '¿Cuál es mi estado académico?';

    try {
      const res = await api.ai.consultar({
        pregunta,
        id_usuario: user?.id_usuario || user?.id,
        rol: 'APRENDIZ',
        nombre: user?.nombre
      });

      const fullText = res.respuesta || 'Diagnóstico completado con éxito.';
      let index = 0;
      streamIntervalRef.current = setInterval(() => {
        if (index < fullText.length) {
          setAiStreamedText(prev => prev + fullText.charAt(index));
          index++;
        } else {
          clearInterval(streamIntervalRef.current);
          setIsStreaming(false);
        }
      }, 12);
    } catch (err) {
      // Fallback heurístico en español oficial si el endpoint no responde
      let fullText = '';
      if (promptKey === 'analisis') {
        fullText = `DIAGNÓSTICO // EDUNOVA AI: Aprendiz ${user?.nombre || 'Anyely Valeria'} presenta promedio ponderado de 4.73 / 5.0. La telemetría de competencias certifica desempeño sobresaliente en arquitectura React y modelo relacional MySQL 8. Asistencia verificada en 94.2% sin novedades disciplinarias.`;
      } else if (promptKey === 'pendientes') {
        fullText = 'RUTA CRÍTICA // PRIORIDAD: La próxima entrega prioritaria es "Consumidor REST con Axios y JWT" para el 10 de abril. Verifique el manejo de interceptores de token y el desacople de variables de entorno antes de la radicación.';
      } else if (promptKey === 'ruta') {
        fullText = 'DIRECTIVA PEDAGÓGICA: Dedique capacidad del sprint a los hooks personalizados (useDebounce, useAuth) y consultas indexadas en Prisma para asegurar latencia inferior a 50ms en la sustentación del panel SENA.';
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
      }, 12);
    }
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
      
      {/* 1. FACTORY BONE CARD HERO CON NÚCLEO 3D */}
      <div className="bg-[#eeeeee] text-[#101010] p-6 sm:p-7 rounded-[10px] border border-[#3d3a39] relative overflow-hidden">
        
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#101010] mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ee6018] animate-pulse"></span>
          <span>TERMINAL DEL APRENDIZ // FICHA 3413988</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-7 space-y-3.5">
            <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#101010] leading-none">
              Consola de Seguimiento // {user?.nombre || 'Anyely Valeria'}
            </h1>
            <p className="text-sm text-[#4d4947] leading-relaxed max-w-xl font-sans">
              Telemetría formativa en tiempo real. El avance curricular acumulado se sitúa en un <strong className="text-[#101010] font-medium">92% verificado</strong> en el programa de <strong className="text-[#101010] font-medium">{fichaInfo.programa}</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#101010]">
              <span className="px-2.5 py-1 rounded-[3px] bg-[#101010]/5 border border-[#101010]/15">
                FICHA #{fichaInfo.codigo}
              </span>
              <span className="px-2.5 py-1 rounded-[3px] bg-[#101010]/5 border border-[#101010]/15">
                CENTRO DE FORMACIÓN INDUSTRIAL · NEIVA
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={() => onNavigate && onNavigate('competencias')}
                className="px-4 h-9 bg-[#101010] hover:bg-[#1d1a18] text-[#eeeeee] font-normal text-xs rounded-[3px] flex items-center justify-center gap-2 transition-colors border border-[#3d3a39]"
              >
                <span>Ver Calificaciones</span>
                <ArrowRight size={13} />
              </button>
              <button
                onClick={() => onNavigate && onNavigate('perfil360')}
                className="px-4 h-9 bg-transparent hover:bg-[#101010]/10 text-[#101010] border border-[#101010]/20 font-normal text-xs rounded-[3px] flex items-center justify-center gap-2 transition-colors"
              >
                <Award size={13} />
                <span>Perfil 360°</span>
              </button>
              <button
                onClick={() => onNavigate && onNavigate('calendario')}
                className="px-4 h-9 bg-transparent hover:bg-[#101010]/10 text-[#101010] border border-[#101010]/20 font-normal text-xs rounded-[3px] flex items-center justify-center gap-2 transition-colors"
              >
                <CalendarCheck size={13} />
                <span>Calendario</span>
              </button>
              <button
                onClick={() => onNavigate && onNavigate('reportes')}
                className="px-4 h-9 bg-transparent hover:bg-[#101010]/10 text-[#101010] border border-[#101010]/20 font-normal text-xs rounded-[3px] flex items-center justify-center gap-2 transition-colors"
              >
                <FileText size={13} />
                <span>Expediente Formativo</span>
              </button>
            </div>
          </div>

          {/* Módulo 3D Three.js con Avatar Interactivo */}
          <div className="lg:col-span-5 bg-[#ffffff]/60 border border-[#3d3a39]/20 rounded-[8px] p-2.5 shadow-sm">
            <Hero3DCanvas variant="bone" user={user} />
          </div>

        </div>

      </div>

      {/* 2. TARJETAS DE MÉTRICAS FACTORY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Métrica 1: Compañeros */}
        <div className="bg-[#1d1a18] rounded-[10px] p-5 border border-[#3d3a39]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#b8b3b0]">
              COMPAÑEROS DE FICHA
            </span>
            <Users size={15} className="text-[#8a8380]" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-normal text-[#eeeeee] tracking-tight">
                {fichaInfo.aprendicesCount}
              </span>
              <span className="font-mono text-xs text-[#8a8380]">ACTIVOS</span>
            </div>
            <div className="mt-3 h-1 w-full bg-[#101010] rounded-[2px] overflow-hidden">
              <div className="h-full bg-[#eeeeee] w-full"></div>
            </div>
          </div>
        </div>

        {/* Métrica 2: Cursos Activos */}
        <div className="bg-[#1d1a18] rounded-[10px] p-5 border border-[#3d3a39]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#b8b3b0]">
              CURSOS ACTIVOS
            </span>
            <BookOpen size={15} className="text-[#8a8380]" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-normal text-[#eeeeee] tracking-tight">
                {cursosList.length}
              </span>
              <span className="font-mono text-xs text-[#a0ca92]">AL DÍA</span>
            </div>
            <div className="mt-3 h-1 w-full bg-[#101010] rounded-[2px] overflow-hidden">
              <div className="h-full bg-[#a0ca92] w-full"></div>
            </div>
          </div>
        </div>

        {/* Métrica 3: Evidencias Aprobadas */}
        <div className="bg-[#1d1a18] rounded-[10px] p-5 border border-[#3d3a39]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#b8b3b0]">
              EVIDENCIAS APROBADAS
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
            <div className="mt-3 h-1 w-full bg-[#101010] rounded-[2px] overflow-hidden">
              <div className="h-full bg-[#a0ca92]" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>

        {/* Métrica 4: Asistencia a Sesiones */}
        <div className="bg-[#1d1a18] rounded-[10px] p-5 border border-[#3d3a39]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#b8b3b0]">
              ASISTENCIA A SESIONES
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
            <div className="mt-3 h-1 w-full bg-[#101010] rounded-[2px] overflow-hidden">
              <div className="h-full bg-[#ee6018]" style={{ width: `${fichaInfo.asistenciaPorcentaje}%` }}></div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. GRÁFICA DE DESEMPEÑO + TERMINAL EDUNOVA AI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gráfica Circular de Rendimiento */}
        <div className="lg:col-span-7 bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#3d3a39]">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-wider text-[#eeeeee]">
                  Desempeño Curricular General
                </span>
              </div>
              <p className="font-mono text-[11px] text-[#8a8380] mt-0.5">
                Distribución evaluativa e índice de competencias
              </p>
            </div>
            
            <span className="px-2 py-0.5 rounded-[3px] bg-[#a0ca92]/10 border border-[#a0ca92]/30 font-mono text-[10px] text-[#a0ca92] uppercase">
              NIVEL // SUPERIOR (A)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
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
                      fontFamily: 'monospace',
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
                <span className="font-mono text-[9px] text-[#8a8380] uppercase">APROBADO</span>
              </div>
            </div>

            <div className="sm:col-span-7 space-y-2">
              <div className="p-3 bg-[#101010] border border-[#3d3a39] rounded-[3px] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a0ca92]"></span>
                  <div>
                    <p className="text-xs text-[#eeeeee]">8 Evidencias Aprobadas</p>
                    <p className="font-mono text-[10px] text-[#8a8380]">Promedio: 4.65 / 5.0</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-[#a0ca92]">80%</span>
              </div>

              <div className="p-3 bg-[#101010] border border-[#3d3a39] rounded-[3px] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4d4947]"></span>
                  <div>
                    <p className="text-xs text-[#eeeeee]">2 Evidencias Pendientes</p>
                    <p className="font-mono text-[10px] text-[#8a8380]">Entrega prevista Abril 2026</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-[#8a8380]">20%</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#3d3a39] space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#8a8380]">
              Rendimiento por Área Técnica
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

        {/* Terminal EDUNOVA AI (HU-26) */}
        <div className="lg:col-span-5 bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#3d3a39]">
              <div className="flex items-center gap-2">
                <Terminal size={15} className="text-[#ee6018]" />
                <span className="font-mono text-xs uppercase tracking-wider text-[#eeeeee]">
                  ASESOR PEDAGÓGICO // EDUNOVA AI
                </span>
              </div>
              <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-[3px] bg-[#ee6018]/10 text-[#ee6018] border border-[#ee6018]/30">
                {isStreaming ? 'TRANSMITIENDO' : 'EN LÍNEA'}
              </span>
            </div>

            <p className="text-xs text-[#8a8380] leading-relaxed">
              Diagnóstico pedagógico en tiempo real sobre avance curricular, código fuente y asistencia.
            </p>

            <div className="p-3 bg-[#101010] border border-[#3d3a39] rounded-[3px] space-y-1.5">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#eeeeee] uppercase">
                <Lightbulb size={12} className="text-[#a0ca92]" />
                <span>Recomendación Pedagógica</span>
              </div>
              <p className="text-xs text-[#8a8380] leading-relaxed">
                "Excelente dominio del aislamiento de componentes. Se sugiere probar <strong className="text-[#eeeeee]">interceptores de error en Axios</strong> antes del cierre del sprint semanal."
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-mono text-[10px] text-[#8a8380] uppercase tracking-wider">
                Ejecutar Diagnóstico:
              </p>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleAiPromptClick('analisis')}
                  disabled={isStreaming}
                  className="px-2 py-2 bg-[#101010] hover:bg-[#151515] border border-[#3d3a39] hover:border-[#8a8380] rounded-[3px] font-mono text-[10px] text-[#eeeeee] uppercase text-center transition-colors disabled:opacity-40"
                >
                  Diagnóstico
                </button>
                <button
                  onClick={() => handleAiPromptClick('pendientes')}
                  disabled={isStreaming}
                  className="px-2 py-2 bg-[#101010] hover:bg-[#151515] border border-[#3d3a39] hover:border-[#8a8380] rounded-[3px] font-mono text-[10px] text-[#eeeeee] uppercase text-center transition-colors disabled:opacity-40"
                >
                  Ruta Crítica
                </button>
                <button
                  onClick={() => handleAiPromptClick('ruta')}
                  disabled={isStreaming}
                  className="px-2 py-2 bg-[#101010] hover:bg-[#151515] border border-[#3d3a39] hover:border-[#8a8380] rounded-[3px] font-mono text-[10px] text-[#eeeeee] uppercase text-center transition-colors disabled:opacity-40"
                >
                  Plan de Acción
                </button>
              </div>
            </div>

            {(isStreaming || aiStreamedText) && (
              <div className="p-3 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs font-mono text-[#eeeeee] leading-relaxed max-h-48 overflow-y-auto">
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
              <span>{isStreaming ? 'Recibiendo Respuesta...' : 'Consultar Asesor de IA'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* 4. TABLA DE ASIGNATURAS Y ENTREGAS */}
      <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] overflow-hidden">
        
        <div className="p-4 sm:p-5 border-b border-[#3d3a39] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#101010]">
          <div>
            <div className="flex items-center gap-2">
              <FolderOpen size={16} className="text-[#a0ca92]" />
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#eeeeee]">
                Asignaturas y Módulos Matriculados
              </h3>
            </div>
            <p className="font-mono text-[10px] text-[#8a8380] mt-0.5">
              Cohorte ADSO Ficha #{fichaInfo.codigo} · Filtro en tiempo real con 300ms de Debounce
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
                placeholder="Filtrar asignatura o instructor..."
                className="w-full pl-8 pr-3 py-1 bg-[#1d1a18] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] font-sans placeholder:text-[#8a8380] focus:outline-none focus:border-[#eeeeee]"
              />
            </div>

            <span className="font-mono text-[10px] text-[#8a8380] bg-[#1d1a18] border border-[#3d3a39] px-2 py-1 rounded-[3px]">
              {filteredCursos.length} MÓDULOS
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101010] font-mono text-[10px] uppercase text-[#8a8380] border-b border-[#3d3a39]">
              <tr>
                <th className="px-4 py-3">Asignatura / Código</th>
                <th className="px-4 py-3">Instructor Titular</th>
                <th className="px-4 py-3">Fecha Límite</th>
                <th className="px-4 py-3">Progreso</th>
                <th className="px-4 py-3">Nota Definitiva</th>
                <th className="px-4 py-3 text-right">Acción</th>
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
                        <span>Registrar Entrega</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center font-mono text-xs text-[#8a8380]">
                    NO SE ENCONTRARON REGISTROS PARA "{debouncedSearch}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-[#3d3a39] flex items-center justify-between font-mono text-[11px] text-[#8a8380] bg-[#101010]">
          <span>
            PÁGINA <strong className="text-[#eeeeee]">{currentPage}</strong> DE <strong className="text-[#eeeeee]">{totalPages}</strong> ({filteredCursos.length} TOTAL)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 bg-[#1d1a18] hover:bg-[#252220] border border-[#3d3a39] rounded-[3px] text-[#eeeeee] disabled:opacity-30 transition-colors"
            >
              ANTERIOR
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 bg-[#1d1a18] hover:bg-[#252220] border border-[#3d3a39] rounded-[3px] text-[#eeeeee] disabled:opacity-30 transition-colors"
            >
              SIGUIENTE
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
