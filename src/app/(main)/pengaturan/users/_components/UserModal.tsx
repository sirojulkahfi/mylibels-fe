/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Modal, Form, Input, Button, Select, AutoComplete, FormInstance } from 'antd';

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  form: FormInstance;
  handleSubmit: (values: any) => void;
  editingId: number | null;
  karyawans: any[];
  roles: any[];
}

export default function UserModal({
  isModalOpen, setIsModalOpen, form, handleSubmit, editingId, karyawans, roles
}: Props) {
  return (
    <Modal 
      title={editingId ? 'Edit User' : 'Create New User'} 
      open={isModalOpen} 
      onCancel={() => setIsModalOpen(false)}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item 
          label="Nama Lengkap" 
          name="namaLengkap" 
          rules={[{ required: true, message: 'Harap isi nama lengkap' }]}
        >
          <AutoComplete
            options={karyawans.map((k: any) => ({ value: k.namaLengkap, label: `${k.nik} - ${k.namaLengkap} (${k.jabatan || 'Staff'})` }))}
            filterOption={(inputValue, option) =>
              option!.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
            }
            onChange={(val) => {
              form.setFieldsValue({ namaLengkap: val.toUpperCase() });
              if (!editingId) {
                const generated = val.toLowerCase().replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.').replace(/^\.+|\.+$/g, '');
                form.setFieldsValue({ username: generated });
              }
            }}
            placeholder="Ketik atau pilih nama karyawan..."
          />
        </Form.Item>

        <Form.Item 
          label="Username (Boleh diedit)" 
          name="username" 
          rules={[
            { required: true, message: 'Harap isi username' },
            { pattern: /^[a-zA-Z0-9._-]+$/, message: 'Username tidak boleh ada spasi, hanya huruf, angka, titik (.), underscore (_), atau strip (-)' }
          ]}
        >
          <Input onChange={(e) => form.setFieldsValue({ username: e.target.value })} />
        </Form.Item>
        
        <Form.Item 
          label="Password" 
          name="password" 
          rules={[{ required: !editingId, message: 'Harap isi password' }]}
          help={editingId ? 'Kosongkan jika tidak ingin mengubah password' : ''}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item 
          label="Role" 
          name="roleId" 
          rules={[{ required: true, message: 'Harap pilih role' }]}
        >
          <Select>
            {roles.map(r => (
              <Select.Option key={r.id} value={r.id}>{r.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item className="text-right mb-0">
          <Button onClick={() => setIsModalOpen(false)} className="mr-2">Batal</Button>
          <Button type="primary" htmlType="submit">Simpan</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
