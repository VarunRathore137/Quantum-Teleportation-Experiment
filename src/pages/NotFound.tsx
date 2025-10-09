import { ArrowLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuantumShell } from '@/components/QuantumShell';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <QuantumShell>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md mx-auto text-center space-y-8 animate-fade-in">
          {/* Quantum 404 Animation */}
          <div className="relative mb-8">
            <div className="text-8xl font-quantum font-bold bg-gradient-to-r from-quantum-cyan via-quantum-purple to-quantum-magenta bg-clip-text text-transparent">
              404
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-primary"
                  style={{
                    animation: `orbit ${3 + i * 0.5}s linear infinite`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full holo-panel">
              <Zap className="h-4 w-4 text-accent" />
              <span className="font-quantum text-sm text-muted-foreground">
                Quantum State Not Found
              </span>
            </div>
            
            <h1 className="text-2xl font-bold text-foreground">
              This dimension doesn't exist
            </h1>
            
            <p className="text-muted-foreground leading-relaxed">
              The quantum state you're looking for has collapsed or been entangled 
              with another universe. Let's teleport you back to reality.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <Button
              size="lg"
              onClick={() => navigate('/')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/50 px-8"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Return to Quantum Lab
            </Button>
            
            <p className="text-xs text-muted-foreground font-quantum">
              Or use the navigation above to explore other quantum dimensions
            </p>
          </div>

          {/* Quantum field animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-accent/30"
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
      
      <style>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(60px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(60px) rotate(-360deg);
          }
        }
      `}</style>
    </QuantumShell>
  );
};

export default NotFound;

