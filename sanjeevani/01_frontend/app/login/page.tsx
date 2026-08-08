"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type") || "hospital";
  const isHospital = type === "hospital";

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Demo login — no real authentication yet
    if (isHospital) {
      router.push("/hospital");
    } else {
      router.push("/donor");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        {/* Back */}
        <button
          onClick={() => router.push("/")}
          className="mb-6 text-sm text-slate-500 hover:text-slate-900"
        >
          ← Back
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">

          {/* Logo */}
          <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center text-xl font-bold mb-6">
            S
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-slate-900">
            {isHospital
              ? "Hospital / Blood Bank"
              : "Donor"}{" "}
            Login
          </h1>

          <p className="text-sm text-slate-500 mt-2 mb-8">
            {isHospital
              ? "Access your SANJEEVANI blood supply dashboard."
              : "Access your SANJEEVANI donor account."}
          </p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                type="email"
                required
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>

              <input
                type="password"
                required
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Login
            </button>

          </form>

          <p className="text-xs text-slate-400 text-center mt-6">
            Hackathon demo environment
          </p>

        </div>
      </div>
    </main>
  );
}