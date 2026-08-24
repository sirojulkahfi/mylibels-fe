"use client";

import React, { useState } from 'react';
import { Card, Table, Tag, Select, Skeleton } from 'antd';
import { ReadOutlined, TrophyOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { studentPortalService } from '@/services/student-portal.service';

export default function StudentNilaiPage() {
  const [semester, setSemester] = useState('2026-1');

  const { data, isLoading } = useQuery({
    queryKey: ['student-nilai', semester],
    queryFn: () => studentPortalService.getNilai(semester),
  });

  const formatif = data?.formatif || [];
  const sumatif = data?.sumatif || [];
  
  // Combine formatif and sumatif by mapelId
  const mapelMap = new Map();
  formatif.forEach((f: any) => {
    if (!mapelMap.has(f.mapelId)) mapelMap.set(f.mapelId, { id: f.mapelId, mapel: f.mapelId, formatif: 0, sumatif: 0, ptspas: 0, akhir: 0, predikat: '-' });
    mapelMap.get(f.mapelId).formatif = f.nilai;
  });
  sumatif.forEach((s: any) => {
    if (!mapelMap.has(s.mapelId)) mapelMap.set(s.mapelId, { id: s.mapelId, mapel: s.mapelId, formatif: 0, sumatif: 0, ptspas: 0, akhir: 0, predikat: '-' });
    mapelMap.get(s.mapelId).sumatif = s.nilai;
  });

  // Dummy calculation for ptspas, akhir, predikat
  const combinedData = Array.from(mapelMap.values()).map(item => {
    item.ptspas = Math.round((item.formatif + item.sumatif) / 2); // logic kasar
    item.akhir = Math.round((item.formatif + item.sumatif + item.ptspas) / 3);
    if (item.akhir >= 90) item.predikat = 'A';
    else if (item.akhir >= 80) item.predikat = 'B';
    else if (item.akhir >= 70) item.predikat = 'C';
    else item.predikat = 'D';
    return item;
  });

  const avgAnda = combinedData.length > 0 ? (combinedData.reduce((acc, curr) => acc + curr.akhir, 0) / combinedData.length).toFixed(1) : '0';

  const columns = [
    {
      title: 'Mata Pelajaran',
      dataIndex: 'mapel',
      key: 'mapel',
      render: (text: string) => <span className="font-semibold text-slate-800" style={{ color: '#1e293b' }}>{text}</span>,
    },
    {
      title: 'Formatif',
      dataIndex: 'formatif',
      key: 'formatif',
      align: 'center' as const,
      render: (val: number) => <span className="font-medium text-slate-800" style={{ color: '#1e293b' }}>{val}</span>,
    },
    {
      title: 'Sumatif',
      dataIndex: 'sumatif',
      key: 'sumatif',
      align: 'center' as const,
      render: (val: number) => <span className="font-medium text-slate-800" style={{ color: '#1e293b' }}>{val}</span>,
    },
    {
      title: 'PTS / PAS',
      dataIndex: 'ptspas',
      key: 'ptspas',
      align: 'center' as const,
      render: (val: number) => <span className="font-medium text-slate-800" style={{ color: '#1e293b' }}>{val}</span>,
    },
    {
      title: 'Nilai Akhir',
      dataIndex: 'akhir',
      key: 'akhir',
      align: 'center' as const,
      render: (val: number) => (
        <Tag color={val >= 80 ? 'green' : val >= 70 ? 'blue' : 'red'} className="font-bold border-0 px-2 rounded w-12 text-center">
          {val}
        </Tag>
      ),
    },
    {
      title: 'Predikat',
      dataIndex: 'predikat',
      key: 'predikat',
      align: 'center' as const,
      render: (val: string) => {
        let color = 'default';
        if (val === 'A') color = 'gold';
        if (val === 'B') color = 'blue';
        if (val === 'C') color = 'orange';
        if (val === 'D') color = 'red';
        return <span className={`font-bold text-${color === 'gold' ? 'yellow-600' : color === 'blue' ? 'blue-600' : color === 'orange' ? 'orange-500' : 'red-500'} text-lg`}>{val}</span>;
      }
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2 m-0">
            <ReadOutlined className="text-blue-600" /> Hasil Penilaian
          </h1>
          <p className="text-slate-500 mt-1">Laporan pencapaian akademik Anda.</p>
        </div>
        <div className="w-full sm:w-auto">
          <Select 
            value={semester} 
            onChange={setSemester}
            options={[
              { value: '2026-1', label: 'Semester Ganjil 2026/2027' },
              { value: '2025-2', label: 'Semester Genap 2025/2026' },
            ]}
            className="w-full sm:w-64 h-10 rounded-xl"
            popupMatchSelectWidth={false}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className="border-0 shadow-md rounded-2xl text-white"
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #9333ea 100%)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium mb-1 uppercase tracking-wider">Rata-Rata Kelas</p>
              <h2 className="text-4xl font-bold m-0 text-white">82.4</h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <ReadOutlined className="text-2xl" />
            </div>
          </div>
        </Card>
        
        <Card 
          className="border-0 shadow-md rounded-2xl text-white"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1 uppercase tracking-wider">Nilai Rata-Rata Anda</p>
              <h2 className="text-4xl font-bold m-0 text-white">{avgAnda}</h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <TrophyOutlined className="text-2xl" />
            </div>
          </div>
        </Card>
        
        <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl">
          <div className="flex flex-col h-full justify-center">
            <p className="text-slate-500 text-sm font-medium mb-1">Status Akademik</p>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-green-600 font-bold text-lg">Sangat Baik</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Pertahankan prestasimu!</p>
          </div>
        </Card>
      </div>

      <Card className="shadow-sm border-0 rounded-2xl overflow-hidden" styles={{ body: { padding: 0 } }}>
        <div className="p-4 bg-slate-50 border-b border-slate-100 font-semibold text-slate-700">
          Daftar Nilai Mata Pelajaran
        </div>
        <Skeleton loading={isLoading} active paragraph={{ rows: 5 }}>
          <Table 
            columns={columns} 
            dataSource={combinedData} 
            rowKey="id" 
            pagination={false}
            className="nilai-table"
            scroll={{ x: 700 }}
            locale={{ emptyText: 'Belum ada nilai di semester ini' }}
          />
        </Skeleton>
      </Card>
      
      <div className="text-center mt-6">
        <button 
          onClick={() => window.print()}
          className="px-6 py-2.5 bg-white border border-slate-200 shadow-sm rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
        >
          Unduh Transkrip (PDF)
        </button>
      </div>
    </div>
  );
}
