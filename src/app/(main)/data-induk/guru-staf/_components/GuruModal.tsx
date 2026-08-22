import React from 'react';
import { Modal, Form, Input, Select, FormInstance } from 'antd';

const { Option } = Select;

interface GuruModalProps {
  isModalVisible: boolean;
  editingId: string | null;
  form: FormInstance;
  mapelData: any[];
  onCancel: () => void;
  onOk: () => void;
}

export default function GuruModal({
  isModalVisible,
  editingId,
  form,
  mapelData,
  onCancel,
  onOk,
}: GuruModalProps) {
  return (
    <Modal
      title={editingId ? "Edit Data Guru & Staf" : "Tambah Data Guru & Staf"}
      open={isModalVisible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Simpan"
      cancelText="Batal"
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Nama Lengkap"
          rules={[{ required: true, message: 'Harap masukkan nama lengkap' }]}
        >
          <Input placeholder="Masukkan nama lengkap beserta gelar" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="nip"
            label="NIP / NIK"
          >
            <Input placeholder="Masukkan NIP atau NIK (opsional)" />
          </Form.Item>
          
          <Form.Item
            name="position"
            label="Jabatan"
            rules={[{ required: true, message: 'Harap masukkan jabatan' }]}
          >
            <Select placeholder="Pilih jabatan">
              <Option value="Kepala Sekolah">Kepala Sekolah</Option>
              <Option value="Wakasek">Wakasek</Option>
              <Option value="Guru">Guru</Option>
              <Option value="Staf TU">Staf TU</Option>
            </Select>
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="employmentStatus"
            label="Status Pegawai"
            rules={[{ required: true, message: 'Harap pilih status pegawai' }]}
          >
            <Select placeholder="Pilih status pegawai">
              <Option value="PNS">PNS</Option>
              <Option value="PPPK">PPPK</Option>
              <Option value="Honorer">Honorer</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status Aktif"
            rules={[{ required: true, message: 'Harap pilih status' }]}
            initialValue="Aktif"
          >
            <Select placeholder="Pilih status">
              <Option value="Aktif">Aktif</Option>
              <Option value="Cuti">Cuti</Option>
              <Option value="Pensiun">Pensiun</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="subject"
          label="Mata Pelajaran yang Diampu"
        >
          <Select 
            showSearch
            placeholder="Pilih Mata Pelajaran (Kosongkan jika bukan guru)"
            allowClear
            optionFilterProp="children"
          >
            <Option value="-">- (Bukan Guru Mata Pelajaran)</Option>
            {mapelData.map((mapel: any) => (
              <Option key={mapel.id} value={mapel.name}>
                {mapel.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
