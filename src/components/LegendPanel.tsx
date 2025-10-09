import { useState } from 'react';
import { Eye, EyeOff, Zap, GitBranch, Binary, Atom, ArrowRightLeft } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { usePanelsOpen, useUIStore } from '@/state/ui';

interface LegendItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  color: string;
}

const LEGEND_ITEMS: LegendItem[] = [
  {
    id: 'entanglement',
    icon: ArrowRightLeft,
    label: 'Entanglement Link',
    description: 'Visual connection between entangled qubits, shown as glowing threads',
    color: 'quantum-cyan'
  },
  {
    id: 'measurement',
    icon: Zap,
    label: 'Measurement Burst',
    description: 'Particle explosion effect when a qubit is measured',
    color: 'quantum-magenta'
  },
  {
    id: 'classical',
    icon: Binary,
    label: 'Classical Bits',
    description: 'Traditional information flow shown as binary streams',
    color: 'quantum-gold'
  },
  {
    id: 'qubit',
    icon: Atom,
    label: 'Qubit States',
    description: 'Spherical representations showing quantum superposition',
    color: 'quantum-purple'
  },
  {
    id: 'circuit',
    icon: GitBranch,
    label: 'Circuit Gates',
    description: 'Quantum logic gates applied to qubits during processing',
    color: 'quantum-cyan'
  }
];

export const LegendPanel = () => {
  const panelsOpen = usePanelsOpen();
  const setPanelOpen = useUIStore(state => state.setPanelOpen);
  
  const isOpen = panelsOpen.legend;

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setPanelOpen('legend', true)}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 bg-card/50 backdrop-blur-sm border border-border/30 hover:bg-card hover:neon-bloom-cyan"
        aria-label="Open legend panel"
      >
        <Eye className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div 
      className="fixed left-4 top-1/2 -translate-y-1/2 w-80 holo-panel rounded-xl z-40 max-h-[70vh]"
      role="complementary"
      aria-label="Visualization legend"
    >
      <div className="p-4 border-b border-border/30 flex items-center justify-between">
        <h3 className="font-quantum text-lg font-semibold text-foreground">
          Visualization Legend
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPanelOpen('legend', false)}
          className="hover:bg-primary/10 hover:text-primary"
          aria-label="Close legend panel"
        >
          <EyeOff className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="max-h-96">
        <div className="p-4 space-y-4">
          {LEGEND_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors group"
              >
                <div 
                  className={`w-10 h-10 rounded-lg bg-${item.color}/10 border border-${item.color}/30 flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`h-5 w-5 text-${item.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-quantum text-sm font-medium text-foreground mb-1">
                    {item.label}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border/30">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-quantum">
          <div className="w-2 h-2 rounded-full bg-primary animate-quantum-glow" />
          <span>Real-time visualization legend</span>
        </div>
      </div>
    </div>
  );
};