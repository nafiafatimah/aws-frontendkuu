"use client";

import { useState, FormEvent } from "react";
import { GraduationCap, CalendarDays, Upload, UserPlus, CheckCircle, AlertCircle, X } from "lucide-react";

const BASE_URL = "http://127.0.0.1:8000";

type TargetType = "kelulusan" | "semester";
type ModeType = "manual" | "csv";
type FormDataType = Record<string, string | number>;

// Tipe data untuk modal hasil prediksi
type ModalDataType = {
  nama: string;
  status: string;
  probabilitas: number;
} | null;

function parseForm(formData: FormData): FormDataType {
  const data: FormDataType = {};

  formData.forEach((value, key) => {
    const val = value.toString();

    // NRP dan Nama tetap string
    if (key === "nrp" || key === "nama") {
      data[key] = val;
      return;
    }

    const num = Number(val);
    data[key] = Number.isNaN(num) ? val : num;
  });

  return data;
}

export default function InputMahasiswaPage() {
  const [target, setTarget] = useState<TargetType>("kelulusan");
  const [mode, setMode] = useState<ModeType>("manual");
  
  // State baru untuk mengontrol modal hasil prediksi
  const [modalData, setModalData] = useState<ModalDataType>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isKelulusan = target === "kelulusan";

  // ================= SUBMIT =================
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    endpoint: string
  ) => {
    e.preventDefault();

    const form = e.currentTarget;
    const data = parseForm(new FormData(form));

    console.log("DATA DIKIRIM =", data);

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      console.log("STATUS =", res.status);
      console.log("RESPONSE =", result);

      if (!res.ok) {
        setErrorMessage(`Error ${res.status}: ${JSON.stringify(result)}`);
        return;
      }

      // Simpan hasil ke state modal daripada menggunakan alert bawaan
      setModalData({
        nama: result.nama,
        status: result.status,
        probabilitas: result.probabilitas,
      });

      form.reset();
    } catch (err) {
      console.error(err);
      setErrorMessage("Gagal melakukan koneksi ke backend server.");
    }
  };

  // ================= CSV =================
const [csvFile, setCsvFile] = useState<File | null>(null);

const handleCSV = async (
  e: FormEvent<HTMLFormElement>
) => {

  e.preventDefault();

  if (!csvFile) {
    setErrorMessage("Pilih file CSV terlebih dahulu");
    return;
  }

  try {

    const formData = new FormData();

    formData.append(
      "file",
      csvFile
    );

    const endpoint =
      target === "kelulusan"
        ? "/predict/kelulusan/csv"
        : "/predict/semester/csv";

    const res = await fetch(
      `${BASE_URL}${endpoint}`,
      {
        method: "POST",
        body: formData
      }
    );

    const result = await res.json();

    if (!res.ok) {
      setErrorMessage(
        result.detail || "Upload gagal"
      );
      return;
    }

    alert(
      `Berhasil memproses ${result.total_data} data`
    );

  } catch (err) {

    console.error(err);

    setErrorMessage(
      "Gagal koneksi ke backend"
    );
  }
};
  // ================= STYLE =================
  const containerStyle = isKelulusan
    ? "bg-white"
    : "bg-blue-50 border border-blue-100";

  const buttonColor = isKelulusan
    ? "bg-gray-900 hover:bg-black"
    : "bg-blue-600 hover:bg-blue-700";

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
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

              <button className={`col-span-2 text-white py-2 rounded-lg transition ${buttonColor}`}>
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

              <button className={`col-span-2 text-white py-2 rounded-lg transition ${buttonColor}`}>
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

              <input
                type="file"
                accept=".csv"
                className="text-sm"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setCsvFile(
                      e.target.files[0]
                    );
                  }
                }}
              />

              <button className={`text-white px-6 py-2 rounded-lg transition ${buttonColor}`}>
                Upload & Proses
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ================= CUSTOM MODAL HASIL PREDIKSI ================= */}
      {modalData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
            <button 
              onClick={() => setModalData(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="bg-green-100 text-green-600 p-3 rounded-full">
                <CheckCircle size={32} />
              </div>
              
              <h3 className="text-lg font-bold text-gray-900">Hasil Prediksi Berhasil</h3>
              <p className="text-sm text-gray-500 font-medium">Mahasiswa: {modalData.nama}</p>
              
              <hr className="w-full border-gray-100" />
              
              <div className="w-full bg-gray-50 p-4 rounded-xl space-y-2 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Status Kelulusan</span>
                  <span className="text-sm font-bold text-gray-900 px-2.5 py-1 bg-white border border-gray-200 rounded-lg shadow-sm">
                    {modalData.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Probabilitas</span>
                  <span className="text-sm font-bold text-blue-600">
                    {(modalData.probabilitas * 100).toFixed(2)}%
                  </span>
                </div>
              </div>

              <button
                onClick={() => setModalData(null)}
                className="w-full bg-gray-900 hover:bg-black text-white py-2.5 rounded-xl text-sm font-medium transition shadow-sm"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CUSTOM MODAL ERROR ================= */}
      {errorMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-100 relative">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="bg-red-100 text-red-600 p-3 rounded-full">
                <AlertCircle size={32} />
              </div>
              
              <h3 className="text-lg font-bold text-gray-900">Terjadi Kesalahan</h3>
              <p className="text-sm text-gray-600 bg-red-50 p-3 rounded-xl border border-red-100 max-w-full break-words">
                {errorMessage}
              </p>

              <button
                onClick={() => setErrorMessage(null)}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-medium transition shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STYLE */}
      <style jsx>{`
        .input {
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          outline: none;
          transition: border-color 0.2s;
        }
        .input:focus {
          border-color: #3b82f6;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}