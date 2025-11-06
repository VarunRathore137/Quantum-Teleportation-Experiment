# 3D Quantum Entanglement Visualization Blueprint

## Overview
Interactive "Tour Mode" visualization showing quantum entanglement between Alice and Bob qubits as 3D atom-like spheres with a quantum link.

## Visual Layout

```
┌─────────────────────────────────────────────────────────────┐
│                    QUANTUM TOUR MODE                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                                                             │
│     🔴 Alice                           🔵 Bob             │
│    (Sender)          ≋≋≋≋≋≋≋          (Receiver)          │
│       ●             quantum             ●                   │
│      ╱ ╲             link              ╱ ╲                 │
│     ●   ●                              ●   ●                │
│      ╲ ╱                                ╲ ╱                 │
│       ●                                  ●                  │
│                                                             │
│  State: |0⟩                           State: |0⟩           │
│  Entangled: false                     Entangled: false     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [Toggle Entanglement]  [Reset]  [Teleport]                │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

### Recommended: Three.js + React Three Fiber

```bash
npm install three @react-three/fiber @react-three/drei
```

### Alternative: Babylon.js
```bash
npm install @babylonjs/core @babylonjs/react
```

## Component Structure

```javascript
QuantumVisualization/
├── components/
│   ├── QuantumAtom.jsx       // 3D atom sphere with electrons
│   ├── QuantumLink.jsx        // Animated connection line
│   ├── ControlPanel.jsx       // Buttons and controls
│   └── Scene.jsx              // Main 3D scene container
├── hooks/
│   ├── useQuantumState.js     // Python Q# integration
│   └── useAnimation.js        // Animation logic
└── QuantumTourMode.jsx        // Main component
```

## Code Blueprint

### 1. QuantumAtom.jsx (3D Atom Component)

```javascript
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Trail } from '@react-three/drei';

export function QuantumAtom({ 
  position, 
  color, 
  label, 
  isEntangled,
  state 
}) {
  const nucleusRef = useRef();
  const electronRefs = useRef([]);

  // Rotate electrons
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Nucleus pulse when entangled
    if (isEntangled && nucleusRef.current) {
      nucleusRef.current.scale.set(
        1 + Math.sin(time * 2) * 0.1,
        1 + Math.sin(time * 2) * 0.1,
        1 + Math.sin(time * 2) * 0.1
      );
    }

    // Rotate electrons in orbits
    electronRefs.current.forEach((electron, i) => {
      if (electron) {
        const angle = time + (i * Math.PI * 2) / 3;
        const radius = 1.5;
        electron.position.x = Math.cos(angle) * radius;
        electron.position.y = Math.sin(angle) * radius;
        electron.position.z = Math.sin(angle * 2) * 0.5;
      }
    });
  });

  return (
    <group position={position}>
      {/* Nucleus */}
      <Sphere ref={nucleusRef} args={[0.8, 32, 32]}>
        <meshStandardMaterial 
          color={color}
          emissive={isEntangled ? color : '#000000'}
          emissiveIntensity={isEntangled ? 0.5 : 0}
          roughness={0.3}
          metalness={0.7}
        />
      </Sphere>

      {/* Electrons */}
      {[0, 1, 2].map((i) => (
        <Trail
          key={i}
          width={2}
          length={6}
          color={color}
          attenuation={(t) => t * t}
        >
          <Sphere
            ref={(el) => (electronRefs.current[i] = el)}
            args={[0.15, 16, 16]}
          >
            <meshStandardMaterial 
              color="#ffffff"
              emissive={color}
              emissiveIntensity={0.8}
            />
          </Sphere>
        </Trail>
      ))}

      {/* Label */}
      <Html position={[0, -2.5, 0]} center>
        <div style={{
          color: 'white',
          fontSize: '20px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          {label}
          <br />
          <span style={{ fontSize: '14px' }}>
            State: {state}
          </span>
        </div>
      </Html>
    </group>
  );
}
```

### 2. QuantumLink.jsx (Entanglement Connection)

```javascript
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';

export function QuantumLink({ 
  start, 
  end, 
  isActive 
}) {
  const lineRef = useRef();
  const particlesRef = useRef([]);

  useFrame((state) => {
    if (!isActive) return;

    const time = state.clock.getElapsedTime();
    
    // Animate particles along the link
    particlesRef.current.forEach((particle, i) => {
      if (particle) {
        const t = ((time * 0.5) + i * 0.2) % 1;
        const x = start[0] + (end[0] - start[0]) * t;
        const y = start[1] + (end[1] - start[1]) * t;
        const z = start[2] + (end[2] - start[2]) * t;
        
        particle.position.set(x, y, z);
        particle.material.opacity = Math.sin(t * Math.PI);
      }
    });

    // Pulse the main line
    if (lineRef.current) {
      lineRef.current.material.opacity = 0.3 + Math.sin(time * 3) * 0.3;
    }
  });

  if (!isActive) return null;

  return (
    <group>
      {/* Main quantum link line */}
      <Line
        ref={lineRef}
        points={[start, end]}
        color="#00ffff"
        lineWidth={2}
        dashed
        dashScale={20}
        transparent
        opacity={0.5}
      />

      {/* Entanglement particles */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          ref={(el) => (particlesRef.current[i] = el)}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial 
            color="#00ffff"
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* Wave effect */}
      <mesh position={[
        (start[0] + end[0]) / 2,
        (start[1] + end[1]) / 2,
        (start[2] + end[2]) / 2
      ]}>
        <torusGeometry args={[1, 0.1, 16, 100]} />
        <meshStandardMaterial 
          color="#00ffff"
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>
    </group>
  );
}
```

### 3. QuantumTourMode.jsx (Main Scene)

```javascript
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import { QuantumAtom } from './QuantumAtom';
import { QuantumLink } from './QuantumLink';
import { ControlPanel } from './ControlPanel';
import { useQuantumState } from '../hooks/useQuantumState';

export function QuantumTourMode() {
  const {
    alice,
    bob,
    isEntangled,
    toggleEntanglement,
    reset,
    performTeleportation
  } = useQuantumState();

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* Background */}
        <Stars 
          radius={300} 
          depth={50} 
          count={5000} 
          factor={4} 
          fade 
        />
        <Environment preset="night" />

        {/* Alice (Red, Left) */}
        <QuantumAtom
          position={[-4, 0, 0]}
          color="#ff3333"
          label="Alice"
          isEntangled={isEntangled}
          state={alice.state}
        />

        {/* Bob (Blue, Right) */}
        <QuantumAtom
          position={[4, 0, 0]}
          color="#3333ff"
          label="Bob"
          isEntangled={isEntangled}
          state={bob.state}
        />

        {/* Quantum Link */}
        <QuantumLink
          start={[-4, 0, 0]}
          end={[4, 0, 0]}
          isActive={isEntangled}
        />

        {/* Camera Controls */}
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          minDistance={5}
          maxDistance={20}
        />
      </Canvas>

      {/* Control Panel */}
      <ControlPanel
        isEntangled={isEntangled}
        onToggleEntanglement={toggleEntanglement}
        onReset={reset}
        onTeleport={performTeleportation}
        alice={alice}
        bob={bob}
      />
    </div>
  );
}
```

### 4. useQuantumState.js (Python Integration Hook)

```javascript
import { useState, useEffect } from 'react';

export function useQuantumState() {
  const [alice, setAlice] = useState({
    id: 'alice_01',
    label: 'Alice',
    role: 'Sender',
    state: '|0⟩',
    isEntangled: false
  });

  const [bob, setBob] = useState({
    id: 'bob_01',
    label: 'Bob',
    role: 'Receiver',
    state: '|0⟩',
    isEntangled: false
  });

  const [isEntangled, setIsEntangled] = useState(false);

  // Call Python backend via API
  const toggleEntanglement = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/entangle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          qubit1: alice, 
          qubit2: bob 
        })
      });

      const result = await response.json();
      
      setAlice(prev => ({ ...prev, isEntangled: true }));
      setBob(prev => ({ ...prev, isEntangled: true }));
      setIsEntangled(true);

      console.log('Entanglement result:', result);
    } catch (error) {
      console.error('Entanglement error:', error);
    }
  };

  const reset = () => {
    setAlice(prev => ({ ...prev, state: '|0⟩', isEntangled: false }));
    setBob(prev => ({ ...prev, state: '|0⟩', isEntangled: false }));
    setIsEntangled(false);
  };

  const performTeleportation = async () => {
    // Call Python Q# teleportation operation
    console.log('Performing quantum teleportation...');
  };

  return {
    alice,
    bob,
    isEntangled,
    toggleEntanglement,
    reset,
    performTeleportation
  };
}
```

### 5. Flask Backend (Python Q# Integration)

```python
# api_server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from quantum_utils import entangle_qubits
from dataclasses import dataclass, field, asdict
from typing import List, Optional

app = Flask(__name__)
CORS(app)

@dataclass
class Qubit:
    id: str
    label: str
    role: str
    isEntangle: bool
    state: str = "|0>"
    EntangleWith: Optional[List[str]] = field(default_factory=list)

@app.route('/api/entangle', methods=['POST'])
def entangle():
    data = request.json
    
    # Convert JSON to Qubit objects
    q1_data = data['qubit1']
    q2_data = data['qubit2']
    
    q1 = Qubit(**q1_data)
    q2 = Qubit(**q2_data)
    
    # Call Q# operation
    result = entangle_qubits(q1, q2)
    
    return jsonify({
        'result': str(result),
        'alice': asdict(q1),
        'bob': asdict(q2)
    })

@app.route('/api/teleport', methods=['POST'])
def teleport():
    # Implement teleportation
    pass

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

## Styling & Effects

### CSS for Control Panel

```css
.control-panel {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 255, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
}

.quantum-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 12px 24px;
  margin: 0 10px;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quantum-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.quantum-button:active {
  transform: scale(0.95);
}

.entangled {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

## Features

✅ **3D Rotating Atoms** - Alice (red) and Bob (blue) with orbiting electrons  
✅ **Animated Quantum Link** - Pulsing cyan connection when entangled  
✅ **Interactive Controls** - Toggle entanglement, reset, teleport  
✅ **Real-time Q# Integration** - Python backend calls Q# operations  
✅ **Particle Effects** - Particles travel along the quantum link  
✅ **State Visualization** - Display quantum states below each atom  
✅ **Camera Controls** - Orbit, zoom, pan around the scene  

## Next Steps

1. **Setup React Project**
   ```bash
   npx create-react-app quantum-viz
   cd quantum-viz
   npm install three @react-three/fiber @react-three/drei
   ```

2. **Start Python Backend**
   ```bash
   pip install flask flask-cors
   python api_server.py
   ```

3. **Run Development Server**
   ```bash
   npm start
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

This creates an immersive, interactive quantum entanglement visualization perfect for educational demonstrations!