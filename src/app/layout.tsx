import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import "./batik.css";
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'myLIBELS | SMPN 15 BANDUNG',
  description: 'Sistem Informasi Management SMPN 15 Bandung',
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