/**
 * QuantumCircuitEditor.tsx
 * 
 * React component for the Quantum Circuit Editor
 * Uses QuantumCircuit and QuantumGate classes
 * Demonstrates how to use the data structures
 */

import React, { useState, useEffect } from "react";
import { QuantumCircuit } from "../classes/QuantumCircuit";
import "../styles/QuantumCircuitEditor.css"; // Will create this file
import GatePalette from "./GatePalette"
import CircuitCanvas from "./CircuitCanvas";

import { DragGateItem, DropPosition } from "../types/dragdrop.types";
import "../styles/QuantumCircuitEditor.css";


interface CircuitStats {
  numQubits: number;
  numClassicalBits: number;
  totalGates: number;
  depth: number;
  gateTypes: { [key: string]: number };
  createdAt: number;
  lastModified: number;
  name: string;
  description: string;
}

const QuantumCircuitEditor: React.FC = () => {
  // STATE
  const [circuit, setCircuit] = useState<QuantumCircuit>(
    new QuantumCircuit(3, "My First Circuit")
  );

  const [selectedGateType, setSelectedGateType] = useState<string>("H");
  const [selectedQubit, setSelectedQubit] = useState<number>(0);
  const [gateAngle, setGateAngle] = useState<number>(0);
  const [stats, setStats] = useState<CircuitStats>(circuit.getStatistics());
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [qiskitCode, setQiskitCode] = useState<string>("");
  const [showQiskitCode, setShowQiskitCode] = useState<boolean>(false);

  // UPDATE STATS whenever circuit changes
  useEffect(() => {
    setStats(circuit.getStatistics());
  }, [circuit]);

  // ─────────────────────────────────────────────────────────────
  // GATE ACTIONS
  // ─────────────────────────────────────────────────────────────

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
    
  *
      Add gate to circuit
   
  nst handleAddGate = (): void => {
    y {
        tErrorMessage(""); // Clear previous errors

      nst newCircuit = circuit.clone();
      nst angle =
          lectedGateType.startsWith("R") && gateAngle !== null ? gateAngle : null;

        wCircuit.addGate(selectedGateType, [selectedQubit], [], angle);
        tCircuit(newCircuit);
    catch (error) {
          tErrorMessage(
            rror: ${ error instanceof Error ? error.message : String(error) }`
      
    
  

  *
   Add CNOT gate (needs special handling)
   
  nst handleAddCNOT = (): void => {
    y {
      tErrorMessage("");

       (selectedQubit < circuit.numQubits - 1) {
        nst newCircuit = circuit.clone();
        wCircuit.addGate("CNOT", [selectedQubit + 1], [selectedQubit], null);
        tCircuit(newCircuit);
      else {
        tErrorMessage("Cannot add CNOT on last qubit (no target available)");
      
    catch (error) {
      tErrorMessage(
        rror: ${error instanceof Error ? error.message : String(error)}`




          *
          Remove gate by ID
   
  nst handleRemoveGate = (gateId: string): void => {
    y {
              tErrorMessage("");

      nst newCircuit = circuit.clone();
              wCircuit.removeGate(gateId);
              tCircuit(newCircuit);
    catch (error) {
                tErrorMessage(
                  rror: ${ error instanceof Error ? error.message : String(error) }`
      
    
  

  *
   Clear all gates
   
  nst handleClearCircuit = (): void => {
    nst newCircuit = new QuantumCircuit(
      rcuit.numQubits,
      rcuit.name
    
    tCircuit(newCircuit);
    tErrorMessage("");
  

  *
   Undo
   
  nst handleUndo = (): void => {
     (circuit.canUndo()) {
      nst newCircuit = circuit.clone();
      wCircuit.undo();
      tCircuit(newCircuit);
    
  

  *
   Redo
   
  nst handleRedo = (): void => {
     (circuit.canRedo()) {
      nst newCircuit = circuit.clone();
      wCircuit.redo();
      tCircuit(newCircuit);
    
  

  *
   Export to Qiskit code
   
  nst handleExportQiskit = (): void => {
    nst code = circuit.exportToQiskit();
    tQiskitCode(code);
    tShowQiskitCode(true);
  

  *
   Export to JSON and download
   
  nst handleExportJSON = (): void => {
    nst jsonData = circuit.exportToJSON();
    nst jsonString = JSON.stringify(jsonData, null, 2);
    nst blob = new Blob([jsonString], { type: "application/json" });
    nst url = URL.createObjectURL(blob);
    nst a = document.createElement("a");
    href = url;
    download = `${ circuit.name }.json`;
    click();
    L.revokeObjectURL(url);
  

   ─────────────────────────────────────────────────────────────
   RENDER
   ─────────────────────────────────────────────────────────────

  turn (
    iv className="quantum-circuit-editor">
      1>🎯 Quantum Circuit Editor</h1>

      * ERROR MESSAGE */}
      rrorMessage && (
        iv className="error-box">
          trong>Error:</strong> {errorMessage}
        div>
      

      * CONTROLS */}
      iv className="controls-section">
        2>Add Gates</h2>

        iv className="gate-selector">
          abel>
            te Type:
            elect
              lue={selectedGateType}
              Change={(e) => setSelectedGateType(e.target.value)}
            
              ption value="H">Hadamard (H)</option>
              ption value="X">Pauli-X (X)</option>
              ption value="Y">Pauli-Y (Y)</option>
              ption value="Z">Pauli-Z (Z)</option>
              ption value="RX">Rotation-X (RX)</option>
              ption value="RY">Rotation-Y (RY)</option>
              ption value="RZ">Rotation-Z (RZ)</option>
              ption value="S">Phase (S)</option>
              ption value="T">T-gate (T)</option>
              ption value="MEASURE">Measurement</option>
            select>
          label>

          abel>
            bit:
            elect
              lue={selectedQubit}
              Change={(e) => setSelectedQubit(parseInt(e.target.value))}
            
              rray.from({ length: circuit.numQubits }, (_, i) => (
                ption key={i} value={i}>
                  {i}]
                option>
              }
            select>
          label>

          electedGateType.startsWith("R") && (
            abel>
              gle (radians):
              nput
                pe="number"
                lue={gateAngle}
                Change={(e) => setGateAngle(parseFloat(e.target.value))}
                ep="0.1"
              
            label>
          

          utton onClick={handleAddGate} className="btn btn-primary">
            d {selectedGateType} Gate
          button>

          utton onClick={handleAddCNOT} className="btn btn-primary">
            d CNOT
          button>
        div>

        iv className="action-buttons">
          utton
            Click={handleUndo}
            sabled={!circuit.canUndo()}
            assName="btn btn-secondary"
          
            Undo
          button>
          utton
            Click={handleRedo}
            sabled={!circuit.canRedo()}
            assName="btn btn-secondary"
          
            Redo
          button>
          utton onClick={handleClearCircuit} className="btn btn-danger">
            ear Circuit
          button>
        div>
      div>

      * CIRCUIT VISUALIZATION */}
      iv className="circuit-section">
        2>Circuit Diagram</h2>
        iv className="circuit-container">
          rray.from({ length: circuit.numQubits }, (_, qubitIndex) => (
            iv key={qubitIndex} className="qubit-row">
              iv className="qubit-label">q[{qubitIndex}]</div>
              iv className="qubit-line">
                ircuit.getGatesOnQubit(qubitIndex).map((gate) => (
                  iv
                    y={gate.id}
                    assName="gate-box"
                    tle={`${ gate.type }${ gate.angle ? ` (${gate.angle})` : "" }`}
                    Click={() => handleRemoveGate(gate.id)}
                  
                    pan className="gate-type">{gate.type}</span>
                    utton
                      assName="remove-btn"
                      Click={(e) => {
                        stopPropagation();
                        ndleRemoveGate(gate.id);
                      
                    
                      
                    button>
                  div>
                }
              div>
            div>
          }
        div>
      div>

      * STATISTICS */}
      iv className="stats-section">
        2>Circuit Statistics</h2>
        iv className="stats-grid">
          iv className="stat-item">
            trong>Total Gates:</strong> {stats.totalGates}
          div>
          iv className="stat-item">
            trong>Circuit Depth:</strong> {stats.depth}
          div>
          iv className="stat-item">
            trong>Qubits:</strong> {stats.numQubits}
          div>
          iv className="stat-item">
            trong>Classical Bits:</strong> {stats.numClassicalBits}
          div>
        div>

        iv className="gate-types">
          3>Gate Types:</h3>
          l>
            bject.entries(stats.gateTypes).map(([type, count]) => (
              i key={type}>
                ype}: {count}
              li>
            }
          ul>
        div>
      div>

      * EXPORT SECTION */}
      iv className="export-section">
        2>Export & Code</h2>

        utton onClick={handleExportQiskit} className="btn btn-info">
          ew Qiskit Code
        button>

        utton onClick={handleExportJSON} className="btn btn-info">
          wnload JSON
        button>

        howQiskitCode && (
          iv className="code-display">
            3>Qiskit Python Code:</h3>
            re>{qiskitCode}</pre>
            utton
              Click={() => setShowQiskitCode(false)}
              assName="btn btn-secondary"
            
              ose
            button>
          div>
        
      div>

      * CIRCUIT INFO */}
      iv className="info-section">
        3>Circuit Name: {circuit.name}</h3>
        >Created: {new Date(stats.createdAt).toLocaleString()}</p>
        >Last Modified: {new Date(stats.lastModified).toLocaleString()}</p>
      div>
    div>
  


port default QuantumCircuitEditor;
