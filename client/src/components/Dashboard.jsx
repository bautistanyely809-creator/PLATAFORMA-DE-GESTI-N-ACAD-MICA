import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ApprenticeDashboard from './ApprenticeDashboard';
import Hero3DCanvas from './Hero3DCanvas';
import CompetenciasModule from './modules/CompetenciasModule';
import EvidenciasModule from './modules/EvidenciasModule';
import RecuperacionesModule from './modules/RecuperacionesModule';
import AsistenciaModule from './modules/AsistenciaModule';
import ReportesModule from './modules/ReportesModule';
import NotificacionesModule from './modules/NotificacionesModule';
import AiModule from './modules/AiModule';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  CalendarCheck, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  ChevronRight, 
  FileCheck2, 
  Clock, 
  BarChart3, 
  Plus, 
  Brain, 
  ShieldCheck,
  FolderOpen
} from 'lucide-react';

export default function Dashboard({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiStreaming, setIsAiStreaming] = useState(false);

  // Usuario en sesión
  const user = currentUser || {
    nombre: 'Anyely Valeria',
    apellido: 'Bautista',
    rol: 'APRENDIZ',
    correo: 'anyely.valeria@edunova.edu.co'
  };

  const handleSimulateAi = () => {
    if (!aiPrompt.trim() || isAiStreaming) return;
    setIsAiStreaming(true);
    setAiResponse('');
    const fullText = `[NODO IA 01] Diagnóstico de competencias para ${user.nombre} (${user.rol}):\n\n` +
      `• Cobertura de Evidencias Técnicas: 92.4% completado satisfactoriamente.\n` +
      `• Métrica de Asistencia en Sesiones Presenciales: 94.2% sin novedades disciplinarias.\n` +
      `• Recomendación Formativa: Reforzar conceptos de diseño bajo el estándar Factory Design Tokens (Geist 400, radio 3px, contraste Obsidian #101010 y Bone #eeeeee).\n` +
      `• Estado General: ACREDITADO para fase de pruebas de certificación.`;

    let i = 0;
    const interval = setInterval(() => {
      setAiResponse(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) {
        clearInterval(interval);
        setIsAiStreaming(false);
      }
    }, 18);
  };

  return (
    <div className="relative min-h-screen bg-[#101010] font-sans text-[#eeeeee] overflow-hidden flex flex-col lg:flex-row selection:bg-[#ee6018] selection:text-white">
      
      {/* ============================================================ */}
      {/* 1. SIDEBAR FACTORY CONTROL SURFACE                           */}
      {/* ============================================================ */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={onLogout}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* ============================================================ */}
      {/* 2. ÁREA PRINCIPAL CON HEADER SUPERIOR FLOTANTE & CONTENIDO   */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0 z-10 overflow-y-auto h-screen bg-[#101010]">
        
        {/* Header Superior Terminal */}
        <Header 
          user={user}
          onLogout={onLogout}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onNavigate={setActiveTab}
        />

        {/* Contenido Dinámico por Pestaña */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          
          {/* TAB 1: DASHBOARD PRINCIPAL */}
          {activeTab === 'dashboard' && (
            user.rol === 'APRENDIZ' ? (
              // Dashboard del Aprendiz en Factory Style
              <ApprenticeDashboard user={user} onNavigate={setActiveTab} />
            ) : (
              // Vista Administrativa / Instructor en Factory Style
              <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
                
                {/* Signature Bone Card: Banner de Bienvenida Admin/Docente con Núcleo 3D Three.js */}
                <div className="bg-[#eeeeee] text-[#101010] p-6 sm:p-7 rounded-[10px] border border-[#3d3a39] relative overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    
                    <div className="lg:col-span-7 space-y-3.5">
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-[#101010] text-[#fafafa] font-mono text-[10px] uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ee6018] animate-pulse"></span>
                        <span>{user.rol === 'ADMIN' ? 'CENTRO DE CONTROL // DIRECCIÓN ACADÉMICA' : 'DESPACHO // DOCENTE TITULAR'}</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#101010]">
                        Panel de Control, {user.nombre} {user.apellido}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#4d4947] leading-relaxed font-sans max-w-xl">
                        {user.rol === 'ADMIN' 
                          ? 'Consola centralizada para gestión de fichas, instructores y métricas formativas en tiempo real bajo arquitectura Factory con telemetría 3D interactiva.'
                          : 'Consolidación de fichas asignadas en Centro de Formación, control de evidencias y registro de asistencia.'}
                      </p>

                      <div className="flex items-center gap-3 pt-1">
                        <button 
                          onClick={() => setActiveTab('reportes')}
                          className="px-4 py-2 border border-[#3d3a39] hover:bg-[#e0dedd] text-[#101010] rounded-[3px] text-xs font-mono font-medium transition-colors flex items-center gap-2"
                        >
                          <BarChart3 size={14} />
                          <span>Ver Reportes</span>
                        </button>
                        {user.rol === 'ADMIN' && (
                          <button 
                            onClick={() => alert('Formulario de nueva matrícula activado')}
                            className="px-4 py-2 bg-[#101010] text-[#fafafa] hover:bg-[#1d1a18] rounded-[3px] text-xs font-mono font-medium transition-colors flex items-center gap-2 border border-[#3d3a39]"
                          >
                            <Plus size={14} className="text-[#ee6018]" />
                            <span>Nueva Matrícula</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-5 bg-[#ffffff]/60 border border-[#3d3a39]/20 rounded-[8px] p-2.5 shadow-sm">
                      <Hero3DCanvas variant="bone" />
                    </div>

                  </div>
                </div>

                {/* 4 Cards de Métricas Factory Style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#1d1a18] rounded-[10px] p-5 border border-[#3d3a39] hover:border-[#4d4947] transition-colors">
                    <p className="text-[10px] font-mono text-[#8c8682] uppercase tracking-wider">Aprendices Totales</p>
                    <h3 className="text-3xl font-normal text-[#eeeeee] tracking-tight mt-2 font-sans">250</h3>
                    <p className="text-xs font-mono text-[#a0ca92] flex items-center gap-1.5 mt-2">
                      <span>↑</span> +12 este mes
                    </p>
                  </div>

                  <div className="bg-[#1d1a18] rounded-[10px] p-5 border border-[#3d3a39] hover:border-[#4d4947] transition-colors">
                    <p className="text-[10px] font-mono text-[#8c8682] uppercase tracking-wider">Cursos Activos</p>
                    <h3 className="text-3xl font-normal text-[#eeeeee] tracking-tight mt-2 font-sans">12</h3>
                    <p className="text-xs font-mono text-[#8c8682] flex items-center gap-1.5 mt-2">
                      Fichas en ejecución
                    </p>
                  </div>

                  <div className="bg-[#1d1a18] rounded-[10px] p-5 border border-[#3d3a39] hover:border-[#4d4947] transition-colors">
                    <p className="text-[10px] font-mono text-[#8c8682] uppercase tracking-wider">Instructores</p>
                    <h3 className="text-3xl font-normal text-[#eeeeee] tracking-tight mt-2 font-sans">18</h3>
                    <p className="text-xs font-mono text-[#a0ca92] flex items-center gap-1.5 mt-2">
                      100% asignados
                    </p>
                  </div>

                  <div className="bg-[#1d1a18] rounded-[10px] p-5 border border-[#3d3a39] hover:border-[#4d4947] transition-colors">
                    <p className="text-[10px] font-mono text-[#8c8682] uppercase tracking-wider">Asistencia Promedio</p>
                    <h3 className="text-3xl font-normal text-[#eeeeee] tracking-tight mt-2 font-sans">94.2%</h3>
                    <p className="text-xs font-mono text-[#a0ca92] flex items-center gap-1.5 mt-2">
                      <span>↑</span> +3.2% vs periodo anterior
                    </p>
                  </div>
                </div>

                {/* Subsección: Estado de Servicios & Fichas Críticas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-[#1d1a18] rounded-[10px] p-5 border border-[#3d3a39]">
                    <div className="flex items-center justify-between pb-3 border-b border-[#3d3a39]">
                      <h4 className="text-xs font-mono text-[#fafafa] uppercase tracking-wider">Servicios y Telemetría</h4>
                      <span className="text-[10px] font-mono text-[#a0ca92] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#a0ca92]"></span>
                        OPERACIONAL
                      </span>
                    </div>
                    <div className="mt-4 space-y-3 font-mono text-xs">
                      <div className="flex justify-between items-center text-[#8c8682]">
                        <span>DB Node / MySQL Pool</span>
                        <span className="text-[#a0ca92]">20/20 Conexiones [12ms]</span>
                      </div>
                      <div className="flex justify-between items-center text-[#8c8682]">
                        <span>Redis Cache Engine</span>
                        <span className="text-[#a0ca92]">HIT RATE 98.4%</span>
                      </div>
                      <div className="flex justify-between items-center text-[#8c8682]">
                        <span>Token Streaming API</span>
                        <span className="text-[#a0ca92]">ONLINE // HTTP 200</span>
                      </div>
                      <div className="flex justify-between items-center text-[#8c8682]">
                        <span>OpenTelemetry Tracing</span>
                        <span className="text-[#a0ca92]">ACTIVO // SPAN OK</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1d1a18] rounded-[10px] p-5 border border-[#3d3a39]">
                    <div className="flex items-center justify-between pb-3 border-b border-[#3d3a39]">
                      <h4 className="text-xs font-mono text-[#fafafa] uppercase tracking-wider">Fichas en Seguimiento</h4>
                      <span className="text-[10px] font-mono text-[#8c8682]">HUILA - NEIVA</span>
                    </div>
                    <div className="mt-4 space-y-3 font-mono text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-[#eeeeee]">ADSO 2874102</span>
                        <span className="text-[#a0ca92] bg-[#101010] border border-[#3d3a39] px-2 py-0.5 rounded-[3px]">FASE EJECUCIÓN</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#eeeeee]">ADSO 2874103</span>
                        <span className="text-[#a0ca92] bg-[#101010] border border-[#3d3a39] px-2 py-0.5 rounded-[3px]">FASE PLANEACIÓN</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#eeeeee]">MULTIMEDIA 2910381</span>
                        <span className="text-[#ee6018] bg-[#101010] border border-[#3d3a39] px-2 py-0.5 rounded-[3px]">PENDIENTE EVAL</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )
          )}

          {/* MÓDULO 1: SEGUIMIENTO POR COMPETENCIAS */}
          {activeTab === 'competencias' && (
            <CompetenciasModule user={user} />
          )}

          {/* MÓDULO 2: GESTIÓN COMPLETA DE EVIDENCIAS */}
          {(activeTab === 'evidencias' || activeTab === 'calificaciones') && (
            <EvidenciasModule user={user} />
          )}

          {/* MÓDULO 3: SISTEMA DE RECUPERACIÓN DE COMPETENCIAS */}
          {activeTab === 'recuperaciones' && (
            <RecuperacionesModule user={user} />
          )}

          {/* MÓDULO 4: CONTROL DE ASISTENCIA AUTOMATIZADO */}
          {activeTab === 'asistencia' && (
            <AsistenciaModule user={user} />
          )}

          {/* MÓDULO 5: REPORTE OFICIAL PDF & EXCEL */}
          {activeTab === 'reportes' && (
            <ReportesModule user={user} />
          )}

          {/* MÓDULO 6: CENTRO DE NOTIFICACIONES */}
          {activeTab === 'notificaciones' && (
            <NotificacionesModule user={user} onNavigate={setActiveTab} />
          )}

          {/* MÓDULO 7: EDUNOVA AI CON DATOS REALES */}
          {activeTab === 'ai' && (
            <AiModule user={user} />
          )}

          {/* TAB CURSOS / CATÁLOGO */}
          {activeTab === 'cursos' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn font-sans">
              <div className="bg-[#1d1a18] p-6 rounded-[10px] border border-[#3d3a39] flex justify-between items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-[#101010] text-[#fafafa] font-mono text-[10px] uppercase tracking-wider mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ee6018]"></span>
                    <span>CATÁLOGO DE FORMACIÓN // FICHA 2874102</span>
                  </div>
                  <h2 className="text-xl font-normal text-[#eeeeee] tracking-tight">
                    Cursos y Fichas Académicas
                  </h2>
                  <p className="text-xs text-[#8c8682] mt-0.5">
                    Tecnólogo en Análisis y Desarrollo de Software · Centro de Formación Industrial SENA
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('competencias')}
                  className="px-4 py-2 bg-[#fafafa] hover:bg-white text-[#101010] rounded-[3px] font-mono text-xs font-medium transition-colors"
                >
                  Ver Competencias
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#1d1a18] rounded-[10px] border border-[#3d3a39] p-6 space-y-4 hover:border-[#4d4947] transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-0.5 rounded-[3px] text-[10px] font-mono bg-[#101010] text-[#fafafa] border border-[#3d3a39]">
                      FICHA ADSO 2874102-A
                    </span>
                    <span className="text-[10px] font-mono text-[#a0ca92] bg-[#101010] border border-[#a0ca92]/40 px-2 py-0.5 rounded-[3px]">
                      ACTIVO
                    </span>
                  </div>
                  <h3 className="text-base font-normal text-[#eeeeee]">Desarrollo Frontend con React 18, Vite & Three.js</h3>
                  <p className="text-xs text-[#8c8682] leading-relaxed">
                    Interfaces responsivas de alto contraste bajo el sistema de diseño Factory y núcleo 3D interactivo.
                  </p>
                  <div className="pt-3 border-t border-[#3d3a39] flex justify-between items-center text-xs font-mono text-[#8c8682]">
                    <span>Instructor: <strong className="text-[#eeeeee]">Carlos Mendoza</strong></span>
                    <button onClick={() => setActiveTab('evidencias')} className="text-[#ee6018] underline">Ver Evidencias</button>
                  </div>
                </div>

                <div className="bg-[#1d1a18] rounded-[10px] border border-[#3d3a39] p-6 space-y-4 hover:border-[#4d4947] transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-0.5 rounded-[3px] text-[10px] font-mono bg-[#101010] text-[#fafafa] border border-[#3d3a39]">
                      FICHA ADSO 2874102-B
                    </span>
                    <span className="text-[10px] font-mono text-[#a0ca92] bg-[#101010] border border-[#a0ca92]/40 px-2 py-0.5 rounded-[3px]">
                      ACTIVO
                    </span>
                  </div>
                  <h3 className="text-base font-normal text-[#eeeeee]">Backend, API RESTful & Base de Datos MySQL 8</h3>
                  <p className="text-xs text-[#8c8682] leading-relaxed">
                    Arquitectura monolítica modular con Prisma ORM, normalización 3FN, RBAC y pools de conexión.
                  </p>
                  <div className="pt-3 border-t border-[#3d3a39] flex justify-between items-center text-xs font-mono text-[#8c8682]">
                    <span>Instructora: <strong className="text-[#eeeeee]">Laura Gómez</strong></span>
                    <button onClick={() => setActiveTab('evidencias')} className="text-[#ee6018] underline">Ver Evidencias</button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
