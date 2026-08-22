"use client";

import React, { useState, useEffect } from 'react';
import { Table, Space, Tooltip, Popconfirm, message, Modal, Form, Input, InputNumber } from 'antd';
import { PlusOutlined, ReloadOutlined, ExportOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { getColumnSearchProps } from '@/utils/tableUtils';
import { ekstrakurikulerService } from '@/services/data-induk/ekstrakurikuler.service';
import EkskulModal from './_components/EkskulModal';

interface EkskulData {
  id: string;
  name: string;
  coach: string;
  schedule: string;
  location: string;
  memberCount: number;
}

export default function EkstrakurikulerPage() {
  const [data, setData] = useState<EkskulData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await ekstrakurikulerService.findAll();
      setData(res);
    } catch (error: any) {
      console.error(error);
      message.error('Gagal mengambil data ekstrakurikuler');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchData();
    }, 0);
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: EkskulData) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      memberCount: Number(record.memberCount)
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await ekstrakurikulerService.remove(id);
      message.success('Data ekstrakurikuler berhasil dihapus');
      fetchData();
    } catch (error: any) {
      console.error(error);
      message.error('Gagal menghapus data');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingId) {
        await ekstrakurikulerService.update(editingId, values);
        message.success('Data ekstrakurikuler berhasil diperbarui');
      } else {
        await ekstrakurikulerService.create(values);
        message.success('Data ekstrakurikuler berhasil ditambahkan');
      }
      
      setIsModalVisible(false);
      fetchData();
    } catch (error: any) {
      if (error.errorFields) return;
      console.error(error);
      message.error(error?.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
    }
  };

  const columns = [
    {
      title: 'No.',
      key: 'no',
      className: 'no-column',
      width: 60,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Nama Ekstrakurikuler',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name', 'Cari Ekstrakurikuler'),
      sorter: (a: EkskulData, b: EkskulData) => a.name.localeCompare(b.name),
      render: (text: string) => <span className="font-semibold text-blue-800">{text}</span>,
    },
    {
      title: 'Pembina / Pelatih',
      dataIndex: 'coach',
      key: 'coach',
      ...getColumnSearchProps('coach', 'Cari Pembina'),
    },
    {
      title: 'Jadwal',
      dataIndex: 'schedule',
      key: 'schedule',
    },
    {
      title: 'Tempat',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Jml Anggota',
      dataIndex: 'memberCount',
      key: 'memberCount',
      width: 120,
      align: 'center' as const,
      sorter: (a: EkskulData, b: EkskulData) => a.memberCount - b.memberCount,
      render: (count: number) => `${count} Siswa`,
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: EkskulData) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <ButtonToolbar 
              message="" 
              icon={<EditOutlined style={{ color: '#faad14' }} />} 
              className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100" 
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Hapus Data Ekstrakurikuler"
            description="Apakah Anda yakin ingin menghapus data ini?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ya, Hapus"
            cancelText="Batal"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Hapus">
              <ButtonToolbar message="" icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />} className="bg-red-50 text-red-600 hover:bg-red-100" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">Data Induk / Ekstrakurikuler</div>

      <ToolbarWrapper>
        <ButtonToolbar 
          message="Tambah Ekskul" 
          icon={<PlusOutlined />} 
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={handleAdd}
        />
        <ButtonToolbar 
          message="Refresh" 
          icon={<ReloadOutlined />} 
          loading={loading}
          onClick={handleRefresh}
        />
        <ButtonToolbar 
          message="Export Data" 
          icon={<ExportOutlined />} 
          className="ml-auto"
          onClick={() => message.info('Mengekspor data ke Excel...')}
        />
      </ToolbarWrapper>

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-1 mt-1 rounded-lg shadow-sm border border-gray-100">
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          pagination={{ 
              defaultPageSize: 10, 
            showSizeChanger: true, hideOnSinglePage: false, 
            showTotal: (total, range) => `Menampilkan ${range[0]}-${range[1]} dari ${total} ekstrakurikuler`
          }}
          scroll={{ x: 'max-content', y: 'calc(100vh - 310px)' }}
          loading={loading}
          size="small" bordered 
        />
      </div>

      <EkskulModal
        isModalVisible={isModalVisible}
        editingId={editingId}
        form={form}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleModalOk}
      />
    </div>
  );
}
