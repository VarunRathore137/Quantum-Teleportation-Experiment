import Microsoft.Quantum.Diagnostics.*; 
import Microsoft.Quantum.Intrinsic.*; 
import Microsoft.Quantum.Measurement.*;

operation SetToPlus(q: Qubit) : Unit is Adj + Ctl
{
   H(q);
}

operation SetToMinus(q: Qubit) : Unit is Adj + Ctl
{
   X(q);
   H(q);
}

operation Teleport(message: Qubit, bob: Qubit): Unit
{
   use alice = Qubit();
   DumpMachine();

   H(alice);
   CNOT(alice, bob);
   DumpMachine();

   //Encode the message into the entangled pair

   CNOT(message, alice);
   H(message);
   DumpMachine();

        // Measure the qubits to extract the classical data we need to decode
        // the message by applying the corrections on the bob qubit
        // accordingly.

   if M(message) == One
   {
      Z(bob);
   }
   if M(alice) == One
   {
      X(bob);
   }
Reset(alice);
}

operation Main() : Result[]{
   use (message, bob) = (Qubit(), Qubit());
   
   let stateInitializerBasisTuples = [
      ("|0>", I, PauliZ), ("|1>", X, PauliZ), ("|+>", SetToPlus, PauliX), ("|->", SetToMinus, PauliX) 
   ];

   mutable results = [];
   for(state, initializer, basis) in stateInitializerBasisTuples{

       // Initialize the message and show its state using the `DumpMachine`

      initializer(message);
      Message($"Teleporting state {state}");
      DumpMachine();

        // Teleport the message and show the quantum state after
        // teleportation.
      
      Teleport(message, bob);
      Message($"Recieved state {state}");
      DumpMachine();

         // Measure bob in the corresponding basis and reset the qubits to
        // continue teleporting more messages.

      let result = Measure([basis], [bob]);
      set results += [result];
      ResetAll([message, bob]);

   }
   //result1 = qsharp.estimate("Teleport()")
   //EstimateDetails(result1)
      return results;
}