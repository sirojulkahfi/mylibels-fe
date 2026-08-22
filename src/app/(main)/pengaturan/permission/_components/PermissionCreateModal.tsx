import React, { useState } from 'react';
import { Modal, Input, Button, message } from 'antd';
import { userService } from '@/services/user.service';

interface Props {
  isModalVisible: boolean;
  setIsModalVisible: (val: boolean) => void;
  onSuccess: () => void;
}

export default function PermissionCreateModal({ isModalVisible, setIsModalVisible, onSuccess }: Props) {
  const [roleName, setRoleName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    if (!roleName.trim()) {
      message.error('Nama role wajib diisi');
      return;
    }
    setLoading(true);
    try {
      await userService.createRole(roleName);
      message.success('Role berhasil dibuat');
      setRoleName('');
      setIsModalVisible(false);
      onSuccess();
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Gagal membuat role');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Tambah Role Baru"
      open={isModalVisible}
      onCancel={() => {
        setIsModalVisible(false);
        setRoleName('');
      }}
      footer={[
        <Button key="cancel" onClick={() => setIsModalVisible(false)}>
          Batal
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
          Simpan
        </Button>,
      ]}
    >
      <div className="flex flex-col gap-2 mt-4">
        <label className="text-sm font-semibold">Nama Role <span className="text-red-500">*</span></label>
        <Input 
          placeholder="Masukkan nama role (misal: ADMIN, MANAGER)" 
          value={roleName} 
          onChange={(e) => setRoleName(e.target.value.toUpperCase())}
        />
      </div>
    </Modal>
  );
}
