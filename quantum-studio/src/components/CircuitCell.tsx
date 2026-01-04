/**
 * CircuitCell.tsx
 * 
 * Single drop zone on circuit canvas
 * Located at intersection of qubit line and column
 * 
 * POSITION COORDINATES:
 * - qubit: vertical (which qubit line)
 * - column: horizontal (which step in circuit)
 * 
 * ACCEPTS: GATE type items
 * DROP HANDLER:
 * - Receives { gateType, angle }
 * - Validates drop
 * - Calls parent onDrop with position
 */

import React from "react";
import { useDrop } from "react-dnd";
import { DragGateItem, DropCollectProps } from "../types/dragdrop.types";
import "../styles/DragDrop.css";

interface CircuitCellProps {
  qubit: number;                          // Qubit index (0, 1, 2, ...)
  column: number;                         // Column index (0, 1, 2, ...)
  occupied: boolean;                      // Is position already occupied by a gate?
  onDrop: (item: DragGateItem, qubit: number, column: number) => void;
}

/**
 * CircuitCell Component
 * 
 * Makes a cell droppable
 * 
 * WORKFLOW:
 * 1. Palette gate dragged over cell
 * 2. useDrop detects hover
 * 3. Cell highlights (green border)
 * 4. User releases mouse
 * 5. onDrop called with gate data + position
 */
const CircuitCell: React.FC<CircuitCellProps> = ({
  qubit,
  column,
  occupied,
  onDrop
}) => {
  // ─────────────────────────────────────────────────────────────
  // SETUP DROP HOOK
  // ─────────────────────────────────────────────────────────────

  /**
   * useDrop Hook Configuration
   * 
   * accept: "GATE"
   * └─ Only accept draggable items of type "GATE"
   * └─ Items with type: "GATE" from useDrag
   * 
   * drop: (item) => {...}
   * └─ Called when gate dropped on this cell
   * └─ item = { gateType, angle, timestamp }
   * └─ Extract gate type and position
   * └─ Call onDrop callback to parent
   * 
   * canDrop: (item) => {...}
   * └─ Determine if this item can be dropped here
   * └─ Prevents drop if position occupied
   * └─ Prevents drop if validation fails
   * 
   * collect: (monitor) => {...}
   * └─ Collect drop state for visual feedback
   * └─ isOver = true when gate hovering over cell
   * 
   * WHY:
   * - accept ensures only gates drop (not other things)
   * - drop handles successful drop operation
   * - canDrop prevents invalid drops
   * - collect enables visual feedback (highlight)
   */
  const [{ isOver, canDrop }, drop] = useDrop<
    DragGateItem,
    void,
    DropCollectProps
  >(() => ({
    accept: "GATE",                     // Accept dragged gates

    canDrop: (item: DragGateItem) => {
      // Prevent drop if cell occupied
      if (occupied) {
        return false;
      }
      // Allow drop if cell empty
      return true;
    },

    drop: (item: DragGateItem) => {
      // Call parent handler with dropped gate data and position
      onDrop(item, qubit, column);
    },

    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),  // Only this cell (not children)
      canDrop: monitor.canDrop()
    })
  }));

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────

  const getClassName = () => {
    let className = "circuit-cell";
    if (isOver) className += " over";        // Hovering
    if (canDrop) className += " can-drop";   // Can drop here
    if (!canDrop) className += " no-drop";   // Cannot drop here
    if (occupied) className += " occupied";  // Already has gate
    return className;
  };

  return (
    <div
      ref={drop}
      className={getClassName()}
      title={`Qubit ${qubit}, Column ${column}${occupied ? " (occupied)" : ""}`}
      style={{
        borderColor: isOver ? "#00ff00" : occupied ? "#999" : "#ddd"
      }}
    >
      {/* Cell is empty, show drop zone indicator */}
      {!occupied && isOver && <div className="drop-indicator">↓</div>}
    </div>
  );
};

export default CircuitCell;
