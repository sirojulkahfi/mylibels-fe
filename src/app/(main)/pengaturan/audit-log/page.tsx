/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { Breadcrumb, message } from 'antd';
import { ReloadOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';

import ToolbarWrapper from '@/components/ui/ToolbarWrapper';
import ButtonToolbar from '@/components/ui/ButtonToolbar';
import { auditLogService } from '@/services/audit-log.service';
import AuditLogTable from './_components/AuditLogTable';
import AuditLogDetailModal from './_components/AuditLogDetailModal';

export default function AuditLogPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [detailData, setDetailData] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);

    const fetchData = async () => {
    setLoading(true);
    try {
      const res = await auditLogService.getAll();
      setData(res);
    } catch {
      console.error('Failed to fetch audit logs');
    } finally {
      setLoading(false);
      setSelectedRowKeys([]);
    }
  };

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    setTimeout(() => fetchData(), 0);
  }, []);

  const handleDetail = () => {
    if (selectedRowKeys.length === 1) {
      const selectedRecord = data.find((item) => item.id === selectedRowKeys[0]);
      if (selectedRecord) {
        setDetailData(selectedRecord);
        setIsDetailModalVisible(true);
      }
    }
  };

  const exportToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Audit Logs');

      worksheet.addRow(['ID', 'Action', 'Entity', 'Entity ID', 'User', 'Timestamp', 'Details']);
      
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
      });

      data.forEach((log) => {
        worksheet.addRow([
          log.id,
          log.action,
          log.entity,
          log.entityId || '-',
          log.user?.namaLengkap || log.userId || '-',
          dayjs(log.createdAt).format('YYYY-MM-DD HH:mm:ss'),
          log.details ? JSON.stringify(log.details) : '-'
        ]);
      });

      worksheet.getColumn(1).width = 10;
      worksheet.getColumn(2).width = 15;
      worksheet.getColumn(3).width = 20;
      worksheet.getColumn(4).width = 15;
      worksheet.getColumn(5).width = 25;
      worksheet.getColumn(6).width = 20;
      worksheet.getColumn(7).width = 50;

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `Audit_Logs_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`);
    } catch (error) {
      console.error(error);
      message.error('Gagal mengekspor file Excel');
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 p-4 pt-2 relative">
      <div className="mb-2 text-gray-500 text-sm">
        <Breadcrumb items={[{ title: 'Pengaturan' }, { title: 'Audit Logs' }]} />
      </div>
      
      <ToolbarWrapper>
        <span className="text-white font-bold leading-tight flex-1 mr-4">Riwayat Aktivitas Sistem (Audit Logs)</span>
        <ButtonToolbar message="Refresh Data" icon={<ReloadOutlined />} onClick={fetchData} />
        <ButtonToolbar message="Export ke Excel" icon={<DownloadOutlined />} onClick={exportToExcel} enable={data.length > 0} />
        <ButtonToolbar message="Lihat Detail" icon={<EyeOutlined />} onClick={handleDetail} enable={selectedRowKeys.length === 1} />
      </ToolbarWrapper>

      <div className="data-induk-table-wrapper bg-white px-4 pb-4 pt-1 mt-1 rounded-lg shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0">
        {mounted && (
          <>
            <AuditLogTable 
              data={data}
              loading={loading}
              selectedRowKeys={selectedRowKeys}
              setSelectedRowKeys={setSelectedRowKeys}
            />

            <AuditLogDetailModal 
              isDetailModalVisible={isDetailModalVisible}
              setIsDetailModalVisible={setIsDetailModalVisible}
              detailData={detailData}
            />
          </>
        )}
      </div>
    </div>
  );
}
