# Q# Integration with Python Qubit Objects

This solution allows you to pass Python `Qubit` objects to Q# operations and perform quantum computations while maintaining the metadata and state of your Python objects.

## Solution Overview

### Problem Solved
- **Issue**: You couldn't directly pass Python `Qubit` objects to Q# operations
- **Solution**: Created a Q# `QubitInfo` newtype and Python functions that convert Python objects to Q# format and pass them to quantum operations

### Key Components

1. **Q# QubitInfo newtype** - Stores metadata about qubits
2. **Q# operations** - Process qubits with metadata and perform quantum operations
3. **Python utility functions** - Convert Python objects and call Q# operations
4. **State synchronization** - Updates Python objects based on Q# operation results

## Files Structure

```
├── QuantumEntanglement.qs      # Q# operations and QubitInfo type (CLEAN)
├── quantum_utils.py            # Python utility functions (USE THIS)
├── qubits.py                   # Teleportation experiment demo
├── example_usage.py            # Clean usage demonstration
└── qsharp.json                 # Q# project configuration
```

### File Roles:
- **`quantum_utils.py`** - **Main utility module** - Import functions from here
- **`QuantumEntanglement.qs`** - **Q# backend** - Contains clean, focused Q# operations  
- **`qubits.py`** - **Teleportation demo** - Shows quantum teleportation experiment
- **`example_usage.py`** - **Usage examples** - Clean examples for any Python file

## Usage Examples

### 1. Basic Usage in Any Python File

```python
from quantum_utils import (
    process_qubits_with_metadata, 
    process_single_qubit_with_metadata,
    entangle_qubits
)
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

# Create your qubits
alice = Qubit(id='alice_01', label='Alice', role='Sender', isEntangle=False)
bob = Qubit(id='bob_01', label='Bob', role='Receiver', isEntangle=False)

# Process single qubit with Q#
result = process_single_qubit_with_metadata(alice)
print(f"Alice result: {result}")

# Process two qubits with entanglement
entanglement_result = process_qubits_with_metadata(alice, bob)
print(f"Entanglement result: {entanglement_result}")

# Alice and Bob objects are now updated:
# alice.isEntangle = True
# alice.EntangleWith = ['bob_01']
```

### 2. Available Functions

#### `process_single_qubit_with_metadata(qubit_obj)`
- Processes a single Python qubit using Q# operations
- Passes qubit metadata to Q# and performs quantum operations
- Returns measurement result

#### `process_qubits_with_metadata(qubit1, qubit2)`
- Processes two Python qubits with entanglement
- Creates Bell state (|00⟩ + |11⟩)/√2
- Updates Python objects to reflect entanglement
- Returns (measurement1, measurement2, id1, id2)

#### `entangle_qubits()`
- Simple entanglement without metadata
- Returns (measurement1, measurement2)

## Q# Operations Available

### `ProcessQubits(q1Info: QubitInfo, q2Info: QubitInfo)`
- **Purpose**: Creates Bell state entanglement with metadata tracking
- **Input**: Two `QubitInfo` objects with Python qubit metadata
- **Output**: `(Result, Result, String, String)` - measurements + qubit IDs
- **Use**: Called automatically by `process_qubits_with_metadata()`

### `ProcessSingleQubit(qInfo: QubitInfo)`
- **Purpose**: Processes single qubit based on its metadata
- **Input**: Single `QubitInfo` object
- **Output**: `Result` - measurement result
- **Use**: Called automatically by `process_single_qubit_with_metadata()`

### `CreateBellState()`
- **Purpose**: Simple Bell state creation for demos
- **Input**: None
- **Output**: `(Result, Result)` - measurement results
- **Use**: Called automatically by `entangle_qubits()`

## How It Works

1. **Python to Q# Conversion**: Python `Qubit` objects are converted to Q# `QubitInfo` format
2. **Dynamic Q# Code Generation**: Python generates Q# code strings with your qubit data
3. **Q# Execution**: The generated code is executed using `qsharp.eval()`
4. **State Synchronization**: Python objects are updated based on Q# results

## Key Features

✅ **Metadata Preservation**: Your Python qubit metadata (id, label, role) is passed to Q#  
✅ **State Synchronization**: Python objects updated after Q# operations  
✅ **Type Safety**: Q# `QubitInfo` newtype ensures proper data structure  
✅ **Flexible Usage**: Can be imported and used in any Python file  
✅ **Error Handling**: Comprehensive error handling with informative messages  

## Example Output

```
Processing qubit: alice_01 (Alice) - Role: Sender
Processing qubit: bob_01 (Bob) - Role: Receiver
Initial State:
STATE:
|00⟩: 1.0000+0.0000𝑖
After Hadamard State:
STATE:
|00⟩: 0.7071+0.0000𝑖
|10⟩: 0.7071+0.0000𝑖
After CNOT State:
STATE:
|00⟩: 0.7071+0.0000𝑖
|11⟩: 0.7071+0.0000𝑖
After Measurement State:
STATE:
|00⟩: 1.0000+0.0000𝑖
Result: (Zero, Zero, 'alice_01', 'bob_01')
```

## Running the Examples

```bash
# Run main implementation
python qubits.py

# Run clean example
python example_usage.py
```

This solution provides a robust bridge between Python object-oriented qubit representations and Q# quantum operations, allowing you to leverage the best of both worlds.