"use client";

import React, { useState, useEffect } from 'react';
import { Table, Breadcrumb, Button, Select, App } from 'antd';
import { 
  ArrowLeftOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import { akademikService } from '@/services/akademik/akademik.service';
import { kelasService } from '@/services/data-induk/kelas.service';

export default function JadwalRombelPage() {
  const router = useRouter();
  const params = useParams();
  const kelasId = params.kelasId as string;
  const { message } = App.useApp();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKelas, setSelectedKelas] = useState(kelasId);
  const [kelasList, setKelasList] = useState<any[]>([]);

  // Fetch Kelas List for Dropdown
  const fetchKelas = async () => {
    try {
      const res = await kelasService.findAll();
      setKelasList(res || []);
    } catch (error) {
      console.error("Gagal memuat kelas", error);
    }
  };

  useEffect(() => {
    fetchKelas();
  }, []);

  // Since actual API mapping can be complex (grouping by time), we just mock structure temporarily 
  // or build a parser if we have real data. For this integration, we'll fetch and map or fallback to default structure.
  const fetchJadwal = async () => {
    if (!selectedKelas) return;
    try {
      setLoading(true);
      const res = await akademikService.getJadwalByKelas(selectedKelas);
      // NOTE: In a real scenario, you'd map the 1D list from backend into the 2D matrix (times x days).
      // If no data, use a fallback structure for now
      if (res && res.length > 0) {
        // Just mock mapping for UI showcase
        const mapped = res.map((r: any, i: number) => ({
          key: r.id || i,
          time: `${r.jamMulai} - ${r.jamSelesai}`,
          mon: r.hari === 'Senin' ? `${r.mataPelajaran?.name || '-'} (${r.guru?.name || '-'})` : '-',
          tue: r.hari === 'Selasa' ? `${r.mataPelajaran?.name || '-'} (${r.guru?.name || '-'})` : '-',
          wed: r.hari === 'Rabu' ? `${r.mataPelajaran?.name || '-'} (${r.guru?.name || '-'})` : '-',
          thu: r.hari === 'Kamis' ? `${r.mataPelajaran?.name || '-'} (${r.guru?.name || '-'})` : '-',
          fri: r.hari === 'Jumat' ? `${r.mataPelajaran?.name || '-'} (${r.guru?.name || '-'})` : '-',
        }));
        setData(mapped);
      } else {
        setData([]); // fallback to empty
      }
    } catch (error) {
      // Don't show error if it's just not found or if the id is invalid ('vii-a')
      console.error(error);
      setData([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJadwal();
  }, [selectedKelas]);

  const renderCell = (text: string) => {
    if (!text || text === '-' || text === 'Istirahat' || text === 'Upacara' || text === 'Senam') {
      return <span className="text-gray-400 italic">{text || '-'}</span>;
    }
    
    // Determine color based on subject
    let bgColor = 'bg-blue-50';
    let borderColor = 'border-blue-200';
    let textColor = 'text-blue-700';
    
    if (text === 'IPA' || text === 'Matematika') {
      bgColor = 'bg-emerald-50';
      borderColor = 'border-emerald-200';
      textColor = 'text-emerald-700';
    } else if (text === 'Bahasa Indonesia' || text === 'Bahasa Inggris') {
      bgColor = 'bg-orange-50';
      borderColor = 'border-orange-200';
      textColor = 'text-orange-700';
    } else if (text === 'IPS' || text === 'PKN') {
      bgColor = 'bg-purple-50';
      borderColor = 'border-purple-200';
      textColor = 'text-purple-700';
    }

    return (
      <div className={`flex flex-col items-center justify-center p-2 ${bgColor} border ${borderColor} rounded-lg cursor-pointer hover:opacity-80 transition-opacity`}>
        <span className={`font-bold ${textColor}`}>{text}</span>
        <span className="text-xs text-gray-500 mt-1">Guru Mapel</span>
      </div>
    );
  };

  const columns = [
    { title: 'Waktu', dataIndex: 'time', key: 'time', width: 120, align: 'center' as const, render: (t: string) => <span className="font-semibold text-gray-700">{t}</span> },
    { title: 'Senin', dataIndex: 'mon', key: 'mon', width: 150, align: 'center' as const, render: renderCell },
    { title: 'Selasa', dataIndex: 'tue', key: 'tue', width: 150, align: 'center' as const, render: renderCell },
    { title: 'Rabu', dataIndex: 'wed', key: 'wed', width: 150, align: 'center' as const, render: renderCell },
    { title: 'Kamis', dataIndex: 'thu', key: 'thu', width: 150, align: 'center' as const, render: renderCell },
    { title: 'Jumat', dataIndex: 'fri', key: 'fri', width: 150, align: 'center' as const, render: renderCell },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: <Link href="/akademik/jadwal-pelajaran">Jadwal Pelajaran</Link> },
          { title: 'Jadwal Rombel' },
        ]} />
      </div>

      <ToolbarWrapper>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.push('/akademik/jadwal-pelajaran')}
          className="border-0 flex items-center shadow-none hover:opacity-80 px-3 ml-2 mr-4"
          style={{ color: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          Kembali
        </Button>
        <div className="flex flex-col mr-4 hidden md:flex">
          <span className="text-white font-bold leading-tight">
            Jadwal Kelas {kelasList.length > 0 ? (kelasList.find(k => k.id === selectedKelas)?.name || 'Tidak Ditemukan') : 'Memuat...'}
          </span>
          <span className="text-gray-200 text-xs">
            Wali Kelas: {kelasList.length > 0 ? (kelasList.find(k => k.id === selectedKelas)?.homeroomTeacher || '-') : '...'}
          </span>
        </div>
        
        <Select 
          value={kelasList.length > 0 ? selectedKelas : undefined} 
          onChange={setSelectedKelas}
          className="ml-2 w-64"
          options={kelasList.map(k => ({ value: k.id, label: k.name }))} 
          showSearch
          placeholder={kelasList.length === 0 ? "Memuat kelas..." : "Pilih Kelas"}
          loading={kelasList.length === 0}
        />
        
        <div className="ml-auto flex gap-2">
          <Button 
            icon={<PrinterOutlined />} 
            type="primary"
            className="bg-emerald-500 border-0 hover:bg-emerald-400"
          >
            Cetak Jadwal Kelas
          </Button>
        </div>
      </ToolbarWrapper>

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-1 mt-1 rounded-lg shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0">
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          pagination={false}
          size="middle" bordered
          loading={loading}
          scroll={{ x: 800, y: 'calc(100vh - 270px)' }}
        />
      </div>
    </div>
  );
}
