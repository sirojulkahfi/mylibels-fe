import React from 'react';
import { Modal, Descriptions, Tag, Spin } from 'antd';

interface DetailSiswaModalProps {
  isModalVisible: boolean;
  data: any | null;
  loading: boolean;
  onCancel: () => void;
}

export default function DetailSiswaModal({
  isModalVisible,
  data,
  loading,
  onCancel,
}: DetailSiswaModalProps) {
  return (
    <Modal
      title="Detail Data Siswa"
      open={isModalVisible}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : !data ? (
        <div className="p-4 text-center">Data siswa tidak ditemukan.</div>
      ) : (
        <div className="mt-4">
          <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
            <Descriptions.Item label="NISN">{data.nisn}</Descriptions.Item>
            <Descriptions.Item label="NIS">{data.nis}</Descriptions.Item>
            <Descriptions.Item label="Nama Lengkap" span={2}>{data.name}</Descriptions.Item>
            <Descriptions.Item label="Jenis Kelamin">{data.gender}</Descriptions.Item>
            <Descriptions.Item label="Kelas">{data.class}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={data.status === 'Aktif' ? 'green' : data.status === 'Lulus' ? 'blue' : 'orange'}>
                {data.status?.toUpperCase()}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          <div className="mt-6 font-semibold text-gray-700 mb-2">Informasi Orang Tua / Wali</div>
          <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
            <Descriptions.Item label="Nama Orang Tua / Wali" span={2}>
              {data.parentName || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="No. Telepon" span={2}>
              {data.parentPhone || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Alamat Lengkap" span={2}>
              {data.address || '-'}
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </Modal>
  );
}
