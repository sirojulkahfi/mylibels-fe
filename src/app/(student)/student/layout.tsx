"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  HomeOutlined, 
  CalendarOutlined, 
  CheckSquareOutlined, 
  ReadOutlined, 
  SafetyCertificateOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined,
  UserOutlined,
  DownOutlined
} from '@ant-design/icons';
import { Dropdown, Button } from 'antd';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/student/dashboard', icon: <HomeOutlined /> },
    { name: 'Jadwal', path: '/student/jadwal', icon: <CalendarOutlined /> },
    { name: 'Presensi', path: '/student/presensi', icon: <CheckSquareOutlined /> },
    { name: 'Rapor & Nilai', path: '/student/nilai', icon: <ReadOutlined /> },
    { name: 'Kedisiplinan', path: '/student/bk', icon: <SafetyCertificateOutlined /> },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const userMenu = {
    items: [
      { type: 'divider' as const },
      {
        key: 'logout',
        danger: true,
        onClick: handleLogout,
        label: (
          <div className="flex items-center gap-2 px-2 py-1 font-semibold">
            <LogoutOutlined />
            <span>Keluar Sistem</span>
          </div>
        ),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center">
                <Image 
                  src="/images/logo.webp" 
                  alt="Logo" 
                  width={110} 
                  height={35} 
                  className="object-contain" 
                  style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.6)) drop-shadow(0px 0px 2px rgba(0,0,0,0.8))' }}
                  unoptimized 
                />
              </div>
              <div className="hidden sm:block border-l-2 border-slate-300 pl-3">
                <p className="text-[13px] text-slate-800 font-extrabold tracking-wide m-0">SMPN 15 BANDUNG</p>
                <p className="text-[10px] text-slate-500 font-bold tracking-widest m-0 uppercase">Student Portal</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1 sm:space-x-4">
              {menuItems.map((item) => {
                const isActive = pathname.startsWith(item.path);
                return (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Profile and Mobile Menu Button */}
            <div className="flex items-center gap-2">
              <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}>
                <div className="hidden md:flex items-center gap-3 cursor-pointer hover:bg-slate-50 py-1 px-2 rounded-lg transition-colors">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                    {user?.name?.charAt(0) || 'S'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 leading-tight">{user?.name || 'Siswa'}</span>
                    <span className="text-[10px] text-slate-500 font-medium">Siswa Aktif</span>
                  </div>
                  <DownOutlined className="text-slate-400 text-xs ml-1" />
                </div>
              </Dropdown>
              
              {/* Hamburger Button for Mobile */}
              <Button 
                type="text" 
                icon={mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />} 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex items-center justify-center text-slate-600 hover:bg-slate-100 text-lg w-10 h-10"
              />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
              {menuItems.map((item) => {
                const isActive = pathname.startsWith(item.path);
                return (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                );
              })}
              <div className="border-t border-slate-100 mt-4 pt-4 pb-1">
                <div className="flex items-center gap-3 px-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                    {user?.name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <div className="text-base font-semibold text-slate-800">{user?.name || 'Siswa'}</div>
                    <div className="text-sm text-slate-500">Siswa Aktif</div>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogoutOutlined />
                  Keluar dari Sistem
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <p className="text-sm font-medium text-slate-600">
              &copy; {new Date().getFullYear()} SMPN 15 Bandung. All rights reserved.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Sistem Informasi Management Sekolah - Student Portal
            </p>
          </div>
          <div className="flex gap-4">
            <span className="text-xs text-slate-400">Versi 1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
