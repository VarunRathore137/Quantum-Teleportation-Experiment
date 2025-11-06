import Microsoft.Quantum.Diagnostics.*;
import Microsoft.Quantum.Math.*;
import Microsoft.Quantum.Convert.*;
import Microsoft.Quantum.Arrays.*;

operation Main() : Int {
   Message("Initial states");
    use qubits = Qubit[3];
   DumpMachine();

   ApplyToEach(H,qubits);
   Message("After Superposition");
   DumpMachine();

   mutable result = [];
   for q in qubits{

      result = result + [M(q)];
      DumpMachine();
   }
   Message("Your random number is:");
   ResetAll(qubits);

   return BoolArrayAsInt(ResultArrayAsBoolArray(result));

}