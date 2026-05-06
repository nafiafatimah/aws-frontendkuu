"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getResultByNRP, ResultItem } from "@/lib/api";

export default function DetailMahasiswaPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const nrp = params.nrp as string;
  const target = (searchParams.get("target") ||
    "semester") as "kelulusan" | "semester";

  const [data, setData] = useState<ResultItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!nrp) return;

      const result = await getResultByNRP(nrp, target);
      setData(result);
    };

    fetchData();
  }, [nrp, target]);

  if (!data) {
    return <div className="p-6">Loading...</div>;
  }

  const prob = Math.round(data.probabilitas * 100);
  const isRisk = prob < 50;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow space-y-4">

        <h1 className="text-xl font-bold">
          Detail Mahasiswa
        </h1>

        <p className="text-sm text-gray-400">
          Target: {target}
        </p>

        <div>
          <p className="text-gray-400 text-sm">NRP</p>
          <p className="font-semibold text-blue-600">{data.nrp}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Nama</p>
          <p className="font-semibold">{data.nama}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Status</p>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isRisk
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {isRisk ? "RISIKO TINGGI" : "AMAN"}
          </span>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Probabilitas</p>
          <p className="font-semibold">{prob}%</p>
        </div>

      </div>
    </div>
  );
}