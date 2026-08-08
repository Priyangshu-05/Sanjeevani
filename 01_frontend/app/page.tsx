import Link from "next/link";

export default function HomePage() {
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
                Blood & Plasma Supply Network
              </p>
            </div>

          </div>

          <Link
            href="/login"
            className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold"
          >
            Login
          </Link>

        </div>

      </header>

      <section className="max-w-6xl mx-auto px-6 py-20">

        <div className="max-w-3xl">

          <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
            AI-POWERED BLOOD SUPPLY COORDINATION
          </span>

          <h2 className="text-5xl font-bold leading-tight mt-6">
            Reduce blood wastage.
            <br />
            Improve availability.
            <br />
            <span className="text-red-600">
              Save more lives.
            </span>
          </h2>

          <p className="text-lg text-slate-500 mt-6 max-w-2xl">
            Sanjeevani connects licensed healthcare
            organizations to coordinate blood inventory,
            emergency requirements and expiry risks.
          </p>

          <div className="flex gap-4 mt-8">

            <Link
              href="/login"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold"
            >
              Open Platform
            </Link>

            <Link
              href="/donor"
              className="bg-white border border-slate-200 px-6 py-3 rounded-xl font-bold"
            >
              Donate Blood
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}