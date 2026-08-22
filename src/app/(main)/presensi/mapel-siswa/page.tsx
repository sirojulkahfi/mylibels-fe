"use client";

import React, { useState } from 'react';
import { Typography, Table, Button, Tag, Space, Breadcrumb } from 'antd';
import { 
  ArrowRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';

const { Title, Text } = Typography;

export default function PresensiMapelPage() {
  const router = useRouter();

  const data: any[] = []; // No dummy data, waiting for API integration

  const columns = [
    {
      title: 'Jam Pelajaran',
      dataIndex: 'jam',
      key: 'jam',
      width: 150,
      render: (text: string) => <span className="font-semibold text-gray-700">{text}</span>,
    },
    {
      title: 'Kelas',
      dataIndex: 'kelas',
      key: 'kelas',
      width: 100,
      render: (text: string) => <span className="font-bold text-gray-800">{text}</span>,
    },
    {
      title: 'Mata Pelajaran',
      dataIndex: 'mapel',
      key: 'mapel',
      width: 150,
    },
    {
      title: 'Total Siswa',
      dataIndex: 'totalSiswa',
      key: 'totalSiswa',
      width: 120,
      align: 'center' as const,
    },
    {
      title: 'Hadir',
      dataIndex: 'hadir',
      key: 'hadir',
      width: 100,
      align: 'center' as const,
      render: (val: number, record: any) => record.status === 'Selesai' ? <span className="text-emerald-600 font-semibold">{val}</span> : '-',
    },
    {
      title: 'Absen',
      dataIndex: 'absen',
      key: 'absen',
      width: 100,
      align: 'center' as const,
      render: (val: number, record: any) => record.status === 'Selesai' ? <span className="text-red-500 font-semibold">{val}</span> : '-',
    },
    {
      title: 'Status Presensi',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: string) => (
        <Tag 
          icon={status === 'Selesai' ? <CheckCircleOutlined /> : <ClockCircleOutlined />} 
          color={status === 'Selesai' ? 'success' : 'default'}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 150,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Button 
          type="primary"
          icon={<ArrowRightOutlined />} 
          className={record.status === 'Selesai' ? "bg-purple-50 text-purple-600 border-purple-200 shadow-none hover:bg-purple-100" : "bg-purple-600"}
          onClick={() => router.push(`/presensi/mapel-siswa/${record.id}`)}
          block
        >
          {record.status === 'Selesai' ? "Lihat Detail" : "Isi Presensi"}
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm flex items-center justify-between">
        <Breadcrumb items={[
          { title: <Link href="/presensi">Presensi</Link> },
          { title: 'Mata Pelajaran' },
        ]} />
        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium text-xs">
          Jadwal Hari Ini: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <ToolbarWrapper>
        <span className="text-white font-semibold">Pilih Jadwal Mengajar untuk Presensi</span>
      </ToolbarWrapper>

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-1 mt-1 rounded-lg shadow-sm border border-gray-100">
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          pagination={false}
          size="small" bordered
          scroll={{ y: 'calc(100vh - 270px)' }}
        />
      </div>
    </div>
  );
}
