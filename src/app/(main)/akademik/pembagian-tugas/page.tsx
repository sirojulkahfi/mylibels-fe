"use client";

import React, { useState } from 'react';
import { Card, Typography, Breadcrumb, Table, Space, Button, Input, Modal, Form, Select, InputNumber } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';

const { Title } = Typography;

export default function PembagianTugasPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAddSubmit = (values: any) => {
    // For now we just add it to the state (mock)
    const newData = {
      id: Math.random().toString(),
      namaGuru: values.guru,
      mapel: values.mapel,
      kelas: values.kelas,
      jam: values.jam,
      keterangan: values.keterangan || '-',
    };
    setData([...data, newData]);
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Nama Guru',
      dataIndex: 'namaGuru',
      key: 'namaGuru',
      width: 250,
    },
    {
      title: 'Mata Pelajaran',
      dataIndex: 'mapel',
      key: 'mapel',
      width: 200,
    },
    {
      title: 'Kelas',
      dataIndex: 'kelas',
      key: 'kelas',
      width: 150,
    },
    {
      title: 'Jumlah Jam',
      dataIndex: 'jam',
      key: 'jam',
      width: 120,
      align: 'center' as const,
    },
    {
      title: 'Keterangan',
      dataIndex: 'keterangan',
      key: 'keterangan',
    },
    {
      title: 'Aksi',
      key: 'aksi',
      width: 120,
      align: 'center' as const,
      render: () => (
        <Space size="middle">
          <Button type="link" className="text-blue-500 p-0">Edit</Button>
          <Button type="link" className="text-red-500 p-0">Hapus</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: <Link href="/akademik/jadwal-pelajaran">Akademik</Link> },
          { title: 'Pembagian Tugas' },
        ]} />
      </div>

      <ToolbarWrapper>
        <div className="flex justify-between items-center w-full">
          <div>
            <span className="text-white font-bold text-lg">Pembagian Tugas Mengajar</span>
          </div>
          <Space>
            <Input 
              placeholder="Cari guru atau mapel..." 
              prefix={<SearchOutlined />} 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-64"
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>Tambah Tugas</Button>
          </Space>
        </div>
      </ToolbarWrapper>

      <Card className="flex-1 overflow-hidden flex flex-col border border-gray-100 shadow-sm rounded-xl" styles={{ body: { padding: 0, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 } }}>
        <div className="flex-1 overflow-auto bg-white p-4">
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            bordered
            size="middle"
            locale={{ emptyText: 'Belum ada pembagian tugas mengajar' }}
          />
        </div>
      </Card>

      <Modal
        title="Tambah Pembagian Tugas"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Simpan"
        cancelText="Batal"
      >
        <Form form={form} layout="vertical" onFinish={handleAddSubmit}>
          <Form.Item label="Guru" name="guru" rules={[{ required: true, message: 'Harap isi nama guru' }]}>
            <Input placeholder="Nama Guru" />
          </Form.Item>
          <Form.Item label="Mata Pelajaran" name="mapel" rules={[{ required: true, message: 'Harap isi mata pelajaran' }]}>
            <Input placeholder="Mata Pelajaran" />
          </Form.Item>
          <Form.Item label="Kelas" name="kelas" rules={[{ required: true, message: 'Harap isi kelas' }]}>
            <Input placeholder="Kelas (Contoh: VII-A)" />
          </Form.Item>
          <Form.Item label="Jumlah Jam" name="jam" rules={[{ required: true, message: 'Harap isi jumlah jam' }]}>
            <InputNumber min={1} max={10} className="w-full" placeholder="Jumlah Jam Mengajar" />
          </Form.Item>
          <Form.Item label="Keterangan" name="keterangan">
            <Input.TextArea rows={2} placeholder="Keterangan Tambahan (Opsional)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
