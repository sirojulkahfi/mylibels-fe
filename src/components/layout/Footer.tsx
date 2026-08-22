"use client";

import React from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

export default function Footer() {
    return (
        <AntFooter
            className="batik-bg shadow-sm"
            style={{
                height: '35px',
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 0,
            }}
        >
            <div className="text-white text-[11px] font-small drop-shadow-sm flex flex-col items-center leading-tight justify-center">
                <span>Copyright © {new Date().getFullYear()} SMPN 15 Bandung</span>
                <span className="text-[10px] text-white/80">Sistem Informasi Management</span>
            </div>
        </AntFooter>
    );
}