"use client";

import React, { useState } from 'react';
import { Table, Input, Select, Breadcrumb, Button } from 'antd';
import { 
  SearchOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';

  import { bkService } from '@/services/bk/bk.service';

  export default function CatatanKonselingPage() {
    const router = useRouter();

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await bkService.findAllKonseling();
        // group by student or just show sessions. For now, we'll format it similar to the mock, 
        // assuming res is array of konseling records. If we want a summary per student, 
        // we'd reduce it. Let's just mock the reduce or show raw.
        // For simplicity, we just use a mapped version or fallback to mock if no data yet.
        if (res && res.length > 0) {
          setData(res.map((item: any) => ({
            id: item.siswaId,
            name: item.siswa?.namaLengkap || 'Unknown',
            nisn: item.siswa?.nisn || '-',
            class: 'VII-A', // need rombel relation
            counselingCount: 1,
            lastSession: new Date(item.tanggal).toLocaleDateString('id-ID'),
          })));
        } else {
          setData([]);
        }
      } catch (error) {
        console.error(error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    React.useEffect(() => {
      setMounted(true);
      fetchData();
    }, []);

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
        width: 250,
        render: (text: string, record: any) => (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800">{text}</span>
            <span className="text-xs text-gray-400">NISN: {record.nisn}</span>
          </div>
        ),
      },
      {
        title: 'Kelas',
        dataIndex: 'class',
        key: 'class',
        width: 120,
      },
      {
        title: 'Sesi Konseling',
        dataIndex: 'counselingCount',
        key: 'counselingCount',
        width: 150,
        align: 'center' as const,
        render: (count: number) => (
          <span className={count > 0 ? "text-rose-600 font-bold" : "text-gray-400"}>
            {count} sesi
          </span>
        ),
      },
      {
        title: 'Sesi Terakhir',
        dataIndex: 'lastSession',
        key: 'lastSession',
        width: 150,
        align: 'center' as const,
      },
      {
        title: 'Aksi',
        key: 'action',
        width: 120,
        align: 'center' as const,
        render: (_: any, record: any) => (
          <Button 
            type="primary"
            icon={<ArrowRightOutlined />} 
            className="bg-rose-600 shadow-none hover:bg-rose-500"
            onClick={() => router.push(`/bimbingan-konseling/konseling/${record.id}`)}
            block
          >
            Detail
          </Button>
        ),
      },
    ];

    return (
      <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
        <div className="mb-2 text-gray-500 text-sm">
          <Breadcrumb items={[
            { title: <Link href="/bimbingan-konseling">Bimbingan Konseling</Link> },
            { title: 'Catatan Konseling' },
          ]} />
        </div>

        <ToolbarWrapper>
          <span className="text-white font-semibold mr-4">Daftar Siswa Konseling</span>
          <Input 
            placeholder="Cari siswa..." 
            prefix={<SearchOutlined />} 
            className="w-64"
          />
          <Select 
            defaultValue="all" 
            className="w-40"
            options={[
              { value: 'all', label: 'Semua Kelas' },
              { value: 'vii', label: 'Kelas VII' },
              { value: 'viii', label: 'Kelas VIII' },
              { value: 'ix', label: 'Kelas IX' },
            ]} 
          />
        </ToolbarWrapper>

        <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-1 mt-1 rounded-lg shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0">
          {mounted && (
            <Table 
              columns={columns} 
              dataSource={data} 
              rowKey="id"
              loading={loading}
              pagination={{
                total: data.length,
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} siswa`,
              }}
              size="small" bordered
              scroll={{ y: 'calc(100vh - 270px)' }}
            />
          )}
        </div>
      </div>
    );
  }
