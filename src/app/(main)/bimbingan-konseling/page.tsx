"use client";

import React from 'react';
import { Typography, Row, Col, Card, Statistic, Breadcrumb } from 'antd';
import { 
  FileTextOutlined,
  WarningOutlined,
  TrophyOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function BimbinganKonselingDashboard() {
  const router = useRouter();

  const menuItems = [
    {
      title: 'Catatan Konseling',
      description: 'Rekam jejak bimbingan konseling per siswa',
      icon: <HeartOutlined className="text-4xl text-rose-500" />,
      path: '/bimbingan-konseling/konseling',
      bgClass: 'bg-rose-50',
    },
    {
      title: 'Poin Pelanggaran',
      description: 'Manajemen poin kedisiplinan dan tata tertib',
      icon: <WarningOutlined className="text-4xl text-orange-500" />,
      path: '/bimbingan-konseling/poin-pelanggaran',
      bgClass: 'bg-orange-50',
    },
    {
      title: 'Prestasi Siswa',
      description: 'Catatan penghargaan dan prestasi non-akademik',
      icon: <TrophyOutlined className="text-4xl text-emerald-500" />,
      path: '/bimbingan-konseling/prestasi',
      bgClass: 'bg-emerald-50',
    }
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: 'Bimbingan Konseling' },
        ]} />
      </div>

      <div className="mb-4">
        <Title level={4} className="m-0 text-gray-800">Modul Bimbingan & Konseling</Title>
        <Text className="text-gray-500">Kelola catatan konseling, kedisiplinan, dan prestasi siswa.</Text>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col span={8}>
          <Card className="shadow-sm border border-gray-100 rounded-xl">
            <Statistic 
              title="Konseling Bulan Ini" 
              value={12} 
              prefix={<HeartOutlined className="text-rose-500" />} 
              suffix="Sesi"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="shadow-sm border border-gray-100 rounded-xl">
            <Statistic 
              title="Pelanggaran Aktif" 
              value={5} 
              prefix={<WarningOutlined className="text-orange-500" />}
              suffix="Kasus"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="shadow-sm border border-gray-100 rounded-xl">
            <Statistic 
              title="Prestasi Terdata" 
              value={24} 
              prefix={<TrophyOutlined className="text-emerald-500" />}
              suffix="Pencapaian"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {menuItems.map((item, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card 
              hoverable 
              className={`h-full border border-gray-100 shadow-sm rounded-xl overflow-hidden transition-all hover:shadow-md hover:border-blue-200 cursor-pointer`}
              bodyStyle={{ padding: '24px' }}
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
