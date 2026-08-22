"use client";

import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Statistic, Breadcrumb, Spin } from 'antd';
import { 
  TeamOutlined, 
  UserOutlined, 
  ScanOutlined, 
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

import { presensiService } from '@/services/presensi/presensi.service';
import { guruStafService } from '@/services/data-induk/guru-staf.service';
import { siswaService } from '@/services/data-induk/siswa.service';

const { Title, Text } = Typography;

export default function PresensiDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSiswa: 0,
    siswaHadir: 0,
    siswaSakitIzin: 0,
    siswaAlpha: 0,
    totalGuru: 0,
    guruHadir: 0,
    persenSiswa: 0,
    persenGuru: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Ambil data siswa total
        const allSiswa = await siswaService.findAll().catch(() => []);
        const totalSiswa = (allSiswa || []).length;

        // Ambil data guru total
        const allGuru = await guruStafService.findAll().catch(() => []);
        const totalGuru = (allGuru || []).length;

        // Ambil rekap harian siswa
        const rekapHarian = await presensiService.getRekapHarianSiswa().catch(() => []);
        let siswaHadir = 0;
        let siswaSakitIzin = 0;
        let siswaAlpha = 0;

        if (rekapHarian && rekapHarian.length > 0) {
          rekapHarian.forEach((r: any) => {
            siswaHadir += r.hadir || 0;
            siswaAlpha += r.absen || 0;
          });
          siswaSakitIzin = totalSiswa - siswaHadir - siswaAlpha;
          if (siswaSakitIzin < 0) siswaSakitIzin = 0;
        }

        // Ambil presensi guru hari ini
        const presensiGuru = await presensiService.findAllGuru().catch(() => []);
        const today = new Date().toISOString().split('T')[0];
        const guruHariIni = (presensiGuru || []).filter((p: any) => p.tanggal?.startsWith(today));
        const guruHadir = guruHariIni.filter((p: any) => p.status === 'Hadir').length;

        const persenSiswa = totalSiswa > 0 ? Math.round((siswaHadir / totalSiswa) * 100) : 0;
        const persenGuru = totalGuru > 0 ? Math.round((guruHadir / totalGuru) * 100) : 0;

        setStats({
          totalSiswa,
          siswaHadir,
          siswaSakitIzin,
          siswaAlpha,
          totalGuru,
          guruHadir,
          persenSiswa,
          persenGuru,
        });
      } catch (error) {
        console.error("Gagal memuat statistik presensi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickLinks = [
    { title: 'Presensi Harian', desc: 'Isi kehadiran kelas', icon: <TeamOutlined />, color: 'bg-blue-500', link: '/presensi/harian-siswa' },
    { title: 'Presensi Mapel', desc: 'Kehadiran per pelajaran', icon: <ClockCircleOutlined />, color: 'bg-purple-500', link: '/presensi/mapel-siswa' },
    { title: 'Scan Barcode', desc: 'Check-in otomatis', icon: <ScanOutlined />, color: 'bg-indigo-500', link: '/presensi/scan' },
    { title: 'Perizinan', desc: 'Data sakit & izin', icon: <FileTextOutlined />, color: 'bg-orange-500', link: '/presensi/perizinan' },
    { title: 'Presensi Guru', desc: 'Rekap kehadiran staf', icon: <UserOutlined />, color: 'bg-emerald-500', link: '/presensi/presensi-guru' },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-6 relative">
      <div className="mb-4">
        <Breadcrumb items={[
          { title: 'Presensi' },
          { title: 'Dashboard' },
        ]} />
      </div>

      <div className="flex justify-between items-end mb-6">
        <div>
          <Title level={2} className="!m-0 text-gray-800">Dashboard Presensi</Title>
          <Text className="text-gray-500">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </div>
      </div>

      {/* Statistics Cards */}
      <Spin spinning={loading}>
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} md={6}>
            <Card className="shadow-sm border-0 bg-white rounded-xl">
              <Statistic 
                title={<span className="text-gray-500 font-medium">Siswa Hadir</span>} 
                value={stats.siswaHadir} 
                suffix={`/ ${stats.totalSiswa}`} 
                valueStyle={{ color: '#10b981', fontWeight: 'bold' }} 
                prefix={<CheckCircleOutlined />} 
              />
              <div className="text-xs text-gray-400 mt-2">{stats.persenSiswa}% Kehadiran hari ini</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="shadow-sm border-0 bg-white rounded-xl">
              <Statistic 
                title={<span className="text-gray-500 font-medium">Siswa Sakit/Izin</span>} 
                value={stats.siswaSakitIzin} 
                valueStyle={{ color: '#f59e0b', fontWeight: 'bold' }} 
                prefix={<FileTextOutlined />} 
              />
              <div className="text-xs text-gray-400 mt-2">Hari ini</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="shadow-sm border-0 bg-white rounded-xl">
              <Statistic 
                title={<span className="text-gray-500 font-medium">Siswa Alpha</span>} 
                value={stats.siswaAlpha} 
                valueStyle={{ color: '#ef4444', fontWeight: 'bold' }} 
                prefix={<CloseCircleOutlined />} 
              />
              <div className="text-xs text-gray-400 mt-2">Perlu tindak lanjut BK</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="shadow-sm border-0 bg-white rounded-xl">
              <Statistic 
                title={<span className="text-gray-500 font-medium">Kehadiran Guru</span>} 
                value={stats.guruHadir} 
                suffix={`/ ${stats.totalGuru}`} 
                valueStyle={{ color: '#3b82f6', fontWeight: 'bold' }} 
                prefix={<UserOutlined />} 
              />
              <div className="text-xs text-gray-400 mt-2">{stats.persenGuru}% Kehadiran hari ini</div>
            </Card>
          </Col>
        </Row>
      </Spin>

      <Title level={4} className="text-gray-700 mb-4">Akses Cepat</Title>
      <Row gutter={[16, 16]}>
        {quickLinks.map((item, index) => (
          <Col xs={24} sm={12} md={8} lg={4} key={index}>
            <Card 
              hoverable 
              className="h-full border-0 shadow-sm rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => router.push(item.link)}
              styles={{ body: { padding: 0 } }}
            >
              <div className="p-5 flex flex-col items-center justify-center text-center h-full transition-colors group-hover:bg-slate-50">
                <div className={`w-12 h-12 rounded-full ${item.color} text-white flex items-center justify-center text-xl mb-3 shadow-sm`}>
                  {item.icon}
                </div>
                <div className="font-bold text-gray-800 mb-1">{item.title}</div>
                <div className="text-xs text-gray-500 leading-tight">{item.desc}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
