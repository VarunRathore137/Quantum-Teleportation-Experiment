"""
Example of how to use Q# operations with Python Qubit objects
"""
from quantum_utils import (
    entangle_qubits, 
    process_qubits_with_metadata, 
    process_single_qubit_with_metadata
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

def main():
    """Demonstrate Q# operation usage with Python Qubit objects"""
    print("=== Q# Integration with Python Qubits Demo ===")
    
    # Create Python qubit objects
    alice = Qubit(id='alice_01', label='Alice Qubit', role='Sender', isEntangle=False)
    bob = Qubit(id='bob_01', label='Bob Qubit', role='Receiver', isEntangle=False)
    
    print(f"\nInitial Alice: {alice}")
    print(f"Initial Bob: {bob}")
    
    # Method 1: Process single qubits
    print("\n1. Processing single qubits:")
    alice_result = process_single_qubit_with_metadata(alice)
    bob_result = process_single_qubit_with_metadata(bob)
    print(f"Alice measurement: {alice_result}")
    print(f"Bob measurement: {bob_result}")
    
    # Method 2: Process qubits together with entanglement
    print("\n2. Processing qubits with entanglement:")
    entanglement_result = process_qubits_with_metadata(alice, bob)
    print(f"Entanglement result: {entanglement_result}")
    
    print(f"\nFinal Alice: {alice}")
    print(f"Final Bob: {bob}")
    
    # Method 3: Simple entanglement without metadata
    print("\n3. Simple entanglement operation:")
    simple_result = entangle_qubits()
    print(f"Simple entanglement result: {simple_result}")

if __name__ == "__main__":
    main()
