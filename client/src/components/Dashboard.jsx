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
  ShieldCheck 
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
    <div className="relative min-h-screen bg-edunova-cloud font-sans text-edunova-textPrimary overflow-hidden flex flex-col lg:flex-row">
      
      {/* Orbes de luz ambiental de fondo para efecto Glassmorphism */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-[#F7B8DC]/35 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="fixed top-1/4 right-0 w-[500px] h-[500px] bg-[#C8B5F5]/30 rounded-full blur-[140px] pointer-events-none translate-x-1/3"></div>
      <div className="fixed bottom-0 left-1/3 w-[450px] h-[450px] bg-[#A5D8FA]/30 rounded-full blur-[130px] pointer-events-none translate-y-1/3"></div>

      {/* ============================================================ */}
      {/* 1. SIDEBAR PASTEL GLASSMORPHISM                             */}
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
              // Dashboard del Aprendiz en Pastel Glassmorphism
              <ApprenticeDashboard user={user} onNavigate={setActiveTab} />
            ) : (
              // Vista Administrativa / Instructor adaptada al estilo Soft Glass
              <div className="space-y-8 max-w-7xl mx-auto animate-fadeIn">
                
                {/* Banner de Bienvenida Admin/Docente */}
                <div className="bg-gradient-to-r from-[#F7B8DC] via-[#C8B5F5] to-[#8064D8] p-8 rounded-[32px] text-white shadow-glass border border-white/60 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white text-xs font-bold uppercase tracking-wider mb-2">
                      <ShieldCheck size={14} className="text-[#FFE49B]" />
                      <span>{user.rol === 'ADMIN' ? 'Dirección Académica' : 'Docente Titular'}</span>
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-white">
                      ¡Bienvenido, {user.nombre}! 🌸
                    </h2>
                    <p className="text-xs sm:text-sm text-white/95 mt-1 leading-relaxed">
                      {user.rol === 'ADMIN' 
                        ? 'Gestión centralizada de aprendices, instructores, programas de formación y analítica en tiempo real.'
                        : 'Administra tus fichas asignadas en el Centro de Formación Industrial, registra notas y consolida asistencia.'}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center gap-3 shrink-0">
                    <button 
                      onClick={() => setActiveTab('reportes')}
                      className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white border border-white/40 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 backdrop-blur-md"
                    >
                      <BarChart3 size={16} />
                      <span>Ver Reportes</span>
                    </button>
                    {user.rol === 'ADMIN' && (
                      <button 
                        onClick={() => alert('Formulario de nueva matrícula')}
                        className="px-5 py-2.5 bg-white text-edunova-violet font-extrabold rounded-2xl text-xs sm:text-sm shadow-md hover:bg-white/90 transition-all flex items-center gap-2"
                      >
                        <Plus size={16} />
                        <span>Nueva Matrícula</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 4 Cards de Métricas Pastel */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="glass-card glass-card-hover rounded-[26px] p-6">
                    <p className="text-[11px] font-extrabold text-edunova-textSecondary uppercase tracking-wider">Aprendices Totales</p>
                    <h3 className="text-3xl font-extrabold text-edunova-textPrimary mt-3">250</h3>
                    <p className="text-xs text-[#3978F6] font-bold mt-1">↑ +12 este mes</p>
                  </div>

                  <div className="glass-card glass-card-hover rounded-[26px] p-6">
                    <p className="text-[11px] font-extrabold text-edunova-textSecondary uppercase tracking-wider">Cursos Activos</p>
                    <h3 className="text-3xl font-extrabold text-edunova-textPrimary mt-3">12</h3>
                    <p className="text-xs text-edunova-violet font-bold mt-1">Fichas en ejecución</p>
                  </div>

                  <div className="glass-card glass-card-hover rounded-[26px] p-6">
                    <p className="text-[11px] font-extrabold text-edunova-textSecondary uppercase tracking-wider">Instructores</p>
                    <h3 className="text-3xl font-extrabold text-edunova-textPrimary mt-3">18</h3>
                    <p className="text-xs text-[#D6409B] font-bold mt-1">100% asignados</p>
                  </div>

                  <div className="glass-card glass-card-hover rounded-[26px] p-6">
                    <p className="text-[11px] font-extrabold text-edunova-textSecondary uppercase tracking-wider">Asistencia Promedio</p>
                    <h3 className="text-3xl font-extrabold text-edunova-textPrimary mt-3">85%</h3>
                    <p className="text-xs text-[#16A36A] font-bold mt-1">↑ 3.2% vs periodo anterior</p>
                  </div>
                </div>

              </div>
            )
          )}

          {/* TAB 2: CURSOS */}
          {activeTab === 'cursos' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div className="glass-panel p-6 rounded-[28px]">
                <h2 className="text-2xl font-bold text-edunova-textPrimary">
                  {user.rol === 'APRENDIZ' ? 'Mis Cursos de Formación' : 'Gestión de Cursos y Fichas'}
                </h2>
                <p className="text-xs text-edunova-textSecondary mt-0.5">
                  Programa: Tecnólogo en Análisis y Desarrollo de Software (ADSO) · Ficha 2874102
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="glass-card glass-card-hover rounded-[28px] p-7 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FCE4F2] text-[#D6409B] border border-pink-100">
                      Ficha ADSO-2026-A
                    </span>
                    <span className="text-xs font-extrabold text-[#16A36A] bg-[#E6F9F2] px-2.5 py-1 rounded-xl">Activo</span>
                  </div>
                  <h3 className="text-lg font-bold text-edunova-textPrimary">
                    Desarrollo Web Frontend Moderno (React & Tailwind)
                  </h3>
                  <p className="text-xs text-edunova-textSecondary leading-relaxed">
                    Construcción de interfaces interactivas, consumo de APIs RESTful y maquetación SaaS Soft UI.
                  </p>
                  <div className="pt-3 border-t border-purple-100/60 flex justify-between items-center text-xs">
                    <span className="text-edunova-textSecondary">Instructor: <strong className="text-edunova-textPrimary">Carlos Mendoza</strong></span>
                    <span className="font-extrabold text-edunova-violet">Nota: 4.8 / 5.0 (A)</span>
                  </div>
                </div>

                <div className="glass-card glass-card-hover rounded-[28px] p-7 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#DCEBFA] text-[#3978F6] border border-blue-100">
                      Ficha ADSO-2026-B
                    </span>
                    <span className="text-xs font-extrabold text-[#16A36A] bg-[#E6F9F2] px-2.5 py-1 rounded-xl">Activo</span>
                  </div>
                  <h3 className="text-lg font-bold text-edunova-textPrimary">
                    Arquitectura Backend y APIs RESTful (Node & Express)
                  </h3>
                  <p className="text-xs text-edunova-textSecondary leading-relaxed">
                    Desarrollo de servicios backend, seguridad JWT, bases de datos relacionales MySQL y Prisma ORM.
                  </p>
                  <div className="pt-3 border-t border-purple-100/60 flex justify-between items-center text-xs">
                    <span className="text-edunova-textSecondary">Instructora: <strong className="text-edunova-textPrimary">Laura Gómez</strong></span>
                    <span className="font-extrabold text-edunova-violet">Nota: 4.5 / 5.0 (A)</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: CALIFICACIONES */}
          {activeTab === 'calificaciones' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div className="glass-panel p-6 rounded-[28px]">
                <h2 className="text-2xl font-bold text-edunova-textPrimary">
                  {user.rol === 'APRENDIZ' ? 'Mis Calificaciones y Evidencias' : 'Registro de Calificaciones'}
                </h2>
                <p className="text-xs text-edunova-textSecondary mt-0.5">
                  Escala de evaluación SENA: Aprobado (A) / Deficiente (D) con retroalimentación pedagógica
                </p>
              </div>

              <div className="glass-panel rounded-[28px] overflow-hidden border border-white/80">
                <table className="w-full text-left text-sm text-edunova-textSecondary">
                  <thead className="bg-[#FAF8FD] text-[11px] font-extrabold text-[#8A819C] uppercase tracking-wider border-b border-purple-100/60">
                    <tr>
                      <th className="px-6 py-4">Evidencia de Aprendizaje</th>
                      <th className="px-6 py-4">Curso / Módulo</th>
                      <th className="px-6 py-4">Ponderación</th>
                      <th className="px-6 py-4">Calificación</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4">Observación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-50">
                    <tr className="hover:bg-white/60">
                      <td className="px-6 py-4 font-bold text-edunova-textPrimary">
                        Prototipo UI en Figma (Dashboard)
                      </td>
                      <td className="px-6 py-4 text-xs">Frontend React & Tailwind</td>
                      <td className="px-6 py-4 text-xs font-mono">30%</td>
                      <td className="px-6 py-4 font-extrabold text-[#16A36A]">4.8 / 5.0</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#E6F9F2] text-[#16A36A] border border-emerald-100">
                          Aprobado (A)
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-edunova-textSecondary">
                        Excelente trabajo en paleta pastel y experiencia de usuario.
                      </td>
                    </tr>

                    <tr className="hover:bg-white/60">
                      <td className="px-6 py-4 font-bold text-edunova-textPrimary">
                        Modelo de Datos y Script MySQL
                      </td>
                      <td className="px-6 py-4 text-xs">Backend Node & Express</td>
                      <td className="px-6 py-4 text-xs font-mono">35%</td>
                      <td className="px-6 py-4 font-extrabold text-[#16A36A]">4.7 / 5.0</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#E6F9F2] text-[#16A36A] border border-emerald-100">
                          Aprobado (A)
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-edunova-textSecondary">
                        Normalización relacional en 3FN impecable.
                      </td>
                    </tr>

                    <tr className="hover:bg-white/60">
                      <td className="px-6 py-4 font-bold text-edunova-textPrimary">
                        Consumo REST con Axios & JWT
                      </td>
                      <td className="px-6 py-4 text-xs">Frontend React & Tailwind</td>
                      <td className="px-6 py-4 text-xs font-mono">35%</td>
                      <td className="px-6 py-4 font-bold text-slate-400">Pendiente</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#FFF6DC] text-[#DCA91F] border border-amber-100">
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
                <h2 className="text-2xl font-bold text-edunova-textPrimary">Control y Registro de Asistencia</h2>
                <p className="text-xs text-edunova-textSecondary mt-0.5">
                  Seguimiento de sesiones formativas del Centro de Formación Industrial SENA
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card glass-card-hover p-6 rounded-[28px] text-center">
                  <p className="text-xs font-extrabold text-edunova-textSecondary uppercase">Tasa de Asistencia</p>
                  <h3 className="text-4xl font-extrabold text-[#16A36A] mt-2">92%</h3>
                  <p className="text-xs text-edunova-textSecondary mt-1">23 asistencias registradas</p>
                </div>
                <div className="glass-card glass-card-hover p-6 rounded-[28px] text-center">
                  <p className="text-xs font-extrabold text-edunova-textSecondary uppercase">Tardanzas Justificadas</p>
                  <h3 className="text-4xl font-extrabold text-[#DCA91F] mt-2">1</h3>
                  <p className="text-xs text-edunova-textSecondary mt-1">Soporte radicado</p>
                </div>
                <div className="glass-card glass-card-hover p-6 rounded-[28px] text-center">
                  <p className="text-xs font-extrabold text-edunova-textSecondary uppercase">Ausencias Injustificadas</p>
                  <h3 className="text-4xl font-extrabold text-[#16A36A] mt-2">0</h3>
                  <p className="text-xs text-edunova-textSecondary mt-1">Sin novedades críticas</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: REPORTES */}
          {activeTab === 'reportes' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div className="glass-panel p-6 rounded-[28px]">
                <h2 className="text-2xl font-bold text-edunova-textPrimary">Reportes & Analítica Formativa</h2>
                <p className="text-xs text-edunova-textSecondary mt-0.5">
                  Consolidados estadísticos de competencias, avance de fichas y desempeño institucional
                </p>
              </div>

              <div className="glass-card rounded-[32px] p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#DCEBFA] text-[#3978F6] flex items-center justify-center mx-auto shadow-sm">
                  <BarChart3 size={32} />
                </div>
                <h3 className="text-lg font-bold text-edunova-textPrimary">Informe Académico Oficial Generado</h3>
                <p className="text-xs text-edunova-textSecondary max-w-md mx-auto">
                  El informe consolidado incluye ponderación de evidencias, asistencia por sesión y diagnóstico pedagógico con IA.
                </p>
                <button 
                  onClick={() => alert('Descargando reporte oficial EDUNOVA (PDF)...')}
                  className="px-6 py-3 bg-gradient-to-r from-edunova-violet to-edunova-lilac text-white font-extrabold rounded-2xl text-xs shadow-pastel-violet transition-all"
                >
                  Descargar Informe Oficial en PDF
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: EDUNOVA AI */}
          {activeTab === 'ai' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div className="glass-panel p-8 rounded-[32px] bg-gradient-to-br from-white/90 via-[#FCE4F2]/50 to-[#EDE7FA]/70 space-y-4 border-2 border-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F7B8DC] to-[#C8B5F5] flex items-center justify-center p-3 shadow-md">
                    <Sparkles size={24} className="text-white animate-spin-slow" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-edunova-textPrimary">EDUNOVA AI · Tutor Inteligente</h2>
                    <p className="text-xs text-edunova-violet font-semibold">Asistente pedagógico para acompañamiento y recomendaciones adaptativas</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-edunova-textSecondary max-w-2xl leading-relaxed">
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
