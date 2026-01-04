import { useTeleportationStore, TeleportationPhase } from '@/state/teleportationStore';

interface PhaseExplanation {
   title: string;
   explanation: string;
   math: string;
   tip: string;
}

const PHASE_EXPLANATIONS: Record<string, PhaseExplanation> = {
   setup: {
      title: '🎯 Step 1: Setup',
      explanation: 'Alice and Bob each have a qubit in the ground state |0⟩. We want to teleport a message (the green qubit showing |1⟩) to Bob without physically moving it.',
      math: 'Initial: |0⟩_Alice ⊗ |0⟩_Bob',
      tip: 'Click the Hadamard gate (H), then click on Alice to put her qubit in superposition.',
   },
   hadamard_drag: {
      title: '🎯 Step 1: Setup',
      explanation: 'Alice and Bob each have a qubit in the ground state |0⟩. We want to teleport a message to Bob.',
      math: 'Initial: |0⟩_Alice ⊗ |0⟩_Bob',
      tip: 'Click the Hadamard gate (H), then click on Alice.',
   },
   hadamard_applied: {
      title: '✨ Step 2: Superposition Created!',
      explanation: 'The Hadamard gate put Alice\'s qubit into a SUPERPOSITION - she\'s now in both |0⟩ AND |1⟩ at the same time! This is the magic of quantum mechanics.',
      math: 'Alice: (1/√2)(|0⟩ + |1⟩)',
      tip: 'Click the handle at Alice, then click Bob to create entanglement between them.',
   },
   alice_bob_entangle_drag: {
      title: '✨ Step 2: Creating Entanglement',
      explanation: 'Now we\'ll entangle Alice and Bob using a CNOT gate. This creates a special quantum connection where measuring one instantly affects the other!',
      math: 'Applying CNOT: Alice controls, Bob is target',
      tip: 'Click the handle at Alice, then click Bob.',
   },
   alice_bob_entangled: {
      title: '🔗 Step 3: Alice & Bob Entangled!',
      explanation: 'Alice and Bob are now in a Bell state |Φ+⟩ - they\'re "quantum connected"! If you measure Alice as |0⟩, Bob will be |0⟩ too. If Alice is |1⟩, Bob is |1⟩.',
      math: '|Φ+⟩ = (1/√2)(|00⟩ + |11⟩)',
      tip: 'Watch as the Message qubit appears...',
   },
   message_appears: {
      title: '💚 Step 4: Message Qubit Appears',
      explanation: 'This is the state we want to teleport! The green qubit holds |1⟩ - we want Bob to end up with this exact state, without sending the physical qubit.',
      math: 'Message state: |1⟩ (this is what we\'ll teleport)',
      tip: 'Click the handle at Message, then click Alice to entangle them.',
   },
   message_alice_entangle_drag: {
      title: '🔄 Step 5: Entangling Message with Alice',
      explanation: 'We perform another CNOT, but this time Message controls Alice. This "imprints" the message state onto the entangled pair.',
      math: 'CNOT: Message → Alice',
      tip: 'Click the handle at Message, then click Alice.',
   },
   message_alice_entangled: {
      title: '🌐 Step 6: All Three Connected!',
      explanation: 'Now Message, Alice, and Bob form a complex entangled state. The message information is "spread" across all three qubits in a quantum superposition.',
      math: 'Combined state: (1/2)(|000⟩ + |011⟩ + |110⟩ + |101⟩)',
      tip: 'Click the Measure button to collapse the quantum states.',
   },
   ready_to_measure: {
      title: '⚡ Ready to Measure!',
      explanation: 'Measurement will "collapse" the superposition. Alice and Message will randomly become definite states (|0⟩ or |1⟩), and Bob will automatically receive the teleported state!',
      math: 'Measurement collapses the wavefunction',
      tip: 'Click MEASURE to complete the teleportation!',
   },
   measuring: {
      title: '🔬 Measuring...',
      explanation: 'The spotlight represents quantum measurement. When we measure, the superposition collapses and Bob receives the teleported state!',
      math: 'Wavefunction collapse in progress...',
      tip: 'Wait for the measurement to complete...',
   },
   result_shown: {
      title: '🎉 Teleportation Successful!',
      explanation: 'Bob now has state |1⟩ - the same state that Message had! The quantum information was transferred instantly using entanglement, without any physical particle moving.',
      math: 'Bob: |1⟩ = Original Message state ✓',
      tip: 'Use the timeline below to replay the process!',
   },
};

export const PhaseExplanationPanel = () => {
   const phase = useTeleportationStore((state) => state.phase);

   const explanation = PHASE_EXPLANATIONS[phase] || PHASE_EXPLANATIONS.setup;

   return (
      <div className="absolute top-16 left-4 z-30 max-w-xs">
         <div className="bg-black/85 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-quantum-purple/30 to-quantum-cyan/30 px-4 py-2 border-b border-white/10">
               <h3 className="font-quantum text-sm font-bold text-white">
                  {explanation.title}
               </h3>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
               {/* Explanation */}
               <p className="text-sm text-white/90 leading-relaxed">
                  {explanation.explanation}
               </p>

               {/* Math notation */}
               <div className="bg-white/5 rounded-lg px-3 py-2 border-l-2 border-quantum-cyan">
                  <div className="text-[10px] text-quantum-cyan/80 uppercase tracking-wide mb-1">
                     Math
                  </div>
                  <div className="font-quantum text-xs text-quantum-cyan">
                     {explanation.math}
                  </div>
               </div>

               {/* Tip */}
               <div className="flex items-start gap-2 text-xs text-white/60">
                  <span className="text-yellow-400">💡</span>
                  <span>{explanation.tip}</span>
               </div>
            </div>
         </div>
      </div>
   );
};
