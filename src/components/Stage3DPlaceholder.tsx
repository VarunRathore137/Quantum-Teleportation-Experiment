import { useState } from "react";
import { Maximize2, Minimize2, Grid3x3 } from "lucide-react";
import { Button } from "./ui/button";

export const Stage3DPlaceholder = () => {
  const [debugMode, setDebugMode] = useState(false);

  return (
    <div className="relative flex-1 min-h-[600px] holo-panel rounded-xl overflow-hidden group particle-aura">
      {/* Cinematic frame bars */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-background to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />
      
      {/* 3D Canvas mount point */}
      <div 
        id="three-stage" 
        className="absolute inset-0 bg-gradient-to-br from-background via-card to-background"
        aria-label="3D Visualization Stage"
      >
        {/* Placeholder quantum visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Central quantum node */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-quantum-cyan/20 to-quantum-purple/20 border-2 border-primary/50 glow-cyan flex items-center justify-center quantum-pulse">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-quantum-purple/30 to-quantum-magenta/30 border border-secondary/50 glow-purple flex items-center justify-center">
                <Grid3x3 className="w-12 h-12 text-primary" />
              </div>
            </div>
            
            {/* Orbiting particles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-primary"
                  style={{
                    animation: `orbit ${3 + i}s linear infinite`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }} />
        </div>
      </div>

      {/* Stage controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-30">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDebugMode(!debugMode)}
          className="bg-card/50 backdrop-blur-sm hover:bg-card border border-border/30 hover:neon-bloom-cyan"
          aria-label="Toggle debug mode"
          aria-pressed={debugMode}
        >
          <Grid3x3 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-card/50 backdrop-blur-sm hover:bg-card border border-border/30 hover:neon-bloom-purple"
          aria-label="Toggle fullscreen"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Debug overlay */}
      {debugMode && (
        <div className="absolute top-4 left-4 holo-panel p-3 rounded-lg z-30 font-quantum text-xs space-y-1">
          <div className="text-muted-foreground">Debug Mode</div>
          <div className="text-primary">FPS: 60</div>
          <div className="text-secondary">Camera: Orbit</div>
          <div className="text-accent">Phase: Setup</div>
        </div>
      )}

      {/* Ready for Three.js indicator */}
      <div className="absolute bottom-4 left-4 holo-panel px-3 py-2 rounded-lg z-30 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2 font-quantum text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-quantum-cyan animate-quantum-glow" />
          <span>Three.js mount ready</span>
        </div>
      </div>

      <style>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(80px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(80px) rotate(-360deg);
          }
        }
      `}</style>
    </div>
  );
};
