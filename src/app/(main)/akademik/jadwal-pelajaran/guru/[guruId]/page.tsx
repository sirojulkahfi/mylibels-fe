"use client";

import React, { useState, useEffect } from 'react';
import { Card, Typography, Breadcrumb, Table, Space, Button, Select } from 'antd';
import { ArrowLeftOutlined, PrinterOutlined } from '@ant-design/icons';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import { guruStafService } from '@/services/data-induk/guru-staf.service';
import { akademikService } from '@/services/akademik/akademik.service';

const { Title, Text } = Typography;

export default function JadwalGuruPage() {
  const params = useParams();
  const router = useRouter();
  const guruId = params.guruId as string;

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [guruList, setGuruList] = useState<any[]>([]);
  const [selectedGuru, setSelectedGuru] = useState(guruId);

  useEffect(() => {
    const fetchGuru = async () => {
      try {
        const res = await guruStafService.findAll();
        setGuruList(res || []);
      } catch (error) {
        console.error("Gagal memuat daftar guru", error);
      }
    };
    fetchGuru();
  }, []);

  useEffect(() => {
    if (selectedGuru !== guruId) {
      router.push(`/akademik/jadwal-pelajaran/guru/${selectedGuru}`);
    }
  }, [selectedGuru, guruId, router]);

  const columns = [
    {
      title: 'Hari',
      dataIndex: 'hari',
      key: 'hari',
      width: 120,
    },
    {
      title: 'Jam Ke',
      dataIndex: 'jam',
      key: 'jam',
      width: 100,
      align: 'center' as const,
    },
    {
      title: 'Kelas',
      dataIndex: 'kelas',
      key: 'kelas',
      width: 150,
    },
    {
      title: 'Mata Pelajaran',
      dataIndex: 'mapel',
      key: 'mapel',
    },
    {
      title: 'Ruangan',
      dataIndex: 'ruangan',
      key: 'ruangan',
      width: 150,
    }
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: <Link href="/akademik/jadwal-pelajaran">Jadwal Pelajaran</Link> },
          { title: 'Jadwal Guru' },
        ]} />
      </div>

      <ToolbarWrapper>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.push('/akademik/jadwal-pelajaran')}
          className="border-0 flex items-center shadow-none hover:opacity-80 px-3 ml-2 mr-4"
          style={{ color: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          Kembali
        </Button>
        <div className="flex flex-col mr-4 hidden md:flex">
          <span className="text-white font-bold leading-tight">Jadwal Mengajar Guru</span>
        </div>
        
        <div className="ml-auto flex gap-2">
          <Button 
            icon={<PrinterOutlined />} 
            type="primary"
            className="bg-emerald-500 border-0 hover:bg-emerald-400"
          >
            Cetak Jadwal
          </Button>
        </div>
      </ToolbarWrapper>

      <Card className="flex-1 overflow-hidden flex flex-col border border-gray-100 shadow-sm rounded-xl" styles={{ body: { padding: 0, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 } }}>
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Text className="font-medium text-gray-600">Pilih Guru:</Text>
            <Select
              className="w-64"
              placeholder={guruList.length === 0 ? "Memuat guru..." : "Pilih Guru"}
              value={guruList.length > 0 ? selectedGuru : undefined}
              onChange={setSelectedGuru}
              options={guruList.map(g => ({ value: g.id, label: g.name }))}
              showSearch
              loading={guruList.length === 0}
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-white p-4">
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey="id"
            pagination={false}
            bordered
            size="middle"
            locale={{ emptyText: 'Tidak ada jadwal mengajar' }}
          />
        </div>
      </Card>
    </div>
  );
}
