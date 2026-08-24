import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, Switch, Button, App } from 'antd';
import dayjs from 'dayjs';
import { tahunAjaranService } from '@/services/system/tahun-ajaran.service';

interface TahunAjaranModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function TahunAjaranModal({ isOpen, onClose, onSuccess, initialData }: TahunAjaranModalProps) {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        let datesValue = undefined;
        if (initialData.startDate && initialData.endDate) {
          datesValue = [dayjs(initialData.startDate), dayjs(initialData.endDate)];
        }

        form.setFieldsValue({
          name: initialData.name,
          isActive: initialData.isActive,
          dates: datesValue
        });
      } else {
        form.resetFields();
      }
    }
  }, [isOpen, initialData, form]);

  const handleSubmit = async (values: any) => {
    try {
      setSaving(true);
      const payload = {
        name: values.name,
        isActive: values.isActive,
        startDate: values.dates ? values.dates[0].toDate() : undefined,
        endDate: values.dates ? values.dates[1].toDate() : undefined,
      };

      if (initialData?.id) {
        await tahunAjaranService.update(initialData.id, payload);
        message.success("Tahun ajaran berhasil diperbarui");
      } else {
        await tahunAjaranService.create(payload);
        message.success("Tahun ajaran berhasil ditambahkan");
      }
      onSuccess();
      onClose();
    } catch (error) {
      message.error("Gagal menyimpan data tahun ajaran");
    } finally {
      setSaving(false);
    }
  };

  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Modal
      title={initialData ? "Edit Tahun Ajaran" : "Tambah Tahun Ajaran Baru"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      forceRender
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ isActive: false }}
        className="mt-4"
      >
        <Form.Item
          name="name"
          label="Nama Tahun Ajaran"
          rules={[{ required: true, message: 'Harap isi nama tahun ajaran!' }]}
        >
          <Input placeholder="Contoh: 2023/2024" />
        </Form.Item>

        <Form.Item
          name="dates"
          label="Periode"
        >
          <DatePicker.RangePicker className="w-full" />
        </Form.Item>

        <Form.Item
          name="isActive"
          label="Jadikan Sebagai Tahun Ajaran Aktif?"
          valuePropName="checked"
        >
          <Switch checkedChildren="Aktif" unCheckedChildren="Tidak" />
        </Form.Item>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onClose}>Batal</Button>
          <Button type="primary" htmlType="submit" loading={saving} className="bg-blue-600">
            Simpan
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
