"use client";

import React, { useState } from 'react';
import { Typography, Table, Tag, Button, Input, Space, Row, Col } from 'antd';
import { 
  SearchOutlined, 
  EditOutlined, 
  TrophyOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';

const { Title, Text } = Typography;

export default function PenilaianEkstrakurikulerPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  // Mock data for ekstrakurikuler list
  const mockEkskul = [
    {
      id: 'e1',
      name: 'Pramuka',
      day: 'Jumat',
      membersCount: 120,
      status: 'pending',
      lastUpdated: '-',
    },
    {
      id: 'e2',
      name: 'Paskibra',
      day: 'Sabtu',
      membersCount: 45,
      status: 'completed',
      lastUpdated: '12 Des 2026',
    },
  ];

  const columns = [
    {
      title: 'Nama Ekstrakurikuler',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="font-semibold text-gray-800">{text}</span>,
    },
    {
      title: 'Jadwal',
      dataIndex: 'day',
      key: 'day',
      render: (text: string) => <Tag color="orange">{text}</Tag>,
    },
    {
      title: 'Jml Anggota',
      dataIndex: 'membersCount',
      key: 'membersCount',
      render: (count: number) => <span>{count} Siswa</span>,
    },
    {
      title: 'Status Penilaian',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        status === 'completed' 
          ? <Tag icon={<CheckCircleOutlined />} color="success">Selesai</Tag>
          : <Tag icon={<ClockCircleOutlined />} color="warning">Belum Selesai</Tag>
      ),
    },
    {
      title: 'Terakhir Diubah',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      render: (text: string) => <span className="text-gray-500 text-sm">{text}</span>,
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: any) => (
        <Button 
          type="primary" 
          size="small" 
          icon={<EditOutlined />} 
          className="bg-orange-500 border-none shadow-sm text-xs h-7 px-3 hover:bg-orange-400"
          onClick={() => router.push(`/penilaian/ekstrakurikuler/${record.id}`)}
        >
          Input Predikat
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">Penilaian / Ekstrakurikuler</div>

      <ToolbarWrapper>
        <Input 
          placeholder="Cari ekstrakurikuler..." 
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-64"
        />
      </ToolbarWrapper>

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-1 mt-1 rounded-lg shadow-sm border border-gray-100">
        <Table 
          columns={columns} 
          dataSource={mockEkskul} 
          rowKey="id"
          pagination={false}
          size="small" bordered
          scroll={{ x: 'max-content', y: 'calc(100vh - 270px)' }}
        />
      </div>
    </div>
  );
}
