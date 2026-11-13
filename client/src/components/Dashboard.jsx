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
  Search, 
  Filter, 
  Plus, 
  Brain, 
  ShieldCheck 
} from 'lucide-react';

export default function Dashboard({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Usuario activo en sesión
  const user = currentUser || {
    nombre: 'Anyely Valeria',
    apellido: 'Bautista',
    rol: 'APRENDIZ',
    correo: 'anyely.valeria@edunova.edu.co'
  };

  return (
    <div className="flex h-screen bg-edunova-canvas font-sans text-edunova-textPrimary overflow-hidden">
      
      {/* ============================================================ */}
      {/* 1. SIDEBAR REDISEÑADO CON ESTÉTICA SAAS & COLAPSABLE         */}
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
      {/* 2. ÁREA PRINCIPAL CON HEADER SUPERIOR & CONTENIDO            */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col overflow-y-auto min-w-0">
        
        {/* Header Superior Moderno */}
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
              // Rediseño SaaS completo del Dashboard del Aprendiz
              <ApprenticeDashboard user={user} onNavigate={setActiveTab} />
            ) : (
              // Vista Administrativa / Instructor moderna
              <div className="space-y-8 max-w-7xl mx-auto animate-fadeIn">
                
                {/* Banner de Bienvenida Admin/Instructor */}
                <div className="bg-gradient-to-r from-edunova-midnight via-edunova-darkNavy to-edunova-electric p-7 rounded-3xl text-white shadow-saas-card border border-white/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-edunova-gold text-xs font-bold uppercase tracking-wider mb-2">
                      <ShieldCheck size={14} />
                      <span>Panel Central · {user.rol === 'ADMIN' ? 'Dirección Académica' : 'Docente Titular'}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                      ¡Bienvenido, {user.nombre}!
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-200 mt-1">
                      {user.rol === 'ADMIN' 
                        ? 'Gestión centralizada de aprendices, instructores, programas de formación y métricas de desempeño institucional.'
                        : 'Administra tus fichas activas, registra calificaciones y realiza seguimiento a la asistencia de tus aprendices.'}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center gap-3 shrink-0">
                    <button 
                      onClick={() => setActiveTab('reportes')}
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2"
                    >
                      <BarChart3 size={16} className="text-edunova-gold" />
                      <span>Ver Reportes</span>
                    </button>
                    {user.rol === 'ADMIN' && (
                      <button 
                        onClick={() => alert('Formulario de nueva matrícula')}
                        className="px-4 py-2.5 bg-gradient-to-r from-edunova-gold to-edunova-goldLight text-slate-950 rounded-xl text-xs sm:text-sm font-extrabold shadow-gold-glow transition-all flex items-center gap-2"
                      >
                        <Plus size={16} />
                        <span>Nueva Matrícula</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 4 Cards de Métricas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-saas-card hover:-translate-y-1 hover:shadow-saas-hover transition-all">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Aprendices Totales</p>
                    <h3 className="text-3xl font-extrabold text-edunova-textPrimary mt-3">250</h3>
                    <p className="text-xs text-edunova-teal font-bold mt-1">↑ +12 este periodo</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-saas-card hover:-translate-y-1 hover:shadow-saas-hover transition-all">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cursos Activos</p>
                    <h3 className="text-3xl font-extrabold text-edunova-textPrimary mt-3">12</h3>
                    <p className="text-xs text-edunova-electric font-bold mt-1">Fichas en ejecución</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-saas-card hover:-translate-y-1 hover:shadow-saas-hover transition-all">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Instructores</p>
                    <h3 className="text-3xl font-extrabold text-edunova-textPrimary mt-3">18</h3>
                    <p className="text-xs text-slate-600 font-bold mt-1">100% asignados</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-saas-card hover:-translate-y-1 hover:shadow-saas-hover transition-all">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Asistencia Promedio</p>
                    <h3 className="text-3xl font-extrabold text-edunova-textPrimary mt-3">85%</h3>
                    <p className="text-xs text-edunova-success font-bold mt-1">↑ +3.2% vs mes anterior</p>
                  </div>
                </div>

              </div>
            )
          )}

          {/* TAB 2: CURSOS */}
          {activeTab === 'cursos' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-edunova-textPrimary">
                    {user.rol === 'APRENDIZ' ? 'Mis Cursos de Formación' : 'Gestión de Cursos y Fichas'}
                  </h2>
                  <p className="text-xs text-edunova-textSecondary mt-0.5">
                    Programa: Tecnólogo en Análisis y Desarrollo de Software (ADSO) · Ficha 2874102
                  </p>
                </div>
              </div>

              {/* Contenedor de Cursos en Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-saas-card space-y-4 hover:shadow-saas-hover transition-all">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-edunova-electric border border-blue-200">
                      Ficha ADSO-2026-A
                    </span>
                    <span className="text-xs font-extrabold text-edunova-success">Activo</span>
                  </div>
                  <h3 className="text-lg font-bold text-edunova-textPrimary">
                    Desarrollo Web Frontend Moderno (React & Tailwind)
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Construcción de interfaces de usuario interactivas, consumo de APIs RESTful y maquetación SaaS.
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-slate-600">Instructor: <strong>Carlos Mendoza</strong></span>
                    <span className="font-bold text-edunova-electric">Nota: 4.8 / 5.0 (A)</span>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-saas-card space-y-4 hover:shadow-saas-hover transition-all">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-edunova-violet border border-purple-200">
                      Ficha ADSO-2026-B
                    </span>
                    <span className="text-xs font-extrabold text-edunova-success">Activo</span>
                  </div>
                  <h3 className="text-lg font-bold text-edunova-textPrimary">
                    Arquitectura Backend y APIs RESTful (Node & Express)
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Desarrollo de servicios backend, seguridad JWT, bases de datos relacionales MySQL y Prisma ORM.
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-slate-600">Instructora: <strong>Laura Gómez</strong></span>
                    <span className="font-bold text-edunova-electric">Nota: 4.5 / 5.0 (A)</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: CALIFICACIONES */}
          {activeTab === 'calificaciones' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-edunova-textPrimary">
                  {user.rol === 'APRENDIZ' ? 'Mis Calificaciones y Evidencias' : 'Registro de Calificaciones'}
                </h2>
                <p className="text-xs text-edunova-textSecondary mt-0.5">
                  Escala de evaluación SENA: Aprobado (A) / Deficiente (D) con retroalimentación pedagógica
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-saas-card overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
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
                    <tr className="hover:bg-slate-50/80">
                      <td className="px-6 py-4 font-bold text-edunova-textPrimary">
                        Prototipo UI en Figma (Dashboard)
                      </td>
                      <td className="px-6 py-4 text-xs">Frontend React & Tailwind</td>
                      <td className="px-6 py-4 text-xs font-mono">30%</td>
                      <td className="px-6 py-4 font-extrabold text-edunova-success">4.8 / 5.0</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          Aprobado (A)
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        Excelente trabajo en paleta institucional y usabilidad.
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/80">
                      <td className="px-6 py-4 font-bold text-edunova-textPrimary">
                        Modelo de Datos y Script MySQL
                      </td>
                      <td className="px-6 py-4 text-xs">Backend Node & Express</td>
                      <td className="px-6 py-4 text-xs font-mono">35%</td>
                      <td className="px-6 py-4 font-extrabold text-edunova-success">4.7 / 5.0</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          Aprobado (A)
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        Normalización en 3FN impecable con claves foráneas.
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/80">
                      <td className="px-6 py-4 font-bold text-edunova-textPrimary">
                        Consumo REST con Axios & JWT
                      </td>
                      <td className="px-6 py-4 text-xs">Frontend React & Tailwind</td>
                      <td className="px-6 py-4 text-xs font-mono">35%</td>
                      <td className="px-6 py-4 font-bold text-slate-400">Pendiente</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          Por Entregar
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
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
              <div>
                <h2 className="text-2xl font-bold text-edunova-textPrimary">Control y Registro de Asistencia</h2>
                <p className="text-xs text-edunova-textSecondary mt-0.5">
                  Seguimiento de sesiones formativas del Centro de Formación Industrial SENA
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-saas-card text-center">
                  <p className="text-xs font-bold text-slate-500 uppercase">Tasa de Asistencia</p>
                  <h3 className="text-4xl font-extrabold text-edunova-success mt-2">92%</h3>
                  <p className="text-xs text-slate-400 mt-1">23 asistencias registradas</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-saas-card text-center">
                  <p className="text-xs font-bold text-slate-500 uppercase">Tardanzas Justificadas</p>
                  <h3 className="text-4xl font-extrabold text-edunova-gold mt-2">1</h3>
                  <p className="text-xs text-slate-400 mt-1">Soporte radicado</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-saas-card text-center">
                  <p className="text-xs font-bold text-slate-500 uppercase">Ausencias Injustificadas</p>
                  <h3 className="text-4xl font-extrabold text-slate-400 mt-2">0</h3>
                  <p className="text-xs text-edunova-success mt-1">Sin novedades críticas</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: REPORTES */}
          {activeTab === 'reportes' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-edunova-textPrimary">Reportes & Analítica Formativa</h2>
                <p className="text-xs text-edunova-textSecondary mt-0.5">
                  Consolidados estadísticos de competencias, avance de fichas y desempeño institucional
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-saas-card text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-edunova-electric flex items-center justify-center mx-auto">
                  <BarChart3 size={28} />
                </div>
                <h3 className="text-lg font-bold text-edunova-textPrimary">Informe Académico Oficial Generado</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  El informe consolidado incluye la ponderación de evidencias, asistencia por sesión y diagnóstico preventivo con IA.
                </p>
                <button 
                  onClick={() => alert('Descargando reporte oficial EDUNOVA (PDF/Excel)...')}
                  className="px-5 py-2.5 bg-edunova-electric hover:bg-blue-600 text-white font-bold rounded-xl text-xs shadow-electric-glow transition-all inline-flex items-center gap-2"
                >
                  Descargar Informe en PDF
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: EDUNOVA AI */}
          {activeTab === 'ai' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div className="bg-gradient-to-br from-edunova-midnight via-edunova-darkNavy to-[#1a1238] p-8 rounded-3xl text-white shadow-ai-glow border border-edunova-violet/40 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-edunova-violet to-edunova-electric flex items-center justify-center p-3 shadow-lg">
                    <Sparkles size={24} className="text-white animate-spin-slow" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">EDUNOVA AI · Módulo Inteligente</h2>
                    <p className="text-xs text-edunova-goldLight">Asistente pedagógico para seguimiento académico y recomendaciones adaptativas</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Utiliza modelos de lenguaje e inteligencia artificial para analizar el desempeño de evidencias, predecir posibles dificultades en asignaturas técnicas y orientar el plan de estudio personalizado.
                </p>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
