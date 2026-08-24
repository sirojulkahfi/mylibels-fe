"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, Empty, Table, Tag, Typography } from 'antd';
import { ArrowRightOutlined, ReloadOutlined } from '@ant-design/icons';
import { raporService } from '@/services/rapor/rapor.service';
import ButtonToolbar from '@/components/ui/ButtonToolbar';

const { Title, Text } = Typography;

export default function ArsipRaporPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try { setData(await raporService.getArsipRapor() || []); } catch (error) { console.error(error); setData([]); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const columns = [
    { title: 'Tahun Ajaran', dataIndex: 'tahunAjaranName', key: 'tahunAjaranName' },
    { title: 'Kelas', dataIndex: 'kelasName', key: 'kelasName' },
    { title: 'Semester', dataIndex: 'semester', key: 'semester' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (value: string) => <Tag color={value === 'Terkunci' ? 'green' : 'orange'}>{value}</Tag> },
    { title: 'Terakhir Diubah', dataIndex: 'updatedAt', key: 'updatedAt', render: (value: string) => value ? new Date(value).toLocaleDateString('id-ID') : '-' },
    { title: 'Aksi', key: 'action', render: (_: any, record: any) => <Link href={`/laporan/rapor/arsip/${record.tahunAjaran}`}><ButtonToolbar message="Detail" icon={<ArrowRightOutlined />} /></Link> },
  ];

  return <div className="flex flex-1 flex-col gap-4 bg-slate-50 p-4 pt-2 overflow-auto">
    <div className="flex items-end justify-between"><div><Title level={4} className="!mb-1">Arsip Rapor</Title><Text type="secondary">Daftar status rapor yang tersimpan per kelas dan tahun ajaran.</Text></div><ButtonToolbar message="Muat Ulang" icon={<ReloadOutlined />} loading={loading} onClick={fetchData} /></div>
    <Card className="border border-gray-100 shadow-sm"><Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={{ pageSize: 15 }} size="small" bordered locale={{ emptyText: <Empty description="Belum ada arsip rapor" /> }} /></Card>
  </div>;
}