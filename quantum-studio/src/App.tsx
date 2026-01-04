/**
 * UPDATED: App.tsx
 * Added DndProvider wrapper for drag-drop support
 */

import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import QuantumCircuitEditor from "./components/QuantumCircuitEditor";
import "./App.css";

const App: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <QuantumCircuitEditor />
      </div>
    </DndProvider>
  );
};

export default App;
// Wrap app
return (
  <DndProvider backend={HTML5Backend}>
    <div className="App">
      <QuantumCircuitEditor />
    </div>
  </DndProvider>
);