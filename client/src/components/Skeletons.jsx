import React from 'react';

/**
 * Skeletons con diseño Factory
 * Fondo Carbon (#1d1a18) y bordes Ash Stroke (#3d3a39) con animación sutil.
 */

export function BannerSkeleton() {
  return (
    <div className="relative rounded-[10px] bg-[#1d1a18] border border-[#3d3a39] p-8 animate-pulse">
      <div className="space-y-4 max-w-xl">
        <div className="h-4 w-28 bg-[#3d3a39] rounded-[3px]"></div>
        <div className="h-8 w-3/4 bg-[#4d4947] rounded-[3px]"></div>
        <div className="h-3 w-full bg-[#3d3a39] rounded-[3px]"></div>
        <div className="flex gap-3 pt-3">
          <div className="h-9 w-32 bg-[#eeeeee]/20 rounded-[3px]"></div>
          <div className="h-9 w-40 bg-[#3d3a39] rounded-[3px]"></div>
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-[10px] bg-[#101010] border border-[#3d3a39] p-5 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 w-28 bg-[#3d3a39] rounded-[3px]"></div>
        <div className="w-6 h-6 bg-[#3d3a39] rounded-[3px]"></div>
      </div>
      <div className="space-y-2">
        <div className="h-8 w-20 bg-[#4d4947] rounded-[3px]"></div>
        <div className="h-3 w-32 bg-[#3d3a39] rounded-[3px]"></div>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-[10px] bg-[#101010] border border-[#3d3a39] p-6 space-y-6 animate-pulse">
      <div className="flex justify-between items-center pb-4 border-b border-[#3d3a39]">
        <div className="h-4 w-40 bg-[#4d4947] rounded-[3px]"></div>
        <div className="h-6 w-24 bg-[#3d3a39] rounded-[3px]"></div>
      </div>
      <div className="flex justify-center py-6">
        <div className="w-32 h-32 rounded-full border-4 border-[#3d3a39] border-t-[#a0ca92] animate-spin"></div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 3 }) {
  return (
    <div className="rounded-[10px] bg-[#101010] border border-[#3d3a39] p-6 space-y-4 animate-pulse">
      <div className="flex justify-between items-center pb-4 border-b border-[#3d3a39]">
        <div className="h-4 w-44 bg-[#4d4947] rounded-[3px]"></div>
        <div className="h-8 w-48 bg-[#3d3a39] rounded-[3px]"></div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-12 bg-[#1d1a18] border border-[#3d3a39] rounded-[3px] flex items-center justify-between px-4">
            <div className="h-3 w-36 bg-[#3d3a39] rounded-[3px]"></div>
            <div className="h-3 w-24 bg-[#3d3a39] rounded-[3px]"></div>
            <div className="h-3 w-16 bg-[#3d3a39] rounded-[3px]"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
