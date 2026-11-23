import React, { useState } from 'react';
import { api } from '../services/api';
import { User, Phone, Mail, Shield, FileText, CheckCircle2, AlertTriangle, X, Lock } from 'lucide-react';

export default function PerfilModal({ user, onClose, onUserUpdated }) {
  const [telefono, setTelefono] = useState(user?.telefono || '');
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [apellido, setApellido] = useState(user?.apellido || '');
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError('');
    setMensajeExito('');
    setGuardando(true);

    try {
      const res = await api.auth.actualizarPerfil({
        telefono: telefono.trim(),
        nombre: nombre.trim(),
        apellido: apellido.trim()
      });

      setMensajeExito(res.message || 'Perfil actualizado exitosamente.');
      
      const updated = {
        ...user,
        telefono: telefono.trim(),
        nombre: nombre.trim(),
        apellido: apellido.trim()
      };
      localStorage.setItem('edunova_current_user', JSON.stringify(updated));
      
      if (onUserUpdated) onUserUpdated(updated);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setMensajeError(err.message || 'Error al actualizar el perfil.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1d1a18] border border-[#3d3a39] rounded-[10px] max-w-md w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#3d3a39]">
          <div className="flex items-center gap-2">
            <User size={16} className="text-[#a0ca92]" />
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#eeeeee]">
              Perfil de Usuario (HU-04)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8a8380] hover:text-[#eeeeee] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Campos Inmutables Protegidos (Regla de Seguridad HU-04) */}
          <div className="p-3 bg-[#101010] border border-[#3d3a39] rounded-[4px] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[10px] uppercase text-[#8a8380] flex items-center gap-1">
                <Lock size={10} className="text-[#ee6018]" />
                Rol Institucional (Protegido)
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-[2px] bg-[#ee6018]/10 text-[#ee6018] border border-[#ee6018]/30">
                {user?.rol}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[10px] uppercase text-[#8a8380] flex items-center gap-1">
                <Lock size={10} className="text-[#ee6018]" />
                Correo Institucional (Inmutable)
              </span>
              <span className="font-mono text-xs text-[#eeeeee]">{user?.correo}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[10px] uppercase text-[#8a8380] flex items-center gap-1">
                <Lock size={10} className="text-[#ee6018]" />
                Documento de Identidad (Fijo)
              </span>
              <span className="font-mono text-xs text-[#eeeeee]">{user?.documento || '1075000000'}</span>
            </div>
          </div>

          {/* Campos Editables */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none focus:border-[#eeeeee]"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">Apellido</label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none focus:border-[#eeeeee]"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] text-[#8a8380] uppercase mb-1">
              Teléfono de Contacto (Permitido)
            </label>
            <div className="relative">
              <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8380]" />
              <input
                type="text"
                placeholder="Ej. +57 310 1234567"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#101010] border border-[#3d3a39] rounded-[3px] text-xs text-[#eeeeee] focus:outline-none focus:border-[#eeeeee]"
              />
            </div>
          </div>

          {mensajeError && (
            <div className="p-2 bg-[#ee6018]/10 border border-[#ee6018]/30 text-[#ee6018] rounded-[2px] text-xs font-mono flex items-center gap-1.5">
              <AlertTriangle size={13} />
              <span>{mensajeError}</span>
            </div>
          )}

          {mensajeExito && (
            <div className="p-2 bg-[#a0ca92]/10 border border-[#a0ca92]/30 text-[#a0ca92] rounded-[2px] text-xs font-mono flex items-center gap-1.5">
              <CheckCircle2 size={13} />
              <span>{mensajeExito}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-[#3d3a39]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-[3px] border border-[#3d3a39] text-[#8a8380] hover:text-[#eeeeee] text-xs font-mono"
            >
              Cerrar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="px-4 py-1.5 bg-[#eeeeee] hover:bg-white text-[#101010] rounded-[3px] text-xs font-mono font-medium disabled:opacity-50"
            >
              {guardando ? 'Guardando...' : 'Actualizar Perfil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
