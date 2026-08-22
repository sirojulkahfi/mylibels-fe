import React from 'react';
import { Modal, Form, Input, Select, InputNumber, Radio, FormInstance } from 'antd';
import { WaliKelasItem } from '@/services/data-induk/wali-kelas.service';

const { Option } = Select;

interface WaliKelasModalProps {
  isModalVisible: boolean;
  modalMode: 'create' | 'edit';
  submitting: boolean;
  form: FormInstance;
  guruStafList: any[];
  kelasList: any[];
  onCancel: () => void;
  onOk: () => void;
}

export default function WaliKelasModal({
  isModalVisible,
  modalMode,
  submitting,
  form,
  guruStafList,
  kelasList,
  onCancel,
  onOk,
}: WaliKelasModalProps) {
  return (
    <Modal
      title={modalMode === 'create' ? 'Tambah Penugasan Wali Kelas' : 'Edit Penugasan Wali Kelas'}
      open={isModalVisible}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={submitting}
      okText={modalMode === 'create' ? 'Simpan' : 'Update'}
      cancelText="Batal"
      centered
      width={560}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          label="NIP / NIK Guru"
          name="nip"
          rules={[{ required: true, message: 'Harap masukkan NIP/NIK guru' }]}
        >
          <Input placeholder="NIP terisi otomatis" readOnly className="bg-gray-100" />
        </Form.Item>

        <Form.Item
          label="Nama Lengkap & Gelar"
          name="teacherName"
          rules={[{ required: true, message: 'Harap pilih guru' }]}
        >
          <Select 
            placeholder="Pilih guru..."
            showSearch
            optionFilterProp="children"
            onChange={(value) => {
              const selected = guruStafList.find(g => g.name === value);
              if (selected) {
                form.setFieldsValue({ nip: selected.nip });
              }
            }}
          >
            {guruStafList.map((g: any) => (
              <Option key={g.id} value={g.name}>{g.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            label="Tingkat"
            name="level"
            rules={[{ required: true, message: 'Pilih tingkat' }]}
          >
            <Select placeholder="Pilih tingkat">
              <Option value="VII">Kelas VII</Option>
              <Option value="VIII">Kelas VIII</Option>
              <Option value="IX">Kelas IX</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Kelas Binaan"
            name="className"
            rules={[{ required: true, message: 'Harap pilih nama kelas' }]}
          >
            <Select 
              showSearch
              placeholder="Pilih kelas"
              optionFilterProp="children"
            >
              {kelasList.map((k: any) => (
                <Option key={k.id} value={k.name}>
                  {k.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            label="Tahun Ajaran"
            name="academicYear"
            rules={[{ required: true, message: 'Harap masukkan tahun ajaran' }]}
          >
            <Input placeholder="Contoh: 2025/2026" />
          </Form.Item>

          <Form.Item
            label="Semester"
            name="semester"
            rules={[{ required: true, message: 'Pilih semester' }]}
          >
            <Select placeholder="Pilih semester">
              <Option value="Ganjil">Ganjil</Option>
              <Option value="Genap">Genap</Option>
            </Select>
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            label="Jumlah Siswa"
            name="studentCount"
          >
            <InputNumber min={0} max={60} style={{ width: '100%' }} placeholder="32" />
          </Form.Item>

          <Form.Item
            label="No. Kontak / WhatsApp"
            name="phone"
          >
            <Input placeholder="Contoh: 081234567890" />
          </Form.Item>
        </div>

        <Form.Item label="Status Penugasan" name="status">
          <Radio.Group>
            <Radio value="Aktif">Aktif</Radio>
            <Radio value="Non-Aktif">Non-Aktif</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}
