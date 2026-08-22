"use client";

import React, { useState } from 'react';
import { Typography, Table, Select, Button, Space, Tag, Tabs, InputNumber, App } from 'antd';
import { 
  SaveOutlined, 
  ReadOutlined
} from '@ant-design/icons';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { kelasService } from '@/services/data-induk/kelas.service';

const { Title, Text } = Typography;

export default function PortofolioProyekPage() {
  const { message } = App.useApp();
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

  const predicateOptions = [
    { value: 'BB', label: 'Belum Berkembang (BB)' },
    { value: 'MB', label: 'Mulai Berkembang (MB)' },
    { value: 'BSH', label: 'Berkembang Sesuai Harapan (BSH)' },
    { value: 'SAB', label: 'Sangat Berkembang (SAB)' },
  ];

  const handleFieldChange = (value: string, recordId: string, field: string) => {
    const newData = data.map(item => {
      if (item.id === recordId) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setData(newData);
  };

  const renderPredicate = (text: string, record: any, field: string) => {
    return (
      <Select
        value={record[field]}
        onChange={(val) => handleFieldChange(val, record.id, field)}
        className="w-full"
        options={predicateOptions}
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
      width: 200,
      render: (text: string, record: any) => (
        <span className="font-semibold text-gray-800">{text}</span>
      ),
    },
    {
      title: 'Bergotong Royong',
      dataIndex: 'gotongRoyong',
      key: 'gotongRoyong',
      width: 250,
      render: (text: any, record: any) => renderPredicate(text, record, 'gotongRoyong'),
    },
    {
      title: 'Bernalar Kritis',
      dataIndex: 'bernalarKritis',
      key: 'bernalarKritis',
      width: 250,
      render: (text: any, record: any) => renderPredicate(text, record, 'bernalarKritis'),
    },
    {
      title: 'Kreatif',
      dataIndex: 'kreatif',
      key: 'kreatif',
      width: 250,
      render: (text: any, record: any) => renderPredicate(text, record, 'kreatif'),
    }
  ];

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      message.success('Penilaian proyek P5 berhasil disimpan!');
    }, 800);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">Penilaian / Portofolio Proyek</div>

      <ToolbarWrapper>
        <Select defaultValue="t1" className="w-64">
          <Select.Option value="t1">Tema 1: Gaya Hidup Berkelanjutan</Select.Option>
          <Select.Option value="t2">Tema 2: Kearifan Lokal</Select.Option>
        </Select>
        <Select value={selectedKelas} onChange={setSelectedKelas} className="w-32 ml-2">
          {kelasList.map(k => (
            <Select.Option key={k.id} value={k.id}>Kelas {k.name}</Select.Option>
          ))}
        </Select>
        
        <ButtonToolbar 
          message="Simpan Nilai P5" 
          icon={<SaveOutlined />} 
          className="ml-auto bg-indigo-600 text-white hover:bg-indigo-700"
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
          scroll={{ x: 800, y: 'calc(100vh - 270px)' }}
        />
      </div>
    </div>
  );
}
