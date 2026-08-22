/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Modal, Transfer } from 'antd';

interface Props {
  isAssignModalVisible: boolean;
  setIsAssignModalVisible: (val: boolean) => void;
  editData: any | null;
  handleOk: () => Promise<void>;
  updating: boolean;
  AVAILABLE_PERMISSIONS: any[];
  targetKeys: React.Key[];
  setTargetKeys: (keys: React.Key[]) => void;
}

export default function PermissionAssignModal({
  isAssignModalVisible, setIsAssignModalVisible, editData, handleOk, updating, AVAILABLE_PERMISSIONS, targetKeys, setTargetKeys
}: Props) {
  return (
    <Modal
      title={`Assign Permissions to: ${editData?.name || ''}`}
      open={isAssignModalVisible}
      onOk={handleOk}
      centered={true}
      onCancel={() => setIsAssignModalVisible(false)}
      confirmLoading={updating}
      width={700}
      destroyOnHidden
    >
      <div className="flex justify-center py-2">
        <Transfer
          dataSource={AVAILABLE_PERMISSIONS.map(p => ({ key: p.id, title: p.name, description: p.id }))}
          showSearch
          styles={{
            section: { width: 300, height: 400 }
          }}
          titles={['Available', 'Assigned']}
          targetKeys={targetKeys}
          onChange={(newKeys) => setTargetKeys(newKeys)}
          render={(item) => <span className="font-medium">{item.title} <span className="text-gray-400 text-xs">({item.description})</span></span>} 
        />
      </div>
    </Modal>
  );
}
