"use client";

import React, { useState, useEffect } from 'react';
import { Table, Input, Breadcrumb, Button, App } from 'antd';
import { SaveOutlined, 
  ArrowLeftOutlined,
  CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { kelasService } from '@/services/data-induk/kelas.service';
import { siswaService } from '@/services/data-induk/siswa.service';
import { penilaianService } from '@/services/penilaian/penilaian.service';

const { TextArea } = Input;

export default function CatatanWaliKelasDetailPage() {
  const router = useRouter();
  const params = useParams();
  const kelasId = params.kelasId as string;
  const { message } = App.useApp();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [kelasName, setKelasName] = useState<string>('...');
  const [data, setData] = useState<any[]>([]);

  const fetchData = async () => {
      try {
        // Ambil nama kelas
        const kelasList = await kelasService.findAll();
        const found = kelasList?.find((k: any) => k.id === kelasId);
        if (found) setKelasName(found.name);
        else setKelasName('Tidak Ditemukan');

        // Ambil siswa berdasarkan kelas
        const allSiswa = await siswaService.findAll();
        const siswaKelas = (allSiswa || []).filter((s: any) => s.kelasId === kelasId || s.class === found?.name);

        // Ambil catatan yang sudah ada
        const catatan = await penilaianService.findAllCatatanWK({ kelasId }).catch(() => []);

        // Gabungkan data
        const merged = siswaKelas.map((s: any) => {
          const existing = (catatan || []).find((c: any) => c.siswaId === s.id);
          return {
            ...s,
            catatan: existing?.catatan || '',
            catatanId: existing?.id || null,
          };
        });

        setData(merged);
      } catch (error) {
        message.error("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, [kelasId, message]);

  const handleNotesChange = (value: string, recordId: string) => {
    setData(prev => prev.map(item => item.id === recordId ? { ...item, catatan: value } : item));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const item of data) {
        if (item.catatan) {
          if (item.catatanId) {
            await penilaianService.updateCatatanWK(item.catatanId, {
              catatan: item.catatan,
              kelasId,
              siswaId: item.id,
              semester: 'Ganjil',
              tahunAjaran: '2023/2024'
            });
          } else {
            await penilaianService.createCatatanWK({
              catatan: item.catatan,
              kelasId,
              siswaId: item.id,
              semester: 'Ganjil',
              tahunAjaran: '2023/2024'
            });
          }
        }
      }
      message.success('Catatan wali kelas berhasil disimpan!');
    } catch (error) {
      message.error('Gagal menyimpan catatan');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: 'No',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
      align: 'center' as const,
    },
    {
      title: 'Nama Siswa',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      render: (text: string, record: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{text}</span>
          <span className="text-xs text-gray-400">NISN: {record.nisn || '-'}</span>
        </div>
      ),
    },
    {
      title: 'Catatan Wali Kelas',
      dataIndex: 'catatan',
      key: 'catatan',
      render: (_: any, record: any) => (
        <TextArea
          value={record.catatan}
          onChange={(e) => handleNotesChange(e.target.value, record.id)}
          rows={2}
          placeholder="Tuliskan catatan perkembangan siswa..."
          className="w-full"
        />
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 80,
      align: 'center' as const,
      render: (_: any, record: any) => (
        record.catatan && record.catatan.length > 5
          ? <CheckCircleOutlined className="text-emerald-500 text-lg" />
          : <span className="text-gray-300">-</span>
      )
    }
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: <Link href="/penilaian">Penilaian</Link> },
          { title: <Link href="/penilaian/catatan-wali-kelas">Catatan Wali Kelas</Link> },
          { title: `Kelas ${kelasName}` },
        ]} />
      </div>

      <ToolbarWrapper>
        <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading} type="default" className="mr-2">
          Muat Ulang
        </Button>
        
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.push('/penilaian/catatan-wali-kelas')}
          className="border-0 flex items-center shadow-none hover:opacity-80 px-3 ml-2 mr-4"
          style={{ color: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          Kembali
        </Button>
        <span className="text-white font-bold">Catatan Wali Kelas — Kelas {kelasName}</span>

        <ButtonToolbar 
          message="Simpan Catatan" 
          icon={<SaveOutlined />} 
          className="ml-auto bg-emerald-500 text-white hover:bg-emerald-600 border-none"
          onClick={handleSave}
          loading={saving}
        />
      </ToolbarWrapper>

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-4 mt-1 rounded-lg shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          pagination={false}
          size="small" bordered
          loading={loading}
          scroll={{ y: 'calc(100vh - 300px)' }}
        />
      </div>
    </div>
  );
}
