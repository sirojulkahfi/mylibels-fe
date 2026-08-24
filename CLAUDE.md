# Frontend Assistant Guide (mylibels-fe)

Proyek ini adalah aplikasi frontend berbasis Next.js 16 (App Router) dan React 19.

## 🛠 Commands
- **Dev**: `npm run dev` (Port 8000)
- **Build**: `npm run build`
- **Lint**: `npm run lint`

## ⚙️ Tech Stack & Konvensi
- **UI & Styling**: Tailwind CSS dan Ant Design (`antd`). Jangan sembarangan menambahkan CSS global jika bisa diatasi dengan utility class Tailwind.
- **Data Fetching**: `@tanstack/react-query` dipadukan dengan `axios`.
- **State Management**: `zustand` untuk state lokal/klien yang kompleks.

## Aturan AI / Agen
Lihat `AGENTS.md` di folder ini untuk pedoman agen yang lebih rinci termasuk limitasi dan peringatan dari Next.js versi terbaru.
