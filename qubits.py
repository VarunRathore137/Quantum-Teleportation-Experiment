import os
from quantum_utils import (
    entangle_qubits,
    process_single_qubit,
    create_bell_state,
    perform_q_teleportation
)
from dataclasses import dataclass, field
from typing import List, Optional

# Set working directory
os.chdir(r"d:\Codes\Quantum-Teleportation-Experiment")

@dataclass
class Qubit:
    id: str
    label: str
    role: str
    isEntangle: bool
    state: str = "|0>"
    EntangleWith: Optional[List[str]] = field(default_factory=list)

# Create sample qubits for teleportation experiment
q1 = Qubit(id='q_01', label="Alice", role="Sender", isEntangle=False)
q2 = Qubit(id='q_02', label="Bob", role="Receiver", isEntangle=False)

def main():
    """Demonstration of quantum teleportation experiment setup"""
    print("=== Quantum Teleportation Experiment ===")
    print(f"Initial Alice (Sender): {q1}")
    print(f"Initial Bob (Receiver): {q2}")
    
    # Step 1: Process individual qubits
    print("\n1. Initializing qubits...")
    alice_result = process_single_qubit(q1)
    bob_result = process_single_qubit(q2)
    print(f"Alice result: {alice_result}")
    print(f"Bob result: {bob_result}")
    
    # Step 2: Create entanglement between Alice and Bob
    print("\n2. Creating entanglement...")
    if not q1.isEntangle or not q2.isEntangle:
        entanglement_result = entangle_qubits(q1, q2)
        print(f"Entanglement result: {entanglement_result}")
    
    print(f"\nFinal Alice: {q1}")
    print(f"Final Bob: {q2}")
    
    # Step 3: Bell state demonstration
    print("\n3. Creating Bell States:")
    demo_result = create_bell_state()
    print(f"Demo result: {demo_result}")

    # Step 4: Quantum Teleportation
    print("\n 4. Create Quantum Teleportation:")
    teleportation_result = perform_q_teleportation(q1,q2)
    print(f"Telep result: {teleportation_result}")


if __name__ == "__main__":
    main()
