import { useState } from 'react';
import { Zap, HelpCircle, Settings, Brain } from 'lucide-react';
import { Button } from './ui/button';
import { ExplanationsOverlay } from './ExplanationsOverlay';
import { SettingsModal } from './SettingsModal';

export const CommandBar = ({ currentMode, onModeChange }) => {
  const [showExplanations, setShowExplanations] = useState(false);

  return (
    <header className="holo-panel border-b border-border/30 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <svg viewBox="0 0 32 32" className="w-full h-full">
              <defs>
                <linearGradient id="logo-gradient" x1="10%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--quantum-cyan))" />
                  <stop offset="100%" stopColor="hsl(var(--quantum-magenta))" />
                </linearGradient>
              </defs>

              {/* Entangled loops */}
              <path
                d="M8 16 C8 10, 12 8, 16 8 C20 8, 24 10, 24 16"
                fill="none"
                stroke="url(#logo-gradient)"
                strokeWidth="2"
                className="animate-quantum-glow"
              />
              <path
                d="M24 16 C24 22, 20 24, 16 24 C12 24, 8 22, 8 16"
                fill="none"
                stroke="url(#logo-gradient)"
                strokeWidth="2"
                className="animate-quantum-glow"
                style={{ animationDelay: '1s' }}
              />
              <circle
                cx="8"
                cy="16"
                r="2"
                fill="hsl(var(--quantum-cyan))"
                className="quantum-pulse"
              />
              <circle
                cx="24"
                cy="16"
                r="2"
                fill="hsl(var(--quantum-magenta))"
                className="quantum-pulse"
                style={{ animationDelay: '1s' }}
              />
            </svg>
          </div>
      
          <h1 className="font-quantum text-lg font-bold bg-gradient-to-r from-quantum-cyan to-quantum-magenta bg-clip-text text-transparent">
            
            QUANTUM TELEPORTATION
          </h1>
          
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 holo-panel px-1 py-1 rounded-lg">
          <ModeButton active={currentMode === 'tour'} onClick={() => onModeChange('tour')}>
            Tour
          </ModeButton>
          <ModeButton active={currentMode === 'explorer'} onClick={() => onModeChange('explorer')}>
            Explorer
          </ModeButton>
          <ModeButton
            active={currentMode === 'researcher'}
            onClick={() => onModeChange('researcher')}
          >
            Researcher
          </ModeButton>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowExplanations(true)}
            className="text-foreground/70 hover:text-primary hover:bg-primary/10 hover:neon-bloom-cyan transition-all"
            aria-label="AI Explain - Open explanations"
          >
            <Brain className="h-5 w-5" />
          </Button>

          <SettingsModal />

          <Button
            variant="ghost"
            size="icon"
            className="text-foreground/70 hover:text-primary hover:bg-primary/10 transition-all"
            aria-label="Help"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <ExplanationsOverlay
        isOpen={showExplanations}
        onClose={() => setShowExplanations(false)}
        phase={currentMode === 'tour' ? 'Setup' : undefined}
      />
    </header>
  );
};

const ModeButton = ({ active, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      role="tab"
      aria-selected={active}
      className={`
        relative px-4 py-2 rounded-md font-quantum text-sm font-medium transition-all
        ${
          active
            ? 'text-primary-foreground bg-primary shadow-lg shadow-primary/50 neon-bloom-cyan'
            : 'text-foreground/60 hover:text-foreground hover:bg-muted/50'
        }
      `}
    >
      {children}
      {active && <div className="absolute inset-0 rounded-md animate-quantum-glow pointer-events-none" />}
    </button>
  );
};
