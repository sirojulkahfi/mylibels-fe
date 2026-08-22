"use client";

import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Breadcrumb } from 'antd';
import { 
  CalendarOutlined,
  UserOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { kelasService } from '@/services/data-induk/kelas.service';
import { guruStafService } from '@/services/data-induk/guru-staf.service';

const { Title, Text } = Typography;

export default function AkademikJadwalDashboard() {
  const router = useRouter();
  const [defaultKelasId, setDefaultKelasId] = useState('');
  const [defaultGuruId, setDefaultGuruId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kelasRes, guruRes] = await Promise.all([
          kelasService.findAll(),
          guruStafService.findAll()
        ]);
        if (kelasRes && kelasRes.length > 0) {
          setDefaultKelasId(kelasRes[0].id);
        }
        if (guruRes && guruRes.length > 0) {
          setDefaultGuruId(guruRes[0].id);
        }
      } catch (err) {
        console.error("Failed to load default IDs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const menuItems = [
    {
      title: 'Jadwal Rombongan Belajar',
      description: 'Atur jadwal pelajaran per rombel (kelas)',
      icon: <CalendarOutlined className="text-4xl text-blue-500" />,
      path: `/akademik/jadwal-pelajaran/rombel/${defaultKelasId}`,
      bgClass: 'bg-blue-50',
    },
    {
      title: 'Jadwal Mengajar Guru',
      description: 'Lihat jadwal spesifik untuk satu guru',
      icon: <UserOutlined className="text-4xl text-purple-500" />,
      path: `/akademik/jadwal-pelajaran/guru/${defaultGuruId}`,
      bgClass: 'bg-purple-50',
    },
    {
      title: 'Plot Jadwal Otomatis (Beta)',
      description: 'Susun jadwal secara otomatis dengan AI',
      icon: <ThunderboltOutlined className="text-4xl text-amber-500" />,
      path: '/akademik/jadwal-pelajaran/plot-otomatis',
      bgClass: 'bg-amber-50',
    }
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: 'Akademik' },
          { title: 'Jadwal Pelajaran' },
        ]} />
      </div>

      <div className="mb-4">
        <Title level={4} className="m-0 text-gray-800">Manajemen Jadwal Pelajaran</Title>
        <Text className="text-gray-500">Pilih mode pengaturan jadwal pelajaran sesuai kebutuhan Anda.</Text>
      </div>

      <Row gutter={[16, 16]}>
        {menuItems.map((item, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card 
              hoverable 
              className={`h-full border border-gray-100 shadow-sm rounded-xl overflow-hidden transition-all hover:shadow-md hover:border-blue-200 cursor-pointer`}
              styles={{ body: { padding: '24px' } }}
              onClick={() => {
                if (item.path.includes('undefined') || item.path.endsWith('/')) {
                   // don't navigate if id is empty
                   return;
                }
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
