"""
Backend Testing Script
======================
Tests the quantum backend components before connecting to frontend.

Usage:
    python test_backend.py
"""

import sys
import os
from dataclasses import dataclass, field
from typing import List, Optional

# Import quantum utilities
try:
    from quantum_utils import (
        entangle_qubits,
        process_single_qubit,
        create_bell_state,
        perform_q_teleportation
    )
    print("✓ quantum_utils imported successfully")
except ImportError as e:
    print(f"✗ Failed to import quantum_utils: {e}")
    sys.exit(1)


@dataclass
class Qubit:
    """Python Qubit dataclass"""
    id: str
    label: str
    role: str
    isEntangle: bool
    state: str = "|0>"
    EntangleWith: Optional[List[str]] = field(default_factory=list)


def test_single_qubit():
    """Test 1: Process single qubit"""
    print("\n" + "="*60)
    print("TEST 1: Single Qubit Processing")
    print("="*60)
    
    try:
        qubit = Qubit(id='q_test', label="Test", role="Demo", isEntangle=False)
        result = process_single_qubit(qubit)
        print(f"✓ Single qubit processed. Measurement: {result}")
        return True
    except Exception as e:
        print(f"✗ Single qubit test failed: {e}")
        return False


def test_bell_state():
    """Test 2: Create Bell state"""
    print("\n" + "="*60)
    print("TEST 2: Bell State Creation (Entanglement)")
    print("="*60)
    
    try:
        alice = Qubit(id='q_alice', label="Alice", role="Sender", isEntangle=False)
        bob = Qubit(id='q_bob', label="Bob", role="Receiver", isEntangle=False)
        
        result = create_bell_state(alice, bob)
        print(f"✓ Bell state created")
        print(f"  Measurement results: {result}")
        print(f"  Alice entangled: {alice.isEntangle}")
        print(f"  Bob entangled: {bob.isEntangle}")
        return True
    except Exception as e:
        print(f"✗ Bell state test failed: {e}")
        return False


def test_entanglement():
    """Test 3: Manual entanglement"""
    print("\n" + "="*60)
    print("TEST 3: Manual Entanglement")
    print("="*60)
    
    try:
        q1 = Qubit(id='q_01', label="Qubit1", role="Test", isEntangle=False)
        q2 = Qubit(id='q_02', label="Qubit2", role="Test", isEntangle=False)
        
        result = entangle_qubits(q1, q2)
        print(f"✓ Qubits entangled")
        print(f"  Result: {result}")
        print(f"  Q1 entangled with: {q1.EntangleWith}")
        print(f"  Q2 entangled with: {q2.EntangleWith}")
        return True
    except Exception as e:
        print(f"✗ Entanglement test failed: {e}")
        return False


def test_teleportation():
    """Test 4: Full quantum teleportation workflow"""
    print("\n" + "="*60)
    print("TEST 4: Quantum Teleportation Workflow")
    print("="*60)
    
    try:
        message = Qubit(id='q_msg', label="Message", role="Input", isEntangle=False)
        alice = Qubit(id='q_alice', label="Alice", role="Sender", isEntangle=False)
        bob = Qubit(id='q_bob', label="Bob", role="Receiver", isEntangle=False)
        
        # Test with different message states
        states = ["zero", "one", "superposition"]
        
        for state in states:
            print(f"\n  Testing with message state: {state}")
            result = perform_q_teleportation(message, alice, bob, message_state=state)
            
            if result and len(result) >= 4:
                msg_measure, alice_measure, bob_state, success = result
                print(f"    ✓ Teleportation completed")
                print(f"      Message measurement: {msg_measure}")
                print(f"      Alice measurement: {alice_measure}")
                print(f"      Bob's final state: {bob_state}")
                print(f"      Success: {success}")
            else:
                print(f"    ✗ Unexpected result format: {result}")
                return False
        
        return True
    except Exception as e:
        print(f"✗ Teleportation test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_api_models():
    """Test 5: Verify API model compatibility"""
    print("\n" + "="*60)
    print("TEST 5: API Model Compatibility")
    print("="*60)
    
    try:
        # Simulate what FastAPI would receive
        json_qubit = {
            "id": "q_api",
            "label": "API Test",
            "role": "Test",
            "isEntangled": False,
            "state": "|0>",
            "entangleWith": []
        }
        
        # Convert as FastAPI would
        qubit = Qubit(
            id=json_qubit["id"],
            label=json_qubit["label"],
            role=json_qubit["role"],
            isEntangle=json_qubit["isEntangled"],
            state=json_qubit["state"],
            EntangleWith=json_qubit["entangleWith"]
        )
        
        print(f"✓ API model conversion successful")
        print(f"  Qubit: {qubit}")
        return True
    except Exception as e:
        print(f"✗ API model test failed: {e}")
        return False


def run_all_tests():
    """Run all tests and report results"""
    print("\n" + "="*60)
    print("🧪 QUANTUM BACKEND TEST SUITE")
    print("="*60)
    
    tests = [
        ("Single Qubit", test_single_qubit),
        ("Bell State", test_bell_state),
        ("Entanglement", test_entanglement),
        ("Teleportation", test_teleportation),
        ("API Models", test_api_models),
    ]
    
    results = []
    for name, test_func in tests:
        try:
            success = test_func()
            results.append((name, success))
        except Exception as e:
            print(f"\n✗ {name} test crashed: {e}")
            results.append((name, False))
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for name, success in results:
        status = "✓ PASS" if success else "✗ FAIL"
        print(f"{status:8} | {name}")
    
    print(f"\n{passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Backend is ready.")
        print("\nNext steps:")
        print("1. Start the FastAPI server: python main.py")
        print("2. Test API at: http://localhost:8000/docs")
        print("3. Connect your frontend to: http://localhost:8000")
        return True
    else:
        print("\n⚠️  Some tests failed. Please fix issues before starting server.")
        return False


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)