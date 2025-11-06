# Files Overview - Clean Codebase

## 🎯 What to Use

### For ANY Python file - Import from `quantum_utils.py`:

```python
from quantum_utils import (
    process_qubits_with_metadata,      # Process 2 qubits with entanglement  
    process_single_qubit_with_metadata, # Process 1 qubit
    entangle_qubits                    # Simple entanglement demo
)
```

## 📁 File Structure

### `quantum_utils.py` ⭐ **MAIN UTILITY FILE**
- **Use this for imports in your code**
- Contains all the functions you need
- Handles Q# integration automatically
- No duplicate functions, clean interface

**Functions:**
- `process_qubits_with_metadata(qubit1, qubit2)` - Main entanglement function
- `process_single_qubit_with_metadata(qubit_obj)` - Single qubit processing  
- `entangle_qubits()` - Simple Bell state creation

### `QuantumEntanglement.qs` 🔧 **Q# BACKEND**
- **Clean Q# operations only**
- No redundant functions
- Well-documented with XML comments
- You don't need to call these directly

**Operations:**
- `ProcessQubits()` - Creates Bell states with metadata
- `ProcessSingleQubit()` - Processes individual qubits
- `CreateBellState()` - Simple Bell state for demos

### `qubits.py` 🧪 **DEMO FILE** 
- **Quantum teleportation experiment example**
- Shows how to use the utilities
- Clean, focused demonstration
- No duplicate functions

### `example_usage.py` 📖 **USAGE EXAMPLES**
- **Clean examples for any Python file**
- Copy-paste ready code
- Best practices demonstrated

## ✅ What's Fixed

❌ **Before**: Confusing duplicate functions across multiple files  
✅ **After**: Single source of truth in `quantum_utils.py`

❌ **Before**: Similar function names in different files  
✅ **After**: Clear, unique function names with specific purposes

❌ **Before**: Unclear which file to use  
✅ **After**: Always import from `quantum_utils.py`

## 🚀 Quick Start

```python
# In any Python file:
from quantum_utils import process_qubits_with_metadata
from dataclasses import dataclass, field
from typing import List, Optional

@dataclass
class Qubit:
    id: str
    label: str
    role: str
    isEntangle: bool
    state: str = "|0>"
    EntangleWith: Optional[List[str]] = field(default_factory=list)

# Create qubits
alice = Qubit(id='alice', label='Alice', role='Sender', isEntangle=False)
bob = Qubit(id='bob', label='Bob', role='Receiver', isEntangle=False)

# Use Q# operations
result = process_qubits_with_metadata(alice, bob)
print(f"Result: {result}")
print(f"Alice now entangled with: {alice.EntangleWith}")
```

**That's it! Clean, simple, no confusion.**