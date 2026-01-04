import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
   count?: number;
}

const ParticleField = ({ count = 150 }: ParticleFieldProps) => {
   const meshRef = useRef<THREE.Points>(null);
   const timeRef = useRef(0);

   // Generate particle positions and properties
   const { positions, colors, sizes, phases } = useMemo(() => {
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      const phases = new Float32Array(count);

      // Quantum theme colors
      const colorPalette = [
         new THREE.Color('hsl(187, 100%, 50%)'), // Cyan
         new THREE.Color('hsl(255, 67%, 68%)'),  // Purple
         new THREE.Color('hsl(320, 100%, 62%)'), // Magenta
      ];

      for (let i = 0; i < count; i++) {
         // Spread particles across the viewport
         positions[i * 3] = (Math.random() - 0.5) * 20;     // x
         positions[i * 3 + 1] = (Math.random() - 0.5) * 12; // y
         positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z

         // Random color from palette
         const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
         colors[i * 3] = color.r;
         colors[i * 3 + 1] = color.g;
         colors[i * 3 + 2] = color.b;

         // Random sizes
         sizes[i] = Math.random() * 3 + 1;

         // Random phase for wave motion
         phases[i] = Math.random() * Math.PI * 2;
      }

      return { positions, colors, sizes, phases };
   }, [count]);

   // Animate particles with wave interference pattern
   useFrame((_, delta) => {
      if (!meshRef.current) return;

      timeRef.current += delta * 0.5;
      const time = timeRef.current;

      const positionArray = meshRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < count; i++) {
         const i3 = i * 3;
         const phase = phases[i];

         // Wave interference pattern
         const originalX = positions[i3];
         const originalY = positions[i3 + 1];

         // Double-slit interference effect
         const wave1 = Math.sin(time + phase + originalX * 0.5) * 0.3;
         const wave2 = Math.sin(time * 1.3 + phase + originalY * 0.4) * 0.2;

         positionArray[i3 + 1] = originalY + wave1 + wave2;
         positionArray[i3 + 2] = positions[i3 + 2] + Math.sin(time * 0.7 + phase) * 0.4;
      }

      meshRef.current.geometry.attributes.position.needsUpdate = true;
   });

   return (
      <points ref={meshRef}>
         <bufferGeometry>
            <bufferAttribute
               attach="attributes-position"
               count={count}
               array={positions}
               itemSize={3}
            />
            <bufferAttribute
               attach="attributes-color"
               count={count}
               array={colors}
               itemSize={3}
            />
            <bufferAttribute
               attach="attributes-size"
               count={count}
               array={sizes}
               itemSize={1}
            />
         </bufferGeometry>
         <pointsMaterial
            size={0.08}
            vertexColors
            transparent
            opacity={0.7}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
            depthWrite={false}
         />
      </points>
   );
};

// Floating orbs for extra depth
const FloatingOrbs = () => {
   const orbsRef = useRef<THREE.Group>(null);

   useFrame((state) => {
      if (!orbsRef.current) return;
      orbsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      orbsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
   });

   const orbs = useMemo(() => {
      return Array.from({ length: 5 }, (_, i) => ({
         position: [
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 5 - 3,
         ] as [number, number, number],
         scale: Math.random() * 0.5 + 0.3,
         color: ['#00e5ff', '#a855f7', '#ec4899'][i % 3],
      }));
   }, []);

   return (
      <group ref={orbsRef}>
         {orbs.map((orb, i) => (
            <mesh key={i} position={orb.position}>
               <sphereGeometry args={[orb.scale, 16, 16]} />
               <meshBasicMaterial
                  color={orb.color}
                  transparent
                  opacity={0.15}
               />
            </mesh>
         ))}
      </group>
   );
};

export const QuantumParticles = () => {
   return (
      <div className="fixed inset-0 z-[5] pointer-events-none">
         <Canvas
            camera={{ position: [0, 0, 8], fov: 60 }}
            gl={{ alpha: true, antialias: true }}
            style={{ background: 'transparent' }}
         >
            <ambientLight intensity={0.5} />
            <ParticleField count={120} />
            <FloatingOrbs />
         </Canvas>
      </div>
   );
};
