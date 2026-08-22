/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react';
import { Table, Input, Space, Button, Tag } from 'antd';
import type { InputRef } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface Props {
  roles: any[];
  loading: boolean;
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: (keys: React.Key[]) => void;
}

export default function PermissionTable({ roles, loading, selectedRowKeys, setSelectedRowKeys }: Props) {
  const searchInput = useRef<InputRef>(null);

  const getColumnSearchProps = (dataIndex: string): any => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
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
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name')
    },
    {
      title: 'Role Type',
      dataIndex: 'name',
      key: 'type',
      render: (val: string) => <Tag color={val === 'SUPER_ADMIN' ? 'purple' : 'blue'}>{val === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'CUSTOM'}</Tag>
    },
    {
      title: 'Assigned Permissions',
      key: 'permissions',
      render: (_: any, record: any) => {
        const perms = record.permissions || [];
        return (
          <Space size={[0, 4]} wrap>
            {perms.slice(0, 5).map((p: string) => (
              <Tag color="cyan" key={p} style={{ fontSize: '10px' }}>
                {p}
              </Tag>
            ))}
            {perms.length > 5 && (
              <Tag color="default" style={{ fontSize: '10px' }}>
                +{perms.length - 5} more
              </Tag>
            )}
            {perms.length === 0 && (
              <span className="text-gray-400 text-xs italic">No permissions assigned</span>
            )}
          </Space>
        )
      }
    }
  ];

  return (
    <div className="flex-1 overflow-hidden mt-2">
      <Table
        pagination={{ defaultPageSize: 10, showSizeChanger: true, hideOnSinglePage: false, pageSizeOptions: ['10', '20', '50', '80', '100'], showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} data` }}
        scroll={{ y: 'calc(100vh - 360px)' }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
          type: 'radio',
        }}
        columns={columns}
        dataSource={roles}
        size="small"
        loading={loading}
        rowKey="id"
        className="small-table"
        style={{ fontSize: '11px' }}
        onRow={(record) => ({
          onClick: () => setSelectedRowKeys([record.id])
        })}
      />
    </div>
  );
}
