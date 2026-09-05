import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm text-white/40">404</p>

        <h1 className="mt-4 text-3xl font-semibold">
          Company not found
        </h1>

        <p className="mt-3 text-white/50">
          The company you are looking for does not exist.
        </p>

        <Link
          href="/companies"
          className="mt-8 inline-flex rounded-lg border border-white/10 px-5 py-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
        >
          ← Back to companies
        </Link>
      </div>
    </main>
  );
}