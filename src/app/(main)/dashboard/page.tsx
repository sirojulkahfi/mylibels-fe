"use client";

import React from 'react';
import Link from 'next/link';
import { Button, Card, Col, Row, Typography } from 'antd';
import { ArrowRightOutlined, BookOutlined, CheckCircleOutlined, DatabaseOutlined, HeartOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/useAuthStore';

const { Title, Text } = Typography;

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const role = user?.role?.name || 'PENGGUNA';
  const links = [
    { title: 'Data Induk', description: 'Kelola data siswa, guru, kelas, dan fasilitas.', href: '/data-induk/siswa', icon: <DatabaseOutlined className="text-blue-500" /> },
    { title: 'Presensi', description: 'Pantau dan kelola kehadiran sekolah.', href: '/presensi', icon: <CheckCircleOutlined className="text-emerald-500" /> },
    { title: 'Penilaian', description: 'Kelola nilai formatif, sumatif, dan rapor.', href: '/penilaian/formatif', icon: <BookOutlined className="text-indigo-500" /> },
    { title: 'Bimbingan Konseling', description: 'Kelola konseling, prestasi, dan pelanggaran siswa.', href: '/bimbingan-konseling', icon: <HeartOutlined className="text-rose-500" /> },
    { title: 'Rapor', description: 'Validasi, catatan, dan pencetakan rapor siswa.', href: '/rapor', icon: <BookOutlined className="text-cyan-500" /> },
    { title: 'Pengaturan', description: 'Atur konfigurasi dan pengguna sistem.', href: '/pengaturan/settings', icon: <SettingOutlined className="text-orange-500" /> },
  ];

  return (
    <div className="flex flex-1 flex-col gap-5 bg-slate-50 p-4 pt-2 overflow-auto">
      <Card className="border-0 bg-gradient-to-r from-slate-900 to-blue-900 text-white shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Text className="text-blue-200">{role.replaceAll('_', ' ')}</Text>
            <Title level={2} className="!mb-1 !mt-2 !text-white">Selamat datang, {user?.name || user?.username || 'Pengguna'}</Title>
            <Text className="text-slate-200">Pilih modul untuk melanjutkan pekerjaan Anda di myLibels.</Text>
          </div>
          <Link href="/laporan/absensi"><Button ghost icon={<ArrowRightOutlined />}>Buka Laporan</Button></Link>
        </div>
      </Card>

      <div>
        <Title level={4} className="!mb-1">Akses Modul</Title>
        <Text type="secondary">Modul yang tersedia sesuai dengan akses akun Anda.</Text>
      </div>
      <Row gutter={[16, 16]}>
        {links.map((link) => (
          <Col xs={24} sm={12} xl={6} key={link.title}>
            <Link href={link.href} className="block h-full">
              <Card hoverable className="h-full border border-gray-100 shadow-sm">
                <div className="mb-3 text-2xl">{link.icon}</div>
                <Title level={5} className="!mb-1">{link.title}</Title>
                <Text type="secondary">{link.description}</Text>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}
