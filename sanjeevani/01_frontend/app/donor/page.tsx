"use client";

import { useState } from "react";

export default function DonorPage() {
  const [booking, setBooking] = useState<
    "hospital" | "home" | null
  >(null);

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200">

        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

          <div>
            <h1 className="text-xl font-bold text-red-600">
              SANJEEVANI
            </h1>

            <p className="text-xs text-slate-500">
              Donor Portal
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            ❤️
          </div>

        </div>

      </header>


      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* WELCOME */}
        <div className="mb-8">

          <p className="text-sm text-slate-500">
            Welcome back
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mt-1">
            Ready to donate?
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Choose how you would like to donate blood.
          </p>

        </div>


        {/* DONOR INFO */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">

          <div className="grid grid-cols-3 gap-4">

            <div>
              <p className="text-xs text-slate-500">
                Blood Group
              </p>

              <p className="text-2xl font-bold text-red-600 mt-1">
                B+
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Donations
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                3
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Last Donation
              </p>

              <p className="text-sm font-semibold text-slate-900 mt-2">
                12 May 2026
              </p>
            </div>

          </div>

        </div>


        {/* BOOKING OPTIONS */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* HOSPITAL */}
          <button
            onClick={() => setBooking("hospital")}
            className="bg-white border border-slate-200 rounded-3xl p-7 text-left hover:border-red-200 hover:shadow-lg transition-all"
          >

            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-xl">
              🏥
            </div>

            <h3 className="text-xl font-semibold text-slate-900 mt-5">
              Donate at Hospital
            </h3>

            <p className="text-sm text-slate-500 mt-2 leading-6">
              Choose a participating hospital and book
              a convenient donation time.
            </p>

            <span className="inline-block mt-6 text-sm font-semibold text-red-600">
              Book Donation →
            </span>

          </button>


          {/* HOME */}
          <button
            onClick={() => setBooking("home")}
            className="bg-white border border-slate-200 rounded-3xl p-7 text-left hover:border-red-200 hover:shadow-lg transition-all"
          >

            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-xl">
              🏠
            </div>

            <h3 className="text-xl font-semibold text-slate-900 mt-5">
              Home Collection
            </h3>

            <p className="text-sm text-slate-500 mt-2 leading-6">
              Request an eligible home collection from
              a participating organization.
            </p>

            <span className="inline-block mt-6 text-sm font-semibold text-red-600">
              Request Collection →
            </span>

          </button>

        </div>


        {/* BOOKING PANEL */}
        {booking && (
          <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6">

            <div className="flex items-center justify-between">

              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {booking === "hospital"
                    ? "Book Hospital Donation"
                    : "Request Home Collection"}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {booking === "hospital"
                    ? "Choose a participating hospital."
                    : "Choose your preferred collection details."}
                </p>
              </div>

              <button
                onClick={() => setBooking(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>

            </div>


            {booking === "hospital" ? (
              <div className="mt-6 space-y-4">

                <label className="block">

                  <span className="text-sm font-medium text-slate-700">
                    Hospital
                  </span>

                  <select className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 bg-white">
                    <option>
                      City Care Hospital — 3.2 km
                    </option>

                    <option>
                      Apollo Hospital — 5.1 km
                    </option>
                  </select>

                </label>


                <div className="grid md:grid-cols-2 gap-4">

                  <label className="block">

                    <span className="text-sm font-medium text-slate-700">
                      Date
                    </span>

                    <input
                      type="date"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />

                  </label>


                  <label className="block">

                    <span className="text-sm font-medium text-slate-700">
                      Time
                    </span>

                    <select className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 bg-white">

                      <option>10:00 AM</option>
                      <option>10:30 AM</option>
                      <option>11:00 AM</option>
                      <option>11:30 AM</option>

                    </select>

                  </label>

                </div>


                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl">
                  Confirm Donation Booking
                </button>

              </div>

            ) : (

              <div className="mt-6 space-y-4">

                <label className="block">

                  <span className="text-sm font-medium text-slate-700">
                    Collection Address
                  </span>

                  <textarea
                    rows={3}
                    placeholder="Enter your address"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 resize-none"
                  />

                </label>


                <div className="grid md:grid-cols-2 gap-4">

                  <label className="block">

                    <span className="text-sm font-medium text-slate-700">
                      Preferred Date
                    </span>

                    <input
                      type="date"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />

                  </label>


                  <label className="block">

                    <span className="text-sm font-medium text-slate-700">
                      Preferred Time
                    </span>

                    <select className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 bg-white">

                      <option>10:00 AM – 11:00 AM</option>
                      <option>11:00 AM – 12:00 PM</option>
                      <option>2:00 PM – 3:00 PM</option>

                    </select>

                  </label>

                </div>


                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl">
                  Request Home Collection
                </button>

              </div>

            )}

          </div>
        )}


        {/* CBC INFORMATION */}
        <div className="mt-6 bg-red-50 border border-red-100 rounded-2xl p-5">

          <h3 className="font-semibold text-slate-900">
            🩺 CBC Screening
          </h3>

          <p className="text-sm text-slate-600 mt-2 leading-6">
            Applicable CBC testing charges are paid at the
            time of testing and may be refunded after a
            successful donation according to the participating
            hospital's policy.
          </p>

        </div>

      </div>

    </main>
  );
}