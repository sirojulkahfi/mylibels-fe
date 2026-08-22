"use client";

import React, { useState, useEffect, use } from 'react';
import { Table, Button, Breadcrumb, App, Radio, Space } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { siswaService } from '@/services/data-induk/siswa.service';
import { kelasService } from '@/services/data-induk/kelas.service';

export default function InputPresensiHarianPage({ params }: { params: Promise<{ kelasId: string }> }) {
  const router = useRouter();
  const { message } = App.useApp();
  const unwrappedParams = use(params);
  const kelasId = unwrappedParams.kelasId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [kelasName, setKelasName] = useState<string>('...');
  
  // Tanggal Hari Ini
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Ambil nama kelas
        const kel = await kelasService.findAll();
        const foundKelas = kel?.find((k: any) => k.id === kelasId);
        if (foundKelas) setKelasName(foundKelas.name);
        else setKelasName('Tidak Ditemukan');

        // Ambil data siswa
        const siswa = await siswaService.findAll();
        const siswaKelas = (siswa || []).filter((s: any) => s.kelasId === kelasId);
        
        // Setup initial status to 'H' (Hadir)
        const presensiData = siswaKelas.map((s: any) => ({
          ...s,
          status: 'H',
          keterangan: ''
        }));
        
        setData(presensiData);
      } catch (error) {
        message.error("Gagal memuat data presensi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [kelasId, message]);

  const handleStatusChange = (id: string, val: string) => {
    setData(prev => prev.map(item => item.id === id ? { ...item, status: val } : item));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      message.success('Presensi berhasil disimpan!');
      router.push('/presensi/harian-siswa');
    }, 800);
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
      title: 'NIS / NISN',
      key: 'nis',
      width: 150,
      render: (text: any, record: any) => <span className="text-gray-500">{record.nis || '-'} / {record.nisn || '-'}</span>,
    },
    {
      title: 'Nama Siswa',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="font-semibold text-gray-800">{text}</span>,
    },
    {
      title: 'Status Kehadiran',
      dataIndex: 'status',
      key: 'status',
      width: 350,
      align: 'center' as const,
      render: (status: string, record: any) => (
        <Radio.Group 
          value={status} 
          onChange={(e) => handleStatusChange(record.id, e.target.value)}
          buttonStyle="solid"
          className="flex justify-center"
        >
          <Radio.Button value="H" className="w-16 text-center data-[state=checked]:bg-emerald-500">Hadir</Radio.Button>
          <Radio.Button value="S" className="w-16 text-center">Sakit</Radio.Button>
          <Radio.Button value="I" className="w-16 text-center">Izin</Radio.Button>
          <Radio.Button value="A" className="w-16 text-center">Alpa</Radio.Button>
        </Radio.Group>
      ),
    }
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm flex items-center justify-between">
        <Breadcrumb items={[
          { title: <Link href="/presensi">Presensi</Link> },
          { title: <Link href="/presensi/harian-siswa">Harian Siswa</Link> },
          { title: `Input Kelas ${kelasName}` },
        ]} />
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium text-xs">
          Hari Ini: {today}
        </span>
      </div>

      <ToolbarWrapper>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.push('/presensi/harian-siswa')}
          className="border-0 flex items-center shadow-none hover:opacity-80 px-3 mr-4"
          style={{ color: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          Kembali
        </Button>
        <span className="text-white font-semibold">
          Input Presensi Kelas {kelasName}
        </span>

        <ButtonToolbar 
          message="Simpan Presensi" 
          icon={<SaveOutlined />} 
          className="ml-auto bg-emerald-500 text-white hover:bg-emerald-600 border-none"
          onClick={handleSave}
          loading={saving}
        />
      </ToolbarWrapper>

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-4 mt-1 rounded-lg shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
        <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm flex gap-4">
          <div className="flex flex-col">
            <span className="text-gray-500">Kelas</span>
            <span className="font-semibold text-gray-800">{kelasName}</span>
          </div>
          <div className="w-px bg-blue-200"></div>
          <div className="flex flex-col">
            <span className="text-gray-500">Total Siswa</span>
            <span className="font-semibold text-gray-800">{data.length} Orang</span>
          </div>
        </div>

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
