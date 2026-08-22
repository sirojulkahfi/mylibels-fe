"use client";

import React, { useState, useEffect } from 'react';
import { Breadcrumb, Button, Typography, Row, Col, Card, App } from 'antd';
import { 
  PrinterOutlined,
  IdcardOutlined,
  BankOutlined,
  TeamOutlined,
  FileTextOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import Link from 'next/link';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import { identitasSekolahService } from '@/services/system/identitas-sekolah.service';
import { kelasService } from '@/services/data-induk/kelas.service';

const { Title } = Typography;

export default function KelengkapanRaporPage() {
  const { message } = App.useApp();
  const [sekolah, setSekolah] = useState<any>(null);
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sekolahRes, kelasRes] = await Promise.all([
          identitasSekolahService.get().catch(() => null),
          kelasService.findAll().catch(() => []),
        ]);
        setSekolah(sekolahRes);
        setKelasList(kelasRes || []);
      } catch (error) {
        message.error("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [message]);

  const printItems = [
    {
      title: 'Cover Rapor',
      description: 'Mencetak halaman sampul depan rapor dengan logo dan identitas sekolah',
      icon: <FileTextOutlined className="text-4xl text-blue-500" />,
      bgClass: 'bg-blue-50',
      info: sekolah?.name || 'Memuat...',
    },
    {
      title: 'Identitas Sekolah',
      description: 'Mencetak halaman profil sekolah (NPSN, alamat, kepala sekolah)',
      icon: <BankOutlined className="text-4xl text-emerald-500" />,
      bgClass: 'bg-emerald-50',
      info: sekolah?.npsn ? `NPSN: ${sekolah.npsn}` : 'Memuat...',
    },
    {
      title: 'Identitas Siswa (Per Kelas)',
      description: 'Mencetak halaman biodata siswa berdasarkan kelas yang dipilih',
      icon: <TeamOutlined className="text-4xl text-orange-500" />,
      bgClass: 'bg-orange-50',
      info: `${kelasList.length} Kelas tersedia`,
    },
    {
      title: 'Lembar Pas Foto',
      description: 'Mencetak lembar tempat penempelan pas foto siswa',
      icon: <IdcardOutlined className="text-4xl text-purple-500" />,
      bgClass: 'bg-purple-50',
      info: 'Ukuran 3x4',
    },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: <Link href="/rapor">Manajemen Rapor</Link> },
          { title: 'Kelengkapan Rapor' },
        ]} />
      </div>

      <ToolbarWrapper>
        <span className="text-white font-bold ml-2">Cetak Kelengkapan Rapor</span>
        <Button 
          icon={<DownloadOutlined />} 
          className="ml-auto bg-white/20 text-white border-0 hover:bg-white/30"
        >
          Unduh Semua (ZIP)
        </Button>
      </ToolbarWrapper>

      <div className="mt-4 flex-1 overflow-auto">
        {sekolah && (
          <div className="mb-6 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-base font-bold text-gray-800 mb-3">Informasi Sekolah</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block">Nama Sekolah</span>
                <span className="font-semibold text-gray-800">{sekolah.name || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">NPSN</span>
                <span className="font-semibold text-gray-800">{sekolah.npsn || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Kepala Sekolah</span>
                <span className="font-semibold text-gray-800">{sekolah.headmaster || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Alamat</span>
                <span className="font-semibold text-gray-800">{sekolah.address || '-'}</span>
              </div>
            </div>
          </div>
        )}

        <Title level={5} className="mb-4">Pilih Bagian Kelengkapan yang Ingin Dicetak</Title>
        <Row gutter={[16, 16]}>
          {printItems.map((item, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card 
                hoverable 
                className="h-full border border-gray-100 shadow-sm rounded-xl overflow-hidden transition-all hover:shadow-md hover:border-blue-200"
                styles={{ body: { padding: '24px' } }}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className={`p-4 rounded-full ${item.bgClass}`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-800 m-0 mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-xs m-0 mb-2">{item.description}</p>
                    <p className="text-blue-600 text-xs font-medium m-0 mb-4">{item.info}</p>
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
