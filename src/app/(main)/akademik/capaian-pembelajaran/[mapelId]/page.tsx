"use client";

import React, { useState } from 'react';
import { Card, Typography, Breadcrumb, Table, Space, Button, Input, Modal, Form } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';

const { Title } = Typography;
const { TextArea } = Input;

export default function DetailCapaianPembelajaranPage() {
  const router = useRouter();
  const params = useParams();
  const mapelId = params.mapelId as string;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [data, setData] = useState<any[]>([]);

  const columns = [
    {
      title: 'Judul CP/TP',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      render: (text: string) => <strong className="text-gray-800">{text}</strong>,
    },
    {
      title: 'Fase',
      dataIndex: 'phase',
      key: 'phase',
      width: 120,
    },
    {
      title: 'Deskripsi',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 100,
      align: 'center' as const,
      render: (text: string, record: any) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined className="text-blue-500" />} 
            onClick={() => handleEdit(record)}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
          />
        </Space>
      ),
    },
  ];

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingId(null);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: <Link href="/akademik/capaian-pembelajaran">Capaian Pembelajaran</Link> },
          { title: 'Detail CP/TP' },
        ]} />
      </div>

      <ToolbarWrapper>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={() => router.push('/akademik/capaian-pembelajaran')}
            />
            <Title level={4} className="m-0 text-gray-800">Capaian & Tujuan Pembelajaran</Title>
          </div>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
              form.resetFields();
              setEditingId(null);
              setIsModalOpen(true);
            }}>
              Tambah CP/TP
            </Button>
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
            locale={{ emptyText: 'Belum ada data CP/TP' }}
          />
        </div>
      </Card>

      <Modal
        title={editingId ? 'Edit CP/TP' : 'Tambah CP/TP Baru'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText="Simpan"
        cancelText="Batal"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Judul CP/TP" rules={[{ required: true }]}>
            <Input placeholder="Contoh: CP Elemen Al-Qur'an" />
          </Form.Item>
          <Form.Item name="phase" label="Fase" rules={[{ required: true }]}>
            <Input placeholder="Contoh: D (SMP)" />
          </Form.Item>
          <Form.Item name="description" label="Deskripsi" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Tuliskan deskripsi kompetensi..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
