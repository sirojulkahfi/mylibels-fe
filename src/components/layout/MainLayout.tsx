"use client";

import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { DesktopOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from 'antd';

const { Content } = Layout;

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const logout = useAuthStore((state) => state.logout);

    return (
        <>
            {/* Mobile Blocker */}
            <div className="md:hidden fixed inset-0 z-[9999] bg-slate-900 flex flex-col items-center justify-center p-8 text-center">
                <DesktopOutlined className="text-7xl text-blue-400 mb-6 drop-shadow-lg" />
                <h1 className="text-2xl font-bold text-white mb-3">Mode Layar Tidak Didukung</h1>
                <p className="text-slate-300 text-sm mb-6 max-w-sm leading-relaxed">
                    Portal Manajemen (Guru & Staf) dirancang khusus untuk layar yang lebih besar demi kenyamanan pengelolaan data. Mohon gunakan perangkat <b>Desktop</b> atau <b>Tablet</b>.
                </p>
                <div className="w-16 h-1 bg-blue-500 rounded-full opacity-80 mb-8"></div>
                <Button 
                    type="primary" 
                    danger 
                    icon={<LogoutOutlined />} 
                    onClick={() => {
                        logout();
                        window.location.href = '/login';
                    }}
                    size="large"
                    className="shadow-lg"
                >
                    Keluar (Logout)
                </Button>
            </div>

            {/* Main Content - Hidden on mobile */}
            <div className="hidden md:block h-full">
                <Layout style={{ height: '100vh', overflow: 'hidden' }} hasSider>
                    <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
            
            <Layout style={{ 
                marginLeft: collapsed ? 80 : 210, 
                transition: 'margin-left 0.2s ease',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Header collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
                
                {/* Margin disesuaikan: atas 24px, kiri-kanan 24px, bawah 24px */}
                <Content style={{ 
                    flex: 1,
                    minHeight: 0,
                    margin: '16px 24px', 
                    display: 'flex', 
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1, 
                            minHeight: 0,
                            padding: '0', /* Remove padding so sticky works flush to edges, move padding inside pages if needed or rely on gap */
                            background: '#ffffff',
                            borderRadius: 12,
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                            overflow: 'hidden' /* Change from auto to hidden so Table scroll handles the scrolling */
                        }}
                    >
                        {children}
                    </div>
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
            </div>
        </>
    );
}