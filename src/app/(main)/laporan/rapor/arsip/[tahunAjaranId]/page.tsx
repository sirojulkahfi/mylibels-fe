"use client";

import { use, useEffect, useState } from 'react';
import { Card, Table, Tag, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { raporService } from '@/services/rapor/rapor.service';
import { siswaService } from '@/services/data-induk/siswa.service';
import { kelasService } from '@/services/data-induk/kelas.service';
import ButtonToolbar from '@/components/ui/ButtonToolbar';

const { Title, Text } = Typography;

export default function ArsipRaporDetailPage({ params }: { params: Promise<{ tahunAjaranId: string }> }) {
  const { tahunAjaranId } = use(params);
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [archive, students, classes] = await Promise.all([
          raporService.getArsipRapor(),
          siswaService.findAll(),
          kelasService.findAll(),
        ]);
        const records = Array.isArray(archive) ? archive : [];
        const matchingStatuses = records.filter((item) => item.tahunAjaran === tahunAjaranId);
        setStatuses(matchingStatuses);
        const classNames = new Set(matchingStatuses.map((item) => item.kelasName));
        const classStudents = (students?.data || students || []).filter((student: any) => classNames.has(student.class));
        setData(classStudents);
        void classes;
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    loadData();
  }, [tahunAjaranId]);

  const columns = [
    { title: 'No.', key: 'no', width: 60, render: (_: any, __: any, index: number) => index + 1 },
    { title: 'Nama Siswa', dataIndex: 'name', key: 'name' },
    { title: 'NISN', dataIndex: 'nisn', key: 'nisn' },
    { title: 'Kelas', dataIndex: 'class', key: 'class' },
    { title: 'Status Arsip', key: 'status', render: (_: any, record: any) => {
      const status = statuses.find((item) => item.kelasName === record.class)?.status;
      return <Tag color={status === 'Terkunci' ? 'green' : 'orange'}>{status || 'Belum Ada Status'}</Tag>;
    } },
  ];

  return <div className="flex flex-1 flex-col gap-4 bg-slate-50 p-4 pt-2 overflow-auto">
    <div className="flex items-center gap-3"><ButtonToolbar message="Kembali" icon={<ArrowLeftOutlined />} onClick={() => router.back()} /><div><Title level={4} className="!mb-1">Detail Arsip Rapor</Title><Text type="secondary">Tahun ajaran: {tahunAjaranId}</Text></div></div>
    <Card className="border border-gray-100 shadow-sm"><Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={{ pageSize: 15 }} size="small" bordered /></Card>
  </div>;
}
