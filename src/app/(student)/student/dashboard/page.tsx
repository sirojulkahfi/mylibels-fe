"use client";

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, Col, Row, Statistic, Skeleton } from 'antd';
import { 
  CalendarOutlined, 
  CheckCircleOutlined, 
  WarningOutlined, 
  TrophyOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { useQuery } from '@tanstack/react-query';
import { studentPortalService } from '@/services/student-portal.service';

dayjs.locale('id');

export default function StudentDashboardPage() {
  const { user } = useAuthStore();
  
  const { data, isLoading: loading } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: () => studentPortalService.getDashboard(),
  });

  const stats = data?.stats || { hadir: 0, izinSakit: 0, alpha: 0, prestasi: 0 };
  const jadwal = data?.jadwal || [];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <svg width="300" height="300" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M45.7,-76.4C58.9,-69.3,69.1,-55.3,77.5,-41C85.9,-26.7,92.5,-12.2,90.3,1.4C88.1,15,77,27.7,66.8,39C56.6,50.3,47.3,60.2,35.4,67.5C23.5,74.8,9,79.5,-5.2,78.5C-19.4,77.5,-33.3,70.8,-45.8,63.1C-58.3,55.4,-69.4,46.7,-77.3,34.8C-85.2,22.9,-89.9,7.8,-88.4,-6.9C-86.9,-21.6,-79.2,-35.9,-69.1,-46.8C-59,-57.7,-46.5,-65.2,-33.2,-71.4C-19.9,-77.6,-5.8,-82.5,8.2,-83.1C22.2,-83.7,32.5,-83.5,45.7,-76.4Z" transform="translate(100 100) scale(1.1)" />
          </svg>
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Halo, {user?.name || 'Siswa'}! 👋</h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl">
            Selamat datang di Portal Siswa. Semangat belajarnya hari ini! Jangan lupa cek jadwal dan tugas.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
              <span className="text-blue-100 text-xs block mb-1">Tanggal Hari Ini</span>
              <span className="font-semibold text-sm">{dayjs().format('dddd, DD MMMM YYYY')}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <CalendarOutlined className="text-blue-600" /> Ringkasan Bulan Ini
        </h2>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={12} md={6}>
            <Card className="shadow-sm border-0 bg-white hover:shadow-md transition-all rounded-xl h-full">
              <Skeleton loading={loading} active paragraph={{ rows: 1 }}>
                <Statistic
                  title={<span className="text-slate-500 font-medium text-xs sm:text-sm">Kehadiran (Hadir)</span>}
                  value={stats.hadir}
                  suffix="hari"
                  styles={{ content: { color: '#16a34a', fontWeight: 'bold' } }}
                  prefix={<CheckCircleOutlined className="text-green-500 mr-2" />}
                />
              </Skeleton>
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card className="shadow-sm border-0 bg-white hover:shadow-md transition-all rounded-xl h-full">
              <Skeleton loading={loading} active paragraph={{ rows: 1 }}>
                <Statistic
                  title={<span className="text-slate-500 font-medium text-xs sm:text-sm">Izin / Sakit</span>}
                  value={stats.izinSakit}
                  suffix="hari"
                  styles={{ content: { color: '#ca8a04', fontWeight: 'bold' } }}
                  prefix={<WarningOutlined className="text-yellow-500 mr-2" />}
                />
              </Skeleton>
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card className="shadow-sm border-0 bg-white hover:shadow-md transition-all rounded-xl h-full">
              <Skeleton loading={loading} active paragraph={{ rows: 1 }}>
                <Statistic
                  title={<span className="text-slate-500 font-medium text-xs sm:text-sm">Alpha</span>}
                  value={stats.alpha}
                  suffix="hari"
                  styles={{ content: { color: '#dc2626', fontWeight: 'bold' } }}
                  prefix={<WarningOutlined className="text-red-500 mr-2" />}
                />
              </Skeleton>
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card className="shadow-sm border-0 bg-white hover:shadow-md transition-all rounded-xl h-full">
              <Skeleton loading={loading} active paragraph={{ rows: 1 }}>
                <Statistic
                  title={<span className="text-slate-500 font-medium text-xs sm:text-sm">Prestasi</span>}
                  value={stats.prestasi}
                  suffix="poin"
                  styles={{ content: { color: '#2563eb', fontWeight: 'bold' } }}
                  prefix={<TrophyOutlined className="text-blue-500 mr-2" />}
                />
              </Skeleton>
            </Card>
          </Col>
        </Row>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card title="Jadwal Hari Ini" className="shadow-sm border-0 rounded-xl" styles={{ header: { borderBottom: '1px solid #f1f5f9', fontWeight: 'bold' } }}>
          <Skeleton loading={loading} active paragraph={{ rows: 4 }}>
            <div className="space-y-4">
              {jadwal.length > 0 ? jadwal.map((item: any, idx: number) => (
                <div key={idx} className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-blue-50 text-blue-600 font-bold shrink-0">
                    <span className="text-xs">{item.jamMulai}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 m-0">{item.mapelId}</h4>
                    <p className="text-xs text-slate-500 m-0">Guru ID: {item.guruId}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-6 text-slate-400">
                  Tidak ada jadwal untuk hari ini.
                </div>
              )}
            </div>
          </Skeleton>
        </Card>

        <Card title="Pengumuman Sekolah" className="shadow-sm border-0 rounded-xl" styles={{ header: { borderBottom: '1px solid #f1f5f9', fontWeight: 'bold' } }}>
          <Skeleton loading={loading} active paragraph={{ rows: 4 }}>
            <div className="space-y-4">
              {data?.pengumuman && data.pengumuman.length > 0 ? data.pengumuman.map((item: any) => {
                let badgeColor = 'bg-slate-50 text-slate-600';
                if (item.category === 'INFO AKADEMIK') badgeColor = 'bg-blue-50 text-blue-600';
                if (item.category === 'KEGIATAN') badgeColor = 'bg-green-50 text-green-600';
                
                return (
                  <div key={item.id} className="pb-4 border-b border-slate-100 last:border-0">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${badgeColor}`}>{item.category}</span>
                    <h4 className="font-semibold text-slate-800 mt-2 mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-600 line-clamp-2 m-0 whitespace-pre-line">
                      {item.content}
                    </p>
                    <span className="text-xs text-slate-400 mt-2 block">Diposting: {dayjs(item.createdAt).format('DD MMM YYYY')}</span>
                  </div>
                );
              }) : (
                <div className="text-center py-6 text-slate-400">
                  Belum ada pengumuman baru.
                </div>
              )}
            </div>
          </Skeleton>
        </Card>
      </div>
    </div>
  );
}
