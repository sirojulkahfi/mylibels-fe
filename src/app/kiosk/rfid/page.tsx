'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Typography, Row, Col, Avatar, Tag, App, Divider } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { siswaService } from '@/services/data-induk/siswa.service';
import { presensiService } from '@/services/presensi/presensi.service';
import { guruStafService } from '@/services/data-induk/guru-staf.service';

dayjs.locale('id');

const { Title, Text } = Typography;

interface ScanResult {
  id: string;
  name: string;
  nisn?: string;
  nik?: string;
  type: 'siswa' | 'guru';
  time: string;
  status: 'success' | 'error';
  message: string;
  photo?: string;
}

export default function RFIDScanPage() {
  const { message } = App.useApp();
  const inputRef = useRef<any>(null);
  
  const [time, setTime] = useState(dayjs());
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  
  const [allSiswa, setAllSiswa] = useState<any[]>([]);
  const [allGuru, setAllGuru] = useState<any[]>([]);

  // Fetch all users for local lookup (simulate fast scanning)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [resSiswa, resGuru] = await Promise.all([
          siswaService.findAll(),
          guruStafService.findAll()
        ]);
        setAllSiswa(resSiswa || []);
        setAllGuru(resGuru || []);
      } catch (error) {
        console.error('Gagal memuat data pengguna', error);
      }
    };
    fetchUsers();
  }, []);

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => setTime(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Always keep focus on input
  useEffect(() => {
    const focusTimer = setInterval(() => {
      if (inputRef.current && document.activeElement !== inputRef.current.input) {
        inputRef.current.focus();
      }
    }, 1000);
    return () => clearInterval(focusTimer);
  }, []);

  const handleScan = async (uid: string) => {
    if (!uid.trim()) return;
    setIsProcessing(true);
    const scanTime = dayjs().format('HH:mm:ss');
    
    try {
      // 1. Cari di Siswa (pakai NISN atau NIS)
      let matchedUser = allSiswa.find(s => s.nisn === uid || s.nis === uid);
      let userType: 'siswa' | 'guru' = 'siswa';
      
      // 2. Jika tidak ada di Siswa, cari di Guru (pakai NIK)
      if (!matchedUser) {
        matchedUser = allGuru.find(g => g.nik === uid);
        userType = 'guru';
      }

      if (matchedUser) {
        // Mock save to backend
        if (userType === 'siswa') {
          await presensiService.createSiswa({
            siswaId: matchedUser.id,
            status: 'Hadir',
            tanggal: dayjs().format('YYYY-MM-DD'),
            keterangan: 'Scan RFID'
          });
        } else {
          await presensiService.createGuru({
            guruId: matchedUser.id,
            status: 'Hadir',
            tanggal: dayjs().format('YYYY-MM-DD'),
            keterangan: 'Scan RFID'
          });
        }

        const result: ScanResult = {
          id: matchedUser.id,
          name: matchedUser.namaLengkap || matchedUser.name,
          nisn: matchedUser.nisn,
          nik: matchedUser.nik,
          type: userType,
          time: scanTime,
          status: 'success',
          message: 'Kehadiran Berhasil Tercatat',
        };

        setLastScan(result);
        setScanHistory(prev => [result, ...prev].slice(0, 10)); // Keep last 10
      } else {
        const errorResult: ScanResult = {
          id: 'unknown',
          name: 'Data Tidak Ditemukan',
          type: 'siswa',
          time: scanTime,
          status: 'error',
          message: `UID/NISN ${uid} tidak terdaftar`,
        };
        setLastScan(errorResult);
        setScanHistory(prev => [errorResult, ...prev].slice(0, 10));
      }
    } catch (error) {
      console.error(error);
      message.error('Terjadi kesalahan saat memproses presensi');
    } finally {
      setInputValue('');
      setIsProcessing(false);
      // Auto focus kembali
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleScan(inputValue);
    }
  };

  return (
    <div 
      className="flex flex-col min-h-[calc(100vh-100px)] bg-slate-900 rounded-xl overflow-hidden p-6 relative"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Hidden input for RFID Scanner */}
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={isProcessing}
        autoFocus
        style={{ position: 'absolute', top: '-100px', left: '-100px', opacity: 0 }}
      />

      <Row gutter={24} className="h-full flex-1">
        {/* Left Side: Scanner & Last Result */}
        <Col span={16} className="flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800 p-8 mb-6 relative overflow-hidden shadow-inner">
            
            <div className="text-center mb-8">
              <Title style={{ color: '#fff', fontSize: '5rem', margin: 0, fontWeight: 300, letterSpacing: '4px' }}>
                {time.format('HH:mm:ss')}
              </Title>
              <Text className="text-slate-400 text-xl tracking-widest uppercase">
                {time.format('dddd, DD MMMM YYYY')}
              </Text>
            </div>

            <div className="bg-slate-700/50 w-full max-w-lg rounded-2xl p-6 backdrop-blur-sm border border-slate-600 shadow-2xl transition-all duration-500 transform hover:scale-105">
              {!lastScan ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto bg-slate-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <UserOutlined className="text-4xl text-slate-400" />
                  </div>
                  <Title level={4} style={{ color: '#94a3b8', margin: 0 }}>Tempelkan Kartu RFID Anda</Title>
                  <Text className="text-slate-500">Menunggu scan...</Text>
                </div>
              ) : (
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <Avatar 
                      size={120} 
                      icon={<UserOutlined />} 
                      src={lastScan.photo}
                      className={`border-4 ${lastScan.status === 'success' ? 'border-emerald-500' : 'border-red-500'} shadow-lg`}
                    />
                    <div className={`absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center ${lastScan.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'} border-4 border-slate-800`}>
                      {lastScan.status === 'success' ? <CheckCircleOutlined className="text-white" /> : <CloseCircleOutlined className="text-white" />}
                    </div>
                  </div>
                  
                  <Title level={3} style={{ color: '#fff', margin: 0, marginBottom: '8px' }}>
                    {lastScan.name}
                  </Title>
                  
                  {lastScan.status === 'success' && (
                    <div className="mb-4">
                      <Tag color="blue" className="text-lg px-4 py-1 rounded-full border-0">
                        {lastScan.type === 'siswa' ? `NISN: ${lastScan.nisn}` : `NIK: ${lastScan.nik}`}
                      </Tag>
                    </div>
                  )}

                  <div className={`text-xl font-semibold mt-2 px-6 py-2 rounded-lg inline-block ${lastScan.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {lastScan.message} di {lastScan.time}
                  </div>
                </div>
              )}
            </div>
            
            <div className="absolute bottom-6 text-slate-500 text-sm">
              * Scanner siap. Arahkan kartu ke alat pembaca.
            </div>
          </div>
        </Col>

        {/* Right Side: History */}
        <Col span={8} className="flex flex-col">
          <Card 
            title={<span className="text-slate-200">Riwayat Scan Terakhir</span>} 
            className="flex-1 bg-slate-800 border-slate-700 shadow-xl overflow-hidden flex flex-col"
            headStyle={{ borderBottom: '1px solid #334155' }}
            bodyStyle={{ padding: 0, flex: 1, overflowY: 'auto' }}
          >
            {scanHistory.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-500 italic p-6 text-center">
                Belum ada data presensi hari ini
              </div>
            ) : (
              <div className="divide-y divide-slate-700/50">
                {scanHistory.map((scan, idx) => (
                  <div key={idx} className="p-4 flex items-center hover:bg-slate-700/30 transition-colors">
                    <Avatar 
                      icon={<UserOutlined />} 
                      className={`${scan.status === 'success' ? 'bg-emerald-600' : 'bg-red-600'} mr-4`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-200 font-semibold truncate">{scan.name}</div>
                      <div className="text-slate-400 text-xs truncate">
                        {scan.status === 'success' ? (scan.type === 'siswa' ? scan.nisn : scan.nik) : scan.message}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-300 font-mono text-sm">{scan.time}</div>
                      {scan.status === 'success' ? (
                        <Tag color="success" className="mr-0 mt-1 border-0 bg-emerald-500/20 text-emerald-400">Berhasil</Tag>
                      ) : (
                        <Tag color="error" className="mr-0 mt-1 border-0 bg-red-500/20 text-red-400">Gagal</Tag>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
