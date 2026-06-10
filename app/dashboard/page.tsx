"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  GraduationCap,
  CalendarDays,
  Plus,
  Filter,
} from "lucide-react";

import {
  getResultsKelulusan,
  getResultsSemester,
  ResultItem,
} from "@/lib/api";

export default function DashboardPage() {
  const [targetModel, setTargetModel] = useState<"alumni" | "semester">("semester");
  const [data, setData] = useState<ResultItem[]>([]);
  // State untuk menyimpan angkatan yang dipilih (misal: "22", "23")
  const [selectedAngkatan, setSelectedAngkatan] = useState<string>("");

  const isSemester = targetModel === "semester";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = isSemester
          ? await getResultsSemester()
          : await getResultsKelulusan();

        // 🔥 FIX: filter nrp undefined
        const clean = result.filter((d) => d.nrp);

        setData(clean);
        // Reset filter angkatan setiap kali ganti jenis model
        setSelectedAngkatan("");
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [targetModel]);

  // 1. Ambil daftar angkatan unik secara dinamis dari digit ke-3 & ke-4 NRP
  const daftarAngkatan = useMemo(() => {
    const setAngkatan = new Set<string>();
    data.forEach((item) => {
      if (item.nrp) {
        const nrpStr = item.nrp.toString();
        if (nrpStr.length >= 4) {
          // Mengambil digit ke-3 dan ke-4 (indeks 2 sampai 4) -> "22", "23", dst.
          const tahun = nrpStr.substring(2, 4); 
          setAngkatan.add(tahun);
        }
      }
    });
    return Array.from(setAngkatan).sort();
  }, [data]);

  // 2. Filter data berdasarkan angkatan yang dipilih
  const filteredData = useMemo(() => {
    if (!selectedAngkatan) return data;
    return data.filter((item) => {
      const nrpStr = item.nrp.toString();
      // Cek apakah digit ke-3 & ke-4 sesuai dengan angkatan yang dipilih
      return nrpStr.substring(2, 4) === selectedAngkatan;
    });
  }, [data, selectedAngkatan]);

  // 3. Hitung metrik ringkasan dari data yang sudah terfilter
  const total = filteredData.length;
  const risiko = filteredData.filter((d) => d.probabilitas * 100 < 50).length;
  const aman = filteredData.filter((d) => d.probabilitas * 100 >= 50).length;

  return (
    <div className={`min-h-screen p-6 ${isSemester ? "bg-blue-50" : "bg-gray-50"}`}>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Dashboard Admin</h1>
            <p className="text-sm text-gray-500">
              Monitoring Risiko Mahasiswa
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* DROPDOWN FILTER ANGKATAN */}
            <div className="flex items-center gap-2 bg-white border rounded-2xl px-3 py-1.5 shadow-sm">
              <Filter size={16} className="text-gray-400" />
              <select
                value={selectedAngkatan}
                onChange={(e) => setSelectedAngkatan(e.target.value)}
                className="text-sm bg-transparent outline-none border-none text-gray-700 cursor-pointer pr-2"
              >
                <option value="">Semua Angkatan</option>
                {daftarAngkatan.map((thn) => (
                  <option key={thn} value={thn}>
                    Angkatan 20{thn}
                  </option>
                ))}
              </select>
            </div>

            {/* SWITCH */}
            <div className="flex bg-white border rounded-2xl p-1 shadow-sm">
              <button
                onClick={() => setTargetModel("alumni")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm ${
                  !isSemester ? "bg-black text-white" : "text-gray-500"
                }`}
              >
                <GraduationCap size={16} />
                Alumni
              </button>

              <button
                onClick={() => setTargetModel("semester")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm ${
                  isSemester ? "bg-blue-600 text-white" : "text-gray-500"
                }`}
              >
                <CalendarDays size={16} />
                Semester
              </button>
            </div>

            {/* BUTTON */}
            <Link
              href="/input-mahasiswa"
              className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex gap-2 items-center"
            >
              <Plus size={16} />
              Input
            </Link>
          </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-800 text-white p-4 rounded-xl">
            <p>Total</p>
            <h2 className="text-2xl font-bold">{total}</h2>
          </div>

          <div className="bg-red-500 text-white p-4 rounded-xl">
            <p>Risiko</p>
            <h2 className="text-2xl font-bold">{risiko}</h2>
          </div>

          <div className="bg-green-500 text-white p-4 rounded-xl">
            <p>Aman</p>
            <h2 className="text-2xl font-bold">{aman}</h2>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-400">
              <tr>
                <th className="p-3 text-left">NRP</th>
                <th className="text-left">Nama</th>
                <th className="text-left">Status</th>
                <th className="text-left">Probabilitas</th>
                <th className="text-left">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    Tidak ada data mahasiswa untuk angkatan ini.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => {
                  const prob = Math.round(item.probabilitas * 100);
                  const isRisk = prob < 50;

                  return (
                    <tr key={item.nrp} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="p-3 text-blue-600 font-semibold">
                        {item.nrp}
                      </td>

                      <td>{item.nama}</td>

                      <td>
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            isRisk
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {isRisk ? "RISIKO" : "AMAN"}
                        </span>
                      </td>

                      <td>{prob}%</td>

                      <td>
                        <Link
                          href={`/hasil-prediksi/${item.nrp}?target=${isSemester ? "semester" : "kelulusan"}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors inline-block"
                        >
                          Lihat Detail
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}