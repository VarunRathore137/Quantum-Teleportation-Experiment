/**
 * GatePaletteItem.tsx
 * 
 * Single draggable gate in the palette
 * Represents one gate that user can drag
 * 
 * WHY SEPARATE COMPONENT:
 * - Each gate needs its own useDrag hook
 * - Each gate has unique id (for dragging multiple gates)
 * - Clean component structure
 */

import React from "react";
import { useDrag } from "react-dnd";
import { DragGateItem } from "../types/dragdrop.types";
import "../styles/DragDrop.css";

interface GatePaletteItemProps {
  gateType: string;       // "H", "X", "CNOT", etc.
  gateName: string;       // "Hadamard", "Pauli-X", etc.
  gateIcon: string;       // Gate symbol to display
  angle?: number | null;  // For parametric gates
}

/**
 * GatePaletteItem Component
 * 
 * Makes a gate draggable
 * 
 * WORKFLOW:
 * 1. User mouses down on gate
 * 2. useDrag detects drag start
 * 3. item = { gateType, angle } created
 * 4. isDragging set to true
 * 5. Gate becomes semi-transparent
 * 6. User can now drag to circuit canvas
 */
const GatePaletteItem: React.FC<GatePaletteItemProps> = ({
  gateType,
  gateName,
  gateIcon,
  angle = null
}) => {
  // ─────────────────────────────────────────────────────────────
  // SETUP DRAG HOOK
  // ─────────────────────────────────────────────────────────────

  /**
   * useDrag Hook Configuration
   * 
   * type: "GATE"
   * └─ Only drop zones accepting "GATE" type can receive this
   * 
   * item: {gateType, angle, timestamp}
   * └─ Data transferred to drop zone
   * └─ When user drops, drop handler receives this object
   * 
   * collect: (monitor) => {...}
   * └─ Collects drag state for visual feedback
   * └─ isDragging = true while dragging this gate
   * └─ Re-renders component with new state
   * 
   * WHY:
   * - type ensures type safety (gates only drop on circuit, not elsewhere)
   * - item passes data (what gate is being dragged)
   * - collect enables visual feedback (show it's dragging)
   */
  const [{ isDragging }, drag] = useDrag<DragGateItem, void, { isDragging: boolean }>(() => ({
    type: "GATE",                    // Type identifier
    item: {
      gateType: gateType,            // What gate type
      angle: angle,                  // What angle (if parametric)
      timestamp: Date.now()          // When dragged
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()  // true while dragging
    })
  }));

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────

  return (
    <div
      ref={drag}  // Attach drag listener to this element
      className={`gate-palette-item ${isDragging ? "dragging" : ""}`}
      title={`${gateName}${angle ? ` (${angle} rad)` : ""}`}
      style={{
        opacity: isDragging ? 0.5 : 1,  // Semi-transparent while dragging
        cursor: isDragging ? "grabbing" : "grab"
      }}
    >
      <div className="gate-icon">{gateIcon}</div>
      <div className="gate-label">{gateType}</div>
      {angle !== null && angle !== undefined && (
        <div className="gate-angle">{(angle / Math.PI).toFixed(2)}π</div>
      )}
    </div>
  );
};

export default GatePaletteItem;
