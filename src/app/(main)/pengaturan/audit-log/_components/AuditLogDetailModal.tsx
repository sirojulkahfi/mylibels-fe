/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';

interface Props {
  isDetailModalVisible: boolean;
  setIsDetailModalVisible: (val: boolean) => void;
  detailData: any | null;
}

export default function AuditLogDetailModal({
  isDetailModalVisible, setIsDetailModalVisible, detailData
}: Props) {
  return (
    <Modal
      title="Audit Log Detail"
      open={isDetailModalVisible}
      onCancel={() => setIsDetailModalVisible(false)}
      footer={null}
      width={800}
      destroyOnHidden
    >
      {detailData && (
        <Descriptions bordered size="small" column={2} className="mt-4">
          <Descriptions.Item label="Action" span={1}>
            <Tag color="blue">{detailData.action}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Entity Name" span={1}>
            <strong>{detailData.entity}</strong>
          </Descriptions.Item>
          
          <Descriptions.Item label="User" span={1}>
            {detailData.user ? `${detailData.user.username} (${detailData.user.role?.name})` : 'System'}
          </Descriptions.Item>
          <Descriptions.Item label="Timestamp" span={1}>
            {new Date(detailData.createdAt).toLocaleString('id-ID')}
          </Descriptions.Item>
          
          <Descriptions.Item label="Details" span={2}>
            <div className="flex flex-col gap-2">
              {detailData.details ? (
                (() => {
                  try {
                    const parsed = JSON.parse(detailData.details);
                    return Object.entries(parsed).map(([k, v]) => (
                      <div key={k} className="flex flex-row border-b border-gray-200 pb-1">
                        <span className="w-1/3 font-semibold text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="w-2/3">{String(v)}</span>
                      </div>
                    ));
                  } catch (e) {
                    return <span>{detailData.details}</span>;
                  }
                })()
              ) : (
                <span className="text-gray-400 italic">No additional details</span>
              )}
            </div>
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}
