// ==============================
// TYPE: RESULT DARI BACKEND
// ==============================
export interface ResultItem {
  nrp: string;
  nama: string;
  kategori: string;
  probabilitas: number;
  created_at: string;
}

// ==============================
// BASE URL
// ==============================
const BASE_URL = "http://127.0.0.1:8000";

// ==============================
// GET LIST
// ==============================
export async function getResultsKelulusan(): Promise<ResultItem[]> {
  const res = await fetch(`${BASE_URL}/results/kelulusan`);
  if (!res.ok) throw new Error("Gagal ambil data kelulusan");
  return res.json();
}

export async function getResultsSemester(): Promise<ResultItem[]> {
  const res = await fetch(`${BASE_URL}/results/semester`);
  if (!res.ok) throw new Error("Gagal ambil data semester");
  return res.json();
}

// ==============================
// GET DETAIL BY NRP (FIX TOTAL)
// ==============================
export async function getResultByNRP(
  nrp: string,
  type: "kelulusan" | "semester"
): Promise<ResultItem | null> {
  const res = await fetch(`${BASE_URL}/results/${type}/${nrp}`);

  if (!res.ok) return null;

  return res.json();
}