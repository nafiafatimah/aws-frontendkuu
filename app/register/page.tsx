"use client";

import Link from "next/link"; // Import Link untuk pindah halaman tanpa reload

export default function RegisterPage() {
  
  // Fungsi yang dijalankan saat tombol "Daftar Sekarang" diklik
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah form reload halaman

    // --- DI SINI NANTI TEMPAT MENYIMPAN DATA KE API MODEL/DATABASE (XAMPP) ---
    // Sementara, kita buat registrasi sukses dan pindah ke halaman login
    alert("Pendaftaran Sukses! Silakan Login.");
    window.location.href = "/login"; // Cara alternatif pindah halaman tanpa router
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans p-6 dark:bg-zinc-950">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-zinc-200 dark:bg-black dark:border-zinc-800">
        
        {/* Header Halaman */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">Daftar Akun</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Lengkapi data diri Anda untuk menggunakan sistem.
          </p>
        </div>

        {/* Form Register */}
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5">
              Nama Lengkap
            </label>
            <input 
              type="text" 
              required 
              className="w-full p-3 border border-zinc-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900" 
              placeholder="Siti Nafiatul" 
            />
          </div>

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
              Password Baru
            </label>
            <input 
              type="password" 
              required 
              className="w-full p-3 border border-zinc-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900" 
              placeholder="••••••••" 
            />
          </div>

          {/* Tombol Register */}
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Daftar Sekarang
          </button>
        </form>
        
        {/* Navigasi kembali ke Halaman Login */}
        <div className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <p>Sudah punya akun?</p>
          <Link href="/login" className="font-semibold text-blue-600 hover:underline">
            Login di sini
          </Link>
        </div>
      </div>
    </div>
  );
}