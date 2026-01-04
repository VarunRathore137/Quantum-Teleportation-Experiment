import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Qubit3D } from './Qubit3D';
import { HadamardGate } from './HadamardGate';
import { EntanglementRope } from './EntanglementRope';
import { useTeleportationStore, TeleportationPhase } from '@/state/teleportationStore';

// Qubit positions
const POSITIONS = {
   message: [-3.5, 0, 0] as [number, number, number],
   alice: [-0.5, 0, 0] as [number, number, number],
   bob: [2.5, 0, 0] as [number, number, number],
   hadamardGate: [-0.5, 1.5, 0] as [number, number, number],
};

// Scene content component
const SceneContent = () => {
   const phase = useTeleportationStore((state) => state.phase);
   const applyHadamard = useTeleportationStore((state) => state.applyHadamard);
   const entangleAliceBob = useTeleportationStore((state) => state.entangleAliceBob);
   const showMessageQubit = useTeleportationStore((state) => state.showMessageQubit);
   const entangleMessageAlice = useTeleportationStore((state) => state.entangleMessageAlice);
   const measure = useTeleportationStore((state) => state.measure);
   const showResult = useTeleportationStore((state) => state.showResult);
   const setPhase = useTeleportationStore((state) => state.setPhase);
   const isTourMode = useTeleportationStore((state) => state.isTourMode);
   const advanceTourStep = useTeleportationStore((state) => state.advanceTourStep);

   const handleHadamardApplied = useCallback(() => {
      applyHadamard();
      if (isTourMode) advanceTourStep();
      // After a delay, enable next step
      setTimeout(() => setPhase('alice_bob_entangle_drag'), 500);
   }, [applyHadamard, setPhase, isTourMode, advanceTourStep]);

   const handleAliceBobEntangled = useCallback(() => {
      entangleAliceBob();
      if (isTourMode) advanceTourStep();
      // Show message qubit after entanglement
      setTimeout(() => {
         showMessageQubit();
         setTimeout(() => setPhase('message_alice_entangle_drag'), 800);
      }, 800);
   }, [entangleAliceBob, showMessageQubit, setPhase, isTourMode, advanceTourStep]);

   const handleMessageAliceEntangled = useCallback(() => {
      entangleMessageAlice();
      if (isTourMode) advanceTourStep();
      setTimeout(() => setPhase('ready_to_measure'), 500);
   }, [entangleMessageAlice, setPhase, isTourMode, advanceTourStep]);

   // Determine component states based on phase
   const showHadamardGate = phase === 'setup' || phase === 'hadamard_drag';
   const aliceHasSuperposition =
      phase !== 'setup' &&
      phase !== 'hadamard_drag';

   const aliceBobEntangled = [
      'alice_bob_entangled', 'message_appears', 'message_alice_entangle_drag',
      'message_alice_entangled', 'ready_to_measure', 'measuring', 'result_shown'
   ].includes(phase);

   const messageAliceEntangled = [
      'message_alice_entangled', 'ready_to_measure', 'measuring', 'result_shown'
   ].includes(phase);

   const isMeasuring = phase === 'measuring';

   const showAliceBobRope =
      phase === 'alice_bob_entangle_drag' || aliceBobEntangled;

   const showMessageAliceRope =
      phase === 'message_alice_entangle_drag' || messageAliceEntangled;

   return (
      <>
         {/* Lighting */}
         <ambientLight intensity={0.4} />
         <pointLight position={[10, 10, 10]} intensity={1} color="#00e5ff" />
         <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />
         <spotLight
            position={[0, 10, 0]}
            angle={0.3}
            penumbra={0.8}
            intensity={isMeasuring ? 2 : 0}
            color="#ffffff"
         />

         {/* Grid floor */}
         <gridHelper
            args={[20, 40, '#1e293b', '#0f172a']}
            position={[0, -1.5, 0]}
            rotation={[0, 0, 0]}
         />

         {/* Qubits */}
         <Qubit3D
            type="alice"
            position={POSITIONS.alice}
            showSuperposition={aliceHasSuperposition && !isMeasuring}
            isEntangled={aliceBobEntangled || messageAliceEntangled}
            isMeasuring={isMeasuring}
         />

         <Qubit3D
            type="bob"
            position={POSITIONS.bob}
            isEntangled={aliceBobEntangled}
         />

         <Qubit3D
            type="message"
            position={POSITIONS.message}
            isEntangled={messageAliceEntangled}
            isMeasuring={isMeasuring}
         />

         {/* Hadamard Gate */}
         {showHadamardGate && (
            <HadamardGate
               initialPosition={POSITIONS.hadamardGate}
               targetPosition={POSITIONS.alice}
               onApplied={handleHadamardApplied}
               isActive={phase === 'setup' || phase === 'hadamard_drag'}
            />
         )}

         {/* Entanglement Ropes */}
         {showAliceBobRope && (
            <EntanglementRope
               fromPosition={POSITIONS.alice}
               toPosition={POSITIONS.bob}
               fromLabel="Alice"
               toLabel="Bob"
               isActive={phase === 'alice_bob_entangle_drag'}
               onConnected={handleAliceBobEntangled}
               color="#a855f7"
               side="top"
            />
         )}

         {showMessageAliceRope && (
            <EntanglementRope
               fromPosition={POSITIONS.message}
               toPosition={POSITIONS.alice}
               fromLabel="Message"
               toLabel="Alice"
               isActive={phase === 'message_alice_entangle_drag'}
               onConnected={handleMessageAliceEntangled}
               color="#ec4899"
               side="bottom"
            />
         )}

         {/* Camera controls */}
         <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={5}
            maxDistance={15}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            target={[0, 0, 0]}
         />
      </>
   );
};

// Measure button overlay
const MeasureButton = () => {
   const phase = useTeleportationStore((state) => state.phase);
   const measure = useTeleportationStore((state) => state.measure);
   const showResult = useTeleportationStore((state) => state.showResult);
   const isTourMode = useTeleportationStore((state) => state.isTourMode);
   const advanceTourStep = useTeleportationStore((state) => state.advanceTourStep);

   const handleMeasure = () => {
      measure();
      if (isTourMode) advanceTourStep();
      // Show result after measurement animation
      setTimeout(() => {
         showResult();
         if (isTourMode) advanceTourStep();
      }, 1500);
   };

   if (phase !== 'ready_to_measure') return null;

   return (
      <button
         onClick={handleMeasure}
         className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-gradient-to-r from-quantum-cyan to-quantum-magenta rounded-lg font-quantum font-bold text-white shadow-lg hover:scale-105 transition-transform animate-pulse"
         style={{
            boxShadow: '0 0 30px rgba(0, 229, 255, 0.5), 0 0 60px rgba(236, 72, 153, 0.3)',
         }}
      >
         ⚡ MEASURE
      </button>
   );
};

// Result overlay - positioned at top right, not center
const ResultOverlay = () => {
   const phase = useTeleportationStore((state) => state.phase);
   const qubits = useTeleportationStore((state) => state.qubits);

   if (phase !== 'result_shown') return null;

   return (
      <div className="absolute top-4 right-4 z-40 max-w-sm">
         <div
            className="bg-black/90 backdrop-blur-lg p-6 rounded-xl border border-quantum-cyan/50"
            style={{
               boxShadow: '0 0 30px rgba(0, 229, 255, 0.3)',
            }}
         >
            <h2 className="text-xl font-quantum font-bold text-quantum-cyan mb-3 flex items-center gap-2">
               🎉 Teleportation Complete!
            </h2>

            <div className="space-y-3 text-sm">
               <p className="text-white/90">
                  The quantum state <span className="text-green-400 font-quantum">|1⟩</span> has been
                  successfully teleported from Message to Bob!
               </p>

               <div className="bg-white/5 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center">
                     <span className="text-green-400">Message (was):</span>
                     <span className="font-quantum text-green-400">|1⟩</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-cyan-400">Bob (now):</span>
                     <span className="font-quantum text-cyan-400 font-bold">{qubits.bob.state}</span>
                  </div>
               </div>

               <p className="text-white/60 text-xs italic">
                  Note: No physical qubit traveled - only quantum information was transferred using
                  entanglement and classical communication!
               </p>
            </div>
         </div>
      </div>
   );
};

// Main stage component
export const QuantumStage3D = () => {
   const showWrongStepShake = useTeleportationStore((state) => state.showWrongStepShake);

   return (
      <div
         className={`relative w-full h-full min-h-[500px] ${showWrongStepShake ? 'animate-shake' : ''}`}
      >
         <Canvas
            shadows
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
         >
            <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
            <SceneContent />
         </Canvas>

         <MeasureButton />
         <ResultOverlay />

         {/* Shake animation styles */}
         <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
      </div>
   );
};
