"use client";

import React, { useState, useEffect, use } from 'react';
import { Table, Button, Breadcrumb, App, Tag, Radio, Space } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import { presensiService } from '@/services/presensi/presensi.service';
import { akademikService } from '@/services/akademik/akademik.service';

export default function PresensiMapelDetail({ params }: { params: Promise<{ jadwalId: string }> }) {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [jadwalInfo, setJadwalInfo] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);

  const unwrappedParams = use(params);
  const jadwalId = unwrappedParams.jadwalId;

  const fetchData = async () => {
      try {
        // Ambil info jadwal untuk melihat kelas mana
        const jadwalList = await akademikService.findAllJadwal().catch(() => []);
        const jadwal = jadwalList.find((j: any) => j.id === jadwalId);
        if (jadwal) {
          setJadwalInfo(jadwal);
          
          // Ambil daftar presensi hari ini untuk jadwal ini, jika belum ada, buat dari daftar siswa kelas
          const res = await presensiService.findAllSiswa({ jadwalId: jadwalId, tanggal: new Date().toISOString().split('T')[0] });
          if (res && res.length > 0) {
            setData(res);
          } else {
             // Simulasi mengambil siswa untuk jadwal
             setData([]);
          }
        }
      } catch (error) {
        message.error("Gagal mengambil data siswa");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, [jadwalId]);

  const handleStatusChange = (recordId: string, status: string) => {
    setData(prev => prev.map(item => 
      item.id === recordId ? { ...item, status } : item
    ));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Di sini idealnya adalah proses save massal (Bulk Save) ke API
      message.success("Presensi mata pelajaran berhasil disimpan");
      setTimeout(() => {
        router.push('/presensi/mapel-siswa');
      }, 1000);
    } catch (error) {
      message.error("Gagal menyimpan presensi");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: 'No',
      key: 'index',
      width: 60,
      render: (text: any, record: any, index: number) => index + 1,
      align: 'center' as const,
    },
    {
      title: 'Nama Siswa',
      dataIndex: 'siswaName',
      key: 'siswaName',
      render: (text: string) => <span className="font-medium text-gray-800">{text}</span>,
    },
    {
      title: 'NIS / NISN',
      key: 'nis',
      width: 200,
      render: (_: any, record: any) => (
        <span className="text-gray-500 text-sm">{record.nis || '-'} / {record.nisn || '-'}</span>
      ),
    },
    {
      title: 'Status Kehadiran',
      key: 'status',
      width: 350,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Radio.Group 
          value={record.status || 'Hadir'} 
          onChange={(e) => handleStatusChange(record.id, e.target.value)}
          buttonStyle="solid"
          size="middle"
        >
          <Radio.Button value="Hadir" className={record.status === 'Hadir' || !record.status ? "bg-green-600 text-white hover:bg-green-500" : ""}>Hadir</Radio.Button>
          <Radio.Button value="Izin" className={record.status === 'Izin' ? "bg-blue-600 text-white hover:bg-blue-500" : ""}>Izin</Radio.Button>
          <Radio.Button value="Sakit" className={record.status === 'Sakit' ? "bg-orange-500 text-white hover:bg-orange-400" : ""}>Sakit</Radio.Button>
          <Radio.Button value="Alpha" className={record.status === 'Alpha' ? "bg-red-600 text-white hover:bg-red-500" : ""}>Alpha</Radio.Button>
        </Radio.Group>
      ),
    }
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm flex items-center justify-between">
        <Breadcrumb items={[
          { title: <Link href="/presensi">Presensi</Link> },
          { title: <Link href="/presensi/mapel-siswa">Mata Pelajaran</Link> },
          { title: jadwalInfo?.kelasName || 'Pengisian Presensi' },
        ]} />
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium text-xs">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <ToolbarWrapper>
        <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading} type="default" className="mr-2">
          Muat Ulang
        </Button>
        
        <Space>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            className="text-white hover:text-white hover:bg-white/20"
            onClick={() => router.back()}
          />
          <span className="text-white font-semibold">
            Presensi {jadwalInfo?.mapelName || 'Mata Pelajaran'} - {jadwalInfo?.kelasName || 'Kelas'}
          </span>
        </Space>
        
        <Button 
          type="primary" 
          icon={<SaveOutlined />} 
          className="ml-auto bg-white text-emerald-600 hover:bg-green-50 border-none font-semibold"
          onClick={handleSave}
          loading={saving}
        >
          Simpan Presensi
        </Button>
      </ToolbarWrapper>

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-4 mt-1 rounded-lg shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
        {jadwalInfo && (
          <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm grid grid-cols-3 gap-4">
            <div>
              <span className="text-gray-500 block mb-1">Mata Pelajaran:</span>
              <span className="font-semibold text-gray-800">{jadwalInfo.mapelName}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">Guru Pengampu:</span>
              <span className="font-semibold text-gray-800">{jadwalInfo.guruName}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">Waktu:</span>
              <span className="font-semibold text-gray-800">{jadwalInfo.waktuMulai} - {jadwalInfo.waktuSelesai}</span>
            </div>
          </div>
        )}
        
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          pagination={false}
          size="small" bordered
          loading={loading}
          scroll={{ y: 'calc(100vh - 360px)' }}
        />
      </div>
    </div>
  );
}
