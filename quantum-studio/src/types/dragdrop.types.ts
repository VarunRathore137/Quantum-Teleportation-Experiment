/**
 * dragdrop.types.ts
 * 
 * TypeScript type definitions for Drag-Drop system
 * Ensures type safety across components
 */

// What data is transferred when gate is dragged
export interface DragGateItem {
  gateType: string;        // "H", "X", "CNOT", etc.
  angle?: number | null;   // For parametric gates
  timestamp: number;       // When this drag started
}

// Drop target position on circuit canvas
export interface DropPosition {
  qubit: number;          // Which qubit line (0, 1, 2, ...)
  column: number;         // Which step in circuit (0, 1, 2, ...)
  x: number;              // Pixel position X (for visual feedback)
  y: number;              // Pixel position Y (for visual feedback)
}

// Drag state collected from monitor
export interface DragCollectProps {
  isDragging: boolean;
  draggedItem: DragGateItem | null;
  currentOffset: { x: number; y: number } | null;
}

// Drop state collected from monitor
export interface DropCollectProps {
  isOver: boolean;
  canDrop: boolean;
  dropItem: DragGateItem | null;
}

// Gate in palette with metadata
export interface GatePaletteItem {
  type: string;           // Gate type: "H", "X", "CNOT", etc.
  name: string;           // Display name: "Hadamard", "Pauli-X", etc.
  icon: string;           // Gate symbol to display
  category: "single" | "two-qubit" | "parametric" | "measurement";
  angle?: number;         // Default angle for parametric gates
  description?: string;   // Tooltip description
}

// Qubit line metadata
export interface QubitLineMetadata {
  index: number;          // Qubit index (0, 1, 2, ...)
  gatesAt: Map<number, string>; // Map<column, gateId>
}

// Circuit grid state
export interface CircuitGridState {
  numQubits: number;
  numColumns: number;
  occupied: Map<string, string>;  // Map<"q0_col1", gateId>
}

// Drop validation result
export interface DropValidationResult {
  isValid: boolean;
  reason?: string;        // Why drop is invalid (if invalid)
  suggestedAlternatives?: DropPosition[]; // Alternative drop positions
}
