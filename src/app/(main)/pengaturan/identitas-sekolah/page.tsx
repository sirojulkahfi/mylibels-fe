"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, Card, Typography, Row, Col, App, Breadcrumb, Divider } from 'antd';
import { SaveOutlined, BankOutlined } from '@ant-design/icons';
import Link from 'next/link';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import { identitasSekolahService } from '@/services/system/identitas-sekolah.service';

const { Title, Text } = Typography;

export default function IdentitasSekolahPage() {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await identitasSekolahService.get();
      if (res) {
        form.setFieldsValue(res);
      }
    } catch (error) {
      message.error("Gagal mengambil data identitas sekolah");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onFinish = async (values: any) => {
    try {
      setSaving(true);
      await identitasSekolahService.update(values);
      message.success("Identitas sekolah berhasil diperbarui");
    } catch (error) {
      message.error("Gagal menyimpan identitas sekolah");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[
          { title: <Link href="/pengaturan">Pengaturan</Link> },
          { title: 'Identitas Sekolah' },
        ]} />
      </div>

      <ToolbarWrapper>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <BankOutlined className="text-xl text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold leading-tight">Identitas Sekolah</span>
            <span className="text-gray-200 text-xs">Atur informasi profil instansi sekolah</span>
          </div>
        </div>
      </ToolbarWrapper>

      <div className="flex-1 overflow-auto bg-white rounded-lg shadow-sm border border-gray-100 mt-2 p-6">
        <div className="max-w-4xl mx-auto">
          <Title level={4} className="mb-1 text-gray-800">Profil Sekolah</Title>
          <Text className="text-gray-500 mb-6 block">Informasi ini akan ditampilkan di laporan dan cetak rapor.</Text>
          
          <Divider className="mt-2 mb-6" />

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            disabled={loading}
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={<span className="font-semibold text-gray-700">Nama Sekolah</span>}
                  name="name"
                  rules={[{ required: true, message: 'Nama sekolah wajib diisi!' }]}
                >
                  <Input placeholder="Contoh: SMAN 1 Jakarta" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={<span className="font-semibold text-gray-700">NPSN</span>}
                  name="npsn"
                  rules={[{ required: true, message: 'NPSN wajib diisi!' }]}
                >
                  <Input placeholder="Nomor Pokok Sekolah Nasional" size="large" />
                </Form.Item>
              </Col>
              
              <Col xs={24}>
                <Form.Item
                  label={<span className="font-semibold text-gray-700">Alamat Lengkap</span>}
                  name="address"
                >
                  <Input.TextArea rows={3} placeholder="Alamat lengkap sekolah" size="large" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label={<span className="font-semibold text-gray-700">Nomor Telepon</span>}
                  name="phone"
                >
                  <Input placeholder="Contoh: (021) 1234567" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={<span className="font-semibold text-gray-700">Email Sekolah</span>}
                  name="email"
                >
                  <Input type="email" placeholder="email@sekolah.sch.id" size="large" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label={<span className="font-semibold text-gray-700">Website</span>}
                  name="website"
                >
                  <Input placeholder="https://www.sekolah.sch.id" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={<span className="font-semibold text-gray-700">Nama Kepala Sekolah</span>}
                  name="headmaster"
                >
                  <Input placeholder="Nama lengkap beserta gelar" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Divider className="my-6" />

            <div className="flex justify-end gap-3">
              <Button size="large" onClick={() => form.resetFields()}>
                Batal
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large"
                icon={<SaveOutlined />}
                loading={saving}
                className="bg-blue-600 border-blue-600"
              >
                Simpan Perubahan
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
