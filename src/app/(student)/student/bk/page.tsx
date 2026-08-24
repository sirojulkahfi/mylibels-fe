"use client";

import React from 'react';
import { Card, Table, Tag, Tabs, Skeleton } from 'antd';
import { SafetyCertificateOutlined, WarningOutlined, TrophyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { studentPortalService } from '@/services/student-portal.service';

export default function StudentBKPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['student-bk'],
    queryFn: () => studentPortalService.getBk(),
  });

  const pelanggaranData = data?.pelanggaran || [];
  const prestasiData = data?.prestasi || [];

  const totalPelanggaran = pelanggaranData.reduce((acc: number, curr: any) => acc + curr.poin, 0);
  const totalPrestasi = prestasiData.reduce((acc: number, curr: any) => acc + curr.poinPenghargaan, 0);

  const pelanggaranColumns = [
    { title: 'Tanggal', dataIndex: 'tanggal', render: (text: string) => <span className="text-slate-600 font-medium">{dayjs(text).format('DD MMM YYYY')}</span> },
    { title: 'Bentuk Pelanggaran', dataIndex: 'jenisPelanggaran', render: (text: string) => <span className="font-semibold text-slate-800">{text}</span> },
    { title: 'Poin', dataIndex: 'poin', render: (val: number) => <Tag color="red" className="font-bold">+{val}</Tag> },
    { title: 'Tindakan / Sanksi', dataIndex: 'tindakan', render: (text: string) => <span className="text-slate-500 italic">{text || '-'}</span> },
  ];

  const prestasiColumns = [
    { title: 'Tanggal', dataIndex: 'tanggal', render: (text: string) => <span className="text-slate-600 font-medium">{dayjs(text).format('DD MMM YYYY')}</span> },
    { title: 'Prestasi / Penghargaan', dataIndex: 'namaPrestasi', render: (text: string) => <span className="font-semibold text-slate-800">{text}</span> },
    { title: 'Tingkat', dataIndex: 'tingkat', render: (text: string) => <Tag color="blue">{text}</Tag> },
    { title: 'Poin Reward', dataIndex: 'poinPenghargaan', render: (val: number) => <Tag color="green" className="font-bold">+{val}</Tag> },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2 m-0">
          <SafetyCertificateOutlined className="text-blue-600" /> Bimbingan & Kedisiplinan
        </h1>
        <p className="text-slate-500 mt-1">Catatan poin pelanggaran dan prestasi akademik/non-akademik.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Poin Pelanggaran Card */}
        <Card className="bg-red-50 border border-red-100 shadow-sm rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-10">
            <WarningOutlined className="text-8xl text-red-500" />
          </div>
          <div className="relative z-10">
            <p className="text-red-700 font-bold uppercase tracking-wider text-xs mb-2">Total Poin Pelanggaran</p>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black text-red-600">{totalPelanggaran}</span>
              <span className="text-red-500 font-medium mb-1">/ 100</span>
            </div>
            <p className="text-sm text-red-600/80 mt-4 max-w-[80%]">
              Hati-hati, poin akan terus terakumulasi. Jika mencapai batas 100, akan dilakukan pemanggilan orang tua.
            </p>
          </div>
        </Card>

        {/* Poin Prestasi Card */}
        <Card className="bg-blue-50 border border-blue-100 shadow-sm rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-10">
            <TrophyOutlined className="text-8xl text-blue-500" />
          </div>
          <div className="relative z-10">
            <p className="text-blue-700 font-bold uppercase tracking-wider text-xs mb-2">Total Poin Prestasi</p>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black text-blue-600">{totalPrestasi}</span>
              <span className="text-blue-500 font-medium mb-1">Poin</span>
            </div>
            <p className="text-sm text-blue-600/80 mt-4 max-w-[80%]">
              Luar biasa! Terus tingkatkan prestasimu dan banggakan sekolah serta orang tuamu.
            </p>
          </div>
        </Card>
      </div>

      <Card className="shadow-sm border-0 rounded-2xl overflow-hidden mt-6" styles={{ body: { padding: '0 1px' } }}>
        <Tabs
          defaultActiveKey="1"
          centered
          className="bk-tabs"
          items={[
            {
              key: '1',
              label: (
                <span className="px-4 font-semibold">
                  <WarningOutlined /> Riwayat Pelanggaran
                </span>
              ),
              children: (
                <div className="p-4 sm:p-6 bg-white min-h-[300px]">
                  <Skeleton loading={isLoading} active paragraph={{ rows: 5 }}>
                    {pelanggaranData.length > 0 ? (
                      <Table 
                        columns={pelanggaranColumns} 
                        dataSource={pelanggaranData} 
                        rowKey="id" 
                        pagination={false} 
                        scroll={{ x: 600 }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                        <SafetyCertificateOutlined className="text-4xl mb-3 text-green-300" />
                        <p>Hebat! Anda tidak memiliki catatan pelanggaran.</p>
                      </div>
                    )}
                  </Skeleton>
                </div>
              ),
            },
            {
              key: '2',
              label: (
                <span className="px-4 font-semibold">
                  <TrophyOutlined /> Riwayat Prestasi
                </span>
              ),
              children: (
                <div className="p-4 sm:p-6 bg-white min-h-[300px]">
                  <Skeleton loading={isLoading} active paragraph={{ rows: 5 }}>
                    <Table 
                      columns={prestasiColumns} 
                      dataSource={prestasiData} 
                      rowKey="id" 
                      pagination={false} 
                      scroll={{ x: 600 }}
                      locale={{ emptyText: 'Belum ada catatan prestasi' }}
                    />
                  </Skeleton>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
