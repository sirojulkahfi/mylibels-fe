'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function RootPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (!token || !user) {
      router.push('/login');
      return;
    }

    const roleName = user?.role?.name?.toUpperCase();
    if (roleName === 'ADMIN') {
      router.push('/dashboard/admin');
    } else if (roleName === 'GURU') {
      router.push('/dashboard/guru');
    } else if (roleName === 'WALI_KELAS' || roleName === 'WALI KELAS') {
      router.push('/dashboard/wali-kelas');
    } else if (roleName === 'SISWA') {
      router.push('/dashboard/siswa');
    } else {
      router.push('/dashboard'); // fallback
    }
  }, [user, token, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-xl font-semibold">Memuat halaman...</div>
    </div>
  );
}
