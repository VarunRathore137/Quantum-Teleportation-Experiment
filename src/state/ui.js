import { create } from 'zustand';

const useUIStore = create((set) => ({
  // State
  mode: 'tour', // 'tour' | 'explorer' | 'researcher'
  theme: 'dark', // 'dark' | 'light'
  language: 'en',
  reducedMotion: false,
  
  // Panel visibility
  panelsOpen: {
    legend: false,
    glossary: false,
    assets: false,
    scenes: false,
    explanations: false,
  },
  
  // Actions
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

export { useUIStore };