"use client";

import { useEffect, useState } from 'react';
import { Alert, Card, Col, Row, Statistic, Table, Tag, Typography } from 'antd';
import { BookOutlined, CheckCircleOutlined, FileTextOutlined, WarningOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { penilaianService } from '@/services/penilaian/penilaian.service';
import { presensiService } from '@/services/presensi/presensi.service';

const { Title, Text } = Typography;

export default function SiswaDashboard() {
  const user = useAuthStore((state) => state.user);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.siswa?.id) {
        setLoading(false);
        return;
      }
      try {
        const [attendanceData, formative, summative] = await Promise.all([
          presensiService.findAllSiswa({ siswaId: user.siswa.id }),
          penilaianService.findAllFormatif({ siswaId: user.siswa.id }),
          penilaianService.findAllSumatif({ siswaId: user.siswa.id }),
        ]);
        setAttendance(attendanceData || []);
        setGrades([...(formative || []), ...(summative || [])]);
      } catch (requestError) {
        console.error(requestError);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user?.siswa?.id]);

  const present = attendance.filter((item) => item.status === 'Hadir').length;
  const absent = attendance.filter((item) => ['Alpha', 'Sakit', 'Izin'].includes(item.status)).length;
  const average = grades.length ? grades.reduce((sum, item) => sum + Number(item.nilai || 0), 0) / grades.length : 0;
  const gradeColumns = [
    { title: 'Materi', dataIndex: 'materi', key: 'materi', render: (value: string) => value || '-' },
    { title: 'Semester', dataIndex: 'semester', key: 'semester', render: (value: string) => value || '-' },
    { title: 'Nilai', dataIndex: 'nilai', key: 'nilai', render: (value: number) => <strong>{value ?? '-'}</strong> },
  ];

  return (
    <div className="flex flex-1 flex-col min-h-0 gap-4 bg-slate-50 p-4 pt-2 overflow-auto">
      <div><Title level={4} className="!mb-1">Dashboard Siswa</Title><Text type="secondary">Halo, {user?.name || user?.username || 'Siswa'}. Pantau perkembanganmu di sini.</Text></div>
      {error && <Alert type="warning" showIcon message="Sebagian data belum dapat dimuat" description="Coba muat ulang halaman beberapa saat lagi." />}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}><Card loading={loading}><Statistic title="Hadir" value={present} prefix={<CheckCircleOutlined className="text-emerald-500" />} /></Card></Col>
        <Col xs={24} sm={12} xl={6}><Card loading={loading}><Statistic title="Tidak Hadir" value={absent} prefix={<WarningOutlined className="text-orange-500" />} /></Card></Col>
        <Col xs={24} sm={12} xl={6}><Card loading={loading}><Statistic title="Rata-rata Nilai" value={average} precision={1} prefix={<BookOutlined className="text-blue-500" />} /></Card></Col>
        <Col xs={24} sm={12} xl={6}><Card loading={loading}><Statistic title="Total Penilaian" value={grades.length} prefix={<FileTextOutlined className="text-indigo-500" />} /></Card></Col>
      </Row>
      <Card title="Nilai Terbaru" className="border border-gray-100 shadow-sm">
        <Table columns={gradeColumns} dataSource={grades.slice(0, 8)} rowKey="id" loading={loading} pagination={false} size="small" locale={{ emptyText: 'Belum ada nilai' }} />
      </Card>
      <div className="flex flex-wrap gap-2">
        <Link href="/rapor"><Tag color="blue" className="cursor-pointer px-3 py-1">Lihat Rapor</Tag></Link>
        <Link href="/presensi"><Tag color="green" className="cursor-pointer px-3 py-1">Riwayat Presensi</Tag></Link>
        <Link href="/bimbingan-konseling"><Tag color="orange" className="cursor-pointer px-3 py-1">Bimbingan Konseling</Tag></Link>
      </div>
    </div>
  );
}
