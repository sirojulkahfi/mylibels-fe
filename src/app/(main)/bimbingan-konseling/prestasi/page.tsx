"use client";

import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Tooltip, App } from 'antd';
import { useRouter } from 'next/navigation';
import { ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { getColumnSearchProps } from '@/utils/tableUtils';
import { bkService } from '@/services/bk/bk.service';

export default function PrestasiPage() {
  const { message } = App.useApp();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await bkService.findAllPrestasi();
      setData(res || []);
    } catch (error: any) {
      console.error(error);
      message.error('Gagal mengambil data prestasi siswa');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData();
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
      title: 'Nama Siswa',
      dataIndex: 'siswaName',
      key: 'siswaName',
      ...getColumnSearchProps('siswaName', 'Cari Nama Siswa'),
      sorter: (a: any, b: any) => (a.siswaName || '').localeCompare(b.siswaName || ''),
    },
    {
      title: 'Kelas',
      dataIndex: 'kelasName',
      key: 'kelasName',
      width: 120,
      ...getColumnSearchProps('kelasName', 'Cari Kelas'),
    },
    {
      title: 'Tanggal',
      dataIndex: 'tanggal',
      key: 'tanggal',
      width: 150,
      render: (tanggal: string) => {
        if (!tanggal) return '-';
        return new Date(tanggal).toLocaleDateString('id-ID', {
          day: '2-digit', month: 'short', year: 'numeric'
        });
      },
    },
    {
      title: 'Nama Prestasi',
      dataIndex: 'namaPrestasi',
      key: 'namaPrestasi',
      ...getColumnSearchProps('namaPrestasi', 'Cari Prestasi'),
    },
    {
      title: 'Tingkat',
      dataIndex: 'tingkat',
      key: 'tingkat',
      width: 130,
      filters: [
        { text: 'Sekolah', value: 'Sekolah' },
        { text: 'Kab/Kota', value: 'Kabupaten/Kota' },
        { text: 'Provinsi', value: 'Provinsi' },
        { text: 'Nasional', value: 'Nasional' },
        { text: 'Internasional', value: 'Internasional' }
      ],
      onFilter: (value: any, record: any) => record.tingkat === value,
      render: (tingkat: string) => {
        let color = 'default';
        if (tingkat === 'Nasional') color = 'blue';
        if (tingkat === 'Internasional') color = 'gold';
        return <Tag color={color}>{tingkat || '-'}</Tag>;
      }
    },
    {
      title: 'Poin',
      dataIndex: 'poin',
      key: 'poin',
      width: 100,
      align: 'center' as const,
      sorter: (a: any, b: any) => (a.poin || 0) - (b.poin || 0),
      render: (poin: number) => (
        <Tag color="green">+{poin}</Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Tooltip title="Detail Riwayat Prestasi Siswa">
            <ButtonToolbar 
              message="" 
              icon={<EyeOutlined style={{ color: '#1677ff' }} />} 
              className="bg-blue-50 text-blue-600 hover:bg-blue-100" 
              onClick={() => router.push(`/bimbingan-konseling/prestasi/${record.siswaId || record.id}`)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">Bimbingan Konseling / Prestasi Siswa</div>

      <ToolbarWrapper>
        <ButtonToolbar 
          message="Refresh Data" 
          icon={<ReloadOutlined />} 
          loading={loading}
          onClick={handleRefresh}
        />
      </ToolbarWrapper>

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-1 mt-1 rounded-lg shadow-sm border border-gray-100">
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          pagination={{ 
            defaultPageSize: 15, 
            showSizeChanger: true, 
            hideOnSinglePage: false, 
            showTotal: (total, range) => `Menampilkan ${range[0]}-${range[1]} dari ${total} prestasi`
          }}
          scroll={{ x: 'max-content', y: 'calc(100vh - 310px)' }}
          loading={loading}
          size="small" bordered 
        />
      </div>
    </div>
  );
}
