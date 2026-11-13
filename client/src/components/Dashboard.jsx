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

  // Usuario en sesión
  const user = currentUser || {
    nombre: 'Anyely Valeria',
    apellido: 'Bautista',
    rol: 'APRENDIZ',
    correo: 'anyely.valeria@edunova.edu.co'
  };

  return (
    <div className="relative min-h-screen bg-[#F4F7FA] font-sans text-edunova-textPrimary overflow-hidden flex flex-col lg:flex-row">
      
      {/* Orbes de luz ambiental de fondo Ocean Tech */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-[#DCEEF5]/70 rounded-full blur-[130px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="fixed top-1/4 right-0 w-[500px] h-[500px] bg-[#19B5A5]/18 rounded-full blur-[140px] pointer-events-none translate-x-1/3"></div>
      <div className="fixed bottom-0 left-1/3 w-[450px] h-[450px] bg-[#48BFE3]/18 rounded-full blur-[130px] pointer-events-none translate-y-1/3"></div>

      {/* ============================================================ */}
      {/* 1. SIDEBAR OCEAN TECH                                        */}
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
      <div className="flex-1 flex flex-col min-w-0 z-10 overflow-y-auto h-screen">
        
        {/* Header Superior Glassmorphism */}
        <Header 
          user={user}
          onLogout={onLogout}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Contenido Dinámico por Pestaña */}
        <main className="p-4 sm:p-8 flex-1">
          
          {/* TAB 1: DASHBOARD PRINCIPAL */}
          {activeTab === 'dashboard' && (
            user.rol === 'APRENDIZ' ? (
              // Dashboard del Aprendiz en Ocean Tech Premium
              <ApprenticeDashboard user={user} onNavigate={setActiveTab} />
            ) : (
              // Vista Administrativa / Instructor en Ocean Tech
              <div className="space-y-8 max-w-7xl mx-auto animate-fadeIn">
                
                {/* Banner de Bienvenida Admin/Docente */}
                <div className="bg-gradient-to-r from-[#123B50] via-[#17365D] to-[#19B5A5] p-8 rounded-[32px] text-white shadow-glass border border-white/30 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-bold uppercase tracking-wider mb-2">
                      <ShieldCheck size={14} className="text-[#E9B949]" />
                      <span>{user.rol === 'ADMIN' ? 'Dirección Académica' : 'Docente Titular'}</span>
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-white">
                      ¡Bienvenido, {user.nombre}! ⚡
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-100 mt-1 leading-relaxed">
                      {user.rol === 'ADMIN' 
                        ? 'Gestión centralizada de aprendices, instructores, programas de formación y analítica en tiempo real.'
                        : 'Administra tus fichas asignadas en el Centro de Formación Industrial, registra notas y consolida asistencia.'}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center gap-3 shrink-0">
                    <button 
                      onClick={() => setActiveTab('reportes')}
                      className="px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/30 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 backdrop-blur-md"
                    >
                      <BarChart3 size={16} />
                      <span>Ver Reportes</span>
                    </button>
                    {user.rol === 'ADMIN' && (
                      <button 
                        onClick={() => alert('Formulario de nueva matrícula activado')}
                        className="px-5 py-2.5 bg-white text-[#123B50] font-extrabold rounded-2xl text-xs sm:text-sm shadow-md hover:bg-[#DCEEF5] transition-all flex items-center gap-2"
                      >
                        <Plus size={16} />
                        <span>Nueva Matrícula</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 4 Cards de Métricas Ocean Tech */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="glass-card glass-card-hover rounded-[26px] p-6">
                    <p className="text-[11px] font-extrabold text-edunova-textSecondary uppercase tracking-wider">Aprendices Totales</p>
                    <h3 className="text-3xl font-extrabold text-[#17365D] mt-3">250</h3>
                    <p className="text-xs text-[#19B5A5] font-bold mt-1">↑ +12 este mes</p>
                  </div>

                  <div className="glass-card glass-card-hover rounded-[26px] p-6">
                    <p className="text-[11px] font-extrabold text-edunova-textSecondary uppercase tracking-wider">Cursos Activos</p>
                    <h3 className="text-3xl font-extrabold text-[#48BFE3] mt-3">12</h3>
                    <p className="text-xs text-[#17365D] font-bold mt-1">Fichas en ejecución</p>
                  </div>

                  <div className="glass-card glass-card-hover rounded-[26px] p-6">
                    <p className="text-[11px] font-extrabold text-edunova-textSecondary uppercase tracking-wider">Instructores</p>
                    <h3 className="text-3xl font-extrabold text-[#19B5A5] mt-3">18</h3>
                    <p className="text-xs text-[#70D6B3] font-bold mt-1">100% asignados</p>
                  </div>

                  <div className="glass-card glass-card-hover rounded-[26px] p-6">
                    <p className="text-[11px] font-extrabold text-edunova-textSecondary uppercase tracking-wider">Asistencia Promedio</p>
                    <h3 className="text-3xl font-extrabold text-[#E9B949] mt-3">85%</h3>
                    <p className="text-xs text-[#19B5A5] font-bold mt-1">↑ 3.2% vs periodo anterior</p>
                  </div>
                </div>

              </div>
            )
          )}

          {/* TAB 2: CURSOS */}
          {activeTab === 'cursos' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div className="glass-panel p-6 rounded-[28px]">
                <h2 className="text-2xl font-bold text-[#123B50]">
                  {user.rol === 'APRENDIZ' ? 'Mis Cursos de Formación' : 'Gestión de Cursos y Fichas'}
                </h2>
                <p className="text-xs text-edunova-textSecondary mt-0.5">
                  Programa: Tecnólogo en Análisis y Desarrollo de Software (ADSO) · Ficha 2874102
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="glass-card glass-card-hover rounded-[28px] p-7 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EBF7FC] text-[#17365D] border border-cyan-100">
                      Ficha ADSO-2026-A
                    </span>
                    <span className="text-xs font-extrabold text-[#19B5A5] bg-[#E8F8F5] px-2.5 py-1 rounded-xl">Activo</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#123B50]">
                    Desarrollo Web Frontend Moderno (React & Tailwind)
                  </h3>
                  <p className="text-xs text-edunova-textSecondary leading-relaxed">
                    Construcción de interfaces interactivas, consumo de APIs RESTful y arquitectura SaaS moderna.
                  </p>
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-edunova-textSecondary">Instructor: <strong className="text-[#123B50]">Carlos Mendoza</strong></span>
                    <span className="font-extrabold text-[#19B5A5]">Nota: 4.8 / 5.0 (A)</span>
                  </div>
                </div>

                <div className="glass-card glass-card-hover rounded-[28px] p-7 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#DCEEF5] text-[#17365D] border border-blue-100">
                      Ficha ADSO-2026-B
                    </span>
                    <span className="text-xs font-extrabold text-[#19B5A5] bg-[#E8F8F5] px-2.5 py-1 rounded-xl">Activo</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#123B50]">
                    Arquitectura Backend y APIs RESTful (Node & Express)
                  </h3>
                  <p className="text-xs text-edunova-textSecondary leading-relaxed">
                    Desarrollo de servicios backend, seguridad JWT, bases de datos relacionales MySQL y Prisma ORM.
                  </p>
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-edunova-textSecondary">Instructora: <strong className="text-[#123B50]">Laura Gómez</strong></span>
                    <span className="font-extrabold text-[#19B5A5]">Nota: 4.5 / 5.0 (A)</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: CALIFICACIONES */}
          {activeTab === 'calificaciones' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div className="glass-panel p-6 rounded-[28px]">
                <h2 className="text-2xl font-bold text-[#123B50]">
                  {user.rol === 'APRENDIZ' ? 'Mis Calificaciones y Evidencias' : 'Registro de Calificaciones'}
                </h2>
                <p className="text-xs text-edunova-textSecondary mt-0.5">
                  Escala de evaluación SENA: Aprobado (A) / Deficiente (D) con retroalimentación pedagógica
                </p>
              </div>

              <div className="glass-panel rounded-[28px] overflow-hidden border border-white/90">
                <table className="w-full text-left text-sm text-edunova-textSecondary">
                  <thead className="bg-[#F4F7FA] text-[11px] font-extrabold text-[#718096] uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Evidencia de Aprendizaje</th>
                      <th className="px-6 py-4">Curso / Módulo</th>
                      <th className="px-6 py-4">Ponderación</th>
                      <th className="px-6 py-4">Calificación</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4">Observación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-white/80">
                      <td className="px-6 py-4 font-bold text-[#123B50]">
                        Prototipo UI en Figma (Dashboard)
                      </td>
                      <td className="px-6 py-4 text-xs">Frontend React & Tailwind</td>
                      <td className="px-6 py-4 text-xs font-mono">30%</td>
                      <td className="px-6 py-4 font-extrabold text-[#19B5A5]">4.8 / 5.0</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#E8F8F5] text-[#19B5A5] border border-emerald-100">
                          Aprobado (A)
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-edunova-textSecondary">
                        Excelente trabajo en paleta tecnológica y experiencia de usuario.
                      </td>
                    </tr>

                    <tr className="hover:bg-white/80">
                      <td className="px-6 py-4 font-bold text-[#123B50]">
                        Modelo de Datos y Script MySQL
                      </td>
                      <td className="px-6 py-4 text-xs">Backend Node & Express</td>
                      <td className="px-6 py-4 text-xs font-mono">35%</td>
                      <td className="px-6 py-4 font-extrabold text-[#19B5A5]">4.7 / 5.0</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#E8F8F5] text-[#19B5A5] border border-emerald-100">
                          Aprobado (A)
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-edunova-textSecondary">
                        Normalización relacional en 3FN impecable.
                      </td>
                    </tr>

                    <tr className="hover:bg-white/80">
                      <td className="px-6 py-4 font-bold text-[#123B50]">
                        Consumo REST con Axios & JWT
                      </td>
                      <td className="px-6 py-4 text-xs">Frontend React & Tailwind</td>
                      <td className="px-6 py-4 text-xs font-mono">35%</td>
                      <td className="px-6 py-4 font-bold text-slate-400">Pendiente</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#FEF8EC] text-[#E9B949] border border-amber-100">
                          Por Entregar
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-edunova-textSecondary">
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
              <div className="glass-panel p-6 rounded-[28px]">
                <h2 className="text-2xl font-bold text-[#123B50]">Control y Registro de Asistencia</h2>
                <p className="text-xs text-edunova-textSecondary mt-0.5">
                  Seguimiento de sesiones formativas del Centro de Formación Industrial SENA
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card glass-card-hover p-6 rounded-[28px] text-center">
                  <p className="text-xs font-extrabold text-edunova-textSecondary uppercase">Tasa de Asistencia</p>
                  <h3 className="text-4xl font-extrabold text-[#19B5A5] mt-2">92%</h3>
                  <p className="text-xs text-edunova-textSecondary mt-1">23 asistencias registradas</p>
                </div>
                <div className="glass-card glass-card-hover p-6 rounded-[28px] text-center">
                  <p className="text-xs font-extrabold text-edunova-textSecondary uppercase">Tardanzas Justificadas</p>
                  <h3 className="text-4xl font-extrabold text-[#E9B949] mt-2">1</h3>
                  <p className="text-xs text-edunova-textSecondary mt-1">Soporte radicado</p>
                </div>
                <div className="glass-card glass-card-hover p-6 rounded-[28px] text-center">
                  <p className="text-xs font-extrabold text-edunova-textSecondary uppercase">Ausencias Injustificadas</p>
                  <h3 className="text-4xl font-extrabold text-[#17365D] mt-2">0</h3>
                  <p className="text-xs text-edunova-textSecondary mt-1">Sin novedades críticas</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: REPORTES */}
          {activeTab === 'reportes' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div className="glass-panel p-6 rounded-[28px]">
                <h2 className="text-2xl font-bold text-[#123B50]">Reportes & Analítica Formativa</h2>
                <p className="text-xs text-edunova-textSecondary mt-0.5">
                  Consolidados estadísticos de competencias, avance de fichas y desempeño institucional
                </p>
              </div>

              <div className="glass-card rounded-[32px] p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#DCEEF5] text-[#17365D] flex items-center justify-center mx-auto shadow-sm">
                  <BarChart3 size={32} />
                </div>
                <h3 className="text-lg font-bold text-[#123B50]">Informe Académico Oficial Generado</h3>
                <p className="text-xs text-edunova-textSecondary max-w-md mx-auto">
                  El informe consolidado incluye ponderación de evidencias, asistencia por sesión y diagnóstico pedagógico con IA.
                </p>
                <button 
                  onClick={() => alert('Descargando reporte oficial EDUNOVA (PDF)...')}
                  className="px-6 py-3 bg-gradient-to-r from-[#17365D] via-[#19B5A5] to-[#48BFE3] text-white font-extrabold rounded-2xl text-xs shadow-ocean-glow transition-all"
                >
                  Descargar Informe Oficial en PDF
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: EDUNOVA AI */}
          {activeTab === 'ai' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div className="rounded-[32px] p-8 bg-gradient-to-br from-[#102A43] via-[#123B50] to-[#17365D] text-white space-y-4 border border-[#17365D] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#48BFE3]/15 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#123B50] via-[#17365D] to-[#19B5A5] flex items-center justify-center p-3 shadow-md border border-[#48BFE3]/40">
                    <Sparkles size={24} className="text-[#48BFE3] animate-spin-slow" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">EDUNOVA AI · Tutor Tecnológico</h2>
                    <p className="text-xs text-[#48BFE3] font-semibold">Asistente pedagógico para acompañamiento y recomendaciones adaptativas</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed relative z-10">
                  Utiliza modelos de lenguaje e inteligencia artificial para analizar el desempeño en evidencias, identificar aspectos formativos por mejorar y proponer rutas de aprendizaje personalizadas.
                </p>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
