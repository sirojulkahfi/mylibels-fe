"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Table, Breadcrumb, App, Input, Space, Button, Tag } from 'antd';
import type { InputRef } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { settingsService } from '@/services/system/settings.service';

import { useAuthStore } from '@/store/useAuthStore';
import ModalCreate from './_components/modal-create';
import ModalUpdate from './_components/modal-update';

export default function SystemSettingsPage() {
    const { message, modal } = App.useApp();
    const { user } = useAuthStore();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editData, setEditData] = useState<any | null>(null);
    const [mounted, setMounted] = useState(false);

    
    const hasPermission = (requiredPermission: string) => {
        if (!user) return false;
        if (user?.role?.name === 'SUPER_ADMIN') return true;
        return user?.role?.permissions?.includes(requiredPermission) || false;
    };

    const canManage = hasPermission('MANAGE_SETTINGS');

        const fetchData = async () => {
        setLoading(true);
        try {
            const res = await settingsService.findAll();
            setData(res.data);
        } catch {
            message.error('Failed to fetch system settings');
        } finally {
            setLoading(false);
            setSelectedRowKeys([]);
        }
    };

    useEffect(() => {
        setTimeout(() => setMounted(true), 0);
        setTimeout(() => fetchData(), 0);
  }, []);

    const searchInput = useRef<InputRef>(null);

    const getColumnSearchProps = (dataIndex: string): any => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${String(dataIndex)}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => confirm()}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button type="primary" onClick={() => confirm()} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
                        Search
                    </Button>
                    <Button onClick={() => { if (clearFilters) clearFilters(); confirm(); }} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value: any, record: any) =>
            record[dataIndex]?.toString().toLowerCase().includes((value as string).toLowerCase()),
    });

    const columns = [
        {
            title: 'Setting Key',
            dataIndex: 'key',
            key: 'key',
            render: (val: string) => <Tag color="blue">{val}</Tag>,
            ...getColumnSearchProps('key')
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
            ...getColumnSearchProps('value')
        },
        {
            title: 'Description',
            dataIndex: 'group',
            key: 'group',
            ...getColumnSearchProps('group')
        },
        {
            title: 'Last Updated',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (val: string) => val ? dayjs(val).format('YYYY-MM-DD HH:mm') : '-'
        }
    ];

    const handleEdit = () => {
        if (selectedRowKeys.length === 1) {
            const selectedRecord = data.find((item) => item.id === selectedRowKeys[0]);
            if (selectedRecord) {
                setEditData(selectedRecord);
                setIsEditModalVisible(true);
            }
        }
    };

    const handleDelete = () => {
        if (selectedRowKeys.length === 1) {
            const settingKey = data.find(d => d.id === selectedRowKeys[0])?.key;
            modal.confirm({
                title: 'Are you sure you want to delete this setting?',
                icon: <ExclamationCircleOutlined />,
                content: `Setting Key: ${settingKey}`,
                okText: 'Yes, Delete',
                okType: 'danger',
                cancelText: 'Cancel',
                centered: true,
                onOk: async () => {
                    try {
                        await settingsService.remove(String(selectedRowKeys[0]));
                        message.success('Setting successfully deleted');
                        setTimeout(() => fetchData(), 0);
                    } catch (error: any) {
                        message.error(error.response?.data?.message || 'Failed to delete setting');
                        message.error(error.response?.data?.message || 'Failed to delete setting');
                    }
                },
            });
        }
    };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[{ title: 'Pengaturan' }, { title: 'System Settings' }]} />
      </div>
      
      <ToolbarWrapper>
        <span className="text-white font-bold leading-tight flex-1 mr-4">Pengaturan Sistem (Advanced)</span>
        <ButtonToolbar message="Refresh Data" icon={<ReloadOutlined />} onClick={fetchData} />
        {canManage && <ButtonToolbar message="Tambah Setting" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)} />}
        {canManage && <ButtonToolbar message="Edit Setting" icon={<EditOutlined />} onClick={handleEdit} enable={selectedRowKeys.length === 1} />}
        {canManage && <ButtonToolbar message="Hapus Setting" icon={<DeleteOutlined />} onClick={handleDelete} enable={selectedRowKeys.length === 1} />}
      </ToolbarWrapper>

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-1 mt-1 rounded-lg shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0">
        {mounted && (
          <>
            <div className="flex-1 overflow-hidden mt-2">
              <Table
                pagination={{ defaultPageSize: 50, showSizeChanger: true, pageSizeOptions: ['50', '80', '100'], showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} data` }}
                scroll={{ y: 'calc(100vh - 280px)' }}
                rowSelection={{
                  selectedRowKeys,
                  onChange: (keys) => setSelectedRowKeys(keys),
                  checkStrictly: true,
                  type: 'radio',
                }}
                columns={columns}
                dataSource={data}
                size="small"
                loading={loading}
                rowKey="id"
                className="small-table"
                style={{ fontSize: '11px' }}
              />
            </div>

            <ModalCreate
              visible={isCreateModalVisible}
              onClose={() => setIsCreateModalVisible(false)}
              onSuccess={fetchData}
            />

            {editData && (
              <ModalUpdate
                visible={isEditModalVisible}
                onClose={() => setIsEditModalVisible(false)}
                onSuccess={fetchData}
                data={editData}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
