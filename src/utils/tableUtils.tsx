import React from 'react';
import { Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { FilterDropdownProps } from 'antd/es/table/interface';

/**
 * Utility untuk membuat fitur Search (ketik tulisan) di kolom Ant Design Table.
 * @param dataIndex Nama property di data object (bisa string atau array of string untuk nested object)
 * @param placeholder Teks placeholder untuk input
 * @returns Object berisi props untuk disisipkan ke dalam definisi kolom tabel
 */
export const getColumnSearchProps = <T = any>(dataIndex: string | string[], placeholder: string = 'Cari...') => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
    <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
      <Input
        placeholder={placeholder}
        value={selectedKeys[0] ? String(selectedKeys[0]) : ''}
        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => confirm()}
        style={{ marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => confirm()}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() => {
            if (clearFilters) {
              clearFilters();
            }
            setSelectedKeys([]);
            confirm();
          }}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
  ),
  onFilter: (value: boolean | React.Key, record: T) => {
    const getNestedValue = (obj: any, path: string | string[]): unknown => {
      if (Array.isArray(path)) {
        return path.reduce((acc: unknown, curr: string) => {
          if (acc && typeof acc === 'object') {
            return (acc as any)[curr];
          }
          return undefined;
        }, obj);
      }
      return obj[path];
    };

    const recordValue = getNestedValue(record as any, dataIndex);
    if (recordValue === null || recordValue === undefined) return false;
    
    return recordValue
      .toString()
      .toLowerCase()
      .includes((value as string).toLowerCase());
  },
});
