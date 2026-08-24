import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface User {
  id: string;
  username: string;
  name?: string;
  namaLengkap?: string;
  guruStaf?: {
    id: string;
    nip: string;
    subject: string;
  } | null;
  siswa?: {
    id: string;
    nis: string;
    nisn: string;
    name: string;
    class: string;
  } | null;
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
