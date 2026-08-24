"use client";

import { use, useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Row, Statistic, Table, Tag, Typography } from 'antd';
import { ArrowLeftOutlined, BookOutlined, ReloadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { siswaService } from '@/services/data-induk/siswa.service';
import { mataPelajaranService } from '@/services/data-induk/mata-pelajaran.service';
import { penilaianService } from '@/services/penilaian/penilaian.service';

const { Title, Text } = Typography;

export default function TranskripNilaiPage({ params }: { params: Promise<{ siswaId: string }> }) {
  const { siswaId } = use(params);
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [grades, setGrades] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [studentData, formative, summative, subjectData] = await Promise.all([
        siswaService.findOne(siswaId),
        penilaianService.findAllFormatif({ siswaId }),
        penilaianService.findAllSumatif({ siswaId }),
        mataPelajaranService.findAll(),
      ]);
      setStudent(studentData?.data || studentData);
      setSubjects(subjectData?.data || subjectData || []);
      setGrades([
        ...(formative || []).map((item: any) => ({ ...item, jenis: 'Formatif' })),
        ...(summative || []).map((item: any) => ({ ...item, jenis: 'Sumatif' })),
      ]);
    } catch (requestError) {
      console.error(requestError);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [siswaId]);

  const average = grades.length ? grades.reduce((sum, item) => sum + Number(item.nilai || 0), 0) / grades.length : 0;
  const passed = grades.filter((item) => Number(item.nilai) >= (subjects.find((subject) => subject.id === item.mapelId)?.kkm || 75)).length;
  const columns = [
    { title: 'No.', key: 'no', width: 60, render: (_: any, __: any, index: number) => index + 1 },
    { title: 'Mata Pelajaran', dataIndex: 'mapelId', key: 'mapelId', render: (value: string) => subjects.find((subject) => subject.id === value)?.name || value || '-' },
    { title: 'Materi', dataIndex: 'materi', key: 'materi', render: (value: string) => value || '-' },
    { title: 'Jenis', dataIndex: 'jenis', key: 'jenis', render: (value: string) => <Tag color={value === 'Sumatif' ? 'blue' : 'green'}>{value}</Tag> },
    { title: 'Semester', dataIndex: 'semester', key: 'semester', render: (value: string) => value || '-' },
    { title: 'Nilai', dataIndex: 'nilai', key: 'nilai', render: (value: number) => <strong className={value >= 75 ? 'text-emerald-600' : 'text-red-600'}>{value ?? '-'}</strong> },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 min-h-0 overflow-auto bg-slate-50 p-4 pt-2">
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>Kembali</Button>
        <span>Laporan / Nilai Siswa / Transkrip</span>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><Title level={4} className="!mb-1">Transkrip Nilai Siswa</Title><Text type="secondary">Rekap nilai formatif dan sumatif yang tersimpan.</Text></div>
        <Button icon={<ReloadOutlined />} loading={loading} onClick={fetchData}>Muat Ulang</Button>
      </div>
      {error && <Alert type="error" showIcon message="Data nilai belum dapat dimuat" description="Periksa koneksi API lalu coba muat ulang." />}
      <Card loading={loading && !student} className="border border-gray-100 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><Text type="secondary">Siswa</Text><Title level={4} className="!mb-1 !mt-1">{student?.name || 'Memuat data siswa...'}</Title><Text type="secondary">NIS: {student?.nis || '-'} | NISN: {student?.nisn || '-'} | Kelas: {student?.class || '-'}</Text></div><BookOutlined className="text-3xl text-blue-500" /></div>
      </Card>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}><Card loading={loading}><Statistic title="Rata-rata Nilai" value={average} precision={1} /></Card></Col>
        <Col xs={24} sm={8}><Card loading={loading}><Statistic title="Total Penilaian" value={grades.length} /></Card></Col>
        <Col xs={24} sm={8}><Card loading={loading}><Statistic title="Nilai Di Atas KKM" value={passed} suffix={`/ ${grades.length}`} /></Card></Col>
      </Row>
      <Card title="Daftar Nilai" className="border border-gray-100 shadow-sm"><Table columns={columns} dataSource={grades} rowKey="id" loading={loading} pagination={{ pageSize: 15, showSizeChanger: true }} size="small" bordered locale={{ emptyText: 'Belum ada nilai siswa' }} scroll={{ x: 700 }} /></Card>
    </div>
  );
}
