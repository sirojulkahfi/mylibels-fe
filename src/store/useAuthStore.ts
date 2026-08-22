import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface User {
  id: number;
  username: string;
  name?: string;
  namaLengkap?: string;
  role: {
    name: string;
    permissions?: string[];
  };
}

interface AuthState {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) => {
        // Change to session cookie by removing expires
        Cookies.set('token', token);
        set({ token, user });
      },
      logout: () => {
        Cookies.remove('token');
        set({ token: null, user: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
