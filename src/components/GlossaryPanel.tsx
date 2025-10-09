import { useState } from 'react';
import { BookOpen, X, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { usePanelsOpen, useUIStore } from '@/state/ui';

interface GlossaryTerm {
  id: string;
  term: string;
  simple: string;
  technical: string;
  category: 'quantum' | 'teleportation' | 'computing' | 'physics';
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'entanglement',
    term: 'Quantum Entanglement',
    simple: 'When two particles become magically connected so that measuring one instantly affects the other, no matter how far apart they are.',
    technical: 'A quantum mechanical phenomenon where pairs of particles become correlated in such a way that the quantum state of one particle cannot be described independently of the others.',
    category: 'quantum'
  },
  {
    id: 'superposition',
    term: 'Superposition',
    simple: 'A quantum particle can be in multiple states at the same time, like a coin spinning in the air before it lands.',
    technical: 'The principle that any two quantum states can be added together to yield another valid quantum state, allowing particles to exist in multiple states simultaneously.',
    category: 'quantum'
  },
  {
    id: 'qubit',
    term: 'Qubit',
    simple: 'The quantum version of a computer bit. Instead of just 0 or 1, it can be both at the same time.',
    technical: 'A quantum bit - the basic unit of quantum information, capable of existing in superposition of |0⟩ and |1⟩ states.',
    category: 'computing'
  },
  {
    id: 'bell-state',
    term: 'Bell State',
    simple: 'Special pairs of connected quantum particles that are perfectly entangled together.',
    technical: 'One of four maximally entangled two-qubit quantum states: |Φ+⟩, |Φ-⟩, |Ψ+⟩, |Ψ-⟩, forming an orthonormal basis for two-qubit systems.',
    category: 'quantum'
  },
  {
    id: 'measurement',
    term: 'Quantum Measurement',
    simple: 'The act of looking at a quantum particle, which forces it to choose a definite state and breaks superposition.',
    technical: 'A process that extracts classical information from a quantum system, causing wavefunction collapse to an eigenstate.',
    category: 'physics'
  },
  {
    id: 'teleportation',
    term: 'Quantum Teleportation',
    simple: 'Moving the information stored in a quantum particle from one place to another without the particle traveling.',
    technical: 'A quantum communication protocol for transferring quantum states using entanglement, Bell measurements, and classical communication.',
    category: 'teleportation'
  },
  {
    id: 'fidelity',
    term: 'Fidelity',
    simple: 'How close the teleported quantum state is to the original - like measuring how perfect a copy is.',
    technical: 'A measure of the closeness between two quantum states, with perfect fidelity = 1 indicating identical states.',
    category: 'physics'
  },
  {
    id: 'decoherence',
    term: 'Decoherence',
    simple: 'When quantum particles lose their special quantum properties due to interference from their environment.',
    technical: 'The process by which quantum coherence is lost due to interaction with the environment, destroying superposition and entanglement.',
    category: 'physics'
  }
];

const CATEGORY_COLORS = {
  quantum: 'quantum-cyan',
  teleportation: 'quantum-magenta',
  computing: 'quantum-purple',
  physics: 'quantum-gold'
};

export const GlossaryPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showTechnical, setShowTechnical] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const panelsOpen = usePanelsOpen();
  const setPanelOpen = useUIStore(state => state.setPanelOpen);
  
  const isOpen = panelsOpen.glossary;

  const filteredTerms = GLOSSARY_TERMS.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.simple.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.technical.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || term.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setPanelOpen('glossary', true)}
        className="fixed left-4 top-1/2 translate-y-20 z-40 bg-card/50 backdrop-blur-sm border border-border/30 hover:bg-card hover:neon-bloom-purple"
        aria-label="Open glossary panel"
      >
        <BookOpen className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div 
      className="fixed left-4 top-1/2 -translate-y-1/2 w-96 holo-panel rounded-xl z-40 max-h-[80vh] flex flex-col"
      role="complementary"
      aria-label="Quantum glossary"
    >
      {/* Header */}
      <div className="p-4 border-b border-border/30 flex items-center justify-between">
        <h3 className="font-quantum text-lg font-semibold text-foreground">
          Quantum Glossary
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPanelOpen('glossary', false)}
          className="hover:bg-primary/10 hover:text-primary"
          aria-label="Close glossary panel"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Controls */}
      <div className="p-4 space-y-3 border-b border-border/30">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-muted/30 border-border/50"
          />
        </div>

        {/* Technical toggle */}
        <div className="flex items-center justify-between">
          <span className="font-quantum text-sm text-muted-foreground">
            Show technical definitions
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTechnical(!showTechnical)}
            className="p-1 hover:bg-primary/10"
          >
            {showTechnical ? (
              <ToggleRight className="h-5 w-5 text-primary" />
            ) : (
              <ToggleLeft className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              className={`px-3 py-1 rounded-full text-xs font-quantum transition-all ${
                selectedCategory === category
                  ? `bg-${color}/20 text-${color} border-${color}/50`
                  : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
              } border`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Terms list */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No terms found matching your search.</p>
            </div>
          ) : (
            filteredTerms.map((term) => (
              <div
                key={term.id}
                className="p-4 rounded-lg holo-panel hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-quantum font-semibold text-foreground">
                    {term.term}
                  </h4>
                  <span 
                    className={`px-2 py-1 rounded text-xs font-quantum bg-${CATEGORY_COLORS[term.category]}/20 text-${CATEGORY_COLORS[term.category]} border border-${CATEGORY_COLORS[term.category]}/30`}
                  >
                    {term.category}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {showTechnical ? term.technical : term.simple}
                </p>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border/30">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-quantum">
          <div className="w-2 h-2 rounded-full bg-secondary animate-quantum-glow" />
          <span>{filteredTerms.length} terms available</span>
        </div>
      </div>
    </div>
  );
};