import Microsoft.Quantum.Diagnostics.*;

operation Main() : Result
{
   use q = Qubit();
   Message("Initialized qubit:");
   DumpMachine();
   Message(" ");

   H(q);
   Message("Qubit after applying H:");
   DumpMachine();
   Message(" ");


   Y(q);
   Message("Qubit after applying Y:");
   DumpMachine();
   Message(" ");

    X(q);
   Message("Qubit after applying X:");
   DumpMachine();
   Message(" ");

   Z(q);
   Message("Qubit after applying Z:");
   DumpMachine();
   Message(" ");

   let randomBit = M(q);
   Message("Qubit after the measurement:");
   DumpMachine();
   Message(" ");

   Reset(q);
   Message("Qubit after resetting:");
   DumpMachine();
   Message(" ");
   return randomBit;


}
