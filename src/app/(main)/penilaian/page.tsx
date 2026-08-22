"use client";

import React from 'react';
import { Card, Row, Col, Typography, Progress, Button, Avatar, List, Tag } from 'antd';
import { 
  FormOutlined, 
  FileDoneOutlined, 
  TeamOutlined, 
  TrophyOutlined,
  ReadOutlined,
  ArrowRightOutlined,
  CheckCircleFilled,
  ClockCircleFilled
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function PenilaianDashboardPage() {
  const router = useRouter();

  const menuItems = [
    {
      title: 'Penilaian Formatif',
      description: 'Input nilai ulangan harian, tugas, dan kuis',
      icon: <FormOutlined className="text-blue-500 text-2xl" />,
      path: '/penilaian/formatif',
      color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
    },
    {
      title: 'Penilaian Sumatif',
      description: 'Input nilai PTS (STS) dan PAS (SAS)',
      icon: <FileDoneOutlined className="text-emerald-500 text-2xl" />,
      path: '/penilaian/sumatif',
      color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400',
    },
    {
      title: 'Catatan Wali Kelas',
      description: 'Isi catatan deskripsi perkembangan siswa',
      icon: <TeamOutlined className="text-purple-500 text-2xl" />,
      path: '/penilaian/catatan-wali-kelas',
      color: 'bg-purple-50 border-purple-200 hover:border-purple-400',
    },
    {
      title: 'Ekstrakurikuler',
      description: 'Input predikat dan deskripsi kegiatan eskul',
      icon: <TrophyOutlined className="text-orange-500 text-2xl" />,
      path: '/penilaian/ekstrakurikuler',
      color: 'bg-orange-50 border-orange-200 hover:border-orange-400',
    },
    {
      title: 'Portofolio & Proyek',
      description: 'Penilaian Proyek Penguatan Profil Pelajar (P5)',
      icon: <ReadOutlined className="text-indigo-500 text-2xl" />,
      path: '/penilaian/portofolio-proyek',
      color: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400',
    }
  ];

  const recentActivities: any[] = []; // Waiting for API integration

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Title level={3} className="!mb-1">Dashboard Penilaian</Title>
          <Text className="text-gray-500">Selamat datang di pusat manajemen penilaian akademik siswa.</Text>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Progress Overview Section */}
        <Col xs={24} lg={16}>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <TrophyOutlined style={{ fontSize: '120px' }} />
            </div>
            <Row align="middle" gutter={32}>
              <Col>
                <Progress 
                  type="dashboard" 
                  percent={75} 
                  strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                  size={140}
                  format={(percent) => (
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-gray-800">{percent}%</span>
                      <span className="text-xs text-gray-400">Selesai</span>
                    </div>
                  )}
                />
              </Col>
              <Col flex="auto">
                <Title level={4} className="!mb-2">Progres Penilaian Semester Ini</Title>
                <Text className="text-gray-500 block mb-4">
                  Batas akhir pengumpulan nilai rapor semester ganjil adalah tanggal <strong className="text-gray-700">15 Desember 2026</strong>.
                </Text>
                <div className="flex gap-4">
                  <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 flex-1">
                    <Text className="text-blue-600 text-xs font-semibold block mb-1">FORMATIF</Text>
                    <Text className="text-xl font-bold text-gray-800">12/15</Text> <Text className="text-xs text-gray-500">Kelas</Text>
                  </div>
                  <div className="bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 flex-1">
                    <Text className="text-emerald-600 text-xs font-semibold block mb-1">SUMATIF</Text>
                    <Text className="text-xl font-bold text-gray-800">8/15</Text> <Text className="text-xs text-gray-500">Kelas</Text>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <Title level={5} className="!mb-4">Modul Penilaian</Title>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item, index) => (
              <div 
                key={index} 
                className={`p-5 rounded-xl border cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md ${item.color} flex flex-col justify-between h-full group`}
                onClick={() => router.push(item.path)}
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 shrink-0 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-base mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <Button type="text" size="small" className="text-gray-400 group-hover:text-gray-800" icon={<ArrowRightOutlined />}>Buka</Button>
                </div>
              </div>
            ))}
          </div>
        </Col>

        {/* Sidebar Activity Section */}
        <Col xs={24} lg={8}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <Title level={5} className="!m-0">Aktivitas Terkini</Title>
              <Tag color="blue">Minggu Ini</Tag>
            </div>
            
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item, index) => (
                <List.Item key={index} className="px-0 py-3 border-b border-gray-50 last:border-0">
                  <List.Item.Meta
                    avatar={
                      <div className={`p-2 rounded-full ${item.status === 'done' ? 'bg-emerald-100 text-emerald-500' : 'bg-orange-100 text-orange-500'}`}>
                        {item.status === 'done' ? <CheckCircleFilled /> : <ClockCircleFilled />}
                      </div>
                    }
                    title={<span className="text-sm font-medium text-gray-800">{item.title}</span>}
                    description={<span className="text-xs text-gray-400">{item.time}</span>}
                  />
                </List.Item>
              )}
            />
            {recentActivities.length === 0 && (
              <div className="text-center py-6">
                 <Text className="text-gray-400">Belum ada aktivitas.</Text>
              </div>
            )}

            <div className="mt-auto pt-6 border-t border-gray-100">
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <div className="flex gap-3 mb-2">
                  <Avatar style={{ backgroundColor: '#6366f2' }} icon={<ReadOutlined />} />
                  <div>
                    <Text className="font-semibold text-gray-800 block text-sm">Panduan Penilaian</Text>
                    <Text className="text-[10px] text-gray-500">Kurikulum Merdeka 2026</Text>
                  </div>
                </div>
                <Button size="small" type="primary" className="w-full mt-2 bg-indigo-500 border-none shadow-none text-xs h-7">
                  Unduh Panduan
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
