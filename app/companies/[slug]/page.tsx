"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

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

export default function CompanyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCompany() {
      try {
        const response = await fetch(`/api/companies/${slug}`);

        if (!response.ok) {
          throw new Error("Company not found");
        }

        const result = await response.json();
        setCompany(result.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load company.");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadCompany();
    }
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-5 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="h-6 w-40 animate-pulse rounded bg-zinc-900" />
          <div className="mt-10 h-12 w-80 animate-pulse rounded bg-zinc-900" />
          <div className="mt-5 h-24 max-w-3xl animate-pulse rounded bg-zinc-900" />
        </div>
      </main>
    );
  }

  if (error || !company) {
    return (
      <main className="min-h-screen bg-black px-5 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/companies"
            className="text-sm text-zinc-500 hover:text-white"
          >
            ← Back to companies
          </Link>

          <div className="mt-10 rounded-2xl border border-zinc-900 bg-zinc-950 p-12 text-center">
            <h1 className="text-xl font-medium">
              Company not found
            </h1>

            <p className="mt-2 text-sm text-zinc-600">
              This company could not be loaded.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-600">
          <Link
            href="/"
            className="hover:text-zinc-300"
          >
            AI Orbit
          </Link>

          <span>/</span>

          <Link
            href="/companies"
            className="hover:text-zinc-300"
          >
            Companies
          </Link>

          <span>/</span>

          <span className="text-zinc-500">
            {company.name}
          </span>
        </div>

        {/* Back */}
        <Link
          href="/companies"
          className="mt-8 inline-flex text-sm text-zinc-500 transition hover:text-white"
        >
          ← Back to companies
        </Link>

        {/* Main company card */}
        <section className="mt-6 rounded-2xl border border-zinc-900 bg-zinc-950 p-6 sm:p-8 md:p-10">

          {/* Header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

            <div className="flex items-start gap-5">

              {/* Logo */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-2xl font-semibold text-zinc-300">
                {company.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    {company.name}
                  </h1>

                  {company.featured && (
                    <span className="rounded-full border border-zinc-800 px-2.5 py-1 text-[11px] text-zinc-500">
                      Featured
                    </span>
                  )}
                </div>

                {company.industry && (
                  <p className="mt-2 text-sm text-zinc-600">
                    {company.industry}
                  </p>
                )}
              </div>
            </div>

            {/* Website */}
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl border border-zinc-800 px-4 py-2.5 text-sm text-zinc-400 transition hover:border-zinc-600 hover:bg-zinc-900 hover:text-white"
              >
                Visit website ↗
              </a>
            )}
          </div>

          {/* Description */}
          <div className="mt-8 max-w-3xl">
            <p className="text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
              {company.description}
            </p>
          </div>

          {/* Details */}
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {company.location && (
              <InfoCard
                label="Location"
                value={
                  company.country
                    ? `${company.location}, ${company.country}`
                    : company.location
                }
              />
            )}

            {company.foundedYear && (
              <InfoCard
                label="Founded"
                value={String(company.foundedYear)}
              />
            )}

            {company.employees && (
              <InfoCard
                label="Employees"
                value={company.employees}
              />
            )}

            {company.stage && (
              <InfoCard
                label="Stage"
                value={company.stage}
              />
            )}
          </div>

          {/* Funding */}
          {company.funding && (
            <div className="mt-3">
              <InfoCard
                label="Funding"
                value={company.funding}
              />
            </div>
          )}

        </section>

        {/* Additional section */}
        <section className="mt-6 grid gap-6 md:grid-cols-2">

          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6">
            <h2 className="text-sm font-medium text-zinc-300">
              Company overview
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Explore information about {company.name},
              including its industry, location, company
              stage, and other available details.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6">
            <h2 className="text-sm font-medium text-zinc-300">
              Links
            </h2>

            <div className="mt-4">
              {company.website ? (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-400 hover:text-white"
                >
                  Official website ↗
                </a>
              ) : (
                <p className="text-sm text-zinc-600">
                  No website available.
                </p>
              )}
            </div>
          </div>

        </section>
      </div>
    </main>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-900 bg-black p-5">
      <p className="text-[11px] uppercase tracking-wider text-zinc-600">
        {label}
      </p>

      <p className="mt-2 text-sm text-zinc-300">
        {value}
      </p>
    </div>
  );
}