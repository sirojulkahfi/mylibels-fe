import React from 'react';
import { Modal, Form, Input, InputNumber, FormInstance } from 'antd';

interface EkskulModalProps {
  isModalVisible: boolean;
  editingId: string | null;
  form: FormInstance;
  onCancel: () => void;
  onOk: () => void;
}

export default function EkskulModal({
  isModalVisible,
  editingId,
  form,
  onCancel,
  onOk,
}: EkskulModalProps) {
  return (
    <Modal
      title={editingId ? "Edit Data Ekstrakurikuler" : "Tambah Data Ekstrakurikuler"}
      open={isModalVisible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Simpan"
      cancelText="Batal"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Nama Ekstrakurikuler"
          rules={[{ required: true, message: 'Harap masukkan nama ekstrakurikuler' }]}
        >
          <Input placeholder="Contoh: Pramuka, Paskibra" />
        </Form.Item>

        <Form.Item
          name="coach"
          label="Pembina / Pelatih"
        >
          <Input placeholder="Masukkan nama pembina" />
        </Form.Item>

        <Form.Item
          name="schedule"
          label="Jadwal Latihan"
        >
          <Input placeholder="Contoh: Sabtu, 08:00 - 10:00" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="location"
            label="Tempat Latihan"
            initialValue="Lapangan Sekolah"
          >
            <Input placeholder="Contoh: Lapangan Sekolah" />
          </Form.Item>

          <Form.Item
            name="memberCount"
            label="Jumlah Anggota"
            initialValue={0}
          >
            <InputNumber min={0} className="w-full" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
