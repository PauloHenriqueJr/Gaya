import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthCredentials } from '@/types';

interface AuthState {
  user: User | null;
  currentTenant: string;
  isLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
  setCurrentTenant: (tenant: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      currentTenant: 'demo-tenant',
      isLoading: false,

      login: async (credentials: AuthCredentials) => {
        set({ isLoading: true });

        // Mock login - em produção seria uma chamada real à API
        const mockUser: User = {
          id: '1',
          name: 'Administrador',
          email: credentials.email,
          role: 'admin',
        };

        set({ user: mockUser, isLoading: false });
      },

      logout: () => {
        set({ user: null });
      },

      setCurrentTenant: (tenant: string) => {
        set({ currentTenant: tenant });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        currentTenant: state.currentTenant,
      }),
    }
  )
);
