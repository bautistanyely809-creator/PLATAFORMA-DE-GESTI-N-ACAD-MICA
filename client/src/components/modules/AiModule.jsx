import React, { useState } from 'react';
import { api } from '../../services/api';
import { 
  Sparkles, 
  Send, 
  Terminal, 
  Brain, 
  RefreshCw, 
  Database, 
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function AiModule({ user }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([
    {
      tipo: 'sistema',
      texto: `Consola de Inteligencia Artificial EDUNOVA AI conectada a MySQL 8.\nUsuario: ${user?.nombre || 'Usuario'} (Rol: ${user?.rol || 'APRENDIZ'}).\nPregúntame sobre tus competencias, evidencias sin entregar, notas o asistencia real.`
    }
  ]);

  const consultasRapidas = user?.rol === 'INSTRUCTOR' ? [
    "¿Qué aprendices necesitan seguimiento en mi ficha?",
    "¿Qué competencias presentan más dificultades?",
    "Genera un resumen del rendimiento académico de mi grupo."
  ] : user?.rol === 'ADMIN' ? [
    "¿Cuáles son los indicadores de aprobación institucional?",
    "¿Cuál es el estado general de los procesos formativos?",
    "Genera un resumen directivo de usuarios y fichas activas."
  ] : [
    "¿Cuáles son mis competencias pendientes?",
    "¿Qué evidencias tengo sin entregar?",
    "¿Cuál es mi porcentaje de asistencia acumulado?",
    "¿Cómo ha sido mi rendimiento este periodo?"
  ];

  const handleConsultar = async (preguntaTexto) => {
    const q = preguntaTexto || prompt;
    if (!q.trim() || loading) return;

    setLoading(true);
    setHistory(prev => [...prev, { tipo: 'usuario', texto: q }]);
    setPrompt('');

    try {
      const res = await api.ai.consultar({
        pregunta: q,
        id_usuario: user?.id_usuario || 4,
        rol: user?.rol || 'APRENDIZ',
        nombre: user?.nombre || 'Anyely Valeria'
      });

      setHistory(prev => [...prev, {
        tipo: 'ia',
        texto: res.respuesta,
        fuente: res.fuente,
        timestamp: res.timestamp
      }]);
    } catch (err) {
      setHistory(prev => [...prev, {
        tipo: 'error',
        texto: `Error al consultar EDUNOVA AI: ${err.message}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn font-sans">
      
      {/* Header Módulo 7 */}
      <div className="bg-[#1d1a18] p-6 rounded-[10px] border border-[#3d3a39] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-[#101010] text-[#fafafa] font-mono text-[10px] uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ee6018] animate-pulse"></span>
            <span>MÓDULO 07 // EDUNOVA AI CON DATOS ACADÉMICOS REALES</span>
          </div>
          <h2 className="text-xl font-normal text-[#eeeeee] tracking-tight">
            Asistente Pedagógico Contextual de Alto Rendimiento
          </h2>
          <p className="text-xs text-[#8c8682] mt-0.5">
            Consultas inteligentes contextualizadas mediante conexión directa a la base de datos MySQL 8
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#a0ca92] bg-[#101010] border border-[#a0ca92]/40 px-3 py-1.5 rounded-[3px]">
          <Database size={13} />
          <span>MYSQL 8 // CONNECTED</span>
        </div>
      </div>

      {/* Consultas Rápidas Sugeridas */}
      <div className="bg-[#1d1a18] p-4 rounded-[10px] border border-[#3d3a39] space-y-2">
        <span className="text-[10px] font-mono text-[#8c8682] uppercase tracking-wider block">
          Consultas Académicas Rápidas para tu Rol ({user?.rol}):
        </span>
        <div className="flex flex-wrap gap-2">
          {consultasRapidas.map((cq, idx) => (
            <button
              key={idx}
              onClick={() => handleConsultar(cq)}
              className="px-3 py-1.5 bg-[#101010] hover:bg-[#252220] text-[#eeeeee] border border-[#3d3a39] hover:border-[#ee6018] rounded-[3px] font-mono text-xs text-left transition-colors flex items-center gap-1.5"
            >
              <Sparkles size={11} className="text-[#ee6018]" />
              <span>{cq}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Ventana de Consola / Terminal de Chat */}
      <div className="bg-[#101010] border border-[#3d3a39] rounded-[10px] overflow-hidden flex flex-col h-[520px]">
        
        {/* Cabecera de la Terminal */}
        <div className="px-4 py-3 bg-[#1d1a18] border-b border-[#3d3a39] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-[#fafafa]">
            <Terminal size={14} className="text-[#ee6018]" />
            <span>EDUNOVA AI CONSOLE // CONTEXTUAL REASONING ENGINE</span>
          </div>
          <span className="text-[#8c8682] text-[10px]">TIEMPO REAL · RESTRICCIÓN RBAC</span>
        </div>

        {/* Historial de Mensajes */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-xs">
          {history.map((m, idx) => (
            <div 
              key={idx} 
              className={`p-3.5 rounded-[6px] max-w-3xl leading-relaxed whitespace-pre-wrap ${
                m.tipo === 'usuario' 
                  ? 'bg-[#1d1a18] border border-[#3d3a39] text-[#fafafa] ml-auto' :
                m.tipo === 'error'
                  ? 'bg-[#e05252]/10 border border-[#e05252]/40 text-[#e05252]' :
                m.tipo === 'sistema'
                  ? 'bg-[#1d1a18]/40 border border-[#3d3a39]/40 text-[#8c8682] text-[11px]' :
                  'bg-[#1d1a18] border border-[#3d3a39] text-[#eeeeee]'
              }`}
            >
              {m.tipo === 'ia' && (
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#3d3a39] text-[10px] text-[#8c8682]">
                  <span className="flex items-center gap-1 text-[#ee6018]">
                    <Brain size={12} />
                    <span>EDUNOVA AI</span>
                  </span>
                  <span>{m.fuente}</span>
                </div>
              )}
              {m.texto}
            </div>
          ))}

          {loading && (
            <div className="p-3 bg-[#1d1a18] border border-[#3d3a39] rounded-[4px] max-w-md font-mono text-xs text-[#8c8682] flex items-center gap-2">
              <RefreshCw size={13} className="animate-spin text-[#ee6018]" />
              <span>Consultando registros oficiales en la base de datos MySQL 8...</span>
            </div>
          )}
        </div>

        {/* Barra de Entrada / Despacho */}
        <div className="p-3 bg-[#1d1a18] border-t border-[#3d3a39]">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleConsultar(); }} 
            className="flex gap-2 font-mono text-xs"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Haz una consulta contextual sobre notas, competencias, evidencias o asistencia..."
              className="flex-1 bg-[#101010] border border-[#3d3a39] rounded-[3px] px-3.5 py-2.5 text-[#eeeeee] focus:outline-none focus:border-[#ee6018]"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-5 py-2.5 bg-[#fafafa] hover:bg-white text-[#101010] font-medium rounded-[3px] disabled:opacity-40 transition-colors flex items-center gap-2 shrink-0"
            >
              <Send size={13} className="text-[#ee6018]" />
              <span>Enviar</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
