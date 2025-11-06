import Microsoft.Quantum.Diagnostics.*;
import Microsoft.Quantum.Math.*;

operation Main() : Result
{
   use q = Qubit();
   let P = 0.333;
   Message("The qubit is in normal state:");
   DumpMachine();

   Ry(2.0 * ArcCos(Sqrt (P)), q);
   Message("The qubit is in desired state:");
   DumpMachine();
   Message(" ");

   Message("Your Skewed Random bit is :");
   let skewedrandombit = M(q);

   Reset(q);
   return skewedrandombit;
}
