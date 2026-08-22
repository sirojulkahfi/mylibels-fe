"use client";

import React, { useState } from 'react';
import { Breadcrumb, Button, Typography, Steps, Progress, message, Card } from 'antd';
import { 
  ArrowLeftOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  SettingOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import { kelasService } from '@/services/data-induk/kelas.service';

const { Title, Text } = Typography;

export default function PlotOtomatisJadwalPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [defaultKelasId, setDefaultKelasId] = useState('');

  React.useEffect(() => {
    kelasService.findAll().then(res => {
      if (res && res.length > 0) setDefaultKelasId(res[0].id);
    }).catch(console.error);
  }, []);

  const startGenerating = () => {
    setIsGenerating(true);
    setProgress(0);
    
    // Simulate generation progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setCurrentStep(2);
          message.success('Jadwal berhasil disusun secara otomatis!');
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 500);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: <Link href="/akademik/jadwal-pelajaran">Jadwal Pelajaran</Link> },
          { title: 'Plot Otomatis' },
        ]} />
      </div>

      <ToolbarWrapper>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.push('/akademik/jadwal-pelajaran')}
          className="border-0 flex items-center shadow-none hover:opacity-80 px-3 ml-2 mr-4"
          style={{ color: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          Kembali
        </Button>
        <div className="flex flex-col">
          <span className="text-white font-bold leading-tight">Plot Jadwal Otomatis (Beta)</span>
          <span className="text-gray-200 text-xs">Otomasi penyusunan jadwal menggunakan AI Optimizer</span>
        </div>
      </ToolbarWrapper>

      <div className="bg-white p-8 mt-1 rounded-lg shadow-sm border border-gray-100 flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        <Steps
          current={currentStep}
          items={[
            { title: 'Persiapan Data', icon: <SettingOutlined /> },
            { title: 'Proses Plotting AI', icon: <ThunderboltOutlined /> },
            { title: 'Selesai & Review', icon: <CheckCircleOutlined /> },
          ]}
          className="mb-12 w-full max-w-2xl"
        />

        {currentStep === 0 && (
          <div className="flex flex-col items-center max-w-lg text-center">
            <ThunderboltOutlined className="text-6xl text-amber-500 mb-6" />
            <Title level={3} className="mb-2">AI Jadwal Optimizer</Title>
            <Text className="text-gray-500 mb-8">
              Sistem akan secara otomatis menyusun jadwal untuk seluruh kelas berdasarkan ketersediaan guru, beban mengajar, dan menghindari bentrok jadwal. Proses ini mungkin memakan waktu beberapa saat.
            </Text>
            <Button 
              type="primary" 
              size="large" 
              icon={<PlayCircleOutlined />} 
              className="bg-amber-500 border-0 hover:bg-amber-400 font-bold px-8 h-12 text-lg"
              onClick={() => {
                setCurrentStep(1);
                startGenerating();
              }}
            >
              Mulai Plotting Jadwal
            </Button>
          </div>
        )}

        {currentStep === 1 && (
          <div className="flex flex-col items-center max-w-lg w-full text-center">
            <Title level={4} className="mb-6">Sedang Menyusun Jadwal...</Title>
            <Progress 
              percent={progress} 
              status="active" 
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              className="mb-4"
            />
            <Text className="text-gray-400 italic">Menganalisis ketersediaan guru dan ruang kelas...</Text>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex flex-col items-center max-w-lg text-center">
            <CheckCircleOutlined className="text-6xl text-emerald-500 mb-6" />
            <Title level={3} className="mb-2">Plotting Selesai!</Title>
            <Text className="text-gray-500 mb-8">
              Sistem berhasil menyusun jadwal tanpa ada bentrok. Anda dapat meninjau hasilnya dan melakukan penyesuaian manual jika diperlukan.
            </Text>
            <div className="flex gap-4">
              <Button 
                onClick={() => setCurrentStep(0)}
              >
                Ulangi Plotting
              </Button>
              <Button 
                type="primary" 
                className="bg-blue-600 border-0"
                onClick={() => {
                  if (defaultKelasId) {
                    router.push(`/akademik/jadwal-pelajaran/rombel/${defaultKelasId}`);
                  } else {
                    router.push('/akademik/jadwal-pelajaran');
                  }
                }}
              >
                Lihat Hasil Jadwal
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
