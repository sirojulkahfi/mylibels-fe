"use client";

import { useEffect, useState } from 'react';
import { Alert, Card, Col, Row, Statistic, Table, Tag, Typography } from 'antd';
import { BookOutlined, CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { presensiService } from '@/services/presensi/presensi.service';
import { akademikService } from '@/services/akademik/akademik.service';
import { waliKelasService } from '@/services/data-induk/wali-kelas.service';

const { Title, Text } = Typography;

export default function GuruDashboard() {
  const user = useAuthStore((state) => state.user);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [waliKelas, setWaliKelas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadAttendance = async () => {
      if (!user?.guruStaf?.id) {
        setLoading(false);
        return;
      }
      try {
        const [attendanceData, scheduleData, waliKelasResponse] = await Promise.all([
          presensiService.findAllGuru({ guruId: user.guruStaf.id }),
          akademikService.getJadwalByGuru(user.guruStaf.id),
          waliKelasService.findAll(),
        ]);
        setAttendance(attendanceData || []);
        setSchedule(scheduleData || []);
        const assignments = Array.isArray(waliKelasResponse?.data) ? waliKelasResponse.data : waliKelasResponse || [];
        setWaliKelas(assignments.filter((item: any) => item.guruStafId === user.guruStaf?.id || item.guruStaf?.id === user.guruStaf?.id));
      } catch (requestError) {
        console.error(requestError);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadAttendance();
  }, [user?.guruStaf?.id]);

  const hadir = attendance.filter((item) => item.status === 'Hadir').length;
  const terlambat = attendance.filter((item) => item.status === 'Terlambat').length;

  const columns = [
    { title: 'Tanggal', dataIndex: 'tanggal', key: 'tanggal', render: (value: string) => value ? new Date(value).toLocaleDateString('id-ID') : '-' },
    { title: 'Jam Masuk', dataIndex: 'jamMasuk', key: 'jamMasuk', render: (value: string) => value || '-' },
    { title: 'Jam Keluar', dataIndex: 'jamKeluar', key: 'jamKeluar', render: (value: string) => value || '-' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (value: string) => <Tag color={value === 'Hadir' ? 'green' : value === 'Terlambat' ? 'orange' : 'red'}>{value || '-'}</Tag> },
  ];

  return (
    <div className="flex flex-1 flex-col min-h-0 gap-4 bg-slate-50 p-4 pt-2 overflow-auto">
      <div>
        <Title level={4} className="!mb-1">Dashboard Guru</Title>
        <Text type="secondary">Selamat datang, {user?.name || user?.username || 'Guru'}.</Text>
      </div>
      {error && <Alert type="warning" showIcon message="Data kehadiran belum dapat dimuat" description="Anda tetap dapat mengakses modul pembelajaran melalui menu di samping." />}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}><Card loading={loading}><Statistic title="Total Kehadiran" value={hadir} prefix={<CheckCircleOutlined className="text-emerald-500" />} /></Card></Col>
        <Col xs={24} sm={8}><Card loading={loading}><Statistic title="Terlambat" value={terlambat} prefix={<ClockCircleOutlined className="text-orange-500" />} /></Card></Col>
        <Col xs={24} sm={8}><Card loading={loading}><Statistic title={user?.guruStaf?.subject || 'Mata Pelajaran'} value={schedule.length} suffix="jadwal" prefix={<BookOutlined className="text-blue-500" />} /></Card></Col>
      </Row>
      {waliKelas.length > 0 && (
        <Card title="Penugasan Wali Kelas" className="border border-gray-100 shadow-sm">
          <div className="flex flex-wrap gap-3">
            {waliKelas.map((assignment) => (
              <div key={assignment.id} className="rounded border border-blue-100 bg-blue-50 px-4 py-3">
                <div className="font-semibold text-gray-800">Kelas {assignment.className}</div>
                <div className="text-sm text-gray-500">Tahun Ajaran {assignment.academicYear} | {assignment.semester}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <Card title="Riwayat Kehadiran" className="border border-gray-100 shadow-sm">
          <Table columns={columns} dataSource={attendance.slice(0, 10)} rowKey="id" loading={loading} pagination={false} size="small" locale={{ emptyText: 'Belum ada data kehadiran' }} />
        </Card>
        <Card title="Jadwal Mengajar" className="border border-gray-100 shadow-sm">
          <div className="flex flex-col gap-2">
            {schedule.length ? schedule.map((item) => (
              <div key={item.id} className="rounded border border-gray-100 p-2 text-sm">
                <div className="font-semibold text-gray-800">{item.hari} | {item.jamMulai} - {item.jamSelesai}</div>
                <div className="text-gray-500">{item.mapelName || user?.guruStaf?.subject} | Kelas {item.kelasName}</div>
              </div>
            )) : <Text type="secondary">Belum ada jadwal mengajar.</Text>}
          </div>
        </Card>
        <Card title="Akses Mengajar" className="h-fit border border-gray-100 shadow-sm">
          <div className="flex flex-col gap-2">
            <Link href="/akademik/jadwal-pelajaran"><Card size="small" hoverable><CalendarOutlined className="mr-2 text-blue-500" />Jadwal Pelajaran</Card></Link>
            <Link href="/penilaian/formatif"><Card size="small" hoverable><BookOutlined className="mr-2 text-emerald-500" />Input Penilaian</Card></Link>
            <Link href="/presensi/presensi-guru"><Card size="small" hoverable><CheckCircleOutlined className="mr-2 text-orange-500" />Presensi Guru</Card></Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
