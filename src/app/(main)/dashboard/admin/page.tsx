"use client";

import React from 'react';
import { Card, Row, Col, Statistic, Typography, Alert, Button, Space, Spin } from 'antd';
import { TeamOutlined, UserOutlined, BookOutlined, ArrowRightOutlined, ReloadOutlined, WarningOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { laporanService } from '@/services/laporan/laporan.service';

const { Title, Text } = Typography;

export default function AdminDashboard() {
  const [summary, setSummary] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    setError(false);
    try {
      setSummary(await laporanService.getDashboardSummary());
    } catch (requestError) {
      console.error(requestError);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSummary();
  }, []);

  const statCards = [
    { title: 'Total Siswa', value: summary?.totalSiswa || 0, icon: <TeamOutlined />, color: 'text-blue-500' },
    { title: 'Guru Aktif', value: summary?.totalGuru || 0, icon: <UserOutlined />, color: 'text-emerald-500' },
    { title: 'Total Kelas', value: summary?.totalRombel || 0, icon: <BookOutlined />, color: 'text-indigo-500' },
    { title: 'Pelanggaran Hari Ini', value: summary?.pelanggaranHariIni || 0, icon: <WarningOutlined />, color: 'text-orange-500' },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
        <Title level={4} className="m-0 text-gray-800">Dashboard Admin</Title>
        <Text className="text-gray-500">Ringkasan operasional sekolah hari ini.</Text>
        </div>
        <Button icon={<ReloadOutlined />} loading={loading} onClick={fetchSummary}>Muat Ulang</Button>
      </div>

      {error && <Alert className="mb-4" type="error" showIcon message="Ringkasan belum dapat dimuat" description="Periksa koneksi API lalu coba muat ulang." action={<Button size="small" onClick={fetchSummary}>Coba Lagi</Button>} />}

      <Row gutter={[16, 16]}>
        {statCards.map((stat) => (
          <Col xs={24} sm={12} xl={6} key={stat.title}>
            <Card className="h-full border border-gray-100 shadow-sm" loading={loading && !summary}>
              <Statistic title={stat.title} value={stat.value} prefix={<span className={stat.color}>{stat.icon}</span>} />
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="Akses Cepat" className="mt-4 border border-gray-100 shadow-sm" extra={<Text type="secondary">Modul administrasi</Text>}>
        <Space wrap>
          <Link href="/data-induk/siswa"><Button icon={<TeamOutlined />}>Data Siswa</Button></Link>
          <Link href="/data-induk/guru-staf"><Button icon={<UserOutlined />}>Guru & Staf</Button></Link>
          <Link href="/presensi"><Button icon={<BookOutlined />}>Presensi</Button></Link>
          <Link href="/laporan/absensi"><Button type="primary" icon={<ArrowRightOutlined />}>Lihat Laporan</Button></Link>
        </Space>
      </Card>
    </div>
  );
}
