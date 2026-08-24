import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Button, App } from 'antd';
import { akademikService } from '@/services/akademik/akademik.service';

const { Option } = Select;

interface EditJadwalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  jadwalData: any | null;
  mapelList: any[];
  guruList: any[];
  kelasId: string;
}

export default function EditJadwalModal({
  isOpen,
  onClose,
  onSuccess,
  jadwalData,
  mapelList,
  guruList,
  kelasId,
}: EditJadwalModalProps) {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [filteredGuruList, setFilteredGuruList] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    setFilteredGuruList(guruList);
  }, [guruList]);

  const filterGurusByMapelId = React.useCallback((mapelId: string) => {
    const mapel = mapelList.find(m => m.id === mapelId);
    if (!mapel) {
      setFilteredGuruList(guruList);
      return;
    }
    
    // Filter gurus who teach this mapel
    const matchingGurus = guruList.filter(g => {
      if (!g.subject || g.subject === '-') return false;
      const teacherSubjects = g.subject.split(',').map((s: string) => s.trim().toLowerCase());
      const mapelName = mapel.name.toLowerCase();
      return teacherSubjects.some((s: string) => mapelName.includes(s) || s.includes(mapelName));
    });

    if (matchingGurus.length > 0) {
      setFilteredGuruList(matchingGurus);
      
      // Auto select if only one matching guru and guru isn't already set to one of them
      const currentGuruId = form.getFieldValue('guruId');
      if (matchingGurus.length === 1 && currentGuruId !== matchingGurus[0].id) {
        form.setFieldsValue({ guruId: matchingGurus[0].id });
      } else if (!matchingGurus.find(g => g.id === currentGuruId)) {
        form.setFieldsValue({ guruId: undefined });
      }
    } else {
      setFilteredGuruList(guruList); // fallback if no specific guru found
      form.setFieldsValue({ guruId: undefined });
    }
  }, [mapelList, guruList, form]);

  useEffect(() => {
    if (isOpen && jadwalData) {
      form.setFieldsValue({
        mapelId: jadwalData.mapelId || undefined,
        guruId: jadwalData.guruId || undefined,
      });
      // Optionally trigger filter update on open based on mapelId
      if (jadwalData.mapelId) {
        filterGurusByMapelId(jadwalData.mapelId);
      } else {
        setFilteredGuruList(guruList);
      }
    } else {
      form.resetFields();
      setFilteredGuruList(guruList);
    }
  }, [isOpen, jadwalData, form, guruList, filterGurusByMapelId]);

  if (!mounted) return null;

  const handleMapelChange = (value: string) => {
    filterGurusByMapelId(value);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const payload = {
        mapelId: values.mapelId,
        guruId: values.guruId,
      };

      if (jadwalData?.id) {
        // Update existing schedule
        await akademikService.updateJadwal(jadwalData.id, payload);
        message.success('Jadwal berhasil diperbarui');
      } else {
        // Create new schedule slot
        await akademikService.createJadwal({
          ...payload,
          kelasId,
          ruanganId: kelasId, // Fallback ke kelas ID
          hari: jadwalData.hari,
          jamMulai: jadwalData.jamMulai,
          jamSelesai: jadwalData.jamSelesai,
        });
        message.success('Jadwal berhasil ditambahkan');
      }
      
      onSuccess();
    } catch (error) {
      console.error(error);
      message.error('Gagal menyimpan jadwal');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!jadwalData?.id) {
        // Just clear the form if it hasn't been saved yet
        form.resetFields();
        return;
    }
    
    try {
      setLoading(true);
      await akademikService.deleteJadwal(jadwalData.id);
      message.success('Jadwal berhasil dihapus (dikosongkan)');
      onSuccess();
    } catch (error) {
      console.error(error);
      message.error('Gagal menghapus jadwal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Edit Jadwal: ${jadwalData?.hari || ''} (${jadwalData?.jamMulai || ''} - ${jadwalData?.jamSelesai || ''})`}
      open={isOpen}
      onCancel={onClose}
      forceRender
      footer={[
        <Button key="delete" danger onClick={handleDelete} loading={loading} className="float-left">
          Kosongkan Jadwal
        </Button>,
        <Button key="cancel" onClick={onClose}>
          Batal
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
          Simpan
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="mapelId"
          label="Mata Pelajaran"
          rules={[{ required: true, message: 'Harap pilih mata pelajaran' }]}
        >
          <Select 
            showSearch 
            optionFilterProp="children" 
            placeholder="Pilih Mata Pelajaran"
            onChange={handleMapelChange}
          >
            {mapelList.map(m => (
              <Option key={m.id} value={m.id}>{m.name}</Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item
          name="guruId"
          label="Guru Pengajar"
          rules={[{ required: true, message: 'Harap pilih guru' }]}
        >
          <Select showSearch optionFilterProp="children" placeholder="Pilih Guru">
            {filteredGuruList.map(g => (
              <Option key={g.id} value={g.id}>{g.name}</Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
