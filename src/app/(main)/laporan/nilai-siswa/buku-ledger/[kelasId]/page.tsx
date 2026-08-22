"use client";

import React, { useState, useEffect } from 'react';
import { Table, Breadcrumb, Button, Tag, App } from 'antd';
import { 
  ArrowLeftOutlined,
  DownloadOutlined,
  BookOutlined
} from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { kelasService } from '@/services/data-induk/kelas.service';
import { siswaService } from '@/services/data-induk/siswa.service';
import { penilaianService } from '@/services/penilaian/penilaian.service';
import { mapelService } from '@/services/data-induk/mapel.service';

export default function BukuLedgerPage() {
  const router = useRouter();
  const params = useParams();
  const kelasId = params.kelasId as string;
  const { message } = App.useApp();

  const [loading, setLoading] = useState(true);
  const [kelasName, setKelasName] = useState<string>('...');
  const [data, setData] = useState<any[]>([]);
  const [mapelColumns, setMapelColumns] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil nama kelas
        const kelasList = await kelasService.findAll();
        const found = kelasList?.find((k: any) => k.id === kelasId);
        if (found) setKelasName(found.name);
        else setKelasName('Tidak Ditemukan');

        // Ambil data mapel
        const mapelList = await mapelService.findAll().catch(() => []);

        // Ambil siswa berdasarkan kelas
        const allSiswa = await siswaService.findAll();
        const siswaKelas = (allSiswa || []).filter((s: any) => s.kelasId === kelasId || s.class === found?.name);

        // Ambil nilai sumatif
        const nilaiSumatif = await penilaianService.findAllSumatif().catch(() => []);

        // Buat kolom dinamis berdasarkan mata pelajaran
        const dynamicCols = (mapelList || []).map((m: any) => ({
          title: m.name,
          key: m.id,
          width: 80,
          align: 'center' as const,
          render: (_: any, record: any) => {
            const nilai = record.nilaiPerMapel?.[m.id];
            if (!nilai && nilai !== 0) return <span className="text-gray-300">-</span>;
            let color = 'text-red-500';
            if (nilai >= 80) color = 'text-emerald-600';
            else if (nilai >= 70) color = 'text-blue-600';
            else if (nilai >= 60) color = 'text-yellow-600';
            return <span className={`font-semibold ${color}`}>{nilai}</span>;
          }
        }));
        setMapelColumns(dynamicCols);

        // Gabungkan data siswa dengan nilai per mapel
        const merged = siswaKelas.map((s: any) => {
          const nilaiSiswa = (nilaiSumatif || []).filter((n: any) => n.siswaId === s.id);
          const nilaiPerMapel: any = {};
          nilaiSiswa.forEach((n: any) => {
            nilaiPerMapel[n.mapelId] = n.nilai;
          });

          const totalNilai = Object.values(nilaiPerMapel).reduce((sum: number, val: any) => sum + (val || 0), 0) as number;
          const jumlahMapel = Object.keys(nilaiPerMapel).length;
          const rataRata = jumlahMapel > 0 ? Math.round((totalNilai / jumlahMapel) * 100) / 100 : 0;

          return {
            ...s,
            nilaiPerMapel,
            totalNilai: Math.round(totalNilai * 100) / 100,
            rataRata,
          };
        });

        // Urutkan berdasarkan nama
        merged.sort((a: any, b: any) => a.name?.localeCompare(b.name));

        setData(merged);
      } catch (error) {
        message.error("Gagal memuat data buku ledger");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [kelasId, message]);

  const baseColumns = [
    {
      title: 'No',
      key: 'index',
      width: 50,
      fixed: 'left' as const,
      render: (_: any, __: any, index: number) => index + 1,
      align: 'center' as const,
    },
    {
      title: 'Nama Siswa',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left' as const,
      render: (text: string) => <span className="font-semibold text-gray-800">{text}</span>,
    },
  ];

  const summaryColumns = [
    {
      title: 'Total',
      dataIndex: 'totalNilai',
      key: 'totalNilai',
      width: 80,
      align: 'center' as const,
      render: (val: number) => <span className="font-bold text-gray-700">{val}</span>,
    },
    {
      title: 'Rata-rata',
      dataIndex: 'rataRata',
      key: 'rataRata',
      width: 90,
      align: 'center' as const,
      render: (val: number) => {
        let color = 'text-red-500';
        if (val >= 80) color = 'text-emerald-600';
        else if (val >= 70) color = 'text-blue-600';
        return <span className={`font-bold ${color}`}>{val}</span>;
      }
    },
  ];

  const allColumns = [...baseColumns, ...mapelColumns, ...summaryColumns];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: <Link href="/laporan">Laporan</Link> },
          { title: <Link href="/laporan/nilai-siswa">Nilai Siswa</Link> },
          { title: `Buku Ledger Kelas ${kelasName}` },
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
        <div className="flex flex-col mr-4">
          <span className="text-white font-bold leading-tight">Buku Ledger Nilai</span>
          <span className="text-gray-200 text-xs">Kelas {kelasName}</span>
        </div>

        <ButtonToolbar 
          message="Unduh Excel" 
          icon={<DownloadOutlined />} 
          className="ml-auto bg-emerald-600 text-white hover:bg-emerald-700 border-none"
        />
      </ToolbarWrapper>

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-4 mt-1 rounded-lg shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
        <div className="mb-4 bg-indigo-50 p-3 rounded-lg border border-indigo-100 text-sm text-indigo-800 flex items-start gap-2">
          <BookOutlined className="mt-1" />
          <div>
            <strong>Buku Ledger Kelas {kelasName}</strong><br />
            Menampilkan rekapitulasi nilai sumatif seluruh siswa per mata pelajaran dalam satu tabel.
          </div>
        </div>

        <Table 
          columns={allColumns} 
          dataSource={data} 
          rowKey="id"
          pagination={false}
          size="small" bordered
          loading={loading}
          scroll={{ x: 'max-content', y: 'calc(100vh - 350px)' }}
        />
      </div>
    </div>
  );
}
