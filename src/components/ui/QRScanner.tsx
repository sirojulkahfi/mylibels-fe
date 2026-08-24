"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button, Alert } from 'antd';
import { CameraOutlined, CloseOutlined } from '@ant-design/icons';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: any) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onScanFailure }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [isScanning]);

  const startScanner = async () => {
    try {
      setError(null);
      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Prevent multiple scans
          html5QrCode.stop().then(() => {
            setIsScanning(false);
            onScanSuccess(decodedText);
          }).catch(console.error);
        },
        (errorMessage) => {
          if (onScanFailure) {
            onScanFailure(errorMessage);
          }
        }
      );
      setIsScanning(true);
    } catch (err: any) {
      setError(err?.message || "Gagal mengakses kamera. Pastikan izin kamera telah diberikan.");
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error("Failed to stop scanner", err);
      }
    }
  };

  return (
    <div className="w-full mx-auto flex flex-col items-center">
      {!isScanning ? (
        <Button 
          type="primary" 
          icon={<CameraOutlined />} 
          onClick={startScanner}
          size="large"
          className="w-full mb-4 bg-indigo-600 hover:bg-indigo-500 shadow-md"
        >
          Scan dengan Kamera
        </Button>
      ) : (
        <div className="w-full relative rounded-xl overflow-hidden mb-4 border-2 border-indigo-500 bg-black">
          <div id="reader" className="w-full min-h-[300px]"></div>
          <Button 
            icon={<CloseOutlined />}
            onClick={stopScanner}
            className="absolute top-2 right-2 bg-white/80 hover:bg-white border-0 shadow-md z-10"
            danger
          >
            Tutup Kamera
          </Button>
        </div>
      )}
      
      {error && (
        <Alert title="Error" description={error} type="error" showIcon className="w-full text-left mb-4" />
      )}
    </div>
  );
};

export default QRScanner;
