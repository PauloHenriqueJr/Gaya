import { create } from 'zustand';

interface UiState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  commandPaletteOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  theme: 'light',
  commandPaletteOpen: false,

  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  
  setTheme: (theme: 'light' | 'dark' | 'system') => set({ theme }),
  
  setCommandPaletteOpen: (open: boolean) => set({ commandPaletteOpen: open })
}));