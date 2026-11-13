import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ApprenticeDashboard from './ApprenticeDashboard';
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
                
                {/* Signature Bone Card: Banner de Bienvenida Admin/Docente */}
                <div className="bg-[#eeeeee] text-[#101010] p-6 sm:p-7 rounded-[10px] border border-[#3d3a39] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-[#101010] text-[#fafafa] font-mono text-[10px] uppercase tracking-wider mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ee6018] animate-pulse"></span>
                      <span>{user.rol === 'ADMIN' ? 'CENTRO DE CONTROL // DIRECCIÓN ACADÉMICA' : 'DESPACHO // DOCENTE TITULAR'}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#101010]">
                      Panel de Control, {user.nombre} {user.apellido}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#4d4947] mt-1.5 leading-relaxed font-sans">
                      {user.rol === 'ADMIN' 
                        ? 'Consola centralizada para gestión de fichas, instructores y métricas formativas en tiempo real bajo arquitectura Factory.'
                        : 'Consolidación de fichas asignadas en Centro de Formación, control de evidencias y registro de asistencia.'}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center gap-3 shrink-0">
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

          {/* TAB 2: CURSOS */}
          {activeTab === 'cursos' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div className="bg-[#1d1a18] p-6 rounded-[10px] border border-[#3d3a39]">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-[#101010] text-[#fafafa] font-mono text-[10px] uppercase tracking-wider mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ee6018]"></span>
                  <span>CATÁLOGO DE FORMACIÓN // FICHA 2874102</span>
                </div>
                <h2 className="text-xl font-normal text-[#eeeeee] tracking-tight">
                  {user.rol === 'APRENDIZ' ? 'Mis Cursos de Formación' : 'Gestión de Cursos y Fichas'}
                </h2>
                <p className="text-xs text-[#8c8682] mt-1 font-sans">
                  Programa: Tecnólogo en Análisis y Desarrollo de Software (ADSO) · Centro de la Industria, la Empresa y los Servicios
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-[#1d1a18] rounded-[10px] border border-[#3d3a39] p-6 space-y-4 hover:border-[#4d4947] transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-0.5 rounded-[3px] text-[10px] font-mono bg-[#101010] text-[#fafafa] border border-[#3d3a39]">
                      FICHA ADSO-2026-A
                    </span>
                    <span className="text-[10px] font-mono text-[#a0ca92] bg-[#101010] border border-[#a0ca92]/40 px-2 py-0.5 rounded-[3px] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a0ca92]"></span>
                      ACTIVO
                    </span>
                  </div>
                  <h3 className="text-base font-normal text-[#eeeeee] tracking-tight">
                    Desarrollo Web Frontend Moderno (React & Tailwind)
                  </h3>
                  <p className="text-xs text-[#8c8682] leading-relaxed font-sans">
                    Construcción de interfaces interactivas, consumo de APIs RESTful, virtualización y arquitectura SaaS moderna.
                  </p>
                  <div className="pt-3 border-t border-[#3d3a39] flex justify-between items-center text-xs font-mono">
                    <span className="text-[#8c8682]">Instructor: <strong className="text-[#eeeeee] font-medium">Carlos Mendoza</strong></span>
                    <span className="text-[#a0ca92] font-medium">Nota: 4.8 / 5.0 (A)</span>
                  </div>
                </div>

                <div className="bg-[#1d1a18] rounded-[10px] border border-[#3d3a39] p-6 space-y-4 hover:border-[#4d4947] transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-0.5 rounded-[3px] text-[10px] font-mono bg-[#101010] text-[#fafafa] border border-[#3d3a39]">
                      FICHA ADSO-2026-B
                    </span>
                    <span className="text-[10px] font-mono text-[#a0ca92] bg-[#101010] border border-[#a0ca92]/40 px-2 py-0.5 rounded-[3px] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a0ca92]"></span>
                      ACTIVO
                    </span>
                  </div>
                  <h3 className="text-base font-normal text-[#eeeeee] tracking-tight">
                    Arquitectura Backend y APIs RESTful (Node & Express)
                  </h3>
                  <p className="text-xs text-[#8c8682] leading-relaxed font-sans">
                    Desarrollo de microservicios, seguridad JWT, pool de conexiones MySQL y Prisma ORM con compresión Brotli/Gzip.
                  </p>
                  <div className="pt-3 border-t border-[#3d3a39] flex justify-between items-center text-xs font-mono">
                    <span className="text-[#8c8682]">Instructora: <strong className="text-[#eeeeee] font-medium">Laura Gómez</strong></span>
                    <span className="text-[#a0ca92] font-medium">Nota: 4.5 / 5.0 (A)</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: CALIFICACIONES */}
          {activeTab === 'calificaciones' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div className="bg-[#1d1a18] p-6 rounded-[10px] border border-[#3d3a39]">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-[#101010] text-[#fafafa] font-mono text-[10px] uppercase tracking-wider mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a0ca92]"></span>
                  <span>LIBRO DE CALIFICACIONES // SENA ADSO</span>
                </div>
                <h2 className="text-xl font-normal text-[#eeeeee] tracking-tight">
                  {user.rol === 'APRENDIZ' ? 'Mis Calificaciones y Evidencias' : 'Registro de Calificaciones'}
                </h2>
                <p className="text-xs text-[#8c8682] mt-1 font-sans">
                  Escala de evaluación oficial: Aprobado (A) / Deficiente (D) con retroalimentación formativa
                </p>
              </div>

              <div className="bg-[#1d1a18] rounded-[10px] overflow-hidden border border-[#3d3a39]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#101010] text-[10px] font-mono text-[#8c8682] uppercase tracking-wider border-b border-[#3d3a39]">
                    <tr>
                      <th className="px-5 py-3.5">Evidencia de Aprendizaje</th>
                      <th className="px-5 py-3.5">Curso / Módulo</th>
                      <th className="px-5 py-3.5">Ponderación</th>
                      <th className="px-5 py-3.5">Calificación</th>
                      <th className="px-5 py-3.5">Estado</th>
                      <th className="px-5 py-3.5">Observación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3d3a39] text-xs">
                    <tr className="hover:bg-[#101010]/40 transition-colors">
                      <td className="px-5 py-4 font-normal text-[#eeeeee]">
                        Prototipo UI en Figma (Factory System)
                      </td>
                      <td className="px-5 py-4 text-[#8c8682]">Frontend React & Tailwind</td>
                      <td className="px-5 py-4 font-mono text-[#fafafa]">30%</td>
                      <td className="px-5 py-4 font-mono font-medium text-[#a0ca92]">4.8 / 5.0</td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-0.5 rounded-[3px] text-[10px] font-mono bg-[#101010] text-[#a0ca92] border border-[#a0ca92]/40">
                          APROBADO (A)
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#8c8682]">
                        Implementación estricta de tokens Factory (Geist, #101010, #eeeeee).
                      </td>
                    </tr>

                    <tr className="hover:bg-[#101010]/40 transition-colors">
                      <td className="px-5 py-4 font-normal text-[#eeeeee]">
                        Modelo de Datos y Script MySQL Pool
                      </td>
                      <td className="px-5 py-4 text-[#8c8682]">Backend Node & Express</td>
                      <td className="px-5 py-4 font-mono text-[#fafafa]">35%</td>
                      <td className="px-5 py-4 font-mono font-medium text-[#a0ca92]">4.7 / 5.0</td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-0.5 rounded-[3px] text-[10px] font-mono bg-[#101010] text-[#a0ca92] border border-[#a0ca92]/40">
                          APROBADO (A)
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#8c8682]">
                        Pool de 20 conexiones, índices optimizados y prevención N+1.
                      </td>
                    </tr>

                    <tr className="hover:bg-[#101010]/40 transition-colors">
                      <td className="px-5 py-4 font-normal text-[#eeeeee]">
                        Consumo REST con Axios & Streaming IA
                      </td>
                      <td className="px-5 py-4 text-[#8c8682]">Frontend React & Tailwind</td>
                      <td className="px-5 py-4 font-mono text-[#fafafa]">35%</td>
                      <td className="px-5 py-4 font-mono text-[#8c8682]">Pendiente</td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-0.5 rounded-[3px] text-[10px] font-mono bg-[#101010] text-[#ee6018] border border-[#ee6018]/40">
                          POR ENTREGAR
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#8c8682]">
                        Fecha límite: 10 de Abril de 2026.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ASISTENCIA */}
          {activeTab === 'asistencia' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div className="bg-[#1d1a18] p-6 rounded-[10px] border border-[#3d3a39]">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-[#101010] text-[#fafafa] font-mono text-[10px] uppercase tracking-wider mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ee6018]"></span>
                  <span>REGISTRO BIOMÉTRICO Y ASISTENCIA</span>
                </div>
                <h2 className="text-xl font-normal text-[#eeeeee] tracking-tight">Control y Registro de Asistencia</h2>
                <p className="text-xs text-[#8c8682] mt-1 font-sans">
                  Seguimiento de sesiones formativas del Centro de Formación Industrial SENA Regional Huila
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#1d1a18] border border-[#3d3a39] p-6 rounded-[10px]">
                  <p className="text-[10px] font-mono text-[#8c8682] uppercase tracking-wider">Tasa de Asistencia</p>
                  <h3 className="text-3xl font-normal text-[#eeeeee] mt-2 font-sans tracking-tight">94.2%</h3>
                  <p className="text-xs font-mono text-[#a0ca92] mt-2">23 asistencias registradas</p>
                </div>
                <div className="bg-[#1d1a18] border border-[#3d3a39] p-6 rounded-[10px]">
                  <p className="text-[10px] font-mono text-[#8c8682] uppercase tracking-wider">Tardanzas Justificadas</p>
                  <h3 className="text-3xl font-normal text-[#eeeeee] mt-2 font-sans tracking-tight">1</h3>
                  <p className="text-xs font-mono text-[#ee6018] mt-2">Soporte radicado</p>
                </div>
                <div className="bg-[#1d1a18] border border-[#3d3a39] p-6 rounded-[10px]">
                  <p className="text-[10px] font-mono text-[#8c8682] uppercase tracking-wider">Ausencias Injustificadas</p>
                  <h3 className="text-3xl font-normal text-[#eeeeee] mt-2 font-sans tracking-tight">0</h3>
                  <p className="text-xs font-mono text-[#a0ca92] mt-2">Sin novedades críticas</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: REPORTES */}
          {activeTab === 'reportes' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div className="bg-[#1d1a18] p-6 rounded-[10px] border border-[#3d3a39]">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-[#101010] text-[#fafafa] font-mono text-[10px] uppercase tracking-wider mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ee6018]"></span>
                  <span>DOSSIER DE DESEMPEÑO // FACTORY ANALYTICS</span>
                </div>
                <h2 className="text-xl font-normal text-[#eeeeee] tracking-tight">Reportes & Analítica Formativa</h2>
                <p className="text-xs text-[#8c8682] mt-1 font-sans">
                  Consolidados estadísticos de competencias, avance de fichas y desempeño institucional
                </p>
              </div>

              <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] p-8 text-center space-y-4 max-w-2xl mx-auto">
                <div className="w-12 h-12 rounded-[3px] bg-[#101010] border border-[#3d3a39] text-[#ee6018] flex items-center justify-center mx-auto">
                  <BarChart3 size={24} />
                </div>
                <h3 className="text-base font-normal text-[#eeeeee] tracking-tight">Informe Académico Oficial Generado</h3>
                <p className="text-xs text-[#8c8682] max-w-md mx-auto leading-relaxed">
                  El dossier consolidado incluye ponderación de evidencias, asistencia biométrica por sesión y diagnóstico pedagógico con IA bajo estándares SENA ADSO.
                </p>
                <button 
                  onClick={() => alert('Descargando reporte oficial EDUNOVA (PDF)...')}
                  className="px-5 py-2.5 bg-[#fafafa] hover:bg-white text-[#101010] rounded-[3px] text-xs font-mono font-medium transition-colors border border-[#3d3a39] inline-flex items-center gap-2"
                >
                  <FileCheck2 size={14} className="text-[#ee6018]" />
                  <span>Descargar Dossier en PDF</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: EDUNOVA AI */}
          {activeTab === 'ai' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] p-6 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-[#3d3a39]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[3px] bg-[#101010] border border-[#3d3a39] flex items-center justify-center text-[#ee6018]">
                      <Brain size={18} />
                    </div>
                    <div>
                      <h2 className="text-base font-normal text-[#eeeeee] tracking-tight">EDUNOVA AI · Motor Tutor Tecnológico</h2>
                      <p className="text-[11px] font-mono text-[#8c8682]">RED NEURAL PEDAGÓGICA // STREAMING TOKEN POR TOKEN</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ee6018] animate-pulse"></span>
                    <span className="text-[10px] font-mono text-[#8c8682]">NODE 01 ACTIVE</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-[#8c8682] leading-relaxed">
                    Formula una consulta formativa al tutor o solicita un diagnóstico de competencias para la Ficha ADSO 2874102:
                  </p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSimulateAi()}
                      placeholder="Ej: ¿Cuáles son las evidencias pendientes y recomendaciones para la fase de ejecución?"
                      className="flex-1 bg-[#101010] border border-[#3d3a39] rounded-[3px] px-3.5 py-2 text-xs font-mono text-[#eeeeee] placeholder-[#8c8682] focus:outline-none focus:border-[#ee6018]"
                    />
                    <button 
                      onClick={handleSimulateAi}
                      disabled={isAiStreaming}
                      className="px-4 py-2 bg-[#fafafa] hover:bg-white text-[#101010] rounded-[3px] text-xs font-mono font-medium transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0"
                    >
                      <Sparkles size={13} className="text-[#ee6018]" />
                      <span>{isAiStreaming ? 'Transmitiendo...' : 'Despachar'}</span>
                    </button>
                  </div>
                </div>

                {/* AI Console Output */}
                {(aiResponse || isAiStreaming) && (
                  <div className="bg-[#101010] border border-[#3d3a39] rounded-[3px] p-4 font-mono text-xs text-[#eeeeee] whitespace-pre-wrap leading-relaxed animate-fadeIn">
                    <div className="flex items-center gap-2 pb-2 mb-2 border-b border-[#3d3a39] text-[10px] text-[#8c8682]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a0ca92]"></span>
                      <span>TELEMETRÍA // RESPUESTA EN TIEMPO REAL</span>
                    </div>
                    {aiResponse}
                    {isAiStreaming && <span className="inline-block w-2 h-4 bg-[#ee6018] ml-1 animate-pulse align-middle"></span>}
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
