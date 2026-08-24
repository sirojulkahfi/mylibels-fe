"use client";

import { useEffect, useState } from 'react';
import { Alert, Card, Table, Tag, Typography, Button } from 'antd';
import { ReloadOutlined, TrophyOutlined } from '@ant-design/icons';
import { bkService } from '@/services/bk/bk.service';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';

const { Title, Text } = Typography;

export default function RekapPrestasiPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const records = await bkService.findAllPrestasi();
      // Ensure we have an array
      const validRecords = Array.isArray(records) ? records : (records?.data || []);
      
      // We will display a flat list of all achievements
      const formatted = validRecords.map((item: any, index: number) => ({
        ...item,
        key: item.id || index,
        siswaName: item.siswa?.name || item.siswaName || item.siswaId || 'Tidak Diketahui',
        kelas: item.siswa?.class || '-',
      }));
      
      // Sort by date (newest first)
      formatted.sort((a: any, b: any) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
      
      setData(formatted);
      setError(false);
    } catch (requestError) {
      console.error(requestError);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getTingkatColor = (tingkat: string) => {
    switch(tingkat?.toLowerCase()) {
      case 'internasional': return 'gold';
      case 'nasional': return 'purple';
      case 'provinsi': return 'blue';
      case 'kota': return 'cyan';
      default: return 'green';
    }
  };

  const columns = [
    { title: 'No.', key: 'no', width: 60, render: (_: any, __: any, index: number) => index + 1, align: 'center' as const },
    { title: 'Tanggal', dataIndex: 'tanggal', key: 'tanggal', width: 120, render: (value: string) => value ? new Date(value).toLocaleDateString('id-ID') : '-' },
    { 
      title: 'Siswa', 
      key: 'siswa', 
      width: 200,
      render: (_: any, record: any) => (
        <div className="flex flex-col">
          <Text strong>{record.siswaName}</Text>
          <Text type="secondary" className="text-xs">Kelas: {record.kelas}</Text>
        </div>
      )
    },
    { 
      title: 'Nama Prestasi', 
      dataIndex: 'namaPrestasi', 
      key: 'namaPrestasi',
      render: (value: string) => <span className="font-medium text-gray-800">{value}</span>
    },
    { 
      title: 'Tingkat', 
      dataIndex: 'tingkat', 
      key: 'tingkat', 
      width: 130,
      align: 'center' as const,
      render: (value: string) => <Tag color={getTingkatColor(value)}>{value}</Tag> 
    },
    { 
      title: 'Poin', 
      dataIndex: 'poinPenghargaan', 
      key: 'poinPenghargaan',
      width: 100,
      align: 'center' as const,
      render: (value: number) => (
        <Tag icon={<TrophyOutlined />} color="gold" className="font-bold">
          +{value || 0}
        </Tag>
      )
    },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">Laporan / Kesiswaan / Rekap Prestasi</div>

      <ToolbarWrapper>
        <div className="flex items-center">
          <TrophyOutlined className="text-xl text-yellow-500 mr-2" />
          <span className="text-white font-bold text-lg">Rekap Prestasi Siswa</span>
        </div>
        <ButtonToolbar 
          message="Refresh Data" 
          icon={<ReloadOutlined />} 
          loading={loading} 
          onClick={fetchData} 
          className="ml-auto"
        />
      </ToolbarWrapper>

      {error && (
        <Alert 
          type="error" 
          showIcon 
          message="Gagal memuat data prestasi" 
          description="Pastikan server terhubung dan coba muat ulang."
          className="mt-2"
        />
      )}

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-4 mt-2 rounded-lg shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="key" 
          loading={loading} 
          pagination={{ pageSize: 15, showSizeChanger: true }} 
          size="small" 
          bordered 
          scroll={{ y: 'calc(100vh - 280px)' }}
          locale={{ emptyText: 'Belum ada data prestasi siswa' }} 
        />
      </div>
    </div>
  );
}
