import React from 'react';
import { Modal, Form, Input, InputNumber, Select, FormInstance } from 'antd';
import { WaliKelasItem } from '@/services/data-induk/wali-kelas.service';

const { Option } = Select;

interface KelasModalProps {
  isModalVisible: boolean;
  editingId: string | null;
  form: FormInstance;
  waliKelasList: WaliKelasItem[];
  shiftList: any[];
  onCancel: () => void;
  onOk: () => void;
}

export default function KelasModal({
  isModalVisible,
  editingId,
  form,
  waliKelasList,
  shiftList,
  onCancel,
  onOk,
}: KelasModalProps) {
  return (
    <Modal
      title={editingId ? "Edit Data Kelas" : "Tambah Data Kelas"}
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
            label="Kode Kelas"
            rules={[{ required: true, message: 'Harap masukkan kode' }]}
          >
            <Input placeholder="Contoh: 7A" />
          </Form.Item>
          <Form.Item
            name="level"
            label="Tingkat"
            rules={[{ required: true, message: 'Harap pilih tingkat' }]}
          >
            <Select placeholder="Pilih tingkat">
              <Option value="VII">VII (Tujuh)</Option>
              <Option value="VIII">VIII (Delapan)</Option>
              <Option value="IX">IX (Sembilan)</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="name"
          label="Nama Kelas"
          rules={[{ required: true, message: 'Harap masukkan nama kelas' }]}
        >
          <Input placeholder="Contoh: VII-A" />
        </Form.Item>

        <Form.Item
          name="homeroomTeacher"
          label="Wali Kelas"
        >
          <Select 
            placeholder="Pilih wali kelas" 
            allowClear
            showSearch
            optionFilterProp="children"
          >
            {waliKelasList.map(wk => (
              <Option key={wk.id} value={wk.teacherName}>{wk.teacherName}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="shiftId"
          label="Pilih Shift (Opsional)"
          tooltip="Jika kosong, maka siswa di kelas ini akan mengikuti jam absen global di menu Pengaturan"
        >
          <Select placeholder="Pilih shift" allowClear showSearch optionFilterProp="children">
            {shiftList.map((shift) => (
              <Option key={shift.id} value={shift.id}>{shift.name} ({shift.waktuMulaiMasuk} - {shift.waktuBatasPulang})</Option>
            ))}
          </Select>
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="capacity"
            label="Kapasitas (Maks Siswa)"
            rules={[{ required: true, message: 'Harap masukkan kapasitas' }]}
            initialValue={32}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>
          <Form.Item
            name="studentCount"
            label="Jumlah Siswa Saat Ini"
            initialValue={0}
          >
            <InputNumber min={0} className="w-full" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
