"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Alert, Button, Card, Input, Table, Typography } from 'antd';
import { ArrowRightOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { siswaService } from '@/services/data-induk/siswa.service';

const { Title, Text } = Typography;

export default function RekapSiswaPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await siswaService.findAll();
      setStudents(response?.data || response || []);
    } catch (requestError) {
      console.error(requestError);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const filteredStudents = students.filter((student) => {
    const keyword = search.toLowerCase();
    return [student.name, student.nis, student.nisn, student.class]
      .some((value) => String(value || '').toLowerCase().includes(keyword));
  });

  const columns = [
    { title: 'No.', key: 'no', width: 60, render: (_: any, __: any, index: number) => index + 1 },
    { title: 'Nama Siswa', dataIndex: 'name', key: 'name', render: (value: string) => <Text strong>{value}</Text> },
    { title: 'NIS', dataIndex: 'nis', key: 'nis', render: (value: string) => value || '-' },
    { title: 'NISN', dataIndex: 'nisn', key: 'nisn', render: (value: string) => value || '-' },
    { title: 'Kelas', dataIndex: 'class', key: 'class', render: (value: string) => value || '-' },
    { title: 'Aksi', key: 'action', width: 140, render: (_: any, student: any) => <Link href={`/laporan/absensi/rekap-siswa/${student.id}`}><Button type="primary" icon={<ArrowRightOutlined />}>Detail</Button></Link> },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 min-h-0 overflow-auto bg-slate-50 p-4 pt-2">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><Title level={4} className="!mb-1">Rekap Absensi Siswa</Title><Text type="secondary">Pilih siswa untuk melihat riwayat presensi secara detail.</Text></div>
        <Button icon={<ReloadOutlined />} loading={loading} onClick={fetchStudents}>Muat Ulang</Button>
      </div>
      {error && <Alert type="error" showIcon message="Data siswa belum dapat dimuat" description="Periksa koneksi API lalu coba lagi." />}
      <Card className="border border-gray-100 shadow-sm">
        <Input allowClear prefix={<SearchOutlined />} placeholder="Cari nama, NIS, NISN, atau kelas" value={search} onChange={(event) => setSearch(event.target.value)} className="mb-4 max-w-md" />
        <Table columns={columns} dataSource={filteredStudents} rowKey="id" loading={loading} pagination={{ pageSize: 15, showSizeChanger: true }} size="small" bordered locale={{ emptyText: 'Belum ada data siswa' }} scroll={{ x: 700 }} />
      </Card>
    </div>
  );
}