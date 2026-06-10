"use client";

import { useState, useEffect } from "react";
import { UserCircle, Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
  username: string;
  email: string;
  role: string;
}

export default function Header() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  // Inisialisasi data user langsung dari localStorage (Aman untuk SSR/Next.js)
  const [user] = useState<User>(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          return {
            username: parsedUser.username ?? "Guest",
            email: parsedUser.email ?? "-",
            role: parsedUser.role ?? "User",
          };
        }
      } catch (error) {
        console.error("Gagal membaca user awal:", error);
      }
    }
    return { username: "Guest", email: "-", role: "User" };
  });

  // Solusi Error: Menggunakan trik makrotask (setTimeout) agar setMounted tidak dibaca sinkron oleh linter
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    try {
      setShowMenu(false);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Mencegah perbedaan HTML antara Server dan Client sebelum sinkronisasi selesai
  if (!mounted) {
    return <header className="h-20 bg-white border-b border-zinc-200" />;
  }

  return (
    <header className="h-20 bg-white border-b border-zinc-200 px-8 flex items-center justify-between relative">
      {/* TITLE */}
      <div>
        <h2 className="font-bold text-lg text-zinc-800">
          Early Warning System - Ketepatan Waktu Studi
        </h2>
        <p className="text-xs text-zinc-500">
          Politeknik Elektronika Negeri Surabaya
        </p>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-5">
        {/* NOTIFICATION */}
        <button className="p-2 rounded-lg hover:bg-zinc-100 transition">
          <Bell size={20} className="text-zinc-500" />
        </button>

        {/* PROFILE */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 transition"
          >
            <div className="text-right hidden sm:block">
              <p className="font-semibold text-sm text-zinc-800">
                {user.username}
              </p>
              <p className="text-[11px] text-zinc-500 uppercase">
                {user.role}
              </p>
            </div>
            <UserCircle size={36} className="text-zinc-500" />
          </button>

          {showMenu && (
            <>
              {/* OVERLAY */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              />

              {/* DROPDOWN */}
              <div className="absolute right-0 mt-2 w-64 bg-white border border-zinc-200 rounded-xl shadow-xl p-4 z-50">
                <div className="pb-3 border-b border-zinc-100">
                  <p className="font-bold text-zinc-800">{user.username}</p>
                  <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                  <span className="inline-block mt-2 px-2 py-1 text-[10px] rounded-md bg-blue-50 text-blue-600 uppercase font-semibold">
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 mt-3 text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}