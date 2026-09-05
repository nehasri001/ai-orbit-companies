"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Company = {
  id: string;
  slug: string;
  name: string;
  description: string;
  website: string | null;
  industry: string | null;
  location: string | null;
  country: string | null;
  foundedYear: number | null;
  employees: string | null;
  funding: string | null;
  stage: string | null;
  featured: boolean;
};

type ApiResponse = {
  data: Company[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/companies?search=${encodeURIComponent(search)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch companies");
        }

        const result: ApiResponse = await response.json();

        setCompanies(result.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load companies.");
      } finally {
        setLoading(false);
      }
    }

    const timeout = setTimeout(fetchCompanies, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="mb-3 text-sm text-zinc-500">
            AI Orbit / Companies
          </p>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight">
                Companies
              </h1>

              <p className="mt-3 max-w-2xl text-zinc-400">
                Discover companies building the future of artificial
                intelligence.
              </p>
            </div>

            <div className="text-sm text-zinc-500">
              {companies.length} companies
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search companies..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-zinc-600"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-52 animate-pulse rounded-2xl border border-zinc-900 bg-zinc-950"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6 text-red-400">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && companies.length === 0 && (
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-12 text-center">
            <h2 className="text-lg font-medium">
              No companies found
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Try searching for something else.
            </p>
          </div>
        )}

        {/* Company Grid */}
        {!loading && !error && companies.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <Link
                key={company.id}
                href={`/companies/${company.slug}`}
                className="group rounded-2xl border border-zinc-900 bg-zinc-950 p-6 transition hover:border-zinc-700 hover:bg-zinc-900/60"
              >
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-lg font-semibold">
                    {company.name.charAt(0)}
                  </div>

                  {company.featured && (
                    <span className="rounded-full border border-zinc-800 px-2.5 py-1 text-xs text-zinc-400">
                      Featured
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-medium group-hover:text-zinc-200">
                  {company.name}
                </h2>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">
                  {company.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {company.industry && (
                    <span className="rounded-md bg-zinc-900 px-2.5 py-1 text-xs text-zinc-400">
                      {company.industry}
                    </span>
                  )}

                  {company.country && (
                    <span className="rounded-md bg-zinc-900 px-2.5 py-1 text-xs text-zinc-400">
                      {company.country}
                    </span>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-zinc-900 pt-4 text-xs text-zinc-600">
                  <span>
                    {company.stage || "Company"}
                  </span>

                  <span className="group-hover:text-zinc-400">
                    View →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}