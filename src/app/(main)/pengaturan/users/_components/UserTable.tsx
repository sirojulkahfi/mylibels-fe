/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react';
import { Table, Input, Button, Space, Tag } from 'antd';
import type { InputRef } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface Props {
  data: any[];
  loading: boolean;
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: (keys: React.Key[]) => void;
}

export default function UserTable({ data, loading, selectedRowKeys, setSelectedRowKeys }: Props) {
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
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Username', dataIndex: 'username', key: 'username', ...getColumnSearchProps('username') },
    { title: 'Nama Lengkap', dataIndex: 'namaLengkap', key: 'namaLengkap', ...getColumnSearchProps('namaLengkap') },
    { title: 'Role', dataIndex: ['role', 'name'], key: 'role', render: (val: string) => <Tag color="blue">{val || 'No Role'}</Tag> },
  ];

  return (
    <div className="flex-1 overflow-hidden mt-2">
      <Table
        pagination={{ defaultPageSize: 10, showSizeChanger: true, hideOnSinglePage: false, pageSizeOptions: ['10', '20', '50', '80', '100'], showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} data` }}
        scroll={{ y: 'calc(100vh - 360px)' }} 
        columns={columns} 
        dataSource={data} 
        rowKey="id" 
        loading={loading}
        size="small"
        className="small-table"
        style={{ fontSize: '11px' }}
        rowSelection={{
          type: 'radio',
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
          checkStrictly: true,
        }}
        onRow={(record) => ({
          onClick: () => setSelectedRowKeys([record.id])
        })}
      />
    </div>
  );
}
