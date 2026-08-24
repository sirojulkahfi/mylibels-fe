"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
import { guruStafService } from '@/services/data-induk/guru-staf.service';

export default function GuruRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    const fetchGuru = async () => {
      try {
        const res = await guruStafService.findAll();
        if (res && res.length > 0) {
          router.replace(`/akademik/jadwal-pelajaran/guru/${res[0].id}`);
        } else {
          router.replace(`/akademik/jadwal-pelajaran/guru/empty`);
        }
      } catch (error) {
        console.error("Gagal memuat guru", error);
      }
    };
    fetchGuru();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-full flex-1 min-h-[50vh]">
      <Spin size="large" />
    </div>
  );
}
