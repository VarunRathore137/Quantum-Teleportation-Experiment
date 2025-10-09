import { create } from 'zustand';

// Complex number representation
export interface Complex {
  real: number;
  imag: number;
}

// Quantum state representation
export interface QuantumState {
  amplitudes: [Complex, Complex]; // [|0⟩, |1⟩] amplitudes
}

// Qubit with label and state
export interface Qubit {
  id: string;
  label: string;
  role: 'message' | 'alice' | 'bob';
  state: QuantumState;
  isEntangled: boolean;
  entangledWith?: string[];
}

// Measurement outcome
export interface MeasurementResult {
  qubitId: string;
  outcome: 0 | 1;
  timestamp: number;
  phase: string;
}

interface QubitsState {
  qubits: Record<string, Qubit>;
  measurements: MeasurementResult[];
  
  // Bell state for entangled pair
  bellState: 'phi_plus' | 'phi_minus' | 'psi_plus' | 'psi_minus' | null;
  
  // Classical communication bits
  classicalBits: [number, number] | null;
  
  // Actions
  initializeQubits: () => void;
  updateQubitState: (id: string, state: QuantumState) => void;
  entangleQubits: (id1: string, id2: string) => void;
  measureQubit: (id: string, phase: string) => MeasurementResult;
  setBellState: (state: QubitsState['bellState']) => void;
  setClassicalBits: (bits: [number, number]) => void;
  reset: () => void;
}

// Helper functions for quantum state operations
export const createState = (alpha: Complex, beta: Complex): QuantumState => ({
  amplitudes: [alpha, beta]
});

export const createComplex = (real: number, imag: number = 0): Complex => ({
  real,
  imag
});

// Common quantum states
export const QUANTUM_STATES = {
  ZERO: createState(createComplex(1), createComplex(0)),
  ONE: createState(createComplex(0), createComplex(1)),
  PLUS: createState(createComplex(1/Math.sqrt(2)), createComplex(1/Math.sqrt(2))),
  MINUS: createState(createComplex(1/Math.sqrt(2)), createComplex(-1/Math.sqrt(2))),
  PLUS_I: createState(createComplex(1/Math.sqrt(2)), createComplex(0, 1/Math.sqrt(2))),
  MINUS_I: createState(createComplex(1/Math.sqrt(2)), createComplex(0, -1/Math.sqrt(2))),
};

const initialQubits: Record<string, Qubit> = {
  A: {
    id: 'A',
    label: 'Message',
    role: 'message',
    state: QUANTUM_STATES.ZERO,
    isEntangled: false,
  },
  B: {
    id: 'B',
    label: 'Alice',
    role: 'alice',
    state: QUANTUM_STATES.ZERO,
    isEntangled: false,
  },
  C: {
    id: 'C',
    label: 'Bob',
    role: 'bob',
    state: QUANTUM_STATES.ZERO,
    isEntangled: false,
  },
};

export const useQubitsStore = create<QubitsState>((set, get) => ({
  qubits: initialQubits,
  measurements: [],
  bellState: null,
  classicalBits: null,
  
  initializeQubits: () => {
    set({
      qubits: {
        ...initialQubits,
        A: { ...initialQubits.A, state: QUANTUM_STATES.PLUS }, // Example message state
      },
      measurements: [],
      bellState: null,
      classicalBits: null,
    });
  },
  
  updateQubitState: (id, state) => {
    set((prev) => ({
      qubits: {
        ...prev.qubits,
        [id]: {
          ...prev.qubits[id],
          state,
        },
      },
    }));
  },
  
  entangleQubits: (id1, id2) => {
    set((prev) => ({
      qubits: {
        ...prev.qubits,
        [id1]: {
          ...prev.qubits[id1],
          isEntangled: true,
          entangledWith: [id2],
        },
        [id2]: {
          ...prev.qubits[id2],
          isEntangled: true,
          entangledWith: [id1],
        },
      },
      bellState: 'phi_plus', // Default Bell state
    }));
  },
  
  measureQubit: (id, phase) => {
    const qubit = get().qubits[id];
    const probability0 = qubit.state.amplitudes[0].real ** 2 + qubit.state.amplitudes[0].imag ** 2;
    const outcome = Math.random() < probability0 ? 0 : 1;
    
    const result: MeasurementResult = {
      qubitId: id,
      outcome: outcome as 0 | 1,
      timestamp: Date.now(),
      phase,
    };
    
    // Update qubit to measured state
    const measuredState = outcome === 0 ? QUANTUM_STATES.ZERO : QUANTUM_STATES.ONE;
    get().updateQubitState(id, measuredState);
    
    // Add to measurements
    set((prev) => ({
      measurements: [...prev.measurements, result],
    }));
    
    return result;
  },
  
  setBellState: (bellState) => set({ bellState }),
  setClassicalBits: (classicalBits) => set({ classicalBits }),
  
  reset: () => set({
    qubits: initialQubits,
    measurements: [],
    bellState: null,
    classicalBits: null,
  }),
}));

// Helper functions for quantum calculations
export const getStateProbabilities = (state: QuantumState) => {
  const prob0 = state.amplitudes[0].real ** 2 + state.amplitudes[0].imag ** 2;
  const prob1 = state.amplitudes[1].real ** 2 + state.amplitudes[1].imag ** 2;
  return { prob0, prob1 };
};

export const getStateDescription = (state: QuantumState): string => {
  const { prob0, prob1 } = getStateProbabilities(state);
  
  if (Math.abs(prob0 - 1) < 0.001) return '|0⟩';
  if (Math.abs(prob1 - 1) < 0.001) return '|1⟩';
  if (Math.abs(prob0 - 0.5) < 0.001 && Math.abs(prob1 - 0.5) < 0.001) {
    // Check phase relationship
    const phase = Math.atan2(state.amplitudes[1].imag, state.amplitudes[1].real);
    if (Math.abs(phase) < 0.001) return '|+⟩';
    if (Math.abs(phase - Math.PI) < 0.001) return '|-⟩';
    if (Math.abs(phase - Math.PI/2) < 0.001) return '|+i⟩';
    if (Math.abs(phase + Math.PI/2) < 0.001) return '|-i⟩';
  }
  
  return 'custom';
};

// Hooks for easy access
export const useQubits = () => useQubitsStore();
export const useQubitState = (id: string) => useQubitsStore((state) => state.qubits[id]);
export const useMeasurements = () => useQubitsStore((state) => state.measurements);
export const useBellState = () => useQubitsStore((state) => state.bellState);
export const useClassicalBits = () => useQubitsStore((state) => state.classicalBits);