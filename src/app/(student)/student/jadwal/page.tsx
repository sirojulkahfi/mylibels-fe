"use client";

import React, { useState } from 'react';
import { Card, Table, Tag, Segmented, Skeleton } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, BookOutlined, UserOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { studentPortalService } from '@/services/student-portal.service';

const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

export default function StudentJadwalPage() {
  const [selectedDay, setSelectedDay] = useState('Senin');
  
  const { data: mockSchedule, isLoading } = useQuery({
    queryKey: ['student-jadwal'],
    queryFn: () => studentPortalService.getJadwal(),
  });

  const data = mockSchedule ? (mockSchedule[selectedDay] || []) : [];

  const columns = [
    {
      title: 'Waktu',
      key: 'waktu',
      width: 150,
      render: (text: string, record: any) => (
        <span className="flex items-center gap-2 font-medium text-slate-600">
          <ClockCircleOutlined className="text-blue-500" /> {record.jamMulai} - {record.jamSelesai}
        </span>
      ),
    },
    {
      title: 'Mata Pelajaran / Kegiatan',
      dataIndex: 'mapelId',
      key: 'mapelId',
      render: (text: string, record: any) => {
        return (
          <div className="font-semibold text-slate-800">
            <BookOutlined className="text-indigo-500 mr-2" /> {text || record.id}
          </div>
        );
      },
    },
    {
      title: 'Pengajar',
      dataIndex: 'guruId',
      key: 'guruId',
      render: (text: string, record: any) => {
        return (
          <span className="text-slate-600">
            {text ? <><UserOutlined className="mr-1 text-slate-400" /> {text}</> : '-'}
          </span>
        );
      },
    },
    {
      title: 'Ruangan',
      dataIndex: 'ruanganId',
      key: 'ruanganId',
      render: (text: string, record: any) => {
        return <Tag bordered={false} className="bg-slate-100 text-slate-600">{text || '-'}</Tag>;
      }
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2 m-0">
            <CalendarOutlined className="text-blue-600" /> Jadwal Pelajaran
          </h1>
          <p className="text-slate-500 mt-1">Jadwal pelajaran kelas Anda untuk semester ini.</p>
        </div>
      </div>

      <Card className="shadow-sm border-0 rounded-2xl overflow-hidden" styles={{ body: { padding: 0 } }}>
        <div className="p-4 sm:p-6 bg-white border-b border-slate-100 flex justify-center sm:justify-start overflow-x-auto w-full">
          <Segmented
            options={days}
            value={selectedDay}
            onChange={(val) => setSelectedDay(val.toString())}
            size="large"
            className="font-medium bg-slate-100 p-1 min-w-max"
          />
        </div>
        <div className="p-0">
          <Skeleton loading={isLoading} active paragraph={{ rows: 5 }}>
            <Table 
              columns={columns} 
              dataSource={data} 
              rowKey="id" 
              pagination={false}
              className="jadwal-table"
              scroll={{ x: 600 }}
              locale={{ emptyText: 'Tidak ada jadwal untuk hari ini.' }}
            />
          </Skeleton>
        </div>
      </Card>
      
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3 text-blue-800 text-sm">
        <div className="text-blue-500 mt-0.5"><ClockCircleOutlined /></div>
        <p className="m-0">
          <strong>Catatan:</strong> Jadwal dapat berubah sewaktu-waktu sesuai dengan kebijakan sekolah. Pastikan Anda selalu mengecek secara berkala atau melihat papan pengumuman.
        </p>
      </div>
    </div>
  );
}
