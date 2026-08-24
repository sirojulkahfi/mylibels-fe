"use client";

import React, { useState, useEffect } from 'react';
import { Table, Breadcrumb, Button, Select, App } from 'antd';
import { ArrowLeftOutlined,
  PrinterOutlined, ReloadOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import { akademikService } from '@/services/akademik/akademik.service';
import { kelasService } from '@/services/data-induk/kelas.service';
import { mataPelajaranService } from '@/services/data-induk/mata-pelajaran.service';
import { guruStafService } from '@/services/data-induk/guru-staf.service';
import EditJadwalModal from './_components/EditJadwalModal';

export default function JadwalRombelPage() {
  const router = useRouter();
  const params = useParams();
  const kelasId = params.kelasId as string;
  const { message } = App.useApp();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKelas, setSelectedKelas] = useState(kelasId);
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [mapelList, setMapelList] = useState<any[]>([]);
  const [guruList, setGuruList] = useState<any[]>([]);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJadwal, setSelectedJadwal] = useState<any | null>(null);

  // Fetch Kelas List for Dropdown
  const fetchKelas = async () => {
    try {
      const [resKelas, resMapel, resGuru] = await Promise.all([
        kelasService.findAll(),
        mataPelajaranService.findAll(),
        guruStafService.findAll()
      ]);
      setKelasList(resKelas || []);
      setMapelList(resMapel || []);
      setGuruList(resGuru || []);
    } catch (error) {
      console.error("Gagal memuat referensi data", error);
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
      
      // Standar jam pelajaran
      const jamList = [
        { mulai: '07:00', selesai: '07:45' },
        { mulai: '07:45', selesai: '08:30' },
        { mulai: '08:30', selesai: '09:15' },
        { mulai: '09:15', selesai: '09:45', isBreak: true, label: 'Istirahat' },
        { mulai: '09:45', selesai: '10:30' },
        { mulai: '10:30', selesai: '11:15' },
        { mulai: '11:15', selesai: '12:00' },
        { mulai: '12:00', selesai: '12:30', isBreak: true, label: 'Istirahat' },
        { mulai: '12:30', selesai: '13:15' },
        { mulai: '13:15', selesai: '14:00' }
      ];

      const mapped = jamList.map((jam, idx) => {
        const timeStr = `${jam.mulai} - ${jam.selesai}`;
        
        if (jam.isBreak) {
          return {
            key: `break-${idx}`,
            time: timeStr,
            mon: { text: jam.label, type: 'break' },
            tue: { text: jam.label, type: 'break' },
            wed: { text: jam.label, type: 'break' },
            thu: { text: jam.label, type: 'break' },
            fri: { text: jam.label, type: 'break' },
          };
        }

        const findJadwal = (hari: string) => res?.find((r: any) => r.hari === hari && r.jamMulai === jam.mulai);

        return {
          key: idx,
          time: timeStr,
          mon: { ...findJadwal('Senin'), hari: 'Senin', jamMulai: jam.mulai, jamSelesai: jam.selesai },
          tue: { ...findJadwal('Selasa'), hari: 'Selasa', jamMulai: jam.mulai, jamSelesai: jam.selesai },
          wed: { ...findJadwal('Rabu'), hari: 'Rabu', jamMulai: jam.mulai, jamSelesai: jam.selesai },
          thu: { ...findJadwal('Kamis'), hari: 'Kamis', jamMulai: jam.mulai, jamSelesai: jam.selesai },
          fri: { ...findJadwal('Jumat'), hari: 'Jumat', jamMulai: jam.mulai, jamSelesai: jam.selesai },
        };
      });

      setData(mapped);
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

  const openModal = (cellData: any) => {
    if (cellData.type === 'break') return;
    setSelectedJadwal(cellData);
    setIsModalOpen(true);
  };

  const renderCell = (cellData: any) => {
    if (!cellData || cellData.type === 'break') {
      return <span className="text-gray-400 italic">{cellData?.text || '-'}</span>;
    }
    
    const text = cellData.mapelName;
    const guru = cellData.guruName;

    if (!text && !guru) {
      return (
        <div 
          onClick={() => openModal(cellData)}
          className="flex flex-col items-center justify-center p-2 h-16 bg-slate-50 border border-slate-200 border-dashed rounded-lg cursor-pointer hover:bg-slate-100 hover:border-blue-300 transition-all group"
        >
          <span className="text-gray-400 group-hover:text-blue-500">+ Tambah</span>
        </div>
      );
    }
    
    // Determine color based on subject roughly
    let bgColor = 'bg-blue-50';
    let borderColor = 'border-blue-200';
    let textColor = 'text-blue-700';
    
    if (text?.includes('IPA') || text?.includes('Matematika')) {
      bgColor = 'bg-emerald-50';
      borderColor = 'border-emerald-200';
      textColor = 'text-emerald-700';
    } else if (text?.includes('Bahasa')) {
      bgColor = 'bg-orange-50';
      borderColor = 'border-orange-200';
      textColor = 'text-orange-700';
    } else if (text?.includes('IPS') || text?.includes('PKN')) {
      bgColor = 'bg-purple-50';
      borderColor = 'border-purple-200';
      textColor = 'text-purple-700';
    }

    return (
      <div 
        onClick={() => openModal(cellData)}
        className={`flex flex-col items-center justify-center p-2 min-h-16 ${bgColor} border ${borderColor} rounded-lg cursor-pointer hover:opacity-80 hover:shadow-sm transition-all`}
      >
        <span className={`font-bold ${textColor} text-center`}>{text || '-'}</span>
        <span className="text-xs text-gray-500 mt-1 text-center truncate w-full" title={guru || '-'}>{guru || '-'}</span>
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
        <Button icon={<ReloadOutlined />} onClick={fetchKelas} loading={loading} type="default" className="mr-2">
          Muat Ulang
        </Button>
        
        <div className="flex flex-col ml-4 mr-4 hidden md:flex">
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

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-1 mt-1 rounded-lg shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0 overflow-hidden">
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="key"
          pagination={false}
          size="middle" bordered
          loading={loading}
          scroll={{ x: 'max-content', y: 'calc(100vh - 270px)' }}
        />
      </div>

      <EditJadwalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchJadwal();
        }}
        jadwalData={selectedJadwal}
        mapelList={mapelList}
        guruList={guruList}
        kelasId={selectedKelas}
      />
    </div>
  );
}
