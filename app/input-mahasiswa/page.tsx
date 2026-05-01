"use client";

import { useState } from "react";
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Plus,
  GraduationCap,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";

// =====================
// TYPES
// =====================
type StatusType = "AMAN" | "RISIKO TINGGI";

type DataItem = {
  nrp: string;
  status: StatusType;
  probabilitas: number;
};

// =====================
// MOCK DATA
// =====================
const dataAlumni: DataItem[] = [
  { nrp: "3123500045", status: "RISIKO TINGGI", probabilitas: 0.32 },
  { nrp: "3123500012", status: "AMAN", probabilitas: 0.87 },
];

const dataSemester: DataItem[] = [
  { nrp: "3123500045", status: "AMAN", probabilitas: 0.75 },
  { nrp: "3123500012", status: "RISIKO TINGGI", probabilitas: 0.40 },
];

// =====================
// HELPER
// =====================
const getStats = (data: DataItem[]) => ({
  total: data.length,
  risiko: data.filter((d) => d.status === "RISIKO TINGGI").length,
  aman: data.filter((d) => d.status === "AMAN").length,
});

const getStatusColor = (status: StatusType) => {
  return status === "RISIKO TINGGI"
    ? "bg-red-500"
    : "bg-green-500";
};

// =====================
// COMPONENT
// =====================
export default function DashboardPage() {
  const [targetModel, setTargetModel] = useState<"alumni" | "semester">("alumni");

  const isSemester = targetModel === "semester";
  const activeData = isSemester ? dataSemester : dataAlumni;
  const stats = getStats(activeData);

  const theme = {
    main: isSemester ? "bg-blue-50/50" : "bg-zinc-50",
    primary: isSemester ? "bg-blue-900" : "bg-slate-800",
    danger: isSemester ? "bg-red-700" : "bg-red-600",
    success: isSemester ? "bg-green-700" : "bg-green-600",
  };

  return (
    <div className={`min-h-screen ${theme.main}`}>
      <div className="p-6 space-y-5 max-w-[1200px] mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-xl font-bold">Dashboard Admin</h1>
            <p className="text-xs text-gray-400">
              Mode: {isSemester ? "Monitoring Semester" : "Analisis Alumni"}
            </p>
          </div>

          {/* TOGGLE */}
          <div className="flex bg-white p-1 rounded-xl border">
            <button
              onClick={() => setTargetModel("alumni")}
              className={`px-4 py-2 text-xs font-bold rounded-lg ${
                targetModel === "alumni" ? "bg-black text-white" : ""
              }`}
            >
              <GraduationCap size={14} /> Alumni
            </button>

            <button
              onClick={() => setTargetModel("semester")}
              className={`px-4 py-2 text-xs font-bold rounded-lg ${
                targetModel === "semester" ? "bg-blue-600 text-white" : ""
              }`}
            >
              <CalendarDays size={14} /> Semester
            </button>
          </div>

          <Link
            href="/input-mahasiswa"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs flex items-center gap-2"
          >
            <Plus size={14} />
            Input
          </Link>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className={`${theme.primary} text-white p-4 rounded-xl`}>
            <p className="text-xs opacity-70">Total</p>
            <h2 className="text-2xl font-bold">{stats.total}</h2>
          </div>

          <div className={`${theme.danger} text-white p-4 rounded-xl`}>
            <p className="text-xs opacity-70">Risiko Tinggi</p>
            <h2 className="text-2xl font-bold">{stats.risiko}</h2>
          </div>

          <div className={`${theme.success} text-white p-4 rounded-xl`}>
            <p className="text-xs opacity-70">Aman</p>
            <h2 className="text-2xl font-bold">{stats.aman}</h2>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-4 border-b">
            <h3 className="font-bold text-sm">
              Data {isSemester ? "Semester" : "Alumni"}
            </h3>
          </div>

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
              {activeData.map((m) => (
                <tr key={m.nrp} className="border-t">
                  <td className="p-3 font-bold text-blue-600">{m.nrp}</td>

                  <td>
                    <span
                      className={`${getStatusColor(
                        m.status
                      )} text-white px-2 py-1 rounded`}
                    >
                      {m.status}
                    </span>
                  </td>

                  <td>
                    {(m.probabilitas * 100).toFixed(2)}%
                  </td>

                  <td>
                    <Link
                      href={`/hasil/${m.nrp}`}
                      className="text-blue-600 font-bold"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}