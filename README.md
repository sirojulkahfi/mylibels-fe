# MyLibels Frontend (mylibels-fe)

Aplikasi frontend ini dibangun dengan [Next.js](https://nextjs.org/) (App Router), React, dan Tailwind CSS. Aplikasi ini dirancang untuk berjalan pada port `8000`.

## 🚀 Cara Menjalankan (Development)

1. Pastikan Anda berada di direktori `mylibels-fe`:
   ```bash
   cd mylibels-fe
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Konfigurasi *Environment Variable*:
   Buat file `.env` (atau `.env.local`) jika dibutuhkan untuk menampung konfigurasi API (misalnya `NEXT_PUBLIC_API_URL`).
4. Jalankan development server:
   ```bash
   npm run dev
   ```
5. Buka [http://localhost:8000](http://localhost:8000) di browser Anda.

## 📦 Build untuk Produksi

Untuk melakukan build aplikasi ke mode produksi:

```bash
npm run build
npm run start
```
*(Script `npm run start` juga sudah dikonfigurasi untuk berjalan di port 8000).*

## 🛠 Teknologi Utama

- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS & Ant Design (`antd`)
- **State Management**: Zustand & React Query (`@tanstack/react-query`)
- **HTTP Client**: Axios
- **Fitur Tambahan**: Excel export (`exceljs`), QR Code scanner (`html5-qrcode`), Cookie handling (`js-cookie`).
