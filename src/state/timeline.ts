import { create } from 'zustand';

export type Phase = 'setup' | 'entangle' | 'prepare' | 'measure' | 'communicate' | 'reconstruct' | 'verify';

export interface TimelinePhase {
  id: Phase;
  label: string;
  position: number;
  description: string;
}

export const TIMELINE_PHASES: TimelinePhase[] = [
  { 
    id: 'setup', 
    label: 'Setup', 
    position: 0, 
    description: 'Initialize qubits and prepare the quantum system'
  },
  { 
    id: 'entangle', 
    label: 'Entangle', 
    position: 0.15, 
    description: 'Create Bell pair entanglement between Alice and Bob'
  },
  { 
    id: 'prepare', 
    label: 'Prepare', 
    position: 0.3, 
    description: 'Prepare the message qubit in desired state'
  },
  { 
    id: 'measure', 
    label: 'Measure', 
    position: 0.5, 
    description: 'Alice performs Bell state measurement'
  },
  { 
    id: 'communicate', 
    label: 'Communicate', 
    position: 0.65, 
    description: 'Send classical bits to Bob via classical channel'
  },
  { 
    id: 'reconstruct', 
    label: 'Reconstruct', 
    position: 0.8, 
    description: 'Bob applies correction gates based on measurement'
  },
  { 
    id: 'verify', 
    label: 'Verify', 
    position: 1, 
    description: 'Confirm successful state teleportation'
  },
];

interface TimelineState {
  // Current timeline position (0-1)
  t: number;
  
  // Current phase
  currentPhase: Phase;
  
  // Playback state
  playing: boolean;
  speed: number;
  
  // Animation state
  animating: boolean;
  
  // Actions
  setT: (t: number) => void;
  setCurrentPhase: (phase: Phase) => void;
  setPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  setAnimating: (animating: boolean) => void;
  
  // Helper methods
  play: () => void;
  pause: () => void;
  reset: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  goToPhase: (phase: Phase) => void;
}

export const useTimelineStore = create<TimelineState>((set, get) => ({
  t: 0,
  currentPhase: 'setup',
  playing: false,
  speed: 1,
  animating: false,
  
  setT: (t) => {
    const clampedT = Math.max(0, Math.min(1, t));
    const newPhase = getCurrentPhaseFromT(clampedT);
    set({ 
      t: clampedT, 
      currentPhase: newPhase 
    });
  },
  
  setCurrentPhase: (currentPhase) => set({ currentPhase }),
  setPlaying: (playing) => set({ playing }),
  setSpeed: (speed) => set({ speed }),
  setAnimating: (animating) => set({ animating }),
  
  play: () => set({ playing: true }),
  pause: () => set({ playing: false }),
  reset: () => set({ t: 0, currentPhase: 'setup', playing: false }),
  
  stepForward: () => {
    const { currentPhase } = get();
    const currentIndex = TIMELINE_PHASES.findIndex(p => p.id === currentPhase);
    if (currentIndex < TIMELINE_PHASES.length - 1) {
      const nextPhase = TIMELINE_PHASES[currentIndex + 1];
      get().goToPhase(nextPhase.id);
    }
  },
  
  stepBackward: () => {
    const { currentPhase } = get();
    const currentIndex = TIMELINE_PHASES.findIndex(p => p.id === currentPhase);
    if (currentIndex > 0) {
      const prevPhase = TIMELINE_PHASES[currentIndex - 1];
      get().goToPhase(prevPhase.id);
    }
  },
  
  goToPhase: (phase) => {
    const phaseData = TIMELINE_PHASES.find(p => p.id === phase);
    if (phaseData) {
      set({ 
        t: phaseData.position, 
        currentPhase: phase 
      });
    }
  },
}));

// Helper function to determine current phase from timeline position
export const getCurrentPhaseFromT = (t: number): Phase => {
  for (let i = TIMELINE_PHASES.length - 1; i >= 0; i--) {
    if (t >= TIMELINE_PHASES[i].position) {
      return TIMELINE_PHASES[i].id;
    }
  }
  return 'setup';
};

// Hooks for easy access
export const useTimeline = () => useTimelineStore();
export const useCurrentPhase = () => useTimelineStore((state) => state.currentPhase);
export const useTimelinePosition = () => useTimelineStore((state) => state.t);
export const usePlaybackState = () => useTimelineStore((state) => ({ 
  playing: state.playing, 
  speed: state.speed 
}));