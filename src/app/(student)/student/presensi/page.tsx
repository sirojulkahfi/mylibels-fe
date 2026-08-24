"use client";

import React from 'react';
import { Card, Table, Tag, DatePicker, Skeleton } from 'antd';
import { CheckSquareOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { studentPortalService } from '@/services/student-portal.service';

const { RangePicker } = DatePicker;

export default function StudentPresensiPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['student-presensi'],
    queryFn: () => studentPortalService.getPresensi(),
  });

  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'tanggal',
      key: 'tanggal',
      render: (text: string) => <span className="font-medium text-slate-700">{dayjs(text).format('DD MMM YYYY')}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'green';
        if (status === 'Izin') color = 'blue';
        if (status === 'Sakit') color = 'orange';
        if (status === 'Alpha') color = 'red';
        return <Tag color={color} className="font-bold border-0 px-3 py-1 uppercase">{status}</Tag>;
      },
    },
    {
      title: 'Keterangan',
      dataIndex: 'keterangan',
      key: 'keterangan',
      render: (text: string) => <span className="text-slate-500 italic">{text || '-'}</span>
    },
  ];

  // Calculate stats
  const total = data.length || 1; // prevent div zero
  const hadir = data.filter((d: any) => d.status === 'Hadir' || d.status === 'Terlambat').length;
  const percentage = data.length > 0 ? Math.round((hadir / data.length) * 100) : 0;
  const izin = data.filter((d: any) => d.status === 'Izin').length;
  const sakit = data.filter((d: any) => d.status === 'Sakit').length;
  const alpha = data.filter((d: any) => d.status === 'Alpha').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2 m-0">
            <CheckSquareOutlined className="text-blue-600" /> Presensi Kehadiran
          </h1>
          <p className="text-slate-500 mt-1">Pantau riwayat kehadiran Anda di sekolah.</p>
        </div>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 items-center bg-white p-2 rounded-xl shadow-sm border border-slate-100">
          <RangePicker className="w-full sm:w-64 border-slate-200" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-green-50 border border-green-100 shadow-sm rounded-xl text-center" styles={{ body: { padding: '16px' } }}>
          <div className="text-3xl font-bold text-green-600">{percentage}%</div>
          <div className="text-xs font-semibold text-green-700 mt-1 uppercase tracking-wider">Hadir</div>
        </Card>
        <Card className="bg-blue-50 border border-blue-100 shadow-sm rounded-xl text-center" styles={{ body: { padding: '16px' } }}>
          <div className="text-3xl font-bold text-blue-600">{izin}</div>
          <div className="text-xs font-semibold text-blue-700 mt-1 uppercase tracking-wider">Izin</div>
        </Card>
        <Card className="bg-orange-50 border border-orange-100 shadow-sm rounded-xl text-center" styles={{ body: { padding: '16px' } }}>
          <div className="text-3xl font-bold text-orange-600">{sakit}</div>
          <div className="text-xs font-semibold text-orange-700 mt-1 uppercase tracking-wider">Sakit</div>
        </Card>
        <Card className="bg-red-50 border border-red-100 shadow-sm rounded-xl text-center" styles={{ body: { padding: '16px' } }}>
          <div className="text-3xl font-bold text-red-600">{alpha}</div>
          <div className="text-xs font-semibold text-red-700 mt-1 uppercase tracking-wider">Alpha</div>
        </Card>
      </div>

      <Card className="shadow-sm border-0 rounded-2xl overflow-hidden" styles={{ body: { padding: 0 } }}>
        <Skeleton loading={isLoading} active paragraph={{ rows: 5 }}>
          <Table 
            columns={columns} 
            dataSource={data} 
            rowKey="id" 
            pagination={{ pageSize: 10 }}
            className="attendance-table"
            scroll={{ x: 600 }}
            locale={{ emptyText: 'Belum ada riwayat kehadiran' }}
          />
        </Skeleton>
      </Card>
    </div>
  );
}
