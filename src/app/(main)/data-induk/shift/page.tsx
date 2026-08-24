"use client";

import React, { useState, useEffect } from 'react';
import { Table, Breadcrumb, App, Button, Modal, Form, Input, TimePicker, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '@/services/api';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';

export default function ShiftPage() {
  const { message } = App.useApp();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchShifts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/system/shift`);
      setData(res.data);
    } catch (error) {
      message.error('Gagal mengambil data shift');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const columns = [
    { title: 'Nama Shift', dataIndex: 'name', key: 'name' },
    { title: 'Mulai Masuk', dataIndex: 'waktuMulaiMasuk', key: 'waktuMulaiMasuk' },
    { title: 'Batas Masuk (Telat)', dataIndex: 'waktuBatasMasuk', key: 'waktuBatasMasuk' },
    { title: 'Mulai Pulang', dataIndex: 'waktuMulaiPulang', key: 'waktuMulaiPulang' },
    { title: 'Batas Pulang', dataIndex: 'waktuBatasPulang', key: 'waktuBatasPulang' },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small" type="primary" ghost />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} size="small" danger />
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    form.resetFields();
    setEditingId(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record: any) => {
    form.setFieldsValue({
      name: record.name,
      waktuMulaiMasuk: dayjs(record.waktuMulaiMasuk, 'HH:mm'),
      waktuBatasMasuk: dayjs(record.waktuBatasMasuk, 'HH:mm'),
      waktuMulaiPulang: dayjs(record.waktuMulaiPulang, 'HH:mm'),
      waktuBatasPulang: dayjs(record.waktuBatasPulang, 'HH:mm'),
    });
    setEditingId(record.id);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Hapus Shift',
      content: 'Apakah Anda yakin ingin menghapus shift ini?',
      okText: 'Ya',
      cancelText: 'Tidak',
      onOk: async () => {
        try {
          await api.delete(`/system/shift/${id}`);
          message.success('Shift berhasil dihapus');
          fetchShifts();
        } catch (error) {
          message.error('Gagal menghapus shift');
        }
      }
    });
  };

  const onFinish = async (values: any) => {
    try {
      const payload = {
        name: values.name,
        waktuMulaiMasuk: values.waktuMulaiMasuk.format('HH:mm'),
        waktuBatasMasuk: values.waktuBatasMasuk.format('HH:mm'),
        waktuMulaiPulang: values.waktuMulaiPulang.format('HH:mm'),
        waktuBatasPulang: values.waktuBatasPulang.format('HH:mm'),
      };

      if (editingId) {
        await api.patch(`/system/shift/${editingId}`, payload);
        message.success('Shift berhasil diperbarui');
      } else {
        await api.post(`/system/shift`, payload);
        message.success('Shift berhasil ditambahkan');
      }
      setIsModalVisible(false);
      fetchShifts();
    } catch (error) {
      message.error('Gagal menyimpan shift');
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[{ title: 'Data Induk' }, { title: 'Shift' }]} />
      </div>
      
      <ToolbarWrapper>
        <span className="text-white font-bold leading-tight flex-1 mr-4">Master Data Shift</span>
        <Button icon={<PlusOutlined />} onClick={handleAdd} type="primary" className="bg-emerald-500">
          Tambah Shift
        </Button>
      </ToolbarWrapper>

      <div className="bg-white p-4 mt-2 rounded-lg shadow-sm">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          size="small"
        />
      </div>

      <Modal
        title={editingId ? "Edit Shift" : "Tambah Shift"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Nama Shift" rules={[{ required: true }]}>
            <Input placeholder="Contoh: Shift Pagi" />
          </Form.Item>
          <Form.Item name="waktuMulaiMasuk" label="Waktu Mulai Masuk" rules={[{ required: true }]}>
            <TimePicker format="HH:mm" className="w-full" />
          </Form.Item>
          <Form.Item name="waktuBatasMasuk" label="Waktu Batas Masuk (Terlambat)" rules={[{ required: true }]}>
            <TimePicker format="HH:mm" className="w-full" />
          </Form.Item>
          <Form.Item name="waktuMulaiPulang" label="Waktu Mulai Pulang" rules={[{ required: true }]}>
            <TimePicker format="HH:mm" className="w-full" />
          </Form.Item>
          <Form.Item name="waktuBatasPulang" label="Waktu Batas Pulang" rules={[{ required: true }]}>
            <TimePicker format="HH:mm" className="w-full" />
          </Form.Item>
          <Form.Item className="mb-0 text-right">
            <Button onClick={() => setIsModalVisible(false)} className="mr-2">Batal</Button>
            <Button type="primary" htmlType="submit">Simpan</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
