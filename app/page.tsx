import { redirect } from "next/navigation";

export default function Home() {
  // Langsung arahkan ke halaman dashboard
  redirect("/dashboard");
  
  // Baris ini tidak akan pernah dieksekusi, tapi perlu ada agar tidak error
  return null;
}