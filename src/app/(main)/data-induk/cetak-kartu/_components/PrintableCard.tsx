import React from 'react';

interface CardProps {
  type: 'siswa' | 'guru';
  data: any;
}

export default function PrintableCard({ type, data }: CardProps) {
  // NISN for siswa, NIP for guru
  const barcodeData = type === 'siswa' ? data.nisn : data.nip;
  const name = data.name;
  const role = type === 'siswa' ? 'SISWA' : (data.position?.toUpperCase() || 'GURU / STAF');

  // Theme colors
  const primaryColor = type === 'siswa' ? '#1e293b' : '#1d4ed8';
  const gradientBg = type === 'siswa'
    ? 'linear-gradient(to bottom, #0f172a, #334155)' // Dark slate for students
    : 'linear-gradient(to bottom, #1d4ed8, #3b82f6)'; // Blue for teachers

  return (
    <div className="flex flex-row gap-4">
      {/* FRONT SIDE */}
      <div
        className="relative overflow-hidden shadow-sm"
        style={{ width: '54mm', height: '85.6mm', pageBreakInside: 'avoid', breakInside: 'avoid', backgroundColor: '#ffffff', borderColor: '#d1d5db', borderWidth: '1px', borderStyle: 'solid' }}
      >
        {/* Background Decor */}
        <div className="absolute top-0 left-0 right-0 h-24" style={{ background: gradientBg, borderBottomLeftRadius: '50% 20%', borderBottomRightRadius: '50% 20%' }} />

        {/* Header */}
        <div className="relative z-10 flex flex-col items-center pt-2">
          <div className="w-14 h-14 flex items-center justify-center">
            <img crossOrigin="anonymous" src="/images/smplibels.png" alt="Logo" className="w-14 h-14 object-contain" />
          </div>
          <div className="font-bold tracking-widest" style={{ fontSize: '10px', lineHeight: 1, margin: '2px 0 0 0', color: '#ffffff' }}>SMPN 15 BANDUNG</div>
          <div className="tracking-wider font-medium" style={{ fontSize: '8px', lineHeight: 1, margin: '2px 0 0 0', color: '#e2e8f0' }}>{role}</div>
        </div>

        {/* Photo Placeholder */}
        <div className="relative z-10 flex justify-center mt-4">
          {/* Changed avatar to a circle as requested */}
          <div className="shadow-sm overflow-hidden rounded-full flex items-center justify-center" style={{ width: '24mm', height: '24mm', backgroundColor: '#e5e7eb', borderColor: '#ffffff', borderWidth: '3px', borderStyle: 'solid' }}>
            {/* Use HTML text instead of external image to avoid CORS issues in html2canvas */}
            <div style={{ fontSize: '32px', color: '#9ca3af', fontWeight: 'bold' }}>
              {name ? name.charAt(0).toUpperCase() : 'S'}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="text-center mt-2 px-3">
          {/* Removed line-clamp-2 because html2canvas has bugs with -webkit-box which causes vertical text clipping */}
          <div className="font-bold leading-tight uppercase" style={{ fontSize: '12px', margin: 0, color: '#1f2937' }}>
            {name}
          </div>
          {type === 'siswa' && (
            <p className="font-semibold mt-0.5" style={{ fontSize: '9px', margin: 0, color: '#6b7280' }}>NIS: {data.nis || '-'} / NISN: {barcodeData}</p>
          )}
          {type === 'guru' && (
            <p className="font-semibold mt-0.5" style={{ fontSize: '9px', margin: 0, color: '#6b7280' }}>NIP/NIK: {barcodeData}</p>
          )}
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center mt-2 relative z-10">
          <div className="p-1 rounded-sm" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderWidth: '1px', borderStyle: 'solid' }}>
            <img 
              crossOrigin="anonymous"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${barcodeData}`} 
              alt="QR Code" 
              className="w-12 h-12"
            />
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ backgroundColor: primaryColor }} />
      </div>

      {/* BACK SIDE */}
      <div
        className="relative overflow-hidden shadow-sm p-3 flex flex-col"
        style={{ width: '54mm', height: '85.6mm', pageBreakInside: 'avoid', breakInside: 'avoid', backgroundColor: '#ffffff', borderColor: '#d1d5db', borderWidth: '1px', borderStyle: 'solid' }}
      >
        <div className="text-center mb-2">
          <div className="font-bold uppercase underline decoration-2 underline-offset-2" style={{ fontSize: '11px', margin: 0, color: primaryColor }}>VISI</div>
        </div>
        <div className="text-center font-semibold italic leading-tight mb-3" style={{ fontSize: '9px', color: '#1f2937' }}>
          "Terwujudnya Peserta didik berkarakter MAJU"<br />
          "Mandiri, Agamis, Jujur dan Unggul"
        </div>

        <div className="text-center mb-2">
          <div className="font-bold uppercase underline decoration-2 underline-offset-2" style={{ fontSize: '11px', margin: 0, color: primaryColor }}>MISI</div>
        </div>
        <ol className="font-medium pl-3 pr-1 list-decimal flex-1 overflow-hidden" style={{ fontSize: '8px', lineHeight: '1.2', margin: 0, paddingLeft: '12px', color: '#374151' }}>
          <li style={{ marginBottom: '2px' }}>Mewujudkan Tata Kelola Sekolah yang Efektif, Efisien dan Melayani.</li>
          <li style={{ marginBottom: '2px' }}>Melaksanakan Program Berbasis Kebutuhan.</li>
          <li style={{ marginBottom: '2px' }}>Menerapkan Nilai dan Aturan Secara Konsisten.</li>
          <li style={{ marginBottom: '2px' }}>Melaksanakan Pembinaan Imtaq, Sikap dan Karakter.</li>
          <li style={{ marginBottom: '2px' }}>Melaksanakan Pembinaan Akademik dan Non Akademik.</li>
          <li style={{ marginBottom: '2px' }}>Meningkatkan Pengetahuan dan Kemampuan Profesional Guru dan Tenaga Kependidikan Sesuai Perkembangan Dunia Pendidikan.</li>
        </ol>

        <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ backgroundColor: primaryColor }} />
      </div>
    </div>
  );
}
