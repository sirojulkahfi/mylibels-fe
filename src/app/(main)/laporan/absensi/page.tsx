"use client";

import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Breadcrumb, Select, Button } from 'antd';
import { 
  TeamOutlined,
  UserOutlined,
  BankOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { kelasService } from '@/services/data-induk/kelas.service';

const { Title, Text } = Typography;
const { Option } = Select;

export default function LaporanAbsensiDashboard() {
  const router = useRouter();
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [defaultKelasId, setDefaultKelasId] = useState('');

  useEffect(() => {
    kelasService.findAll().then(res => {
      setKelasList(res || []);
      if (res && res.length > 0) setDefaultKelasId(res[0].id);
    }).catch(console.error);
  }, []);

  const menuItems = [
    {
      title: 'Rekap Absensi Siswa',
      description: 'Laporan detail kehadiran per siswa',
      icon: <UserOutlined className="text-4xl text-blue-500" />,
      path: '/laporan/absensi/rekap-siswa', 
      bgClass: 'bg-blue-50',
    },
    {
      title: 'Rekap Absensi Kelas',
      description: 'Laporan akumulasi kehadiran per kelas',
      icon: <BankOutlined className="text-4xl text-emerald-500" />,
      path: `/laporan/absensi/rekap-kelas/${defaultKelasId}`,
      bgClass: 'bg-emerald-50',
      renderSelect: () => (
        <Select 
          showSearch
          value={defaultKelasId}
          onChange={(v) => setDefaultKelasId(v)}
          className="w-full"
          placeholder="Pilih Kelas"
          optionFilterProp="children"
        >
          {kelasList.map(k => <Option key={k.id} value={k.id}>{k.name}</Option>)}
        </Select>
      )
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
              className={`h-full border border-gray-100 shadow-sm rounded-xl transition-all hover:shadow-md hover:border-gray-300`}
              styles={{ body: { padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' } }}
            >
              <div className="flex flex-col items-center text-center gap-4 mb-4">
                <div className={`p-4 rounded-full ${item.bgClass}`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 m-0 mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm m-0">{item.description}</p>
                </div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-gray-100">
                {item.renderSelect && (
                  <div className="mb-3">
                    <Text className="text-xs text-gray-500 font-semibold mb-1 block">Tentukan Parameter Laporan:</Text>
                    {item.renderSelect()}
                  </div>
                )}
                <Button 
                  type="primary" 
                  className="w-full"
                  icon={<ArrowRightOutlined />}
                  onClick={() => {
                    if (item.path.includes('undefined') || item.path.endsWith('/')) return;
                    router.push(item.path);
                  }}
                >
                  Lihat Laporan
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
