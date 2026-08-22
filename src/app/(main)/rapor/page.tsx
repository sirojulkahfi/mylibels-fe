"use client";

import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Breadcrumb } from 'antd';
import { 
  FileProtectOutlined,
  PrinterOutlined,
  TeamOutlined,
  ProfileOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { kelasService } from '@/services/data-induk/kelas.service';
import { siswaService } from '@/services/data-induk/siswa.service';

const { Title, Text } = Typography;

export default function RaporDashboard() {
  const router = useRouter();
  const [defaultKelasId, setDefaultKelasId] = useState('');
  const [defaultSiswaId, setDefaultSiswaId] = useState('');

  useEffect(() => {
    kelasService.findAll().then(res => {
      if (res && res.length > 0) setDefaultKelasId(res[0].id);
    }).catch(console.error);

    siswaService.findAll().then(res => {
      if (res && res.length > 0) setDefaultSiswaId(res[0].id);
    }).catch(console.error);
  }, []);

  const menuItems = [
    {
      title: 'Validasi & Kunci Rapor',
      description: 'Pengecekan akhir dan penguncian data nilai rapor per kelas',
      icon: <CheckCircleOutlined className="text-4xl text-emerald-500" />,
      path: `/rapor/validasi-kunci/${defaultKelasId}`,
      bgClass: 'bg-emerald-50',
    },
    {
      title: 'Catatan Wali Kelas',
      description: 'Catatan perkembangan dan keputusan kenaikan kelas',
      icon: <ProfileOutlined className="text-4xl text-blue-500" />,
      path: `/rapor/catatan-kenaikan/${defaultKelasId}`,
      bgClass: 'bg-blue-50',
    },
    {
      title: 'Cetak Rapor Massal',
      description: 'Mencetak rapor seluruh siswa dalam satu kelas sekaligus',
      icon: <TeamOutlined className="text-4xl text-purple-500" />,
      path: `/rapor/cetak/massal/${defaultKelasId}`,
      bgClass: 'bg-purple-50',
    },
    {
      title: 'Cetak Rapor Individu',
      description: 'Mencetak rapor untuk siswa tertentu',
      icon: <PrinterOutlined className="text-4xl text-orange-500" />,
      path: `/rapor/cetak/siswa/${defaultSiswaId}`,
      bgClass: 'bg-orange-50',
    },
    {
      title: 'Kelengkapan Rapor',
      description: 'Mencetak cover, identitas sekolah, dan identitas siswa',
      icon: <FileProtectOutlined className="text-4xl text-cyan-500" />,
      path: '/rapor/cetak/kelengkapan',
      bgClass: 'bg-cyan-50',
    }
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: 'Manajemen Rapor' },
        ]} />
      </div>

      <div className="mb-4">
        <Title level={4} className="m-0 text-gray-800">Manajemen Rapor Siswa</Title>
        <Text className="text-gray-500">Pusat kendali validasi, catatan wali kelas, dan pencetakan rapor akhir semester.</Text>
      </div>

      <Row gutter={[16, 16]}>
        {menuItems.map((item, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
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
