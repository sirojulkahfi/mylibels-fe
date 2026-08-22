import React from 'react';
import { Modal, Form, Input, Select, Radio, FormInstance } from 'antd';

const { Option } = Select;

interface SiswaModalProps {
  isModalVisible: boolean;
  editingId: string | null;
  form: FormInstance;
  kelasData: any[];
  onCancel: () => void;
  onOk: () => void;
}

export default function SiswaModal({
  isModalVisible,
  editingId,
  form,
  kelasData,
  onCancel,
  onOk,
}: SiswaModalProps) {
  return (
    <Modal
      title={editingId ? "Edit Data Siswa" : "Tambah Data Siswa"}
      open={isModalVisible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Simpan"
      cancelText="Batal"
      width={600}
    >
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="nisn"
            label="NISN"
            rules={[{ required: true, message: 'Harap masukkan NISN' }]}
          >
            <Input placeholder="Masukkan NISN" maxLength={10} />
          </Form.Item>
          <Form.Item
            name="nis"
            label="NIS"
            rules={[{ required: true, message: 'Harap masukkan NIS' }]}
          >
            <Input placeholder="Masukkan NIS" />
          </Form.Item>
        </div>

        <Form.Item
          name="name"
          label="Nama Lengkap"
          rules={[{ required: true, message: 'Harap masukkan nama lengkap' }]}
        >
          <Input placeholder="Masukkan nama lengkap siswa" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="gender"
            label="Jenis Kelamin"
            rules={[{ required: true, message: 'Harap pilih jenis kelamin' }]}
          >
            <Radio.Group>
              <Radio value="Laki-laki">Laki-laki</Radio>
              <Radio value="Perempuan">Perempuan</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="class"
            label="Kelas"
            rules={[{ required: true, message: 'Harap pilih kelas' }]}
          >
            <Select 
              showSearch
              placeholder="Pilih kelas"
              optionFilterProp="children"
            >
              {kelasData.map((k: any) => (
                <Option key={k.id} value={k.name}>
                  {k.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="status"
          label="Status Siswa"
          rules={[{ required: true, message: 'Harap pilih status' }]}
          initialValue="Aktif"
        >
          <Select placeholder="Pilih status">
            <Option value="Aktif">Aktif</Option>
            <Option value="Lulus">Lulus</Option>
            <Option value="Pindah">Pindah</Option>
          </Select>
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="parentName"
            label="Nama Orang Tua/Wali"
          >
            <Input placeholder="Masukkan nama orang tua/wali" />
          </Form.Item>
          <Form.Item
            name="parentPhone"
            label="No. Telepon Orang Tua"
          >
            <Input placeholder="Masukkan nomor telepon" />
          </Form.Item>
        </div>

        <Form.Item
          name="address"
          label="Alamat Lengkap"
        >
          <Input.TextArea rows={3} placeholder="Masukkan alamat lengkap siswa" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
