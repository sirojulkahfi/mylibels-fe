"use client";

import React, { useState, useEffect } from 'react';
import { Typography, Table, Button, Tag, Space, Breadcrumb, DatePicker, Select } from 'antd';
import { 
  DownloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dayjs from 'dayjs';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { guruStafService } from '@/services/data-induk/guru-staf.service';
import { presensiService } from '@/services/presensi/presensi.service';

const { Title, Text } = Typography;

export default function PresensiGuruPage() {
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [guruRes, presensiRes] = await Promise.all([
          guruStafService.findAll(),
          presensiService.findAllGuru()
        ]);
        
        // Dapatkan tanggal hari ini (YYYY-MM-DD)
        const today = new Date().toISOString().split('T')[0];

        // Filter presensi hari ini
        const presensiHariIni = (presensiRes || []).filter((p: any) => {
          if (!p.tanggal) return false;
          return p.tanggal.startsWith(today);
        });

        // Gabungkan data
        const mappedData = guruRes.map((guru: any) => {
          const presensi = presensiHariIni.find((p: any) => p.guruId === guru.id);
          
          return {
            id: guru.id,
            name: guru.name,
            nip: guru.nip || '-', // Fallback NIP jika kosong
            checkIn: presensi?.jamMasuk || '-',
            checkOut: presensi?.jamKeluar || '-',
            status: presensi?.status || 'Belum Presensi',
          };
        });

        setData(mappedData);
      } catch (error) {
        console.error("Gagal mengambil data presensi guru:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: 'No',
      key: 'index',
      width: 60,
      render: (text: any, record: any, index: number) => index + 1,
      align: 'center' as const,
    },
    {
      title: 'Nama Guru / Staf',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (text: string, record: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{text}</span>
          <span className="text-xs text-gray-400">NIP: {record.nip}</span>
        </div>
      ),
    },
    {
      title: 'Jam Masuk',
      dataIndex: 'checkIn',
      key: 'checkIn',
      width: 120,
      align: 'center' as const,
      render: (text: string) => <span className="font-medium text-blue-600">{text}</span>
    },
    {
      title: 'Jam Keluar',
      dataIndex: 'checkOut',
      key: 'checkOut',
      width: 120,
      align: 'center' as const,
      render: (text: string) => <span className="font-medium text-purple-600">{text}</span>
    },
    {
      title: 'Status Kehadiran',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: string) => {
        let color = 'default';
        let icon = <CheckCircleOutlined />;
        
        if (status === 'Hadir') {
          color = 'success';
        } else if (status === 'Terlambat') {
          color = 'warning';
          icon = <ClockCircleOutlined />;
        } else if (status === 'Sakit' || status === 'Izin' || status === 'Alpha') {
          color = 'error';
          icon = <CloseCircleOutlined />;
        } else if (status === 'Belum Checkout') {
          color = 'processing';
          icon = <ClockCircleOutlined />;
        } else if (status === 'Belum Presensi') {
          color = 'default';
          icon = <ClockCircleOutlined />;
        }
        
        return <Tag icon={icon} color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: <Link href="/presensi">Presensi</Link> },
          { title: 'Guru & Staf' },
        ]} />
      </div>

      <ToolbarWrapper>
        <DatePicker defaultValue={dayjs()} className="w-40" format="DD/MM/YYYY" />
        <Select defaultValue="all" className="w-40 ml-2" options={[
          { value: 'all', label: 'Semua Status' },
          { value: 'hadir', label: 'Hadir' },
          { value: 'terlambat', label: 'Terlambat' },
          { value: 'sakit_izin', label: 'Sakit / Izin' },
        ]} />
        <ButtonToolbar 
          message="Unduh Laporan" 
          icon={<DownloadOutlined />} 
          className="ml-auto bg-green-600 text-white hover:bg-green-700"
        />
      </ToolbarWrapper>

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-1 mt-1 rounded-lg shadow-sm border border-gray-100">
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          pagination={false}
          size="small" bordered
          loading={loading}
          scroll={{ y: 'calc(100vh - 270px)' }}
        />
      </div>
    </div>
  );
}
