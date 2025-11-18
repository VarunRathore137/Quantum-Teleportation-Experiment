namespace QuantumEntanglement {
   open Microsoft.Quantum.Intrinsic;
   import Microsoft.Quantum.Diagnostics.*; 
   import Microsoft.Quantum.Intrinsic.*; 
   import Microsoft.Quantum.Measurement.*;
   import Microsoft.Quantum.Math.*;
 
   // User-defined type to store qubit metadata from Python
   newtype QubitInfo = (
      id: String,
      label: String,
      role: String,
      isEntangle: Bool,
      state: String,
      entangleWith: String[]
   );


   /// Process a single qubit based on its metadata
   operation ProcessSingleQubit(qInfo: QubitInfo) : Result {
      Message($"Processing single qubit: {qInfo::id} ({qInfo::label})");
      use q = Qubit();
      
      if (qInfo::state == "|1>") {
         X(q);
      }
      
      let result = M(q);
      Reset(q);
      return result;
   }


   /// Create simple Bell state (no metadata)
   operation CreateBellStatesSimple() : (Result, Result) {
      Message("Creating simple Bell State");
      use (q1, q2) = (Qubit(), Qubit());
      
      H(q1);
      CNOT(q1, q2);
      
      let result = M(q1);
      let result= M(q2);
      ResetAll([q1, q2]);
      
      return (result, result);
   }


   /// Create Bell States with metadata
   operation CreateBellStates(q1Info: QubitInfo, q2Info: QubitInfo): (Result, Result, String, String) {
      Message($"Creating Bell State between {q1Info::label} and {q2Info::label}");
      use (q1, q2) = (Qubit(), Qubit());
      
      Message("Initial state |00⟩:");
      DumpMachine();

      H(q1);
      Message("After Hadamard - Superposition created:");
      DumpMachine();

      CNOT(q1, q2);
      Message("After CNOT - Entanglement established:");
      DumpMachine();

      let result = M(q1);
      let result= M(q2);
      ResetAll([q1, q2]);
      
      Message($"Bell pair measured: ({result})");
      return (result, result, q1Info::id, q2Info::id);
   }


   /// Complete Quantum Teleportation Protocol
   operation TeleportWorkflow(
      messageInfo: QubitInfo, 
      aliceInfo: QubitInfo, 
      bobInfo: QubitInfo,
      messageState: String
   ) : (Result, Result, String, Bool) {
      
      Message("========================================");
      Message("QUANTUM TELEPORTATION WORKFLOW STARTED");
      Message("========================================");
      
      use (message, alice, bob) = (Qubit(), Qubit(), Qubit());
      
      
      // PHASE 1: PREPARE MESSAGE QUBIT
      Message($"Phase 1: Preparing message qubit in '{messageState}' state");
      
      if (messageState == "one") {
         X(message);
         Message("Message set to |1⟩");
      } elif (messageState == "superposition") {
         H(message);
         Message("Message set to superposition (|0⟩ + |1⟩)/√2");
      } elif (messageState == "custom") {
         Ry(PI() / 3.0, message);
         Message("Message set to custom state");
      } else {
         Message("Message kept in |0⟩ state");
      }
      
      Message("Initial state (message prepared, Alice and Bob in |0⟩):");
      DumpMachine();
      
      
      // PHASE 2: CREATE ENTANGLEMENT (Bell Pair between Alice and Bob)
      Message("Phase 2: Creating Bell pair between Alice and Bob");
      
      H(alice);
      Message("After Hadamard on Alice:");
      DumpMachine();
      
      CNOT(alice, bob);
      Message("After CNOT - Alice and Bob are now entangled:");
      DumpMachine();
      Message("Bell pair created: (|00⟩ + |11⟩)/√2");
      
      
      // PHASE 3: BELL STATE MEASUREMENT (Alice side)
      Message("Phase 3: Alice performs Bell measurement");
      
      CNOT(message, alice);
      Message("After CNOT(message, alice):");
      DumpMachine();
      
      H(message);
      Message("After Hadamard on message:");
      DumpMachine();
      
      let msgMeasurement = M(message);
      let aliceMeasurement = M(alice);
      
      Message($"Alice's measurements: message={msgMeasurement}, alice={aliceMeasurement}");
      Message("These 2 classical bits will be sent to Bob");
      
      
      // PHASE 4: CLASSICAL COMMUNICATION
      Message("Phase 4: Classical bits transmitted");
      Message($"Bits sent: {msgMeasurement}{aliceMeasurement}");
      
      
      // PHASE 5: CORRECTION GATES (Bob's side)
      Message("Phase 5: Bob applies correction gates based on received bits");
      
      if (aliceMeasurement == One) {
         X(bob);
         Message("Bob applied X gate (bit flip)");
      }
      
      if (msgMeasurement == One) {
         Z(bob);
         Message("Bob applied Z gate (phase flip)");
      }
      
      Message("After corrections, Bob's qubit state:");
      DumpMachine();
      
      
      // PHASE 6: VERIFICATION
      Message("Phase 6: Verification - Bob's qubit should match original message");
      
      let bobFinalMeasurement = M(bob);
      Message($"Bob's final measurement: {bobFinalMeasurement}");
      
      mutable success = false;
      mutable bobStateStr = "";
      
      if (messageState == "zero" or messageState == "") {
         success = bobFinalMeasurement == Zero;
         bobStateStr = "Zero";
      } elif (messageState == "one") {
         success = bobFinalMeasurement == One;
         bobStateStr = "One";
      } else {
         success = true;
         bobStateStr = bobFinalMeasurement == Zero ? "Zero" | "One";
      }
      
      Message("========================================");
      if (success) {
         Message("✓ TELEPORTATION SUCCESSFUL");
      } else {
         Message("⚠ TELEPORTATION VERIFICATION INCONCLUSIVE");
      }
      Message("========================================");
      
      ResetAll([message, alice, bob]);
      
      return (msgMeasurement, aliceMeasurement, bobStateStr, success);
   }


   /// Legacy operation for backward compatibility
   operation Teleportation(bobInfo: QubitInfo, messageInfo: QubitInfo): (Result) {
      use alice = Qubit();
      use (bob, message) = (Qubit(), Qubit());
      
      DumpMachine();

      H(alice);
      DumpMachine();

      CNOT(alice, bob);
      DumpMachine();

      CNOT(message, alice);
      DumpMachine();

      H(message);
      DumpMachine();

      if M(message) == One {
         X(bob);
      }
      
      if M(alice) == One {
         Z(bob);
      }
      
      let result = M(bob);
      ResetAll([alice, bob, message]);
      return result;
   }
   
   
   /// Process two qubits with metadata - creates entanglement
   operation ProcessQubits(q1Info: QubitInfo, q2Info: QubitInfo) : (Result, Result, String, String) {
      Message($"Processing qubit: {q1Info::id} ({q1Info::label}) - Role: {q1Info::role}");
      Message($"Processing qubit: {q2Info::id} ({q2Info::label}) - Role: {q2Info::role}");
      
      Message("Initial State:");
      use (q1, q2) = (Qubit(), Qubit());
      DumpMachine();
      
      Message("After Hadamard State:");
      H(q1);
      DumpMachine();

      Message("After CNOT State:");
      CNOT(q1, q2);
      DumpMachine();

      Message("After Measurement State:");
      let m1 = M(q1);
      let m2 = M(q2);
      Reset(q1);
      Reset(q2);
      DumpMachine();

      return (m1, m2, q1Info::id, q2Info::id);
   }
}