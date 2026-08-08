"use client";

import { useState } from "react";

type Panel = "emergency" | "logistics" | "donors" | "alert" | null;

const bloodInventory = [
  { group: "A+", available: 42, expiring: 2, status: "Healthy" },
  { group: "A-", available: 18, expiring: 1, status: "Watch" },
  { group: "B+", available: 36, expiring: 3, status: "Healthy" },
  { group: "B-", available: 8, expiring: 6, status: "Critical" },
  { group: "AB+", available: 21, expiring: 1, status: "Healthy" },
  { group: "AB-", available: 7, expiring: 2, status: "Watch" },
  { group: "O+", available: 71, expiring: 5, status: "Healthy" },
  { group: "O-", available: 4, expiring: 3, status: "Critical" },
];

export default function HospitalPage() {
  const [panel, setPanel] = useState<Panel>(null);
  const [bMinus, setBMinus] = useState(8);
  const [emergencySent, setEmergencySent] = useState(false);

  const totalUnits = bloodInventory.reduce(
    (sum, item) =>
      sum + (item.group === "B-" ? bMinus : item.available),
    0
  );

  const expiring = bloodInventory.reduce(
    (sum, item) => sum + item.expiring,
    0
  );

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <div>
            <h1 className="text-xl font-bold text-red-600">
              SANJEEVANI
            </h1>
            <p className="text-xs text-slate-500">
              Hospital / Blood Bank Portal
            </p>
          </div>

          <div className="text-right">
            <p className="font-semibold text-sm">
              City Care Hospital
            </p>
            <p className="text-xs text-slate-500">
              Authorized Organization
            </p>
          </div>

        </div>
      </header>


      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="mb-8">
          <p className="text-sm text-slate-500">
            Good morning
          </p>

          <h2 className="text-3xl font-bold mt-1">
            Blood Supply Overview
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Monitor inventory, emergencies and network alerts.
          </p>
        </div>


        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          <Stat
            title="Total Units"
            value={totalUnits}
            text="Current inventory"
          />

          <Stat
            title="Expiring Soon"
            value={expiring}
            text="Needs attention"
            danger
          />

          <Stat
            title="High Alert"
            value="2"
            text="Blood groups"
            danger
          />

          <Stat
            title="Emergency"
            value="1"
            text="Active request"
            danger
          />

        </div>


        {/* INVENTORY + AI */}
        <div className="grid lg:grid-cols-5 gap-6">

          {/* INVENTORY */}
          <section className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl overflow-hidden">

            <div className="p-5 border-b">
              <h3 className="font-semibold">
                Blood Storage
              </h3>

              <p className="text-sm text-slate-500">
                Current inventory
              </p>
            </div>

            <table className="w-full text-sm">

              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-4">
                    Blood
                  </th>

                  <th className="text-left p-4">
                    Available
                  </th>

                  <th className="text-left p-4">
                    Expiring
                  </th>

                  <th className="text-left p-4">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>

                {bloodInventory.map((item) => {

                  const available =
                    item.group === "B-"
                      ? bMinus
                      : item.available;

                  return (
                    <tr
                      key={item.group}
                      className="border-t"
                    >

                      <td className="p-4 font-semibold">
                        {item.group}
                      </td>

                      <td className="p-4">
                        {available}
                      </td>

                      <td className="p-4">
                        {item.expiring}
                      </td>

                      <td className="p-4">

                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            item.status === "Critical"
                              ? "bg-red-100 text-red-700"
                              : item.status === "Watch"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {item.status}
                        </span>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </section>


          {/* AI */}
          <section className="lg:col-span-2 bg-white border border-red-200 rounded-2xl overflow-hidden">

            <div className="bg-red-50 p-5 border-b border-red-100">

              <p className="font-bold">
                ✦ SANJEEVANI AI
              </p>

              <p className="text-xs text-red-600">
                Priority recommendation
              </p>

            </div>

            <div className="p-5">

              <div className="flex justify-between">

                <div>
                  <p className="text-xs text-slate-500">
                    Blood Group
                  </p>

                  <p className="text-4xl font-bold text-red-600">
                    B−
                  </p>
                </div>

                <span className="h-fit bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
                  HIGH
                </span>

              </div>

              <div className="bg-slate-50 rounded-xl p-4 mt-5">

                <p className="font-semibold text-sm">
                  Near-expiry inventory
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  6 B− units are approaching expiry.
                </p>

              </div>

              <div className="bg-slate-50 rounded-xl p-4 mt-4">

                <p className="font-semibold text-sm">
                  Network demand
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Another hospital requires 6 B− units.
                </p>

              </div>

              <p className="text-sm text-slate-600 mt-4 leading-6">
                AI recommends coordinating 6 B− units
                before they expire.
              </p>

              <button
                onClick={() => setPanel("alert")}
                className="w-full mt-5 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700"
              >
                Review Recommendation
              </button>

            </div>

          </section>

        </div>


        {/* QUICK ACTIONS */}
        <section className="mt-8">

          <h3 className="font-semibold mb-4">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            <Action
              icon="🚨"
              title="Emergency"
              description="Request blood"
              onClick={() => setPanel("emergency")}
            />

            <Action
              icon="🚚"
              title="Logistics"
              description="View transfers"
              onClick={() => setPanel("logistics")}
            />

            <Action
              icon="❤️"
              title="Donor Booking"
              description="Today's appointments"
              onClick={() => setPanel("donors")}
            />

            <Action
              icon="🔴"
              title="High Alert"
              description="Critical supply"
              onClick={() => setPanel("alert")}
            />

          </div>

        </section>

      </div>


      {/* MODAL */}
      {panel && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-3xl w-full max-w-lg">

            {/* MODAL HEADER */}
            <div className="p-6 border-b flex justify-between">

              <div>

                <h3 className="text-xl font-bold">

                  {panel === "emergency" &&
                    "🚨 Emergency Blood Request"}

                  {panel === "logistics" &&
                    "🚚 Logistics"}

                  {panel === "donors" &&
                    "❤️ Donor Bookings"}

                  {panel === "alert" &&
                    "🔴 High Alert"}

                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  SANJEEVANI network coordination
                </p>

              </div>

              <button
                onClick={() => {
                  setPanel(null);
                  setEmergencySent(false);
                }}
                className="w-9 h-9 rounded-full bg-slate-100"
              >
                ✕
              </button>

            </div>


            {/* EMERGENCY */}
            {panel === "emergency" && (

              <div className="p-6 space-y-5">

                <div>

                  <label className="text-sm font-medium">
                    Blood Group
                  </label>

                  <select className="mt-2 w-full border rounded-xl p-3">

                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                    <option>O+</option>
                    <option>O-</option>

                  </select>

                </div>

                <div>

                  <label className="text-sm font-medium">
                    Required Units
                  </label>

                  <input
                    type="number"
                    min="1"
                    defaultValue="1"
                    className="mt-2 w-full border rounded-xl p-3"
                  />

                </div>

                <div>

                  <label className="text-sm font-medium">
                    Priority
                  </label>

                  <select className="mt-2 w-full border rounded-xl p-3">

                    <option>Emergency</option>
                    <option>Urgent</option>
                    <option>Normal</option>

                  </select>

                </div>

                <button
                  onClick={() => setEmergencySent(true)}
                  className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold"
                >
                  Find Compatible Blood
                </button>

                {emergencySent && (

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">

                    <p className="font-semibold text-green-800">
                      ✓ Emergency request created
                    </p>

                    <p className="text-sm text-green-700 mt-1">
                      SANJEEVANI is searching connected
                      hospitals for compatible inventory.
                    </p>

                  </div>

                )}

              </div>

            )}


            {/* LOGISTICS */}
            {panel === "logistics" && (

              <div className="p-6 space-y-4">

                <Transfer
                  blood="B−"
                  units="6 units"
                  from="City Care Hospital"
                  to="Metro Hospital"
                  status="AI Recommended"
                />

                <Transfer
                  blood="O+"
                  units="4 units"
                  from="Apollo Blood Bank"
                  to="City Care Hospital"
                  status="In Transit"
                />

                <Transfer
                  blood="A+"
                  units="3 units"
                  from="Central Hospital"
                  to="Metro Hospital"
                  status="Delivered"
                />

              </div>

            )}


            {/* DONORS */}
            {panel === "donors" && (

              <div className="p-6 space-y-4">

                <Appointment
                  name="Rahul Sharma"
                  blood="B+"
                  time="10:30 AM"
                  type="Hospital Donation"
                />

                <Appointment
                  name="Ananya Das"
                  blood="O+"
                  time="12:00 PM"
                  type="Hospital Donation"
                />

                <Appointment
                  name="Amit Roy"
                  blood="A−"
                  time="2:30 PM"
                  type="Home Collection"
                />

              </div>

            )}


            {/* HIGH ALERT */}
            {panel === "alert" && (

              <div className="p-6">

                <div className="bg-red-50 border border-red-200 rounded-2xl p-5">

                  <div className="flex justify-between">

                    <div>

                      <p className="text-xs text-slate-500">
                        Critical Blood Group
                      </p>

                      <p className="text-4xl font-bold text-red-600">
                        B−
                      </p>

                    </div>

                    <span className="h-fit bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      CRITICAL
                    </span>

                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-5">

                    <div className="bg-white rounded-xl p-4">

                      <p className="text-xs text-slate-500">
                        Available
                      </p>

                      <p className="text-xl font-bold">
                        {bMinus} units
                      </p>

                    </div>

                    <div className="bg-white rounded-xl p-4">

                      <p className="text-xs text-slate-500">
                        Expiring
                      </p>

                      <p className="text-xl font-bold text-red-600">
                        6 units
                      </p>

                    </div>

                  </div>

                  <p className="text-sm text-slate-600 mt-5 leading-6">
                    Another hospital requires 6 B− units.
                    SANJEEVANI recommends transferring the
                    near-expiry stock first.
                  </p>

                  <button
                    onClick={() => {
                      setBMinus((value) =>
                        Math.max(0, value - 6)
                      );

                      setPanel(null);

                      alert(
                        "Transfer approved. 6 B− units allocated."
                      );
                    }}
                    className="w-full mt-5 bg-red-600 text-white py-3 rounded-xl font-semibold"
                  >
                    Approve 6-Unit Transfer
                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      )}

    </main>
  );
}


/* =========================================================
   STAT
========================================================= */

function Stat({
  title,
  value,
  text,
  danger = false,
}: {
  title: string;
  value: string | number;
  text: string;
  danger?: boolean;
}) {
  return (
    <div
      className={`bg-white border rounded-2xl p-5 ${
        danger
          ? "border-red-200"
          : "border-slate-200"
      }`}
    >

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p
        className={`text-3xl font-bold mt-2 ${
          danger
            ? "text-red-600"
            : "text-slate-900"
        }`}
      >
        {value}
      </p>

      <p className="text-xs text-slate-400 mt-1">
        {text}
      </p>

    </div>
  );
}


/* =========================================================
   ACTION
========================================================= */

function Action({
  icon,
  title,
  description,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-red-300 hover:shadow-md transition-all"
    >

      <div className="text-xl">
        {icon}
      </div>

      <p className="font-semibold mt-3">
        {title}
      </p>

      <p className="text-xs text-slate-500 mt-1">
        {description}
      </p>

      <p className="text-xs font-semibold text-red-600 mt-4">
        Open →
      </p>

    </button>
  );
}


/* =========================================================
   TRANSFER
========================================================= */

function Transfer({
  blood,
  units,
  from,
  to,
  status,
}: {
  blood: string;
  units: string;
  from: string;
  to: string;
  status: string;
}) {
  return (
    <div className="border rounded-2xl p-4">

      <div className="flex justify-between">

        <div>

          <span className="font-bold text-red-600">
            {blood}
          </span>

          <span className="ml-2 text-sm text-slate-600">
            {units}
          </span>

        </div>

        <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
          {status}
        </span>

      </div>

      <p className="text-xs text-slate-500 mt-3">
        {from} → {to}
      </p>

    </div>
  );
}


/* =========================================================
   APPOINTMENT
========================================================= */

function Appointment({
  name,
  blood,
  time,
  type,
}: {
  name: string;
  blood: string;
  time: string;
  type: string;
}) {
  return (
    <div className="border rounded-2xl p-4 flex justify-between items-center">

      <div>

        <p className="font-semibold">
          {name}
        </p>

        <p className="text-xs text-slate-500 mt-1">
          {type} • {time}
        </p>

      </div>

      <span className="bg-red-50 text-red-600 font-bold px-3 py-1 rounded-lg">
        {blood}
      </span>

    </div>
  );
}