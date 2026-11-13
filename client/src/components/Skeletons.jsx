import React from 'react';

/**
 * Componentes Skeleton con animación de onda (Shimmer)
 * Brindan una experiencia visual fluida durante la carga de datos sin pantallas en blanco.
 */

export function BannerSkeleton() {
  return (
    <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-r from-[#123B50]/60 via-[#17365D]/50 to-[#19B5A5]/40 p-8 sm:p-10 animate-pulse border border-white/20">
      <div className="space-y-4 max-w-xl">
        <div className="h-6 w-36 bg-white/20 rounded-full"></div>
        <div className="h-10 w-3/4 bg-white/30 rounded-2xl"></div>
        <div className="h-4 w-full bg-white/20 rounded-xl"></div>
        <div className="h-4 w-2/3 bg-white/20 rounded-xl"></div>
        <div className="flex gap-3 pt-3">
          <div className="h-10 w-36 bg-white/30 rounded-2xl"></div>
          <div className="h-10 w-44 bg-white/20 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass-card rounded-[26px] p-6 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 w-28 bg-slate-200 rounded-full"></div>
        <div className="w-12 h-12 bg-slate-200/80 rounded-2xl"></div>
      </div>
      <div className="space-y-2">
        <div className="h-8 w-20 bg-slate-300 rounded-xl"></div>
        <div className="h-3 w-32 bg-slate-200 rounded-full"></div>
      </div>
      <div className="h-2 w-full bg-slate-200 rounded-full mt-2"></div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass-panel rounded-[30px] p-7 space-y-6 animate-pulse">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div className="space-y-2">
          <div className="h-5 w-48 bg-slate-200 rounded-xl"></div>
          <div className="h-3 w-64 bg-slate-100 rounded-full"></div>
        </div>
        <div className="h-8 w-32 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        <div className="sm:col-span-5 flex justify-center">
          <div className="w-36 h-36 rounded-full border-8 border-slate-200 flex items-center justify-center">
            <div className="w-16 h-8 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
        <div className="sm:col-span-7 space-y-3">
          <div className="h-14 bg-slate-100 rounded-2xl"></div>
          <div className="h-14 bg-slate-100 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 3 }) {
  return (
    <div className="glass-panel rounded-[30px] overflow-hidden p-6 space-y-4 animate-pulse">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div className="h-6 w-48 bg-slate-200 rounded-xl"></div>
        <div className="h-9 w-64 bg-slate-100 rounded-full"></div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-12 bg-slate-100/80 rounded-2xl flex items-center justify-between px-4">
            <div className="h-4 w-40 bg-slate-200 rounded"></div>
            <div className="h-4 w-24 bg-slate-200 rounded"></div>
            <div className="h-4 w-20 bg-slate-200 rounded"></div>
            <div className="h-4 w-16 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
