import os
from quantum_utils import (
    entangle_qubits,
    process_single_qubit,
    create_bell_state,
    perform_q_teleportation
)
from dataclasses import dataclass, field
from typing import List, Optional

# Set working directory - UPDATE THIS PATH TO YOUR PROJECT FOLDER
os.chdir(r"D:\Codes\Quantum-Teleportation-Experiment")

@dataclass
class Qubit:
    """
    Python representation of a quantum qubit with metadata
    This dataclass stores all information about a qubit for Python-side tracking
    """
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
    print("=" * 70)
    print("=== Quantum Teleportation Experiment ===")
    print("=" * 70)
    print(f"Initial Alice (Sender): {q1}")
    print(f"Initial Bob (Receiver): {q2}")
    
    # Step 1: Process individual qubits
    print("\n" + "="*70)
    print("STEP 1: Initializing qubits...")
    print("="*70)
    alice_result = process_single_qubit(q1)
    bob_result = process_single_qubit(q2)
    print(f"✓ Alice result: {alice_result}")
    print(f"✓ Bob result: {bob_result}")

    # Step 2: Create entanglement between Alice and Bob
    print("\n" + "="*70)
    print("STEP 2: Creating entanglement...")
    print("="*70)
    if not q1.isEntangle or not q2.isEntangle:
        entanglement_result = entangle_qubits(q1, q2)
        print(f"✓ Entanglement result: {entanglement_result}")
    
    print(f"\n✓ Final Alice: {q1}")
    print(f"✓ Final Bob: {q2}")

    # Step 3: Bell state demonstration
    print("\n" + "="*70)
    print("STEP 3: Creating Bell States:")
    print("="*70)
    demo_result = create_bell_state(q1, q2)
    print(f"✓ Demo result: {demo_result}")

    # Step 4: Quantum Teleportation - Full Workflow
    print("\n" + "="*70)
    print("STEP 4: Performing Complete Quantum Teleportation")
    print("="*70)
    
    # Create fresh qubits for teleportation
    message = Qubit(id='q_msg', label="Message", role="Input", isEntangle=False)
    alice = Qubit(id='q_alice', label="Alice", role="Sender", isEntangle=False)
    bob = Qubit(id='q_bob', label="Bob", role="Receiver", isEntangle=False)
    
    # Test different message states
    test_states = ["zero", "one", "superposition"]
    
    for state in test_states:
        print(f"\n--- Testing with message state: {state} ---")
        teleportation_result = perform_q_teleportation(
            message, 
            alice, 
            bob, 
            message_state=state
        )
        
        if teleportation_result and len(teleportation_result) >= 4:
            msg_measure, alice_measure, bob_state, success = teleportation_result
            print(f"✓ Message measurement: {msg_measure}")
            print(f"✓ Alice measurement: {alice_measure}")
            print(f"✓ Bob's final state: {bob_state}")
            print(f"✓ Teleportation success: {success}")
        else:
            print(f"✗ Unexpected result: {teleportation_result}")
    
    print("\n" + "="*70)
    print("=== Experiment Complete ===")
    print("="*70)

if __name__ == "__main__":
    main()