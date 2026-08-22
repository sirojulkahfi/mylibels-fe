"use client";

import React, { useState } from 'react';
import { Breadcrumb, Button, Typography, Row, Col, Card } from 'antd';
import { 
  PrinterOutlined,
  ArrowLeftOutlined,
  IdcardOutlined,
  BookOutlined,
  ProfileOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import { siswaService } from '@/services/data-induk/siswa.service';

const { Title, Text } = Typography;

export default function CetakRaporIndividuPage() {
  const router = useRouter();
  const params = useParams();
  const siswaId = params.siswaId as string;
  const [siswaData, setSiswaData] = useState<any>(null);

  React.useEffect(() => {
    if (siswaId) {
      siswaService.findOne(siswaId).then(res => {
        setSiswaData(res);
      }).catch(console.error);
    }
  }, [siswaId]);

  const reportParts = [
    {
      title: 'Halaman Identitas Siswa',
      description: 'Cetak biodata lengkap siswa',
      icon: <IdcardOutlined className="text-4xl text-blue-500" />,
      bgClass: 'bg-blue-50',
    },
    {
      title: 'Halaman Nilai Akademik',
      description: 'Cetak daftar capaian nilai mata pelajaran',
      icon: <BookOutlined className="text-4xl text-emerald-500" />,
      bgClass: 'bg-emerald-50',
    },
    {
      title: 'Halaman Catatan & Ekskul',
      description: 'Cetak ketidakhadiran, ekstrakurikuler, dan catatan',
      icon: <ProfileOutlined className="text-4xl text-orange-500" />,
      bgClass: 'bg-orange-50',
    },
    {
      title: 'Halaman Prestasi',
      description: 'Cetak daftar prestasi akademik & non-akademik',
      icon: <TrophyOutlined className="text-4xl text-purple-500" />,
      bgClass: 'bg-purple-50',
    }
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: <Link href="/rapor">Manajemen Rapor</Link> },
          { title: 'Cetak Individu' },
        ]} />
      </div>

      <ToolbarWrapper>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.push('/rapor')}
          className="border-0 flex items-center shadow-none hover:opacity-80 px-3 ml-2 mr-4"
          style={{ color: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          Kembali
        </Button>
        <div className="flex flex-col">
          <span className="text-white font-bold leading-tight">
            {siswaData ? `${siswaData.name} (${siswaData.kelas?.name || '-'})` : 'Memuat Data...'}
          </span>
          <span className="text-gray-200 text-xs">NISN: {siswaData ? siswaData.nisn : '-'}</span>
        </div>
        
        <div className="ml-auto flex gap-2">
          <Button 
            icon={<PrinterOutlined />} 
            type="primary"
            className="bg-emerald-500 border-0 hover:bg-emerald-400"
          >
            Cetak Semua Halaman
          </Button>
        </div>
      </ToolbarWrapper>

      <div className="mt-4">
        <Title level={5} className="mb-4">Pilih Bagian Rapor yang Ingin Dicetak</Title>
        <Row gutter={[16, 16]}>
          {reportParts.map((item, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card 
                hoverable 
                className={`h-full border border-gray-100 shadow-sm rounded-xl overflow-hidden transition-all hover:shadow-md hover:border-blue-200`}
                styles={{ body: { padding: '24px' } }}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className={`p-4 rounded-full ${item.bgClass}`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-800 m-0 mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-xs m-0 mb-4">{item.description}</p>
                    <Button type="default" icon={<PrinterOutlined />} size="small" className="w-full text-blue-600 border-blue-200">
                      Cetak Bagian Ini
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
