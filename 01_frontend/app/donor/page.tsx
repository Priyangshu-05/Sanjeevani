"use client";

import { useState } from "react";

const API_URL = "http://127.0.0.1:8000";

export default function DonorPage() {
  const [type, setType] = useState<
    "hospital" | "home"
  >("hospital");

  const [bloodGroup, setBloodGroup] = useState("B+");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [message, setMessage] = useState("");

  const bookDonation = async () => {
    if (!date || !time) {
      setMessage("Please select date and time.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/donor-booking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Demo Donor",
            blood_group: bloodGroup,
            date,
            time,
            type:
              type === "hospital"
                ? "Hospital Donation"
                : "Home Collection",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Booking failed");
      }

      setMessage(
        "✓ Donation appointment booked successfully."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "Unable to book appointment. Make sure the backend is running."
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">

      <header className="bg-white border-b">

        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center">
              🩸
            </div>

            <div>
              <h1 className="font-bold text-xl">
                SANJEEVANI
              </h1>

              <p className="text-xs text-slate-500">
                Donor Portal
              </p>
            </div>

          </div>

          <span className="text-sm text-green-600 font-semibold">
            ● Donor Portal
          </span>

        </div>

      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">

        <div className="text-center mb-10">

          <p className="text-red-600 font-semibold text-sm">
            BLOOD DONATION
          </p>

          <h2 className="text-3xl font-bold mt-2">
            Save lives with Sanjeevani
          </h2>

          <p className="text-slate-500 mt-3">
            Book your blood donation or request a home
            collection appointment.
          </p>

        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-7">

          <h3 className="text-xl font-bold mb-5">
            Choose Donation Method
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-8">

            <button
              onClick={() => setType("hospital")}
              className={`p-5 rounded-xl border text-left ${
                type === "hospital"
                  ? "border-red-500 bg-red-50"
                  : "border-slate-200"
              }`}
            >
              <p className="text-2xl mb-2">
                🏥
              </p>

              <p className="font-bold">
                Hospital Donation
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Visit a participating hospital
              </p>
            </button>

            <button
              onClick={() => setType("home")}
              className={`p-5 rounded-xl border text-left ${
                type === "home"
                  ? "border-red-500 bg-red-50"
                  : "border-slate-200"
              }`}
            >
              <p className="text-2xl mb-2">
                🏠
              </p>

              <p className="font-bold">
                Home Collection
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Request authorized home collection
              </p>
            </button>

          </div>

          <label className="block text-sm font-semibold mb-2">
            Blood Group
          </label>

          <select
            value={bloodGroup}
            onChange={(e) =>
              setBloodGroup(e.target.value)
            }
            className="w-full border border-slate-200 rounded-xl px-4 py-3 mb-5"
          >
            {[
              "A+",
              "A-",
              "B+",
              "B-",
              "AB+",
              "AB-",
              "O+",
              "O-",
            ].map((group) => (
              <option key={group}>
                {group}
              </option>
            ))}
          </select>

          <label className="block text-sm font-semibold mb-2">
            Preferred Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            className="w-full border border-slate-200 rounded-xl px-4 py-3 mb-5"
          />

          <label className="block text-sm font-semibold mb-2">
            Preferred Time
          </label>

          <input
            type="time"
            value={time}
            onChange={(e) =>
              setTime(e.target.value)
            }
            className="w-full border border-slate-200 rounded-xl px-4 py-3 mb-6"
          />

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">

            <p className="font-semibold text-amber-800">
              Health screening
            </p>

            <p className="text-sm text-amber-700 mt-1">
              CBC and blood-group testing charges are
              collected according to the participating
              institution's policy and may be refunded
              after successful donation.
            </p>

          </div>

          <button
            onClick={bookDonation}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold"
          >
            Book Donation
          </button>

          {message && (
            <div className="mt-5 bg-slate-50 rounded-xl p-4 text-sm">
              {message}
            </div>
          )}

        </div>

      </div>

    </main>
  );
}