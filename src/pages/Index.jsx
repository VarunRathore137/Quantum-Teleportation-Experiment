import { useState } from "react";
import { ArrowRight, BookOpen, Microscope, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantumShell } from "@/components/QuantumShell";
import { CommandBar } from "@/components/CommandBar";
import { Stage3DPlaceholder } from "@/components/Stage3DPlaceholder";
import { TimelineController } from "@/components/TimelineController";
import { LiveDataPanel } from "@/components/LiveDataPanel";
import { LegendPanel } from "@/components/LegendPanel";
import { GlossaryPanel } from "@/components/GlossaryPanel";

const Index = () => {
  const [showApp, setShowApp] = useState(false);
  const [currentMode, setCurrentMode] = useState("tour");

  if (showApp) {
    return (
      <QuantumShell>
        <div className="flex flex-col h-screen">
          <CommandBar currentMode={currentMode} onModeChange={setCurrentMode} />
          
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 flex flex-col p-6">
              <Stage3DPlaceholder />
            </div>
            <LiveDataPanel />
          </div>

          <TimelineController />
        </div>

        {/* Floating Panels */}
        <LegendPanel />
        <GlossaryPanel />
      </QuantumShell>
    );
  }

  return (
    <QuantumShell>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Hero title */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full holo-panel">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-quantum text-sm text-muted-foreground">
                Quantum Computing Visualization
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-quantum-cyan via-quantum-purple to-quantum-magenta bg-clip-text text-transparent">
                Quantum Teleportation,
              </span>
              <br />
              <span className="text-foreground">Reimagined</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A cinematic, interactive lab for every mind—from student to researcher.
              Experience quantum mechanics like never before.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => {
                setCurrentMode("tour");
                setShowApp(true);
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/50 px-8"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Start Guided Tour
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                setCurrentMode("explorer");
                setShowApp(true);
              }}
              className="border-primary/50 hover:bg-primary/10 hover:border-primary px-8"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Open Explorer
            </Button>

            <Button
              size="lg"
              variant="ghost"
              onClick={() => {
                setCurrentMode("researcher");
                setShowApp(true);
              }}
              className="hover:bg-muted/50 px-8"
            >
              <Microscope className="mr-2 h-5 w-5" />
              Researcher Mode
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {[
              {
                icon: BookOpen,
                title: "Guided Learning",
                description: "Step-by-step walkthroughs with interactive explanations",
                color: "quantum-cyan",
              },
              {
                icon: Sparkles,
                title: "Interactive 3D",
                description: "Real-time quantum state visualization in cinematic detail",
                color: "quantum-purple",
              },
              {
                icon: Microscope,
                title: "Research Ready",
                description: "Advanced controls and data export for serious exploration",
                color: "quantum-magenta",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="holo-panel p-6 rounded-xl hover:scale-105 transition-transform cursor-pointer group"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-${feature.color}/10 border border-${feature.color}/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`h-6 w-6 text-${feature.color}`} />
                </div>
                <h3 className="font-quantum text-lg font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Quantum field animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary/30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `quantum-pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </QuantumShell>
  );
};

export default Index;
