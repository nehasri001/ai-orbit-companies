"use client";

import { Suspense, useEffect, useState } from "react";
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

function CompaniesPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") ?? "";
  const initialIndustry = searchParams.get("industry") ?? "";
  const initialCountry = searchParams.get("country") ?? "";
  const initialSort = searchParams.get("sort") ?? "name-asc";

  const initialPage = Math.max(
    Number(searchParams.get("page") ?? "1"),
    1
  );

  const [search, setSearch] = useState(initialSearch);
  const [industry, setIndustry] = useState(initialIndustry);
  const [country, setCountry] = useState(initialCountry);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(initialPage);

  const [companies, setCompanies] = useState<Company[]>([]);

  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: 9,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Keep URL synchronized with filters.
   */
  useEffect(() => {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (industry) {
      params.set("industry", industry);
    }

    if (country) {
      params.set("country", country);
    }

    if (sort && sort !== "name-asc") {
      params.set("sort", sort);
    }

    if (page > 1) {
      params.set("page", String(page));
    }

    const query = params.toString();

    router.replace(
      query ? `${pathname}?${query}` : pathname,
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
    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (industry) {
          params.set("industry", industry);
        }

        if (country) {
          params.set("country", country);
        }

        if (sort) {
          params.set("sort", sort);
        }

        params.set("page", String(page));
        params.set("limit", "9");

        const response = await fetch(
          `/api/companies?${params.toString()}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch companies");
        }

        const result: ApiResponse = await response.json();

        setCompanies(result.data);
        setPagination(result.pagination);
      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === "AbortError"
        ) {
          return;
        }

        console.error(err);
        setError(
          "Unable to load companies. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [search, industry, country, sort, page]);

  /*
   * Filter handlers
   */
  const updateSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const updateIndustry = (value: string) => {
    setIndustry(value);
    setPage(1);
  };

  const updateCountry = (value: string) => {
    setCountry(value);
    setPage(1);
  };

  const updateSort = (value: string) => {
    setSort(value);
    setPage(1);
  };

  /*
   * Clear filters
   */
  const clearFilters = () => {
    setSearch("");
    setIndustry("");
    setCountry("");
    setSort("name-asc");
    setPage(1);
  };

  const hasFilters =
    search.trim() !== "" ||
    industry !== "" ||
    country !== "" ||
    sort !== "name-asc";

  const startResult =
    pagination.total === 0
      ? 0
      : (pagination.page - 1) * pagination.limit + 1;

  const endResult = Math.min(
    pagination.page * pagination.limit,
    pagination.total
  );

  const industries = [
    "AI Research",
    "AI Infrastructure",
    "AI Models",
    "Generative AI",
    "Developer Tools",
    "Robotics",
    "Computer Vision",
    "Data",
    "Search",
    "Creative AI",
  ];

  const countries = [
    "United States",
    "United Kingdom",
    "France",
    "Canada",
    "Germany",
    "Israel",
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* Breadcrumb */}
        <div className="mb-10 flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="text-zinc-600 transition hover:text-zinc-300"
          >
            AI Orbit
          </Link>

          <span className="text-zinc-800">/</span>

          <span className="text-zinc-400">
            Companies
          </span>
        </div>

        {/* Header */}
        <header className="mb-10">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-zinc-600">
            AI Ecosystem
          </p>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Companies
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-500">
            Discover companies building the AI ecosystem,
            from frontier model labs and infrastructure
            providers to robotics and creative AI.
          </p>
        </header>

        {/* Search */}
        <section className="mb-5">
          <div className="relative">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
              />

              <path d="m20 20-4-4" />
            </svg>

            <input
              type="search"
              value={search}
              onChange={(event) =>
                updateSearch(event.target.value)
              }
              placeholder="Search companies..."
              className="h-14 w-full rounded-2xl border border-zinc-900 bg-zinc-950 pl-12 pr-5 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-zinc-700"
            />
          </div>
        </section>

        {/* Filters */}
        <section className="mb-8 flex flex-col gap-3 sm:flex-row">

          {/* Industry */}
          <select
            value={industry}
            onChange={(event) =>
              updateIndustry(event.target.value)
            }
            className="h-11 rounded-xl border border-zinc-900 bg-zinc-950 px-4 text-sm text-zinc-400 outline-none transition focus:border-zinc-700"
          >
            <option value="">
              All industries
            </option>

            {industries.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* Country */}
          <select
            value={country}
            onChange={(event) =>
              updateCountry(event.target.value)
            }
            className="h-11 rounded-xl border border-zinc-900 bg-zinc-950 px-4 text-sm text-zinc-400 outline-none transition focus:border-zinc-700"
          >
            <option value="">
              All countries
            </option>

            {countries.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(event) =>
              updateSort(event.target.value)
            }
            className="h-11 rounded-xl border border-zinc-900 bg-zinc-950 px-4 text-sm text-zinc-400 outline-none transition focus:border-zinc-700"
          >
            <option value="name-asc">
              Name A–Z
            </option>

            <option value="name-desc">
              Name Z–A
            </option>

            <option value="newest">
              Newest
            </option>

            <option value="featured">
              Featured
            </option>
          </select>

          {/* Clear filters */}
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="h-11 rounded-xl border border-zinc-900 px-4 text-sm text-zinc-500 transition hover:border-zinc-700 hover:text-white"
            >
              Clear filters
            </button>
          )}
        </section>

        {/* Active filters */}
        {hasFilters && (
          <div className="mb-8 flex flex-wrap gap-2">

            {search.trim() && (
              <FilterPill
                label={`Search: ${search}`}
                onRemove={() =>
                  updateSearch("")
                }
              />
            )}

            {industry && (
              <FilterPill
                label={industry}
                onRemove={() =>
                  updateIndustry("")
                }
              />
            )}

            {country && (
              <FilterPill
                label={country}
                onRemove={() =>
                  updateCountry("")
                }
              />
            )}

            {sort !== "name-asc" && (
              <FilterPill
                label={
                  sort === "name-desc"
                    ? "Name Z–A"
                    : sort === "newest"
                    ? "Newest"
                    : "Featured"
                }
                onRemove={() =>
                  updateSort("name-asc")
                }
              />
            )}
          </div>
        )}

        {/* Results count */}
        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">
            {loading ? (
              "Loading companies..."
            ) : pagination.total > 0 ? (
              <>
                Showing{" "}
                <span className="text-zinc-400">
                  {startResult}–{endResult}
                </span>{" "}
                of{" "}
                <span className="text-zinc-400">
                  {pagination.total}
                </span>
              </>
            ) : (
              "No companies found"
            )}
          </p>
        </div>

        {/* Error */}
        {error && !loading && (
          <div className="mb-8 rounded-2xl border border-zinc-900 bg-zinc-950 p-8 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 text-zinc-600">
              !
            </div>

            <h2 className="mt-5 text-base font-medium">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm text-zinc-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                setPage(1);
                setError("");
              }}
              className="mt-5 rounded-xl border border-zinc-800 px-4 py-2 text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-white"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 animate-pulse rounded-xl bg-zinc-900" />

                    <div className="flex-1">
                      <div className="h-4 w-32 animate-pulse rounded bg-zinc-900" />

                      <div className="mt-3 h-3 w-20 animate-pulse rounded bg-zinc-900" />
                    </div>
                  </div>

                  <div className="mt-6 h-3 w-full animate-pulse rounded bg-zinc-900" />

                  <div className="mt-3 h-3 w-5/6 animate-pulse rounded bg-zinc-900" />

                  <div className="mt-3 h-3 w-2/3 animate-pulse rounded bg-zinc-900" />
                </div>
              )
            )}
          </div>
        )}

        {/* Empty state */}
        {!loading &&
          !error &&
          companies.length === 0 && (
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950 px-6 py-20 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 text-xl text-zinc-600">
                ∅
              </div>

              <h2 className="mt-6 text-lg font-medium">
                No companies found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
                Try changing your search or removing
                one of the filters.
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 rounded-xl border border-zinc-800 px-5 py-2.5 text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-white"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

        {/* Company cards */}
        {!loading &&
          !error &&
          companies.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

              {companies.map((company) => (
                <Link
                  key={company.id}
                  href={`/companies/${company.slug}`}
                  className="group rounded-2xl border border-zinc-900 bg-zinc-950 p-6 transition duration-200 hover:border-zinc-700 hover:bg-zinc-900/60"
                >
                  {/* Company header */}
                  <div className="flex items-start justify-between gap-4">

                    <div className="flex min-w-0 items-start gap-4">

                      {/* Logo */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 text-lg font-semibold text-zinc-300">

                        {company.logo ? (
                          <img
                            src={company.logo}
                            alt={`${company.name} logo`}
                            className="h-full w-full object-contain p-2"
                          />
                        ) : (
                          company.name
                            .charAt(0)
                            .toUpperCase()
                        )}
                      </div>

                      {/* Name */}
                      <div className="min-w-0">

                        <h2 className="truncate text-base font-medium text-white transition group-hover:text-zinc-200">
                          {company.name}
                        </h2>

                        <p className="mt-1 truncate text-xs text-zinc-600">
                          {company.industry ||
                            "AI Company"}
                        </p>

                      </div>
                    </div>

                    {/* Featured */}
                    {company.featured && (
                      <span className="shrink-0 rounded-full border border-zinc-800 px-2.5 py-1 text-[10px] uppercase tracking-wider text-zinc-500">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="mt-6 line-clamp-3 text-sm leading-6 text-zinc-500">
                    {company.description}
                  </p>

                  {/* Metadata */}
                  <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-600">

                    {company.location && (
                      <span>
                        {company.location}
                      </span>
                    )}

                    {company.stage && (
                      <span>
                        {company.stage}
                      </span>
                    )}

                    {company.employees && (
                      <span>
                        {company.employees}
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-zinc-900 pt-4">

                    <span className="text-xs text-zinc-700">
                      View company
                    </span>

                    <span className="text-sm text-zinc-600 transition group-hover:translate-x-1 group-hover:text-zinc-300">
                      →
                    </span>

                  </div>
                </Link>
              ))}
            </div>
          )}

        {/* Pagination */}
        {!loading &&
          !error &&
          pagination.totalPages > 1 && (
            <nav
              aria-label="Companies pagination"
              className="mt-10 flex items-center justify-center gap-2"
            >
              {/* Previous */}
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage((current) =>
                    Math.max(current - 1, 1)
                  )
                }
                className="rounded-xl border border-zinc-900 px-4 py-2.5 text-sm text-zinc-500 transition hover:border-zinc-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Previous page"
              >
                ←
              </button>

              {/* Page numbers */}
              {Array.from(
                {
                  length: pagination.totalPages,
                },
                (_, index) => index + 1
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() =>
                    setPage(pageNumber)
                  }
                  aria-current={
                    pageNumber === page
                      ? "page"
                      : undefined
                  }
                  className={`min-w-10 rounded-xl border px-3 py-2.5 text-sm transition ${
                    pageNumber === page
                      ? "border-zinc-600 bg-zinc-900 text-white"
                      : "border-zinc-900 text-zinc-600 hover:border-zinc-700 hover:text-white"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              {/* Next */}
              <button
                type="button"
                disabled={
                  page >= pagination.totalPages
                }
                onClick={() =>
                  setPage((current) =>
                    Math.min(
                      current + 1,
                      pagination.totalPages
                    )
                  )
                }
                className="rounded-xl border border-zinc-900 px-4 py-2.5 text-sm text-zinc-500 transition hover:border-zinc-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Next page"
              >
                →
              </button>
            </nav>
          )}
      </div>
    </main>
  );
}

/*
 * Filter pill
 */
function FilterPill({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-zinc-900 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-500">
      {label}

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="text-zinc-700 transition hover:text-white"
      >
        ×
      </button>
    </span>
  );
}

/*
 * Page wrapper
 *
 * Suspense is required because the page uses
 * useSearchParams().
 */
export default function CompaniesPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black text-white">
          <div className="mx-auto max-w-6xl px-6 py-16">

            <div className="h-3 w-28 animate-pulse rounded bg-zinc-900" />

            <div className="mt-4 h-12 w-48 animate-pulse rounded bg-zinc-900" />

            <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded bg-zinc-900" />

            <div className="mt-10 h-14 animate-pulse rounded-2xl bg-zinc-900" />

            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-56 animate-pulse rounded-2xl border border-zinc-900 bg-zinc-950"
                  />
                )
              )}
            </div>

          </div>
        </main>
      }
    >
      <CompaniesPageContent />
    </Suspense>
  );
}