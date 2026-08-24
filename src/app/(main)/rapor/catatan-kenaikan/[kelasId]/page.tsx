"use client";

import React, { useState } from 'react';
import { Table, Input, Select, Breadcrumb, Button, Modal, Form, Radio, App } from 'antd';
import { SearchOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  ProfileOutlined, ReloadOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import { raporService } from '@/services/rapor/rapor.service';
import { kelasService } from '@/services/data-induk/kelas.service';

const { TextArea } = Input;

export default function RaporCatatanKenaikanPage() {
  const router = useRouter();
  const params = useParams();
  const kelasId = params.kelasId as string;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [kelasName, setKelasName] = useState<string>('...');
  const { message } = App.useApp();

  const fetchData = async () => {
      try {
        // Ambil nama kelas dari API
        const kelasList = await kelasService.findAll();
        const found = kelasList?.find((k: any) => k.id === kelasId);
        if (found) setKelasName(found.name);
        else setKelasName('Tidak Ditemukan');

        const res = await raporService.getCatatanKenaikan(kelasId, "Ganjil", "2023/2024");
        setData(res || []);
      } catch (error) {
        message.error("Gagal mengambil data catatan & kenaikan siswa");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, [kelasId]);

  const columns = [
    {
      title: 'No',
      key: 'index',
      width: 60,
      align: 'center' as const,
      render: (text: any, record: any, index: number) => index + 1,
    },
    {
      title: 'Nama Siswa',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{text}</span>
          <span className="text-xs text-gray-400">NISN: {record.nisn}</span>
        </div>
      ),
    },
    {
      title: 'Catatan Wali Kelas',
      dataIndex: 'notes',
      key: 'notes',
      width: 300,
      render: (text: string) => text ? <span className="text-gray-600 italic">&quot;{text}&quot;</span> : <span className="text-gray-300 italic">Belum ada catatan</span>
    },
    {
      title: 'Status Kenaikan',
      dataIndex: 'promotion',
      key: 'promotion',
      width: 150,
      align: 'center' as const,
      render: (status: string) => {
        if (!status) return <span className="text-gray-300">-</span>;
        if (status === 'Naik Kelas') return <span className="text-emerald-600 font-bold">{status}</span>;
        return <span className="text-red-500 font-bold">{status}</span>;
      }
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Button 
          type="primary" 
          icon={<EditOutlined />} 
          className="bg-blue-500 shadow-none hover:bg-blue-400"
          onClick={() => {
            setSelectedStudent(record);
            form.setFieldsValue({
              notes: record.notes,
              promotion: record.promotion || 'Naik Kelas'
            });
            setIsModalOpen(true);
          }}
          size="small"
        >
          Isi
        </Button>
      ),
    },
  ];

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await raporService.saveCatatanKenaikan(kelasId, {
        semester: 'Ganjil',
        tahunAjaran: '2023/2024',
        data: [{ siswaId: selectedStudent.id, notes: values.notes, promotion: values.promotion }]
      });
      message.success("Berhasil menyimpan catatan");
      setData(data.map(item => {
        if (item.id === selectedStudent.id) {
          return { ...item, notes: values.notes, promotion: values.promotion, saved: true };
        }
        return item;
      }));
      setIsModalOpen(false);
    } catch (error) {
      message.error("Gagal menyimpan catatan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: <Link href="/rapor">Manajemen Rapor</Link> },
          { title: 'Catatan & Kenaikan' },
        ]} />
      </div>

      <ToolbarWrapper>
        <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading} type="default" className="mr-2">
          Muat Ulang
        </Button>
        
        <div className="flex flex-col ml-4 mr-4 hidden md:flex">
          <span className="text-white font-bold leading-tight">Catatan & Kenaikan Kelas</span>
          <span className="text-gray-200 text-xs">Kelas {kelasName}</span>
        </div>
        <Input 
          placeholder="Cari siswa..." 
          prefix={<SearchOutlined />} 
          className="w-48"
        />
        
        <div className="ml-auto flex gap-2">
          <Button 
            icon={<SaveOutlined />} 
            type="primary"
            className="bg-emerald-500 border-0 hover:bg-emerald-400"
          >
            Simpan Semua
          </Button>
        </div>
      </ToolbarWrapper>

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-1 mt-1 rounded-lg shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0">
        <div className="mb-4 mt-2 bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm text-blue-800">
          <strong>Informasi:</strong> Pengisian catatan wali kelas dan status kenaikan akan muncul di lembar akhir rapor siswa. Pastikan telah terisi sebelum melakukan pencetakan.
        </div>
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          pagination={false}
          size="small" bordered
          scroll={{ y: 'calc(100vh - 320px)' }}
        />
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <ProfileOutlined className="text-blue-600" />
            </div>
            <span>Catatan untuk {selectedStudent?.name}</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit} className="mt-4">
          <Form.Item name="notes" label="Catatan Perkembangan Siswa" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Tuliskan catatan motivasi atau perkembangan akademik siswa..." />
          </Form.Item>

          <Form.Item name="promotion" label="Keputusan Kenaikan / Kelulusan" rules={[{ required: true }]}>
            <Radio.Group className="flex flex-col gap-2">
              <Radio value="Naik Kelas">Naik Kelas (ke tingkat selanjutnya)</Radio>
              <Radio value="Tinggal Kelas">Tinggal Kelas</Radio>
              <Radio value="Lulus">Lulus (Untuk kelas IX/XII)</Radio>
              <Radio value="Tidak Lulus">Tidak Lulus (Untuk kelas IX/XII)</Radio>
            </Radio.Group>
          </Form.Item>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="primary" htmlType="submit" className="bg-emerald-600">Simpan Catatan</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
