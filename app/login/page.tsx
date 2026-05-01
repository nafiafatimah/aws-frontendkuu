"use client";

import { useRouter } from "next/navigation"; // Import router untuk navigasi
import Link from "next/link"; // Import Link untuk pindah halaman tanpa reload

export default function LoginPage() {
  const router = useRouter(); // Inisialisasi router

  // Fungsi yang dijalankan saat tombol "Login" diklik
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah form reload halaman

    // --- DI SINI NANTI TEMPAT VALIDASI KE API MODEL/DATABASE (XAMPP) ---
    // Sementara, kita buat login sukses dan langsung pindah ke dashboard
    alert("Login Berhasil! Mengalihkan ke Dashboard...");
    router.push("/"); // Pindah ke halaman utama (Dashboard)
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans p-6 dark:bg-zinc-950">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-zinc-200 dark:bg-black dark:border-zinc-800">
        
        {/* Header Halaman */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">Login Sistem</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Prediksi Kelulusan Mahasiswa <span className="font-semibold text-zinc-800 dark:text-white">PENS</span>
          </p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5">
              Email Institusi
            </label>
            <input 
              type="email" 
              required 
              className="w-full p-3 border border-zinc-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900" 
              placeholder="nama@student.pens.ac.id" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5">
              Password
            </label>
            <input 
              type="password" 
              required 
              className="w-full p-3 border border-zinc-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900" 
              placeholder="••••••••" 
            />
          </div>

          {/* Tombol Login */}
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Masuk Sekarang
          </button>
        </form>
        
        {/* Navigasi ke Halaman Register */}
        <div className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <p>Belum punya akun?</p>
          <Link href="/register" className="font-semibold text-blue-600 hover:underline">
            Daftar Akun Baru
          </Link>
        </div>
      </div>
    </div>
  );
}