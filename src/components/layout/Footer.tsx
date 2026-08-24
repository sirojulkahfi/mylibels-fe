"use client";

import React from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

export default function Footer() {
    return (
        <AntFooter
            className="batik-bg shadow-sm"
            style={{
                height: 'auto',
                minHeight: '45px',
                padding: '8px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 0,
            }}
        >
            <div className="text-white text-[11px] font-small drop-shadow-sm flex flex-col items-center leading-none justify-center py-1.5 gap-0.5">
                <span>Copyright © {new Date().getFullYear()} SMPN 15 Bandung</span>
                <span className="text-[10px] text-white/80">Sistem Informasi Management</span>
                <span className="text-[9px] text-white italic">Aplikasi ini dikembangkan oleh Sirojul Kahpi (RJL DevOps)</span>
            </div>
        </AntFooter>
    );
}