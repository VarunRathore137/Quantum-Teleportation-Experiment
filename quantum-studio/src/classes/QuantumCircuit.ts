/**
 * UPDATED: QuantumCircuitEditor.tsx
 * 
 * Now includes GatePalette and CircuitCanvas with drag-drop
 * Uses DndProvider wrapper for drag-drop support
 */

import React, { useState, useEffect } from "react";
import GatePalette from "./GatePalette";
import CircuitCanvas from "./CircuitCanvas";
import { QuantumCircuit } from "../classes/QuantumCircuit";
import { DragGateItem, DropPosition } from "../types/dragdrop.types";
import "../styles/QuantumCircuitEditor.css";

const QuantumCircuitEditor: React.FC = () => {
  const [circuit, setCircuit] = useState<QuantumCircuit>(
    new QuantumCircuit(3, "My Quantum Circuit")
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // ─────────────────────────────────────────────────────────────
  // DRAG-DROP HANDLERS
  // ─────────────────────────────────────────────────────────────

  /**
   * Handle gate dropped on canvas
   * 
   * Called when user drops gate from palette onto circuit cell
   * 
   * WORKFLOW:
   * 1. Extract gate type and angle from dropped item
   * 2. Extract target position (qubit, column)
   * 3. Validate: is this a valid drop?
   * 4. If valid: add gate to circuit
   * 5. If invalid: show error message
   * 6. Update UI
   */
  const handleGateDropped = (item: DragGateItem, position: DropPosition) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      const { gateType, angle } = item;
      const { qubit, column } = position;

      // Clone circuit (immutability for React state)
      const newCircuit = circuit.clone();

      // Add gate to circuit
      // This will validate automatically
      const gateId = newCircuit.addGate(
        gateType,
        [qubit],
        [],
        angle || null,
        { row: qubit, column: column }
      );

      // Update state (triggers re-render)
      setCircuit(newCircuit);
      setSuccessMessage(`✓ Added ${gateType} gate to q[${qubit}]`);

      // Clear message after 2 seconds
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : String(error)
      );
    }
  };

  /**
   * Handle gate removal
   */
  const handleGateRemove = (gateId: string) => {
    try {
      setErrorMessage("");

      const newCircuit = circuit.clone();
      newCircuit.removeGate(gateId);
      setCircuit(newCircuit);
      setSuccessMessage("✓ Gate removed");

      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : String(error)
      );
    }
  };

  /**
   * Handle undo
   */
  const handleUndo = () => {
    if (circuit.canUndo()) {
      const newCircuit = circuit.clone();
      newCircuit.undo();
      setCircuit(newCircuit);
    }
  };

  /**
   * Handle redo
   */
  const handleRedo = () => {
    if (circuit.canRedo()) {
      const newCircuit = circuit.clone();
      newCircuit.redo();
      setCircuit(newCircuit);
    }
  };

  /**
   * Handle clear circuit
   */
  const handleClearCircuit = () => {
    if (window.confirm("Clear all gates?")) {
      const newCircuit = new QuantumCircuit(circuit.numQubits);
      setCircuit(newCircuit);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────

  return (
    <div className="quantum-circuit-editor">
      <div className="editor-header">
        <h1>🎯 Quantum Circuit Editor (Drag & Drop)</h1>
        <div className="header-buttons">
          <button onClick={handleUndo} disabled={!circuit.canUndo()}>
            ↶ Undo
          </button>
          <button onClick={handleRedo} disabled={!circuit.canRedo()}>
            ↷ Redo
          </button>
          <button onClick={handleClearCircuit} className="btn-danger">
            Clear
          </button>
        </div>
      </div>

      {/* ERROR/SUCCESS MESSAGES */}
      {errorMessage && (
        <div className="message error-message">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="message success-message">{successMessage}</div>
      )}

      {/* MAIN EDITOR LAYOUT */}
      <div className="editor-layout">
        {/* LEFT: PALETTE */}
        <GatePalette />

        {/* RIGHT: CIRCUIT CANVAS */}
        <CircuitCanvas
          circuit={circuit}
          onGateDropped={handleGateDropped}
          onGateRemove={handleGateRemove}
        />
      </div>

      {/* BOTTOM: CIRCUIT INFO */}
      <div className="editor-footer">
        <h3>{circuit.name}</h3>
        <p>
          Qubits: {circuit.numQubits} | Gates: {circuit.getGateCount()} | Depth:{" "}
          {circuit.getCircuitDepth()}
        </p>
      </div>
    </div>
  );
};

// Clone helper (add to QuantumCircuit if not already there)
declare global {
  interface QuantumCircuit {
    clone(): QuantumCircuit;
  }
}

if (!QuantumCircuit.prototype.clone) {
  QuantumCircuit.prototype.clone = function () {
    const cloned = new QuantumCircuit(this.numQubits, this.name);
    cloned.gates = this.gates.map((g) => g.clone());
    cloned.description = this.description;
    cloned.history = this.history.map((h) => ({
      ...h,
      gates: h.gates.map((g) => g.clone())
    }));
    cloned.currentHistoryIndex = this.currentHistoryIndex;
    return cloned;
  };
}

export default QuantumCircuitEditor;
