"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-[#0f172a]">
        <Image
          src="/images/main-bg.jpg"
          alt="Background"
          fill
          className="w-full h-full"
          priority
        />
        {/* Dark overlay for better contrast without blur */}
        <div className="absolute inset-0 bg-black/10 z-10" />
      </div>

      {/* Main Content Container (2 Columns on Desktop) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-16 py-12">

        {/* Left Side: Branding */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left text-white">
          <div className="relative w-48 h-32 md:w-64 md:h-40 lg:w-80 lg:h-48 mb-6 transition-transform hover:scale-105 duration-300">
            <Image
              src="/images/logo.webp"
              alt="Logo SMPN 15 Bandung"
              fill
              sizes="(max-width: 768px) 192px, (max-width: 1024px) 256px, 320px"
              className="object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,1)]"
              priority
            />
            {/* Shine Animation Layer (Masked to logo) */}
            <div className="absolute inset-0 pointer-events-none shine-mask z-10">
              <div className="shine-sweep-element" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-6 drop-shadow-[0_8px_10px_rgba(0,0,0,1)]">
            Sistem Informasi Management<br />
            <span className="text-blue-400">SMPN 15 Bandung</span>
          </h1>
          <p className="text-gray-200 text-base md:text-lg lg:text-xl font-medium max-w-xl drop-shadow-[0_4px_6px_rgba(0,0,0,1)] leading-relaxed hidden sm:block">
            Platform terpadu untuk mengelola kegiatan akademik dan administratif sekolah.
          </p>
        </div>

        {/* Right Side: Login Form (Glassmorphism) */}
        <div className="w-full max-w-md shrink-0">
          <div className="p-8 md:p-10 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] text-white">

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Selamat Datang</h2>
              <p className="text-gray-200 text-sm">Masuk untuk mengakses layanan akademik</p>
            </div>

            {/* Error / Warning States */}
            {sessionExpired && (
              <div className="mb-6 p-3 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-100 text-sm backdrop-blur-sm flex items-center justify-between">
                <span>⚠️ Sesi berakhir. Silakan login kembali.</span>
                <button type="button" onClick={() => setSessionExpired(false)} className="ml-2 text-amber-200 hover:text-white transition-colors">✕</button>
              </div>
            )}
            {error && (
              <div className="mb-6 p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-100 text-sm text-center backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200 ml-1">Username / NIP / NISN</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/50 group-focus-within:text-white transition-colors">
                    <UserOutlined />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username"
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-white/40 focus:bg-white/10 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/50 group-focus-within:text-white transition-colors">
                    <LockOutlined />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl pl-11 pr-11 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-white/40 focus:bg-white/10 transition-all duration-300"
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white cursor-pointer transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <div className="w-5 h-5 rounded border border-white/30 bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <input type="checkbox" className="hidden peer" />
                    <div className="w-3 h-3 rounded-sm bg-blue-400 scale-0 peer-checked:scale-100 transition-transform duration-200" />
                  </div>
                  <span className="text-sm text-gray-200 group-hover:text-white transition-colors">Ingat saya</span>
                </label>
                <span className="text-xs text-gray-400 font-medium">
                  Lupa password? <br className="sm:hidden"/> Hubungi TU / Admin
                </span>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.5)] transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : 'Masuk Sekarang'}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center flex flex-col gap-1">
              <p className="text-xs text-gray-300 font-medium tracking-wide">
                &copy; {new Date().getFullYear()} SMPN 15 Bandung.<br className="md:hidden" /> All rights reserved.
              </p>
              <p className="text-[10px] text-gray-400">
                Versi 1.2.5
              </p>
              <p className="text-[10px] text-white italic">
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