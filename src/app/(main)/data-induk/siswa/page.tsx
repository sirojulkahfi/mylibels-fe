"use client";

import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Tooltip, Popconfirm, Modal, Form, Input, Select, Radio, App } from 'antd';
import { useRouter } from 'next/navigation';
import { PlusOutlined, ReloadOutlined, ExportOutlined, ImportOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SwapOutlined } from '@ant-design/icons';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { getColumnSearchProps } from '@/utils/tableUtils';
import { siswaService } from '@/services/data-induk/siswa.service';
import { kelasService } from '@/services/data-induk/kelas.service';
import SiswaModal from './_components/SiswaModal';
import MutasiSiswaModal from './_components/MutasiSiswaModal';
const { Option } = Select;

interface SiswaData {
  id: string;
  nisn: string;
  nis: string;
  name: string;
  gender: 'Laki-laki' | 'Perempuan';
  class: string;
  status: 'Aktif' | 'Lulus' | 'Pindah';
  parentName?: string;
  parentPhone?: string;
  address?: string;
}

export default function SiswaPage() {
  const { message } = App.useApp();
  const [data, setData] = useState<SiswaData[]>([]);
  const [kelasData, setKelasData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingSiswa, setEditingSiswa] = useState<SiswaData | null>(null);
  const [form] = Form.useForm();
  
  const [isMutasiModalVisible, setIsMutasiModalVisible] = useState(false);
  const [currentSiswa, setCurrentSiswa] = useState<SiswaData | null>(null);
  const [mutasiForm] = Form.useForm();

  const router = useRouter();

    const fetchData = async () => {
    try {
      setLoading(true);
      const res = await siswaService.findAll();
      setData(res);
    } catch (error: any) {
      console.error(error);
      message.error('Gagal mengambil data siswa');
    } finally {
      setLoading(false);
    }
  };

    const fetchKelas = async () => {
    try {
      const res = await kelasService.findAll();
      setKelasData(res);
    } catch (error: any) {
      console.error('Failed to fetch kelas', error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchData();
      fetchKelas();
    }, 0);
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  const handleAdd = () => {
    setEditingId(null);
    setEditingSiswa(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record: SiswaData) => {
    setEditingId(record.id);
    setEditingSiswa(record);
    setIsModalVisible(true);
  };


  const handleMutasi = async (record: SiswaData) => {
    setCurrentSiswa(record);
    setIsMutasiModalVisible(true);
    try {
      const res = await siswaService.findOne(record.id);
      setCurrentSiswa(res);
    } catch (error) {
      console.error(error);
      message.error('Gagal mengambil data siswa');
    }
  };

  const handleMutasiOk = async () => {
    try {
      const values = await mutasiForm.validateFields();
      if (currentSiswa) {
        await siswaService.update(currentSiswa.id, {
          ...currentSiswa,
          status: values.status,
          class: values.class,
        });
        message.success('Data mutasi berhasil disimpan');
        setIsMutasiModalVisible(false);
        fetchData();
      }
    } catch (error: any) {
      if (error.errorFields) return;
      console.error(error);
      message.error(error?.response?.data?.message || 'Gagal menyimpan data mutasi');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await siswaService.remove(id);
      message.success('Data siswa berhasil dihapus');
      fetchData();
    } catch (error: any) {
      console.error(error);
      message.error('Gagal menghapus data siswa');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingId) {
        await siswaService.update(editingId, values);
        message.success('Data siswa berhasil diperbarui');
      } else {
        await siswaService.create(values);
        message.success('Data siswa berhasil ditambahkan');
      }
      
      setIsModalVisible(false);
      fetchData();
    } catch (error: any) {
      if (error.errorFields) return; // Validation error
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
      title: 'NISN',
      dataIndex: 'nisn',
      key: 'nisn',
      width: 130,
      sorter: (a: SiswaData, b: SiswaData) => a.nisn.localeCompare(b.nisn),
      ...getColumnSearchProps('nisn', 'Cari NISN'),
    },
    {
      title: 'NIS',
      dataIndex: 'nis',
      key: 'nis',
      width: 100,
      ...getColumnSearchProps('nis', 'Cari NIS'),
    },
    {
      title: 'Nama Lengkap',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name', 'Cari Nama'),
      sorter: (a: SiswaData, b: SiswaData) => a.name.localeCompare(b.name),
    },
    {
      title: 'L/P',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
      align: 'center' as const,
      filters: [
        { text: 'Laki-laki', value: 'Laki-laki' },
        { text: 'Perempuan', value: 'Perempuan' },
      ],
      onFilter: (value: any, record: SiswaData) => record.gender === value,
      render: (gender: string) => (
        <Tag color={gender === 'Laki-laki' ? 'blue' : 'magenta'}>
          {gender === 'Laki-laki' ? 'L' : 'P'}
        </Tag>
      ),
    },
    {
      title: 'Kelas',
      dataIndex: 'class',
      key: 'class',
      width: 120,
      filters: kelasData.map(k => ({ text: k.name, value: k.name })),
      onFilter: (value: any, record: SiswaData) => record.class === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: 'Aktif', value: 'Aktif' },
        { text: 'Lulus', value: 'Lulus' },
        { text: 'Pindah', value: 'Pindah' },
      ],
      onFilter: (value: any, record: SiswaData) => record.status === value,
      render: (status: string) => {
        let color = 'green';
        if (status === 'Lulus') color = 'blue';
        if (status === 'Pindah') color = 'orange';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 180,
      align: 'center' as const,
      render: (_: any, record: SiswaData) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <ButtonToolbar 
              message="" 
              icon={<EditOutlined style={{ color: '#faad14' }} />} 
              className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100" 
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Mutasi">
            <ButtonToolbar 
              message="" 
              icon={<SwapOutlined style={{ color: '#fa8c16' }} />} 
              className="bg-orange-50 text-orange-600 hover:bg-orange-100" 
              onClick={() => handleMutasi(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Hapus Data Siswa"
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
      <div className="mb-2 text-gray-500 text-sm">Data Induk / Siswa</div>

      <ToolbarWrapper>
        <ButtonToolbar 
          message="Tambah Siswa" 
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
          message="Import Data Siswa" 
          icon={<ImportOutlined />} 
          className="ml-auto"
          onClick={() => router.push('/data-induk/siswa/import-export')}
        />
        <ButtonToolbar 
          message="Export Data" 
          icon={<ExportOutlined />} 
          onClick={() => message.info('Mengekspor data ke Excel...')}
        />
      </ToolbarWrapper>

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-1 mt-1 rounded-lg shadow-sm border border-gray-100">
        <Table 
          rowSelection={{ type: 'checkbox' }}
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          expandable={{
            expandedRowRender: (record) => (
              <div className="bg-blue-50/50 p-4 border border-blue-100 rounded-lg ml-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-600 block mb-1">Nama Orang Tua / Wali:</span>
                    <span className="text-gray-800">{record.parentName || <span className="text-gray-400 italic">Belum diisi</span>}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600 block mb-1">No. Telepon Orang Tua:</span>
                    <span className="text-gray-800">{record.parentPhone || <span className="text-gray-400 italic">Belum diisi</span>}</span>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <span className="font-semibold text-gray-600 block mb-1">Alamat Rumah:</span>
                    <span className="text-gray-800">{record.address || <span className="text-gray-400 italic">Belum diisi</span>}</span>
                  </div>
                </div>
              </div>
            ),
          }}
          pagination={{ 
              defaultPageSize: 10, 
            showSizeChanger: true, hideOnSinglePage: false, 
            showTotal: (total, range) => `Menampilkan ${range[0]}-${range[1]} dari ${total} siswa`
          }}
          scroll={{ x: 'max-content', y: 'calc(100vh - 310px)' }}
          loading={loading}
          size="small" bordered 
        />
      </div>

      <SiswaModal
        isModalVisible={isModalVisible}
        editingId={editingId}
        initialData={editingSiswa}
        form={form}
        kelasData={kelasData}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleModalOk}
      />
      <MutasiSiswaModal
        isModalVisible={isMutasiModalVisible}
        form={mutasiForm}
        siswaData={currentSiswa}
        kelasData={kelasData}
        loading={loading}
        onCancel={() => setIsMutasiModalVisible(false)}
        onOk={handleMutasiOk}
      />
    </div>
  );
}
