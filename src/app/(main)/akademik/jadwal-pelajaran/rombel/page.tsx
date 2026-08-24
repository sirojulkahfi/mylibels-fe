"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
import { kelasService } from '@/services/data-induk/kelas.service';

export default function RombelRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const res = await kelasService.findAll();
        if (res && res.length > 0) {
          router.replace(`/akademik/jadwal-pelajaran/rombel/${res[0].id}`);
        } else {
          router.replace(`/akademik/jadwal-pelajaran/rombel/empty`);
        }
      } catch (error) {
        console.error("Gagal memuat kelas", error);
      }
    };
    fetchKelas();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-full flex-1 min-h-[50vh]">
      <Spin size="large" />
    </div>
  );
}
