"use client";

import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import {
    DashboardOutlined,
    DatabaseOutlined,
    AppstoreOutlined,
    SwapOutlined,
    SettingOutlined,
    ImportOutlined,
    CheckSquareOutlined,
    NotificationOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
    return { key, icon, children, label } as MenuItem;
}

interface SidebarProps {
    collapsed: boolean;
    onCollapse: (value: boolean) => void;
}

export default function Sidebar({ collapsed, onCollapse }: SidebarProps) {
    const pathname = usePathname();
    const { user } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => setMounted(true), 0);
    }, []);

    const roleName = user?.role?.name || '';

    // RBAC logic helper: Dynamic Permission based
    const hasPermission = (requiredPermission: string) => {
        if (!user) return false;
        // Superadmin bypasses all permission checks
        const normalizedRole = roleName.trim().toUpperCase().replace(/[- ]/g, '_');
        if (normalizedRole === 'SUPER_ADMIN' || normalizedRole === 'ADMIN') return true;

        // Check if role has the specific permission in its array
        if (user?.role?.permissions?.includes(requiredPermission)) return true;

        const rolePermissions: Record<string, string[]> = {
            KEPALA_SEKOLAH: ['VIEW_AKADEMIK', 'VIEW_PRESENSI', 'VIEW_PENILAIAN', 'VIEW_BK', 'VIEW_RAPOR', 'VIEW_LAPORAN'],
            GURU: ['VIEW_AKADEMIK', 'VIEW_PRESENSI', 'VIEW_PENILAIAN', 'VIEW_BK', 'VIEW_RAPOR'],
            WALI_KELAS: ['VIEW_AKADEMIK', 'VIEW_PRESENSI', 'VIEW_PENILAIAN', 'VIEW_BK', 'VIEW_RAPOR', 'VIEW_LAPORAN'],
            SISWA: ['VIEW_PRESENSI', 'VIEW_PENILAIAN', 'VIEW_RAPOR', 'VIEW_BK'],
        };
        return rolePermissions[normalizedRole]?.includes(requiredPermission) || false;
    };

    const getOpenKeys = () => {
        const keys = [];
        if (pathname.includes('/data-induk')) keys.push('data-induk');
        if (pathname.includes('/akademik')) keys.push('akademik');
        if (pathname.includes('/akademik/jadwal-pelajaran')) keys.push('jadwal-pelajaran');
        if (pathname.includes('/penilaian')) keys.push('penilaian');
        if (pathname.includes('/presensi')) keys.push('presensi');
        if (pathname.includes('/bimbingan-konseling')) keys.push('bimbingan-konseling');
        if (pathname.includes('/rapor')) keys.push('rapor');
        if (pathname.includes('/laporan')) keys.push('laporan');
        if (pathname.includes('/pengaturan')) keys.push('pengaturan');
        return keys;
    };

    const getDynamicItems = (): MenuItem[] => {
        const items: MenuItem[] = [];

        // 1. Dashboard
        items.push(getItem(<Link href="/dashboard">Dashboard</Link>, '/dashboard', <DashboardOutlined />));

        // 1.5 Pengumuman
        if (hasPermission('VIEW_DATA_INDUK') || user?.role?.name === 'ADMIN') {
            items.push(getItem(<Link href="/pengumuman">Pengumuman</Link>, '/pengumuman', <NotificationOutlined />));
        }

        // 2. Data Induk
        if (hasPermission('VIEW_DATA_INDUK') || user?.role?.name === 'ADMIN') {
            const dataIndukChildren: MenuItem[] = [];
            dataIndukChildren.push(getItem(<Link href="/data-induk/siswa">Data Siswa</Link>, '/data-induk/siswa'));
            dataIndukChildren.push(getItem(<Link href="/data-induk/guru-staf">Data Guru & Staf</Link>, '/data-induk/guru-staf'));
            dataIndukChildren.push(getItem(<Link href="/data-induk/kelas">Data Kelas</Link>, '/data-induk/kelas'));
            dataIndukChildren.push(getItem(<Link href="/data-induk/shift">Data Shift</Link>, '/data-induk/shift'));
            dataIndukChildren.push(getItem(<Link href="/data-induk/mata-pelajaran">Mata Pelajaran</Link>, '/data-induk/mata-pelajaran'));
            dataIndukChildren.push(getItem(<Link href="/data-induk/wali-kelas">Wali Kelas</Link>, '/data-induk/wali-kelas'));
            dataIndukChildren.push(getItem(<Link href="/data-induk/ruangan">Ruangan</Link>, '/data-induk/ruangan'));
            dataIndukChildren.push(getItem(<Link href="/data-induk/ekstrakurikuler">Ekstrakurikuler</Link>, '/data-induk/ekstrakurikuler'));
            dataIndukChildren.push(getItem(<Link href="/data-induk/alumni">Alumni</Link>, '/data-induk/alumni'));
            dataIndukChildren.push(getItem(<Link href="/data-induk/cetak-kartu">Cetak Kartu ID</Link>, '/data-induk/cetak-kartu'));

            items.push(getItem('Data Induk', 'data-induk', <DatabaseOutlined />, dataIndukChildren));
        }

        // 3. Akademik
        if (hasPermission('VIEW_AKADEMIK') || user?.role?.name === 'ADMIN') {
            items.push(getItem('Akademik', 'akademik', <DatabaseOutlined />, [
                getItem('Jadwal Pelajaran', 'jadwal-pelajaran', null, [
                    getItem(<Link href="/akademik/jadwal-pelajaran/rombel">Jadwal RomBel</Link>, '/akademik/jadwal-pelajaran/rombel'),
                    getItem(<Link href="/akademik/jadwal-pelajaran/guru">Jadwal Mengajar Guru</Link>, '/akademik/jadwal-pelajaran/guru')
                ]),
                getItem(<Link href="/akademik/capaian-pembelajaran">Capaian Pembelajaran</Link>, '/akademik/capaian-pembelajaran'),
                getItem(<Link href="/akademik/pembagian-tugas">Pembagian Tugas</Link>, '/akademik/pembagian-tugas')
            ]));
        }

        // 3. Penilaian
        if (hasPermission('VIEW_PENILAIAN') || user?.role?.name === 'ADMIN') {
            items.push(getItem('Penilaian', 'penilaian', <CheckSquareOutlined />, [
                getItem(<Link href="/penilaian/formatif">Formatif</Link>, '/penilaian/formatif'),
                getItem(<Link href="/penilaian/sumatif">Sumatif</Link>, '/penilaian/sumatif'),
                getItem(<Link href="/penilaian/ekstrakurikuler">Ekstrakurikuler</Link>, '/penilaian/ekstrakurikuler'),
                getItem(<Link href="/penilaian/portofolio-proyek">Portofolio & Proyek</Link>, '/penilaian/portofolio-proyek'),
                getItem(<Link href="/penilaian/catatan-wali-kelas">Catatan Wali Kelas</Link>, '/penilaian/catatan-wali-kelas')
            ]));
        }

        // 4. Presensi
        if (hasPermission('VIEW_PRESENSI') || user?.role?.name === 'ADMIN') {
            items.push(getItem('Presensi', 'presensi', <CheckSquareOutlined />, [
                getItem(<Link href="/presensi/harian-siswa">Harian Siswa</Link>, '/presensi/harian-siswa'),
                getItem(<Link href="/presensi/mapel-siswa">Mapel Siswa</Link>, '/presensi/mapel-siswa'),
                getItem(<Link href="/presensi/presensi-guru">Kehadiran Guru</Link>, '/presensi/presensi-guru'),
                getItem(<Link href="/presensi/perizinan">Perizinan</Link>, '/presensi/perizinan'),
                getItem(<Link href="/kiosk" target="_blank">Scan Barcode/RFID</Link>, '/kiosk')
            ]));
        }

        // 5. Bimbingan Konseling
        if (hasPermission('VIEW_BK') || user?.role?.name === 'ADMIN') {
            items.push(getItem('Bimbingan Konseling', 'bimbingan-konseling', <ImportOutlined />, [
                getItem(<Link href="/bimbingan-konseling/poin-pelanggaran">Poin Pelanggaran</Link>, '/bimbingan-konseling/poin-pelanggaran'),
                getItem(<Link href="/bimbingan-konseling/prestasi">Prestasi</Link>, '/bimbingan-konseling/prestasi')
            ]));
        }

        // 6. Rapor
        if (hasPermission('VIEW_RAPOR') || user?.role?.name === 'ADMIN') {
            items.push(getItem('Rapor', 'rapor', <DatabaseOutlined />, [
                getItem(<Link href="/rapor/cetak/kelengkapan">Cetak Rapor</Link>, '/rapor/cetak/kelengkapan'),
                getItem(<Link href="/rapor/catatan-kenaikan/vii-a">Catatan Kenaikan</Link>, '/rapor/catatan-kenaikan/vii-a'),
                getItem(<Link href="/rapor/validasi-kunci/vii-a">Validasi & Kunci</Link>, '/rapor/validasi-kunci/vii-a')
            ]));
        }

        // 7. Laporan
        if (hasPermission('VIEW_LAPORAN') || user?.role?.name === 'ADMIN') {
            items.push(getItem('Laporan', 'laporan', <DatabaseOutlined />, [
                getItem(<Link href="/laporan/absensi">Laporan Absensi</Link>, '/laporan/absensi'),
                getItem(<Link href="/laporan/nilai-siswa">Laporan Nilai Siswa</Link>, '/laporan/nilai-siswa'),
                getItem(<Link href="/laporan/kesiswaan/rekap-poin">Rekap Poin BK</Link>, '/laporan/kesiswaan/rekap-poin'),
                getItem(<Link href="/laporan/rapor/arsip">Arsip Rapor</Link>, '/laporan/rapor/arsip')
            ]));
        }

        // 8. Pengaturan
        if (hasPermission('VIEW_PENGATURAN') || user?.role?.name === 'ADMIN') {
            const pengaturanChildren: MenuItem[] = [];

            pengaturanChildren.push(getItem(<Link href="/pengaturan/identitas-sekolah">Identitas Sekolah</Link>, '/pengaturan/identitas-sekolah'));
            pengaturanChildren.push(getItem(<Link href="/pengaturan/tahun-ajaran">Tahun Ajaran</Link>, '/pengaturan/tahun-ajaran'));
            pengaturanChildren.push(getItem(<Link href="/pengaturan/users">Users</Link>, '/pengaturan/users'));
            pengaturanChildren.push(getItem(<Link href="/pengaturan/permission">Permission</Link>, '/pengaturan/permission'));
            pengaturanChildren.push(getItem(<Link href="/pengaturan/audit-log">Audit Log</Link>, '/pengaturan/audit-log'));
            pengaturanChildren.push(getItem(<Link href="/pengaturan/settings">Settings</Link>, '/pengaturan/settings'));
            pengaturanChildren.push(getItem(<Link href="/pengaturan/presensi">Jam Presensi</Link>, '/pengaturan/presensi'));

            if (pengaturanChildren.length > 0) {
                items.push(getItem('Pengaturan', 'pengaturan', <SettingOutlined />, pengaturanChildren));
            }
        }

        return items;
    };

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
            width={210}
            collapsedWidth={80}
            theme="dark"
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 1001,
                background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)',
            }}
        >
            <div className="flex justify-center items-center h-20 border-b border-white/10 transition-all duration-300 p-2">
                <div className="w-full flex justify-center items-center">
                    <Image
                        src="/images/logo.webp"
                        alt="Logo"
                        width={220}
                        height={80}
                        unoptimized
                        className={`${collapsed ? 'w-full scale-110' : 'w-10/12 scale-110'} h-auto object-contain transition-all duration-300`}
                        priority
                    />
                </div>
            </div>

            {mounted && (
                <Menu
                    theme="dark"
                    selectedKeys={[pathname]}
                    defaultOpenKeys={getOpenKeys()}
                    mode="inline"
                    items={getDynamicItems()}
                    style={{ borderRight: 0, background: 'transparent' }}
                />
            )}
        </Sider>
    );
}