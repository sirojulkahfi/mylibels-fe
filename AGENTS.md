<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 🤖 Panduan Ketat untuk AI Agent: Frontend (mylibels-fe)

Dokumen ini berisi aturan wajib yang **HARUS** ditaati oleh AI Agent saat menulis atau memodifikasi kode di aplikasi Frontend ini.

## 1. Arsitektur Next.js 16 (App Router)
- **Server vs Client Components (KRITIS)**: 
  - Secara default, semua komponen di App Router adalah **Server Components**.
  - Anda **TIDAK BOLEH** menggunakan hooks React (`useState`, `useEffect`, `useContext`) atau event listener DOM (`onClick`, `onChange`) di Server Components.
  - Tambahkan direktif `"use client"` di baris paling atas (baris 1) HANYA JIKA komponen tersebut membutuhkan interaktivitas atau hooks React/Zustand/React Query.
- **Struktur Folder**:
  - `src/app`: Hanya untuk file sistem routing (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).
  - `src/components`: Untuk komponen UI yang *reusable*.
  - `src/lib` / `src/utils`: Untuk fungsi utilitas murni, konfigurasi axios, dll.

## 2. Penggunaan Ant Design (antd) & Tailwind CSS
- **Hindari CSS Kustom/Global**: Gunakan utility classes dari **Tailwind CSS** untuk margin, padding, flexbox, grid, dan warna dasar.
- **Ant Design (antd)**: Gunakan komponen AntD (Tabel, Form, Modal, Input) untuk elemen UI kompleks.
- **Integrasi AntD di Next.js**: Komponen AntD yang interaktif (seperti Select, DatePicker, Modal) biasanya membutuhkan interaktivitas klien. Jika komponen yang Anda buat membungkus komponen AntD interaktif, pastikan komponen Anda menggunakan `"use client"`.

## 3. Data Fetching & State Management
- **React Query (`@tanstack/react-query`)**: INI ADALAH CARA UTAMA UNTUK FETCHING API. Gunakan custom hooks (seperti `useQuery`, `useMutation`) untuk mengambil data dari backend, caching, dan status loading/error. Jangan gunakan `useEffect` manual untuk fetching data jika bisa menggunakan React Query.
- **Zustand**: Gunakan HANYA untuk *Global Client State* yang tidak berhubungan dengan fetching database (contoh: state sidebar terbuka/tertutup, tema UI, multi-step form lokal). Jangan simpan data balasan API di Zustand jika sudah di-cache oleh React Query.
- **Axios**: Lakukan panggilan HTTP menggunakan Axios, biasanya lewat instance yang sudah dikonfigurasi dengan baseURL `NEXT_PUBLIC_API_URL` dan interceptors (untuk token).

## 4. TypeScript & Kualitas Kode
- **Tanpa `any`**: Definisikan tipe data dengan jelas menggunakan `interface` atau `type`. Jangan menggunakan `any` kecuali benar-benar terpaksa (dan jika terpaksa, beri komentar alasannya).
- Selalu periksa dan pastikan impor file dilakukan dari path yang benar (gunakan alias `@/` jika sudah dikonfigurasi).
- Hapus `console.log` yang tidak penting sebelum memberikan solusi final.
