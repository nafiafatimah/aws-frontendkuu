"use client";

import React, { use } from "react"; // Langsung import 'use'
import { 
  User, 
  BrainCircuit, 
  AlertCircle, 
  CheckCircle, 
  TrendingDown, 
  TrendingUp,
  ChevronLeft
} from "lucide-react";
import { useRouter } from "next/navigation";

// Kita buat interface supaya TypeScript gak bingung
interface PageProps {
  params: Promise<{ nrp: string }>;
}

export default function DetailPrediksi({ params }: PageProps) {
  const router = useRouter();
  
  // Mengambil nrp dari Promise params
  const { nrp } = use(params);

  // Data Manual (Sesuaikan NRP mana yang dianggap Aman untuk demo)
  const isAman = nrp === "3123500012" || nrp === "3123500067"; 

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      {/* Tombol Kembali */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-zinc-500 hover:text-blue-600 transition-colors text-sm font-bold"
      >
        <ChevronLeft size={18} /> Kembali ke Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* KOLOM KIRI (Data & Faktor) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                <User className="text-zinc-400" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-zinc-800">Data Mahasiswa</h3>
                <p className="text-[11px] text-zinc-400">Informasi Input</p>
              </div>
            </div>
            
            <div className="bg-zinc-50/50 p-6 rounded-2xl border border-dashed border-zinc-200">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">NRP</p>
              {/* Pakai variabel nrp yang sudah di-unwrap */}
              <p className="text-2xl font-bold text-zinc-700 tracking-tight">{nrp}</p>
            </div>
          </div>

          {/* Bagian Faktor Pendorong (Sama seperti sebelumnya) */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
             <div className="flex items-center gap-4 mb-6">
                <div className="bg-red-50 p-3 rounded-xl">
                  <BrainCircuit className="text-red-500" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-800">Faktor Pendorong Utama</h3>
                  <p className="text-[11px] text-zinc-400">Top Features (XAI)</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-red-50 bg-red-50/10">
                  <div className="flex items-center gap-2 text-red-600 mb-2">
                    <TrendingDown size={16} />
                    <p className="text-xs font-bold">Mata Kuliah Mengulang</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-red-600 text-[9px] font-black text-white rounded uppercase">Kontribusi tinggi</span>
                    <div className="flex-1 h-2 bg-red-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 w-[80%]" />
                    </div>
                  </div>
                </div>
                {/* ... tambahkan faktor lain sesuai desainmu ... */}
              </div>
          </div>
        </div>

        {/* KOLOM KANAN (Hasil Prediksi) */}
        <div className="lg:col-span-5">
          <div className={`p-8 rounded-[2rem] text-white shadow-2xl sticky top-24 min-h-[450px] flex flex-col justify-between ${isAman ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-red-500 to-orange-600'}`}>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl font-bold italic text-xl">!</div>
              <div>
                <p className="text-[10px] font-bold uppercase opacity-70 tracking-widest mb-1">Status Prediksi</p>
                <p className="text-xl font-black uppercase">{isAman ? 'AMAN' : 'RISIKO TINGGI'}</p>
              </div>
            </div>

            <div className="text-center py-10">
              <h4 className="text-[100px] font-black leading-none tracking-tighter mb-2">
                {isAman ? '87%' : '32%'}
              </h4>
              <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Probabilitas Lulus Tepat Waktu</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest opacity-80">
                <span>Tingkat Risiko</span>
                <span>{isAman ? 'Rendah' : 'Tinggi'}</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden border border-white/10">
                <div className={`h-full bg-white transition-all duration-1000 ${isAman ? 'w-[87%]' : 'w-[32%]'}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}