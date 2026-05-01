"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, CalendarDays, Plus } from "lucide-react";

type DataItem = {
  nrp: string;
  probabilitas: number;
};

export default function DashboardPage() {
  const [targetModel, setTargetModel] = useState<"alumni" | "semester">("semester");
  const [data, setData] = useState<DataItem[]>([]);

  const isSemester = targetModel === "semester";

  useEffect(() => {
    const fetchData = async () => {
      const url = isSemester
        ? "/api/results/semester"
        : "/api/results/kelulusan";

      const res = await fetch(url);
      const json = await res.json();
      setData(json);
    };

    fetchData();
  }, [targetModel]);

  const total = data.length;
  const risiko = data.filter(d => d.probabilitas * 100 < 50).length;
  const aman = data.filter(d => d.probabilitas * 100 >= 50).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Dashboard Admin</h1>
            <p className="text-xs text-gray-400">
              Mode: {isSemester ? "Monitoring Semester" : "Analisis Alumni"}
            </p>
          </div>

          <div className="flex bg-white border rounded-xl p-1">
            <button
              onClick={() => setTargetModel("alumni")}
              className={`px-4 py-2 text-xs rounded-lg ${!isSemester && "bg-black text-white"}`}
            >
              <GraduationCap size={14} /> Alumni
            </button>

            <button
              onClick={() => setTargetModel("semester")}
              className={`px-4 py-2 text-xs rounded-lg ${isSemester && "bg-blue-600 text-white"}`}
            >
              <CalendarDays size={14} /> Semester
            </button>
          </div>

          <Link href="/input-mahasiswa" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs flex gap-2">
            <Plus size={14} /> Input
          </Link>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-900 text-white p-4 rounded-xl">
            <p>Total</p>
            <h2 className="text-2xl font-bold">{total}</h2>
          </div>

          <div className="bg-red-600 text-white p-4 rounded-xl">
            <p>Risiko Tinggi</p>
            <h2 className="text-2xl font-bold">{risiko}</h2>
          </div>

          <div className="bg-green-600 text-white p-4 rounded-xl">
            <p>Aman</p>
            <h2 className="text-2xl font-bold">{aman}</h2>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl border">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 text-gray-400">
              <tr>
                <th className="p-3">NRP</th>
                <th>Status</th>
                <th>Probabilitas</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => {
                const prob = Math.round(item.probabilitas * 100);
                const isRisk = prob < 50;

                return (
                  <tr key={item.nrp} className="border-t">
                    <td className="p-3 text-blue-600 font-bold">{item.nrp}</td>

                    <td>
                      <span className={`px-2 py-1 text-white rounded text-[10px] font-bold ${isRisk ? "bg-red-500" : "bg-green-500"}`}>
                        {isRisk ? "RISIKO TINGGI" : "AMAN"}
                      </span>
                    </td>

                    <td className="w-[250px]">
                      <div className="flex flex-col gap-1">
                        {prob}%
                        <div className="bg-gray-200 h-2 rounded">
                          <div
                            className={`${isRisk ? "bg-red-500" : "bg-green-500"} h-2 rounded`}
                            style={{ width: `${prob}%` }}
                          />
                        </div>
                      </div>
                    </td>

<td>
  <Link
    href={`/hasil-prediksi/${item.nrp}?target=${targetModel}`}
    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-[10px] transition"
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