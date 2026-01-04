/**
 * QuantumGate.ts
 * 
 * Represents a single quantum gate
 * ATOMIC UNIT of the circuit
 * 
 */

// Define what a gate position looks like
export interface GatePosition {
   row: number;    // Which qubit line
   column: number; // Which step in circuit
 }
 
 // Define gate parameters
 export interface GateParams {
   angle?: number;     // For parametric gates (RX, RY, RZ)
   [key: string]: any; // Allow other parameters
 }
 
 // Main QuantumGate class
 export class QuantumGate {
   id: string;
   type: string;
   targets: number[];
   controls: number[];
   angle: number | null;
   position: GatePosition;
   createdAt: number;
   params: GateParams;
 
   constructor(
     type: string,
     targets: number[] = [],
     controls: number[] = [],
     angle: number | null = null,
     position: GatePosition = { row: 0, column: 0 }
   ) {
     this.id = this.generateUniqueId();
     this.type = type;
     this.targets = targets;
     this.controls = controls;
     this.angle = angle;
     this.position = position;
     this.createdAt = Date.now();
     this.params = angle !== null ? { angle } : {};
   }
 
   /**
    * Generate unique ID
    * Format: gate_timestamp_randomstring
    */
   private generateUniqueId(): string {
     return `gate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
   }
 
   /**
    * Validate gate according to quantum rules
    * 
    * Returns object with: { valid: boolean, errors: string[] }
    */
   validate(numQubits: number): { valid: boolean; errors: string[] } {
     const errors: string[] = [];
 
     // Rule 1: Gate type must be recognized
     const validGates = [
       "H",
       "X",
       "Y",
       "Z",
       "S",
       "T",
       "RX",
       "RY",
       "RZ",
       "CNOT",
       "SWAP",
       "MEASURE"
     ];
     if (!validGates.includes(this.type)) {
       errors.push(`Invalid gate type: ${this.type}`);
     }
 
     // Rule 2: Target qubits in valid range
     for (const target of this.targets) {
       if (target < 0 || target >= numQubits) {
         errors.push(
           `Target qubit ${target} out of range [0, ${numQubits - 1}]`
         );
       }
     }
 
     // Rule 3: Control qubits in valid range
     for (const control of this.controls) {
       if (control < 0 || control >= numQubits) {
         errors.push(
           `Control qubit ${control} out of range [0, ${numQubits - 1}]`
         );
       }
     }
 
     // Rule 4: No qubit can be both control and target
     const controlSet = new Set(this.controls);
     for (const target of this.targets) {
       if (controlSet.has(target)) {
         errors.push(
           `Qubit ${target} cannot be both control and target`
         );
       }
     }
 
     // Rule 5: Single-qubit gates must have exactly 1 target
     const singleQubitGates = [
       "H",
       "X",
       "Y",
       "Z",
       "S",
       "T",
       "RX",
       "RY",
       "RZ",
       "MEASURE"
     ];
     if (singleQubitGates.includes(this.type) && this.targets.length !== 1) {
       errors.push(
         `${this.type} gate must have exactly 1 target qubit`
       );
     }
 
     // Rule 6: CNOT must have 1 control and 1 target
     if (this.type === "CNOT") {
       if (this.controls.length !== 1 || this.targets.length !== 1) {
         errors.push(
           `CNOT must have exactly 1 control and 1 target qubit`
         );
       }
     }
 
     // Rule 7: Angle must be number or null
     if (this.angle !== null && typeof this.angle !== "number") {
       errors.push(`Gate angle must be a number, got ${typeof this.angle}`);
     }
 
     return {
       valid: errors.length === 0,
       errors
     };
   }
 
   /**
    * Convert gate to plain object (for JSON, storage)
    */
   toJSON() {
     return {
       id: this.id,
       type: this.type,
       targets: this.targets,
       controls: this.controls,
       angle: this.angle,
       position: this.position,
       createdAt: this.createdAt,
       params: this.params
     };
   }
 
   /**
    * Create gate from JSON data
    */
   static fromJSON(data: any): QuantumGate {
     const gate = new QuantumGate(
       data.type,
       data.targets,
       data.controls,
       data.angle,
       data.position
     );
     gate.id = data.id; // Preserve original ID
     gate.createdAt = data.createdAt;
     return gate;
   }
 
   /**
    * Clone this gate
    */
   clone(): QuantumGate {
     return new QuantumGate(
       this.type,
       [...this.targets],
       [...this.controls],
       this.angle,
       { ...this.position }
     );
   }
 }
 