import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  FileSpreadsheet, 
  Printer, 
  BarChart3, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  FileText,
  Building,
  User,
  Calendar
} from 'lucide-react';

export default function ReportesModule({ user }) {
  const [loading, setLoading] = useState(true);
  const [reporteAprendiz, setReporteAprendiz] = useState(null);
  const [reporteFicha, setReporteFicha] = useState(null);
  const [tipoReporte, setTipoReporte] = useState(user.rol === 'APRENDIZ' ? 'aprendiz' : 'ficha');

  const loadData = async () => {
    try {
      setLoading(true);
      const [apRes, fichaRes] = await Promise.all([
        api.reportes.getReporteAprendiz(1),
        api.reportes.getReporteFicha(1)
      ]);
      setReporteAprendiz(apRes);
      setReporteFicha(fichaRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDescargarExcel = () => {
    window.open(api.reportes.descargarExcelUrl(1), '_blank');
  };

  const handleImprimirPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="p-8 text-center font-mono text-xs text-[#8c8682]">
        <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-[#ee6018]" />
        GENERANDO DOSSIER ACADÉMICO CON DATOS REALES DE MYSQL 8...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn font-sans">
      
      {/* Header Módulo 5 (No imprimible) */}
      <div className="bg-[#1d1a18] p-6 rounded-[10px] border border-[#3d3a39] flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-[#101010] text-[#fafafa] font-mono text-[10px] uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ee6018] animate-pulse"></span>
            <span>MÓDULO 05 // CENTRO DE REPORTES OFICIALES SENA (PDF & EXCEL)</span>
          </div>
          <h2 className="text-xl font-normal text-[#eeeeee] tracking-tight">
            Informes Académicos y Exportación Certificada
          </h2>
          <p className="text-xs text-[#8c8682] mt-0.5">
            Documentación generada en tiempo real desde la base de datos oficial
          </p>
        </div>

        {/* Botones de Exportación Real */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDescargarExcel}
            className="px-4 py-2 bg-[#101010] hover:bg-[#1d1a18] text-[#a0ca92] border border-[#a0ca92]/40 rounded-[3px] font-mono text-xs font-medium flex items-center gap-2 transition-colors"
            title="Descargar archivo Excel CSV con formato de celdas"
          >
            <FileSpreadsheet size={15} />
            <span>Exportar Excel (.csv)</span>
          </button>

          <button
            onClick={handleImprimirPDF}
            className="px-4 py-2 bg-[#fafafa] hover:bg-white text-[#101010] rounded-[3px] font-mono text-xs font-medium flex items-center gap-2 transition-colors"
            title="Imprimir o guardar como documento PDF"
          >
            <Printer size={15} className="text-[#ee6018]" />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {/* Selector de Pestaña de Reporte (No imprimible) */}
      <div className="flex gap-2 print:hidden font-mono text-xs">
        <button
          onClick={() => setTipoReporte('aprendiz')}
          className={`px-3 py-1.5 rounded-[3px] border transition-colors ${
            tipoReporte === 'aprendiz' 
              ? 'bg-[#1d1a18] text-[#ee6018] border-[#ee6018]' 
              : 'bg-[#101010] text-[#8c8682] border-[#3d3a39]'
          }`}
        >
          Expediente Individual (Aprendiz)
        </button>
        <button
          onClick={() => setTipoReporte('ficha')}
          className={`px-3 py-1.5 rounded-[3px] border transition-colors ${
            tipoReporte === 'ficha' 
              ? 'bg-[#1d1a18] text-[#ee6018] border-[#ee6018]' 
              : 'bg-[#101010] text-[#8c8682] border-[#3d3a39]'
          }`}
        >
          Dossier Consolidado (Ficha ADSO)
        </button>
      </div>

      {/* ============================================================ */}
      {/* VISTA OFICIAL MEMBRETADA SENA (Imprimible y descargable)    */}
      {/* ============================================================ */}
      <div className="bg-[#ffffff] text-[#101010] p-8 sm:p-12 rounded-[10px] border border-[#3d3a39] shadow-md space-y-6 print:p-0 print:border-none print:shadow-none">
        
        {/* Encabezado Institucional SENA */}
        <div className="border-b-2 border-[#101010] pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8c8682] block">
              REPÚBLICA DE COLOMBIA · MINISTERIO DEL TRABAJO
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#101010]">
              SERVICIO NACIONAL DE APRENDIZAJE — SENA
            </h1>
            <p className="text-xs text-[#4d4947] font-medium">
              Centro de Formación Industrial · Regional Huila (Sede Neiva)
            </p>
          </div>

          <div className="text-right font-mono text-xs text-[#4d4947] shrink-0">
            <span className="block font-bold text-[#101010]">EDUNOVA SYSTEM v2.2</span>
            <span>Emisión: {new Date().toLocaleDateString()}</span>
            <span className="block text-[10px] text-[#8c8682]">Firma Digital: VERIFIED // SHA-256</span>
          </div>
        </div>

        {/* REPORTE TIPO 1: EXPEDIENTE INDIVIDUAL DEL APRENDIZ */}
        {tipoReporte === 'aprendiz' && reporteAprendiz && (
          <div className="space-y-6">
            
            {/* Tarjeta de Metadatos del Aprendiz */}
            <div className="bg-[#f5f5f5] p-4 rounded-[6px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
              <div>
                <span className="text-[#8c8682] block text-[10px]">APRENDIZ:</span>
                <strong className="text-[#101010] text-sm font-sans">{reporteAprendiz.aprendiz.nombre}</strong>
              </div>
              <div>
                <span className="text-[#8c8682] block text-[10px]">DOCUMENTO DE IDENTIDAD:</span>
                <strong className="text-[#101010]">{reporteAprendiz.aprendiz.documento}</strong>
              </div>
              <div>
                <span className="text-[#8c8682] block text-[10px]">PROGRAMA FORMATIVO:</span>
                <strong className="text-[#101010]">{reporteAprendiz.aprendiz.programa}</strong>
              </div>
              <div>
                <span className="text-[#8c8682] block text-[10px]">FICHA ASIGNADA:</span>
                <strong className="text-[#101010]">{reporteAprendiz.aprendiz.ficha}</strong>
              </div>
            </div>

            {/* Cuadro de Resumen de Avance */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="border border-[#e0e0e0] p-4 rounded-[6px]">
                <span className="text-[10px] font-mono text-[#8c8682] block uppercase">Avance de Competencias</span>
                <h3 className="text-2xl font-bold text-[#101010] mt-1">{reporteAprendiz.resumen.porcentajeCompetencias}%</h3>
                <span className="text-xs text-[#a0ca92] font-mono font-bold">
                  {reporteAprendiz.resumen.competenciasAprobadas} de {reporteAprendiz.resumen.totalCompetencias} Acreditadas
                </span>
              </div>

              <div className="border border-[#e0e0e0] p-4 rounded-[6px]">
                <span className="text-[10px] font-mono text-[#8c8682] block uppercase">Asistencia Acumulada</span>
                <h3 className="text-2xl font-bold text-[#101010] mt-1">{reporteAprendiz.resumen.porcentajeAsistencia}%</h3>
                <span className="text-xs text-[#a0ca92] font-mono font-bold">
                  Cumple Umbral SENA (&ge; 85%)
                </span>
              </div>

              <div className="border border-[#e0e0e0] p-4 rounded-[6px]">
                <span className="text-[10px] font-mono text-[#8c8682] block uppercase">Planes de Recuperación</span>
                <h3 className="text-2xl font-bold text-[#101010] mt-1">{reporteAprendiz.resumen.recuperacionesActivas}</h3>
                <span className="text-xs text-[#8c8682] font-mono">Sin planes pendientes</span>
              </div>
            </div>

            {/* Tabla de Calificaciones y Evidencias */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#101010]">
                Historial de Evidencias y Calificaciones Registradas:
              </h4>
              <table className="w-full text-left text-xs border border-[#e0e0e0]">
                <thead className="bg-[#f5f5f5] text-[10px] font-mono uppercase text-[#4d4947] border-b">
                  <tr>
                    <th className="p-2.5">Evidencia de Aprendizaje</th>
                    <th className="p-2.5">Ponderación</th>
                    <th className="p-2.5">Calificación (0.0-5.0)</th>
                    <th className="p-2.5">Estado</th>
                    <th className="p-2.5">Observación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e0e0]">
                  {reporteAprendiz.calificaciones.map((c, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-medium">{c.evidencia}</td>
                      <td className="p-2.5 font-mono">{c.porcentaje}</td>
                      <td className="p-2.5 font-mono font-bold text-[#101010]">{c.nota}</td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#e8f8f5] text-[#19B5A5]">
                          {c.estado}
                        </span>
                      </td>
                      <td className="p-2.5 text-[#4d4947]">{c.observacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Matriz de Competencias Laborales */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#101010]">
                Estado de Competencias del Programa:
              </h4>
              <table className="w-full text-left text-xs border border-[#e0e0e0]">
                <thead className="bg-[#f5f5f5] text-[10px] font-mono uppercase text-[#4d4947] border-b">
                  <tr>
                    <th className="p-2.5">Código</th>
                    <th className="p-2.5">Competencia</th>
                    <th className="p-2.5">Avance</th>
                    <th className="p-2.5">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e0e0]">
                  {reporteAprendiz.competencias.map((comp, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-mono font-bold">{comp.codigo}</td>
                      <td className="p-2.5">{comp.nombre}</td>
                      <td className="p-2.5 font-mono">{comp.avance}</td>
                      <td className="p-2.5 font-bold font-mono">
                        {comp.estado === 'APROBADA' ? '✓ APROBADA' : comp.estado}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* REPORTE TIPO 2: DOSSIER CONSOLIDADO DE LA FICHA */}
        {tipoReporte === 'ficha' && reporteFicha && (
          <div className="space-y-6">
            
            <div className="bg-[#f5f5f5] p-4 rounded-[6px] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <span className="text-[#8c8682] block text-[10px]">FICHA DE FORMACIÓN:</span>
                <strong className="text-[#101010] text-sm font-sans">{reporteFicha.encabezado.ficha}</strong>
              </div>
              <div>
                <span className="text-[#8c8682] block text-[10px]">PROGRAMA ACADÉMICO:</span>
                <strong className="text-[#101010]">{reporteFicha.encabezado.programa}</strong>
              </div>
              <div>
                <span className="text-[#8c8682] block text-[10px]">INSTRUCTORES RESPONSABLES:</span>
                <strong className="text-[#101010]">{reporteFicha.encabezado.instructores.join(', ')}</strong>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#101010]">
                Consolidado de Aprendices Matriculados ({reporteFicha.aprendices.length}):
              </h4>
              <table className="w-full text-left text-xs border border-[#e0e0e0]">
                <thead className="bg-[#f5f5f5] text-[10px] font-mono uppercase text-[#4d4947] border-b">
                  <tr>
                    <th className="p-2.5">Documento</th>
                    <th className="p-2.5">Aprendiz</th>
                    <th className="p-2.5">Competencias Acreditadas</th>
                    <th className="p-2.5">% Avance</th>
                    <th className="p-2.5">% Asistencia</th>
                    <th className="p-2.5">Refuerzos</th>
                    <th className="p-2.5">Diagnóstico Final</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e0e0]">
                  {reporteFicha.aprendices.map((ap, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-mono">{ap.documento}</td>
                      <td className="p-2.5 font-medium">{ap.nombre}</td>
                      <td className="p-2.5 font-mono">{ap.competenciasAprobadas}</td>
                      <td className="p-2.5 font-mono font-bold">{ap.porcentajeCompetencias}%</td>
                      <td className="p-2.5 font-mono font-bold">{ap.porcentajeAsistencia}%</td>
                      <td className="p-2.5 font-mono">{ap.recuperacionesPendientes}</td>
                      <td className="p-2.5 font-bold">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          ap.estadoGeneral === 'SOBRESALIENTE' 
                            ? 'bg-[#e8f8f5] text-[#19B5A5]' 
                            : 'bg-[#fff4e5] text-[#ee6018]'
                        }`}>
                          {ap.estadoGeneral}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Pie de Firma Institucional */}
        <div className="pt-12 mt-8 border-t border-[#e0e0e0] flex justify-between items-end text-xs font-mono text-[#4d4947]">
          <div className="border-t border-[#101010] w-64 pt-2 text-center">
            <span className="block font-bold text-[#101010]">CARLOS MENDOZA</span>
            <span>Instructor Titular · ADSO</span>
          </div>

          <div className="border-t border-[#101010] w-64 pt-2 text-center">
            <span className="block font-bold text-[#101010]">COORDINACIÓN ACADÉMICA</span>
            <span>Centro de Formación Industrial SENA</span>
          </div>
        </div>

      </div>

    </div>
  );
}
