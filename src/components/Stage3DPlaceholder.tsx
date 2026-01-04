import { useState } from "react";
import { Maximize2, Grid3x3 } from "lucide-react";
import { Button } from "./ui/button";
import { QuantumStage3D } from "./three/QuantumStage3D";
import { GuidedTourOverlay } from "./GuidedTourOverlay";
import { PhaseExplanationPanel } from "./PhaseExplanationPanel";

export const Stage3DPlaceholder = () => {
  const [debugMode, setDebugMode] = useState(false);

  return (
    <div className="relative flex-1 min-h-[600px] holo-panel rounded-xl overflow-hidden group">
      {/* Cinematic frame bars */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-background to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />

      {/* 3D Canvas with Quantum Teleportation Scene */}
      <div
        id="three-stage"
        className="absolute inset-0 bg-gradient-to-br from-background via-card to-background"
        aria-label="3D Visualization Stage"
      >
        <QuantumStage3D />
      </div>

      {/* Guided Tour Overlay */}
      <GuidedTourOverlay />

      {/* Phase Explanation Panel */}
      <PhaseExplanationPanel />

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
          <div className="text-accent">Phase: Interactive</div>
        </div>
      )}

      {/* Ready for Three.js indicator */}
      <div className="absolute bottom-4 left-4 holo-panel px-3 py-2 rounded-lg z-30 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2 font-quantum text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-quantum-cyan animate-quantum-glow" />
          <span>Three.js active</span>
        </div>
      </div>
    </div>
  );
};
