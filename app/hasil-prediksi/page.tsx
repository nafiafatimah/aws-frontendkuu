"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, CalendarDays } from "lucide-react";

type DataItem = {
  nrp: string;
  nama: string;
  kategori: string;
  probabilitas: number;
};

export default function HasilPrediksiPage() {
  const [target, setTarget] = useState<"kelulusan" | "semester">("kelulusan");
  const [data, setData] = useState<DataItem[]>([]);

  const isSemester = target === "semester";

  useEffect(() => {
    const fetchData = async () => {
      const url = isSemester
        ? "http://127.0.0.1:8000/results/semester"
        : "http://127.0.0.1:8000/results/kelulusan";

      const res = await fetch(url);
      const json = await res.json();
      setData(json);
    };

    fetchData();
  }, [target]);

  // =========================
  // 📊 SUMMARY
  // =========================
  const total = data.length;

  const avgProb =
    total > 0
      ? data.reduce((acc, d) => acc + d.probabilitas, 0) / total
      : 0;

  const risiko = data.filter((d) => d.probabilitas < 0.5).length;
  const aman = data.filter((d) => d.probabilitas >= 0.5).length;

  return (
    <div className={`min-h-screen p-6 ${isSemester ? "bg-blue-50" : "bg-gray-50"}`}>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Hasil Prediksi
            </h1>
            <p className="text-sm text-gray-500">
              Ringkasan hasil prediksi untuk semua mahasiswa
            </p>
          </div>

          {/* SWITCH */}
          <div className="flex bg-white border rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setTarget("kelulusan")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                !isSemester ? "bg-gray-800 text-white" : "text-gray-500"
              }`}
            >
              <GraduationCap size={16} />
              Kelulusan
            </button>

            <button
              onClick={() => setTarget("semester")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                isSemester ? "bg-blue-600 text-white" : "text-gray-500"
              }`}
            >
              <CalendarDays size={16} />
              Per Semester
            </button>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* AVG */}
          <div className="bg-white border rounded-xl p-4">
            <p className="text-sm text-gray-500">Rata-rata Probabilitas</p>
            <h2 className="text-2xl font-bold mt-2">
              {(avgProb * 100).toFixed(1)}%
            </h2>
          </div>

          {/* RISIKO */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-500">Risiko Tinggi</p>
            <h2 className="text-2xl font-bold text-red-600 mt-2">
              {risiko}
            </h2>
          </div>

          {/* AMAN */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm text-green-600">Aman</p>
            <h2 className="text-2xl font-bold text-green-700 mt-2">
              {aman}
            </h2>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl border shadow-sm">

          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-700">
              Detail Hasil Prediksi
            </h2>
            <p className="text-xs text-gray-400">
              Daftar lengkap hasil prediksi setiap mahasiswa
            </p>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-3 text-left">NRP</th>
                <th>Status Risiko</th>
                <th>Probabilitas</th>
                <th>Tren</th>
                <th>Faktor Utama</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => {
                const prob = Math.round(item.probabilitas * 100);
                const isRisk = prob < 50;

                return (
                  <tr key={item.nrp} className="border-t hover:bg-gray-50">

                    {/* NRP */}
                    <td className="p-3 text-blue-600 font-semibold">
                      {item.nrp}
                    </td>

                    {/* STATUS */}
                    <td>
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          isRisk
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {isRisk ? "RISIKO TINGGI" : "AMAN"}
                      </span>
                    </td>

                    {/* PROB */}
                    <td className="w-[200px]">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs">{prob}%</span>

                        <div className="bg-gray-200 h-2 rounded-full">
                          <div
                            className={`h-2 rounded-full ${
                              isRisk ? "bg-red-500" : "bg-green-500"
                            }`}
                            style={{ width: `${prob}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* TREND (dummy dulu) */}
                    <td className="text-center">
                      {isRisk ? "📉" : "📈"}
                    </td>

                    {/* FAKTOR (dummy dulu) */}
                    <td className="space-x-2">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        ip_semester
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        presensi
                      </span>
                    </td>

                    {/* AKSI */}
                    <td>
                      <Link
                        href={`/hasil-prediksi/${item.nrp}?target=${target}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Lihat Detail
                      </Link>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}