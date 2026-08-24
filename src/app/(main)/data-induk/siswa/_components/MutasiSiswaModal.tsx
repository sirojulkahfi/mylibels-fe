import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Input, FormInstance, Spin } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

interface MutasiSiswaModalProps {
  isModalVisible: boolean;
  form: FormInstance;
  siswaData: any | null;
  kelasData: any[];
  loading: boolean;
  onCancel: () => void;
  onOk: () => void;
}

export default function MutasiSiswaModal({
  isModalVisible,
  form,
  siswaData,
  kelasData,
  loading,
  onCancel,
  onOk,
}: MutasiSiswaModalProps) {
  useEffect(() => {
    if (isModalVisible && siswaData) {
      form.setFieldsValue({
        status: siswaData.status,
        class: siswaData.class,
      });
    } else if (!isModalVisible) {
      form.resetFields();
    }
  }, [isModalVisible, siswaData, form]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <Modal
      title="Mutasi Siswa"
      open={isModalVisible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Simpan"
      cancelText="Batal"
      width={600}
      forceRender
    >
      <Spin spinning={loading}>
        <div className="mt-2">
          {siswaData && (
            <div className="bg-slate-50 p-4 rounded-md mb-4 border border-slate-200 grid grid-cols-2 gap-y-2 text-sm">
               <div>
                 <div className="text-gray-500 text-xs">Nama Lengkap</div>
                 <div className="font-semibold text-gray-800">{siswaData.name}</div>
               </div>
               <div>
                 <div className="text-gray-500 text-xs">NISN / NIS</div>
                 <div className="font-semibold text-gray-800">{siswaData.nisn} / {siswaData.nis}</div>
               </div>
               <div>
                 <div className="text-gray-500 text-xs">Kelas Saat Ini</div>
                 <div className="font-semibold text-gray-800">{siswaData.class}</div>
               </div>
               <div>
                 <div className="text-gray-500 text-xs">Status Saat Ini</div>
                 <div className="font-semibold text-gray-800">{siswaData.status}</div>
               </div>
            </div>
          )}

          <Form form={form} layout="vertical">
            <Form.Item
              name="status"
              label="Ubah Status Siswa"
              rules={[{ required: true, message: 'Harap pilih status baru' }]}
            >
              <Select placeholder="Pilih Status Baru">
                <Option value="Aktif">Aktif</Option>
                <Option value="Lulus">Lulus</Option>
                <Option value="Pindah">Pindah</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="class"
              label="Pindah Kelas"
              rules={[{ required: true, message: 'Harap pilih kelas' }]}
            >
              <Select 
                showSearch
                placeholder="Pilih Kelas Baru"
                optionFilterProp="children"
              >
                {kelasData.map((k: any) => (
                  <Option key={k.id} value={k.name}>
                    {k.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="mutasiNotes"
              label="Catatan Mutasi (Opsional)"
            >
              <TextArea rows={3} placeholder="Masukkan catatan mengenai mutasi ini (alasan pindah, dsb)" />
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </Modal>
  );
}
