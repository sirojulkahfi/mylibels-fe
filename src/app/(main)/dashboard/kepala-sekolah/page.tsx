"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Alert, Button, Card, Col, Row, Statistic, Typography } from 'antd';
import { BookOutlined, FileTextOutlined, ReloadOutlined, TeamOutlined, WarningOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/useAuthStore';
import { laporanService } from '@/services/laporan/laporan.service';

const { Title, Text } = Typography;

export default function KepalaSekolahDashboard() {
  const user = useAuthStore((state) => state.user);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 min-h-0 overflow-auto bg-slate-50 p-4 pt-2">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Title level={4} className="!mb-1">Dashboard Kepala Sekolah</Title>
          <Text type="secondary">Ringkasan kinerja dan kondisi operasional SMPN 15 Bandung.</Text>
        </div>
        <Button icon={<ReloadOutlined />} loading={loading} onClick={fetchSummary}>Muat Ulang</Button>
      </div>
      <Card className="border-0 bg-slate-900 text-white shadow-sm">
        <Text className="text-blue-200">KEPALA SEKOLAH</Text>
        <Title level={3} className="!mb-1 !mt-2 !text-white">Selamat datang, {user?.name || user?.username || 'Kepala Sekolah'}</Title>
        <Text className="text-slate-300">Gunakan ringkasan ini untuk memantau indikator sekolah dan membuka laporan detail.</Text>
      </Card>
      {error && <Alert type="error" showIcon message="Ringkasan belum dapat dimuat" description="Periksa koneksi API lalu coba muat ulang." />}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}><Card loading={loading && !summary}><Statistic title="Total Siswa" value={summary?.totalSiswa || 0} prefix={<TeamOutlined className="text-blue-500" />} /></Card></Col>
        <Col xs={24} sm={12} xl={6}><Card loading={loading && !summary}><Statistic title="Guru Aktif" value={summary?.totalGuru || 0} prefix={<BookOutlined className="text-emerald-500" />} /></Card></Col>
        <Col xs={24} sm={12} xl={6}><Card loading={loading && !summary}><Statistic title="Rombel" value={summary?.totalRombel || 0} prefix={<FileTextOutlined className="text-indigo-500" />} /></Card></Col>
        <Col xs={24} sm={12} xl={6}><Card loading={loading && !summary}><Statistic title="Pelanggaran Hari Ini" value={summary?.pelanggaranHariIni || 0} prefix={<WarningOutlined className="text-orange-500" />} /></Card></Col>
      </Row>
      <Card title="Laporan Pimpinan" className="border border-gray-100 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Link href="/laporan/absensi"><Button icon={<TeamOutlined />}>Laporan Absensi</Button></Link>
          <Link href="/laporan/nilai-siswa"><Button icon={<BookOutlined />}>Laporan Nilai</Button></Link>
          <Link href="/laporan/kesiswaan/rekap-poin"><Button icon={<WarningOutlined />}>Rekap Kesiswaan</Button></Link>
          <Link href="/rapor"><Button type="primary" icon={<FileTextOutlined />}>Manajemen Rapor</Button></Link>
        </div>
      </Card>
    </div>
  );
}