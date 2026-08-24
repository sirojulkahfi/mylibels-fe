"use client";

import React, { useState, useEffect, use } from 'react';
import { Table, Tag, Space, App, DatePicker, Button } from 'antd';
import { ReloadOutlined, PrinterOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { presensiService } from '@/services/presensi/presensi.service';
import { siswaService } from '@/services/data-induk/siswa.service';

const { RangePicker } = DatePicker;

export default function LaporanRekapSiswaPage({ params }: { params: Promise<{ siswaId: string }> }) {
  const { message } = App.useApp();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [siswaData, setSiswaData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<any>(null);

  const unwrappedParams = use(params);
  const siswaId = unwrappedParams.siswaId;

  const fetchData = async () => {
    try {
      setLoading(true);
      const filters: any = { siswaId: siswaId };
      if (dateRange && dateRange.length === 2) {
        filters.startDate = dateRange[0].format('YYYY-MM-DD');
        filters.endDate = dateRange[1].format('YYYY-MM-DD');
      }
      
      // Ambil detail siswa
      const resSiswa = await siswaService.findOne(siswaId).catch(() => null);
      if (resSiswa) setSiswaData(resSiswa);
      
      const res = await presensiService.findAllSiswa(filters);
      setData(res || []);
    } catch (error: any) {
      console.error(error);
      message.error('Gagal mengambil laporan presensi siswa');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange, siswaId]);

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
      title: 'Jenis Presensi',
      dataIndex: 'jenis',
      key: 'jenis',
      width: 130,
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
      <div className="mb-2 text-gray-500 text-sm">Laporan / Absensi / Detail Siswa / {siswaData?.name || siswaId}</div>

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
            onClick={() => message.info('Fitur cetak laporan siswa akan segera tersedia')}
          />
        </Space>
      </ToolbarWrapper>

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-1 mt-1 rounded-lg shadow-sm border border-gray-100">
        <div className="mb-4 pt-2 px-2 pb-2 border-b border-gray-100">
          <div className="text-lg font-semibold text-gray-800">{siswaData?.name || 'Loading...'}</div>
          <div className="text-sm text-gray-500 mt-1">NIS: {siswaData?.nis || '-'} • NISN: {siswaData?.nisn || '-'} • Kelas: {siswaData?.class || '-'}</div>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          pagination={{ 
            defaultPageSize: 10, 
            showSizeChanger: true, 
            hideOnSinglePage: false, 
            showTotal: (total, range) => `Menampilkan ${range[0]}-${range[1]} dari ${total} catatan presensi`
          }}
          scroll={{ x: 'max-content', y: 'calc(100vh - 350px)' }}
          loading={loading}
          size="small" bordered 
        />
      </div>
    </div>
  );
}
