/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { Form, Breadcrumb, App } from 'antd';
import { systemUserService } from '@/services/systemUser.service';
import { userService } from '@/services/user.service';
import { guruStafService } from '@/services/data-induk/guru-staf.service';
import api from '@/services/api';

import { useAuthStore } from '@/store/useAuthStore';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { ReloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import UserTable from './_components/UserTable';
import UserModal from './_components/UserModal';

export default function SystemUsersPage() {
  const { modal, message } = App.useApp();
  const { user } = useAuthStore();
  const [data, setData] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [karyawans, setKaryawans] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const hasPermission = (requiredPermission: string) => {
      if (!user) return false;
      if (user?.role?.name === 'SUPER_ADMIN' || user?.role?.name === 'ADMIN') return true;
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

      const rolesData = await userService.getRoles();
      setRoles(rolesData);
      
      const kRes = await guruStafService.findAll();
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

  const openEditModal = (id?: string) => {
    const targetId = typeof id === 'string' ? id : (selectedRowKeys.length > 0 ? selectedRowKeys[0] : null);
    if (!targetId) return;
    const record = data.find(u => u.id === targetId);
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        username: record.username,
        name: record.name,
        roleId: record.roleId,
      });
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id?: string) => {
    const targetId = typeof id === 'string' ? id : (selectedRowKeys.length > 0 ? selectedRowKeys[0] : null);
    if (!targetId) return;
    modal.confirm({
      title: 'Delete User',
      content: 'Aksi ini tidak bisa dibatalkan.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await systemUserService.delete(targetId as string);
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
      if (values.name) values.name = values.name.toUpperCase();
      
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
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[{ title: 'Pengaturan' }, { title: 'Manajemen Users' }]} />
      </div>
      
      <ToolbarWrapper>
        <span className="text-white font-bold leading-tight flex-1 mr-4">Daftar Pengguna Sistem</span>
        <ButtonToolbar message="Refresh Data" icon={<ReloadOutlined />} onClick={fetchData} />
        {canCreate && <ButtonToolbar message="Tambah User" icon={<PlusOutlined />} onClick={openAddModal} />}
        {canEdit && <ButtonToolbar message="Edit User" icon={<EditOutlined />} onClick={openEditModal} enable={selectedRowKeys.length === 1} />}
        {canDelete && <ButtonToolbar message="Hapus User" icon={<DeleteOutlined />} onClick={handleDelete} enable={selectedRowKeys.length > 0 && selectedRowKeys[0] !== user?.id} />}
      </ToolbarWrapper>

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-1 mt-1 rounded-lg shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0">
        {mounted && (
          <>
            <UserTable
              data={data}
              loading={loading}
              selectedRowKeys={selectedRowKeys}
              setSelectedRowKeys={setSelectedRowKeys}
              onEdit={canEdit ? openEditModal : undefined}
              onDelete={canDelete ? handleDelete : undefined}
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
    </div>
  );
}