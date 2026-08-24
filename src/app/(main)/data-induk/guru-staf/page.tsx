"use client";

import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Tooltip, Popconfirm, Modal, Form, Input, Select, App } from 'antd';
import { PlusOutlined, ReloadOutlined, ExportOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { getColumnSearchProps } from '@/utils/tableUtils';
import { guruStafService } from '@/services/data-induk/guru-staf.service';
import { mataPelajaranService } from '@/services/data-induk/mata-pelajaran.service';
import GuruModal from './_components/GuruModal';

const { Option } = Select;

interface GuruStafData {
  id: string;
  nip: string;
  name: string;
  position: string;
  subject: string;
  employmentStatus: 'PNS' | 'Honorer' | 'PPPK';
  status: 'Aktif' | 'Cuti' | 'Pensiun';
}

export default function GuruStafPage() {
  const { message } = App.useApp();
  const [data, setData] = useState<GuruStafData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const [mapelData, setMapelData] = useState<any[]>([]);

    const fetchData = async () => {
    try {
      setLoading(true);
      const res = await guruStafService.findAll();
      setData(res);
    } catch (error: any) {
      console.error(error);
      message.error('Gagal mengambil data guru & staf');
    } finally {
      setLoading(false);
    }
  };

    const fetchMapel = async () => {
    try {
      const res = await mataPelajaranService.findAll();
      setMapelData(res);
    } catch (error: any) {
      console.error('Failed to fetch mapel', error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchData();
      fetchMapel();
    }, 0);
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ subject: [] });
    setIsModalVisible(true);
  };

  const handleEdit = (record: GuruStafData) => {
    setEditingId(record.id);
    const subjectArray = record.subject && record.subject !== '-' 
      ? record.subject.split(',').map(s => s.trim()) 
      : [];
    form.setFieldsValue({
      ...record,
      subject: subjectArray
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await guruStafService.remove(id);
      message.success('Data berhasil dihapus');
      fetchData();
    } catch (error: any) {
      console.error(error);
      message.error('Gagal menghapus data');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      const payload = {
        ...values,
        subject: Array.isArray(values.subject) ? (values.subject.length > 0 ? values.subject.join(', ') : '-') : (values.subject || '-')
      };
      
      if (editingId) {
        await guruStafService.update(editingId, payload);
        message.success('Data berhasil diperbarui');
      } else {
        await guruStafService.create(payload);
        message.success('Data berhasil ditambahkan');
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
      title: 'NIP/NIK',
      dataIndex: 'nip',
      key: 'nip',
      width: 140,
      sorter: (a: GuruStafData, b: GuruStafData) => a.nip.localeCompare(b.nip),
      ...getColumnSearchProps('nip', 'Cari NIP'),
    },
    {
      title: 'Nama Lengkap',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name', 'Cari Nama'),
      sorter: (a: GuruStafData, b: GuruStafData) => a.name.localeCompare(b.name),
    },
    {
      title: 'Jabatan',
      dataIndex: 'position',
      key: 'position',
      width: 150,
      filters: [
        { text: 'Kepala Sekolah', value: 'Kepala Sekolah' },
        { text: 'Wakasek', value: 'Wakasek' },
        { text: 'Guru', value: 'Guru' },
        { text: 'Staf TU', value: 'Staf TU' },
      ],
      onFilter: (value: any, record: GuruStafData) => record.position.includes(value as string),
    },
    {
      title: 'Mata Pelajaran',
      dataIndex: 'subject',
      key: 'subject',
      width: 150,
      ...getColumnSearchProps('subject', 'Cari Mapel'),
    },
    {
      title: 'Status Pegawai',
      dataIndex: 'employmentStatus',
      key: 'employmentStatus',
      width: 130,
      filters: [
        { text: 'PNS', value: 'PNS' },
        { text: 'PPPK', value: 'PPPK' },
        { text: 'Honorer', value: 'Honorer' },
      ],
      onFilter: (value: any, record: GuruStafData) => record.employmentStatus === value,
      render: (status: string) => {
        let color = 'default';
        if (status === 'PNS') color = 'processing';
        if (status === 'PPPK') color = 'success';
        if (status === 'Honorer') color = 'warning';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      filters: [
        { text: 'Aktif', value: 'Aktif' },
        { text: 'Cuti', value: 'Cuti' },
        { text: 'Pensiun', value: 'Pensiun' },
      ],
      onFilter: (value: any, record: GuruStafData) => record.status === value,
      render: (status: string) => (
        <Tag color={status === 'Aktif' ? 'green' : (status === 'Cuti' ? 'orange' : 'red')}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: GuruStafData) => (
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
            title="Hapus Data Guru"
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
      <div className="mb-2 text-gray-500 text-sm">Data Induk / Guru & Staf</div>

      <ToolbarWrapper>
        <ButtonToolbar 
          message="Tambah Pegawai" 
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
            showTotal: (total, range) => `Menampilkan ${range[0]}-${range[1]} dari ${total} data`
          }}
          scroll={{ x: 'max-content', y: 'calc(100vh - 310px)' }}
          loading={loading}
          size="small" bordered 
        />
      </div>

      <GuruModal
        isModalVisible={isModalVisible}
        editingId={editingId}
        form={form}
        mapelData={mapelData}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleModalOk}
      />
    </div>
  );
}
