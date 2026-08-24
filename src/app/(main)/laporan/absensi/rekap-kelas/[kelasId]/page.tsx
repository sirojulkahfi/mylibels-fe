"use client";

import React, { useState, useEffect, use } from 'react';
import { Table, Tag, Space, App, DatePicker, Button } from 'antd';
import { ReloadOutlined, PrinterOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { getColumnSearchProps } from '@/utils/tableUtils';
import { presensiService } from '@/services/presensi/presensi.service';
import { kelasService } from '@/services/data-induk/kelas.service';

const { RangePicker } = DatePicker;

export default function LaporanRekapKelasPage({ params }: { params: Promise<{ kelasId: string }> }) {
  const { message } = App.useApp();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [kelasData, setKelasData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<any>(null);

  const unwrappedParams = use(params);
  const kelasId = unwrappedParams.kelasId;

  const fetchData = async () => {
    try {
      setLoading(true);
      const filters: any = { kelasId: kelasId };
      if (dateRange && dateRange.length === 2) {
        filters.startDate = dateRange[0].format('YYYY-MM-DD');
        filters.endDate = dateRange[1].format('YYYY-MM-DD');
      }
      
      // Ambil detail kelas berdasarkan ID route agar label tidak jatuh ke ID database.
      const currentKelas = await kelasService.findOne(kelasId);
      setKelasData(currentKelas?.data || currentKelas);
      
      const res = await presensiService.findAllSiswa(filters);
      setData(res || []);
    } catch (error: any) {
      console.error(error);
      message.error('Gagal mengambil laporan presensi kelas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange, kelasId]);

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
      title: 'Tanggal',
      dataIndex: 'tanggal',
      key: 'tanggal',
      width: 150,
      render: (tanggal: string) => {
        if (!tanggal) return '-';
        return new Date(tanggal).toLocaleDateString('id-ID', {
          weekday: 'long', day: '2-digit', month: 'short', year: 'numeric'
        });
      },
      sorter: (a: any, b: any) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime(),
    },
    {
      title: 'Nama Siswa',
      dataIndex: 'siswaName',
      key: 'siswaName',
      ...getColumnSearchProps('siswaName', 'Cari Nama Siswa'),
      sorter: (a: any, b: any) => (a.siswaName || '').localeCompare(b.siswaName || ''),
    },
    {
      title: 'Jenis',
      dataIndex: 'jenis',
      key: 'jenis',
      width: 100,
      filters: [
        { text: 'Harian', value: 'Harian' },
        { text: 'Mapel', value: 'Mapel' },
      ],
      onFilter: (value: any, record: any) => record.jenis === value,
      render: (val: string) => <Tag color={val === 'Harian' ? 'purple' : 'cyan'}>{val}</Tag>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: 'Hadir', value: 'Hadir' },
        { text: 'Izin', value: 'Izin' },
        { text: 'Sakit', value: 'Sakit' },
        { text: 'Alpha', value: 'Alpha' },
      ],
      onFilter: (value: any, record: any) => record.status === value,
      render: (status: string) => {
        let color = 'default';
        if (status === 'Hadir') color = 'green';
        if (status === 'Izin') color = 'blue';
        if (status === 'Sakit') color = 'orange';
        if (status === 'Alpha') color = 'red';
        return <Tag color={color}>{status || '-'}</Tag>;
      }
    },
    {
      title: 'Keterangan',
      dataIndex: 'keterangan',
      key: 'keterangan',
    }
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        Laporan / Absensi / Rekap Kelas / {kelasData?.name || (loading ? 'Memuat kelas...' : 'Kelas tidak ditemukan')}
      </div>

      <ToolbarWrapper>
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => router.back()}
            className="border-0 flex items-center shadow-none hover:opacity-80 px-3"
            style={{ color: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            Kembali
          </Button>
          <RangePicker 
            onChange={(dates) => setDateRange(dates)} 
            format="DD/MM/YYYY"
            placeholder={['Tanggal Mulai', 'Tanggal Akhir']}
          />
        </Space>
        
        <Space className="ml-auto">
          <ButtonToolbar 
            message="Refresh Data" 
            icon={<ReloadOutlined />} 
            loading={loading}
            onClick={handleRefresh}
          />
          <ButtonToolbar 
            message="Cetak Laporan" 
            icon={<PrinterOutlined />} 
            className="bg-green-600 text-white hover:bg-green-700"
            onClick={() => message.info('Fitur cetak laporan kelas akan segera tersedia')}
          />
        </Space>
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
            showTotal: (total, range) => `Menampilkan ${range[0]}-${range[1]} dari ${total} catatan presensi`
          }}
          scroll={{ x: 'max-content', y: 'calc(100vh - 310px)' }}
          loading={loading}
          size="small" bordered 
        />
      </div>
    </div>
  );
}
