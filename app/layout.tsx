import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Pakai font Inter agar lebih modern & clean seperti Figma
import "./globals.css";
import Sidebar from "../components/Sidebar"; // Ambil dari folder components di luar folder app
import Header from "../components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EWS - Ketepatan Waktu Studi | PENS",
  description: "Early Warning System - GraduRisk PENS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full">
      <body className={`${inter.className} bg-zinc-50 h-full antialiased`}>
        <div className="flex min-h-screen">
          {/* Sidebar akan menempel di kiri terus */}
          <Sidebar />

          {/* Area Utama di kanan sidebar */}
          <div className="flex-1 flex flex-col">
            {/* Header akan menempel di atas */}
            <Header />
            
            {/* Tempat halaman dashboard/input/hasil muncul */}
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}