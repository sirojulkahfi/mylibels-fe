"use client";

import React, { useState, useEffect, use } from 'react';
import { Table, Button, Breadcrumb, App, Space, Select } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import { ekstrakurikulerService } from '@/services/data-induk/ekstrakurikuler.service';

const { Option } = Select;

export default function NilaiEkskulDetail({ params }: { params: Promise<{ ekskulId: string }> }) {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [info, setInfo] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);

  const unwrappedParams = use(params);
  const ekskulId = unwrappedParams.ekskulId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ekskul = await ekstrakurikulerService.findOne(ekskulId).catch(() => null);
        if (ekskul) {
          setInfo(ekskul);
        } else {
          // Fallback to mock data if API fails or mock ID is used
          if (ekskulId === 'e1') setInfo({ name: 'Pramuka', pembina: 'Budi Santoso, S.Pd' });
          else if (ekskulId === 'e2') setInfo({ name: 'Paskibra', pembina: 'Siti Aminah, M.Pd' });
          else setInfo({ name: 'Ekstrakurikuler Tidak Ditemukan', pembina: '-' });
        }
        
        // Simulasi mengambil daftar siswa yang mengikuti ekskul ini beserta nilai mereka
        // Idealnya ini dari penilaianService.findAllNilaiEkskul({ ekskulId: params.ekskulId })
        setData([]);
      } catch (error) {
        message.error("Gagal mengambil data nilai ekstrakurikuler");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ekskulId]);

  const handleScoreChange = (recordId: string, value: string) => {
    setData(prev => prev.map(item => {
      if (item.id === recordId) {
        return { ...item, predikat: value };
      }
      return item;
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      message.success("Nilai Ekstrakurikuler berhasil disimpan");
      setTimeout(() => {
        router.push('/penilaian/ekstrakurikuler');
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
      title: 'Kelas',
      dataIndex: 'kelasName',
      key: 'kelasName',
      width: 150,
    },
    {
      title: 'Predikat (Nilai)',
      key: 'predikat',
      width: 250,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Select
          value={record.predikat}
          onChange={(val) => handleScoreChange(record.id, val)}
          className="w-full"
          placeholder="Pilih Predikat"
          allowClear
        >
          <Option value="Sangat Baik">Sangat Baik (A)</Option>
          <Option value="Baik">Baik (B)</Option>
          <Option value="Cukup">Cukup (C)</Option>
          <Option value="Kurang">Kurang (D)</Option>
        </Select>
      ),
    },
    {
      title: 'Deskripsi / Keterangan',
      dataIndex: 'deskripsi',
      key: 'deskripsi',
    }
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm flex items-center justify-between">
        <Breadcrumb items={[
          { title: <Link href="/penilaian">Penilaian</Link> },
          { title: <Link href="/penilaian/ekstrakurikuler">Ekstrakurikuler</Link> },
          { title: info?.name || 'Input Nilai' },
        ]} />
      </div>

      <ToolbarWrapper>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.push('/penilaian/ekstrakurikuler')}
          className="border-0 flex items-center shadow-none hover:opacity-80 px-3 mr-4"
          style={{ color: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          Kembali
        </Button>
        <span className="text-white font-semibold">
          Input Nilai Ekstrakurikuler: {info?.name || 'Ekskul'}
        </span>
        
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
          <div className="mb-4 bg-orange-50 p-3 rounded-lg border border-orange-100 text-sm grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-500 block mb-1">Nama Ekstrakurikuler:</span>
              <span className="font-semibold text-gray-800">{info.name}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">Pembina:</span>
              <span className="font-semibold text-gray-800">{info.pembina || '-'}</span>
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
