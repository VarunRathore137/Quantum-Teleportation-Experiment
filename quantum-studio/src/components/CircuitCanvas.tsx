/**
 * CircuitCanvas.tsx
 * 
 * Right panel showing circuit with droppable cells
 * Creates grid: rows = qubits, columns = circuit steps
 * 
 * STRUCTURE:
 * ┌─────────────────────────────────┐
 * │ q[0]: [cell] [cell] [cell] ...  │
 * │ q[1]: [cell] [cell] [cell] ...  │
 * │ q[2]: [cell] [cell] [cell] ...  │
 * └─────────────────────────────────┘
 * 
 * Each [cell] is droppable CircuitCell component
 */

import React from "react";
import CircuitCell from "./CircuitCell";
import { QuantumCircuit } from "../classes/QuantumCircuit";
import { DragGateItem, DropPosition } from "../types/dragdrop.types";
import "../styles/CircuitCanvas.css";

interface CircuitCanvasProps {
  circuit: QuantumCircuit;
  onGateDropped: (item: DragGateItem, position: DropPosition) => void;
  onGateRemove?: (gateId: string) => void;
}

/**
 * CircuitCanvas Component
 * 
 * WORKFLOW:
 * 1. For each qubit (row):
 *    ├─ For each column:
   *    │  ├─ Create CircuitCell (drop zone)
   *    │  ├─ Check if occupied (gate exists here)
   *    │  ├─ If gate exists, show gate box
   *    │  └─ If empty, show droppable cell
   *    └─ Connect cells with horizontal line
 * 2. User drags gate over cell
 * 3. CircuitCell's useDrop triggers
 * 4. onDrop called
 * 5. Parent handles adding gate to circuit
 */
const CircuitCanvas: React.FC<CircuitCanvasProps> = ({
  circuit,
  onGateDropped,
  onGateRemove
}) => {
  // ─────────────────────────────────────────────────────────────
  // HELPER FUNCTIONS
  // ─────────────────────────────────────────────────────────────

  /**
   * Check if position is occupied by a gate
   */
  const isPositionOccupied = (qubit: number, column: number): string | null => {
    const gates = circuit.getGatesOnQubit(qubit);
    const gateAtPosition = gates.find((g) => g.position.column === column);
    return gateAtPosition?.id || null;
  };

  /**
   * Handle gate drop
   * 
   * Called when user drops gate on cell
   * 1. Extract position
   * 2. Call parent onGateDropped
   * 3. Parent validates and adds to circuit
   */
  const handleGateDrop = (
    item: DragGateItem,
    qubit: number,
    column: number
  ) => {
    const position: DropPosition = {
      qubit,
      column,
      x: 0,  // Could capture mouse position for better UX
      y: 0
    };
    onGateDropped(item, position);
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────

  // Calculate number of columns to display
  const circuitDepth = Math.max(circuit.getCircuitDepth(), 3);
  const numColumns = circuitDepth + 2;  // Add extra columns for future gates

  return (
    <div className="circuit-canvas">
      <h2>Circuit Diagram</h2>

      <div className="circuit-container">
        {/* FOR EACH QUBIT */}
        {Array.from({ length: circuit.numQubits }, (_, qubitIndex) => (
          <div key={qubitIndex} className="qubit-row">
            {/* QUBIT LABEL */}
            <div className="qubit-label">q[{qubitIndex}]</div>

            {/* QUBIT LINE WITH CELLS */}
            <div className="qubit-line">
              {/* FOR EACH COLUMN */}
              {Array.from({ length: numColumns }, (_, colIndex) => {
                const occupiedGateId = isPositionOccupied(qubitIndex, colIndex);
                const occupiedGate = occupiedGateId
                  ? circuit.getGate(occupiedGateId)
                  : null;

                return (
                  <React.Fragment key={colIndex}>
                    {occupiedGate ? (
                      // GATE EXISTS AT THIS POSITION: Show gate box
                      <div
                        className="gate-box"
                        title={`${occupiedGate.type}${
                          occupiedGate.angle
                            ? ` (${occupiedGate.angle})`
                            : ""
                        }`}
                        onClick={() =>
                          onGateRemove?.(occupiedGate.id)
                        }
                      >
                        <span className="gate-label">
                          {occupiedGate.type}
                        </span>
                        {occupiedGate.angle && (
                          <span className="gate-angle">
                            {(occupiedGate.angle / Math.PI).toFixed(2)}π
                          </span>
                        )}
                        <button
                          className="gate-remove-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onGateRemove?.(occupiedGate.id);
                          }}
                          title="Delete gate"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      // NO GATE: Show droppable cell
                      <CircuitCell
                        qubit={qubitIndex}
                        column={colIndex}
                        occupied={false}
                        onDrop={handleGateDrop}
                      />
                    )}
                  </React.Fragment>
                );
              })}

              {/* MEASUREMENT MARKER AT END */}
              <div className="measure-marker">|M⟩</div>
            </div>
          </div>
        ))}
      </div>

      {/* CIRCUIT INFO */}
      <div className="circuit-info">
        <p>
          <strong>Circuit Depth:</strong> {circuit.getCircuitDepth()} |
          <strong> Gates:</strong> {circuit.getGateCount()} |
          <strong> Qubits:</strong> {circuit.numQubits}
        </p>
      </div>
    </div>
  );
};

export default CircuitCanvas;
