// ==============================
// TYPE INTERFACE
// ==============================
export interface ResultItem {
  nrp: string;
  nama: string;
  prediksi: number;        // ← Tambahkan ini
  kategori: string;
  probabilitas: number;
  xai_json?: string;       // ← Tambahkan ini
  created_at: string;
}

export interface MahasiswaKelulusan {
  nrp: string;
  nama: string;
  angkatan: number;
  label_prog: number;
  gender_enc: number;
  ips_mean: number;
  sks_mean: number;
  ipk_mean: number;
  absen_mean: number;
  teori_mean: number;
  prak_mean: number;
  cnt_tepat_waktu: number;
}

export interface MahasiswaSemester {
  nrp: string;
  nama: string;
  semester_ke: number;
  label_prog: number;
  ips: number;
  ips_diff: number;
  presensi: number;
  teori: number;
  prak: number;
  sks_target: number;
  delay_tugas: number;
  total_sks_hutang: number;
  ekonomi_level: number;
  skor_masuk: number;
}

// Interface untuk Detail Response (dari backend)
export interface DetailResultItem {
  nrp: string;
  nama: string;
  prediksi: number;
  kategori: string;
  probabilitas: number;
  xai_json?: string;
  created_at: string;
}

// ==============================
// BASE URL CONFIGURATION
// ==============================
const BASE_URL = "http://127.0.0.1:8000";

// ==============================
// GET LIST KELULUSAN ALUMNI
// ==============================
export async function getResultsKelulusan(): Promise<ResultItem[]> {
  const res = await fetch(`${BASE_URL}/results/kelulusan`);

  if (!res.ok) {
    throw new Error("Gagal ambil data kelulusan");
  }

  return await res.json();
}

// ==============================
// GET LIST SEMESTER ACTIVE
// ==============================
export async function getResultsSemester(): Promise<ResultItem[]> {
  const res = await fetch(`${BASE_URL}/results/semester`);

  if (!res.ok) {
    throw new Error("Gagal ambil data semester");
  }

  return await res.json();
}

// ==============================
// GET DETAIL BY NRP (FIXED)
// ==============================
export async function getResultByNRP(
  nrp: string,
  type: "kelulusan" | "semester"
): Promise<DetailResultItem | null> {
  if (!nrp) {
    console.warn("NRP kosong dikirim ke API");
    return null;
  }

  try {
    console.log(`🔍 Fetching: ${BASE_URL}/results/${type}/${nrp}`);
    
    const res = await fetch(`${BASE_URL}/results/${type}/${nrp}`);

    if (res.status === 404) {
      console.warn(`⚠️ Data tidak ditemukan untuk NRP: ${nrp}`);
      return null;
    }

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log("📦 Data dari API:", data);
    return data;
  } catch (error) {
    console.error("❌ Error fetching detail:", error);
    return null;
  }
}

// ==============================
// UPDATE DATA MAHASISWA KELULUSAN
// ==============================
export async function updateMahasiswaKelulusan(
  nrp: string | number,
  data: Omit<MahasiswaKelulusan, 'nrp'>
) {
  try {
    const res = await fetch(`${BASE_URL}/mahasiswa/kelulusan/${nrp}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Gagal memperbarui data kelulusan");
    }

    return await res.json();
  } catch (error) {
    console.error("Error pada updateMahasiswaKelulusan API:", error);
    throw error;
  }
}

// ==============================
// UPDATE DATA MAHASISWA SEMESTER
// ==============================
export async function updateMahasiswaSemester(
  nrp: string | number,
  data: Omit<MahasiswaSemester, 'nrp'>
) {
  try {
    const res = await fetch(`${BASE_URL}/mahasiswa/semester/${nrp}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Gagal memperbarui data semester");
    }

    return await res.json();
  } catch (error) {
    console.error("Error pada updateMahasiswaSemester API:", error);
    throw error;
  }
}

// ==============================
// DELETE DATA MAHASISWA KELULUSAN
// ==============================
export async function deleteMahasiswaKelulusan(nrp: string | number) {
  try {
    const res = await fetch(`${BASE_URL}/mahasiswa/kelulusan/${nrp}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Gagal menghapus data kelulusan");
    }

    return await res.json();
  } catch (error) {
    console.error("Error pada deleteMahasiswaKelulusan API:", error);
    throw error;
  }
}

// ==============================
// DELETE DATA MAHASISWA SEMESTER
// ==============================
export async function deleteMahasiswaSemester(nrp: string | number) {
  try {
    const res = await fetch(`${BASE_URL}/mahasiswa/semester/${nrp}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Gagal menghapus data semester");
    }

    return await res.json();
  } catch (error) {
    console.error("Error pada deleteMahasiswaSemester API:", error);
    throw error;
  }
}

// ==============================
// GET ALL MAHASISWA KELULUSAN
// ==============================
export async function getAllMahasiswaKelulusan(): Promise<MahasiswaKelulusan[]> {
  const res = await fetch(`${BASE_URL}/mahasiswa/kelulusan`);

  if (!res.ok) {
    throw new Error("Gagal ambil data mahasiswa kelulusan");
  }

  return await res.json();
}

// ==============================
// GET ALL MAHASISWA SEMESTER
// ==============================
export async function getAllMahasiswaSemester(): Promise<MahasiswaSemester[]> {
  const res = await fetch(`${BASE_URL}/mahasiswa/semester`);

  if (!res.ok) {
    throw new Error("Gagal ambil data mahasiswa semester");
  }

  return await res.json();
}

// ==============================
// GET MAHASISWA KELULUSAN BY NRP
// ==============================
export async function getMahasiswaKelulusanByNRP(nrp: string): Promise<MahasiswaKelulusan | null> {
  try {
    const res = await fetch(`${BASE_URL}/mahasiswa/kelulusan/${nrp}`);

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// ==============================
// GET MAHASISWA SEMESTER BY NRP
// ==============================
export async function getMahasiswaSemesterByNRP(nrp: string): Promise<MahasiswaSemester | null> {
  try {
    const res = await fetch(`${BASE_URL}/mahasiswa/semester/${nrp}`);

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}