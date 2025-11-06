namespace QuantumEntanglement {
   open Microsoft.Quantum.Intrinsic;
   import Microsoft.Quantum.Diagnostics.*; 
   import Microsoft.Quantum.Intrinsic.*; 
   import Microsoft.Quantum.Measurement.*;
 
   /// User-defined type to store qubit metadata from Python
   
   newtype QubitInfo = (
      id: String,
      label: String,
      role: String,
      isEntangle: Bool,
      state: String,
      entangleWith: String[]
   );


   /// <summary>
   /// Processes a single qubit based on its metadata
   /// </summary>
   operation ProcessSingleQubit(qInfo: QubitInfo) : Result {
      Message($"Processing single qubit: {qInfo::id} ({qInfo::label})");
      use q = Qubit();
      
      // Initialize qubit based on the desired state
      if (qInfo::state == "|1>") {
         X(q);
      }
      
      let result = M(q);
      Reset(q);
      return result;
   }

   /// <summary>
   /// Creating Bell States using Alice and Bob qubits
   /// </summary> 

   operation CreateBellStates(q1Info: QubitInfo, q2Info: QubitInfo): (Result, Result){

      Message("Creating Bell States:");
      use (q1, q2) = (Qubit(), Qubit());
      Message($"Inital states of {q1} and {q2} are:");
      DumpMachine();

      H(q1);
      Message("After Hadamard:");
      DumpMachine();

      CNOT(q1, q2);
      Message("After Entanglement:");
      DumpMachine();

      let result = (M(q1), M(q2));
      ResetAll([q1,q2]);
      
      return result;
   } 
    /// <summary>
   /// Creates Teleportation
   /// </summary>
   operation Teleportation(bobInfo : QubitInfo, messageInfo : QubitInfo): (Result){

      use alice = Qubit();
      use (bob, message) = (Qubit(), Qubit());
      DumpMachine();

      H(alice);
      DumpMachine();

      CNOT(alice, bob);
      DumpMachine();

      CNOT(alice, message);
      DumpMachine();

      H(message);
      DumpMachine();

      if M(message) == One {
         X(bob);
      } else {
         Z(bob);
      }
      
      let result = M(bob);
      ResetAll([alice, bob, message]);
      return result;
   }
   
   /// <summary>
   /// Creates Bell state entanglement between two qubits with metadata tracking
   /// </summary>
   operation ProcessQubits(q1Info: QubitInfo, q2Info: QubitInfo) : (Result, Result, String, String) {
      Message($"Processing qubit: {q1Info::id} ({q1Info::label}) - Role: {q1Info::role}");
      Message($"Processing qubit: {q2Info::id} ({q2Info::label}) - Role: {q2Info::role}");
      
      Message("Initial State:");
      use (q1, q2) = (Qubit(), Qubit());
      DumpMachine();
      
      // Create Bell state: (|00⟩ + |11⟩)/√2
      Message("After Hadamard State:");
      H(q1);
      DumpMachine();

      Message("After CNOT State:");
      CNOT(q1, q2);
      DumpMachine();

      Message("After Measurement State:");
      let (m1, m2) = (M(q1), M(q2));
      Reset(q1);
      Reset(q2);
      DumpMachine();

      return (m1, m2, q1Info::id, q2Info::id);
   }
 
}