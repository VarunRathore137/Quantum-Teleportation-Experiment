import Microsoft.Quantum.Convert.*;
import Microsoft.Quantum.Math.*;

operation GenerateRandomBit(): Result{
   use q1 = Qubit();
   H(q1);

   let result = M(q1);
   Reset(q1);
   return result;
}
operation GenerateRandomNumberInRange(max : Int) : Int
{
   mutable bits = [];
   let nBits = BitSizeI(max);
   for idxBit in 1..nBits{
      set bits += [GenerateRandomBit()];
   }
   let sample = ResultArrayAsInt(bits);

   return sample> max ? GenerateRandomNumberInRange(max) | sample;
}

operation Main() : Int {

let max = 10000;
Message($"Sampling a random number between 0 and {max}: ");
    return GenerateRandomNumberInRange(max);
}