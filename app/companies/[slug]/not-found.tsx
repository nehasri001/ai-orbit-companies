import Link from "next/link";

export default function CompanyNotFound() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-md text-center">
          {/* Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 text-2xl font-semibold text-zinc-500">
            ?
          </div>

          {/* Heading */}
          <p className="mt-8 text-xs uppercase tracking-[0.2em] text-zinc-600">
            AI Orbit / Companies
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Company not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            The company you are looking for does not exist
            or may have been removed.
          </p>

          {/* Action */}
          <div className="mt-8">
            <Link
              href="/companies"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-3 text-sm text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-900 hover:text-white"
            >
              ← Back to Companies
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}