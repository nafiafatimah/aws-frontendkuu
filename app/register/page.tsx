"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BASE_URL = "http://127.0.0.1:8000";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Registrasi gagal");
      }

      alert("Registrasi berhasil!");
      router.push("/login");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-zinc-200">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-blue-600">
            Daftar Akun
          </h1>
          <p className="mt-2 text-zinc-600">
            Lengkapi data untuk menggunakan sistem
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-zinc-800 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-zinc-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900"
              placeholder="nafia"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-800 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-zinc-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900"
              placeholder="nafia@student.pens.ac.id"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-800 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-zinc-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-600">
          <p>Sudah punya akun?</p>
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:underline inline-block mt-1"
          >
            Login di sini
          </Link>
        </div>
      </div>
    </div>
  );
}