"use client";

import React, { useState, useEffect } from 'react';
import { Table, Space, Tooltip, Popconfirm, message, Modal, Form, Input, InputNumber, Select } from 'antd';
import { useRouter } from 'next/navigation';
import { PlusOutlined, ReloadOutlined, ExportOutlined, EditOutlined, DeleteOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { getColumnSearchProps } from '@/utils/tableUtils';
import { kelasService } from '@/services/data-induk/kelas.service';
import { waliKelasService, WaliKelasItem } from '@/services/data-induk/wali-kelas.service';
import KelasModal from './_components/KelasModal';

const { Option } = Select;

interface KelasData {
  id: string;
  code: string;
  name: string;
  level: string;
  homeroomTeacher: string;
  capacity: number;
  studentCount: number;
  shiftId?: string;
  shift?: { id: string; name: string };
}

export default function KelasPage() {
  const [data, setData] = useState<KelasData[]>([]);
  const [waliKelasList, setWaliKelasList] = useState<WaliKelasItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [shiftList, setShiftList] = useState<any[]>([]);
  const [form] = Form.useForm();
  const router = useRouter();
  const { token } = useAuthStore();

    const fetchData = async () => {
    try {
      setLoading(true);
      const [res, waliKelasRes, shiftRes] = await Promise.all([
        kelasService.findAll(),
        waliKelasService.findAll(),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/system/shift`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] }))
      ]);
      setData(res);
      const wkList = Array.isArray(waliKelasRes?.data) ? waliKelasRes.data : Array.isArray(waliKelasRes) ? waliKelasRes : [];
      setWaliKelasList(wkList);
      setShiftList(shiftRes.data || []);
    } catch (error: any) {
      console.error(error);
      message.error('Gagal mengambil data kelas');
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

  const handleEdit = (record: KelasData) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      capacity: Number(record.capacity),
      studentCount: Number(record.studentCount)
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await kelasService.remove(id);
      message.success('Data kelas berhasil dihapus');
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
        await kelasService.update(editingId, values);
        message.success('Data kelas berhasil diperbarui');
      } else {
        await kelasService.create(values);
        message.success('Data kelas berhasil ditambahkan');
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
      title: 'Kode Kelas',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      sorter: (a: KelasData, b: KelasData) => a.code.localeCompare(b.code),
      ...getColumnSearchProps('code', 'Cari Kode'),
    },
    {
      title: 'Nama Kelas',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      sorter: (a: KelasData, b: KelasData) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('name', 'Cari Kelas'),
      render: (text: string) => <span className="font-semibold">{text}</span>,
    },
    {
      title: 'Tingkat',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      align: 'center' as const,
      filters: [
        { text: 'VII', value: 'VII' },
        { text: 'VIII', value: 'VIII' },
        { text: 'IX', value: 'IX' },
      ],
      onFilter: (value: any, record: KelasData) => record.level === value,
    },
    {
      title: 'Wali Kelas',
      dataIndex: 'homeroomTeacher',
      key: 'homeroomTeacher',
      ...getColumnSearchProps('homeroomTeacher', 'Cari Wali Kelas'),
    },
    {
      title: 'Shift',
      dataIndex: 'shift',
      key: 'shift',
      width: 120,
      align: 'center' as const,
      render: (shift: any) => shift ? <span className="text-blue-600 border border-blue-200 bg-blue-50 px-2 py-1 rounded text-xs">{shift.name}</span> : <span className="text-gray-400 text-xs">Global</span>,
    },
    {
      title: 'Kapasitas',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 100,
      align: 'center' as const,
    },
    {
      title: 'Jml Siswa',
      dataIndex: 'studentCount',
      key: 'studentCount',
      width: 100,
      align: 'center' as const,
      render: (count: number, record: KelasData) => (
        <span className={count > record.capacity ? 'text-red-500 font-semibold' : 'text-green-600 font-semibold'}>
          {count}
        </span>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: KelasData) => (
        <Space size="middle">
          <Tooltip title="Plotting Siswa">
            <ButtonToolbar 
              message="" 
              icon={<UsergroupAddOutlined style={{ color: '#1677ff' }} />} 
              className="bg-blue-50 text-blue-600 hover:bg-blue-100" 
              onClick={() => router.push(`/data-induk/kelas/${record.id}/plotting-siswa`)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <ButtonToolbar 
              message="" 
              icon={<EditOutlined style={{ color: '#faad14' }} />} 
              className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100" 
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Hapus Data Kelas"
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
      <div className="mb-2 text-gray-500 text-sm">Data Induk / Kelas</div>

      <ToolbarWrapper>
        <ButtonToolbar 
          message="Tambah Kelas" 
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
            showTotal: (total, range) => `Menampilkan ${range[0]}-${range[1]} dari ${total} kelas`
          }}
          scroll={{ x: 'max-content', y: 'calc(100vh - 310px)' }}
          loading={loading}
          size="small" bordered 
        />
      </div>

        <KelasModal 
          isModalVisible={isModalVisible}
          editingId={editingId}
          form={form}
          waliKelasList={waliKelasList}
          shiftList={shiftList}
          onCancel={() => setIsModalVisible(false)}
          onOk={handleModalOk}
        />
    </div>
  );
}
