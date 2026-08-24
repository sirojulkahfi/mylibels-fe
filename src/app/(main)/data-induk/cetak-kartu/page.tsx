"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, Table, Button, App, Spin, Modal, Breadcrumb } from 'antd';
import { PrinterOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';

import { siswaService } from '@/services/data-induk/siswa.service';
import { guruStafService } from '@/services/data-induk/guru-staf.service';
import PrintableCard from './_components/PrintableCard';

export default function CetakKartuPage() {
    const { message } = App.useApp();
    const [activeTab, setActiveTab] = useState('siswa');
    
    // Data
    const [siswaData, setSiswaData] = useState<any[]>([]);
    const [guruData, setGuruData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Selection
    const [selectedSiswaKeys, setSelectedSiswaKeys] = useState<React.Key[]>([]);
    const [selectedGuruKeys, setSelectedGuruKeys] = useState<React.Key[]>([]);
    
    // Preview & Print State
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [siswaRes, guruRes] = await Promise.all([
                siswaService.findAll(),
                guruStafService.findAll()
            ]);
            setSiswaData(Array.isArray(siswaRes) ? siswaRes : []);
            setGuruData(Array.isArray(guruRes) ? guruRes : []);
        } catch (error) {
            message.error('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const siswaColumns = [
        { title: 'NISN', dataIndex: 'nisn', key: 'nisn' },
        { title: 'Nama Siswa', dataIndex: 'name', key: 'name' },
        { title: 'Kelas', dataIndex: 'class', key: 'class' },
    ];

    const guruColumns = [
        { title: 'NIP / NIK', dataIndex: 'nip', key: 'nip' },
        { title: 'Nama Guru/Staf', dataIndex: 'name', key: 'name' },
        { title: 'Posisi', dataIndex: 'position', key: 'position' },
    ];

    const handleOpenPreview = () => {
        const hasSelection = activeTab === 'siswa' ? selectedSiswaKeys.length > 0 : selectedGuruKeys.length > 0;
        if (!hasSelection) {
            message.warning('Pilih minimal 1 data untuk dicetak');
            return;
        }
        setIsPreviewVisible(true);
    };

    const handleSaveCards = async () => {
        setIsPrinting(true);
        message.loading({ content: 'Mempersiapkan Kartu...', key: 'print' });
        
        setTimeout(async () => {
            try {
                const html2canvas = (await import('html2canvas')).default;
                const dataToPrint = getSelectedData();
                for (const item of dataToPrint) {
                    const element = document.getElementById(`card-${item.id}`);
                    if (element) {
                        const canvas = await html2canvas(element, { scale: 3, useCORS: true, backgroundColor: null });
                        const image = canvas.toDataURL("image/png");
                        const link = document.createElement('a');
                        link.download = `ID_${activeTab === 'siswa' ? 'Siswa' : 'Guru'}_${item.name.replace(/\s+/g, '_')}.png`;
                        link.href = image;
                        link.click();
                    }
                }
                message.success({ content: `${dataToPrint.length} Kartu berhasil diunduh (PNG)!`, key: 'print', duration: 3 });
                setIsPreviewVisible(false);
            } catch (error) {
                console.error(error);
                message.error({ content: 'Gagal men-generate gambar', key: 'print', duration: 2 });
            } finally {
                setIsPrinting(false);
            }
        }, 500);
    };

    const getSelectedData = () => {
        if (activeTab === 'siswa') {
            return siswaData.filter(d => selectedSiswaKeys.includes(d.id));
        } else {
            return guruData.filter(d => selectedGuruKeys.includes(d.id));
        }
    };

    const printData = getSelectedData();

    return (
        <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative print:bg-white print:p-0">
            {/* Screen UI - Hidden when printing */}
            <div className="print:hidden flex flex-col flex-1 min-h-0">
                <div className="mb-2 text-gray-500 text-sm">
                    <Breadcrumb items={[{ title: 'Data Induk' }, { title: 'Cetak Kartu ID' }]} />
                </div>
                <ToolbarWrapper>
                    <span className="text-white font-bold leading-tight flex-1 mr-4">Cetak Kartu ID</span>
                    <ButtonToolbar 
                        message="Preview & Cetak Kartu" 
                        icon={<EyeOutlined />} 
                        onClick={handleOpenPreview}
                        enable={activeTab === 'siswa' ? selectedSiswaKeys.length > 0 : selectedGuruKeys.length > 0}
                    />
                </ToolbarWrapper>

                <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-1 mt-1 rounded-lg shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0">
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        className="flex-1 flex flex-col min-h-0"
                        items={[
                            {
                                key: 'siswa',
                                label: 'Kartu Siswa',
                                children: (
                                    <div className="flex-1 overflow-auto">
                                        <Table
                                            rowSelection={{
                                                selectedRowKeys: selectedSiswaKeys,
                                                onChange: setSelectedSiswaKeys,
                                            }}
                                            columns={siswaColumns}
                                            dataSource={siswaData}
                                            rowKey="id"
                                            size="small"
                                            pagination={false}
                                            loading={loading}
                                        />
                                    </div>
                                )
                            },
                            {
                                key: 'guru',
                                label: 'Kartu Guru & Staf',
                                children: (
                                    <div className="flex-1 overflow-auto">
                                        <Table
                                            rowSelection={{
                                                selectedRowKeys: selectedGuruKeys,
                                                onChange: setSelectedGuruKeys,
                                            }}
                                            columns={guruColumns}
                                            dataSource={guruData}
                                            rowKey="id"
                                            size="small"
                                            pagination={false}
                                            loading={loading}
                                        />
                                    </div>
                                )
                            }
                        ]}
                    />
                </div>
            </div>

            {/* Preview Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2 text-slate-800">
                        <PrinterOutlined className="text-blue-600" />
                        Preview Kartu ID
                    </div>
                }
                open={isPreviewVisible}
                onCancel={() => setIsPreviewVisible(false)}
                width={850}
                centered
                footer={[
                    <Button key="cancel" onClick={() => setIsPreviewVisible(false)} disabled={isPrinting}>
                        Batal
                    </Button>,
                    <Button 
                        key="save" 
                        type="primary" 
                        onClick={handleSaveCards} 
                        loading={isPrinting} 
                        icon={<DownloadOutlined />}
                        className="bg-blue-600"
                    >
                        Simpan ({printData.length} Kartu)
                    </Button>
                ]}
            >
                <div className="bg-slate-100 p-6 rounded-lg max-h-[65vh] overflow-y-auto mt-4">
                    <p className="text-sm text-slate-500 mb-4 text-center">
                        Periksa kembali data pada kartu. Klik tombol "Simpan" untuk mengunduhnya dalam format PNG.
                    </p>
                    <div className="flex flex-wrap gap-6 items-start justify-center">
                        {printData.map(item => (
                            <div key={item.id} id={`card-${item.id}`} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <PrintableCard 
                                    type={activeTab as 'siswa' | 'guru'} 
                                    data={item} 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
