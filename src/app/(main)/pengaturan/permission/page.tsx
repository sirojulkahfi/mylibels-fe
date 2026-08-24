/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { App, Breadcrumb } from 'antd';
import { ReloadOutlined, ApiOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { userService } from '@/services/user.service';

import PermissionTable from './_components/PermissionTable';
import PermissionAssignModal from './_components/PermissionAssignModal';
import PermissionCreateModal from './_components/PermissionCreateModal';

const AVAILABLE_PERMISSIONS = [
  // --- Modul Akses Halaman (View) ---
  { id: 'VIEW_DASHBOARD', name: 'Lihat Dashboard' },
  { id: 'VIEW_DATA_INDUK', name: 'Akses Data Induk' },
  { id: 'VIEW_AKADEMIK', name: 'Akses Akademik' },
  { id: 'VIEW_PENILAIAN', name: 'Akses Penilaian' },
  { id: 'VIEW_PRESENSI', name: 'Akses Presensi' },
  { id: 'VIEW_BK', name: 'Akses Bimbingan Konseling' },
  { id: 'VIEW_RAPOR', name: 'Akses Rapor' },
  { id: 'VIEW_LAPORAN', name: 'Akses Laporan' },
  { id: 'VIEW_PENGATURAN', name: 'Akses Pengaturan' },
  
  // --- Modul Data Induk ---
  { id: 'CREATE_DATA_INDUK', name: 'Tambah Data Induk (Siswa, Guru, dll)' },
  { id: 'EDIT_DATA_INDUK', name: 'Ubah Data Induk' },
  { id: 'DELETE_DATA_INDUK', name: 'Hapus Data Induk' },
  { id: 'PRINT_KARTU_ID', name: 'Cetak Kartu ID / Barcode' },

  // --- Modul Presensi ---
  { id: 'INPUT_PRESENSI', name: 'Input & Edit Kehadiran' },
  { id: 'MANAGE_PERIZINAN', name: 'Kelola Izin & Sakit' },

  // --- Modul Penilaian & Akademik ---
  { id: 'INPUT_NILAI', name: 'Input Nilai Siswa' },
  { id: 'EDIT_JADWAL', name: 'Atur Jadwal Pelajaran' },
  { id: 'KUNCI_RAPOR', name: 'Validasi & Kunci Rapor' },

  // --- Modul Bimbingan Konseling ---
  { id: 'ADD_PELANGGARAN', name: 'Catat Poin Pelanggaran' },
  { id: 'ADD_PRESTASI', name: 'Catat Prestasi Siswa' },

  // --- Modul Pengaturan Sistem ---
  { id: 'CREATE_USER', name: 'Tambah Pengguna Sistem' },
  { id: 'EDIT_USER', name: 'Ubah Pengguna Sistem' },
  { id: 'DELETE_USER', name: 'Hapus Pengguna Sistem' },
  { id: 'MANAGE_SETTINGS', name: 'Kelola Sistem (Settings & Identitas)' },
  { id: 'MANAGE_ROLES', name: 'Kelola Peran & Hak Akses' },
  { id: 'VIEW_AUDIT_LOG', name: 'Lihat Aktivitas Audit Log' },
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

  const { message, modal } = App.useApp();

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
      modal.confirm({
        title: 'Hapus Role',
        content: 'Apakah Anda yakin ingin menghapus role ini?',
        okText: 'Ya, Hapus',
        okType: 'danger',
        cancelText: 'Batal',
        onOk: async () => {
          try {
            await userService.deleteRole(selectedRowKeys[0] as any);
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
