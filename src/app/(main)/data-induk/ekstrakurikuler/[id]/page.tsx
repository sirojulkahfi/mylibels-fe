"use client";

import React, { useState } from 'react';
import { Card, Typography, Breadcrumb, Table, Space, Button, Input, Modal, Form } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';

const { Title } = Typography;

export default function DetailEkstrakurikulerPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<any[]>([]);

  const columns = [
    {
      title: 'Nama Anggota',
      dataIndex: 'nama',
      key: 'nama',
    },
    {
      title: 'Kelas',
      dataIndex: 'kelas',
      key: 'kelas',
      width: 150,
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 100,
      align: 'center' as const,
      render: () => (
        <Space size="middle">
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: <Link href="/data-induk/ekstrakurikuler">Data Ekstrakurikuler</Link> },
          { title: 'Detail Anggota' },
        ]} />
      </div>

      <ToolbarWrapper>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={() => router.push('/data-induk/ekstrakurikuler')}
            />
            <Title level={4} className="m-0 text-gray-800">Detail Ekstrakurikuler</Title>
          </div>
          <Space>
            <Button type="primary" icon={<PlusOutlined />}>Tambah Anggota</Button>
          </Space>
        </div>
      </ToolbarWrapper>

      <Card className="flex-1 overflow-hidden flex flex-col border border-gray-100 shadow-sm rounded-xl" styles={{ body: { padding: 0, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 } }}>
        <div className="flex-1 overflow-auto bg-white p-4">
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            bordered
            size="middle"
            locale={{ emptyText: 'Belum ada anggota' }}
          />
        </div>
      </Card>
    </div>
  );
}
