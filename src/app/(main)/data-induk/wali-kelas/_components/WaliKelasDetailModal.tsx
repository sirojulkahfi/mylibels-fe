import React from 'react';
import { Modal, Descriptions, Tag, Badge } from 'antd';
import { WaliKelasItem } from '@/services/data-induk/wali-kelas.service';

interface WaliKelasDetailModalProps {
  isDetailVisible: boolean;
  selectedRecord: WaliKelasItem | null;
  onCancel: () => void;
}

export default function WaliKelasDetailModal({
  isDetailVisible,
  selectedRecord,
  onCancel,
}: WaliKelasDetailModalProps) {
  return (
    <Modal
      title="Detail Informasi Wali Kelas"
      open={isDetailVisible}
      onCancel={onCancel}
      footer={null}
      centered
      width={600}
    >
      {selectedRecord && (
        <Descriptions bordered column={1} size="small" className="mt-4">
          <Descriptions.Item label="Nama Wali Kelas">
            <span className="font-semibold text-gray-800">{selectedRecord.teacherName}</span>
          </Descriptions.Item>
          <Descriptions.Item label="NIP / NIK">{selectedRecord.nip}</Descriptions.Item>
          <Descriptions.Item label="Kelas Binaan">
            <Tag color="blue" className="font-bold">{selectedRecord.className}</Tag> (Tingkat {selectedRecord.level})
          </Descriptions.Item>
          <Descriptions.Item label="Tahun Ajaran & Semester">
            {selectedRecord.academicYear} - Semester {selectedRecord.semester}
          </Descriptions.Item>
          <Descriptions.Item label="Jumlah Siswa">{selectedRecord.studentCount || 0} Siswa</Descriptions.Item>
          <Descriptions.Item label="Kontak / HP">{selectedRecord.phone || '-'}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Badge 
              status={selectedRecord.status === 'Aktif' ? 'success' : 'error'} 
              text={selectedRecord.status} 
            />
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}
