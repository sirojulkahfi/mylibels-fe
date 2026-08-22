"use client";

import React, { useState, useEffect } from 'react';
import { Table, Space, Tooltip, Popconfirm, message, Tag, Modal, Form, Input, Select, InputNumber } from 'antd';
import { PlusOutlined, ReloadOutlined, ExportOutlined, EditOutlined, DeleteOutlined, PhoneOutlined } from '@ant-design/icons';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { getColumnSearchProps } from '@/utils/tableUtils';
import { alumniService } from '@/services/data-induk/alumni.service';
import AlumniModal from './_components/AlumniModal';

const { Option } = Select;

interface AlumniData {
  id: string;
  name: string;
  graduationYear: number;
  currentStatus: 'Melanjutkan Pendidikan' | 'Tidak Melanjutkan' | 'Bekerja' | 'Lainnya';
  institution: string;
  contact: string;
}

export default function AlumniPage() {
  const [data, setData] = useState<AlumniData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

    const fetchData = async () => {
    try {
      setLoading(true);
      const res = await alumniService.findAll();
      setData(res);
    } catch (error: any) {
      console.error(error);
      message.error('Gagal mengambil data alumni');
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

  const handleEdit = (record: AlumniData) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      graduationYear: Number(record.graduationYear)
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await alumniService.remove(id);
      message.success('Data alumni berhasil dihapus');
      fetchData();
    } catch (error: any) {
      console.error(error);
      message.error('Gagal menghapus data alumni');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingId) {
        await alumniService.update(editingId, values);
        message.success('Data alumni berhasil diperbarui');
      } else {
        await alumniService.create(values);
        message.success('Data alumni berhasil ditambahkan');
      }
      
      setIsModalVisible(false);
      fetchData();
    } catch (error: any) {
      if (error.errorFields) return; // Validation error handled by form
      console.error(error);
      message.error('Terjadi kesalahan saat menyimpan data');
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
      title: 'Nama Lengkap',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name', 'Cari Nama'),
      sorter: (a: AlumniData, b: AlumniData) => a.name.localeCompare(b.name),
    },
    {
      title: 'Tahun Lulus',
      dataIndex: 'graduationYear',
      key: 'graduationYear',
      width: 120,
      align: 'center' as const,
      sorter: (a: AlumniData, b: AlumniData) => a.graduationYear - b.graduationYear,
      filters: [
        { text: '2025', value: 2025 },
        { text: '2024', value: 2024 },
        { text: '2023', value: 2023 },
        { text: '2022', value: 2022 },
        { text: '2021', value: 2021 },
      ],
      onFilter: (value: any, record: AlumniData) => record.graduationYear === value,
      render: (year: number) => <span className="font-semibold text-gray-700">{year}</span>,
    },
    {
      title: 'Status Saat Ini',
      dataIndex: 'currentStatus',
      key: 'currentStatus',
      width: 150,
      filters: [
        { text: 'Melanjutkan Pendidikan', value: 'Melanjutkan Pendidikan' },
        { text: 'Tidak Melanjutkan', value: 'Tidak Melanjutkan' },
        { text: 'Bekerja', value: 'Bekerja' },
        { text: 'Lainnya', value: 'Lainnya' },
      ],
      onFilter: (value: any, record: AlumniData) => record.currentStatus === value,
      render: (status: string) => {
        let color = 'default';
        if (status === 'Melanjutkan Pendidikan') color = 'blue';
        if (status === 'Tidak Melanjutkan') color = 'volcano';
        if (status === 'Bekerja') color = 'cyan';
        if (status === 'Lainnya') color = 'purple';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Sekolah Lanjutan / Instansi',
      dataIndex: 'institution',
      key: 'institution',
      ...getColumnSearchProps('institution', 'Cari Instansi/Kampus'),
    },
    {
      title: 'Kontak (WA)',
      dataIndex: 'contact',
      key: 'contact',
      width: 150,
      render: (contact: string) => (
        <a href={`https://wa.me/${contact}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors">
          <PhoneOutlined /> {contact}
        </a>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: AlumniData) => (
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
            title="Hapus Data Alumni"
            description="Apakah Anda yakin ingin menghapus data alumni ini?"
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
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">Data Induk / Alumni</div>

      <ToolbarWrapper>
        <ButtonToolbar 
          message="Tambah Alumni" 
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
          rowSelection={{ type: 'checkbox' }}
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          pagination={{ 
              defaultPageSize: 10, 
            showSizeChanger: true, hideOnSinglePage: false, 
            showTotal: (total, range) => `Menampilkan ${range[0]}-${range[1]} dari ${total} alumni`
          }}
          scroll={{ x: 'max-content', y: 'calc(100vh - 310px)' }}
          loading={loading}
          size="small" bordered 
        />
      </div>

      <AlumniModal
        isModalVisible={isModalVisible}
        editingId={editingId}
        form={form}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleModalOk}
      />
    </div>
  );
}
