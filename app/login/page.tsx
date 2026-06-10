"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const BASE_URL = "http://127.0.0.1:8000";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.detail || "Login gagal");
        return;
      }

      localStorage.setItem(
        "token",
        result.access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(result.user)
      );

      alert("Login berhasil");

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-blue-600">
            Login Sistem
          </h1>

          <p className="mt-2 text-zinc-600">
            Prediksi Kelulusan Mahasiswa
            <span className="font-semibold text-zinc-800">
              {" "}PENS
            </span>
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Username
            </label>

            <input
              type="text"
              required
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              className="w-full p-3 border rounded-lg"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full p-3 border rounded-lg"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
          >
            {loading ? "Loading..." : "Masuk"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-600">
          <p>Belum punya akun?</p>

          <Link
            href="/register"
            className="font-semibold text-blue-600 hover:underline"
          >
            Daftar Akun Baru
          </Link>
        </div>
      </div>
    </div>
  );
}