"""
Quantum Utils - Python to Q# Bridge
===================================
This module bridges Python and Q# quantum operations.
"""

import qsharp 
import os
from typing import Optional, Tuple, Any

class QuantumOperations:
    """Class to handle Q# quantum operations with automatic error recovery"""
    
    def __init__(self):
        """Initialize Q# environment and load operations"""
        qsharp.init()
        self.qs_code = None
        self._load_qsharp_operations()
    
    def _load_qsharp_operations(self):
        """Load Q# operations from QuantumEntanglement.qs"""
        try:
            with open('QuantumEntanglement.qs', 'r') as f:
                self.qs_code = f.read()
            qsharp.eval(self.qs_code)
            print("✓ Q# operations loaded successfully")
        except FileNotFoundError:
            print("✗ Error: QuantumEntanglement.qs file not found")
            print("  Make sure you're in the correct directory")
        except Exception as e:
            print(f"✗ Error loading Q# operations: {e}")
    
    def _create_qubit_info_dict(self, qubit_obj):
        """Convert Python Qubit object to dictionary"""
        return {
            "id": qubit_obj.id,
            "label": qubit_obj.label,
            "role": qubit_obj.role,
            "isEntangle": qubit_obj.isEntangle,
            "state": qubit_obj.state,
            "entangleWith": qubit_obj.EntangleWith or []
        }
    
    def _build_qubit_info_qs(self, qubit_info: dict, var_name: str = "qInfo") -> str:
        """Build Q# QubitInfo variable declaration string"""
        return f"""let {var_name} = QuantumEntanglement.QubitInfo(
            "{qubit_info['id']}",
            "{qubit_info['label']}",
            "{qubit_info['role']}",
            {str(qubit_info['isEntangle']).lower()},
            "{qubit_info['state']}",
            []
        );"""
    
    def _exec_qsharp(self, code: str) -> Any:
        """Execute Q# code with automatic error recovery"""
        try:
            return qsharp.eval(code)
        except Exception as e:
            error_str = str(e)
            if "NotFound" in error_str and self.qs_code:
                try:
                    print("⟳ Q# definitions lost, reloading...")
                    qsharp.init()
                    qsharp.eval(self.qs_code)
                    return qsharp.eval(code)
                except Exception as retry_error:
                    print(f"✗ Q# execution error after reload: {retry_error}")
                    return None
            else:
                print(f"✗ Q# execution error: {e}")
                return None
    
    def create_bell_state_simple(self):
        """Create simple Bell state without metadata"""
        code = "QuantumEntanglement.CreateBellStatesSimple()"
        return self._exec_qsharp(code)
    
    def create_bell_state_with_metadata(self, qubit1, qubit2):
        """Create Bell state with metadata"""
        q1_info = self._create_qubit_info_dict(qubit1)
        q2_info = self._create_qubit_info_dict(qubit2)
        
        code = f"""
        {self._build_qubit_info_qs(q1_info, "q1Info")}
        {self._build_qubit_info_qs(q2_info, "q2Info")}
        QuantumEntanglement.CreateBellStates(q1Info, q2Info)
        """
        
        return self._exec_qsharp(code)
    
    def process_single_qubit(self, qubit_obj):
        """Process a single Python qubit using Q#"""
        q_info = self._create_qubit_info_dict(qubit_obj)
        
        code = f"""
        {self._build_qubit_info_qs(q_info, "qInfo")}
        QuantumEntanglement.ProcessSingleQubit(qInfo)
        """
        
        return self._exec_qsharp(code)
    
    def perform_teleportation_workflow(
        self, 
        message_qubit, 
        alice_qubit, 
        bob_qubit,
        message_state: str = "superposition"
    ):
        """Execute complete quantum teleportation workflow"""
        msg_info = self._create_qubit_info_dict(message_qubit)
        alice_info = self._create_qubit_info_dict(alice_qubit)
        bob_info = self._create_qubit_info_dict(bob_qubit)
        
        code = f"""
        {self._build_qubit_info_qs(msg_info, "msgInfo")}
        {self._build_qubit_info_qs(alice_info, "aliceInfo")}
        {self._build_qubit_info_qs(bob_info, "bobInfo")}
        QuantumEntanglement.TeleportWorkflow(msgInfo, aliceInfo, bobInfo, "{message_state}")
        """
        
        result = self._exec_qsharp(code)
        
        # Update Python objects to reflect entanglement
        if result:
            alice_qubit.isEntangle = True
            bob_qubit.isEntangle = True
            alice_qubit.EntangleWith = [bob_qubit.id]
            bob_qubit.EntangleWith = [alice_qubit.id]
        
        return result
    
    def process_two_qubits(self, qubit1, qubit2):
        """Process two Python qubits with Q# - creates entanglement"""
        q1_info = self._create_qubit_info_dict(qubit1)
        q2_info = self._create_qubit_info_dict(qubit2)
        
        code = f"""
        {self._build_qubit_info_qs(q1_info, "q1Info")}
        {self._build_qubit_info_qs(q2_info, "q2Info")}
        QuantumEntanglement.ProcessQubits(q1Info, q2Info)
        """
        
        result = self._exec_qsharp(code)
        
        if result:
            qubit1.isEntangle = True
            qubit2.isEntangle = True
            qubit1.EntangleWith = [qubit2.id]
            qubit2.EntangleWith = [qubit1.id]
        
        return result


# Global instance
quantum_ops = QuantumOperations()


# Public API - Convenience functions
def create_bell_state(qubit1=None, qubit2=None):
    """Create Bell state - with or without metadata"""
    if qubit1 and qubit2:
        return quantum_ops.create_bell_state_with_metadata(qubit1, qubit2)
    return quantum_ops.create_bell_state_simple()


def process_single_qubit(qubit_obj):
    """Process single qubit with Q#"""
    return quantum_ops.process_single_qubit(qubit_obj)


def entangle_qubits(qubit1, qubit2):
    """Create entanglement between two qubits"""
    return quantum_ops.process_two_qubits(qubit1, qubit2)


def perform_q_teleportation(
    message_qubit, 
    alice_qubit, 
    bob_qubit, 
    message_state: str = "superposition"
):
    """Perform complete quantum teleportation workflow"""
    return quantum_ops.perform_teleportation_workflow(
        message_qubit, 
        alice_qubit, 
        bob_qubit, 
        message_state
    )