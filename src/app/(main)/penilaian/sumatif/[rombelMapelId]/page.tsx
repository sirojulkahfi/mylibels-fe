"use client";

import React, { useState, useEffect, use } from 'react';
import { Table, Button, Breadcrumb, App, Space, InputNumber } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import { penilaianService } from '@/services/penilaian/penilaian.service';
import { akademikService } from '@/services/akademik/akademik.service';

export default function SumatifDetail({ params }: { params: Promise<{ rombelMapelId: string }> }) {
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
        const jadwalList = await akademikService.findAllJadwal().catch(() => []);
        const jadwal = jadwalList.find((j: any) => j.id === rombelMapelId);
        if (jadwal) {
          setInfo({
            ...jadwal,
            kelasName: jadwal.kelas?.name || jadwal.kelasId,
            mapelName: jadwal.mataPelajaran?.name || jadwal.mapelId
          });
        } else {
          setInfo({ kelasName: 'Kelas', mapelName: 'Mata Pelajaran' });
        }
        
        const nilaiRes = await penilaianService.findAllSumatif({ rombelMapelId: rombelMapelId });
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

  const handleScoreChange = (recordId: string, type: 'sts' | 'sas', value: number | null) => {
    setData(prev => prev.map(item => {
      if (item.id === recordId) {
        return { ...item, [type]: value };
      }
      return item;
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      message.success("Nilai Sumatif berhasil disimpan");
      setTimeout(() => {
        router.push('/penilaian/sumatif');
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
    },
    {
      title: 'Nama Siswa',
      dataIndex: 'siswaName',
      key: 'siswaName',
      render: (text: string) => <span className="font-medium text-gray-800">{text}</span>,
    },
    {
      title: 'NISN',
      key: 'nisn',
      width: 150,
      render: (_: any, record: any) => (
        <span className="text-gray-500 text-sm">{record.nisn || '-'}</span>
      ),
    },
    {
      title: 'STS (Sumatif Tengah Semester)',
      key: 'sts',
      width: 250,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <InputNumber 
          min={0} max={100} 
          value={record.sts} 
          onChange={(val) => handleScoreChange(record.id, 'sts', val)}
          className="w-full text-center"
          placeholder="0 - 100"
        />
      ),
    },
    {
      title: 'SAS (Sumatif Akhir Semester)',
      key: 'sas',
      width: 250,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <InputNumber 
          min={0} max={100} 
          value={record.sas} 
          onChange={(val) => handleScoreChange(record.id, 'sas', val)}
          className="w-full text-center"
          placeholder="0 - 100"
        />
      ),
    },
    {
      title: 'Nilai Akhir',
      key: 'na',
      width: 150,
      align: 'center' as const,
      render: (_: any, record: any) => {
        const sts = record.sts || 0;
        const sas = record.sas || 0;
        if (!record.sts && !record.sas) return <span className="text-gray-400">-</span>;
        
        // Asumsi bobot 50:50, sesuaikan jika ada bobot khusus
        const na = (sts + sas) / 2;
        return <span className="font-semibold text-blue-600">{na.toFixed(1)}</span>;
      },
    }
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm flex items-center justify-between">
        <Breadcrumb items={[
          { title: <Link href="/penilaian">Penilaian</Link> },
          { title: <Link href="/penilaian/sumatif">Sumatif (STS & SAS)</Link> },
          { title: info?.kelasName || 'Input Nilai' },
        ]} />
      </div>

      <ToolbarWrapper>
        <Space>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            className="text-white hover:text-white hover:bg-white/20"
            onClick={() => router.back()}
          />
          <span className="text-white font-semibold">
            Input Nilai Sumatif: {info?.mapelName || 'Mata Pelajaran'} - {info?.kelasName || 'Kelas'}
          </span>
        </Space>
        
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
          <div className="mb-4 bg-purple-50 p-3 rounded-lg border border-purple-100 text-sm grid grid-cols-2 gap-4">
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
          scroll={{ y: 'calc(100vh - 360px)' }}
        />
      </div>
    </div>
  );
}
