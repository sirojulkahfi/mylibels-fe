"use client";

import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Breadcrumb, Radio, App, Button } from 'antd';
import { BookOutlined, SaveOutlined } from '@ant-design/icons';
import Link from 'next/link';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import { settingsService } from '@/services/system/settings.service';

const { Title, Text } = Typography;

export default function SemesterPage() {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSemester, setActiveSemester] = useState('Ganjil');

  const fetchSemester = async () => {
    try {
      setLoading(true);
      const res = await settingsService.findAll();
      const semSetting = res.find((s: any) => s.key === 'ACTIVE_SEMESTER');
      if (semSetting) {
        setActiveSemester(semSetting.value);
      }
    } catch (error) {
      message.error('Gagal mengambil pengaturan semester');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSemester();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      // Determine if it exists, if not the backend needs to handle upsert or we call create.
      // Usually settings API has an upsert logic or we create if not found.
      const res = await settingsService.findAll();
      const semSetting = res.find((s: any) => s.key === 'ACTIVE_SEMESTER');
      
      if (semSetting) {
        await settingsService.update(semSetting.id, { value: activeSemester });
      } else {
        await settingsService.create({ key: 'ACTIVE_SEMESTER', value: activeSemester, group: 'Akademik' });
      }
      message.success(`Semester berhasil diubah menjadi ${activeSemester}`);
    } catch (error) {
      message.error("Gagal menyimpan semester");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: <Link href="/pengaturan">Pengaturan</Link> },
          { title: 'Semester Aktif' },
        ]} />
      </div>

      <ToolbarWrapper>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <BookOutlined className="text-xl text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold leading-tight">Pengaturan Semester</span>
            <span className="text-gray-200 text-xs">Ubah status semester ganjil/genap yang aktif saat ini</span>
          </div>
        </div>
      </ToolbarWrapper>

      <div className="flex-1 bg-white px-8 py-10 mt-2 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center">
        <div className="max-w-xl w-full text-center">
          <Title level={3} className="mb-2 text-gray-800">Pilih Semester Aktif</Title>
          <Text className="text-gray-500 block mb-8">
            Semester yang dipilih akan digunakan di seluruh modul sistem (Penilaian, Rapor, Presensi, dan Akademik).
          </Text>

          <Radio.Group 
            value={activeSemester} 
            onChange={(e) => setActiveSemester(e.target.value)} 
            disabled={loading || saving}
            className="w-full flex justify-center mb-10"
            size="large"
            buttonStyle="solid"
          >
            <Radio.Button value="Ganjil" className="w-40 text-center py-2 h-auto text-lg">Ganjil</Radio.Button>
            <Radio.Button value="Genap" className="w-40 text-center py-2 h-auto text-lg">Genap</Radio.Button>
          </Radio.Group>

          <Button 
            type="primary" 
            size="large" 
            icon={<SaveOutlined />} 
            onClick={handleSave}
            loading={saving}
            className="bg-blue-600 px-8"
          >
            Simpan Perubahan
          </Button>
        </div>
      </div>
    </div>
  );
}
