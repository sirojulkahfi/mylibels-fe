"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Tag, Breadcrumb, App, Modal, Form, Input, DatePicker, Switch } from 'antd';
import { 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dayjs from 'dayjs';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import { tahunAjaranService } from '@/services/system/tahun-ajaran.service';

export default function TahunAjaranPage() {
  const router = useRouter();
  const { message, modal } = App.useApp();
  
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      const res = await tahunAjaranService.findAll();
      setData(res);
    } catch (error) {
      message.error("Gagal mengambil data tahun ajaran");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (record?: any) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        name: record.name,
        isActive: record.isActive,
        dates: [
          record.startDate ? dayjs(record.startDate) : undefined,
          record.endDate ? dayjs(record.endDate) : undefined
        ]
      });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      setSaving(true);
      const payload = {
        name: values.name,
        isActive: values.isActive,
        startDate: values.dates ? values.dates[0].toDate() : undefined,
        endDate: values.dates ? values.dates[1].toDate() : undefined,
      };

      if (editingId) {
        await tahunAjaranService.update(editingId, payload);
        message.success("Tahun ajaran berhasil diperbarui");
      } else {
        await tahunAjaranService.create(payload);
        message.success("Tahun ajaran berhasil ditambahkan");
      }
      setIsModalVisible(false);
      fetchData();
    } catch (error) {
      message.error("Gagal menyimpan data tahun ajaran");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    modal.confirm({
      title: 'Hapus Tahun Ajaran',
      content: 'Apakah Anda yakin ingin menghapus data ini?',
      okText: 'Hapus',
      okType: 'danger',
      cancelText: 'Batal',
      onOk: async () => {
        try {
          await tahunAjaranService.delete(id);
          message.success("Tahun ajaran berhasil dihapus");
          fetchData();
        } catch (error) {
          message.error("Gagal menghapus tahun ajaran");
        }
      }
    });
  };

  const columns = [
    {
      title: 'No',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
      align: 'center' as const,
    },
    {
      title: 'Tahun Ajaran',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="font-bold text-gray-800">{text}</span>,
    },
    {
      title: 'Periode',
      key: 'periode',
      render: (record: any) => {
        if (record.startDate && record.endDate) {
          return `${dayjs(record.startDate).format('MMM YYYY')} - ${dayjs(record.endDate).format('MMM YYYY')}`;
        }
        return '-';
      },
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 150,
      render: (isActive: boolean) => (
        <Tag 
          icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />} 
          color={isActive ? 'success' : 'default'}
        >
          {isActive ? 'Aktif' : 'Tidak Aktif'}
        </Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <div className="flex justify-center gap-2">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            onClick={() => handleOpenModal(record)}
          />
          <Button 
            type="text" 
            danger
            icon={<DeleteOutlined />} 
            className="hover:bg-red-50"
            onClick={() => handleDelete(record.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: <Link href="/pengaturan">Pengaturan</Link> },
          { title: 'Tahun Ajaran' },
        ]} />
      </div>

      <ToolbarWrapper>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <CalendarOutlined className="text-xl text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold leading-tight">Data Tahun Ajaran</span>
            <span className="text-gray-200 text-xs">Kelola periode aktif kegiatan sekolah</span>
          </div>
        </div>

        <div className="ml-auto flex gap-2">
          <Button 
            icon={<PlusOutlined />} 
            onClick={() => handleOpenModal()}
            style={{ backgroundColor: '#ffffff', color: '#1677ff', border: 'none', fontWeight: 600 }}
          >
            Tambah Baru
          </Button>
        </div>
      </ToolbarWrapper>

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-1 mt-1 rounded-lg shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0">
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          size="middle" bordered
          loading={loading}
          scroll={{ y: 'calc(100vh - 270px)' }}
        />
      </div>

      <Modal
        title={editingId ? "Edit Tahun Ajaran" : "Tambah Tahun Ajaran Baru"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ isActive: false }}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Nama Tahun Ajaran"
            rules={[{ required: true, message: 'Harap isi nama tahun ajaran!' }]}
          >
            <Input placeholder="Contoh: 2023/2024" />
          </Form.Item>

          <Form.Item
            name="dates"
            label="Periode"
          >
            <DatePicker.RangePicker className="w-full" />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Jadikan Sebagai Tahun Ajaran Aktif?"
            valuePropName="checked"
          >
            <Switch checkedChildren="Aktif" unCheckedChildren="Tidak" />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setIsModalVisible(false)}>Batal</Button>
            <Button type="primary" htmlType="submit" loading={saving} className="bg-blue-600">
              Simpan
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
