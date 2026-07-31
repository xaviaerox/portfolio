import React from 'react';

interface SectionLabelProps {
  label: string;
  center?: boolean;
}

export default function SectionLabel({ label, center = false }: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-3 ${center ? 'justify-center' : 'justify-start'}`}>
      <div className="w-8 h-[2px] bg-brand-secondary" />
      <span className="font-mono text-[11px] text-brand-secondary tracking-[0.25em] uppercase font-bold">
        {label}
      </span>
    </div>
  );
}
