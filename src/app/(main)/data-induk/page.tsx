"use client";

import React from 'react';
import { Typography, Row, Col, Card, Breadcrumb } from 'antd';
import { 
  TeamOutlined,
  IdcardOutlined,
  BankOutlined,
  BookOutlined,
  AppstoreOutlined,
  TrophyOutlined,
  SolutionOutlined,
  ReadOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function DataIndukDashboard() {
  const router = useRouter();

  const menuItems = [
    {
      title: 'Data Siswa',
      description: 'Kelola data profil, status, dan mutasi siswa aktif.',
      icon: <TeamOutlined className="text-4xl text-blue-500" />,
      path: '/data-induk/siswa',
      bgClass: 'bg-blue-50',
    },
    {
      title: 'Data Guru & Staf',
      description: 'Kelola direktori tenaga pendidik dan kependidikan.',
      icon: <IdcardOutlined className="text-4xl text-emerald-500" />,
      path: '/data-induk/guru-staf',
      bgClass: 'bg-emerald-50',
    },
    {
      title: 'Data Kelas',
      description: 'Manajemen data kelas dan pembagian rombel.',
      icon: <BankOutlined className="text-4xl text-purple-500" />,
      path: '/data-induk/kelas',
      bgClass: 'bg-purple-50',
    },
    {
      title: 'Mata Pelajaran',
      description: 'Kelola daftar mata pelajaran dan muatan kurikulum.',
      icon: <BookOutlined className="text-4xl text-orange-500" />,
      path: '/data-induk/mata-pelajaran',
      bgClass: 'bg-orange-50',
    },
    {
      title: 'Wali Kelas',
      description: 'Penugasan guru sebagai wali untuk setiap kelas.',
      icon: <SolutionOutlined className="text-4xl text-cyan-500" />,
      path: '/data-induk/wali-kelas',
      bgClass: 'bg-cyan-50',
    },
    {
      title: 'Ekstrakurikuler',
      description: 'Manajemen program kegiatan ekstrakurikuler.',
      icon: <TrophyOutlined className="text-4xl text-yellow-500" />,
      path: '/data-induk/ekstrakurikuler',
      bgClass: 'bg-yellow-50',
    },
    {
      title: 'Data Ruangan',
      description: 'Kelola data fasilitas fisik dan ruangan sekolah.',
      icon: <AppstoreOutlined className="text-4xl text-indigo-500" />,
      path: '/data-induk/ruangan',
      bgClass: 'bg-indigo-50',
    },
    {
      title: 'Data Alumni',
      description: 'Arsip data siswa yang telah lulus (alumni).',
      icon: <ReadOutlined className="text-4xl text-pink-500" />,
      path: '/data-induk/alumni',
      bgClass: 'bg-pink-50',
    }
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: 'Data Induk' },
        ]} />
      </div>

      <div className="mb-4">
        <Title level={4} className="m-0 text-gray-800">Master Data Induk</Title>
        <Text className="text-gray-500">Pilih modul data induk yang ingin Anda kelola.</Text>
      </div>

      <Row gutter={[16, 16]}>
        {menuItems.map((item, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Card 
              hoverable 
              className={`h-full border border-gray-100 shadow-sm rounded-xl overflow-hidden transition-all hover:shadow-md hover:border-blue-200 cursor-pointer`}
              styles={{ body: { padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' } }}
              onClick={() => router.push(item.path)}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className={`p-4 rounded-full ${item.bgClass}`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 m-0 mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm m-0">{item.description}</p>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
