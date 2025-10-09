import { create } from 'zustand';

export type Mode = 'tour' | 'explorer' | 'researcher';

interface UIState {
  mode: Mode;
  theme: 'dark' | 'light';
  language: string;
  reducedMotion: boolean;
  
  // Panel visibility
  panelsOpen: {
    legend: boolean;
    glossary: boolean;
    assets: boolean;
    scenes: boolean;
    explanations: boolean;
  };
  
  // Actions
  setMode: (mode: Mode) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setLanguage: (language: string) => void;
  setReducedMotion: (enabled: boolean) => void;
  togglePanel: (panel: keyof UIState['panelsOpen']) => void;
  setPanelOpen: (panel: keyof UIState['panelsOpen'], open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  mode: 'tour',
  theme: 'dark',
  language: 'en',
  reducedMotion: false,
  
  panelsOpen: {
    legend: false,
    glossary: false,
    assets: false,
    scenes: false,
    explanations: false,
  },
  
  setMode: (mode) => set({ mode }),
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  
  togglePanel: (panel) =>
    set((state) => ({
      panelsOpen: {
        ...state.panelsOpen,
        [panel]: !state.panelsOpen[panel],
      },
    })),
    
  setPanelOpen: (panel, open) =>
    set((state) => ({
      panelsOpen: {
        ...state.panelsOpen,
        [panel]: open,
      },
    })),
}));

// Hooks for easy access
export const useUI = () => useUIStore();
export const useMode = () => useUIStore((state) => state.mode);
export const useTheme = () => useUIStore((state) => state.theme);
export const usePanelsOpen = () => useUIStore((state) => state.panelsOpen);