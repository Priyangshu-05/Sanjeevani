"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-4xl">

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-600 text-white text-3xl font-bold mb-5">
            S
          </div>

          <h1 className="text-5xl font-bold text-slate-900">
            SANJEEVANI
          </h1>

          <p className="mt-3 text-lg text-slate-500">
            AI-Powered Blood & Plasma Supply Network
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Predict shortages. Prevent wastage. Save lives.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

          <button
            onClick={() => router.push("/login?type=hospital")}
            className="text-left bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-lg hover:border-red-200 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-2xl mb-6">
              🏥
            </div>

            <h2 className="text-xl font-semibold text-slate-900">
              Hospital / Blood Bank
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Manage blood storage, emergency requirements,
              donor bookings and high-alert blood supply.
            </p>

            <div className="mt-6 text-sm font-semibold text-red-600">
              Continue →
            </div>
          </button>

          <button
            onClick={() => router.push("/login?type=donor")}
            className="text-left bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-lg hover:border-red-200 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-2xl mb-6">
              ❤️
            </div>

            <h2 className="text-xl font-semibold text-slate-900">
              Donor
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Book a blood donation at a hospital or request
              an eligible home collection.
            </p>

            <div className="mt-6 text-sm font-semibold text-red-600">
              Continue →
            </div>
          </button>

        </div>

        <p className="text-center text-xs text-slate-400 mt-10">
          SANJEEVANI • Intelligent Blood Supply Coordination
        </p>

      </div>
    </main>
  );
}