import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import "./batik.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'myLIBELS | SMPN 15 BANDUNG',
  description: 'Sistem Informasi Management SMPN 15 Bandung',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MyLibels',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Providers>
          <AntdRegistry>
            {children}
          </AntdRegistry>
        </Providers>
      </body>
    </html>
  );
}
