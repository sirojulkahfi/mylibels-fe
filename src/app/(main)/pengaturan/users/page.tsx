/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { Form, message, Breadcrumb, App } from 'antd';
import { systemUserService } from '@/services/systemUser.service';
import { userService } from '@/services/user.service';
import api from '@/services/api';

import { useAuthStore } from '@/store/useAuthStore';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { ReloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import UserTable from './_components/UserTable';
import UserModal from './_components/UserModal';

export default function SystemUsersPage() {
  const { modal } = App.useApp();
  const { user } = useAuthStore();
  const [data, setData] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [karyawans, setKaryawans] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const hasPermission = (requiredPermission: string) => {
      if (!user) return false;
      if (user?.role?.name === 'SUPER_ADMIN') return true;
      return user?.role?.permissions?.includes(requiredPermission) || false;
  };

  const canCreate = hasPermission('CREATE_USER');
  const canEdit = hasPermission('EDIT_USER');
  const canDelete = hasPermission('DELETE_USER');

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await systemUserService.getAll();
      const isSuperAdmin = user?.role?.name === 'SUPER_ADMIN';
      let filteredData = res;
      if (!isSuperAdmin) {
          filteredData = res.filter((u: any) => u.role?.name !== 'SUPER_ADMIN');
      }
      setData(filteredData);

      const rRes = await api.get('/roles');
      setRoles(rRes.data);
      
      const kRes = await userService.getAll();
      setKaryawans(kRes);
      
      setSelectedRowKeys([]);
    } catch (error: any) {
      console.error(error);
      message.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    setTimeout(() => fetchData(), 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = () => {
    if (selectedRowKeys.length === 0) return;
    const record = data.find(u => u.id === selectedRowKeys[0]);
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        username: record.username,
        namaLengkap: record.namaLengkap,
        roleId: record.roleId,
      });
      setIsModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (selectedRowKeys.length === 0) return;
    modal.confirm({
      title: 'Delete User',
      content: 'Aksi ini tidak bisa dibatalkan.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await systemUserService.delete(Number(selectedRowKeys[0]));
          message.success('User dihapus');
          setTimeout(() => fetchData(), 0);
        } catch {
          message.error('Gagal menghapus user');
        }
      }
    });
  };

  const handleSubmit = async (rawValues: any) => {
    try {
      const values = { ...rawValues };
      if (values.namaLengkap) values.namaLengkap = values.namaLengkap.toUpperCase();
      
      if (editingId) {
        await systemUserService.update(editingId, values);
        message.success('User diperbarui');
      } else {
        await systemUserService.create(values);
        message.success('User ditambahkan');
      }
      setIsModalOpen(false);
      setTimeout(() => fetchData(), 0);
    } catch {
      message.error('Gagal menyimpan data');
    }
  };

  return (
    <div className="flex flex-col h-full p-4 overflow-hidden">
      <Breadcrumb style={{ marginBottom: 16 }} className="shrink-0" items={[{ title: 'System' }, { title: 'Users' }]} />
      
      <ToolbarWrapper>
        <ButtonToolbar message="Refresh" icon={<ReloadOutlined />} onClick={fetchData} />
        {canCreate && <ButtonToolbar message="Create" icon={<PlusOutlined />} onClick={openAddModal} />}
        {canEdit && <ButtonToolbar message="Edit" icon={<EditOutlined />} onClick={openEditModal} enable={selectedRowKeys.length === 1} />}
        {canDelete && <ButtonToolbar message="Delete" icon={<DeleteOutlined />} onClick={handleDelete} enable={selectedRowKeys.length > 0 && selectedRowKeys[0] !== user?.id} />}
      </ToolbarWrapper>

      {mounted && (
        <>
          <UserTable
            data={data}
            loading={loading}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
          />
          <UserModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            form={form}
            handleSubmit={handleSubmit}
            editingId={editingId}
            karyawans={karyawans}
            roles={roles}
          />
        </>
      )}
    </div>
  );
}