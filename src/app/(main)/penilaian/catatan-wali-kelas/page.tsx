"use client";

import React, { useState } from 'react';
import { Table, Input, Breadcrumb, App, Tag, Select } from 'antd';
import { 
  SaveOutlined, 
  ArrowLeftOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { kelasService } from '@/services/data-induk/kelas.service';

const { TextArea } = Input;

export default function CatatanWaliKelasPage() {
  const { message } = App.useApp();
  const params = useParams();

  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [selectedKelas, setSelectedKelas] = useState('');

  React.useEffect(() => {
    kelasService.findAll().then(res => {
      if (res && res.length > 0) {
        setKelasList(res);
        setSelectedKelas(res[0].id);
      }
    }).catch(console.error);
  }, []);

  const handleNotesChange = (value: string, recordId: string) => {
    const newData = data.map(item => {
      if (item.id === recordId) {
        return { ...item, notes: value };
      }
      return item;
    });
    setData(newData);
  };

  const renderNotes = (text: string, record: any) => {
    return (
      <TextArea
        value={record.notes}
        onChange={(e) => handleNotesChange(e.target.value, record.id)}
        rows={2}
        placeholder="Tuliskan catatan wali kelas..."
        className="w-full"
      />
    );
  };

  const columns = [
    {
      title: 'No',
      key: 'index',
      width: 60,
      render: (text: any, record: any, index: number) => index + 1,
      align: 'center' as const,
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
      title: 'Kehadiran',
      dataIndex: 'attendance',
      key: 'attendance',
      width: 100,
      align: 'center' as const,
      render: (text: string) => {
        const val = parseInt(text);
        return <Tag color={val >= 90 ? 'success' : val >= 80 ? 'warning' : 'error'}>{text}</Tag>;
      }
    },
    {
      title: 'Catatan Wali Kelas',
      dataIndex: 'notes',
      key: 'notes',
      render: (text: any, record: any) => renderNotes(text, record),
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: any) => (
        record.notes && record.notes.length > 5 ? 
          <CheckCircleOutlined className="text-emerald-500 text-lg" /> : 
          <span className="text-gray-300 text-xs">-</span>
      )
    }
  ];

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      message.success('Catatan wali kelas berhasil disimpan!');
    }, 800);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">Penilaian / Catatan Wali Kelas</div>

      <ToolbarWrapper>
        <Select 
          value={selectedKelas || undefined} 
          onChange={setSelectedKelas}
          className="w-48 mr-4"
          options={kelasList.map(k => ({ value: k.id, label: `Kelas ${k.name}` }))}
          placeholder="Pilih Kelas"
        />
        <ButtonToolbar 
          message="Simpan Catatan" 
          icon={<SaveOutlined />} 
          className="ml-auto bg-purple-600 text-white hover:bg-purple-700"
          onClick={handleSave}
          loading={saving}
        />
      </ToolbarWrapper>

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-1 mt-1 rounded-lg shadow-sm border border-gray-100">
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          pagination={false}
          size="small" bordered
          scroll={{ y: 'calc(100vh - 270px)' }}
        />
      </div>
    </div>
  );
}
