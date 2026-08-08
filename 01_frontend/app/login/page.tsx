"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [type, setType] = useState<
    "hospital" | "donor"
  >("hospital");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "hospital") {
      router.push("/hospital");
    } else {
      router.push("/donor");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">

          <div className="mx-auto w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center text-2xl">
            🩸
          </div>

          <h1 className="text-3xl font-bold mt-4">
            SANJEEVANI
          </h1>

          <p className="text-slate-500 mt-2">
            Blood & Plasma Supply Network
          </p>

        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-7">

          <h2 className="text-xl font-bold mb-5">
            Sign in
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-6">

            <button
              onClick={() => setType("hospital")}
              className={`py-3 rounded-xl border font-semibold ${
                type === "hospital"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-slate-200"
              }`}
            >
              🏥 Hospital
            </button>

            <button
              onClick={() => setType("donor")}
              className={`py-3 rounded-xl border font-semibold ${
                type === "donor"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-slate-200"
              }`}
            >
              ❤️ Donor
            </button>

          </div>

          <form onSubmit={login}>

            <label className="block text-sm font-semibold mb-2">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="you@example.com"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 mb-5"
            />

            <label className="block text-sm font-semibold mb-2">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="••••••••"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 mb-6"
            />

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold"
            >
              Continue as{" "}
              {type === "hospital"
                ? "Hospital"
                : "Donor"}
            </button>

          </form>

          <p className="text-xs text-slate-400 text-center mt-5">
            Hackathon MVP • Authentication will be
            connected to Firebase
          </p>

        </div>

      </div>

    </main>
  );
}