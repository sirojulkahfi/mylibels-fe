"use client";

import { useEffect, useState } from 'react';
import { Alert, Card, Col, Row, Statistic, Table, Tag, Typography } from 'antd';
import { CheckCircleOutlined, TeamOutlined, WarningOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { presensiService } from '@/services/presensi/presensi.service';

const { Title, Text } = Typography;

export default function WaliKelasDashboard() {
  const user = useAuthStore((state) => state.user);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        setClasses(await presensiService.getRekapHarianSiswa(new Date().toISOString().slice(0, 10)) || []);
      } catch (requestError) {
        console.error(requestError);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadClasses();
  }, []);

  const ownClasses = classes.filter((item) => !user?.name || item.waliKelas === user.name);
  const displayedClasses = ownClasses.length ? ownClasses : classes;
  const totalStudents = displayedClasses.reduce((sum, item) => sum + Number(item.totalSiswa || 0), 0);
  const present = displayedClasses.reduce((sum, item) => sum + Number(item.hadir || 0), 0);
  const absent = displayedClasses.reduce((sum, item) => sum + Number(item.absen || 0), 0);
  const columns = [
    { title: 'Kelas', dataIndex: 'name', key: 'name', render: (value: string) => <strong>{value}</strong> },
    { title: 'Wali Kelas', dataIndex: 'waliKelas', key: 'waliKelas' },
    { title: 'Total Siswa', dataIndex: 'totalSiswa', key: 'totalSiswa' },
    { title: 'Hadir', dataIndex: 'hadir', key: 'hadir', render: (value: number) => <span className="text-emerald-600">{value || 0}</span> },
    { title: 'Alpha', dataIndex: 'absen', key: 'absen', render: (value: number) => <span className="text-red-600">{value || 0}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (value: string) => <Tag color={value === 'Selesai' ? 'green' : 'orange'}>{value || '-'}</Tag> },
  ];

  return (
    <div className="flex flex-1 flex-col min-h-0 gap-4 bg-slate-50 p-4 pt-2 overflow-auto">
      <div><Title level={4} className="!mb-1">Dashboard Wali Kelas</Title><Text type="secondary">Pantau kehadiran kelas yang menjadi tanggung jawab Anda.</Text></div>
      {error && <Alert type="error" showIcon message="Rekap kelas belum dapat dimuat" description="Periksa koneksi API lalu coba buka kembali halaman ini." />}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}><Card loading={loading}><Statistic title="Total Siswa" value={totalStudents} prefix={<TeamOutlined className="text-blue-500" />} /></Card></Col>
        <Col xs={24} sm={8}><Card loading={loading}><Statistic title="Hadir Hari Ini" value={present} prefix={<CheckCircleOutlined className="text-emerald-500" />} /></Card></Col>
        <Col xs={24} sm={8}><Card loading={loading}><Statistic title="Alpha Hari Ini" value={absent} prefix={<WarningOutlined className="text-red-500" />} /></Card></Col>
      </Row>
      <Card title="Rekap Kehadiran Hari Ini" extra={<Link href="/presensi/harian-siswa">Buka Presensi</Link>} className="border border-gray-100 shadow-sm">
        <Table columns={columns} dataSource={displayedClasses} rowKey="id" loading={loading} pagination={false} size="small" scroll={{ x: 650 }} locale={{ emptyText: 'Belum ada rekap kelas' }} />
      </Card>
      <div className="flex flex-wrap gap-2">
        <Link href="/penilaian/catatan-wali-kelas"><Tag color="blue" className="cursor-pointer px-3 py-1">Catatan Wali Kelas</Tag></Link>
        <Link href="/laporan/absensi"><Tag color="green" className="cursor-pointer px-3 py-1">Laporan Absensi</Tag></Link>
        <Link href="/bimbingan-konseling/poin-pelanggaran"><Tag color="orange" className="cursor-pointer px-3 py-1">Poin Pelanggaran</Tag></Link>
      </div>
    </div>
  );
}
