import React from 'react';

const QuantumShell = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden">
      {/* Enhanced deep-space quantum field background */}
      <div className="fixed inset-0 opacity-60">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-quantum-cyan/15 via-background via-quantum-purple/8 to-quantum-magenta/15" />
        
        {/* Accent gradients for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,hsl(var(--quantum-purple)/0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,hsl(var(--quantum-cyan)/0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_80%,hsl(var(--quantum-magenta)/0.08),transparent_70%)]" />
        
        {/* Subtle center highlight instead of dark vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--quantum-cyan)/0.05)_0%,transparent_70%)]" />
      </div>

      {/* Reduced noise overlay */}
      <div className="quantum-noise fixed inset-0 pointer-events-none z-10 opacity-60" />
      
      {/* Softer scanlines */}
      <div className="enhanced-scanlines fixed inset-0 pointer-events-none z-10 opacity-40" />

      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>

      {/* Very subtle edge fade instead of strong vignette */}
      <div className="fixed inset-0 pointer-events-none z-30">
        <div className="absolute inset-0 bg-gradient-to-t from-background/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-l from-background/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/5 via-transparent to-transparent" />
      </div>
    </div>
  );
};

export { QuantumShell };