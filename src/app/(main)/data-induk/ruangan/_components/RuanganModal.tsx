import React from 'react';
import { Modal, Form, Input, InputNumber, Select, FormInstance } from 'antd';

const { Option } = Select;

interface RuanganModalProps {
  isModalVisible: boolean;
  editingId: string | null;
  form: FormInstance;
  onCancel: () => void;
  onOk: () => void;
}

export default function RuanganModal({
  isModalVisible,
  editingId,
  form,
  onCancel,
  onOk,
}: RuanganModalProps) {
  return (
    <Modal
      title={editingId ? "Edit Data Ruangan" : "Tambah Data Ruangan"}
      open={isModalVisible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Simpan"
      cancelText="Batal"
    >
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="code"
            label="Kode Ruangan"
            rules={[{ required: true, message: 'Harap masukkan kode' }]}
          >
            <Input placeholder="Contoh: R-01" />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="Jenis Ruangan"
            rules={[{ required: true, message: 'Harap pilih jenis' }]}
          >
            <Select placeholder="Pilih jenis">
              <Option value="Teori">Teori / Kelas</Option>
              <Option value="Laboratorium">Laboratorium</Option>
              <Option value="Perpustakaan">Perpustakaan</Option>
              <Option value="Fasilitas">Fasilitas (Masjid, dll)</Option>
              <Option value="Kantor">Kantor / Ruang Guru</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="name"
          label="Nama Ruangan"
          rules={[{ required: true, message: 'Harap masukkan nama ruangan' }]}
        >
          <Input placeholder="Contoh: Ruang Kelas 7A" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="capacity"
            label="Kapasitas (Orang)"
            rules={[{ required: true, message: 'Harap masukkan kapasitas' }]}
            initialValue={30}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          <Form.Item
            name="condition"
            label="Kondisi"
            rules={[{ required: true, message: 'Harap pilih kondisi' }]}
            initialValue="Baik"
          >
            <Select placeholder="Pilih kondisi">
              <Option value="Baik">Baik</Option>
              <Option value="Rusak Ringan">Rusak Ringan</Option>
              <Option value="Rusak Berat">Rusak Berat</Option>
            </Select>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
