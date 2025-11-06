# Quantum Teleportation Experiment

An interactive, educational visualization of quantum teleportation built with React and TypeScript. Experience quantum mechanics through a cinematic, 3D interface designed for learners at all levels.

## ✨ Features

- **Interactive 3D Visualization**: Real-time quantum state representation with particle effects
- **Multi-Mode Experience**: 
  - 🎓 **Guided Tour**: Step-by-step educational walkthrough
  - 🔬 **Explorer Mode**: Free exploration of quantum concepts
  - 🧪 **Researcher Mode**: Advanced controls and data analysis
- **Timeline Control**: Navigate through the 7 phases of quantum teleportation
- **Real Quantum Physics**: Proper implementation of complex quantum states, Bell pairs, and measurement
- **Educational Tools**: Built-in glossary, legend, and contextual explanations

## Advanced Features

✅ **3D Rotating Atoms** - Alice (red) and Bob (blue) with orbiting electrons  
✅ **Animated Quantum Link** - Pulsing cyan connection when entangled  
✅ **Interactive Controls** - Toggle entanglement, reset, teleport  
✅ **Real-time Q# Integration** - Python backend calls Q# operations  
✅ **Particle Effects** - Particles travel along the quantum link  
✅ **State Visualization** - Display quantum states below each atom  
✅ **Camera Controls** - Orbit, zoom, pan around the scene  


## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Opens at http://localhost:8080

# Build for production
npm run build
```

### Windows PowerShell Users

If you encounter execution policy issues, use:
```powershell
node ./node_modules/vite/bin/vite.js
```

## 📚 Quantum Teleportation Process

Experience all 7 phases of quantum teleportation:

1. **Setup** - Initialize qubits and quantum system
2. **Entangle** - Create Bell pair between Alice and Bob
3. **Prepare** - Set the message qubit state
4. **Measure** - Alice performs Bell state measurement
5. **Communicate** - Send classical bits via classical channel
6. **Reconstruct** - Bob applies correction gates
7. **Verify** - Confirm successful state teleportation

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS with custom quantum theme
- **State Management**: Zustand
- **3D Visualization**: Ready for Three.js integration
- **Physics**: Custom quantum mechanics implementation

## 🎓 Educational Value

Perfect for:
- Physics students learning quantum mechanics
- Educators demonstrating quantum concepts
- Researchers exploring quantum teleportation
- Anyone curious about quantum computing

## 📝 Development Status

This is an active educational project. More detailed documentation will be added upon completion.

---

*Built with ❤️ for quantum education and exploration*
