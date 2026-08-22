import React from 'react';
import { Modal, Form, Input, Select, InputNumber, FormInstance } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';

const { Option } = Select;

interface AlumniModalProps {
  isModalVisible: boolean;
  editingId: string | null;
  form: FormInstance;
  onCancel: () => void;
  onOk: () => void;
}

export default function AlumniModal({
  isModalVisible,
  editingId,
  form,
  onCancel,
  onOk,
}: AlumniModalProps) {
  return (
    <Modal
      title={editingId ? "Edit Data Alumni" : "Tambah Data Alumni"}
      open={isModalVisible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Simpan"
      cancelText="Batal"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Nama Lengkap"
          rules={[{ required: true, message: 'Harap masukkan nama alumni' }]}
        >
          <Input placeholder="Masukkan nama lengkap" />
        </Form.Item>
        
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="graduationYear"
            label="Tahun Lulus"
            rules={[{ required: true, message: 'Harap masukkan tahun lulus' }]}
          >
            <InputNumber className="w-full" placeholder="Contoh: 2023" />
          </Form.Item>
          
          <Form.Item
            name="currentStatus"
            label="Status Saat Ini"
            rules={[{ required: true, message: 'Harap pilih status' }]}
          >
            <Select placeholder="Pilih status">
              <Option value="Melanjutkan Pendidikan">Melanjutkan Pendidikan</Option>
              <Option value="Tidak Melanjutkan">Tidak Melanjutkan</Option>
              <Option value="Bekerja">Bekerja</Option>
              <Option value="Lainnya">Lainnya</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="institution"
          label="Sekolah Lanjutan / Instansi"
          rules={[{ required: true, message: 'Harap masukkan nama sekolah lanjutan/instansi (isi "-" jika tidak ada)' }]}
        >
          <Input placeholder="Contoh: SMAN 1 Bandung" />
        </Form.Item>

        <Form.Item
          name="contact"
          label="Kontak (WhatsApp)"
        >
          <Input placeholder="Contoh: 081234567890" prefix={<PhoneOutlined className="text-gray-400" />} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
