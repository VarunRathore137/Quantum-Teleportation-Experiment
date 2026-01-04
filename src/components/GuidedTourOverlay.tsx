import { useTeleportationStore, TOUR_STEPS } from '@/state/teleportationStore';
import { ArrowRight, SkipForward, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';

export const GuidedTourOverlay = () => {
   const isTourMode = useTeleportationStore((state) => state.isTourMode);
   const currentTourStep = useTeleportationStore((state) => state.currentTourStep);
   const phase = useTeleportationStore((state) => state.phase);
   const reset = useTeleportationStore((state) => state.reset);
   const setTourMode = useTeleportationStore((state) => state.setTourMode);

   if (!isTourMode) return null;

   const currentStep = TOUR_STEPS[currentTourStep];
   const isComplete = phase === 'result_shown';

   return (
      <div className="absolute bottom-24 left-4 right-4 z-50 pointer-events-none">
         <div className="max-w-2xl mx-auto">
            <div
               className="holo-panel rounded-xl p-4 pointer-events-auto"
               style={{
                  boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)',
               }}
            >
               {/* Progress bar */}
               <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                     <div
                        className="h-full bg-gradient-to-r from-quantum-cyan to-quantum-magenta transition-all duration-500"
                        style={{ width: `${((currentTourStep + 1) / TOUR_STEPS.length) * 100}%` }}
                     />
                  </div>
                  <span className="font-quantum text-xs text-muted-foreground">
                     {currentTourStep + 1}/{TOUR_STEPS.length}
                  </span>
               </div>

               {/* Instruction */}
               <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
                        <ArrowRight className="w-5 h-5 text-primary" />
                     </div>
                     <div>
                        <div className="text-xs text-muted-foreground font-quantum">
                           Step {currentTourStep + 1}
                        </div>
                        <div className="text-sm text-foreground font-medium">
                           {isComplete ? 'Teleportation Complete! 🎉' : currentStep?.instruction}
                        </div>
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                           reset();
                        }}
                        className="hover:bg-primary/10"
                     >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Restart
                     </Button>
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTourMode(false)}
                        className="hover:bg-muted"
                     >
                        <SkipForward className="w-4 h-4 mr-1" />
                        Exit Tour
                     </Button>
                  </div>
               </div>

               {/* Tip text */}
               {!isComplete && (
                  <div className="mt-3 pt-3 border-t border-border/30">
                     <p className="text-xs text-muted-foreground italic">
                        💡 Tip: Interact with the highlighted elements in the 3D view above
                     </p>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};
