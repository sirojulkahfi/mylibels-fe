"use client";

import React, { useState, useEffect } from 'react';
import { Table, Breadcrumb, Button, Tag, App } from 'antd';
import { 
  ArrowLeftOutlined,
  TrophyOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { kelasService } from '@/services/data-induk/kelas.service';
import { siswaService } from '@/services/data-induk/siswa.service';
import { penilaianService } from '@/services/penilaian/penilaian.service';

export default function PeringkatKelasPage() {
  const router = useRouter();
  const params = useParams();
  const kelasId = params.kelasId as string;
  const { message } = App.useApp();

  const [loading, setLoading] = useState(true);
  const [kelasName, setKelasName] = useState<string>('...');
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil nama kelas
        const kelasList = await kelasService.findAll();
        const found = kelasList?.find((k: any) => k.id === kelasId);
        if (found) setKelasName(found.name);
        else setKelasName('Tidak Ditemukan');

        // Ambil siswa berdasarkan kelas
        const allSiswa = await siswaService.findAll();
        const siswaKelas = (allSiswa || []).filter((s: any) => s.kelasId === kelasId || s.class === found?.name);

        // Ambil nilai sumatif untuk menghitung rata-rata
        const nilaiSumatif = await penilaianService.findAllSumatif().catch(() => []);

        // Hitung rata-rata nilai per siswa
        const ranked = siswaKelas.map((s: any) => {
          const nilaiSiswa = (nilaiSumatif || []).filter((n: any) => n.siswaId === s.id);
          const totalNilai = nilaiSiswa.reduce((sum: number, n: any) => sum + (n.nilai || 0), 0);
          const rataRata = nilaiSiswa.length > 0 ? Math.round((totalNilai / nilaiSiswa.length) * 100) / 100 : 0;

          return {
            ...s,
            jumlahMapel: nilaiSiswa.length,
            totalNilai: Math.round(totalNilai * 100) / 100,
            rataRata,
          };
        });

        // Urutkan berdasarkan rata-rata tertinggi
        ranked.sort((a: any, b: any) => b.rataRata - a.rataRata);

        // Tambahkan peringkat
        const withRank = ranked.map((item: any, index: number) => ({
          ...item,
          peringkat: index + 1,
        }));

        setData(withRank);
      } catch (error) {
        message.error("Gagal memuat data peringkat");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [kelasId, message]);

  const columns = [
    {
      title: 'Peringkat',
      dataIndex: 'peringkat',
      key: 'peringkat',
      width: 90,
      align: 'center' as const,
      render: (rank: number) => {
        if (rank <= 3) {
          const colors = ['#FFD700', '#C0C0C0', '#CD7F32'];
          return (
            <div className="flex items-center justify-center gap-1">
              <TrophyOutlined style={{ color: colors[rank - 1], fontSize: 18 }} />
              <span className="font-extrabold text-lg">{rank}</span>
            </div>
          );
        }
        return <span className="font-bold text-gray-600">{rank}</span>;
      }
    },
    {
      title: 'Nama Siswa',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (text: string, record: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{text}</span>
          <span className="text-xs text-gray-400">NISN: {record.nisn || '-'}</span>
        </div>
      ),
    },
    {
      title: 'Jumlah Mapel',
      dataIndex: 'jumlahMapel',
      key: 'jumlahMapel',
      width: 120,
      align: 'center' as const,
      render: (val: number) => <Tag color="blue">{val} Mapel</Tag>,
    },
    {
      title: 'Total Nilai',
      dataIndex: 'totalNilai',
      key: 'totalNilai',
      width: 120,
      align: 'center' as const,
      render: (val: number) => <span className="font-semibold text-gray-700">{val}</span>,
    },
    {
      title: 'Rata-rata',
      dataIndex: 'rataRata',
      key: 'rataRata',
      width: 120,
      align: 'center' as const,
      render: (val: number) => {
        let color = 'text-red-500';
        if (val >= 80) color = 'text-emerald-600';
        else if (val >= 70) color = 'text-blue-600';
        else if (val >= 60) color = 'text-yellow-600';
        return <span className={`font-bold text-lg ${color}`}>{val}</span>;
      }
    },
    {
      title: 'Predikat',
      key: 'predikat',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: any) => {
        if (record.rataRata >= 90) return <Tag color="success">A</Tag>;
        if (record.rataRata >= 80) return <Tag color="processing">B</Tag>;
        if (record.rataRata >= 70) return <Tag color="warning">C</Tag>;
        if (record.rataRata >= 60) return <Tag color="orange">D</Tag>;
        return <Tag color="error">E</Tag>;
      }
    },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: <Link href="/laporan">Laporan</Link> },
          { title: <Link href="/laporan/rapor">Rapor</Link> },
          { title: `Peringkat Kelas ${kelasName}` },
        ]} />
      </div>

      <ToolbarWrapper>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.back()}
          className="border-0 flex items-center shadow-none hover:opacity-80 px-3 ml-2 mr-4"
          style={{ color: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          Kembali
        </Button>
        <span className="text-white font-bold">Peringkat Siswa — Kelas {kelasName}</span>

        <ButtonToolbar 
          message="Unduh PDF" 
          icon={<DownloadOutlined />} 
          className="ml-auto bg-blue-600 text-white hover:bg-blue-700 border-none"
        />
      </ToolbarWrapper>

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-4 mt-1 rounded-lg shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
        <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800 flex items-start gap-2">
          <TrophyOutlined className="mt-1" />
          <div>
            <strong>Peringkat Kelas {kelasName}</strong><br />
            Peringkat dihitung berdasarkan rata-rata nilai sumatif seluruh mata pelajaran. Semakin tinggi rata-rata, semakin tinggi peringkat.
          </div>
        </div>

        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          pagination={false}
          size="small" bordered
          loading={loading}
          scroll={{ y: 'calc(100vh - 350px)' }}
        />
      </div>
    </div>
  );
}
