"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { App, Button, Card, DatePicker, Empty, Form, Input, Space, Spin, Table, Tag, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import { bkService } from '@/services/bk/bk.service';
import { siswaService } from '@/services/data-induk/siswa.service';

const { Text, Title } = Typography;

export default function KonselingDetailPage() {
  const params = useParams<{ siswaId: string }>();
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [student, setStudent] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const siswaId = params.siswaId;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentData, counselingData] = await Promise.all([
        siswaService.findOne(siswaId),
        bkService.findAllKonseling({ siswaId }),
      ]);
      setStudent(studentData);
      setRecords((counselingData || []).sort((a: any, b: any) => (
        new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
      )));
    } catch (error) {
      console.error(error);
      message.error('Gagal mengambil data konseling siswa');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (siswaId) fetchData();
  }, [siswaId]);

  const handleSubmit = async (values: { tanggal: Dayjs; topik: string; hasilKonseling: string }) => {
    setSaving(true);
    try {
      await bkService.createKonseling({
        siswaId,
        tanggal: values.tanggal.toISOString(),
        topik: values.topik,
        hasilKonseling: values.hasilKonseling,
      });
      form.resetFields();
      form.setFieldValue('tanggal', dayjs());
      message.success('Catatan konseling berhasil ditambahkan');
      await fetchData();
    } catch (error) {
      console.error(error);
      message.error('Gagal menyimpan catatan konseling');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'tanggal',
      key: 'tanggal',
      width: 150,
      render: (value: string) => value ? new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
      }) : '-',
    },
    {
      title: 'Topik Konseling',
      dataIndex: 'topik',
      key: 'topik',
      width: 220,
      render: (value: string) => <Text strong>{value || '-'}</Text>,
    },
    {
      title: 'Hasil Konseling',
      dataIndex: 'hasilKonseling',
      key: 'hasilKonseling',
      render: (value: string) => <div className="whitespace-pre-wrap text-gray-600">{value || '-'}</div>,
    },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2">
      <div className="mb-2 text-sm text-gray-500">
        Bimbingan Konseling / Catatan Konseling / {student?.name || 'Detail Siswa'}
      </div>

      <ToolbarWrapper>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>Kembali</Button>
        <Space className="ml-auto">
          <Button icon={<ReloadOutlined />} loading={loading} onClick={fetchData}>Muat Ulang</Button>
        </Space>
      </ToolbarWrapper>

      <div className="mt-1 flex flex-1 flex-col gap-4 overflow-auto">
        <Card className="border border-gray-100 shadow-sm" loading={loading && !student}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Text type="secondary">Siswa</Text>
              <Title level={4} className="!mb-1 !mt-1">{student?.name || 'Memuat data siswa...'}</Title>
              <Text type="secondary">
                NIS: {student?.nis || '-'} &nbsp; | &nbsp; NISN: {student?.nisn || '-'} &nbsp; | &nbsp; Kelas: {student?.class || '-'}
              </Text>
            </div>
            <Tag color="rose">{records.length} sesi konseling</Tag>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <Card title="Riwayat Konseling" className="border border-gray-100 shadow-sm">
            <Table
              columns={columns}
              dataSource={records}
              rowKey="id"
              loading={loading}
              locale={{ emptyText: <Empty description="Belum ada catatan konseling" /> }}
              pagination={{ pageSize: 8, showSizeChanger: true }}
              scroll={{ x: 600 }}
              size="small"
              bordered
            />
          </Card>

          <Card title="Tambah Sesi Konseling" className="h-fit border border-gray-100 shadow-sm">
            <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ tanggal: dayjs() }}>
              <Form.Item name="tanggal" label="Tanggal" rules={[{ required: true, message: 'Tanggal wajib diisi' }]}>
                <DatePicker className="w-full" format="DD/MM/YYYY" />
              </Form.Item>
              <Form.Item name="topik" label="Topik Konseling" rules={[{ required: true, message: 'Topik wajib diisi' }]}>
                <Input placeholder="Contoh: Adaptasi belajar" />
              </Form.Item>
              <Form.Item name="hasilKonseling" label="Hasil Konseling" rules={[{ required: true, message: 'Hasil konseling wajib diisi' }]}>
                <Input.TextArea rows={5} placeholder="Tuliskan hasil dan tindak lanjut konseling" />
              </Form.Item>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={saving} block>
                Simpan Catatan
              </Button>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}
