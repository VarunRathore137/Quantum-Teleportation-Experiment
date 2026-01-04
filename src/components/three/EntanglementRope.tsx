import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, QuadraticBezierLine } from '@react-three/drei';
import * as THREE from 'three';
import { useTeleportationStore } from '@/state/teleportationStore';

interface EntanglementRopeProps {
   fromPosition: [number, number, number];
   toPosition: [number, number, number];
   fromLabel: string;
   toLabel: string;
   isActive: boolean;
   onConnected: () => void;
   color?: string;
   side?: 'top' | 'bottom';
}

export const EntanglementRope = ({
   fromPosition,
   toPosition,
   fromLabel,
   toLabel,
   isActive,
   onConnected,
   color = '#a855f7',
   side = 'top',
}: EntanglementRopeProps) => {
   const lineRef = useRef<THREE.Group>(null);
   const [step, setStep] = useState<'idle' | 'from_selected' | 'animating' | 'connected'>('idle');
   const animationProgress = useRef(0);

   const triggerWrongStepShake = useTeleportationStore((state) => state.triggerWrongStepShake);
   const isTourMode = useTeleportationStore((state) => state.isTourMode);

   // Calculate control point for bezier curve
   const controlPoint = useMemo(() => {
      const midX = (fromPosition[0] + toPosition[0]) / 2;
      const midY = (fromPosition[1] + toPosition[1]) / 2;
      const offset = side === 'top' ? 1.2 : -1.2;
      return [midX, midY + offset, 0] as [number, number, number];
   }, [fromPosition, toPosition, side]);

   // Calculate current end position based on animation
   const currentEndPosition = useMemo(() => {
      if (step === 'connected') return toPosition;
      if (step === 'animating') {
         const t = animationProgress.current;
         return [
            fromPosition[0] + (toPosition[0] - fromPosition[0]) * t,
            fromPosition[1] + (toPosition[1] - fromPosition[1]) * t,
            fromPosition[2],
         ] as [number, number, number];
      }
      return fromPosition;
   }, [fromPosition, toPosition, step]);

   // Animation loop
   useFrame((state, delta) => {
      if (!lineRef.current) return;

      if (step === 'animating') {
         animationProgress.current = Math.min(1, animationProgress.current + delta * 2);

         if (animationProgress.current >= 1) {
            setStep('connected');
            onConnected();
         }
      }

      // Pulsing glow when connected
      if (step === 'connected') {
         const time = state.clock.elapsedTime;
         const pulse = 0.8 + Math.sin(time * 3) * 0.2;
         lineRef.current.children.forEach((child) => {
            if ((child as THREE.Mesh).material && 'opacity' in (child as THREE.Mesh).material) {
               ((child as THREE.Mesh).material as THREE.Material).opacity = pulse;
            }
         });
      }
   });

   const handleFromClick = () => {
      if (!isActive && isTourMode) {
         triggerWrongStepShake();
         return;
      }
      if (!isActive || step !== 'idle') return;

      setStep('from_selected');

      // Store this rope's target click handler
      if (typeof window !== 'undefined') {
         (window as any).__entanglementTarget = {
            toPosition,
            onTargetClick: () => {
               setStep('animating');
               animationProgress.current = 0;
               (window as any).__entanglementTarget = null;
            }
         };
      }
   };

   const handleToClick = () => {
      if (step === 'from_selected' && typeof window !== 'undefined') {
         const target = (window as any).__entanglementTarget;
         if (target && target.onTargetClick) {
            target.onTargetClick();
         }
      }
   };

   if (!isActive && step === 'idle') return null;

   const showLine = step === 'from_selected' || step === 'animating' || step === 'connected';

   return (
      <group ref={lineRef}>
         {/* Source handle - clickable */}
         <mesh
            position={fromPosition}
            onClick={handleFromClick}
         >
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial
               color={color}
               emissive={color}
               emissiveIntensity={step === 'from_selected' ? 1 : 0.5}
            />
         </mesh>

         {/* Target handle - clickable when source is selected */}
         {(step === 'from_selected' || step === 'connected') && (
            <mesh
               position={toPosition}
               onClick={handleToClick}
            >
               <sphereGeometry args={[0.15, 16, 16]} />
               <meshStandardMaterial
                  color={step === 'connected' ? color : '#ffffff'}
                  emissive={step === 'connected' ? color : '#ffffff'}
                  emissiveIntensity={step === 'from_selected' ? 1 : 0.5}
                  transparent={step !== 'connected'}
                  opacity={step === 'from_selected' ? 0.8 : 1}
               />
            </mesh>
         )}

         {/* Rope line */}
         {showLine && (
            <>
               <QuadraticBezierLine
                  start={fromPosition}
                  end={step === 'connected' ? toPosition :
                     step === 'animating' ? [
                        fromPosition[0] + (toPosition[0] - fromPosition[0]) * animationProgress.current,
                        fromPosition[1] + (toPosition[1] - fromPosition[1]) * animationProgress.current,
                        fromPosition[2]
                     ] as [number, number, number] :
                        fromPosition}
                  mid={step === 'connected' || step === 'animating' ? controlPoint : fromPosition}
                  color={color}
                  lineWidth={4}
                  transparent
                  opacity={step === 'connected' ? 1 : 0.7}
               />

               {/* Glow line */}
               <QuadraticBezierLine
                  start={fromPosition}
                  end={step === 'connected' ? toPosition :
                     step === 'animating' ? [
                        fromPosition[0] + (toPosition[0] - fromPosition[0]) * animationProgress.current,
                        fromPosition[1] + (toPosition[1] - fromPosition[1]) * animationProgress.current,
                        fromPosition[2]
                     ] as [number, number, number] :
                        fromPosition}
                  mid={step === 'connected' || step === 'animating' ? controlPoint : fromPosition}
                  color={color}
                  lineWidth={8}
                  transparent
                  opacity={0.3}
               />
            </>
         )}

         {/* CNOT label */}
         {step === 'connected' && (
            <Html position={controlPoint} center style={{ pointerEvents: 'none' }}>
               <div
                  className="font-quantum text-xs px-2 py-1 rounded"
                  style={{
                     backgroundColor: 'rgba(0,0,0,0.7)',
                     color: color,
                     border: `1px solid ${color}`,
                     textShadow: `0 0 10px ${color}`,
                  }}
               >
                  CNOT
               </div>
            </Html>
         )}

         {/* Instructions */}
         {isActive && step === 'idle' && (
            <Html position={fromPosition} center style={{ pointerEvents: 'none' }}>
               <div className="text-white/90 text-xs font-quantum whitespace-nowrap animate-pulse mt-10 px-2 py-1 bg-black/50 rounded">
                  👆 Click to start entanglement
               </div>
            </Html>
         )}

         {step === 'from_selected' && (
            <Html position={toPosition} center style={{ pointerEvents: 'none' }}>
               <div className="text-white/90 text-xs font-quantum whitespace-nowrap animate-pulse mt-10 px-2 py-1 bg-black/50 rounded">
                  👆 Click {toLabel} to connect
               </div>
            </Html>
         )}

         {/* Entanglement particles effect when connected */}
         {step === 'connected' && <EntanglementParticles from={fromPosition} to={toPosition} color={color} />}
      </group>
   );
};

// Particle effect along the entanglement rope
const EntanglementParticles = ({
   from,
   to,
   color
}: {
   from: [number, number, number];
   to: [number, number, number];
   color: string;
}) => {
   const particlesRef = useRef<THREE.Points>(null);
   const positionsRef = useRef<Float32Array>();

   const count = 20;

   if (!positionsRef.current) {
      positionsRef.current = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
         positionsRef.current[i * 3] = from[0];
         positionsRef.current[i * 3 + 1] = from[1];
         positionsRef.current[i * 3 + 2] = from[2];
      }
   }

   useFrame((state) => {
      if (!particlesRef.current || !positionsRef.current) return;

      const time = state.clock.elapsedTime;

      for (let i = 0; i < count; i++) {
         const t = ((time * 0.5 + i / count) % 1);
         positionsRef.current[i * 3] = from[0] + (to[0] - from[0]) * t;
         positionsRef.current[i * 3 + 1] = from[1] + (to[1] - from[1]) * t + Math.sin(t * Math.PI) * 0.5;
         positionsRef.current[i * 3 + 2] = from[2];
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
   });

   return (
      <points ref={particlesRef}>
         <bufferGeometry>
            <bufferAttribute
               attach="attributes-position"
               count={count}
               array={positionsRef.current!}
               itemSize={3}
            />
         </bufferGeometry>
         <pointsMaterial
            size={0.08}
            color={color}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
         />
      </points>
   );
};
