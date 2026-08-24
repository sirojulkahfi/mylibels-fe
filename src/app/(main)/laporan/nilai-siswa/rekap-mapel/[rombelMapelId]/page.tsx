"use client";

import { use, useEffect, useState } from 'react';
import { Alert, Button, Card, Table, Tag, Typography } from 'antd';
import { ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { siswaService } from '@/services/data-induk/siswa.service';
import { mataPelajaranService } from '@/services/data-induk/mata-pelajaran.service';
import { penilaianService } from '@/services/penilaian/penilaian.service';

const { Title, Text } = Typography;

export default function RekapMapelPage({ params }: { params: Promise<{ rombelMapelId: string }> }) {
  const { rombelMapelId } = use(params);
  const router = useRouter();
  const [subject, setSubject] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [subjects, students, formative, summative] = await Promise.all([
        mataPelajaranService.findAll(),
        siswaService.findAll(),
        penilaianService.findAllFormatif({ mapelId: rombelMapelId }),
        penilaianService.findAllSumatif({ mapelId: rombelMapelId }),
      ]);
      const subjectList = subjects?.data || subjects || [];
      const studentList = students?.data || students || [];
      setSubject(subjectList.find((item: any) => item.id === rombelMapelId));
      const scores = [...(formative || []), ...(summative || [])];
      const grouped = studentList.map((student: any) => {
        const studentScores = scores.filter((score: any) => score.siswaId === student.id);
        const average = studentScores.length
          ? studentScores.reduce((sum: number, score: any) => sum + Number(score.nilai || 0), 0) / studentScores.length
          : 0;
        return {
          ...student,
          jumlahNilai: studentScores.length,
          rataRata: Math.round(average * 100) / 100,
          nilaiTerakhir: studentScores.length ? studentScores[studentScores.length - 1].nilai : null,
        };
      }).filter((student: any) => student.jumlahNilai > 0);
      setData(grouped.sort((a: any, b: any) => a.name.localeCompare(b.name)));
    } catch (requestError) {
      console.error(requestError);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [rombelMapelId]);

  const columns = [
    { title: 'No.', key: 'no', width: 60, render: (_: any, __: any, index: number) => index + 1 },
    { title: 'Nama Siswa', dataIndex: 'name', key: 'name', render: (value: string) => <Text strong>{value}</Text> },
    { title: 'Kelas', dataIndex: 'class', key: 'class', render: (value: string) => value || '-' },
    { title: 'Jumlah Nilai', dataIndex: 'jumlahNilai', key: 'jumlahNilai' },
    { title: 'Rata-rata', dataIndex: 'rataRata', key: 'rataRata', render: (value: number) => <Tag color={value >= 75 ? 'green' : 'orange'}>{value}</Tag> },
    { title: 'Nilai Terakhir', dataIndex: 'nilaiTerakhir', key: 'nilaiTerakhir', render: (value: number | null) => value ?? '-' },
  ];

  return <div className="flex flex-1 flex-col gap-4 min-h-0 overflow-auto bg-slate-50 p-4 pt-2">
    <div className="flex items-center gap-3"><Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>Kembali</Button><span className="text-sm text-gray-500">Laporan / Nilai Siswa / Rekap Mata Pelajaran</span></div>
    <div className="flex flex-wrap items-end justify-between gap-3"><div><Title level={4} className="!mb-1">Rekap Nilai Mata Pelajaran</Title><Text type="secondary">{subject?.name || (loading ? 'Memuat mata pelajaran...' : 'Mata pelajaran tidak ditemukan')}</Text></div><Button icon={<ReloadOutlined />} loading={loading} onClick={fetchData}>Muat Ulang</Button></div>
    {error && <Alert type="error" showIcon message="Data rekap nilai belum dapat dimuat" description="Periksa koneksi API lalu coba lagi." />}
    <Card className="border border-gray-100 shadow-sm"><Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={{ pageSize: 15, showSizeChanger: true }} size="small" bordered locale={{ emptyText: 'Belum ada nilai untuk mata pelajaran ini' }} /></Card>
  </div>;
}
