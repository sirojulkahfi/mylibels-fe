"use client";

import React, { useState, useEffect, use } from 'react';
import { Table, Button, Breadcrumb, App, Radio, Space } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { siswaService } from '@/services/data-induk/siswa.service';
import { kelasService } from '@/services/data-induk/kelas.service';
import { presensiService } from '@/services/presensi/presensi.service';

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
        const siswaKelas = (siswa || []).filter((s: any) => s.class === foundKelas?.name);
        const todayIso = new Date().toISOString().slice(0, 10);
        const existingPresensi = await presensiService.findAllSiswa({ kelasId, tanggal: todayIso });
        const statusToCode: Record<string, string> = { Hadir: 'H', Sakit: 'S', Izin: 'I', Alpha: 'A' };
        
        const presensiData = siswaKelas.map((s: any) => {
          const presensi = existingPresensi?.find((item: any) => item.siswaId === s.id);
          return {
            ...s,
            presensiId: presensi?.id,
            status: statusToCode[presensi?.status] || 'H',
            jamMasuk: presensi?.jamMasuk,
            jamKeluar: presensi?.jamKeluar,
            keterangan: presensi?.keterangan || ''
          };
        });
        
        setData(presensiData);
      } catch (error) {
        message.error("Gagal memuat data presensi");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, [kelasId, message]);

  const handleStatusChange = (id: string, val: string) => {
    setData(prev => prev.map(item => item.id === id ? { ...item, status: val } : item));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const statusToValue: Record<string, string> = { H: 'Hadir', S: 'Sakit', I: 'Izin', A: 'Alpha' };
      const tanggal = new Date();
      await Promise.all(data.map((item: any) => {
        const payload = {
          siswaId: item.id,
          kelasId,
          tanggal: tanggal.toISOString(),
          status: statusToValue[item.status] || 'Hadir',
          keterangan: item.keterangan || null,
          jenis: 'Harian',
        };
        return item.presensiId
          ? presensiService.updateSiswa(item.presensiId, payload)
          : presensiService.createSiswa(payload);
      }));
      setSaving(false);
      message.success('Presensi berhasil disimpan!');
      router.push('/presensi/harian-siswa');
    } catch (error) {
      console.error(error);
      message.error('Gagal menyimpan presensi ke database');
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
      title: 'Waktu Absen',
      key: 'waktu',
      width: 150,
      align: 'center' as const,
      render: (text: any, record: any) => (
        <div className="flex flex-col text-xs items-center justify-center">
          <span className="text-emerald-600 font-medium">In: {record.jamMasuk || '-'}</span>
          <span className="text-red-500 font-medium">Out: {record.jamKeluar || '-'}</span>
          {record.jamKeluar && (
            <span className="mt-1 bg-blue-100 text-blue-700 border border-blue-200 text-[10px] px-2 py-0.5 rounded-full font-bold">
              KELUAR / PULANG
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Status Kehadiran',
      dataIndex: 'status',
      key: 'status',
      width: 380,
      align: 'center' as const,
      render: (status: string, record: any) => (
        <Radio.Group 
          value={status} 
          onChange={(e) => handleStatusChange(record.id, e.target.value)}
          buttonStyle="solid"
          className="inline-flex justify-center whitespace-nowrap"
        >
          <Radio.Button value="H" className="w-20 text-center">Hadir</Radio.Button>
          <Radio.Button value="S" className="w-20 text-center">Sakit</Radio.Button>
          <Radio.Button value="I" className="w-20 text-center">Izin</Radio.Button>
          <Radio.Button value="A" className="w-20 text-center">Alpa</Radio.Button>
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
        <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading} type="default" className="mr-2">
          Muat Ulang
        </Button>
        
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
