"use client";

import React, { useState } from 'react';
import { Typography, Button, Space, Breadcrumb, Form, Input, Select, DatePicker, Upload, App } from 'antd';
import { 
  SaveOutlined, 
  ArrowLeftOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dayjs from 'dayjs';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { siswaService } from '@/services/data-induk/siswa.service';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function PengajuanIzinPage() {
  const { message } = App.useApp();
  const router = useRouter();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [siswaOptions, setSiswaOptions] = useState<any[]>([]);

  React.useEffect(() => {
    siswaService.findAll().then(res => {
      if (res) {
        setSiswaOptions(res.map((s: any) => ({
          value: s.id,
          label: `${s.name} (${s.kelas?.name || '-'})`
        })));
      }
    }).catch(console.error);
  }, []);

  const onFinish = (values: any) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      message.success('Pengajuan izin/sakit berhasil dikirim!');
      router.push('/presensi/perizinan');
    }, 800);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: <Link href="/presensi">Presensi</Link> },
          { title: <Link href="/presensi/perizinan">Perizinan & Sakit</Link> },
          { title: 'Pengajuan Baru' },
        ]} />
      </div>

      <ToolbarWrapper>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.push('/presensi/perizinan')}
          className="px-2 ml-2 mr-2"
        />
        <span className="text-gray-800 font-bold">Form Pengajuan Izin / Sakit</span>
        
        <div className="ml-auto flex gap-2">
          <ButtonToolbar 
            message="Kirim Pengajuan" 
            icon={<SaveOutlined />} 
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => form.submit()}
            loading={saving}
          />
        </div>
      </ToolbarWrapper>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-1 max-w-2xl">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            tanggal: dayjs(),
            jenis: 'Sakit'
          }}
        >
          <Form.Item
            name="siswaId"
            label="Pilih Siswa"
            rules={[{ required: true, message: 'Harap pilih siswa' }]}
          >
            <Select
              showSearch
              placeholder="Cari nama siswa..."
              options={siswaOptions}
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="tanggal"
              label="Tanggal Tidak Hadir"
              rules={[{ required: true, message: 'Harap pilih tanggal' }]}
            >
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>

            <Form.Item
              name="jenis"
              label="Jenis Pengajuan"
              rules={[{ required: true, message: 'Harap pilih jenis' }]}
            >
              <Select
                options={[
                  { value: 'Sakit', label: 'Sakit' },
                  { value: 'Izin', label: 'Izin' },
                ]}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="keterangan"
            label="Keterangan Detail (Alasan)"
            rules={[{ required: true, message: 'Harap isi keterangan' }]}
          >
            <TextArea rows={4} placeholder="Contoh: Sakit demam berdarah, dirawat di RS..." />
          </Form.Item>

          <Form.Item
            name="lampiran"
            label="Lampiran Bukti (Surat Dokter / Surat Keterangan Orang Tua)"
            extra="Format yang diizinkan: PDF, JPG, PNG. Maksimal 2MB."
          >
            <Upload 
              name="file" 
              action="/api/upload" 
              listType="text"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Pilih File (Opsional)</Button>
            </Upload>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
