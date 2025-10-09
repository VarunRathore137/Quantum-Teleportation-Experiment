import { create } from 'zustand';

export const TIMELINE_PHASES = [
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

const useTimelineStore = create((set, get) => ({
  // Current timeline position (0-1)
  t: 0,
  
  // Current phase
  currentPhase: 'setup',
  
  // Playback state
  playing: false,
  speed: 1,
  
  // Animation state
  animating: false,
  
  // Actions
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
export const getCurrentPhaseFromT = (t) => {
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