"use client";

import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Tooltip, Popconfirm, message, Modal, Form, Input, Select, InputNumber, Radio, Descriptions, Badge } from 'antd';
import { PlusOutlined, ReloadOutlined, ExportOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { getColumnSearchProps } from '@/utils/tableUtils';
import { waliKelasService, WaliKelasItem } from '@/services/data-induk/wali-kelas.service';
import { guruStafService } from '@/services/data-induk/guru-staf.service';
import { kelasService } from '@/services/data-induk/kelas.service';
import WaliKelasModal from './_components/WaliKelasModal';

const { Option } = Select;

export default function WaliKelasPage() {
  const [data, setData] = useState<WaliKelasItem[]>([]);
  const [guruStafList, setGuruStafList] = useState<any[]>([]);
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal States
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedRecord, setSelectedRecord] = useState<WaliKelasItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form] = Form.useForm();

    const fetchData = async () => {
    setLoading(true);
    try {
      const [res, guruStafRes, kelasRes] = await Promise.all([
        waliKelasService.findAll(),
        guruStafService.findAll(),
        kelasService.findAll()
      ]);
      setGuruStafList(guruStafRes);
      setKelasList(kelasRes);
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      const levelOrder: Record<string, number> = { VII: 1, VIII: 2, IX: 3, X: 4, XI: 5, XII: 6 };
      const sorted = [...list].sort((a, b) => {
        const diff = (levelOrder[a.level] || 99) - (levelOrder[b.level] || 99);
        if (diff !== 0) return diff;
        return (a.className || '').localeCompare(b.className || '');
      });
      setData(sorted);
    } catch (error) {
      console.error('Failed to fetch wali kelas data:', error);
      message.error('Gagal memuat data wali kelas dari server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchData();
    }, 0);
  }, []);

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedRecord(null);
    form.resetFields();
    form.setFieldsValue({
      academicYear: '2025/2026',
      semester: 'Ganjil',
      level: 'VII',
      status: 'Aktif',
      studentCount: 32,
    });
    setIsModalVisible(true);
  };

  const handleOpenEdit = (record: WaliKelasItem) => {
    setModalMode('edit');
    setSelectedRecord(record);
    form.setFieldsValue({
      nip: record.nip,
      teacherName: record.teacherName,
      className: record.className,
      level: record.level,
      academicYear: record.academicYear,
      semester: record.semester,
      studentCount: record.studentCount,
      phone: record.phone,
      status: record.status,
    });
    setIsModalVisible(true);
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      if (modalMode === 'create') {
        await waliKelasService.create(values);
        message.success('Data Wali Kelas berhasil ditambahkan ke database');
      } else if (selectedRecord) {
        await waliKelasService.update(selectedRecord.id, values);
        message.success('Data Wali Kelas berhasil diperbarui di database');
      }

      setIsModalVisible(false);
      fetchData();
    } catch (error: any) {
      if (error?.errorFields) return; // Validation error
      message.error(error?.response?.data?.message || 'Gagal menyimpan data wali kelas');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await waliKelasService.remove(id);
      message.success('Data wali kelas berhasil dihapus');
      fetchData();
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Gagal menghapus data wali kelas');
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
      title: 'NIP / NIK',
      dataIndex: 'nip',
      key: 'nip',
      width: 140,
      sorter: (a: WaliKelasItem, b: WaliKelasItem) => (a.nip || '').localeCompare(b.nip || ''),
      ...getColumnSearchProps('nip', 'Cari NIP'),
    },
    {
      title: 'Nama Wali Kelas',
      dataIndex: 'teacherName',
      key: 'teacherName',
      ...getColumnSearchProps('teacherName', 'Cari Nama'),
      sorter: (a: WaliKelasItem, b: WaliKelasItem) => (a.teacherName || '').localeCompare(b.teacherName || ''),
      render: (name: string) => <span className="font-semibold text-gray-800">{name}</span>,
    },
    {
      title: 'Kelas Binaan',
      dataIndex: 'className',
      key: 'className',
      width: 140,
      align: 'center' as const,
      filters: kelasList.map(k => ({ text: k.name, value: k.name })),
      onFilter: (value: any, record: WaliKelasItem) => record.className === value,
      render: (className: string) => (
        <Tag color="blue" className="font-semibold px-2.5 py-0.5 text-xs">
          {className}
        </Tag>
      ),
    },
    {
      title: 'Tahun Ajaran / Semester',
      key: 'academicPeriod',
      width: 180,
      render: (_: any, record: WaliKelasItem) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium text-gray-700">{record.academicYear}</span>
          <Tag color={record.semester === 'Ganjil' ? 'purple' : 'geekblue'} className="text-[10px] m-0 w-max">
            Semester {record.semester}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Jumlah Siswa',
      dataIndex: 'studentCount',
      key: 'studentCount',
      width: 130,
      align: 'center' as const,
      sorter: (a: WaliKelasItem, b: WaliKelasItem) => (a.studentCount || 0) - (b.studentCount || 0),
      render: (count: number) => (
        <Space size={4}>
          <UserOutlined className="text-blue-500" />
          <span className="font-medium text-gray-700">{count || 0} Siswa</span>
        </Space>
      ),
    },
    {
      title: 'No. Kontak / HP',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (phone: string) => (
        <Space size={4} className="text-gray-600">
          <PhoneOutlined className="text-green-500 text-xs" />
          <span>{phone || '-'}</span>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      align: 'center' as const,
      filters: [
        { text: 'Aktif', value: 'Aktif' },
        { text: 'Non-Aktif', value: 'Non-Aktif' },
      ],
      onFilter: (value: any, record: WaliKelasItem) => record.status === value,
      render: (status: string) => (
        <Tag color={status === 'Aktif' ? 'green' : 'red'}>
          {(status || 'AKTIF').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: WaliKelasItem) => (
        <Space size="small">
          <Tooltip title="Edit">
            <ButtonToolbar 
              message="" 
              icon={<EditOutlined style={{ color: '#faad14' }} />} 
              className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100" 
              onClick={() => handleOpenEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Hapus Wali Kelas"
            description="Apakah Anda yakin ingin menghapus data wali kelas ini?"
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
      <div className="mb-2 text-gray-500 text-sm">Data Induk / Wali Kelas</div>

      <ToolbarWrapper>
        <ButtonToolbar 
          message="Tambah Wali Kelas" 
          icon={<PlusOutlined />} 
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={handleOpenCreate}
        />
        <ButtonToolbar 
          message="Refresh" 
          icon={<ReloadOutlined />} 
          loading={loading}
          onClick={fetchData}
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
            showTotal: (total, range) => `Menampilkan ${range[0]}-${range[1]} dari ${total} wali kelas`
          }}
          scroll={{ x: 'max-content', y: 'calc(100vh - 310px)' }}
          loading={loading}
          size="small" bordered 
        />
      </div>

      {/* Modal Tambah / Edit Wali Kelas */}
      <WaliKelasModal
        isModalVisible={isModalVisible}
        modalMode={modalMode}
        submitting={submitting}
        form={form}
        guruStafList={guruStafList}
        kelasList={kelasList}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleFormSubmit}
      />
    </div>
  );
}
