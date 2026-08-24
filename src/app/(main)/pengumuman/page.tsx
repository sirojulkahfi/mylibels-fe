"use client";

import React, { useState } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, message, Tag, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pengumumanService, PengumumanData } from '@/services/pengumuman.service';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');
const { TextArea } = Input;

export default function PengumumanPage() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: pengumumanList, isLoading } = useQuery({
    queryKey: ['pengumuman'],
    queryFn: () => pengumumanService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: PengumumanData) => pengumumanService.create(data),
    onSuccess: () => {
      message.success('Pengumuman berhasil ditambahkan');
      queryClient.invalidateQueries({ queryKey: ['pengumuman'] });
      closeModal();
    },
    onError: () => message.error('Gagal menambahkan pengumuman'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PengumumanData> }) => pengumumanService.update(id, data),
    onSuccess: () => {
      message.success('Pengumuman berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: ['pengumuman'] });
      closeModal();
    },
    onError: () => message.error('Gagal memperbarui pengumuman'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => pengumumanService.delete(id),
    onSuccess: () => {
      message.success('Pengumuman berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['pengumuman'] });
    },
    onError: () => message.error('Gagal menghapus pengumuman'),
  });

  const openModal = (record?: PengumumanData) => {
    if (record) {
      setEditingId(record.id || null);
      form.setFieldsValue({
        title: record.title,
        content: record.content,
        category: record.category,
      });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingId(null);
  };

  const handleSubmit = (values: any) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'INFO AKADEMIK': return 'blue';
      case 'KEGIATAN': return 'green';
      case 'UMUM': return 'default';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
      width: 150,
      render: (text: string) => <Tag color={getCategoryColor(text)}>{text}</Tag>,
    },
    {
      title: 'Judul',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <span className="font-semibold">{text}</span>,
    },
    {
      title: 'Tanggal Posting',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      render: (text: string) => dayjs(text).format('DD MMM YYYY, HH:mm'),
    },
    {
      title: 'Penulis',
      key: 'author',
      width: 150,
      render: (_: any, record: any) => record.author?.name || 'Admin',
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: PengumumanData) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => openModal(record)} className="text-blue-600" />
          <Popconfirm
            title="Hapus pengumuman ini?"
            onConfirm={() => record.id && deleteMutation.mutate(record.id)}
            okText="Ya"
            cancelText="Batal"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 m-0">Pengumuman Sekolah</h1>
          <p className="text-slate-500 m-0 mt-1">Kelola informasi dan pengumuman untuk seluruh siswa</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()} size="large" className="bg-blue-600">
          Buat Pengumuman
        </Button>
      </div>

      <Card className="shadow-sm border-0 rounded-xl overflow-hidden">
        <Table
          columns={columns}
          dataSource={pengumumanList || []}
          loading={isLoading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
        />
      </Card>

      <Modal
        title={editingId ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
        open={isModalOpen}
        onCancel={closeModal}
        onOk={() => form.submit()}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={700}
        okText="Simpan"
        cancelText="Batal"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
          <Form.Item
            name="category"
            label="Kategori"
            rules={[{ required: true, message: 'Pilih kategori pengumuman' }]}
          >
            <Select placeholder="Pilih kategori">
              <Select.Option value="INFO AKADEMIK">Info Akademik</Select.Option>
              <Select.Option value="KEGIATAN">Kegiatan</Select.Option>
              <Select.Option value="UMUM">Umum</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="title"
            label="Judul Pengumuman"
            rules={[{ required: true, message: 'Masukkan judul pengumuman' }]}
          >
            <Input placeholder="Contoh: Jadwal Ujian Akhir Semester" />
          </Form.Item>
          <Form.Item
            name="content"
            label="Isi Pengumuman"
            rules={[{ required: true, message: 'Masukkan isi pengumuman' }]}
          >
            <TextArea rows={8} placeholder="Ketikkan detail pengumuman di sini..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
