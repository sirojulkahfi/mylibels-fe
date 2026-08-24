"use client";

import React, { useState } from 'react';
import { Table, Breadcrumb, Button, Tag, Progress, Switch, Modal, notification } from 'antd';
import { ArrowLeftOutlined,
  CheckCircleOutlined,
  LockOutlined,
  UnlockOutlined,
  ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import { kelasService } from '@/services/data-induk/kelas.service';

  import { raporService } from '@/services/rapor/rapor.service';

  export default function RaporValidasiKunciPage() {
    const router = useRouter();
    const params = useParams();
    const kelasId = params.kelasId as string;

    const [isLocked, setIsLocked] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [data, setData] = useState<any[]>([]);
    const [kelasName, setKelasName] = useState<string>('...');

    const fetchStatus = async () => {
        try {
          // Ambil nama kelas dari API
          const kelasList = await kelasService.findAll();
          const found = kelasList?.find((k: any) => k.id === kelasId);
          if (found) setKelasName(found.name);
          else setKelasName('Tidak Ditemukan');

          // Assuming default semester and tahun ajaran for now, ideally fetched from settings
          const statusRes = await raporService.getStatusRapor(kelasId, "Ganjil", "2023/2024");
          if (statusRes && statusRes.status === 'Terkunci') {
            setIsLocked(true);
          } else {
            setIsLocked(false);
          }
          
          const validasiRes = await raporService.getValidasiKelengkapan(kelasId, "Ganjil", "2023/2024");
          setData(validasiRes || []);
        } catch (error) {
          setData([]);
        } finally {
          setLoading(false);
        }
    };

  React.useEffect(() => {
    fetchStatus();
  }, [kelasId]);

    const columns = [
      {
        title: 'Mata Pelajaran',
        dataIndex: 'mapel',
        key: 'mapel',
        width: 250,
        render: (text: string, record: any) => (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800">{text}</span>
            <span className="text-xs text-gray-400">Guru: {record.guru}</span>
          </div>
        ),
      },
      {
        title: 'Kelengkapan Nilai',
        dataIndex: 'progress',
        key: 'progress',
        width: 300,
        render: (percent: number) => (
          <Progress 
            percent={percent} 
            size="small" 
            strokeColor={percent === 100 ? '#52c41a' : '#faad14'}
          />
        ),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 150,
        align: 'center' as const,
        render: (status: string) => {
          let color = 'success';
          if (status === 'Belum Lengkap') color = 'warning';
          return <Tag color={color}>{status}</Tag>;
        }
      }
    ];

    const handleToggleLock = () => {
      const isAnyIncomplete = data.some(item => item.progress < 100);
      
      if (!isLocked && isAnyIncomplete) {
        notification.error({
          message: 'Validasi Gagal',
          description: 'Tidak dapat mengunci rapor karena masih ada nilai mata pelajaran yang belum lengkap (100%).',
        });
        return;
      }

      setIsModalOpen(true);
    };

    const confirmToggleLock = async () => {
      try {
        setUpdating(true);
        const newStatus = isLocked ? 'Draft' : 'Terkunci';
        await raporService.updateStatusRapor({
          kelasId,
          semester: 'Ganjil',
          tahunAjaran: '2023/2024',
          status: newStatus
        });
        setIsLocked(!isLocked);
        setIsModalOpen(false);
        notification.success({
          message: isLocked ? 'Rapor Dibuka' : 'Rapor Terkunci',
          description: isLocked 
            ? 'Akses pengisian nilai telah dibuka kembali untuk guru mata pelajaran.' 
            : 'Rapor berhasil dikunci. Guru tidak dapat lagi mengubah nilai.',
        });
      } catch (error) {
        notification.error({ message: 'Gagal memperbarui status rapor' });
      } finally {
        setUpdating(false);
      }
    };

    return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: <Link href="/rapor">Manajemen Rapor</Link> },
          { title: 'Validasi & Kunci' },
        ]} />
      </div>

      <ToolbarWrapper>
        <Button icon={<ReloadOutlined />} onClick={fetchStatus} loading={loading} type="default" className="mr-2">
          Muat Ulang
        </Button>
        
        <div className="flex flex-col ml-4 mr-4 hidden md:flex">
          <span className="text-white font-bold leading-tight">Validasi & Kunci Rapor</span>
          <span className="text-gray-200 text-xs">Kelas {kelasName}</span>
        </div>
        
        <div className="ml-auto flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-white text-xs">Status Rapor</span>
            {isLocked ? (
              <span className="text-white font-bold text-sm flex items-center gap-1"><LockOutlined /> Terkunci</span>
            ) : (
              <span className="text-white font-bold text-sm flex items-center gap-1"><UnlockOutlined /> Terbuka (Bisa Edit)</span>
            )}
          </div>
          <Button 
            icon={isLocked ? <UnlockOutlined /> : <LockOutlined />} 
            type="primary"
            className={`${isLocked ? 'bg-amber-500 hover:bg-amber-400' : 'bg-red-500 hover:bg-red-400'} border-0`}
            onClick={handleToggleLock}
          >
            {isLocked ? 'Buka Kunci' : 'Kunci Rapor'}
          </Button>
        </div>
      </ToolbarWrapper>

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-1 mt-1 rounded-lg shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0">
        <div className="mb-4 mt-2 bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm text-blue-800 flex items-start gap-2">
          <CheckCircleOutlined className="mt-1" />
          <div>
            <strong>Validasi Kelengkapan Nilai</strong><br />
            Pastikan seluruh mata pelajaran telah mencapai 100% kelengkapan sebelum Anda dapat mengunci rapor. 
            Merapor yang telah dikunci tidak dapat diubah lagi nilainya oleh guru mata pelajaran.
          </div>
        </div>
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          pagination={false}
          size="small" bordered
          scroll={{ y: 'calc(100vh - 350px)' }}
        />
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${isLocked ? 'bg-amber-100' : 'bg-red-100'}`}>
              <ExclamationCircleOutlined className={isLocked ? 'text-amber-600' : 'text-red-600'} />
            </div>
            <span>Konfirmasi {isLocked ? 'Buka' : 'Kunci'} Rapor</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalOpen(false)}>Batal</Button>,
          <Button 
            key="submit" 
            type="primary" 
            danger={!isLocked} 
            className={isLocked ? 'bg-amber-500' : ''}
            onClick={confirmToggleLock}
          >
            Ya, {isLocked ? 'Buka' : 'Kunci'} Rapor
          </Button>
        ]}
      >
        <p className="mt-4">
          {isLocked 
            ? 'Apakah Anda yakin ingin membuka kunci rapor? Guru mata pelajaran akan dapat mengubah nilai kembali.' 
            : 'Apakah Anda yakin ingin mengunci rapor? Setelah dikunci, guru mata pelajaran TIDAK BISA lagi mengubah nilai siswa.'}
        </p>
      </Modal>
    </div>
  );
}
