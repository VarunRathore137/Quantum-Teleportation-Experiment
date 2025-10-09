import { create } from 'zustand';

// Measurement outcome probabilities for 2-qubit system
export interface OutcomeProbabilities {
  '00': number;
  '01': number;
  '10': number;
  '11': number;
}

// Circuit fidelity and error rates
export interface FidelityData {
  teleportationFidelity: number;
  gateFidelity: number;
  measurementFidelity: number;
  decoherenceError: number;
}

// Historical simulation data for visualization
export interface SimulationRun {
  id: string;
  timestamp: number;
  mode: 'tour' | 'explorer' | 'researcher';
  finalFidelity: number;
  probabilities: OutcomeProbabilities;
  totalSteps: number;
  completionTime: number; // in seconds
}

// Real-time data streaming during simulation
export interface LiveDataPoint {
  timestamp: number;
  phase: string;
  fidelity: number;
  entanglementStrength: number;
  noiseLevel: number;
}

interface DataState {
  // Current simulation results
  currentProbabilities: OutcomeProbabilities;
  currentFidelity: FidelityData;
  
  // Live data stream
  liveData: LiveDataPoint[];
  maxLiveDataPoints: number;
  
  // Historical runs
  simulationHistory: SimulationRun[];
  maxHistoryEntries: number;
  
  // Noise and error simulation
  noiseEnabled: boolean;
  decoherenceRate: number;
  gateErrorRate: number;
  measurementErrorRate: number;
  
  // Export format preferences
  exportFormat: 'json' | 'csv' | 'qasm';
  
  // Actions
  updateProbabilities: (probabilities: OutcomeProbabilities) => void;
  updateFidelity: (fidelity: FidelityData) => void;
  addLiveDataPoint: (point: LiveDataPoint) => void;
  addSimulationRun: (run: SimulationRun) => void;
  
  // Noise control
  setNoiseEnabled: (enabled: boolean) => void;
  setDecoherenceRate: (rate: number) => void;
  setGateErrorRate: (rate: number) => void;
  setMeasurementErrorRate: (rate: number) => void;
  
  // Data management
  clearLiveData: () => void;
  clearHistory: () => void;
  exportData: (format: 'json' | 'csv' | 'qasm') => string;
  reset: () => void;
}

// Default values
const defaultProbabilities: OutcomeProbabilities = {
  '00': 0.5,
  '01': 0.2,
  '10': 0.2,
  '11': 0.1,
};

const defaultFidelity: FidelityData = {
  teleportationFidelity: 1.0,
  gateFidelity: 0.999,
  measurementFidelity: 0.995,
  decoherenceError: 0.001,
};

export const useDataStore = create<DataState>((set, get) => ({
  currentProbabilities: defaultProbabilities,
  currentFidelity: defaultFidelity,
  liveData: [],
  maxLiveDataPoints: 1000,
  simulationHistory: [],
  maxHistoryEntries: 100,
  
  noiseEnabled: false,
  decoherenceRate: 0.001,
  gateErrorRate: 0.001,
  measurementErrorRate: 0.01,
  
  exportFormat: 'json',
  
  updateProbabilities: (probabilities) => set({ currentProbabilities: probabilities }),
  
  updateFidelity: (fidelity) => set({ currentFidelity: fidelity }),
  
  addLiveDataPoint: (point) => {
    set((state) => {
      const newLiveData = [...state.liveData, point];
      // Keep only the most recent points
      if (newLiveData.length > state.maxLiveDataPoints) {
        newLiveData.splice(0, newLiveData.length - state.maxLiveDataPoints);
      }
      return { liveData: newLiveData };
    });
  },
  
  addSimulationRun: (run) => {
    set((state) => {
      const newHistory = [run, ...state.simulationHistory];
      // Keep only the most recent runs
      if (newHistory.length > state.maxHistoryEntries) {
        newHistory.splice(state.maxHistoryEntries);
      }
      return { simulationHistory: newHistory };
    });
  },
  
  setNoiseEnabled: (enabled) => set({ noiseEnabled: enabled }),
  setDecoherenceRate: (rate) => set({ decoherenceRate: Math.max(0, Math.min(1, rate)) }),
  setGateErrorRate: (rate) => set({ gateErrorRate: Math.max(0, Math.min(1, rate)) }),
  setMeasurementErrorRate: (rate) => set({ measurementErrorRate: Math.max(0, Math.min(1, rate)) }),
  
  clearLiveData: () => set({ liveData: [] }),
  
  clearHistory: () => set({ simulationHistory: [] }),
  
  exportData: (format) => {
    const state = get();
    const exportData = {
      timestamp: new Date().toISOString(),
      currentProbabilities: state.currentProbabilities,
      currentFidelity: state.currentFidelity,
      simulationHistory: state.simulationHistory,
      noiseParameters: {
        enabled: state.noiseEnabled,
        decoherenceRate: state.decoherenceRate,
        gateErrorRate: state.gateErrorRate,
        measurementErrorRate: state.measurementErrorRate,
      },
    };
    
    switch (format) {
      case 'json':
        return JSON.stringify(exportData, null, 2);
      
      case 'csv':
        // Simple CSV export of simulation history
        const csvHeader = 'timestamp,mode,fidelity,prob_00,prob_01,prob_10,prob_11,steps,time\\n';
        const csvRows = state.simulationHistory.map(run => 
          `${new Date(run.timestamp).toISOString()},${run.mode},${run.finalFidelity},${run.probabilities['00']},${run.probabilities['01']},${run.probabilities['10']},${run.probabilities['11']},${run.totalSteps},${run.completionTime}`
        ).join('\\n');
        return csvHeader + csvRows;
      
      case 'qasm':
        // Basic QASM representation of quantum circuit
        return `// Quantum Teleportation Circuit\\nQASM 2.0;\\ninclude "qelib1.inc";\\nqreg q[3];\\ncreg c[3];\\n// Implementation placeholder`;
      
      default:
        return JSON.stringify(exportData, null, 2);
    }
  },
  
  reset: () => set({
    currentProbabilities: defaultProbabilities,
    currentFidelity: defaultFidelity,
    liveData: [],
    simulationHistory: [],
    noiseEnabled: false,
    decoherenceRate: 0.001,
    gateErrorRate: 0.001,
    measurementErrorRate: 0.01,
  }),
}));

// Mock data generation for development/demo
export const generateMockLiveData = (phase: string): LiveDataPoint => ({
  timestamp: Date.now(),
  phase,
  fidelity: 0.95 + Math.random() * 0.05, // 95-100%
  entanglementStrength: 0.8 + Math.random() * 0.2, // 80-100%
  noiseLevel: Math.random() * 0.1, // 0-10%
});

export const generateMockProbabilities = (): OutcomeProbabilities => {
  const values = [Math.random(), Math.random(), Math.random(), Math.random()];
  const sum = values.reduce((a, b) => a + b, 0);
  const normalized = values.map(v => v / sum);
  
  return {
    '00': normalized[0],
    '01': normalized[1],
    '10': normalized[2],
    '11': normalized[3],
  };
};

// Hooks for easy access
export const useData = () => useDataStore();
export const useProbabilities = () => useDataStore((state) => state.currentProbabilities);
export const useFidelity = () => useDataStore((state) => state.currentFidelity);
export const useLiveData = () => useDataStore((state) => state.liveData);
export const useSimulationHistory = () => useDataStore((state) => state.simulationHistory);
export const useNoiseSettings = () => useDataStore((state) => ({
  enabled: state.noiseEnabled,
  decoherenceRate: state.decoherenceRate,
  gateErrorRate: state.gateErrorRate,
  measurementErrorRate: state.measurementErrorRate,
}));