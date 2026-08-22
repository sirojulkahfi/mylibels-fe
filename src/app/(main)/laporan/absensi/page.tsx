"use client";

import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Statistic, Breadcrumb } from 'antd';
import { 
  TeamOutlined,
  UserOutlined,
  BankOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { kelasService } from '@/services/data-induk/kelas.service';

const { Title, Text } = Typography;

export default function LaporanAbsensiDashboard() {
  const router = useRouter();
  const [defaultKelasId, setDefaultKelasId] = useState('');

  useEffect(() => {
    kelasService.findAll().then(res => {
      if (res && res.length > 0) setDefaultKelasId(res[0].id);
    }).catch(console.error);
  }, []);

  const menuItems = [
    {
      title: 'Rekap Absensi Siswa',
      description: 'Laporan detail kehadiran per siswa',
      icon: <UserOutlined className="text-4xl text-blue-500" />,
      path: '/laporan/absensi/rekap-siswa', // In a real app this would go to a list first
      bgClass: 'bg-blue-50',
    },
    {
      title: 'Rekap Absensi Kelas',
      description: 'Laporan akumulasi kehadiran per kelas',
      icon: <BankOutlined className="text-4xl text-emerald-500" />,
      path: `/laporan/absensi/rekap-kelas/${defaultKelasId}`,
      bgClass: 'bg-emerald-50',
    },
    {
      title: 'Rekap Absensi Guru',
      description: 'Laporan tingkat kehadiran mengajar guru',
      icon: <TeamOutlined className="text-4xl text-purple-500" />,
      path: '/laporan/absensi/rekap-guru',
      bgClass: 'bg-purple-50',
    }
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: <Link href="/laporan">Laporan Akademik</Link> },
          { title: 'Absensi' },
        ]} />
      </div>

      <div className="mb-4">
        <Title level={4} className="m-0 text-gray-800">Laporan Absensi</Title>
        <Text className="text-gray-500">Pilih jenis laporan absensi yang ingin Anda tinjau.</Text>
      </div>

      <Row gutter={[16, 16]}>
        {menuItems.map((item, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card 
              hoverable 
              className={`h-full border border-gray-100 shadow-sm rounded-xl overflow-hidden transition-all hover:shadow-md hover:border-blue-200 cursor-pointer`}
              styles={{ body: { padding: '24px' } }}
              onClick={() => {
                if (item.path.includes('undefined') || item.path.endsWith('/')) return;
                router.push(item.path);
              }}
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
