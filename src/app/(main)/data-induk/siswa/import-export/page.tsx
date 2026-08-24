"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, message, Upload, Space, Steps, Table, Alert } from 'antd';
import { ArrowLeftOutlined, InboxOutlined, DownloadOutlined, UploadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import ExcelJS from 'exceljs';
import { siswaService } from '@/services/data-induk/siswa.service';

const { Dragger } = Upload;

export default function ImportExportSiswaPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const handleDownloadTemplate = () => {
    message.success('Template Excel berhasil diunduh');
  };

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.xlsx, .xls, .csv',
    fileList,
    beforeUpload: (file) => {
      setFileList([file]);
      message.loading({ content: 'Membaca file...', key: 'read_file' });
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const buffer = e.target?.result;
          if (!buffer) throw new Error('Empty buffer');
          
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(buffer as ArrayBuffer);
          
          const worksheet = workbook.worksheets[0];
          const parsedData: any[] = [];
          
          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // Skip header row
              const values = row.values as any[];
              // ExcelJS row.values is 1-indexed. Index 1 is first column.
              if (values[1] || values[2] || values[3]) {
                parsedData.push({
                  key: rowNumber.toString(),
                  nisn: values[1] ? String(values[1]) : '',
                  nis: values[2] ? String(values[2]) : '',
                  name: values[3] ? String(values[3]) : 'Tanpa Nama',
                  gender: values[4] ? String(values[4]) : 'L',
                  class: values[5] ? String(values[5]) : '-',
                });
              }
            }
          });
          
          if (parsedData.length === 0) {
            message.error({ content: 'File kosong atau format salah.', key: 'read_file' });
            return;
          }
          
          setPreviewData(parsedData);
          message.success({ content: 'File berhasil dibaca', key: 'read_file' });
          setCurrentStep(1);
        } catch (err) {
          console.error(err);
          message.error({ content: 'Gagal membaca file Excel.', key: 'read_file' });
        }
      };
      
      reader.readAsArrayBuffer(file as any);
      return false; // Prevent automatic upload
    },
    onRemove: () => {
      setFileList([]);
      setPreviewData([]);
      setCurrentStep(0);
    },
  };

  const handleImport = async () => {
    try {
      setUploading(true);
      await siswaService.bulkCreate(previewData);
      message.success('Berhasil mengimpor data siswa ke database!');
      setCurrentStep(2);
    } catch (error) {
      console.error(error);
      message.error('Gagal mengimpor data');
    } finally {
      setUploading(false);
    }
  };

  const columns = [
    { title: 'NISN', dataIndex: 'nisn', key: 'nisn' },
    { title: 'NIS', dataIndex: 'nis', key: 'nis' },
    { title: 'Nama Lengkap', dataIndex: 'name', key: 'name', render: (t: string) => <span className="font-semibold">{t}</span> },
    { title: 'L/P', dataIndex: 'gender', key: 'gender' },
    { title: 'Kelas', dataIndex: 'class', key: 'class' },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between shrink-0">
        <div>
          <div className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 mb-0.5">
            <UploadOutlined className="text-blue-600 text-xs" />
            Import Data Siswa
          </div>
          <p className="text-gray-500 text-[10px] leading-tight m-0">
            Unggah file Excel (misal: format Dapodik) untuk memasukkan ratusan data siswa sekaligus.
          </p>
        </div>
        <Button 
          size="small"
          className="text-xs h-7 px-2"
          icon={<ArrowLeftOutlined className="text-[10px]" />} 
          onClick={() => router.push('/data-induk/siswa')}
        >
          Kembali
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-3 shrink-0">
        <Steps
          current={currentStep}
          items={[
            { title: 'Unggah File', description: 'Pilih file .xlsx / .csv' },
            { title: 'Pratinjau Data', description: 'Cek kesesuaian kolom' },
            { title: 'Selesai', description: 'Data tersimpan' },
          ].map(item => ({ title: item.title, subTitle: item.description, content: item.description }))}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex-1 min-h-0 flex flex-col p-4 overflow-y-auto">
        {currentStep === 0 && (
          <div className="max-w-3xl mx-auto pb-4 w-full h-full flex flex-col">
            <div className="mb-6 flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div>
                <h3 className="font-semibold text-blue-800">Pastikan format sesuai standar sistem!</h3>
                <p className="text-sm text-blue-600">Gunakan template yang disediakan agar data terbaca dengan benar.</p>
              </div>
              <Button icon={<DownloadOutlined />} type="primary" onClick={handleDownloadTemplate} ghost>
                Unduh Template
              </Button>
            </div>
            
            <Dragger {...props} className="bg-white hover:border-blue-500 transition-colors">
              <p className="ant-upload-drag-icon pt-4">
                <InboxOutlined className="text-blue-500 text-5xl" />
              </p>
              <p className="ant-upload-text font-semibold mt-4 text-lg">Klik atau seret file ke area ini untuk mengunggah</p>
              <p className="ant-upload-hint text-gray-500 px-8 pb-4">
                Hanya mendukung file dengan ekstensi <strong>.xlsx, .xls, atau .csv</strong>. Maksimal ukuran file adalah 10MB.
              </p>
            </Dragger>
          </div>
        )}

        {currentStep === 1 && (
          <div className="flex flex-col h-full">
            <Alert
              message="Pratinjau Data (Preview)"
              description={
                <span>
                  Ditemukan <strong>{previewData.length} baris data</strong> siswa yang siap diimpor. Harap periksa apakah kolom dan isi data sudah sesuai.
                </span>
              }
              type="info"
              showIcon
              className="mb-4"
            />
            
            <Table 
              dataSource={previewData} 
              columns={columns} 
              pagination={false} 
              size="small" 
              bordered
              className="mb-4"
              scroll={{ y: 300 }}
            />
            
            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
              <Button onClick={() => { setFileList([]); setCurrentStep(0); setPreviewData([]); }}>
                Batal / Ganti File
              </Button>
              <Button 
                type="primary" 
                icon={<UploadOutlined />} 
                loading={uploading} 
                onClick={handleImport} 
                className="bg-blue-600 shadow-md shadow-blue-200"
              >
                Impor {previewData.length} Data Sekarang
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CheckCircleOutlined className="text-[72px] text-green-500 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Import Berhasil!</h2>
            <p className="text-gray-500 mb-8 max-w-md">
              Data siswa telah berhasil ditambahkan dan disinkronisasi ke dalam database. Data kini dapat dilihat pada tabel Data Siswa.
            </p>
            <Space size="middle">
              <Button onClick={() => { setFileList([]); setCurrentStep(0); setPreviewData([]); }}>
                Import File Lain
              </Button>
              <Button type="primary" onClick={() => router.push('/data-induk/siswa')} className="bg-blue-600">
                Kembali ke Data Siswa
              </Button>
            </Space>
          </div>
        )}
      </div>
    </div>
  );
}
