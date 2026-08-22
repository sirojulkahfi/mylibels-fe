"use client";

import React, { useState, useEffect } from 'react';
import { Table, Space, Tooltip, Popconfirm, message, Tag, Modal, Form, Input, InputNumber, Select } from 'antd';
import { PlusOutlined, ReloadOutlined, ExportOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { getColumnSearchProps } from '@/utils/tableUtils';
import { mataPelajaranService } from '@/services/data-induk/mata-pelajaran.service';
import MapelModal from './_components/MapelModal';

const { Option } = Select;

interface MapelData {
  id: string;
  code: string;
  name: string;
  category: 'Wajib' | 'Muatan Lokal' | 'Pilihan';
  kkm: number;
}

export default function MataPelajaranPage() {
  const [data, setData] = useState<MapelData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

    const fetchData = async () => {
    try {
      setLoading(true);
      const res = await mataPelajaranService.findAll();
      setData(res);
    } catch (error: any) {
      console.error(error);
      message.error('Gagal mengambil data mata pelajaran');
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

  const handleEdit = (record: MapelData) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      kkm: Number(record.kkm)
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await mataPelajaranService.remove(id);
      message.success('Data mata pelajaran berhasil dihapus');
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
        await mataPelajaranService.update(editingId, values);
        message.success('Data mata pelajaran berhasil diperbarui');
      } else {
        await mataPelajaranService.create(values);
        message.success('Data mata pelajaran berhasil ditambahkan');
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
      title: 'Kode Mapel',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      sorter: (a: MapelData, b: MapelData) => a.code.localeCompare(b.code),
      ...getColumnSearchProps('code', 'Cari Kode'),
    },
    {
      title: 'Mata Pelajaran',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name', 'Cari Mapel'),
      sorter: (a: MapelData, b: MapelData) => a.name.localeCompare(b.name),
      render: (text: string) => <span className="font-semibold text-blue-800">{text}</span>,
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
      width: 150,
      filters: [
        { text: 'Wajib', value: 'Wajib' },
        { text: 'Muatan Lokal', value: 'Muatan Lokal' },
        { text: 'Pilihan', value: 'Pilihan' },
      ],
      onFilter: (value: any, record: MapelData) => record.category === value,
      render: (category: string) => {
        let color = 'default';
        if (category === 'Wajib') color = 'blue';
        if (category === 'Muatan Lokal') color = 'cyan';
        if (category === 'Pilihan') color = 'purple';
        return <Tag color={color}>{category}</Tag>;
      },
    },
    {
      title: 'KKM',
      dataIndex: 'kkm',
      key: 'kkm',
      width: 100,
      align: 'center' as const,
      sorter: (a: MapelData, b: MapelData) => a.kkm - b.kkm,
      render: (kkm: number) => <span className="font-semibold">{kkm}</span>,
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: MapelData) => (
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
            title="Hapus Data Mata Pelajaran"
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
      <div className="mb-2 text-gray-500 text-sm">Data Induk / Mata Pelajaran</div>

      <ToolbarWrapper>
        <ButtonToolbar 
          message="Tambah Mapel" 
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
            showTotal: (total, range) => `Menampilkan ${range[0]}-${range[1]} dari ${total} mata pelajaran`
          }}
          scroll={{ x: 'max-content', y: 'calc(100vh - 310px)' }}
          loading={loading}
          size="small" bordered 
        />
      </div>

      <MapelModal
        isModalVisible={isModalVisible}
        editingId={editingId}
        form={form}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleModalOk}
      />
    </div>
  );
}
