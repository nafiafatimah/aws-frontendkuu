"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  GraduationCap,
  CalendarDays,
  Plus,
  Filter,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import {
  getResultsKelulusan,
  getResultsSemester,
  updateMahasiswaKelulusan,
  updateMahasiswaSemester,
  deleteMahasiswaKelulusan,
  deleteMahasiswaSemester,
  getMahasiswaKelulusanByNRP,
  getMahasiswaSemesterByNRP,
  ResultItem,
  MahasiswaKelulusan,
  MahasiswaSemester,
} from "@/lib/api";

// Definisikan tipe error
interface ApiError {
  detail?: string;
  message?: string;
}

export default function DashboardPage() {
  const [targetModel, setTargetModel] = useState<"alumni" | "semester">("semester");
  const [data, setData] = useState<ResultItem[]>([]);
  const [selectedAngkatan, setSelectedAngkatan] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // State untuk Modal Update & Delete
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ResultItem | null>(null);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  
  // Form State untuk Update - Kelulusan
  const [formDataKelulusan, setFormDataKelulusan] = useState<Partial<MahasiswaKelulusan>>({
    nama: "",
    angkatan: 2020,
    label_prog: 1,
    gender_enc: 1,
    ips_mean: 0,
    sks_mean: 0,
    ipk_mean: 0,
    absen_mean: 0,
    teori_mean: 0,
    prak_mean: 0,
    cnt_tepat_waktu: 0,
  });

  // Form State untuk Update - Semester
  const [formDataSemester, setFormDataSemester] = useState<Partial<MahasiswaSemester>>({
    nama: "",
    semester_ke: 1,
    label_prog: 1,
    ips: 0,
    ips_diff: 0,
    presensi: 0,
    teori: 0,
    prak: 0,
    sks_target: 24,
    delay_tugas: 0,
    total_sks_hutang: 0,
    ekonomi_level: 1,
    skor_masuk: 0,
  });

  const isSemester = targetModel === "semester";

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = isSemester
          ? await getResultsSemester()
          : await getResultsKelulusan();

        const clean = result.filter((d) => d.nrp);
        setData(clean);
        setSelectedAngkatan(""); 
      } catch (err) {
        console.error("Gagal memuat data dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [targetModel]);

  // Ambil daftar angkatan unik
  const daftarAngkatan = useMemo(() => {
    const setAngkatan = new Set<string>();
    data.forEach((item) => {
      if (item.nrp) {
        const nrpStr = item.nrp.toString();
        if (nrpStr.length >= 4) {
          const tahun = nrpStr.substring(2, 4); 
          setAngkatan.add(tahun);
        }
      }
    });
    return Array.from(setAngkatan).sort();
  }, [data]);

  // Filter data berdasarkan angkatan
  const filteredData = useMemo(() => {
    if (!selectedAngkatan) return data;
    return data.filter((item) => {
      const nrpStr = item.nrp.toString();
      return nrpStr.substring(2, 4) === selectedAngkatan;
    });
  }, [data, selectedAngkatan]);

  // Hitung metrik
  const total = filteredData.length;
  const risiko = filteredData.filter((d) => d.probabilitas * 100 < 50).length;
  const aman = filteredData.filter((d) => d.probabilitas * 100 >= 50).length;

  // HANDLER: Buka Modal Update & Load Data
  const handleOpenUpdate = async (item: ResultItem) => {
    setEditingItem(item);
    setIsUpdateModalOpen(true);
    setLoading(true);

    try {
      if (isSemester) {
        const data = await getMahasiswaSemesterByNRP(item.nrp);
        if (data) {
          setFormDataSemester({
            nama: data.nama,
            semester_ke: data.semester_ke,
            label_prog: data.label_prog,
            ips: data.ips,
            ips_diff: data.ips_diff,
            presensi: data.presensi,
            teori: data.teori,
            prak: data.prak,
            sks_target: data.sks_target,
            delay_tugas: data.delay_tugas,
            total_sks_hutang: data.total_sks_hutang,
            ekonomi_level: data.ekonomi_level,
            skor_masuk: data.skor_masuk,
          });
        }
      } else {
        const data = await getMahasiswaKelulusanByNRP(item.nrp);
        if (data) {
          setFormDataKelulusan({
            nama: data.nama,
            angkatan: data.angkatan,
            label_prog: data.label_prog,
            gender_enc: data.gender_enc,
            ips_mean: data.ips_mean,
            sks_mean: data.sks_mean,
            ipk_mean: data.ipk_mean,
            absen_mean: data.absen_mean,
            teori_mean: data.teori_mean,
            prak_mean: data.prak_mean,
            cnt_tepat_waktu: data.cnt_tepat_waktu,
          });
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // HANDLER: Eksekusi Update
  const handleExecuteUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsLoadingUpdate(true);
    try {
      if (isSemester) {
        await updateMahasiswaSemester(editingItem.nrp, {
          nama: formDataSemester.nama || "",
          semester_ke: formDataSemester.semester_ke || 1,
          label_prog: formDataSemester.label_prog || 1,
          ips: formDataSemester.ips || 0,
          ips_diff: formDataSemester.ips_diff || 0,
          presensi: formDataSemester.presensi || 0,
          teori: formDataSemester.teori || 0,
          prak: formDataSemester.prak || 0,
          sks_target: formDataSemester.sks_target || 24,
          delay_tugas: formDataSemester.delay_tugas || 0,
          total_sks_hutang: formDataSemester.total_sks_hutang || 0,
          ekonomi_level: formDataSemester.ekonomi_level || 1,
          skor_masuk: formDataSemester.skor_masuk || 0,
        });
      } else {
        await updateMahasiswaKelulusan(editingItem.nrp, {
          nama: formDataKelulusan.nama || "",
          angkatan: formDataKelulusan.angkatan || 2020,
          label_prog: formDataKelulusan.label_prog || 1,
          gender_enc: formDataKelulusan.gender_enc || 1,
          ips_mean: formDataKelulusan.ips_mean || 0,
          sks_mean: formDataKelulusan.sks_mean || 0,
          ipk_mean: formDataKelulusan.ipk_mean || 0,
          absen_mean: formDataKelulusan.absen_mean || 0,
          teori_mean: formDataKelulusan.teori_mean || 0,
          prak_mean: formDataKelulusan.prak_mean || 0,
          cnt_tepat_waktu: formDataKelulusan.cnt_tepat_waktu || 0,
        });
      }
      
      alert(`✅ Data Mahasiswa NRP ${editingItem.nrp} Berhasil Diperbarui!`);
      
      // Refresh data
      const result = isSemester
        ? await getResultsSemester()
        : await getResultsKelulusan();
      setData(result.filter((d) => d.nrp));

      setIsUpdateModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Gagal melakukan pembaruan:", error);
      // Type guard untuk error
      let errorMessage = "Gagal memperbarui data mahasiswa.";
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as Error).message;
      }
      if (error && typeof error === 'object' && 'detail' in error) {
        errorMessage = (error as ApiError).detail || errorMessage;
      }
      alert(`❌ ${errorMessage}`);
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  // HANDLER: Eksekusi Delete
  const handleExecuteDelete = async (nrp: string | number) => {
    const confirmDelete = confirm(`⚠️ Apakah Anda yakin ingin menghapus data mahasiswa dengan NRP ${nrp}?`);
    if (!confirmDelete) return;

    try {
      if (isSemester) {
        await deleteMahasiswaSemester(nrp);
      } else {
        await deleteMahasiswaKelulusan(nrp);
      }
      
      alert(`🗑️ Data Mahasiswa NRP ${nrp} Berhasil Dihapus!`);
      
      // Refresh data
      const result = isSemester
        ? await getResultsSemester()
        : await getResultsKelulusan();
      setData(result.filter((d) => d.nrp));
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      let errorMessage = "Gagal menghapus data mahasiswa.";
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as Error).message;
      }
      if (error && typeof error === 'object' && 'detail' in error) {
        errorMessage = (error as ApiError).detail || errorMessage;
      }
      alert(`❌ ${errorMessage}`);
    }
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${isSemester ? "bg-blue-50" : "bg-gray-50"}`}>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Dashboard Admin</h1>
            <p className="text-sm text-gray-500">
              Monitoring Early Warning System (EWS) Mahasiswa
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* DROPDOWN FILTER ANGKATAN */}
            <div className="flex items-center gap-2 bg-white border rounded-2xl px-3 py-1.5 shadow-sm">
              <Filter size={16} className="text-gray-400" />
              <select
                value={selectedAngkatan}
                onChange={(e) => setSelectedAngkatan(e.target.value)}
                className="text-sm bg-transparent outline-none border-none text-gray-700 cursor-pointer pr-2"
              >
                <option value="">Semua Angkatan</option>
                {daftarAngkatan.map((thn) => (
                  <option key={thn} value={thn}>
                    Angkatan 20{thn}
                  </option>
                ))}
              </select>
            </div>

            {/* SWITCH TARGET MODEL */}
            <div className="flex bg-white border rounded-2xl p-1 shadow-sm">
              <button
                onClick={() => setTargetModel("alumni")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                  !isSemester ? "bg-black text-white" : "text-gray-500"
                }`}
              >
                <GraduationCap size={16} />
                Alumni
              </button>

              <button
                onClick={() => setTargetModel("semester")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                  isSemester ? "bg-blue-600 text-white" : "text-gray-500"
                }`}
              >
                <CalendarDays size={16} />
                Semester
              </button>
            </div>

            {/* BUTTON ADD INPUT */}
            <Link
              href="/input-mahasiswa"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm flex gap-2 items-center transition-colors shadow-sm"
            >
              <Plus size={16} />
              Input
            </Link>
          </div>
        </div>

        {/* METRIC CARDS */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-800 text-white p-5 rounded-2xl shadow-sm">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Terfilter</p>
            <h2 className="text-3xl font-bold mt-1">{loading ? "..." : total}</h2>
          </div>

          <div className="bg-red-500 text-white p-5 rounded-2xl shadow-sm">
            <p className="text-xs text-red-100 uppercase tracking-wider font-semibold">Status Berisiko</p>
            <h2 className="text-3xl font-bold mt-1">{loading ? "..." : risiko}</h2>
          </div>

          <div className="bg-green-500 text-white p-5 rounded-2xl shadow-sm">
            <p className="text-xs text-green-100 uppercase tracking-wider font-semibold">Status Aman</p>
            <h2 className="text-3xl font-bold mt-1">{loading ? "..." : aman}</h2>
          </div>
        </div>

        {/* TABLE LOG DATA */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="p-4 text-left">NRP</th>
                <th className="text-left">Nama</th>
                <th className="text-left">Status Risiko</th>
                <th className="text-left">Probabilitas</th>
                <th className="p-4 text-center">Aksi Manajemen Data</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400 font-medium">
                    <div className="flex justify-center items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400 font-medium">
                    Tidak ada log data mahasiswa untuk kriteria ini.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => {
                  const prob = Math.round(item.probabilitas * 100);
                  const isRisk = prob < 50;

                  return (
                    <tr key={item.nrp} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-4 text-blue-600 font-bold tracking-wide">
                        {item.nrp}
                      </td>

                      <td className="font-medium">{item.nama}</td>

                      <td>
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-bold inline-block ${
                            isRisk
                              ? "bg-red-50 text-red-600 border border-red-100"
                              : "bg-green-50 text-green-600 border border-green-100"
                          }`}
                        >
                          {isRisk ? "RISIKO TINGGI" : "AMAN"}
                        </span>
                      </td>

                      <td className="font-semibold">{prob}%</td>

                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* ✅ LINK DETAIL - SUDAH BENAR DENGAN QUERY PARAM target */}
                          <Link
                            href={`/hasil-prediksi/${item.nrp}?target=${isSemester ? "semester" : "kelulusan"}`}
                            className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                          >
                            Lihat Detail
                          </Link>

                          {/* TOMBOL UPDATE */}
                          <button
                            onClick={() => handleOpenUpdate(item)}
                            className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-600 p-2 rounded-xl transition-colors"
                            title="Edit Data"
                          >
                            <Pencil size={14} />
                          </button>

                          {/* TOMBOL DELETE */}
                          <button
                            onClick={() => handleExecuteDelete(item.nrp)}
                            className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 p-2 rounded-xl transition-colors"
                            title="Hapus Data"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL WINDOW DIALOG UPDATE MAHASISWA */}
      {isUpdateModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl border shadow-xl overflow-hidden p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-3 sticky top-0 bg-white">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Update Data Mahasiswa - {isSemester ? "Semester" : "Kelulusan"}
                </h3>
                <p className="text-xs text-gray-500">
                  NRP: <span className="font-mono text-blue-600 font-bold">{editingItem.nrp}</span>
                </p>
              </div>
              <button 
                onClick={() => { setIsUpdateModalOpen(false); setEditingItem(null); }}
                className="text-gray-400 hover:text-gray-600 p-1 bg-gray-50 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleExecuteUpdate} className="space-y-4">
              {isSemester ? (
                // FORM UPDATE SEMESTER
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Nama</label>
                      <input 
                        type="text" 
                        required
                        value={formDataSemester.nama || ""}
                        onChange={(e) => setFormDataSemester({...formDataSemester, nama: e.target.value})}
                        className="w-full border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Semester Ke</label>
                      <input 
                        type="number" 
                        required
                        min="1"
                        max="14"
                        value={formDataSemester.semester_ke || ""}
                        onChange={(e) => setFormDataSemester({...formDataSemester, semester_ke: parseInt(e.target.value)})}
                        className="w-full border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">IPS</label>
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        value={formDataSemester.ips || ""}
                        onChange={(e) => setFormDataSemester({...formDataSemester, ips: parseFloat(e.target.value)})}
                        className="w-full border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">IPS Diff</label>
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        value={formDataSemester.ips_diff || ""}
                        onChange={(e) => setFormDataSemester({...formDataSemester, ips_diff: parseFloat(e.target.value)})}
                        className="w-full border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Presensi (%)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        value={formDataSemester.presensi || ""}
                        onChange={(e) => setFormDataSemester({...formDataSemester, presensi: parseFloat(e.target.value)})}
                        className="w-full border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Nilai Teori</label>
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        value={formDataSemester.teori || ""}
                        onChange={(e) => setFormDataSemester({...formDataSemester, teori: parseFloat(e.target.value)})}
                        className="w-full border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Nilai Praktek</label>
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        value={formDataSemester.prak || ""}
                        onChange={(e) => setFormDataSemester({...formDataSemester, prak: parseFloat(e.target.value)})}
                        className="w-full border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">SKS Target</label>
                      <input 
                        type="number" 
                        required
                        value={formDataSemester.sks_target || ""}
                        onChange={(e) => setFormDataSemester({...formDataSemester, sks_target: parseInt(e.target.value)})}
                        className="w-full border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Delay Tugas</label>
                      <input 
                        type="number" 
                        required
                        value={formDataSemester.delay_tugas || ""}
                        onChange={(e) => setFormDataSemester({...formDataSemester, delay_tugas: parseInt(e.target.value)})}
                        className="w-full border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Total SKS Hutang</label>
                      <input 
                        type="number" 
                        required
                        value={formDataSemester.total_sks_hutang || ""}
                        onChange={(e) => setFormDataSemester({...formDataSemester, total_sks_hutang: parseInt(e.target.value)})}
                        className="w-full border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Ekonomi Level</label>
                      <select
                        value={formDataSemester.ekonomi_level || 1}
                        onChange={(e) => setFormDataSemester({...formDataSemester, ekonomi_level: parseInt(e.target.value)})}
                        className="w-full border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      >
                        <option value="1">1 - Rendah</option>
                        <option value="2">2 - Menengah</option>
                        <option value="3">3 - Tinggi</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Skor Masuk</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={formDataSemester.skor_masuk || ""}
                      onChange={(e) => setFormDataSemester({...formDataSemester, skor_masuk: parseFloat(e.target.value)})}
                      className="w-full border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </>
              ) : (
                // FORM UPDATE KELULUSAN
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Nama</label>
                      <input 
                        type="text" 
                        required
                        value={formDataKelulusan.nama || ""}
                        onChange={(e) => setFormDataKelulusan({...formDataKelulusan, nama: e.target.value})}
                        className="w-full border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Angkatan</label>
                      <input 
                        type="number" 
                        required
                        value={formDataKelulusan.angkatan || ""}
                        onChange={(e) => setFormDataKelulusan({...formDataKelulusan, angkatan: parseInt(e.target.value)})}
                        className="w-full border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Label Prog</label>
                      <input 
                        type="number" 
                        required
                        value={formDataKelulusan.label_prog || ""}
                        onChange={(e) => setFormDataKelulusan({...formDataKelulusan, label_prog: parseInt(e.target.value)})}
                        className="w-full border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Gender (1=L, 2=P)</label>
                      <input 
                        type="number" 
                        required
                        min="1"
                        max="2"
                        value={formDataKelulusan.gender_enc || ""}
                        onChange={(e) => setFormDataKelulusan({...formDataKelulusan, gender_enc: parseInt(e.target.value)})}
                        className="w-full border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Jumlah Tepat Waktu</label>
                      <input 
                        type="number" 
                        required
                        value={formDataKelulusan.cnt_tepat_waktu || ""}
                        onChange={(e) => setFormDataKelulusan({...formDataKelulusan, cnt_tepat_waktu: parseInt(e.target.value)})}
                        className="w-full border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">IPS Mean</label>
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        value={formDataKelulusan.ips_mean || ""}
                        onChange={(e) => setFormDataKelulusan({...formDataKelulusan, ips_mean: parseFloat(e.target.value)})}
                        className="w-full border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">SKS Mean</label>
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        value={formDataKelulusan.sks_mean || ""}
                        onChange={(e) => setFormDataKelulusan({...formDataKelulusan, sks_mean: parseFloat(e.target.value)})}
                        className="w-full border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">IPK Mean</label>
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        value={formDataKelulusan.ipk_mean || ""}
                        onChange={(e) => setFormDataKelulusan({...formDataKelulusan, ipk_mean: parseFloat(e.target.value)})}
                        className="w-full border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Absen Mean</label>
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        value={formDataKelulusan.absen_mean || ""}
                        onChange={(e) => setFormDataKelulusan({...formDataKelulusan, absen_mean: parseFloat(e.target.value)})}
                        className="w-full border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Teori Mean</label>
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        value={formDataKelulusan.teori_mean || ""}
                        onChange={(e) => setFormDataKelulusan({...formDataKelulusan, teori_mean: parseFloat(e.target.value)})}
                        className="w-full border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Prak Mean</label>
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        value={formDataKelulusan.prak_mean || ""}
                        onChange={(e) => setFormDataKelulusan({...formDataKelulusan, prak_mean: parseFloat(e.target.value)})}
                        className="w-full border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Modal Footer Actions */}
              <div className="flex gap-3 justify-end pt-3 border-t sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => { setIsUpdateModalOpen(false); setEditingItem(null); }}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
                  disabled={isLoadingUpdate}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoadingUpdate}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoadingUpdate ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Perubahan'
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}