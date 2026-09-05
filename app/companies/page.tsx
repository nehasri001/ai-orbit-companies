"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Company = {
  id: string;
  slug: string;
  name: string;
  logo: string | null;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [sort, setSort] = useState("name-asc");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function loadCompanies() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (search) params.set("search", search);
        if (industry) params.set("industry", industry);
        if (country) params.set("country", country);

        params.set("sort", sort);
        params.set("page", String(page));
        params.set("limit", "9");

        const response = await fetch(
          `/api/companies?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Failed to load companies");
        }

        const result: ApiResponse = await response.json();

        setCompanies(result.data);
        setTotalPages(result.pagination.totalPages);
      } catch (err) {
        console.error(err);
        setError("Unable to load companies.");
      } finally {
        setLoading(false);
      }
    }

    loadCompanies();
  }, [search, industry, country, sort, page]);

  function clearFilters() {
    setSearch("");
    setIndustry("");
    setCountry("");
    setSort("name-asc");
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Header */}
        <div className="border-b border-white/10 pb-8">
          <Link
            href="/"
            className="text-sm text-white/40 transition hover:text-white"
          >
            AI Orbit
          </Link>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight">
            Companies
          </h1>

          <p className="mt-3 max-w-2xl text-white/50">
            Discover companies building the future of artificial
            intelligence.
          </p>
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-col gap-4">

          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/25"
          />

          <div className="flex flex-col gap-3 sm:flex-row">

            <select
              value={industry}
              onChange={(e) => {
                setIndustry(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white/70 outline-none"
            >
              <option value="">All industries</option>
              <option value="AI Research">AI Research</option>
              <option value="AI Infrastructure">AI Infrastructure</option>
              <option value="AI Applications">AI Applications</option>
              <option value="Robotics">Robotics</option>
            </select>

            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white/70 outline-none"
            >
              <option value="">All countries</option>
              <option value="United States">United States</option>
              <option value="France">France</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
            </select>

            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white/70 outline-none"
            >
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
              <option value="newest">Newest</option>
              <option value="featured">Featured</option>
            </select>

            {(search || industry || country) && (
              <button
                onClick={clearFilters}
                className="rounded-xl border border-white/10 px-4 py-3 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && companies.length === 0 && (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
            <h2 className="text-xl font-semibold">
              No companies found
            </h2>

            <p className="mt-2 text-sm text-white/40">
              Try changing your search or filters.
            </p>

            <button
              onClick={clearFilters}
              className="mt-6 rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Company cards */}
        {!loading && !error && companies.length > 0 && (
          <>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => (
                <Link
                  key={company.id}
                  href={`/companies/${company.slug}`}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <div className="flex items-start justify-between gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-lg font-semibold">
                      {company.name.charAt(0)}
                    </div>

                    {company.featured && (
                      <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/50">
                        Featured
                      </span>
                    )}
                  </div>

                  <h2 className="mt-6 text-xl font-semibold transition group-hover:text-white">
                    {company.name}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/45">
                    {company.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {company.industry && (
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/50">
                        {company.industry}
                      </span>
                    )}

                    {company.country && (
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/50">
                        {company.country}
                      </span>
                    )}
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-4 text-sm text-white/30 transition group-hover:text-white/60">
                    View company →
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Previous
                </button>

                <span className="text-sm text-white/40">
                  Page {page} of {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}