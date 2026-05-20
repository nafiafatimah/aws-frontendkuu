"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

// Definisikan tipe data agar tidak pakai 'any'
interface FormDataMahasiswa {
  [key: string]: string | number;
  nrp: string;
  nama: string;
}

export default function EditMahasiswaPage() {
  const { nrp } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const target = searchParams.get("target") || "semester";
  
  const [formData, setFormData] = useState<FormDataMahasiswa | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOldData = useCallback(async () => {
    try {
      const endpoint = target === "semester" 
        ? `http://localhost:8000/mahasiswa/semester/${nrp}`
        : `http://localhost:8000/mahasiswa/kelulusan/${nrp}`;
      
      const res = await fetch(endpoint);
      const data = await res.json();
      setFormData(data);
    } catch (error) {
      console.error("Gagal load data", error);
    } finally {
      setLoading(false);
    }
  }, [nrp, target]);

  useEffect(() => {
    fetchOldData();
  }, [fetchOldData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) return;

    try {
      const endpoint = target === "semester" 
        ? `http://localhost:8000/mahasiswa/semester/${nrp}`
        : `http://localhost:8000/mahasiswa/kelulusan/${nrp}`;

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Data berhasil diupdate!");
        router.push("/");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Terjadi kesalahan saat update");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading data...</div>;
  if (!formData) return <div className="p-10 text-center">Data tidak ditemukan</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 mb-6 hover:text-black">
          <ArrowLeft size={18} /> Kembali ke Dashboard
        </Link>

        <div className="bg-white p-8 rounded-2xl shadow-sm border">
          <h1 className="text-2xl font-bold mb-6">Edit Data {target === "semester" ? "Semester" : "Alumni"}</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="nrp" className="block text-xs font-bold uppercase text-gray-400 mb-1">NRP (Read Only)</label>
                <input id="nrp" disabled value={formData.nrp} className="w-full p-3 bg-gray-100 rounded-xl border" />
              </div>
              <div>
                <label htmlFor="nama" className="block text-xs font-bold uppercase text-gray-400 mb-1">Nama Mahasiswa</label>
                <input 
                  id="nama"
                  value={formData.nama} 
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.keys(formData).map((key) => {
                if (["nrp", "nama", "created_at", "id"].includes(key)) return null;

                return (
                  <div key={key}>
                    <label htmlFor={key} className="block text-xs font-bold uppercase text-gray-400 mb-1">
                      {key.replaceAll('_', ' ')}
                    </label>
                    <input 
                      id={key}
                      type="number"
                      step="any"
                      value={formData[key]} 
                      onChange={(e) => setFormData({...formData, [key]: Number.parseFloat(e.target.value) || 0})}
                      className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                );
              })}
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all mt-6"
            >
              <Save size={20} /> Simpan Perubahan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}