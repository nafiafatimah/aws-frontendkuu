"use client";

import { UserCircle, Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-8 flex items-center justify-between sticky top-0 z-10">
      {/* Title Section */}
      <div>
        <h2 className="text-zinc-800 font-bold text-lg">
          Early Warning System - Ketepatan Waktu Studi
        </h2>
        <p className="text-zinc-400 text-xs font-medium">
          Politeknik Elektronika Negeri Surabaya
        </p>
      </div>

      {/* Profile & Action Section */}
      <div className="flex items-center gap-6">
        {/* Notifikasi (Opsional, buat pemanis saja) */}
        <button className="text-zinc-400 hover:text-blue-600 transition-colors">
          <Bell size={20} />
        </button>

        {/* User Profile Info */}
        <div className="flex items-center gap-3 pl-6 border-l border-zinc-200">
          <div className="text-right">
            <p className="text-sm font-bold text-zinc-800 leading-none">Admin Nafia</p>
            <p className="text-[11px] text-zinc-400 mt-1 uppercase font-semibold">Administrator</p>
          </div>
          <div className="bg-zinc-100 p-1 rounded-full border border-zinc-200">
            <UserCircle size={32} className="text-zinc-400" />
          </div>
        </div>
      </div>
    </header>
  );
}