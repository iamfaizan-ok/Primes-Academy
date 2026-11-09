import React from 'react';
import { LucideGraduationCap } from 'lucide-react';

export default function Logo({ size = 'md', light = false }) {
  const isLarge = size === 'lg';
  const isSmall = size === 'sm';

  return (
    <div className="flex items-center gap-3">
      <div className={`flex items-center justify-center rounded-xl transition-all shadow-sm ${
        light 
          ? 'bg-white/10 text-white border border-white/20' 
          : 'bg-brand-900 text-white shadow-brand-900/20'
      } ${
        isLarge ? 'w-12 h-12' : isSmall ? 'w-8 h-8' : 'w-10 h-10'
      }`}>
        <LucideGraduationCap className={isLarge ? 'w-7 h-7' : isSmall ? 'w-4 h-4' : 'w-5 h-5'} />
      </div>
      <div>
        <h1 className={`font-bold tracking-tight leading-none ${
          light ? 'text-white' : 'text-slate-900'
        } ${
          isLarge ? 'text-2xl' : isSmall ? 'text-base' : 'text-xl'
        }`}>
          Primes Academy
        </h1>
        <p className={`text-xs mt-0.5 tracking-wider uppercase font-medium ${
          light ? 'text-slate-300' : 'text-slate-500'
        }`}>
          Learn · Prepare · Excel
        </p>
      </div>
    </div>
  );
}

