"use client";

/* cspell:disable */

import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Info, AlertCircle, CheckCircle2, BrainCircuit } from "lucide-react";
import { getResultByNRP, DetailResultItem } from "@/lib/api";

// =====================================================
// TYPES
// =====================================================
interface XAIFeature {
  feature: string;
  value: number;
  importance: number;
  contribution_score: number;
}

// =====================================================
// COMPONENT
// =====================================================
export default function DetailMahasiswaPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const nrp = params.nrp as string;
  const target = (searchParams.get("target") || "semester") as "kelulusan" | "semester";

  const [data, setData] = useState<DetailResultItem | null>(null);
  const [xaiFeatures, setXaiFeatures] = useState<XAIFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // =====================================================
  // FETCH DETAIL
  // =====================================================
  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!nrp) {
        setError("NRP tidak ditemukan");
        return;
      }

      console.log("🔍 Fetching detail untuk NRP:", nrp);
      console.log("📌 Target:", target);

      const result = await getResultByNRP(nrp, target);
      console.log("📦 Result dari API:", result);

      if (!result) {
        setError("Data tidak ditemukan. Pastikan mahasiswa sudah diprediksi.");
        setData(null);
        setXaiFeatures([]);
        return;
      }

      // Set data
      setData(result);

      // Parse XAI JSON
      if (result.xai_json) {
        try {
          const parsed = JSON.parse(result.xai_json) as XAIFeature[];
          console.log("🧠 XAI Features:", parsed);
          setXaiFeatures(parsed);
        } catch (error) {
          console.error("Gagal parse xai_json:", error);
          setXaiFeatures([]);
        }
      } else {
        setXaiFeatures([]);
      }
    } catch (error) {
      console.error("❌ Gagal memuat detail:", error);
      setError("Terjadi kesalahan saat memuat data");
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
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="font-semibold">Memproses data Explainable AI...</p>
      </div>
    );
  }

  // =====================================================
  // ERROR / NOT FOUND
  // =====================================================
  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-red-700 mb-2">Data Tidak Ditemukan</h2>
          <p className="text-red-600">{error || "Mahasiswa belum diprediksi atau NRP tidak valid"}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // STATUS LOGIC
  // =====================================================
  const prob = Math.round(data.probabilitas * 100);
  const currentStatus = data.kategori || "TIDAK DIKETAHUI";
  const isRisk = currentStatus === "RISIKO TINGGI" || currentStatus === "TIDAK TEPAT";

  // =====================================================
  // TOP 5 XAI FEATURES
  // =====================================================
  const topFeatures: XAIFeature[] = xaiFeatures
    .sort((a, b) => Math.abs(b.contribution_score) - Math.abs(a.contribution_score))
    .slice(0, 5);

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div className={`min-h-screen p-6 transition-all duration-700 ${isRisk ? "bg-red-50" : "bg-emerald-50"}`}>
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
          {/* LEFT CARD */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-5 ${
                    isRisk ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  {isRisk ? <AlertCircle size={50} /> : <CheckCircle2 size={50} />}
                </div>

                <h1 className="text-2xl font-black text-slate-800">{data.nama}</h1>
                <p className="mt-2 text-blue-600 font-mono font-bold">{data.nrp}</p>
              </div>

              <div className="border-t border-slate-100 my-6"></div>

              <div className="mb-5">
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-black">Model</p>
                <p className="text-sm font-bold text-slate-700 mt-1">
                  {target === "semester" ? "Early Warning System" : "Ketepatan Waktu Studi"}
                </p>
              </div>

              <div className="mb-5">
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-black">Status Prediksi</p>
                <p className={`mt-1 text-sm font-black ${isRisk ? "text-red-600" : "text-emerald-600"}`}>
                  {currentStatus}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-black">Confidence Score</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${isRisk ? "bg-red-500" : "bg-emerald-500"}`}
                      style={{ width: `${prob}%` }}
                    />
                  </div>
                  <span className="text-sm font-black text-slate-700">{prob}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CARD - XAI */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <div className="flex items-start gap-3 mb-8">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800">Explainable AI (XAI)</h2>
                  <p className="text-sm text-slate-400 mt-1">Top 5 faktor paling berpengaruh terhadap prediksi model</p>
                </div>
              </div>

              {topFeatures.length > 0 ? (
                <div className="space-y-6">
                  {topFeatures.map((feat, index) => {
                    const percentage = Math.min(Math.abs(feat.contribution_score) * 100, 100);
                    return (
                      <div key={feat.feature} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-black uppercase text-slate-700">
                              #{index + 1} {feat.feature.replace(/_/g, " ")}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                              Nilai Input: <span className="font-bold">{feat.value}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-400">Contribution</p>
                            <p className="text-sm font-black text-blue-600">
                              {feat.contribution_score.toFixed(4)}
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
                  <h3 className="text-lg font-bold text-slate-500">Data XAI belum tersedia</h3>
                  <p className="text-sm text-slate-400 mt-2">Lakukan prediksi ulang untuk generate XAI.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}