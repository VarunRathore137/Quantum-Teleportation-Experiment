import { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { useTeleportationStore, TeleportationPhase } from "@/state/teleportationStore";

const TIMELINE_PHASES = [
  { id: "setup", label: "Setup", position: 0 },
  { id: "hadamard_applied", label: "Hadamard", position: 0.15 },
  { id: "alice_bob_entangled", label: "Entangle A-B", position: 0.3 },
  { id: "message_appears", label: "Message", position: 0.45 },
  { id: "message_alice_entangled", label: "Entangle M-A", position: 0.6 },
  { id: "ready_to_measure", label: "Ready", position: 0.75 },
  { id: "result_shown", label: "Result", position: 1 },
];

export const TimelineController = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState([0]);
  const [speed, setSpeed] = useState(1);

  const timelinePosition = useTeleportationStore((state) => state.timelinePosition);
  const jumpToPhase = useTeleportationStore((state) => state.jumpToPhase);
  const reset = useTeleportationStore((state) => state.reset);

  // Sync progress from store
  useEffect(() => {
    setProgress([timelinePosition]);
  }, [timelinePosition]);

  const SNAP_THRESHOLD = 0.03; // Magnetic snap within 3%

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // TODO: Connect to animation loop
  };

  const handleStepBack = () => {
    const currentPhaseIndex = TIMELINE_PHASES.findIndex(
      (p) => p.position >= progress[0]
    );
    if (currentPhaseIndex > 0) {
      const targetPhase = TIMELINE_PHASES[currentPhaseIndex - 1];
      setProgress([targetPhase.position]);
      jumpToPhase(targetPhase.id as TeleportationPhase);
    }
  };

  const handleStepForward = () => {
    const currentPhaseIndex = TIMELINE_PHASES.findIndex(
      (p) => p.position >= progress[0]
    );
    if (currentPhaseIndex < TIMELINE_PHASES.length - 1) {
      const targetPhase = TIMELINE_PHASES[currentPhaseIndex + 1];
      setProgress([targetPhase.position]);
      jumpToPhase(targetPhase.id as TeleportationPhase);
    }
  };

  const handleReset = () => {
    setProgress([0]);
    setIsPlaying(false);
    reset();
  };

  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0];

    // Magnetic snapping to keyframes
    const nearestPhase = TIMELINE_PHASES.find(
      (phase) => Math.abs(phase.position - newProgress) < SNAP_THRESHOLD
    );

    if (nearestPhase) {
      setProgress([nearestPhase.position]);
    } else {
      setProgress(value);
    }
  };

  return (
    <div className="holo-panel border-t border-border/30 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4">
        {/* Timeline track */}
        <div className="relative mb-6">
          {/* Phase markers */}
          <div className="relative h-2 mb-6">
            {TIMELINE_PHASES.map((phase) => (
              <div
                key={phase.id}
                className="absolute top-0 transform -translate-x-1/2 group cursor-pointer"
                style={{ left: `${phase.position * 100}%` }}
                onClick={() => setProgress([phase.position])}
              >
                {/* Marker dot */}
                <div className="w-3 h-3 rounded-full bg-primary border-2 border-background shadow-lg shadow-primary/50 group-hover:scale-150 transition-transform" />

                {/* Label */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="font-quantum text-xs text-muted-foreground group-hover:text-primary transition-colors">
                    {phase.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Progress slider with magnetic snapping */}
          <Slider
            value={progress}
            onValueChange={handleProgressChange}
            max={1}
            step={0.01}
            className="w-full"
            aria-label="Timeline progress"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Playback controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="hover:bg-primary/10 hover:text-primary hover:neon-bloom-cyan"
              aria-label="Reset timeline"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleStepBack}
              className="hover:bg-primary/10 hover:text-primary hover:neon-bloom-cyan"
              aria-label="Step backward"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              onClick={handlePlayPause}
              className="bg-primary hover:bg-primary/90 neon-bloom-cyan"
              aria-label={isPlaying ? "Pause" : "Play"}
              aria-pressed={isPlaying}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 ml-0.5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleStepForward}
              className="hover:bg-primary/10 hover:text-primary hover:neon-bloom-cyan"
              aria-label="Step forward"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Speed control */}
          <div className="flex items-center gap-3">
            <span className="font-quantum text-xs text-muted-foreground">Speed:</span>
            <div className="flex items-center gap-1">
              {[0.25, 0.5, 1, 1.5, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`
                    px-2 py-1 rounded text-xs font-quantum transition-all
                    ${speed === s
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }
                  `}
                >
                  {s}×
                </button>
              ))}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="font-quantum text-sm text-muted-foreground">
            {Math.round(progress[0] * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
};
