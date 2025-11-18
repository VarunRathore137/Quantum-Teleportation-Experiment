"""
FastAPI Backend for Quantum Teleportation Experiment
=====================================================
REST API server that exposes quantum operations via HTTP endpoints
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uvicorn
from quantum_utils import (
    entangle_qubits,
    process_single_qubit,
    create_bell_state,
    perform_q_teleportation,
    QuantumOperations
)
from dataclasses import asdict
import json

# Initialize FastAPI app
app = FastAPI(
    title="Quantum Teleportation API",
    description="Backend API for quantum teleportation experiments using Q#",
    version="1.0.0"
)

# CORS middleware - allows frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# REQUEST/RESPONSE MODELS
# ============================================================================

class QubitRequest(BaseModel):
    """Matches the JavaScript Qubit structure from frontend"""
    id: str
    label: str
    role: str
    isEntangled: bool = False
    state: str = "|0>"
    entangleWith: List[str] = []


class TeleportationRequest(BaseModel):
    """Request body for teleportation endpoint"""
    messageQubit: QubitRequest
    aliceQubit: QubitRequest
    bobQubit: QubitRequest
    messageState: Optional[str] = "superposition"
    

class TeleportationResponse(BaseModel):
    """Response with full teleportation results"""
    success: bool
    message: str
    results: Dict[str, Any]
    quantumSteps: List[Dict[str, str]]


class BellStateResponse(BaseModel):
    """Response for Bell state creation"""
    success: bool
    measurement1: int
    measurement2: int
    bellState: str
    explanation: str


# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def convert_to_python_qubit(qubit_req: QubitRequest):
    """Convert Pydantic model to internal Qubit dataclass"""
    from qubits import Qubit
    
    qubit = Qubit(
        id=qubit_req.id,
        label=qubit_req.label,
        role=qubit_req.role,
        isEntangle=qubit_req.isEntangled,
        state=qubit_req.state,
        EntangleWith=qubit_req.entangleWith if qubit_req.entangleWith else []
    )
    return qubit


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "Quantum Teleportation API",
        "status": "operational",
        "quantum_backend": "Q# via Python",
        "endpoints": {
            "teleport": "/api/teleport",
            "bell-state": "/api/bell-state",
            "entangle": "/api/entangle",
            "measure": "/api/measure"
        }
    }


@app.post("/api/teleport", response_model=TeleportationResponse)
async def teleport_quantum_state(request: TeleportationRequest):
    """
    Main teleportation endpoint - executes full Q# teleportation workflow
    """
    try:
        # Convert request models to Python Qubit objects
        message_qubit = convert_to_python_qubit(request.messageQubit)
        alice_qubit = convert_to_python_qubit(request.aliceQubit)
        bob_qubit = convert_to_python_qubit(request.bobQubit)
        
        # Execute Q# teleportation workflow
        result = perform_q_teleportation(
            message_qubit, 
            alice_qubit, 
            bob_qubit,
            message_state=request.messageState
        )
        
        # Parse Q# results
        if result and len(result) >= 4:
            msg_measure = int(result[0])
            alice_measure = int(result[1])
            bob_state = str(result[2])
            teleport_success = bool(result[3])
            
            # Build step-by-step explanation
            quantum_steps = [
                {
                    "phase": "initialization",
                    "description": f"Message qubit prepared in {request.messageState} state"
                },
                {
                    "phase": "entanglement",
                    "description": "Bell pair created between Alice and Bob: (|00⟩ + |11⟩)/√2"
                },
                {
                    "phase": "bell_measurement",
                    "description": f"Alice measured: message={msg_measure}, alice={alice_measure}"
                },
                {
                    "phase": "classical_communication",
                    "description": f"Classical bits {msg_measure}{alice_measure} sent to Bob"
                },
                {
                    "phase": "correction",
                    "description": f"Bob applied correction gates based on measurements"
                },
                {
                    "phase": "verification",
                    "description": f"Bob's final state: {bob_state}"
                }
            ]
            
            return TeleportationResponse(
                success=teleport_success,
                message="Quantum teleportation completed successfully",
                results={
                    "messageMeasurement": msg_measure,
                    "aliceMeasurement": alice_measure,
                    "bobFinalState": bob_state,
                    "classicalBits": f"{msg_measure}{alice_measure}",
                    "teleportationSuccess": teleport_success
                },
                quantumSteps=quantum_steps
            )
        else:
            raise HTTPException(
                status_code=500, 
                detail="Q# teleportation returned unexpected result format"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Quantum operation failed: {str(e)}"
        )


@app.post("/api/bell-state", response_model=BellStateResponse)
async def create_bell_pair(alice: QubitRequest, bob: QubitRequest):
    """Create entangled Bell pair between two qubits"""
    try:
        alice_qubit = convert_to_python_qubit(alice)
        bob_qubit = convert_to_python_qubit(bob)
        
        result = create_bell_state(alice_qubit, bob_qubit)
        
        m1 = int(result[0])
        m2 = int(result[1])
        
        return BellStateResponse(
            success=True,
            measurement1=m1,
            measurement2=m2,
            bellState="(|00⟩ + |11⟩)/√2",
            explanation=f"Qubits measured as {m1} and {m2} (correlated due to entanglement)"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/entangle")
async def entangle_qubits_endpoint(qubit1: QubitRequest, qubit2: QubitRequest):
    """Create entanglement between any two qubits"""
    try:
        q1 = convert_to_python_qubit(qubit1)
        q2 = convert_to_python_qubit(qubit2)
        
        result = entangle_qubits(q1, q2)
        
        return {
            "success": True,
            "entangled": True,
            "qubit1": {
                "id": q1.id,
                "label": q1.label,
                "isEntangled": q1.isEntangle,
                "entangleWith": q1.EntangleWith
            },
            "qubit2": {
                "id": q2.id,
                "label": q2.label,
                "isEntangled": q2.isEntangle,
                "entangleWith": q2.EntangleWith
            },
            "result": str(result)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/measure")
async def measure_qubit(qubit: QubitRequest):
    """Measure a single qubit - collapses quantum state"""
    try:
        q = convert_to_python_qubit(qubit)
        result = process_single_qubit(q)
        
        return {
            "success": True,
            "measurement": int(result),
            "state_after": "|0>" if result == 0 else "|1>"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# SERVER STARTUP
# ============================================================================

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 Quantum Teleportation API Server Starting...")
    print("=" * 60)
    print("📡 Backend will run Q# quantum operations")
    print("🌐 CORS enabled for frontend communication")
    print("🔬 Endpoints available at http://localhost:8000/docs")
    print("=" * 60)
    
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        log_level="info"
    )