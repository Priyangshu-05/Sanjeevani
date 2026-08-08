"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

type BloodInventory = {
  blood_group: string;
  available: number;
  expiring: number;
};

type BloodUnit = {
  serial_number: string;
  blood_group: string;
  donation_date: string;
  expiry_date: string;
  status: string;
};

type EmergencyRequest = {
  id: number;
  hospital: string;
  blood_group: string;
  units: number;
  priority: string;
  status: string;
};

type DonorAppointment = {
  name: string;
  blood_group: string;
  time: string;
  type: string;
  date?: string;
};

type AIRecommendation = {
  priority: string;
  blood_group: string;
  recommended_units: number;
  reason: string;
  recommended_action: string;
  confidence: string;
};

export default function HospitalPage() {

  // =====================================================
  // DATA
  // =====================================================

  const [inventory, setInventory] = useState<BloodInventory[]>([]);
  const [bloodUnits, setBloodUnits] = useState<BloodUnit[]>([]);
  const [emergencies, setEmergencies] = useState<EmergencyRequest[]>([]);
  const [appointments, setAppointments] = useState<DonorAppointment[]>([]);
  const [recommendation, setRecommendation] =
    useState<AIRecommendation | null>(null);

  // =====================================================
  // UI
  // =====================================================

  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // BLOOD UNIT FORM
  // =====================================================

  const [serialNumber, setSerialNumber] = useState("");
  const [bloodGroup, setBloodGroup] = useState("B-");
  const [donationDate, setDonationDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [registering, setRegistering] = useState(false);

  // =====================================================
  // EMERGENCY FORM
  // =====================================================

  const [emergencyBlood, setEmergencyBlood] = useState("B-");
  const [emergencyUnits, setEmergencyUnits] = useState(1);

  // =====================================================
  // MODAL
  // =====================================================

  const [activeModal, setActiveModal] = useState<
    "emergency"
    | "logistics"
    | "donors"
    | "alert"
    | null
  >(null);

  // =====================================================
  // LOAD ALL DATA
  // =====================================================

  const loadData = async () => {

    try {

      setError("");

      const [
        inventoryResponse,
        unitsResponse,
        emergencyResponse,
        donorResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/inventory`),
        fetch(`${API_URL}/blood-units`),
        fetch(`${API_URL}/emergency`),
        fetch(`${API_URL}/donors`),
      ]);

      if (!inventoryResponse.ok) {
        throw new Error("Inventory API failed");
      }

      if (!unitsResponse.ok) {
        throw new Error("Blood units API failed");
      }

      const inventoryData =
        await inventoryResponse.json();

      const unitsData =
        await unitsResponse.json();

      const emergencyData =
        await emergencyResponse.json();

      const donorData =
        await donorResponse.json();

      setInventory(
        inventoryData.inventory || []
      );

      setBloodUnits(
        unitsData.units || []
      );

      setEmergencies(
        emergencyData.requests || []
      );

      setAppointments(
        donorData.appointments || []
      );

      setLoading(false);

    } catch (error) {

      console.error(error);

      setError(
        "Unable to connect to Sanjeevani backend. Make sure FastAPI is running on port 8000."
      );

      setLoading(false);
    }
  };


  // =====================================================
  // AUTO REFRESH
  // =====================================================

  useEffect(() => {

    loadData();

    const interval = setInterval(
      loadData,
      5000
    );

    return () => {
      clearInterval(interval);
    };

  }, []);


  // =====================================================
  // INVENTORY CALCULATIONS
  // =====================================================

  const totalUnits = useMemo(() => {

    return inventory.reduce(
      (sum, item) =>
        sum + item.available,
      0
    );

  }, [inventory]);


  const expiringUnits = useMemo(() => {

    return inventory.reduce(
      (sum, item) =>
        sum + item.expiring,
      0
    );

  }, [inventory]);


  const highAlertUnits = useMemo(() => {

    return inventory.reduce(
      (sum, item) =>
        sum +
        (item.expiring >= 2
          ? item.expiring
          : 0),
      0
    );

  }, [inventory]);


  // =====================================================
  // REGISTER BLOOD UNIT
  // =====================================================

  const registerBloodUnit = async () => {

    if (
      !serialNumber ||
      !bloodGroup ||
      !donationDate ||
      !expiryDate
    ) {

      alert(
        "Please fill all blood unit details."
      );

      return;
    }

    try {

      setRegistering(true);

      const response = await fetch(
        `${API_URL}/blood-unit`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            serial_number:
              serialNumber.trim(),

            blood_group:
              bloodGroup,

            donation_date:
              donationDate,

            expiry_date:
              expiryDate,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
          "Blood unit registration failed"
        );
      }

      alert(
        `Blood unit ${serialNumber} registered successfully.`
      );

      setSerialNumber("");
      setDonationDate("");
      setExpiryDate("");

      await loadData();

    } catch (error) {

      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Could not register blood unit."
      );

    } finally {

      setRegistering(false);
    }
  };


  // =====================================================
  // EMERGENCY REQUEST
  // =====================================================

  const createEmergency = async () => {

    try {

      const response = await fetch(
        `${API_URL}/emergency`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            hospital:
              "City Care Hospital",

            blood_group:
              emergencyBlood,

            units:
              emergencyUnits,

            priority:
              "Emergency",
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Emergency request failed"
        );
      }

      await loadData();

      setActiveModal(null);

      alert(
        `Emergency request created for ${emergencyUnits} unit(s) of ${emergencyBlood}.`
      );

    } catch (error) {

      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Could not create emergency request."
      );
    }
  };


  // =====================================================
  // GEMINI
  // =====================================================

  const getAIRecommendation = async () => {

    try {

      setAiLoading(true);

      const response = await fetch(
        `${API_URL}/ai-recommendation`
      );

      const responseText =
        await response.text();

      console.log(
        "AI backend status:",
        response.status
      );

      console.log(
        "AI backend response:",
        responseText
      );

      if (!response.ok) {

        throw new Error(
          `AI endpoint returned ${response.status}: ${responseText}`
        );
      }

      const data =
        JSON.parse(responseText);

      setRecommendation(
        data.recommendation || null
      );

    } catch (error) {

      console.error(
        "AI recommendation error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "AI recommendation failed."
      );

    } finally {

      setAiLoading(false);
    }
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="text-center">

          <div className="text-4xl mb-4">
            🩸
          </div>

          <h1 className="text-xl font-bold text-slate-900">
            Loading Sanjeevani...
          </h1>

          <p className="text-slate-500 mt-2">
            Connecting to hospital network
          </p>

        </div>

      </main>
    );
  }


  // =====================================================
  // MAIN
  // =====================================================

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <header className="bg-white border-b border-slate-200">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center text-xl">
              🩸
            </div>

            <div>

              <h1 className="text-xl font-bold">
                SANJEEVANI
              </h1>

              <p className="text-xs text-slate-500">
                Blood & Plasma Supply Network
              </p>

            </div>

          </div>


          <div className="flex items-center gap-4">

            <div className="text-right hidden md:block">

              <p className="text-sm font-semibold">
                City Care Hospital
              </p>

              <p className="text-xs text-slate-500">
                Blood Bank / Hospital Portal
              </p>

            </div>

            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              🏥
            </div>

          </div>

        </div>

      </header>


      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <div className="max-w-7xl mx-auto px-6 py-8">


        {/* BACKEND STATUS */}

        <div
          className={`mb-6 px-4 py-3 rounded-xl border text-sm ${
            error
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-green-50 border-green-200 text-green-700"
          }`}
        >

          {error ? (
            <>⚠ {error}</>
          ) : (
            <>
              ● Connected to Sanjeevani backend
              {" • "}
              Live refresh every 5 seconds
            </>
          )}

        </div>


        {/* TITLE */}

        <div className="mb-8">

          <p className="text-sm text-red-600 font-semibold mb-2">
            HOSPITAL / BLOOD BANK DASHBOARD
          </p>

          <h2 className="text-3xl font-bold">
            Blood Supply Overview
          </h2>

          <p className="text-slate-500 mt-2">
            Manage blood units, inventory,
            emergencies and donor activity.
          </p>

        </div>


        {/* ================================================= */}
        {/* STATS */}
        {/* ================================================= */}

        <section className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

          <StatCard
            title="Total Units"
            value={totalUnits}
            icon="🩸"
            color="red"
          />

          <StatCard
            title="Expiring Soon"
            value={expiringUnits}
            icon="⏳"
            color="amber"
          />

          <StatCard
            title="High Alert"
            value={highAlertUnits}
            icon="🚨"
            color="red"
          />

          <StatCard
            title="Emergency Requests"
            value={emergencies.length}
            icon="⚡"
            color="purple"
          />

        </section>


        {/* ================================================= */}
        {/* BLOOD UNIT REGISTRATION */}
        {/* ================================================= */}

        <section className="bg-white border border-slate-200 rounded-2xl p-6 mb-8">

          <div className="mb-6">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center text-xl">
                🩸
              </div>

              <div>

                <h3 className="text-xl font-bold">
                  Blood Bank Unit Registration
                </h3>

                <p className="text-sm text-slate-500">
                  Register each collected blood unit
                  with its unique serial number.
                </p>

              </div>

            </div>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">


            {/* SERIAL */}

            <div>

              <label className="block text-sm font-semibold mb-2">
                Serial Number
              </label>

              <input
                type="text"
                value={serialNumber}
                onChange={(e) =>
                  setSerialNumber(
                    e.target.value
                  )
                }
                placeholder="SN-BNEG-0042"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-red-500"
              />

            </div>


            {/* GROUP */}

            <div>

              <label className="block text-sm font-semibold mb-2">
                Blood Group
              </label>

              <select
                value={bloodGroup}
                onChange={(e) =>
                  setBloodGroup(
                    e.target.value
                  )
                }
                className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white outline-none focus:border-red-500"
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

                  <option
                    key={group}
                    value={group}
                  >
                    {group}
                  </option>

                ))}

              </select>

            </div>


            {/* DONATION DATE */}

            <div>

              <label className="block text-sm font-semibold mb-2">
                Donation Date
              </label>

              <input
                type="date"
                value={donationDate}
                onChange={(e) =>
                  setDonationDate(
                    e.target.value
                  )
                }
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-red-500"
              />

            </div>


            {/* EXPIRY DATE */}

            <div>

              <label className="block text-sm font-semibold mb-2">
                Expiry Date
              </label>

              <input
                type="date"
                value={expiryDate}
                onChange={(e) =>
                  setExpiryDate(
                    e.target.value
                  )
                }
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-red-500"
              />

            </div>

          </div>


          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-5">

            <p className="text-xs text-slate-500">
              Each unit receives a unique serial number.
              Registration automatically updates inventory.
            </p>

            <button
              onClick={registerBloodUnit}
              disabled={registering}
              className="bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white px-6 py-3 rounded-xl font-bold"
            >

              {registering
                ? "Registering..."
                : "Register Blood Unit"}

            </button>

          </div>

        </section>


        {/* ================================================= */}
        {/* QUICK ACTIONS */}
        {/* ================================================= */}

        <section className="mb-8">

          <h3 className="text-lg font-bold mb-4">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <ActionButton
              icon="🚨"
              title="Emergency"
              subtitle="Request blood"
              onClick={() =>
                setActiveModal(
                  "emergency"
                )
              }
            />

            <ActionButton
              icon="🚚"
              title="Logistics"
              subtitle="View transfers"
              onClick={() =>
                setActiveModal(
                  "logistics"
                )
              }
            />

            <ActionButton
              icon="❤️"
              title="Donor Booking"
              subtitle="View appointments"
              onClick={() =>
                setActiveModal(
                  "donors"
                )
              }
            />

            <ActionButton
              icon="🔴"
              title="High Alert"
              subtitle="View expiry risks"
              onClick={() =>
                setActiveModal(
                  "alert"
                )
              }
            />

          </div>

        </section>


        {/* ================================================= */}
        {/* BLOOD INVENTORY */}
        {/* ================================================= */}

        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-8">

          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">

            <div>

              <h3 className="text-lg font-bold">
                Blood Storage
              </h3>

              <p className="text-sm text-slate-500">
                Aggregated from registered blood units
              </p>

            </div>

            <button
              onClick={loadData}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold hover:bg-slate-50"
            >
              ↻ Refresh
            </button>

          </div>


          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">

            {inventory.map((item) => {

              const isCritical =
                item.expiring >= 2;

              return (

                <div
                  key={item.blood_group}
                  className={`rounded-xl border p-5 ${
                    isCritical
                      ? "border-red-300 bg-red-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >

                  <div className="flex justify-between items-center mb-4">

                    <span className="text-2xl font-bold">
                      {item.blood_group}
                    </span>

                    {isCritical && (

                      <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full">
                        ALERT
                      </span>

                    )}

                  </div>


                  <p className="text-3xl font-bold">
                    {item.available}
                  </p>

                  <p className="text-xs text-slate-500">
                    units available
                  </p>


                  <div className="mt-4 pt-3 border-t border-slate-200">

                    <p
                      className={`text-sm font-semibold ${
                        item.expiring > 0
                          ? "text-amber-600"
                          : "text-green-600"
                      }`}
                    >
                      {item.expiring} expiring within 30 days
                    </p>

                  </div>

                </div>

              );

            })}

          </div>

        </section>


        {/* ================================================= */}
        {/* REGISTERED UNITS */}
        {/* ================================================= */}

        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-8">

          <div className="px-6 py-5 border-b border-slate-200">

            <h3 className="text-lg font-bold">
              Registered Blood Units
            </h3>

            <p className="text-sm text-slate-500">
              Individual units currently stored in the blood bank.
            </p>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-slate-50">

                <tr>

                  <th className="text-left px-6 py-4">
                    Serial Number
                  </th>

                  <th className="text-left px-6 py-4">
                    Group
                  </th>

                  <th className="text-left px-6 py-4">
                    Donation Date
                  </th>

                  <th className="text-left px-6 py-4">
                    Expiry Date
                  </th>

                  <th className="text-left px-6 py-4">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {bloodUnits.map(
                  (unit) => (

                    <tr
                      key={unit.serial_number}
                      className="border-t border-slate-100"
                    >

                      <td className="px-6 py-4 font-semibold">
                        {unit.serial_number}
                      </td>

                      <td className="px-6 py-4">

                        <span className="font-bold">
                          {unit.blood_group}
                        </span>

                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {unit.donation_date}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {unit.expiry_date}
                      </td>

                      <td className="px-6 py-4">

                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                          {unit.status}
                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </section>


        {/* ================================================= */}
        {/* AI PANEL */}
        {/* ================================================= */}

        <section className="bg-slate-900 text-white rounded-2xl p-6 mb-8">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            <div>

              <div className="flex items-center gap-2 mb-2">

                <span className="text-xl">
                  ✨
                </span>

                <span className="text-sm font-semibold text-red-400">
                  SANJEEVANI AI
                </span>

              </div>

              <h3 className="text-xl font-bold">
                Intelligent Inventory Recommendation
              </h3>

              <p className="text-slate-400 text-sm mt-1">
                Analyze expiry risks and emergency requirements.
              </p>

            </div>


            <button
              onClick={getAIRecommendation}
              disabled={aiLoading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-slate-600 px-5 py-3 rounded-xl font-semibold"
            >

              {aiLoading
                ? "Analyzing..."
                : "Analyze Inventory"}

            </button>

          </div>


          {recommendation && (

            <div className="mt-6 bg-white text-slate-900 rounded-xl p-5">

              <div className="flex flex-wrap gap-3 mb-4">

                <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                  {recommendation.priority} PRIORITY
                </span>

                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                  {recommendation.confidence} CONFIDENCE
                </span>

              </div>


              <div className="grid md:grid-cols-3 gap-5">

                <div>

                  <p className="text-xs text-slate-500">
                    BLOOD GROUP
                  </p>

                  <p className="text-3xl font-bold">
                    {recommendation.blood_group ||
                      "—"}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-500">
                    RECOMMENDED UNITS
                  </p>

                  <p className="text-3xl font-bold">
                    {recommendation.recommended_units}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-500">
                    RECOMMENDED ACTION
                  </p>

                  <p className="font-semibold mt-1">
                    {recommendation.recommended_action}
                  </p>

                </div>

              </div>


              <div className="mt-5 bg-slate-50 rounded-xl p-4">

                <p className="text-xs text-slate-500 mb-1">
                  AI REASONING
                </p>

                <p className="text-sm">
                  {recommendation.reason}
                </p>

              </div>


              <div className="mt-4 text-xs text-slate-500">
                AI provides operational recommendations.
                Final medical and transfer decisions remain
                with authorized personnel.
              </div>

            </div>

          )}

        </section>

      </div>


      {/* ================================================= */}
      {/* EMERGENCY MODAL */}
      {/* ================================================= */}

      {activeModal === "emergency" && (

        <Modal
          title="Emergency Blood Request"
          onClose={() =>
            setActiveModal(null)
          }
        >

          <label className="block text-sm font-semibold mb-2">
            Blood Group
          </label>

          <select
            value={emergencyBlood}
            onChange={(e) =>
              setEmergencyBlood(
                e.target.value
              )
            }
            className="w-full border rounded-xl px-4 py-3 mb-5"
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

              <option
                key={group}
                value={group}
              >
                {group}
              </option>

            ))}

          </select>


          <label className="block text-sm font-semibold mb-2">
            Required Units
          </label>

          <input
            type="number"
            min="1"
            value={emergencyUnits}
            onChange={(e) =>
              setEmergencyUnits(
                Number(e.target.value)
              )
            }
            className="w-full border rounded-xl px-4 py-3 mb-6"
          />


          <button
            onClick={createEmergency}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold"
          >
            Create Emergency Request
          </button>

        </Modal>

      )}


      {/* ================================================= */}
      {/* LOGISTICS MODAL */}
      {/* ================================================= */}

      {activeModal === "logistics" && (

        <Modal
          title="Logistics Coordination"
          onClose={() =>
            setActiveModal(null)
          }
        >

          <div className="space-y-4">

            <LogisticsItem
              blood="B-"
              units={2}
              from="City Care Hospital"
              to="Metro Hospital"
              status="AI Recommended"
            />

            <LogisticsItem
              blood="O-"
              units={1}
              from="Central Blood Bank"
              to="City Care Hospital"
              status="Pending"
            />

          </div>

        </Modal>

      )}


      {/* ================================================= */}
      {/* DONOR MODAL */}
      {/* ================================================= */}

      {activeModal === "donors" && (

        <Modal
          title="Donor Bookings"
          onClose={() =>
            setActiveModal(null)
          }
        >

          <div className="space-y-3">

            {appointments.length === 0 ? (

              <p className="text-slate-500">
                No appointments found.
              </p>

            ) : (

              appointments.map(
                (appointment, index) => (

                  <div
                    key={index}
                    className="border rounded-xl p-4 flex justify-between"
                  >

                    <div>

                      <p className="font-bold">
                        {appointment.name}
                      </p>

                      <p className="text-sm text-slate-500">
                        {appointment.type}
                      </p>

                    </div>


                    <div className="text-right">

                      <p className="font-bold">
                        {appointment.blood_group}
                      </p>

                      <p className="text-sm text-slate-500">
                        {appointment.time}
                      </p>

                    </div>

                  </div>

                )
              )

            )}

          </div>

        </Modal>

      )}


      {/* ================================================= */}
      {/* HIGH ALERT MODAL */}
      {/* ================================================= */}

      {activeModal === "alert" && (

        <Modal
          title="High Alert Blood Supply"
          onClose={() =>
            setActiveModal(null)
          }
        >

          <div className="space-y-4">

            {inventory
              .filter(
                (item) =>
                  item.expiring > 0
              )
              .map((item) => (

                <div
                  key={item.blood_group}
                  className="bg-red-50 border border-red-200 rounded-xl p-4"
                >

                  <div className="flex justify-between">

                    <div>

                      <p className="text-xl font-bold text-red-700">
                        {item.blood_group}
                      </p>

                      <p className="text-sm text-slate-600">
                        {item.expiring} unit(s)
                        approaching expiry
                      </p>

                    </div>


                    <div className="text-right">

                      <p className="font-bold">
                        {item.available}
                      </p>

                      <p className="text-xs text-slate-500">
                        available
                      </p>

                    </div>

                  </div>

                </div>

              ))}

          </div>

        </Modal>

      )}

    </main>
  );
}


// =========================================================
// STAT CARD
// =========================================================

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: string;
  color: "red" | "amber" | "purple";
}) {

  const colors = {
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (

    <div className="bg-white border border-slate-200 rounded-2xl p-5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="text-3xl font-bold mt-2">
            {value}
          </p>

        </div>


        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${colors[color]}`}
        >
          {icon}
        </div>

      </div>

    </div>

  );
}


// =========================================================
// ACTION BUTTON
// =========================================================

function ActionButton({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {

  return (

    <button
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-red-300 hover:shadow-sm transition"
    >

      <div className="text-2xl mb-3">
        {icon}
      </div>

      <p className="font-bold">
        {title}
      </p>

      <p className="text-xs text-slate-500 mt-1">
        {subtitle}
      </p>

    </button>

  );
}


// =========================================================
// MODAL
// =========================================================

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {

  return (

    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-5">

      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto">

        <div className="flex justify-between items-center px-6 py-5 border-b">

          <h2 className="text-xl font-bold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 text-xl"
          >
            ×
          </button>

        </div>

        <div className="p-6">
          {children}
        </div>

      </div>

    </div>

  );
}


// =========================================================
// LOGISTICS ITEM
// =========================================================

function LogisticsItem({
  blood,
  units,
  from,
  to,
  status,
}: {
  blood: string;
  units: number;
  from: string;
  to: string;
  status: string;
}) {

  return (

    <div className="border rounded-xl p-4">

      <div className="flex justify-between items-start">

        <div>

          <p className="text-xl font-bold">
            {blood}
          </p>

          <p className="text-sm text-slate-500">
            {units} units
          </p>

        </div>


        <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">
          {status}
        </span>

      </div>


      <div className="mt-4 text-sm">

        <span className="font-semibold">
          {from}
        </span>

        <span className="mx-2">
          →
        </span>

        <span className="font-semibold">
          {to}
        </span>

      </div>

    </div>

  );
}