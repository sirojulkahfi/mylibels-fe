"use client";

import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Tooltip, Popconfirm, message, Modal, Form, Input, InputNumber, Select } from 'antd';
import { PlusOutlined, ReloadOutlined, ExportOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { getColumnSearchProps } from '@/utils/tableUtils';
import { ruanganService } from '@/services/data-induk/ruangan.service';
import RuanganModal from './_components/RuanganModal';

const { Option } = Select;

interface RuanganData {
  id: string;
  code: string;
  name: string;
  type: string;
  capacity: number;
  condition: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
}

export default function RuanganPage() {
  const [data, setData] = useState<RuanganData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

    const fetchData = async () => {
    try {
      setLoading(true);
      const res = await ruanganService.findAll();
      setData(res);
    } catch (error: any) {
      console.error(error);
      message.error('Gagal mengambil data ruangan');
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

  const handleEdit = (record: RuanganData) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      capacity: Number(record.capacity)
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await ruanganService.remove(id);
      message.success('Data ruangan berhasil dihapus');
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
        await ruanganService.update(editingId, values);
        message.success('Data ruangan berhasil diperbarui');
      } else {
        await ruanganService.create(values);
        message.success('Data ruangan berhasil ditambahkan');
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
      title: 'Kode Ruang',
      dataIndex: 'code',
      key: 'code',
      width: 130,
      sorter: (a: RuanganData, b: RuanganData) => a.code.localeCompare(b.code),
      ...getColumnSearchProps('code', 'Cari Kode'),
    },
    {
      title: 'Nama Ruangan',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name', 'Cari Nama'),
      sorter: (a: RuanganData, b: RuanganData) => a.name.localeCompare(b.name),
    },
    {
      title: 'Jenis',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      filters: [
        { text: 'Teori', value: 'Teori' },
        { text: 'Laboratorium', value: 'Laboratorium' },
        { text: 'Perpustakaan', value: 'Perpustakaan' },
        { text: 'Fasilitas', value: 'Fasilitas' },
        { text: 'Kantor', value: 'Kantor' },
      ],
      onFilter: (value: any, record: RuanganData) => record.type === value,
      render: (type: string) => {
        let color = 'default';
        if (type === 'Teori') color = 'blue';
        if (type === 'Laboratorium') color = 'purple';
        if (type === 'Perpustakaan') color = 'cyan';
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: 'Kapasitas',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 100,
      align: 'center' as const,
      render: (cap: number) => `${cap} Orang`,
    },
    {
      title: 'Kondisi',
      dataIndex: 'condition',
      key: 'condition',
      width: 140,
      filters: [
        { text: 'Baik', value: 'Baik' },
        { text: 'Rusak Ringan', value: 'Rusak Ringan' },
        { text: 'Rusak Berat', value: 'Rusak Berat' },
      ],
      onFilter: (value: any, record: RuanganData) => record.condition === value,
      render: (condition: string) => {
        let color = 'green';
        if (condition === 'Rusak Ringan') color = 'orange';
        if (condition === 'Rusak Berat') color = 'red';
        return <Tag color={color}>{condition}</Tag>;
      },
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: RuanganData) => (
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
            title="Hapus Data Ruangan"
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
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">Data Induk / Ruangan</div>

      <ToolbarWrapper>
        <ButtonToolbar 
          message="Tambah Ruangan" 
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
            showTotal: (total, range) => `Menampilkan ${range[0]}-${range[1]} dari ${total} ruangan`
          }}
          scroll={{ x: 'max-content', y: 'calc(100vh - 310px)' }}
          loading={loading}
          size="small" bordered 
        />
      </div>

      <RuanganModal
        isModalVisible={isModalVisible}
        editingId={editingId}
        form={form}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleModalOk}
      />
    </div>
  );
}
