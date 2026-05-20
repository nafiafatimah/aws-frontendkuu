"use client";

/* cspell:disable */

import { useEffect, useState, useCallback } from "react";
import {
  useParams,
  useSearchParams,
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  Info,
  AlertCircle,
  CheckCircle2,
  BrainCircuit,
} from "lucide-react";

import { getResultByNRP } from "@/lib/api";

// =====================================================
// TYPES
// =====================================================
interface XAIFeature {
  feature: string;
  value: number;
  importance: number;
  contribution_score: number;
}

interface FullResultItem {
  nrp: string;
  nama: string;

  status?: string;
  kategori?: string;

  probabilitas: number;

  xai_json?: string;

  xai_feature_contribution?: XAIFeature[];
}

// =====================================================
// COMPONENT
// =====================================================
export default function DetailMahasiswaPage() {

  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const nrp = params.nrp as string;

  const target = (
    searchParams.get("target") || "semester"
  ) as "kelulusan" | "semester";

  const [data, setData] = useState<FullResultItem | null>(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH DETAIL
  // =====================================================
  const fetchDetail = useCallback(async () => {

    setLoading(true);

    try {

      if (!nrp) return;

      const result = await getResultByNRP(nrp, target);

      if (!result) {
        setData(null);
        return;
      }

      const parsedResult: FullResultItem = {
        ...result,
      };

      // =====================================================
      // PARSE XAI JSON
      // =====================================================
      if (
        parsedResult.xai_json &&
        !parsedResult.xai_feature_contribution
      ) {
        try {
          parsedResult.xai_feature_contribution =
            JSON.parse(parsedResult.xai_json) as XAIFeature[];
        } catch (error) {
          console.error("Gagal parse xai_json:", error);
        }
      }

      setData(parsedResult);

    } catch (error) {
      console.error("Gagal memuat detail:", error);
    } finally {
      setLoading(false);
    }

  }, [nrp, target]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 font-semibold">
        Memproses data Explainable AI...
      </div>
    );
  }

  // =====================================================
  // NOT FOUND
  // =====================================================
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">
        Data tidak ditemukan
      </div>
    );
  }

  // =====================================================
  // STATUS LOGIC
  // =====================================================
  const prob = Math.round(data.probabilitas * 100);

  const currentStatus =
    data.kategori ||
    data.status ||
    "TIDAK DIKETAHUI";

  const isRisk =
    currentStatus === "RISIKO TINGGI" ||
    currentStatus === "TIDAK TEPAT";

  // =====================================================
  // TOP 5 XAI FEATURES (IMPORTANT)
  // =====================================================
  const topFeatures: XAIFeature[] =
    (data.xai_feature_contribution || [])
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 5);

  return (
    <div
      className={`min-h-screen p-6 transition-all duration-700 ${
        isRisk ? "bg-red-50" : "bg-emerald-50"
      }`}
    >
      <div className="max-w-6xl mx-auto space-y-6">

        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-all font-semibold"
        >
          <ArrowLeft size={20} />
          Kembali
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ===================================================== */}
          {/* LEFT CARD */}
          {/* ===================================================== */}
          <div className="lg:col-span-1">

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">

              <div className="flex flex-col items-center text-center">

                <div
                  className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-5 ${
                    isRisk
                      ? "bg-red-100 text-red-600"
                      : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  {isRisk ? (
                    <AlertCircle size={50} />
                  ) : (
                    <CheckCircle2 size={50} />
                  )}
                </div>

                <h1 className="text-2xl font-black text-slate-800">
                  {data.nama}
                </h1>

                <p className="mt-2 text-blue-600 font-mono font-bold">
                  {data.nrp}
                </p>

              </div>

              <div className="border-t border-slate-100 my-6"></div>

              {/* MODEL */}
              <div className="mb-5">
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-black">
                  Model
                </p>
                <p className="text-sm font-bold text-slate-700 mt-1">
                  {target === "semester"
                    ? "Early Warning System"
                    : "Ketepatan Waktu Studi"}
                </p>
              </div>

              {/* STATUS */}
              <div className="mb-5">
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-black">
                  Status Prediksi
                </p>
                <p
                  className={`mt-1 text-sm font-black ${
                    isRisk ? "text-red-600" : "text-emerald-600"
                  }`}
                >
                  {currentStatus}
                </p>
              </div>

              {/* CONFIDENCE */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-black">
                  Confidence Score
                </p>

                <div className="flex items-center gap-3 mt-2">

                  <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        isRisk ? "bg-red-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${prob}%` }}
                    />
                  </div>

                  <span className="text-sm font-black text-slate-700">
                    {prob}%
                  </span>

                </div>
              </div>

            </div>
          </div>

          {/* ===================================================== */}
          {/* RIGHT CARD - XAI TOP 5 */}
          {/* ===================================================== */}
          <div className="lg:col-span-2">

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">

              {/* HEADER */}
              <div className="flex items-start gap-3 mb-8">

                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                  <BrainCircuit size={24} />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-800">
                    Explainable AI (XAI)
                  </h2>

                  <p className="text-sm text-slate-400 mt-1">
                    Top 5 faktor paling berpengaruh terhadap prediksi model
                  </p>
                </div>

              </div>

              {/* ===================================================== */}
              {/* XAI CONTENT (TOP 5 ONLY) */}
              {/* ===================================================== */}
              {topFeatures.length > 0 ? (
                <div className="space-y-6">

                  {topFeatures.map((feat, index) => {

                    const percentage = Math.min(
                      feat.importance * 500,
                      100
                    );

                    return (
                      <div key={feat.feature} className="space-y-3">

                        <div className="flex items-center justify-between">

                          <div>

                            <h3 className="text-sm font-black uppercase text-slate-700">
                              #{index + 1}{" "}
                              {feat.feature.replaceAll("_", " ")}
                            </h3>

                            <p className="text-xs text-slate-400 mt-1">
                              Nilai Input:{" "}
                              <span className="font-bold">
                                {feat.value}
                              </span>
                            </p>

                          </div>

                          <div className="text-right">
                            <p className="text-xs text-slate-400">
                              Contribution
                            </p>
                            <p className="text-sm font-black text-blue-600">
                              {feat.contribution_score.toFixed(2)}
                            </p>
                          </div>

                        </div>

                        <div className="relative w-full h-10 rounded-2xl bg-slate-100 overflow-hidden border">

                          <div
                            className={`absolute top-0 left-0 h-full ${
                              isRisk ? "bg-red-400/30" : "bg-blue-400/30"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />

                          <div className="relative z-10 h-full flex items-center justify-between px-4">

                            <span className="text-xs font-bold text-slate-700">
                              Importance: {feat.importance.toFixed(4)}
                            </span>

                            <span className="text-xs font-bold text-slate-500">
                              {percentage.toFixed(0)}%
                            </span>

                          </div>

                        </div>

                      </div>
                    );
                  })}

                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">

                  <Info className="mx-auto mb-4 text-slate-300" size={40} />

                  <h3 className="text-lg font-bold text-slate-500">
                    Data XAI belum tersedia
                  </h3>

                  <p className="text-sm text-slate-400 mt-2">
                    Lakukan prediksi ulang untuk generate XAI.
                  </p>

                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}