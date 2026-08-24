"use client";

import { useEffect, useState } from 'react';
import { Alert, Card, Table, Tag, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { bkService } from '@/services/bk/bk.service';
import ButtonToolbar from '@/components/ui/ButtonToolbar';

const { Title, Text } = Typography;

export default function RekapPoinPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const records = await bkService.findAllPelanggaran();
      const grouped = Object.values((records || []).reduce((result: Record<string, any>, item: any) => {
        const key = item.siswaId;
        if (!result[key]) result[key] = { siswaId: key, siswaName: item.siswa?.name || item.siswaName || key, totalPoin: 0, jumlahKasus: 0, terakhir: item.tanggal };
        result[key].totalPoin += Number(item.poin || 0);
        result[key].jumlahKasus += 1;
        if (new Date(item.tanggal).getTime() > new Date(result[key].terakhir).getTime()) result[key].terakhir = item.tanggal;
        return result;
      }, {}));
      setData(grouped);
    } catch (requestError) {
      console.error(requestError);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const columns = [
    { title: 'No.', key: 'no', width: 60, render: (_: any, __: any, index: number) => index + 1 },
    { title: 'Siswa', dataIndex: 'siswaName', key: 'siswaName', render: (value: string) => <Text strong>{value}</Text> },
    { title: 'Total Poin', dataIndex: 'totalPoin', key: 'totalPoin', render: (value: number) => <Tag color={value >= 20 ? 'red' : value >= 10 ? 'orange' : 'blue'}>{value} poin</Tag> },
    { title: 'Jumlah Kasus', dataIndex: 'jumlahKasus', key: 'jumlahKasus' },
    { title: 'Pelanggaran Terakhir', dataIndex: 'terakhir', key: 'terakhir', render: (value: string) => value ? new Date(value).toLocaleDateString('id-ID') : '-' },
  ];

  return <div className="flex flex-1 flex-col gap-4 bg-slate-50 p-4 pt-2 overflow-auto">
    <div className="flex items-end justify-between"><div><Title level={4} className="!mb-1">Rekap Poin Kesiswaan</Title><Text type="secondary">Ringkasan poin pelanggaran siswa dari data BK.</Text></div><ButtonToolbar message="Muat Ulang" icon={<ReloadOutlined />} loading={loading} onClick={fetchData} /></div>
    {error && <Alert type="error" showIcon message="Data poin belum dapat dimuat" />}
    <Card className="border border-gray-100 shadow-sm"><Table columns={columns} dataSource={data} rowKey="siswaId" loading={loading} pagination={{ pageSize: 15, showSizeChanger: true }} size="small" bordered locale={{ emptyText: 'Belum ada data pelanggaran' }} /></Card>
  </div>;
}
