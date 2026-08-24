"use client";

import React, { useState, useEffect } from 'react';
import { Breadcrumb, App, Card, Form, TimePicker, Button, Divider, Skeleton } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { settingsService } from '@/services/system/settings.service';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';

export default function PengaturanPresensiPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // The keys we care about
  const SETTING_KEYS = [
    'PRESENSI_SISWA_MASUK_START',
    'PRESENSI_SISWA_MASUK_END',
    'PRESENSI_SISWA_PULANG_START',
    'PRESENSI_GURU_MASUK_START',
    'PRESENSI_GURU_MASUK_END',
    'PRESENSI_GURU_PULANG_START',
  ];

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await settingsService.findAll();
      const allSettings = res.data || [];
      
      const initialValues: any = {};
      
      SETTING_KEYS.forEach(key => {
        const setting = allSettings.find((s: any) => s.key === key);
        if (setting && setting.value) {
          // Parse time "HH:mm" to dayjs
          const [hours, minutes] = setting.value.split(':');
          initialValues[key] = dayjs().hour(parseInt(hours)).minute(parseInt(minutes));
        } else {
          // Defaults
          if (key.includes('MASUK_START')) initialValues[key] = dayjs().hour(5).minute(30);
          else if (key === 'PRESENSI_SISWA_MASUK_END') initialValues[key] = dayjs().hour(7).minute(15);
          else if (key === 'PRESENSI_GURU_MASUK_END') initialValues[key] = dayjs().hour(7).minute(0);
          else if (key.includes('PULANG_START')) initialValues[key] = dayjs().hour(15).minute(0);
        }
      });
      
      form.setFieldsValue(initialValues);
    } catch (error) {
      message.error('Gagal mengambil pengaturan presensi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const onFinish = async (values: any) => {
    setSaving(true);
    try {
      // Convert dayjs back to "HH:mm"
      const promises = SETTING_KEYS.map(key => {
        const timeValue = values[key] ? values[key].format('HH:mm') : '00:00';
        return settingsService.update(key, { value: timeValue, description: 'Konfigurasi Jam Presensi' });
      });
      
      await Promise.all(promises);
      message.success('Pengaturan jam presensi berhasil disimpan!');
    } catch (error) {
      message.error('Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[{ title: 'Pengaturan' }, { title: 'Jam Presensi' }]} />
      </div>
      
      <ToolbarWrapper>
        <span className="text-white font-bold leading-tight flex-1 mr-4">Pengaturan Jam Presensi</span>
      </ToolbarWrapper>

      <div className="flex-1 overflow-auto mt-4">
        <Card className="max-w-4xl mx-auto shadow-sm rounded-xl">
          {loading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : (
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6">Konfigurasi Jam Presensi Siswa</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Form.Item label="Mulai Absen Masuk" name="PRESENSI_SISWA_MASUK_START" tooltip="Jam paling awal siswa boleh absen masuk">
                  <TimePicker format="HH:mm" className="w-full" size="large" />
                </Form.Item>
                <Form.Item label="Batas Terlambat (Masuk)" name="PRESENSI_SISWA_MASUK_END" tooltip="Lewat dari jam ini akan dihitung terlambat">
                  <TimePicker format="HH:mm" className="w-full" size="large" />
                </Form.Item>
                <Form.Item label="Mulai Absen Pulang" name="PRESENSI_SISWA_PULANG_START" tooltip="Jam paling awal siswa boleh absen pulang">
                  <TimePicker format="HH:mm" className="w-full" size="large" />
                </Form.Item>
              </div>

              <Divider />

              <h2 className="text-xl font-bold text-gray-800 mb-6 mt-4">Konfigurasi Jam Presensi Guru</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Form.Item label="Mulai Absen Masuk" name="PRESENSI_GURU_MASUK_START">
                  <TimePicker format="HH:mm" className="w-full" size="large" />
                </Form.Item>
                <Form.Item label="Batas Terlambat (Masuk)" name="PRESENSI_GURU_MASUK_END">
                  <TimePicker format="HH:mm" className="w-full" size="large" />
                </Form.Item>
                <Form.Item label="Mulai Absen Pulang" name="PRESENSI_GURU_PULANG_START">
                  <TimePicker format="HH:mm" className="w-full" size="large" />
                </Form.Item>
              </div>

              <div className="flex justify-end mt-8 pt-4 border-t border-gray-100">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SaveOutlined />} 
                  size="large"
                  loading={saving}
                  className="bg-emerald-500 hover:bg-emerald-600 border-none px-8"
                >
                  Simpan Pengaturan
                </Button>
              </div>
            </Form>
          )}
        </Card>
      </div>
    </div>
  );
}
