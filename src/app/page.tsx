'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { getDashboardRoute } from '@/utils/dashboard-route';

export default function RootPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (!token || !user) {
      router.push('/login');
      return;
    }

    router.push(getDashboardRoute(user?.role?.name));
  }, [user, token, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-xl font-semibold">Memuat halaman...</div>
    </div>
  );
}
