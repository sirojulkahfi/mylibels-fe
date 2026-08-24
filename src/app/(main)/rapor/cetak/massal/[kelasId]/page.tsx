"use client";

import React, { useState } from 'react';
import { Table, Input, Breadcrumb, Button, Tag, Progress, Switch, App } from 'antd';
import { SearchOutlined,
  PrinterOutlined,
  ArrowLeftOutlined,
  DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import { raporService } from '@/services/rapor/rapor.service';
import { kelasService } from '@/services/data-induk/kelas.service';

export default function CetakRaporMassalPage() {
  const router = useRouter();
  const params = useParams();
  const kelasId = params.kelasId as string;

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [kelasName, setKelasName] = useState<string>('...');
  const { message } = App.useApp();

  const fetchData = async () => {
      try {
        // Ambil nama kelas dari API
        const kelasList = await kelasService.findAll();
        const found = kelasList?.find((k: any) => k.id === kelasId);
        if (found) setKelasName(found.name);
        else setKelasName('Tidak Ditemukan');

        const res = await raporService.getSiswaCetakMassal(kelasId, "Ganjil", "2023/2024");
        setData(res || []);
      } catch (error) {
        message.error("Gagal mengambil data siswa untuk cetak massal");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, [kelasId]);

  const columns = [
    {
      title: 'No',
      key: 'index',
      width: 60,
      align: 'center' as const,
      render: (text: any, record: any, index: number) => index + 1,
    },
    {
      title: 'Nama Siswa',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (text: string, record: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{text}</span>
          <span className="text-xs text-gray-400">NISN: {record.nisn}</span>
        </div>
      ),
    },
    {
      title: 'Kelengkapan Nilai & Catatan',
      dataIndex: 'progress',
      key: 'progress',
      width: 200,
      render: (percent: number) => (
        <Progress 
          percent={percent} 
          size="small" 
          strokeColor={percent === 100 ? '#52c41a' : '#faad14'}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      align: 'center' as const,
      render: (status: string) => {
        let color = 'success';
        if (status === 'Belum Lengkap') color = 'warning';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Pilih Cetak',
      key: 'select',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Switch defaultChecked={record.status === 'Siap Cetak'} disabled={record.status !== 'Siap Cetak'} />
      )
    },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: <Link href="/rapor">Manajemen Rapor</Link> },
          { title: 'Cetak Massal' },
        ]} />
      </div>

      <ToolbarWrapper>
        <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading} type="default" className="mr-2">
          Muat Ulang
        </Button>
        
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.push('/rapor')}
          className="border-0 flex items-center shadow-none hover:opacity-80 px-3 ml-2 mr-4"
          style={{ color: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          Kembali
        </Button>
        <div className="flex flex-col mr-4 hidden md:flex">
          <span className="text-white font-bold leading-tight">Cetak Rapor Massal</span>
          <span className="text-gray-200 text-xs">Kelas {kelasName}</span>
        </div>
        <Input 
          placeholder="Cari siswa..." 
          prefix={<SearchOutlined />} 
          className="w-48"
        />
        
        <div className="ml-auto flex gap-2">
          <Button 
            icon={<DownloadOutlined />} 
            className="bg-white/20 text-white border-0 hover:bg-white/30"
          >
            PDF (ZIP)
          </Button>
          <Button 
            icon={<PrinterOutlined />} 
            type="primary"
            className="bg-emerald-500 border-0 hover:bg-emerald-400"
          >
            Cetak Terpilih
          </Button>
        </div>
      </ToolbarWrapper>

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-1 mt-1 rounded-lg shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0">
        <div className="mb-4 mt-2 bg-yellow-50 border border-yellow-100 p-3 rounded-lg text-sm text-yellow-800">
          <strong>Perhatian:</strong> Siswa dengan status &quot;Belum Lengkap&quot; tidak dapat dicetak rapornya. Pastikan semua nilai dan catatan wali kelas telah diisi.
        </div>
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          pagination={false}
          size="small" bordered
          scroll={{ y: 'calc(100vh - 320px)' }}
        />
      </div>
    </div>
  );
}
