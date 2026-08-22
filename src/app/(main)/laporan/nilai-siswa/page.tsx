"use client";

import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Breadcrumb } from 'antd';
import { 
  FileDoneOutlined,
  BookOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { kelasService } from '@/services/data-induk/kelas.service';
import { siswaService } from '@/services/data-induk/siswa.service';

const { Title, Text } = Typography;

export default function LaporanNilaiSiswaDashboard() {
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
      title: 'Transkrip Nilai Siswa',
      description: 'Laporan detail seluruh nilai per siswa',
      icon: <FileDoneOutlined className="text-4xl text-purple-500" />,
      path: `/laporan/nilai-siswa/transkrip/${defaultSiswaId}`,
      bgClass: 'bg-purple-50',
    },
    {
      title: 'Buku Ledger Kelas',
      description: 'Rekapitulasi total nilai seluruh siswa per kelas',
      icon: <BookOutlined className="text-4xl text-emerald-500" />,
      path: `/laporan/nilai-siswa/buku-ledger/${defaultKelasId}`,
      bgClass: 'bg-emerald-50',
    },
    {
      title: 'Rekap Nilai Mata Pelajaran',
      description: 'Laporan nilai per mata pelajaran',
      icon: <AppstoreOutlined className="text-4xl text-blue-500" />,
      path: `/laporan/nilai-siswa/rekap-mapel/rm1`, // TBD when mapel rombel id is available
      bgClass: 'bg-blue-50',
    }
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: <Link href="/laporan">Laporan Akademik</Link> },
          { title: 'Nilai Siswa' },
        ]} />
      </div>

      <div className="mb-4">
        <Title level={4} className="m-0 text-gray-800">Laporan Nilai Akademik</Title>
        <Text className="text-gray-500">Pilih jenis laporan nilai yang ingin Anda tinjau dan cetak.</Text>
      </div>

      <Row gutter={[16, 16]}>
        {menuItems.map((item, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card 
              hoverable 
              className={`h-full border border-gray-100 shadow-sm rounded-xl overflow-hidden transition-all hover:shadow-md hover:border-purple-200 cursor-pointer`}
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
