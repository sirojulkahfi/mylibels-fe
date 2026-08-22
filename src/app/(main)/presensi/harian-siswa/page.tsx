"use client";

import React, { useState, useEffect } from 'react';
import { Table, Button, Breadcrumb, App, Tag } from 'antd';
import { ArrowRightOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import { presensiService } from '@/services/presensi/presensi.service';

export default function PresensiHarianPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchPresensi = async () => {
      try {
        const res = await presensiService.getRekapHarianSiswa();
        
        if (res) {
          setData(res);
        } else {
          setData([]);
        }
      } catch (error) {
        message.error("Gagal mengambil rekap presensi kelas hari ini");
      } finally {
        setLoading(false);
      }
    };

    fetchPresensi();
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
      title: 'Kelas',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text: string) => <span className="font-bold text-gray-800">{text}</span>,
    },
    {
      title: 'Wali Kelas',
      dataIndex: 'waliKelas',
      key: 'waliKelas',
      width: 250,
    },
    {
      title: 'Total Siswa',
      dataIndex: 'totalSiswa',
      key: 'totalSiswa',
      width: 120,
      align: 'center' as const,
    },
    {
      title: 'Hadir',
      dataIndex: 'hadir',
      key: 'hadir',
      width: 100,
      align: 'center' as const,
      render: (val: number, record: any) => record.status === 'Selesai' ? <span className="text-emerald-600 font-semibold">{val}</span> : '-',
    },
    {
      title: 'Absen (S/I/A)',
      dataIndex: 'absen',
      key: 'absen',
      width: 130,
      align: 'center' as const,
      render: (val: number, record: any) => record.status === 'Selesai' ? <span className="text-red-500 font-semibold">{val}</span> : '-',
    },
    {
      title: 'Status Presensi',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: string) => (
        <Tag 
          icon={status === 'Selesai' ? <CheckCircleOutlined /> : <ClockCircleOutlined />} 
          color={status === 'Selesai' ? 'success' : 'default'}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 150,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Button 
          type="primary"
          icon={<ArrowRightOutlined />} 
          className={record.status === 'Selesai' ? "bg-blue-50 text-blue-600 border-blue-200 shadow-none hover:bg-blue-100" : "bg-blue-600"}
          onClick={() => router.push(`/presensi/harian-siswa/${record.id}`)}
          block
        >
          {record.status === 'Selesai' ? "Lihat Detail" : "Isi Presensi"}
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm flex items-center justify-between">
        <Breadcrumb items={[
          { title: <Link href="/presensi">Presensi</Link> },
          { title: 'Harian Siswa' },
        ]} />
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium text-xs">
          Hari Ini: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <ToolbarWrapper>
        <span className="text-white font-semibold">Pilih Kelas untuk Presensi Harian</span>
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
