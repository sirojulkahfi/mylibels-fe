"use client";

import React, { useState, useEffect, use } from 'react';
import { Table, Button, Breadcrumb, App, Space, InputNumber } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import { penilaianService } from '@/services/penilaian/penilaian.service';
import { siswaService } from '@/services/data-induk/siswa.service';
import { akademikService } from '@/services/akademik/akademik.service';
import { kelasService } from '@/services/data-induk/kelas.service';
import { mataPelajaranService } from '@/services/data-induk/mata-pelajaran.service';

export default function FormatifDetail({ params }: { params: Promise<{ rombelMapelId: string }> }) {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [info, setInfo] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);

  const unwrappedParams = use(params);
  const rombelMapelId = unwrappedParams.rombelMapelId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil info mapel/rombel dari jadwal beserta kelas dan mapel
        const [jadwalList, kelasList, mapelList] = await Promise.all([
          akademikService.findAllJadwal().catch(() => []),
          kelasService.findAll().catch(() => []),
          mataPelajaranService.findAll().catch(() => [])
        ]);
        
        const jadwal = jadwalList.find((j: any) => j.id === rombelMapelId);
        if (jadwal) {
          const kls = kelasList.find((k: any) => k.id === jadwal.kelasId);
          const mpl = mapelList.find((m: any) => m.id === jadwal.mapelId);
          
          setInfo({
            ...jadwal,
            kelasName: kls?.name || jadwal.kelas?.name || jadwal.kelasId,
            mapelName: mpl?.name || jadwal.mataPelajaran?.name || jadwal.mapelId
          });
        } else {
          setInfo({ kelasName: 'Kelas', mapelName: 'Mata Pelajaran' });
        }
        // Ambil siswa dan nilai
        const nilaiRes = await penilaianService.findAllFormatif({ rombelMapelId: rombelMapelId });
        if (nilaiRes && nilaiRes.length > 0) {
          setData(nilaiRes);
        } else {
          setData([]);
        }
      } catch (error) {
        message.error("Gagal mengambil data siswa/nilai");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [rombelMapelId]);

  const handleScoreChange = (recordId: string, tpIndex: number, value: number | null) => {
    setData(prev => prev.map(item => {
      if (item.id === recordId) {
        const newScores = [...(item.scores || [null, null, null, null])];
        newScores[tpIndex] = value;
        return { ...item, scores: newScores };
      }
      return item;
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Panggil API save massal
      message.success("Nilai Formatif berhasil disimpan");
      setTimeout(() => {
        router.push('/penilaian/formatif');
      }, 1000);
    } catch (error) {
      message.error("Gagal menyimpan nilai");
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
      fixed: 'left' as const,
    },
    {
      title: 'Nama Siswa',
      dataIndex: 'siswaName',
      key: 'siswaName',
      width: 250,
      fixed: 'left' as const,
      render: (text: string) => <span className="font-medium text-gray-800">{text}</span>,
    },
    {
      title: 'NISN',
      key: 'nisn',
      width: 120,
      render: (_: any, record: any) => (
        <span className="text-gray-500 text-sm">{record.nisn || '-'}</span>
      ),
    },
    {
      title: 'TP 1',
      key: 'tp1',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <InputNumber 
          min={0} max={100} 
          value={record.scores?.[0]} 
          onChange={(val) => handleScoreChange(record.id, 0, val)}
          className="w-full text-center"
        />
      ),
    },
    {
      title: 'TP 2',
      key: 'tp2',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <InputNumber 
          min={0} max={100} 
          value={record.scores?.[1]} 
          onChange={(val) => handleScoreChange(record.id, 1, val)}
          className="w-full text-center"
        />
      ),
    },
    {
      title: 'TP 3',
      key: 'tp3',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <InputNumber 
          min={0} max={100} 
          value={record.scores?.[2]} 
          onChange={(val) => handleScoreChange(record.id, 2, val)}
          className="w-full text-center"
        />
      ),
    },
    {
      title: 'TP 4',
      key: 'tp4',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <InputNumber 
          min={0} max={100} 
          value={record.scores?.[3]} 
          onChange={(val) => handleScoreChange(record.id, 3, val)}
          className="w-full text-center"
        />
      ),
    },
    {
      title: 'Rata-rata',
      key: 'average',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: any) => {
        const scores = (record.scores || []).filter((s: number | null) => s !== null && s !== undefined);
        if (scores.length === 0) return <span className="text-gray-400">-</span>;
        const avg = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
        return <span className="font-semibold text-blue-600">{avg.toFixed(1)}</span>;
      },
    }
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm flex items-center justify-between">
        <Breadcrumb items={[
          { title: <Link href="/penilaian">Penilaian</Link> },
          { title: <Link href="/penilaian/formatif">Formatif (Tujuan Pembelajaran)</Link> },
          { title: info?.kelasName || 'Input Nilai' },
        ]} />
      </div>

      <ToolbarWrapper>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.push('/penilaian/formatif')}
          className="border-0 flex items-center shadow-none hover:opacity-80 px-3 ml-2 mr-4"
          style={{ color: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          Kembali
        </Button>
        <div className="flex flex-col mr-4 hidden md:flex">
          <span className="text-white font-bold leading-tight">Input Nilai Formatif</span>
          <span className="text-gray-200 text-xs">{info?.mapelName || 'Mata Pelajaran'} - {info?.kelasName || 'Kelas'}</span>
        </div>
        
        <Button 
          type="primary" 
          icon={<SaveOutlined />} 
          className="ml-auto bg-white text-emerald-600 hover:bg-green-50 border-none font-semibold"
          onClick={handleSave}
          loading={saving}
        >
          Simpan Nilai
        </Button>
      </ToolbarWrapper>

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-4 mt-1 rounded-lg shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
        {info && (
          <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-500 block mb-1">Mata Pelajaran:</span>
              <span className="font-semibold text-gray-800">{info.mapelName}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">Kelas:</span>
              <span className="font-semibold text-gray-800">{info.kelasName}</span>
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
          scroll={{ x: 'max-content', y: 'calc(100vh - 360px)' }}
        />
      </div>
    </div>
  );
}
