import { create } from 'zustand';

export type TeleportationPhase =
   | 'setup'
   | 'hadamard_drag'
   | 'hadamard_applied'
   | 'alice_bob_entangle_drag'
   | 'alice_bob_entangled'
   | 'message_appears'
   | 'message_alice_entangle_drag'
   | 'message_alice_entangled'
   | 'ready_to_measure'
   | 'measuring'
   | 'result_shown';

export interface QubitState {
   id: string;
   label: string;
   state: string;
   amplitude: [number, number];
   color: string;
   visible: boolean;
}

interface TeleportationState {
   // Current phase
   phase: TeleportationPhase;

   // Qubit states
   qubits: {
      alice: QubitState;
      bob: QubitState;
      message: QubitState;
   };

   // Timeline position (0-1)
   timelinePosition: number;

   // Guided tour
   isTourMode: boolean;
   currentTourStep: number;
   showWrongStepShake: boolean;

   // Actions
   setPhase: (phase: TeleportationPhase) => void;
   applyHadamard: () => void;
   entangleAliceBob: () => void;
   showMessageQubit: () => void;
   entangleMessageAlice: () => void;
   measure: () => void;
   showResult: () => void;
   reset: () => void;

   // Tour actions
   setTourMode: (enabled: boolean) => void;
   advanceTourStep: () => void;
   triggerWrongStepShake: () => void;

   // Timeline
   setTimelinePosition: (position: number) => void;
   jumpToPhase: (phase: TeleportationPhase) => void;
}

const PHASE_TO_TIMELINE: Record<TeleportationPhase, number> = {
   'setup': 0,
   'hadamard_drag': 0.05,
   'hadamard_applied': 0.15,
   'alice_bob_entangle_drag': 0.2,
   'alice_bob_entangled': 0.3,
   'message_appears': 0.4,
   'message_alice_entangle_drag': 0.45,
   'message_alice_entangled': 0.55,
   'ready_to_measure': 0.65,
   'measuring': 0.8,
   'result_shown': 1,
};

const TOUR_STEPS = [
   { phase: 'setup', instruction: 'Click the Hadamard gate (H), then click on Alice to apply' },
   { phase: 'hadamard_applied', instruction: 'Click the handle at Alice, then click Bob to entangle' },
   { phase: 'alice_bob_entangled', instruction: 'Watch as the Message qubit appears' },
   { phase: 'message_appears', instruction: 'Click the handle at Message, then click Alice to entangle' },
   { phase: 'message_alice_entangled', instruction: 'Click the Measure button' },
   { phase: 'result_shown', instruction: 'Teleportation complete! Review the result' },
];

export const useTeleportationStore = create<TeleportationState>((set, get) => ({
   phase: 'setup',

   qubits: {
      alice: {
         id: 'A',
         label: 'Alice',
         state: '|0⟩',
         amplitude: [1, 0],
         color: 'hsl(0, 85%, 55%)', // Warm red
         visible: true,
      },
      bob: {
         id: 'B',
         label: 'Bob',
         state: '|0⟩',
         amplitude: [1, 0],
         color: 'hsl(187, 100%, 50%)', // Quantum cyan
         visible: true,
      },
      message: {
         id: 'M',
         label: 'Message',
         state: '|1⟩',
         amplitude: [0, 1],
         color: 'hsl(142, 76%, 36%)', // Green
         visible: false,
      },
   },

   timelinePosition: 0,
   isTourMode: false,
   currentTourStep: 0,
   showWrongStepShake: false,

   setPhase: (phase) => set({
      phase,
      timelinePosition: PHASE_TO_TIMELINE[phase]
   }),

   applyHadamard: () => set((state) => ({
      phase: 'hadamard_applied',
      timelinePosition: PHASE_TO_TIMELINE['hadamard_applied'],
      qubits: {
         ...state.qubits,
         alice: {
            ...state.qubits.alice,
            state: '(1/√2)(|0⟩+|1⟩)',
            amplitude: [0.707, 0.707],
         },
      },
   })),

   entangleAliceBob: () => set((state) => ({
      phase: 'alice_bob_entangled',
      timelinePosition: PHASE_TO_TIMELINE['alice_bob_entangled'],
      qubits: {
         ...state.qubits,
         alice: {
            ...state.qubits.alice,
            state: '|Φ+⟩',
         },
         bob: {
            ...state.qubits.bob,
            state: '|Φ+⟩',
         },
      },
   })),

   showMessageQubit: () => set((state) => ({
      phase: 'message_appears',
      timelinePosition: PHASE_TO_TIMELINE['message_appears'],
      qubits: {
         ...state.qubits,
         message: {
            ...state.qubits.message,
            visible: true,
         },
      },
   })),

   entangleMessageAlice: () => set((state) => ({
      phase: 'message_alice_entangled',
      timelinePosition: PHASE_TO_TIMELINE['message_alice_entangled'],
      qubits: {
         ...state.qubits,
         message: {
            ...state.qubits.message,
            state: '|Φ+⟩',
         },
         alice: {
            ...state.qubits.alice,
            state: '|Φ+⟩ ⊗ |Φ+⟩',
         },
      },
   })),

   measure: () => set({
      phase: 'measuring',
      timelinePosition: PHASE_TO_TIMELINE['measuring'],
   }),

   showResult: () => set((state) => ({
      phase: 'result_shown',
      timelinePosition: 1,
      qubits: {
         ...state.qubits,
         alice: {
            ...state.qubits.alice,
            state: '|1⟩ (collapsed)',
            amplitude: [0, 1],
         },
         message: {
            ...state.qubits.message,
            state: '|1⟩ (measured)',
            amplitude: [0, 1],
         },
         bob: {
            ...state.qubits.bob,
            state: '|1⟩ (teleported!)',
            amplitude: [0, 1],
         },
      },
   })),

   reset: () => set({
      phase: 'setup',
      timelinePosition: 0,
      currentTourStep: 0,
      qubits: {
         alice: {
            id: 'A',
            label: 'Alice',
            state: '|0⟩',
            amplitude: [1, 0],
            color: 'hsl(0, 85%, 55%)',
            visible: true,
         },
         bob: {
            id: 'B',
            label: 'Bob',
            state: '|0⟩',
            amplitude: [1, 0],
            color: 'hsl(187, 100%, 50%)',
            visible: true,
         },
         message: {
            id: 'M',
            label: 'Message',
            state: '|1⟩',
            amplitude: [0, 1],
            color: 'hsl(142, 76%, 36%)',
            visible: false,
         },
      },
   }),

   setTourMode: (enabled) => set({
      isTourMode: enabled,
      currentTourStep: enabled ? 0 : 0,
   }),

   advanceTourStep: () => set((state) => ({
      currentTourStep: Math.min(state.currentTourStep + 1, TOUR_STEPS.length - 1),
   })),

   triggerWrongStepShake: () => {
      set({ showWrongStepShake: true });
      setTimeout(() => set({ showWrongStepShake: false }), 500);
   },

   setTimelinePosition: (position) => set({ timelinePosition: position }),

   jumpToPhase: (phase) => {
      const store = get();
      // Reset first, then apply states up to target phase
      store.reset();

      const phases: TeleportationPhase[] = [
         'setup', 'hadamard_applied', 'alice_bob_entangled',
         'message_appears', 'message_alice_entangled', 'result_shown'
      ];

      const targetIndex = phases.indexOf(phase);
      if (targetIndex >= 1) store.applyHadamard();
      if (targetIndex >= 2) store.entangleAliceBob();
      if (targetIndex >= 3) store.showMessageQubit();
      if (targetIndex >= 4) store.entangleMessageAlice();
      if (targetIndex >= 5) store.showResult();
   },
}));

export { TOUR_STEPS };
