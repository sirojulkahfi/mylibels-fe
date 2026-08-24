"use client";

import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Breadcrumb, Select, Button } from 'antd';
import { 
  FileDoneOutlined,
  BookOutlined,
  AppstoreOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { kelasService } from '@/services/data-induk/kelas.service';
import { siswaService } from '@/services/data-induk/siswa.service';
import { mataPelajaranService } from '@/services/data-induk/mata-pelajaran.service';

const { Title, Text } = Typography;
const { Option } = Select;

export default function LaporanNilaiSiswaDashboard() {
  const router = useRouter();
  
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [siswaList, setSiswaList] = useState<any[]>([]);
  const [mapelList, setMapelList] = useState<any[]>([]);

  const [defaultKelasId, setDefaultKelasId] = useState('');
  const [defaultSiswaId, setDefaultSiswaId] = useState('');
  const [defaultMapelId, setDefaultMapelId] = useState('');

  useEffect(() => {
    kelasService.findAll().then(res => {
      setKelasList(res || []);
      if (res && res.length > 0) setDefaultKelasId(res[0].id);
    }).catch(console.error);

    siswaService.findAll().then(res => {
      setSiswaList(res || []);
      if (res && res.length > 0) setDefaultSiswaId(res[0].id);
    }).catch(console.error);

    mataPelajaranService.findAll().then(res => {
      const list = res?.data || res || [];
      setMapelList(list);
      if (list.length > 0) setDefaultMapelId(list[0].id);
    }).catch(console.error);
  }, []);

  const menuItems = [
    {
      title: 'Transkrip Nilai Siswa',
      description: 'Laporan detail seluruh nilai per siswa',
      icon: <FileDoneOutlined className="text-4xl text-purple-500" />,
      path: `/laporan/nilai-siswa/transkrip/${defaultSiswaId}`,
      bgClass: 'bg-purple-50',
      renderSelect: () => (
        <Select 
          showSearch
          value={defaultSiswaId}
          onChange={(v) => setDefaultSiswaId(v)}
          className="w-full"
          placeholder="Pilih Siswa"
          optionFilterProp="children"
        >
          {siswaList.map(s => <Option key={s.id} value={s.id}>{s.nis} - {s.name}</Option>)}
        </Select>
      )
    },
    {
      title: 'Buku Ledger Kelas',
      description: 'Rekapitulasi total nilai seluruh siswa per kelas',
      icon: <BookOutlined className="text-4xl text-emerald-500" />,
      path: `/laporan/nilai-siswa/buku-ledger/${defaultKelasId}`,
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
      title: 'Rekap Nilai Mata Pelajaran',
      description: 'Laporan nilai per mata pelajaran',
      icon: <AppstoreOutlined className="text-4xl text-blue-500" />,
      path: defaultMapelId ? `/laporan/nilai-siswa/rekap-mapel/${defaultMapelId}` : '',
      bgClass: 'bg-blue-50',
      renderSelect: () => (
        <Select 
          showSearch
          value={defaultMapelId}
          onChange={(v) => setDefaultMapelId(v)}
          className="w-full"
          placeholder="Pilih Mata Pelajaran"
          optionFilterProp="children"
        >
          {mapelList.map(m => <Option key={m.id} value={m.id}>{m.name}</Option>)}
        </Select>
      )
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
                <div className="mb-3">
                  <Text className="text-xs text-gray-500 font-semibold mb-1 block">Tentukan Parameter Laporan:</Text>
                  {item.renderSelect()}
                </div>
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
