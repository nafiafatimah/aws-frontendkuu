"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  CalendarDays,
  Plus,
  Users,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

import {
  getResultsKelulusan,
  getResultsSemester,
  ResultItem,
} from "@/lib/api";

export default function DashboardPage() {
  const [targetModel, setTargetModel] = useState<"alumni" | "semester">("semester");
  const [data, setData] = useState<ResultItem[]>([]);

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
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [targetModel]);

  const total = data.length;
  const risiko = data.filter((d) => d.probabilitas * 100 < 50).length;
  const aman = data.filter((d) => d.probabilitas * 100 >= 50).length;

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
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex gap-2"
          >
            <Plus size={16} />
            Input
          </Link>
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
        <div className="bg-white rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-400">
              <tr>
                <th className="p-3 text-left">NRP</th>
                <th>Nama</th>
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
                    <td className="p-3 text-blue-600 font-semibold">
                      {item.nrp}
                    </td>

                    <td>{item.nama}</td>

                    <td>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          isRisk
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {isRisk ? "RISIKO" : "AMAN"}
                      </span>
                    </td>

                    <td>{prob}%</td>

                    {/* 🔥 FIX LINK */}
                    <td>
                      <Link
                        href={`/hasil-prediksi/${item.nrp}?target=${isSemester ? "semester" : "kelulusan"}`}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
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