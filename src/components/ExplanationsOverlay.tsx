import { useState } from "react";
import { X, GraduationCap, BookOpen, Microscope, User } from "lucide-react";
import { Button } from "./ui/button";

type ExplanationLevel = "child" | "student" | "engineer" | "researcher";

interface ExplanationsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  phase?: string;
}

const LEVEL_CONFIG = [
  { id: "child" as const, label: "Like I'm 12", icon: User, color: "quantum-gold" },
  { id: "student" as const, label: "Student", icon: GraduationCap, color: "quantum-cyan" },
  { id: "engineer" as const, label: "Engineer", icon: BookOpen, color: "quantum-purple" },
  { id: "researcher" as const, label: "Researcher", icon: Microscope, color: "quantum-magenta" },
];

const EXPLANATIONS = {
  child: "Quantum teleportation is like magic messaging! Imagine you have two magic coins that are best friends. When you flip one, the other knows instantly, even if they're far apart. We use this connection to send secret messages by measuring the coins in special ways.",
  student: "Quantum teleportation uses entanglement to transfer quantum states. Two particles are entangled, then one is measured alongside the state we want to send. The measurement result tells us how to transform the other entangled particle to recreate the original state.",
  engineer: "The protocol requires Bell state measurement on the message qubit and one half of an EPR pair. Classical communication of two bits determines which Pauli gate (I, X, Z, or XZ) the receiver applies to their entangled qubit to reconstruct the original state.",
  researcher: "Quantum teleportation implements faithful state transfer via LOCC (Local Operations and Classical Communication). The protocol achieves unit fidelity through Bell state measurement (projecting onto |Φ±⟩, |Ψ±⟩ basis) and conditional unitary correction based on 2 classical bits of measurement outcome.",
};

export const ExplanationsOverlay = ({ isOpen, onClose, phase }: ExplanationsOverlayProps) => {
  const [level, setLevel] = useState<ExplanationLevel>("student");

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="explanation-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Panel */}
      <div className="relative holo-panel rounded-2xl p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-primary/10 hover:text-primary"
          aria-label="Close explanation"
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Header */}
        <div className="mb-6">
          <h2 
            id="explanation-title" 
            className="text-3xl font-bold bg-gradient-to-r from-quantum-cyan via-quantum-purple to-quantum-magenta bg-clip-text text-transparent mb-2"
          >
            Quantum Teleportation Explained
          </h2>
          {phase && (
            <p className="text-sm text-muted-foreground font-quantum">
              Phase: <span className="text-primary">{phase}</span>
            </p>
          )}
        </div>

        {/* Level selector */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3">Choose your explanation level:</p>
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
            role="radiogroup"
            aria-label="Explanation level"
          >
            {LEVEL_CONFIG.map((config) => {
              const Icon = config.icon;
              const isActive = level === config.id;
              
              return (
                <button
                  key={config.id}
                  onClick={() => setLevel(config.id)}
                  role="radio"
                  aria-checked={isActive}
                  aria-label={config.label}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all
                    ${isActive
                      ? `border-${config.color} bg-${config.color}/10 neon-bloom-${config.color.split('-')[1]}`
                      : "border-border/30 hover:border-primary/50 hover:bg-card/50"
                    }
                  `}
                >
                  <Icon className={`h-6 w-6 mb-2 mx-auto ${isActive ? `text-${config.color}` : "text-muted-foreground"}`} />
                  <div className={`text-xs font-quantum ${isActive ? `text-${config.color}` : "text-muted-foreground"}`}>
                    {config.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation content */}
        <div className="holo-panel p-6 rounded-xl">
          <p className="text-foreground leading-relaxed">
            {EXPLANATIONS[level]}
          </p>
        </div>

        {/* Additional info */}
        <div className="mt-6 pt-6 border-t border-border/30">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-quantum">
            <div className="w-2 h-2 rounded-full bg-primary animate-quantum-glow" />
            <span>This explanation adapts based on your selected level</span>
          </div>
        </div>
      </div>
    </div>
  );
};
