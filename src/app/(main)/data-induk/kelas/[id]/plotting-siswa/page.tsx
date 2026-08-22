"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Transfer, Card, Button, message, Space, Spin, Tag } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { kelasService } from '@/services/data-induk/kelas.service';
import { siswaService } from '@/services/data-induk/siswa.service';

export default function PlottingSiswaPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [kelas, setKelas] = useState<any>(null);
  const [allSiswa, setAllSiswa] = useState<any[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch class detail
        const kelasRes = await kelasService.findAll();
        const currentKelas = kelasRes.find((k: any) => k.id === id);
        
        if (!currentKelas) {
          message.error('Data kelas tidak ditemukan');
          router.push('/data-induk/kelas');
          return;
        }
        setKelas(currentKelas);

        // Fetch all students
        const siswaRes = await siswaService.findAll();
        
        // Target keys are students whose class matches currentKelas.name
        const currentStudents = siswaRes.filter((s: any) => s.class === currentKelas.name).map((s: any) => s.id);
        
        setAllSiswa(siswaRes);
        setTargetKeys(currentStudents);
      } catch (error) {
        console.error(error);
        message.error('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, router]);

  const handleChange = (newTargetKeys: string[]) => {
    setTargetKeys(newTargetKeys);
  };

  const handleSave = async () => {
    if (!kelas) return;
    try {
      setSaving(true);
      await siswaService.bulkUpdateClass(targetKeys, kelas.name);
      message.success(`Berhasil menyimpan ${targetKeys.length} siswa ke kelas ${kelas.name}`);
      router.push('/data-induk/kelas');
    } catch (error) {
      console.error(error);
      message.error('Gagal menyimpan plotting siswa');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Spin size="large" />
        <span className="text-gray-500">Memuat data plotting...</span>
      </div>
    );
  }

  // Format data for Transfer component
  const mockData = allSiswa.map(s => ({
    key: s.id,
    title: s.name,
    description: s.nisn,
    currentClass: s.class,
  }));

  const renderItem = (item: any) => {
    const isCurrentClass = item.currentClass === kelas?.name;
    const hasClass = item.currentClass && item.currentClass !== '-' && item.currentClass !== '';
    
    return {
      label: (
        <div className="flex justify-between items-center w-full pr-4">
          <div className="flex flex-col">
            <span className="font-medium text-gray-800">{item.title}</span>
            <span className="text-xs text-gray-400">NISN: {item.description}</span>
          </div>
          {!isCurrentClass && hasClass && (
            <Tag color="orange" className="text-[10px] m-0">Dari {item.currentClass}</Tag>
          )}
          {!hasClass && (
            <Tag color="default" className="text-[10px] m-0">Belum ada kelas</Tag>
          )}
        </div>
      ),
      value: item.title,
    };
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between shrink-0">
        <div>
          <div className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 mb-0.5">
            <UsergroupAddOutlined className="text-blue-600 text-xs" />
            Plotting Siswa - Kelas {kelas?.name}
          </div>
          <p className="text-gray-500 text-[10px] leading-tight m-0">
            Pindahkan siswa dari kiri ke kanan untuk merubah kelas mereka.
          </p>
        </div>
        <Button 
          size="small"
          className="text-xs h-7 px-2"
          icon={<ArrowLeftOutlined className="text-[10px]" />} 
          onClick={() => router.push('/data-induk/kelas')}
        >
          Kembali
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex-1 min-h-0 flex flex-col p-4">
        <div className="flex justify-center flex-1 overflow-x-auto min-h-0 pb-2">
          <Transfer
            className="h-full flex items-stretch"
            dataSource={mockData}
            showSearch
            listStyle={{
              width: 450,
              height: '100%',
              minHeight: 300
            }}
            titles={[
              <span key="left" className="font-bold">Daftar Seluruh Siswa</span>, 
              <span key="right" className="font-bold text-blue-600">Siswa di Kelas {kelas?.name}</span>
            ]}
            targetKeys={targetKeys}
            onChange={handleChange}
            render={renderItem}
            searchPlaceholder="Cari nama atau NISN siswa..."
            notFoundContent="Siswa tidak ditemukan"
          />
        </div>
        
        <div className="flex justify-end mt-4 pt-4 border-t border-gray-100 shrink-0">
          <Space>
            <Button onClick={() => router.push('/data-induk/kelas')}>
              Batal
            </Button>
            <Button 
              type="primary" 
              icon={<SaveOutlined />} 
              onClick={handleSave} 
              loading={saving}
              className="bg-blue-600"
            >
              Simpan Data Plotting
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
}
