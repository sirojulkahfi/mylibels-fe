"use client";

import React from 'react';
import { Typography, Row, Col, Card, Statistic, Breadcrumb } from 'antd';
import { 
  BarChartOutlined,
  CalendarOutlined,
  BookOutlined,
  SolutionOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

  import { laporanService } from '@/services/laporan/laporan.service';

  export default function LaporanDashboard() {
    const router = useRouter();
    const [summary, setSummary] = React.useState<any>(null);

    React.useEffect(() => {
      laporanService.getDashboardSummary().then(setSummary).catch(console.error);
    }, []);

    const menuItems = [
      {
        title: 'Laporan Absensi',
        description: 'Rekap kehadiran siswa, guru, dan kelas',
        icon: <CalendarOutlined className="text-4xl text-blue-500" />,
        path: '/laporan/absensi',
        bgClass: 'bg-blue-50',
      },
      {
        title: 'Laporan Kesiswaan',
        description: 'Rekap poin kedisiplinan dan prestasi',
        icon: <TeamOutlined className="text-4xl text-emerald-500" />,
        path: '/laporan/kesiswaan',
        bgClass: 'bg-emerald-50',
      },
      {
        title: 'Laporan Nilai',
        description: 'Transkrip nilai, buku ledger, dan rekap mapel',
        icon: <BookOutlined className="text-4xl text-purple-500" />,
        path: '/laporan/nilai-siswa',
        bgClass: 'bg-purple-50',
      },
      {
        title: 'Laporan Rapor',
        description: 'Arsip rapor dan peringkat kelas',
        icon: <SolutionOutlined className="text-4xl text-orange-500" />,
        path: '/laporan/rapor',
        bgClass: 'bg-orange-50',
      }
    ];

    return (
      <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
        <div className="mb-2 text-gray-500 text-sm">
          <Breadcrumb items={[
            { title: 'Laporan Akademik' },
          ]} />
        </div>

        <div className="mb-4">
          <Title level={4} className="m-0 text-gray-800">Pusat Laporan Akademik</Title>
          <Text className="text-gray-500">Akses seluruh rekapitulasi data sekolah dalam satu sentuhan.</Text>
        </div>

        {summary && (
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={12} md={6}>
              <Card size="small" className="border-blue-100 shadow-sm">
                <Statistic title="Total Siswa" value={summary.totalSiswa} />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card size="small" className="border-green-100 shadow-sm">
                <Statistic title="Total Guru" value={summary.totalGuru} />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card size="small" className="border-purple-100 shadow-sm">
                <Statistic title="Total Rombel" value={summary.totalRombel} />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card size="small" className="border-orange-100 shadow-sm">
                <Statistic title="Pelanggaran Hari Ini" value={summary.pelanggaranHariIni} />
              </Card>
            </Col>
          </Row>
        )}

        <Row gutter={[16, 16]}>
          {menuItems.map((item, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
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
