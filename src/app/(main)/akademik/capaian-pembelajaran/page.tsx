"use client";

import React, { useState } from 'react';
import { Table, Input, Select, Breadcrumb, Button, Tag } from 'antd';
import { 
  SearchOutlined,
  EditOutlined,
  BookOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';

export default function AkademikCapaianPembelajaranPage() {
  const router = useRouter();

  // Mock data for mapel
  const [data, setData] = useState<any[]>([]);

  const columns = [
    {
      title: 'No',
      key: 'index',
      width: 60,
      align: 'center' as const,
      render: (text: any, record: any, index: number) => index + 1,
    },
    {
      title: 'Mata Pelajaran',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      render: (text: string, record: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{text}</span>
          <span className="text-xs text-gray-400">Kode: {record.code} | Fase {record.phase}</span>
        </div>
      ),
    },
    {
      title: 'Jumlah CP / KD',
      dataIndex: 'totalCp',
      key: 'totalCp',
      width: 120,
      align: 'center' as const,
      render: (val: number) => <span className="font-bold text-blue-600">{val}</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      align: 'center' as const,
      render: (status: string) => {
        let color = 'success';
        if (status === 'Perlu Update') color = 'warning';
        if (status === 'Kosong') color = 'error';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 150,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Button 
          type="primary" 
          icon={<EditOutlined />} 
          className="bg-emerald-500 shadow-none hover:bg-emerald-400"
          onClick={() => router.push(`/akademik/capaian-pembelajaran/${record.id}`)}
          size="small"
        >
          Kelola CP
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: 'Akademik' },
          { title: 'Capaian Pembelajaran' },
        ]} />
      </div>

      <ToolbarWrapper>
        <span className="text-white font-semibold mr-4">Daftar Mata Pelajaran</span>
        <Input 
          placeholder="Cari mata pelajaran..." 
          prefix={<SearchOutlined />} 
          className="w-64"
        />
        <Select 
          defaultValue="faseD" 
          className="ml-2 w-48"
          options={[
            { value: 'all', label: 'Semua Fase' },
            { value: 'faseD', label: 'Fase D (SMP)' },
          ]} 
        />
      </ToolbarWrapper>

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-1 mt-1 rounded-lg shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0">
        <div className="mb-4 mt-2 bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm text-blue-800 flex items-start gap-2">
          <BookOutlined className="mt-1" />
          <div>
            <strong>Capaian Pembelajaran (Kurikulum Merdeka)</strong><br />
            Silakan pilih mata pelajaran untuk mengelola deskripsi Capaian Pembelajaran (CP) dan Tujuan Pembelajaran (TP) yang akan tampil di dalam rapor.
          </div>
        </div>
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          pagination={{
            total: data.length,
            pageSize: 10,
            showSizeChanger: true,
          }}
          size="small" bordered
          scroll={{ y: 'calc(100vh - 350px)' }}
        />
      </div>
    </div>
  );
}
