import React from 'react';
import { Modal, Form, Input, InputNumber, Select, FormInstance } from 'antd';

const { Option } = Select;

interface MapelModalProps {
  isModalVisible: boolean;
  editingId: string | null;
  form: FormInstance;
  onCancel: () => void;
  onOk: () => void;
}

export default function MapelModal({
  isModalVisible,
  editingId,
  form,
  onCancel,
  onOk,
}: MapelModalProps) {
  return (
    <Modal
      title={editingId ? "Edit Data Mata Pelajaran" : "Tambah Data Mata Pelajaran"}
      open={isModalVisible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Simpan"
      cancelText="Batal"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="code"
          label="Kode Mata Pelajaran"
          rules={[{ required: true, message: 'Harap masukkan kode' }]}
        >
          <Input placeholder="Contoh: BIND, MAT, IPA" />
        </Form.Item>

        <Form.Item
          name="name"
          label="Nama Mata Pelajaran"
          rules={[{ required: true, message: 'Harap masukkan nama mata pelajaran' }]}
        >
          <Input placeholder="Contoh: Bahasa Indonesia" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="category"
            label="Kategori"
            rules={[{ required: true, message: 'Harap pilih kategori' }]}
            initialValue="Wajib"
          >
            <Select placeholder="Pilih kategori">
              <Option value="Wajib">Wajib</Option>
              <Option value="Muatan Lokal">Muatan Lokal</Option>
              <Option value="Pilihan">Pilihan</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="kkm"
            label="KKM"
            rules={[{ required: true, message: 'Harap masukkan nilai KKM' }]}
            initialValue={75}
          >
            <InputNumber min={0} max={100} className="w-full" placeholder="Contoh: 75" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
