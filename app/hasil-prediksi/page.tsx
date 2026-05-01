"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getResultByNRP, ResultItem } from "@/lib/api";

// ==============================
// STATUS HELPER
// ==============================
const getStatus = (prob: number) => {
  if (prob >= 0.5) {
    return {
      label: "AMAN",
      warna: "bg-green-500",
      bgSoft: "bg-green-50",
      text: "text-green-700",
    };
  }

  return {
    label: "RISIKO TINGGI",
    warna: "bg-red-500",
    bgSoft: "bg-red-50",
    text: "text-red-700",
  };
};

export default function DetailPage() {
  const params = useParams();
  const search = useSearchParams();

  const nrp = params.nrp as string;
  const target =
    (search.get("target") as "kelulusan" | "semester") || "kelulusan";

  const [data, setData] = useState<ResultItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getResultByNRP(nrp, target);
        console.log("DETAIL RESULT:", res); // DEBUG

        setData(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [nrp, target]);

  if (!data) {
    return <div className="p-6 text-center">Loading data...</div>;
  }

  const s = getStatus(data.probabilitas);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto space-y-6">

        {/* =========================
            HEADER
        ========================= */}
        <div>
          <h1 className="text-xl font-bold">Detail Prediksi</h1>
          <p className="text-sm text-gray-400">
            Target: {target === "semester" ? "Monitoring Semester" : "Kelulusan"}
          </p>
        </div>

        {/* =========================
            CARD IDENTITAS
        ========================= */}
        <div className="bg-white p-5 rounded-xl shadow space-y-2">
          <p className="text-xs text-gray-400">NRP</p>
          <h2 className="font-bold text-blue-600 text-lg">{data.nrp}</h2>

          <p className="text-xs text-gray-400 mt-2">Nama Mahasiswa</p>
          <h2 className="font-semibold text-gray-800">
            {data.nama || "-"}
          </h2>
        </div>

        {/* =========================
            CARD STATUS
        ========================= */}
        <div className={`${s.bgSoft} p-5 rounded-xl shadow`}>
          <p className="text-xs text-gray-400">Status Risiko</p>

          <div className="flex justify-between items-center mt-2">
            <span
              className={`${s.warna} text-white px-3 py-1 rounded-lg text-xs font-bold`}
            >
              {s.label}
            </span>

            <span className={`text-sm font-semibold ${s.text}`}>
              {data.probabilitas >= 0.5
                ? "Kondisi Aman"
                : "Perlu Perhatian"}
            </span>
          </div>
        </div>

        {/* =========================
            CARD PROBABILITAS (INI YANG KAMU MAU)
        ========================= */}
        <div className={`${s.warna} text-white p-6 rounded-xl shadow text-center`}>
          <p className="text-xs opacity-80 mb-2">Probabilitas</p>

          <h1 className="text-4xl font-bold">
            {(data.probabilitas * 100).toFixed(2)}%
          </h1>
        </div>

        {/* =========================
            FOOTER INFO
        ========================= */}
        <div className="bg-white p-4 rounded-xl shadow text-sm text-gray-500">
          <p>
            Waktu Prediksi:
            <br />
            <span className="font-medium text-gray-700">
              {new Date(data.created_at).toLocaleString()}
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}