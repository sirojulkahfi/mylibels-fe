"use client";

import React, { useState, useEffect } from 'react';
import { Typography, Input, Button, Card, Spin, Alert, Breadcrumb } from 'antd';
import { 
  QrcodeOutlined,
  CheckCircleFilled,
  WarningFilled
} from '@ant-design/icons';
import Link from 'next/link';
import { siswaService } from '@/services/data-induk/siswa.service';

const { Title, Text } = Typography;

export default function ScanPresensiPage() {
  const [scannedCode, setScannedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{success: boolean, name?: string, message: string} | null>(null);
  const [siswaName, setSiswaName] = useState('Siswa Terdaftar');

  useEffect(() => {
    siswaService.findAll().then(res => {
      if (res && res.length > 0) {
        setSiswaName(`${res[0].name} (${res[0].kelas?.name || '-'})`);
      }
    }).catch(console.error);
  }, []);

  const handleScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && scannedCode) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        if (scannedCode.includes('7')) { // Dummy logic: if code has 7, success
          setResult({
            success: true,
            name: siswaName,
            message: 'Berhasil check-in pada 06:45 WIB'
          });
        } else {
          setResult({
            success: false,
            message: 'Siswa tidak ditemukan atau kartu tidak valid'
          });
        }
        setScannedCode(''); // Clear input for next scan
      }, 600);
    }
  };

  // Auto-clear result after 3 seconds
  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        setResult(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: <Link href="/presensi">Presensi</Link> },
          { title: 'Scan Barcode / QR' },
        ]} />
      </div>

      <div className="flex flex-1 justify-center items-center py-10">
        <Card className="w-full max-w-lg shadow-xl border-0 rounded-2xl overflow-hidden" styles={{ body: { padding: 0 } }}>
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white p-8 text-center relative overflow-hidden shadow-inner">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full blur-xl -ml-10 -mb-10"></div>
            
            <div className="relative z-10">
              <QrcodeOutlined className="text-6xl mb-4 drop-shadow-md animate-pulse" />
              <Title level={3} className="!text-white !m-0 font-extrabold tracking-wide drop-shadow-md">SCANNER PRESENSI</Title>
              <Text className="text-blue-100 block mt-3 text-sm font-medium opacity-90">Arahkan ID Card Siswa/Guru ke Barcode Scanner</Text>
            </div>
          </div>
          
          <div className="p-8 flex flex-col items-center">
            <Input 
              autoFocus
              placeholder="Scan Barcode / QR Code..." 
              size="large"
              value={scannedCode}
              onChange={(e) => setScannedCode(e.target.value)}
              onKeyDown={handleScan}
              className="mb-8 text-center text-lg font-mono shadow-inner border border-blue-200 hover:border-blue-400 focus:border-blue-500 rounded-xl py-2 w-4/5 mx-auto block"
              prefix={<QrcodeOutlined className="text-blue-500 text-xl mr-2" />}
              autoComplete="off"
            />

            <div className="h-32 flex items-center justify-center w-full">
              {loading ? (
                <div className="flex flex-col items-center">
                  <Spin size="large" />
                  <span className="text-gray-500 mt-4">Memproses data...</span>
                </div>
              ) : result ? (
                <div className={`w-full p-4 rounded-xl flex items-start gap-4 ${result.success ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'}`}>
                  {result.success ? (
                    <CheckCircleFilled className="text-4xl text-emerald-500 mt-1" />
                  ) : (
                    <WarningFilled className="text-4xl text-red-500 mt-1" />
                  )}
                  <div>
                    {result.success && <div className="font-bold text-lg text-gray-800">{result.name}</div>}
                    <div className={result.success ? 'text-emerald-700' : 'text-red-600 font-medium'}>
                      {result.message}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-center w-full">
                  <div className="border border-dashed border-gray-300 bg-gray-50/50 rounded-2xl p-6 w-4/5 mx-auto flex flex-col items-center justify-center transition-all duration-300 hover:bg-gray-50 hover:border-gray-400">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                      <QrcodeOutlined className="text-xl text-gray-400 animate-bounce" />
                    </div>
                    <span className="font-medium text-gray-500">Menunggu hasil scan...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
