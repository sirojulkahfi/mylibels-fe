"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';

export default function AkademikJadwalRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/akademik/jadwal-pelajaran/rombel');
  }, [router]);

  return (
    <div className="flex justify-center items-center h-full flex-1">
      <Spin size="large" />
    </div>
  );
}
