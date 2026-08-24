/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react';
import { Table, Input, Space, Button, Tag } from 'antd';
import type { InputRef } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface Props {
  data: any[];
  loading: boolean;
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: (keys: React.Key[]) => void;
}

export default function AuditLogTable({ data, loading, selectedRowKeys, setSelectedRowKeys }: Props) {
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
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (val: string) => {
        let color = 'blue';
        if (val.includes('CREATE')) color = 'green';
        if (val.includes('UPDATE') || val.includes('REVIEW') || val.includes('ASSESS')) color = 'orange';
        if (val.includes('DELETE')) color = 'red';
        return <Tag color={color}>{val}</Tag>;
      },
      ...getColumnSearchProps('action')
    },
    {
      title: 'Entity Name',
      dataIndex: 'entity',
      key: 'entity',
      ...getColumnSearchProps('entity')
    },
    {
      title: 'User',
      key: 'user',
      render: (_: any, record: any) => record.user ? `${record.user.name || record.user.username} (${record.user.role?.name || ''})` : (record.userId || 'System')
    },
    {
      title: 'Timestamp',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (val: string) => new Date(val).toLocaleString('id-ID')
    }
  ];

  return (
    <div className="flex-1 overflow-hidden mt-2">
      <Table
        pagination={{ defaultPageSize: 15, showSizeChanger: true, hideOnSinglePage: false, pageSizeOptions: ['15', '20', '50', '80', '100'], showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} data` }}
        scroll={{ y: 'calc(100vh - 360px)' }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
          type: 'radio',
        }}
        columns={columns}
        dataSource={data}
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
