"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  UserPlus, 
  BarChart3, 
  GraduationCap 
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Input Mahasiswa", href: "/input-mahasiswa", icon: UserPlus },
  { name: "Hasil Prediksi", href: "/hasil-prediksi", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col h-screen sticky top-0">
      {/* Logo & Brand */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <GraduationCap size={24} />
        </div>
        <div>
          <h1 className="text-blue-600 font-bold text-lg leading-tight">PENS</h1>
          <p className="text-zinc-500 text-[10px] font-semibold tracking-wider uppercase">GraduRisk</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Sidebar */}
      <div className="p-6 border-t border-zinc-100">
        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Versi Sistem</p>
          <p className="text-xs text-zinc-600 font-medium">v1.0.0 - PA 2026</p>
        </div>
      </div>
    </aside>
  );
}