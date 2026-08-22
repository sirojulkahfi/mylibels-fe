/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { message, Breadcrumb } from 'antd';
import { ReloadOutlined, ApiOutlined } from '@ant-design/icons';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { userService } from '@/services/user.service';

import PermissionTable from './_components/PermissionTable';
import PermissionAssignModal from './_components/PermissionAssignModal';
import PermissionCreateModal from './_components/PermissionCreateModal';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

const AVAILABLE_PERMISSIONS = [
  { id: 'VIEW_DASHBOARD', name: 'View Dashboard' },
  { id: 'VIEW_REVIEW', name: 'View Review' },
  { id: 'APPROVE_USULAN', name: 'Approve Usulan' },
  { id: 'REJECT_USULAN', name: 'Reject Usulan' },
  { id: 'NILAI_USULAN', name: 'Nilai Usulan' },
  { id: 'VIEW_MASTER_DATA', name: 'View Master Data' },
  { id: 'CREATE_KARYAWAN', name: 'Create Karyawan' },
  { id: 'EDIT_KARYAWAN', name: 'Edit Karyawan' },
  { id: 'DELETE_KARYAWAN', name: 'Delete Karyawan' },
  { id: 'VIEW_SYSTEM', name: 'View System Settings' },
  { id: 'CREATE_USER', name: 'Create User' },
  { id: 'EDIT_USER', name: 'Edit User' },
  { id: 'DELETE_USER', name: 'Delete User' },
  { id: 'MANAGE_SETTINGS', name: 'Manage Settings' },
  { id: 'MANAGE_ROLES', name: 'Manage Roles' },
  { id: 'VIEW_AUDIT_LOG', name: 'View Audit Log' },
  { id: 'CREATE_USULAN', name: 'Create Usulan' },
  { id: 'EDIT_USULAN', name: 'Edit Usulan' },
  { id: 'DELETE_USULAN', name: 'Delete Usulan' },
  { id: 'VIEW_SUMMARY_ACTIVITY', name: 'View Summary Activity' },
  { id: 'VIEW_SUMMARY_REPORT', name: 'View Summary Report' },
];

export default function PermissionPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);
  const [targetKeys, setTargetKeys] = useState<React.Key[]>([]);
  const [updating, setUpdating] = useState(false);

    const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await userService.getRoles();
      setRoles(data);
    } catch {
      message.error('Gagal mengambil data role');
    } finally {
      setLoading(false);
      setSelectedRowKeys([]);
    }
  };

  useEffect(() => {
    setTimeout(() => fetchRoles(), 0);
  }, []);

  const handleAssignPermissions = () => {
    if (selectedRowKeys.length === 1) {
      const selectedRecord = roles.find((item) => item.id === selectedRowKeys[0]);
      if (selectedRecord) {
        setEditData(selectedRecord);
        setTargetKeys(selectedRecord.permissions || []);
        setIsAssignModalVisible(true);
      }
    }
  };

  const handleOk = async () => {
    if (!editData) return;
    setUpdating(true);
    try {
      await userService.updateRolePermissions(editData.id, targetKeys as string[]);
      message.success('Role permissions updated successfully');
      setIsAssignModalVisible(false);
      setTimeout(() => fetchRoles(), 0);
    } catch {
      message.error('Failed to update permissions');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteRole = () => {
    if (selectedRowKeys.length === 1) {
      Modal.confirm({
        title: 'Hapus Role',
        content: 'Apakah Anda yakin ingin menghapus role ini?',
        okText: 'Ya, Hapus',
        okType: 'danger',
        cancelText: 'Batal',
        onOk: async () => {
          try {
            await userService.deleteRole(selectedRowKeys[0] as number);
            message.success('Role berhasil dihapus');
            fetchRoles();
          } catch (error: any) {
            message.error(error.response?.data?.message || 'Gagal menghapus role');
          }
        },
      });
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[{ title: 'Pengaturan' }, { title: 'Manajemen Role & Permission' }]} />
      </div>
      
      <ToolbarWrapper>
        <span className="text-white font-bold leading-tight flex-1 mr-4">Daftar Hak Akses Sistem</span>
        <ButtonToolbar message="Refresh Data" icon={<ReloadOutlined />} onClick={fetchRoles} />
        <ButtonToolbar message="Tambah Role" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)} />
        <ButtonToolbar message="Atur Permissions" icon={<ApiOutlined />} onClick={handleAssignPermissions} enable={selectedRowKeys.length === 1} />
        <ButtonToolbar message="Hapus Role" icon={<DeleteOutlined />} onClick={handleDeleteRole} enable={selectedRowKeys.length === 1} danger={true} />
      </ToolbarWrapper>

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-1 mt-1 rounded-lg shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0">
        <PermissionTable
          roles={roles}
          loading={loading}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        />

        <PermissionAssignModal
          isAssignModalVisible={isAssignModalVisible}
          setIsAssignModalVisible={setIsAssignModalVisible}
          editData={editData}
          handleOk={handleOk}
          updating={updating}
          AVAILABLE_PERMISSIONS={AVAILABLE_PERMISSIONS}
          targetKeys={targetKeys}
          setTargetKeys={setTargetKeys}
        />

        <PermissionCreateModal
          isModalVisible={isCreateModalVisible}
          setIsModalVisible={setIsCreateModalVisible}
          onSuccess={fetchRoles}
        />
      </div>
    </div>
  );
}
