"use client";

import { useState, FormEvent } from "react";
import { GraduationCap, CalendarDays, Upload, UserPlus } from "lucide-react";

const BASE_URL = "http://127.0.0.1:8000";

type TargetType = "kelulusan" | "semester";
type ModeType = "manual" | "csv";
type FormDataType = Record<string, string | number>;

function parseForm(formData: FormData): FormDataType {
  const data: FormDataType = {};
  formData.forEach((value, key) => {
    const val = value.toString();
    const num = Number(val);
    data[key] = Number.isNaN(num) ? val : num;
  });
  return data;
}

export default function InputMahasiswaPage() {
  const [target, setTarget] = useState<TargetType>("kelulusan");
  const [mode, setMode] = useState<ModeType>("manual");

  const isKelulusan = target === "kelulusan";

  // ================= SUBMIT =================
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    endpoint: string
  ) => {
    e.preventDefault();

    const form = e.currentTarget;
    const data = parseForm(new FormData(form));

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      alert(
        `${result.nama}\nStatus: ${result.status}\nProb: ${(
          result.probabilitas * 100
        ).toFixed(2)}%`
      );

      form.reset();
    } catch {
      alert("Gagal konek backend");
    }
  };

  // ================= CSV =================
  const handleCSV = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Upload CSV belum aktif di backend");
  };

  // ================= STYLE =================
  const containerStyle = isKelulusan
    ? "bg-white"
    : "bg-blue-50 border border-blue-100";

  const buttonColor = isKelulusan
    ? "bg-gray-900 hover:bg-black"
    : "bg-blue-600 hover:bg-blue-700";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-xl font-bold">Input Data Mahasiswa</h1>
          <p className="text-sm text-gray-500">
            {isKelulusan
              ? "Prediksi kelulusan mahasiswa"
              : "Monitoring performa per semester"}
          </p>
        </div>

        {/* SWITCH TARGET (CENTER) */}
        <div className="flex justify-center">
          <div className="flex bg-gray-100 border rounded-2xl p-1 shadow-sm">

            <button
              onClick={() => setTarget("kelulusan")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm transition ${
                isKelulusan
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-500"
              }`}
            >
              <GraduationCap size={16} />
              Kelulusan
            </button>

            <button
              onClick={() => setTarget("semester")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm transition ${
                !isKelulusan
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-500"
              }`}
            >
              <CalendarDays size={16} />
              Per Semester
            </button>

          </div>
        </div>

        {/* CARD */}
        <div className={`rounded-2xl p-6 shadow-sm ${containerStyle}`}>

          {/* SWITCH MODE (CENTER - SESUAI DESAIN) */}
          <div className="flex justify-center mb-6">
            <div className="flex bg-gray-200 rounded-full p-1 w-[350px]">

              <button
                onClick={() => setMode("manual")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm transition ${
                  mode === "manual"
                    ? "bg-white shadow font-medium"
                    : "text-gray-500"
                }`}
              >
                <UserPlus size={16} />
                Input Manual
              </button>

              <button
                onClick={() => setMode("csv")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm transition ${
                  mode === "csv"
                    ? "bg-white shadow font-medium"
                    : "text-gray-500"
                }`}
              >
                <Upload size={16} />
                Upload CSV
              </button>

            </div>
          </div>

          {/* ================= MANUAL ================= */}
          {mode === "manual" && isKelulusan && (
            <form
              onSubmit={(e) => handleSubmit(e, "/predict/kelulusan")}
              className="grid grid-cols-2 gap-4 text-sm"
            >
              <input name="nrp" placeholder="NRP" className="input" required />
              <input name="nama" placeholder="Nama" className="input" required />
              <input name="angkatan" type="number" placeholder="Angkatan" className="input" required />
              <input name="label_prog" type="number" placeholder="Prodi (label)" className="input" required />
              <input name="gender_enc" type="number" placeholder="Gender (0/1)" className="input" required />
              <input name="ips_mean" type="number" step="0.01" placeholder="IPS Mean" className="input" required />
              <input name="sks_mean" type="number" step="0.01" placeholder="SKS Mean" className="input" required />
              <input name="ipk_mean" type="number" step="0.01" placeholder="IPK Mean" className="input" required />
              <input name="absen_mean" type="number" step="0.1" placeholder="Absen Mean" className="input" required />
              <input name="teori_mean" type="number" step="0.1" placeholder="Nilai Teori" className="input" required />
              <input name="prak_mean" type="number" step="0.1" placeholder="Nilai Praktek" className="input" required />
              <input name="cnt_tepat_waktu" type="number" placeholder="Count Tepat Waktu" className="input" required />

              <button className={`col-span-2 text-white py-2 rounded-lg ${buttonColor}`}>
                Simpan & Prediksi
              </button>
            </form>
          )}

          {mode === "manual" && !isKelulusan && (
            <form
              onSubmit={(e) => handleSubmit(e, "/predict/semester")}
              className="grid grid-cols-2 gap-4 text-sm"
            >
              <input name="nrp" placeholder="NRP" className="input" required />
              <input name="nama" placeholder="Nama" className="input" required />
              <input name="semester_ke" type="number" placeholder="Semester" className="input" required />
              <input name="label_prog" type="number" placeholder="Prodi" className="input" required />
              <input name="ips" type="number" step="0.01" placeholder="IPS" className="input" required />
              <input name="ips_diff" type="number" step="0.01" placeholder="IPS Diff" className="input" required />
              <input name="presensi" type="number" placeholder="Presensi %" className="input" required />
              <input name="teori" type="number" placeholder="Nilai Teori" className="input" required />
              <input name="prak" type="number" placeholder="Nilai Praktek" className="input" required />
              <input name="sks_target" type="number" placeholder="SKS Target" className="input" required />
              <input name="delay_tugas" type="number" placeholder="Delay Tugas" className="input" required />
              <input name="total_sks_hutang" type="number" placeholder="SKS Hutang" className="input" required />
              <input name="ekonomi_level" type="number" placeholder="Ekonomi" className="input" required />
              <input name="skor_masuk" type="number" placeholder="Skor Masuk" className="input" required />

              <button className={`col-span-2 text-white py-2 rounded-lg ${buttonColor}`}>
                Simpan & Prediksi
              </button>
            </form>
          )}

          {/* ================= CSV ================= */}
          {mode === "csv" && (
            <form
              onSubmit={handleCSV}
              className="flex flex-col items-center gap-4"
            >
              <p className="text-sm text-gray-500 text-center">
                Upload file CSV untuk prediksi massal
              </p>

              <input type="file" accept=".csv" className="text-sm" />

              <button className={`text-white px-6 py-2 rounded-lg ${buttonColor}`}>
                Upload & Proses
              </button>
            </form>
          )}
        </div>
      </div>

      {/* STYLE */}
      <style jsx>{`
        .input {
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
        }
      `}</style>
    </div>
  );
}