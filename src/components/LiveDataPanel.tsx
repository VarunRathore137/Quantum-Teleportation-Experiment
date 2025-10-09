import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Activity, Gauge, Binary, GitBranch } from "lucide-react";

export const LiveDataPanel = () => {
  return (
    <div 
      className="w-96 holo-panel border-l border-border/30 backdrop-blur-xl"
      role="complementary"
      aria-label="Live data panel"
    >
      <Tabs defaultValue="states" className="h-full flex flex-col">
        <TabsList className="w-full justify-start border-b border-border/30 bg-transparent rounded-none p-0">
          <TabsTrigger 
            value="states" 
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:neon-bloom-cyan border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
          >
            <Activity className="h-4 w-4 mr-2" />
            Qubit States
          </TabsTrigger>
          <TabsTrigger 
            value="circuit"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:neon-bloom-cyan border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
          >
            <GitBranch className="h-4 w-4 mr-2" />
            Circuit
          </TabsTrigger>
          <TabsTrigger 
            value="probability"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:neon-bloom-cyan border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
          >
            <Gauge className="h-4 w-4 mr-2" />
            Probability
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto p-6">
          <TabsContent value="states" className="mt-0">
            <QubitStatesView />
          </TabsContent>
          
          <TabsContent value="circuit" className="mt-0">
            <CircuitView />
          </TabsContent>
          
          <TabsContent value="probability" className="mt-0">
            <ProbabilityView />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

const QubitStatesView = () => {
  const qubits = [
    { id: "A", label: "Message", state: "|0⟩", amplitude: [1, 0] },
    { id: "B", label: "Alice", state: "|Φ+⟩", amplitude: [0.707, 0.707] },
    { id: "C", label: "Bob", state: "|Φ+⟩", amplitude: [0.707, 0.707] },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-quantum text-sm text-muted-foreground mb-4">Live Qubit States</h3>
      
      {qubits.map((qubit) => (
        <div key={qubit.id} className="holo-panel p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center font-quantum text-sm text-primary">
                {qubit.id}
              </div>
              <div>
                <div className="font-medium text-sm">{qubit.label}</div>
                <div className="font-quantum text-xs text-muted-foreground">{qubit.state}</div>
              </div>
            </div>
            
            {/* Bloch sphere thumbnail placeholder */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-quantum-cyan/20 to-quantum-purple/20 border border-primary/30" />
          </div>

          {/* Amplitude visualization */}
          <div className="flex gap-2 mt-3">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-quantum-cyan to-quantum-purple"
                style={{ width: `${qubit.amplitude[0] * 100}%` }}
              />
            </div>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-quantum-purple to-quantum-magenta"
                style={{ width: `${qubit.amplitude[1] * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const CircuitView = () => {
  return (
    <div className="space-y-4">
      <h3 className="font-quantum text-sm text-muted-foreground mb-4">Quantum Circuit</h3>
      
      {/* Circuit placeholder */}
      <div className="holo-panel p-6 rounded-lg min-h-[300px] flex items-center justify-center">
        <div className="text-center space-y-2">
          <GitBranch className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <p className="font-quantum text-sm text-muted-foreground">
            Circuit diagram placeholder
          </p>
          <p className="text-xs text-muted-foreground/70">
            Visual gate representation
          </p>
        </div>
      </div>
    </div>
  );
};

const ProbabilityView = () => {
  const outcomes = [
    { state: "|00⟩", probability: 0.5, color: "quantum-cyan" },
    { state: "|01⟩", probability: 0.2, color: "quantum-purple" },
    { state: "|10⟩", probability: 0.2, color: "quantum-magenta" },
    { state: "|11⟩", probability: 0.1, color: "quantum-gold" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-quantum text-sm text-muted-foreground mb-4">Measurement Probabilities</h3>
      
      {/* Radial meter */}
      <div className="holo-panel p-6 rounded-lg">
        <div className="relative w-48 h-48 mx-auto">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {outcomes.map((outcome, i) => {
              const offset = outcomes.slice(0, i).reduce((sum, o) => sum + o.probability, 0);
              const circumference = 2 * Math.PI * 40;
              const strokeDashoffset = circumference * (1 - outcome.probability);
              const strokeDasharray = `${circumference * outcome.probability} ${circumference}`;
              
              return (
                <circle
                  key={outcome.state}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={`hsl(var(--${outcome.color}))`}
                  strokeWidth="8"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={-circumference * offset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold font-quantum text-primary">100%</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Probability list */}
      <div className="space-y-2">
        {outcomes.map((outcome) => (
          <div key={outcome.state} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: `hsl(var(--${outcome.color}))` }}
              />
              <span className="font-quantum text-sm">{outcome.state}</span>
            </div>
            <span className="font-quantum text-sm text-muted-foreground">
              {(outcome.probability * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
