"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

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
   * Keep filters synchronized with the URL.
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
      queryString
        ? `${pathname}?${queryString}`
        : pathname,
      {
        scroll: false,
      }
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
   * Fetch companies.
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
          throw new Error(
            "Failed to fetch companies"
          );
        }

        const result: ApiResponse =
          await response.json();

        setCompanies(result.data);
        setPagination(result.pagination);
      } catch (error) {
        console.error(error);

        setError(
          "Unable to load companies. Please try again."
        );

        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(
      fetchCompanies,
      300
    );

    return () => clearTimeout(timer);
  }, [
    search,
    industry,
    country,
    sort,
    page,
  ]);

  /*
   * Handlers
   */
  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleIndustryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setIndustry(event.target.value);
    setPage(1);
  };

  const handleCountryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCountry(event.target.value);
    setPage(1);
  };

  const handleSortChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSort(event.target.value);
    setPage(1);
  };

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
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-10">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <header className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-xs text-zinc-600">
            <Link
              href="/"
              className="transition hover:text-zinc-300"
            >
              AI Orbit
            </Link>

            <span>/</span>

            <span className="text-zinc-500">
              Companies
            </span>
          </div>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Companies
                </h1>

                {!loading &&
                  !error &&
                  pagination.total > 0 && (
                    <span className="rounded-full border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-500">
                      {pagination.total}
                    </span>
                  )}
              </div>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
                Discover companies building the future
                of artificial intelligence.
              </p>
            </div>
          </div>
        </header>

        {/* ================================================== */}
        {/* SEARCH + FILTER BAR */}
        {/* ================================================== */}

        <section className="mb-8 rounded-2xl border border-zinc-900 bg-zinc-950/70 p-3 sm:p-4">
          {/* Search */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-zinc-600">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </div>

            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search companies..."
              className="w-full rounded-xl border border-zinc-800 bg-black py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:border-zinc-600"
            />
          </div>

          {/* Filters */}
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <select
              value={industry}
              onChange={handleIndustryChange}
              className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-zinc-400 outline-none transition focus:border-zinc-600"
            >
              <option value="">
                All industries
              </option>

              <option value="AI Research">
                AI Research
              </option>

              <option value="AI Infrastructure">
                AI Infrastructure
              </option>

              <option value="AI Applications">
                AI Applications
              </option>

              <option value="Generative AI">
                Generative AI
              </option>

              <option value="Robotics">
                Robotics
              </option>
            </select>

            <select
              value={country}
              onChange={handleCountryChange}
              className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-zinc-400 outline-none transition focus:border-zinc-600"
            >
              <option value="">
                All countries
              </option>

              <option value="USA">
                USA
              </option>

              <option value="UK">
                UK
              </option>

              <option value="France">
                France
              </option>

              <option value="Canada">
                Canada
              </option>
            </select>

            <select
              value={sort}
              onChange={handleSortChange}
              className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-zinc-400 outline-none transition focus:border-zinc-600"
            >
              <option value="name-asc">
                Name A → Z
              </option>

              <option value="name-desc">
                Name Z → A
              </option>

              <option value="newest">
                Newest
              </option>

              <option value="featured">
                Featured
              </option>
            </select>
          </div>

          {/* Active filters */}
          {hasFilters && !loading && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-900 pt-4">
              <div className="flex flex-wrap gap-2">
                {search && (
                  <FilterPill>
                    Search: {search}
                  </FilterPill>
                )}

                {industry && (
                  <FilterPill>
                    {industry}
                  </FilterPill>
                )}

                {country && (
                  <FilterPill>
                    {country}
                  </FilterPill>
                )}

                {sort !== "name-asc" && (
                  <FilterPill>
                    {sort === "name-desc"
                      ? "Z → A"
                      : sort === "newest"
                        ? "Newest"
                        : "Featured"}
                  </FilterPill>
                )}

                {page > 1 && (
                  <FilterPill>
                    Page {page}
                  </FilterPill>
                )}
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-zinc-600 transition hover:text-white"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* ================================================== */}
        {/* RESULTS HEADER */}
        {/* ================================================== */}

        {!loading && !error && companies.length > 0 && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs text-zinc-600">
              Showing{" "}
              <span className="text-zinc-400">
                {(page - 1) *
                  pagination.limit +
                  1}
              </span>{" "}
              –{" "}
              <span className="text-zinc-400">
                {Math.min(
                  page * pagination.limit,
                  pagination.total
                )}
              </span>{" "}
              of{" "}
              <span className="text-zinc-400">
                {pagination.total}
              </span>
            </p>
          </div>
        )}

        {/* ================================================== */}
        {/* LOADING */}
        {/* ================================================== */}

        {loading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-[270px] animate-pulse rounded-2xl border border-zinc-900 bg-zinc-950"
                />
              )
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* ERROR */}
        {/* ================================================== */}

        {!loading && error && (
          <section className="rounded-2xl border border-red-900/40 bg-red-950/20 p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-red-900/40 bg-red-950/30 text-red-400">
              !
            </div>

            <h2 className="mt-5 text-lg font-medium">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm text-red-400">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-5 rounded-xl border border-zinc-800 px-4 py-2.5 text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-white"
            >
              Try again
            </button>
          </section>
        )}

        {/* ================================================== */}
        {/* EMPTY */}
        {/* ================================================== */}

        {!loading &&
          !error &&
          companies.length === 0 && (
            <section className="rounded-2xl border border-zinc-900 bg-zinc-950 p-12 text-center sm:p-16">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-lg text-zinc-500">
                ?
              </div>

              <h2 className="mt-5 text-lg font-medium">
                No companies found
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-600">
                Try changing your search or removing
                some filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl border border-zinc-800 px-4 py-2.5 text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-white"
              >
                Clear filters
              </button>
            </section>
          )}

        {/* ================================================== */}
        {/* COMPANY GRID */}
        {/* ================================================== */}

        {!loading &&
          !error &&
          companies.length > 0 && (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {companies.map((company) => (
                  <Link
                    key={company.id}
                    href={`/companies/${company.slug}`}
                    className="group relative flex min-h-[270px] flex-col overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950 p-6 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-900/70"
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      {/* Logo */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-lg font-semibold text-zinc-300 transition group-hover:border-zinc-700 group-hover:bg-zinc-800">
                        {company.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      {/* Featured */}
                      {company.featured && (
                        <span className="rounded-full border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-[11px] font-medium text-zinc-400">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Company info */}
                    <div className="mt-6">
                      <h2 className="text-lg font-medium tracking-tight text-zinc-100 transition group-hover:text-white">
                        {company.name}
                      </h2>

                      <p className="mt-1 text-xs text-zinc-600">
                        {company.industry ||
                          "AI Company"}
                      </p>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-500">
                        {company.description}
                      </p>
                    </div>

                    {/* Metadata */}
                    <div className="mt-auto pt-6">
                      <div className="flex flex-wrap gap-2">
                        {company.country && (
                          <span className="rounded-md border border-zinc-900 bg-black px-2.5 py-1 text-[11px] text-zinc-600">
                            {company.country}
                          </span>
                        )}

                        {company.stage && (
                          <span className="rounded-md border border-zinc-900 bg-black px-2.5 py-1 text-[11px] text-zinc-600">
                            {company.stage}
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="mt-5 flex items-center justify-between border-t border-zinc-900 pt-4">
                        <span className="text-xs text-zinc-700">
                          {company.location ||
                            "Location unavailable"}
                        </span>

                        <span className="text-xs text-zinc-600 transition group-hover:text-zinc-300">
                          View →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* ================================================== */}
              {/* PAGINATION */}
              {/* ================================================== */}

              {pagination.totalPages > 1 && (
                <nav
                  aria-label="Company pagination"
                  className="mt-10 flex items-center justify-center"
                >
                  <div className="flex items-center gap-2 rounded-xl border border-zinc-900 bg-zinc-950 p-1.5">
                    <button
                      type="button"
                      disabled={page === 1}
                      onClick={() =>
                        setPage(
                          (current) =>
                            current - 1
                        )
                      }
                      aria-label="Previous page"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-sm text-zinc-500 transition hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                    >
                      ←
                    </button>

                    <div className="px-3 text-xs text-zinc-500">
                      Page{" "}
                      <span className="text-zinc-300">
                        {page}
                      </span>{" "}
                      of{" "}
                      <span className="text-zinc-300">
                        {pagination.totalPages}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={
                        page ===
                        pagination.totalPages
                      }
                      onClick={() =>
                        setPage(
                          (current) =>
                            current + 1
                        )
                      }
                      aria-label="Next page"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-sm text-zinc-500 transition hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                    >
                      →
                    </button>
                  </div>
                </nav>
              )}
            </>
          )}
      </div>
    </main>
  );
}

/*
 * Small active-filter pill.
 */
function FilterPill({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-md border border-zinc-900 bg-black px-2.5 py-1 text-[11px] text-zinc-500">
      {children}
    </span>
  );
}