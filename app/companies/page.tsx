"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial state from URL
  const [search, setSearch] = useState(
    searchParams.get("search") ?? ""
  );

  const [industry, setIndustry] = useState(
    searchParams.get("industry") ?? ""
  );

  const [country, setCountry] = useState(
    searchParams.get("country") ?? ""
  );

  const [sort, setSort] = useState(
    searchParams.get("sort") ?? "name-asc"
  );

  const [page, setPage] = useState(
    Math.max(
      parseInt(searchParams.get("page") ?? "1", 10),
      1
    )
  );

  const [companies, setCompanies] = useState<Company[]>([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Keep the URL synchronized with filters.
   */
  useEffect(() => {
    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    if (industry) {
      params.set("industry", industry);
    }

    if (country) {
      params.set("country", country);
    }

    if (sort !== "name-asc") {
      params.set("sort", sort);
    }

    if (page > 1) {
      params.set("page", String(page));
    }

    const queryString = params.toString();

    router.replace(
      queryString ? `${pathname}?${queryString}` : pathname,
      { scroll: false }
    );
  }, [
    search,
    industry,
    country,
    sort,
    page,
    pathname,
    router,
  ]);

  /*
   * Fetch companies whenever filters change.
   */
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (search) {
          params.set("search", search);
        }

        if (industry) {
          params.set("industry", industry);
        }

        if (country) {
          params.set("country", country);
        }

        params.set("sort", sort);
        params.set("page", String(page));
        params.set("limit", "9");

        const response = await fetch(
          `/api/companies?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch companies");
        }

        const result: ApiResponse = await response.json();

        setCompanies(result.data);
        setPagination(result.pagination);
      } catch (error) {
        console.error(error);
        setError("Unable to load companies.");
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchCompanies, 300);

    return () => clearTimeout(timer);
  }, [search, industry, country, sort, page]);

  /*
   * Search
   */
  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearch(event.target.value);
    setPage(1);
  };

  /*
   * Industry
   */
  const handleIndustryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setIndustry(event.target.value);
    setPage(1);
  };

  /*
   * Country
   */
  const handleCountryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCountry(event.target.value);
    setPage(1);
  };

  /*
   * Sort
   */
  const handleSortChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSort(event.target.value);
    setPage(1);
  };

  /*
   * Clear everything.
   */
  const clearFilters = () => {
    setSearch("");
    setIndustry("");
    setCountry("");
    setSort("name-asc");
    setPage(1);
  };

  const hasFilters =
    search !== "" ||
    industry !== "" ||
    country !== "" ||
    sort !== "name-asc" ||
    page > 1;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="mb-3 text-sm text-zinc-600">
            AI Orbit / Companies
          </p>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight">
                Companies
              </h1>

              <p className="mt-3 max-w-2xl text-zinc-500">
                Discover companies building the future of
                artificial intelligence.
              </p>
            </div>

            {!loading && !error && (
              <p className="text-sm text-zinc-600">
                {pagination.total}{" "}
                {pagination.total === 1
                  ? "company"
                  : "companies"}
              </p>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search companies..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:border-zinc-600"
          />
        </div>

        {/* Filters */}
        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <select
            value={industry}
            onChange={handleIndustryChange}
            className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-400 outline-none focus:border-zinc-600"
          >
            <option value="">All industries</option>
            <option value="AI Research">AI Research</option>
            <option value="AI Infrastructure">
              AI Infrastructure
            </option>
            <option value="AI Applications">
              AI Applications
            </option>
            <option value="Generative AI">
              Generative AI
            </option>
            <option value="Robotics">Robotics</option>
          </select>

          <select
            value={country}
            onChange={handleCountryChange}
            className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-400 outline-none focus:border-zinc-600"
          >
            <option value="">All countries</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="France">France</option>
            <option value="Canada">Canada</option>
          </select>

          <select
            value={sort}
            onChange={handleSortChange}
            className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-400 outline-none focus:border-zinc-600"
          >
            <option value="name-asc">Name A → Z</option>
            <option value="name-desc">Name Z → A</option>
            <option value="newest">Newest</option>
            <option value="featured">Featured</option>
          </select>
        </div>

        {/* Clear filters */}
        {hasFilters && !loading && (
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-zinc-600 transition hover:text-white"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-56 animate-pulse rounded-2xl border border-zinc-900 bg-zinc-950"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-8">
            <h2 className="text-lg font-medium">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm text-red-400">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-white"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && companies.length === 0 && (
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-xl">
              ?
            </div>

            <h2 className="mt-5 text-lg font-medium">
              No companies found
            </h2>

            <p className="mt-2 text-sm text-zinc-600">
              Try changing your search or filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-white"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Company cards */}
        {!loading && !error && companies.length > 0 && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => (
                <Link
                  key={company.id}
                  href={`/companies/${company.slug}`}
                  className="group rounded-2xl border border-zinc-900 bg-zinc-950 p-6 transition hover:border-zinc-700 hover:bg-zinc-900/60"
                >
                  <div className="mb-6 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-lg font-semibold">
                      {company.name.charAt(0).toUpperCase()}
                    </div>

                    {company.featured && (
                      <span className="rounded-full border border-zinc-800 px-2.5 py-1 text-xs text-zinc-500">
                        Featured
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-medium transition group-hover:text-zinc-200">
                    {company.name}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-500">
                    {company.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {company.industry && (
                      <span className="rounded-md bg-zinc-900 px-2.5 py-1 text-xs text-zinc-500">
                        {company.industry}
                      </span>
                    )}

                    {company.country && (
                      <span className="rounded-md bg-zinc-900 px-2.5 py-1 text-xs text-zinc-500">
                        {company.country}
                      </span>
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-zinc-900 pt-4 text-xs text-zinc-600">
                    <span>
                      {company.stage || "Company"}
                    </span>

                    <span className="transition group-hover:text-zinc-300">
                      View →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() =>
                    setPage((current) => current - 1)
                  }
                  className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-500 transition hover:border-zinc-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ←
                </button>

                <span className="px-4 text-sm text-zinc-500">
                  Page {page} of {pagination.totalPages}
                </span>

                <button
                  type="button"
                  disabled={
                    page === pagination.totalPages
                  }
                  onClick={() =>
                    setPage((current) => current + 1)
                  }
                  className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-500 transition hover:border-zinc-600 hover:text-white"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}