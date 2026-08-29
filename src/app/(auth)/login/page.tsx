"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { getDashboardRoute } from "@/utils/dashboard-route";

function LoginContent() {
  const { login } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    sessionStorage.removeItem("processing401");
    if (searchParams.get("sessionExpired") === "true") {
      setTimeout(() => setSessionExpired(true), 0);
      window.history.replaceState({}, "", "/login");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    setError(null);
    try {
      const res = await authService.login({ username, password });
      login(res.accessToken, res.user);

      router.push(getDashboardRoute(res.user?.role?.name));
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan pada server. Pastikan username/password benar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center overflow-x-hidden p-4 sm:p-6 lg:p-12">
      {/* Background Image & Overlay */}
      <div className="fixed inset-0 z-0 bg-[#0f172a]">
        <Image
          src="/images/main-bg.jpg"
          alt="Background"
          fill
          className="w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-slate-950/60 md:bg-black/30 backdrop-blur-[2px] z-10" />
      </div>

      {/* Main Content Container (Responsive Grid / Flex) */}
      <div className="relative z-20 w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 md:gap-12 lg:gap-16 py-4 sm:py-8">

        {/* Desktop Branding (Hidden on Mobile) */}
        <div className="hidden md:flex flex-1 flex-col items-start text-left text-white">
          <div className="relative w-56 h-36 lg:w-72 lg:h-44 mb-6 transition-transform hover:scale-105 duration-300">
            <Image
              src="/images/logo.webp"
              alt="Logo SMPN 15 Bandung"
              fill
              sizes="(max-width: 1024px) 224px, 288px"
              className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
              priority
            />
            {/* Shine Animation Layer */}
            <div className="absolute inset-0 pointer-events-none shine-mask z-10">
              <div className="shine-sweep-element" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4 drop-shadow-[0_8px_10px_rgba(0,0,0,0.9)]">
            Sistem Informasi Manajemen<br />
            <span className="text-blue-400">SMPN 15 Bandung</span>
          </h1>
          <p className="text-gray-200 text-base lg:text-lg font-medium max-w-lg drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] leading-relaxed">
            Platform terpadu untuk mengelola kegiatan akademik, presensi, dan informasi sekolah.
          </p>
        </div>

        {/* Mobile Branding (Visible only on Mobile) */}
        <div className="flex md:hidden flex-col items-center text-center text-white mb-2">
          <div className="relative w-20 h-20 mb-2">
            <Image
              src="/images/logo.webp"
              alt="Logo SMPN 15 Bandung"
              fill
              sizes="80px"
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            MyLibels <span className="text-blue-400">Portal</span>
          </h1>
          <p className="text-xs text-gray-300">
            SMP Negeri 15 Bandung
          </p>
        </div>

        {/* Login Card Form */}
        <div className="w-full max-w-md shrink-0">
          <div className="p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-white/10 md:bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(15,23,42,0.6)] text-white">

            <div className="mb-6 text-center md:text-left">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">Selamat Datang</h2>
              <p className="text-gray-300 text-xs sm:text-sm">Silakan masuk dengan akun Anda</p>
            </div>

            {/* Error / Warning States */}
            {sessionExpired && (
              <div className="mb-5 p-3 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-100 text-xs sm:text-sm backdrop-blur-sm flex items-center justify-between">
                <span>⚠️ Sesi berakhir. Silakan login kembali.</span>
                <button type="button" onClick={() => setSessionExpired(false)} className="ml-2 text-amber-200 hover:text-white transition-colors">✕</button>
              </div>
            )}
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-100 text-xs sm:text-sm text-center backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-gray-200 ml-1">Username / NIP / NISN</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none text-white/60 group-focus-within:text-blue-400 transition-colors">
                    <UserOutlined />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username/NISN"
                    autoComplete="username"
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-white/40 focus:bg-white/10 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-gray-200 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none text-white/60 group-focus-within:text-blue-400 transition-colors">
                    <LockOutlined />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl pl-10 sm:pl-11 pr-10 sm:pr-11 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-white/40 focus:bg-white/10 transition-all duration-200"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3.5 sm:pr-4 flex items-center text-white/60 hover:text-white cursor-pointer transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer group select-none">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded border border-white/30 bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <input type="checkbox" className="hidden peer" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-blue-400 scale-0 peer-checked:scale-100 transition-transform duration-200" />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-200 group-hover:text-white transition-colors">Ingat saya</span>
                </label>
                <span className="text-[11px] sm:text-xs text-gray-300 text-right">
                  Lupa password? <span className="text-blue-300">Hubungi Admin</span>
                </span>
              </div>

              <div className="pt-2 sm:pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-[0.98] text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl shadow-[0_4px_20px_rgba(59,130,246,0.4)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center text-sm sm:text-base cursor-pointer"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : "Masuk Sekarang"}
                </button>
              </div>
            </form>

            <div className="mt-6 sm:mt-8 text-center flex flex-col gap-1 border-t border-white/10 pt-4">
              <p className="text-[11px] sm:text-xs text-gray-300 font-medium tracking-wide">
                &copy; {new Date().getFullYear()} SMPN 15 Bandung. All rights reserved.
              </p>
              <p className="text-[10px] text-gray-400">
                Versi 1.2.5
              </p>
              <p className="text-[10px] text-gray-300/80 italic">
                Aplikasi ini dikembangkan oleh Sirojul Kahpi (RJL DevOps)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Loading...</div>}>
      <LoginContent />
    </React.Suspense>
  );
}
