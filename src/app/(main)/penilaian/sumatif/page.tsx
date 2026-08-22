"use client";

import React, { useState } from 'react';
import { Typography, Table, Tag, Button, Input, Select, Space, Row, Col } from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  EditOutlined, 
  FileDoneOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { App } from 'antd';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { akademikService } from '@/services/akademik/akademik.service';
import { kelasService } from '@/services/data-induk/kelas.service';
import { mataPelajaranService } from '@/services/data-induk/mata-pelajaran.service';

const { Title, Text } = Typography;

export default function PenilaianSumatifPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  const { message } = App.useApp();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [jadwalList, kelasList, mapelList] = await Promise.all([
          akademikService.findAllJadwal(),
          kelasService.findAll().catch(() => []),
          mataPelajaranService.findAll().catch(() => [])
        ]);
        
        const formatted = jadwalList.map((j: any) => {
          const kls = kelasList.find((k:any) => k.id === j.kelasId);
          const mpl = mapelList.find((m:any) => m.id === j.mapelId);
          return {
            id: j.id,
            className: kls?.name || j.kelasId || 'Kelas',
            subject: mpl?.name || j.mapelId || 'Mata Pelajaran',
            type: mpl?.category || 'Wajib',
            studentsCount: 30,
            status: 'pending',
            lastUpdated: '-',
          };
        });
        setClasses(formatted);
      } catch (error) {
        message.error("Gagal memuat daftar kelas");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      title: 'Kelas',
      dataIndex: 'className',
      key: 'className',
      render: (text: string) => <span className="font-semibold text-gray-800">{text}</span>,
    },
    {
      title: 'Mata Pelajaran',
      dataIndex: 'subject',
      key: 'subject',
      render: (text: string, record: any) => (
        <div className="flex flex-col">
          <span>{text}</span>
          <span className="text-xs text-gray-400">{record.type}</span>
        </div>
      ),
    },
    {
      title: 'Jml Siswa',
      dataIndex: 'studentsCount',
      key: 'studentsCount',
      render: (count: number) => <Tag color="emerald">{count} Siswa</Tag>,
    },
    {
      title: 'Status Sumatif',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        status === 'completed' 
          ? <Tag icon={<CheckCircleOutlined />} color="success">Selesai</Tag>
          : <Tag icon={<ClockCircleOutlined />} color="warning">Belum Selesai</Tag>
      ),
    },
    {
      title: 'Terakhir Diubah',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      render: (text: string) => <span className="text-gray-500 text-sm">{text}</span>,
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: any) => (
        <Button 
          type="primary" 
          size="small" 
          icon={<EditOutlined />} 
          className="bg-emerald-600 shadow-sm text-xs h-7 px-3"
          onClick={() => router.push(`/penilaian/sumatif/${record.id}`)}
        >
          Input Nilai
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">Penilaian / Sumatif</div>

      <ToolbarWrapper>
        <Input 
          placeholder="Cari kelas atau mata pelajaran..." 
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-64"
        />
        <Select defaultValue="all" className="w-40 text-left ml-2">
          <Select.Option value="all">Semua Status</Select.Option>
          <Select.Option value="completed">Selesai</Select.Option>
          <Select.Option value="pending">Belum Selesai</Select.Option>
        </Select>
        <ButtonToolbar 
          message="Filter Lanjutan" 
          icon={<FilterOutlined />} 
          className="ml-auto"
        />
      </ToolbarWrapper>

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-1 mt-1 rounded-lg shadow-sm border border-gray-100">
        <Table 
          columns={columns} 
          dataSource={classes} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          size="small" bordered
          loading={loading}
          scroll={{ x: 'max-content', y: 'calc(100vh - 270px)' }}
        />
      </div>
    </div>
  );
}
