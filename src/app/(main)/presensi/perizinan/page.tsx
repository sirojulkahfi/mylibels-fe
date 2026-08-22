"use client";

import React, { useState } from 'react';
import { Typography, Table, Button, Tag, Space, Breadcrumb, DatePicker, Select } from 'antd';
import { 
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dayjs from 'dayjs';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';

const { Title, Text } = Typography;

export default function PerizinanPage() {
  const router = useRouter();

  const data: any[] = []; // No dummy data, waiting for API integration

  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'date',
      key: 'date',
      width: 120,
    },
    {
      title: 'Nama Siswa',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{text}</span>
          <span className="text-xs text-gray-400">Kelas: {record.kelas}</span>
        </div>
      ),
    },
    {
      title: 'Jenis',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (text: string) => (
        <Tag color={text === 'Sakit' ? 'processing' : 'warning'}>{text}</Tag>
      )
    },
    {
      title: 'Keterangan',
      dataIndex: 'reason',
      key: 'reason',
      width: 250,
    },
    {
      title: 'Lampiran',
      dataIndex: 'file',
      key: 'file',
      width: 150,
      render: (text: string) => text ? (
        <Button type="link" size="small" icon={<FileTextOutlined />} className="px-0">
          Lihat File
        </Button>
      ) : <span className="text-gray-400">-</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        let color = 'default';
        let icon = <ClockCircleOutlined />;
        
        if (status === 'Disetujui') {
          color = 'success';
          icon = <CheckCircleOutlined />;
        } else if (status === 'Ditolak') {
          color = 'error';
          icon = <CloseCircleOutlined />;
        } else if (status === 'Pending') {
          color = 'processing';
        }
        
        return <Tag icon={icon} color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Aksi (Wali Kelas)',
      key: 'action',
      width: 180,
      align: 'center' as const,
      render: (_: any, record: any) => record.status === 'Pending' ? (
        <Space size="small">
          <Button size="small" type="primary" className="bg-emerald-500 border-emerald-500">Terima</Button>
          <Button size="small" danger>Tolak</Button>
        </Space>
      ) : <span className="text-gray-300">-</span>,
    },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: <Link href="/presensi">Presensi</Link> },
          { title: 'Perizinan & Sakit' },
        ]} />
      </div>

      <ToolbarWrapper>
        <DatePicker defaultValue={dayjs()} className="w-40" format="DD/MM/YYYY" />
        <Select defaultValue="all" className="w-32 ml-2" options={[
          { value: 'all', label: 'Semua Status' },
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Disetujui' },
        ]} />
        <ButtonToolbar 
          message="Ajukan Izin Baru" 
          icon={<PlusOutlined />} 
          className="ml-auto bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => router.push('/presensi/perizinan/pengajuan')}
        />
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
