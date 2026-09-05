"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

export default function CompanyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCompany() {
      try {
        setLoading(true);

        const response = await fetch(`/api/companies/${slug}`);

        if (!response.ok) {
          throw new Error("Company not found");
        }

        const result = await response.json();
        setCompany(result.data);
      } catch {
        setError("Unable to load company");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchCompany();
    }
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-12 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="h-5 w-32 animate-pulse rounded bg-white/10" />
          <div className="mt-10 h-12 w-72 animate-pulse rounded bg-white/10" />
          <div className="mt-5 h-24 max-w-3xl animate-pulse rounded bg-white/10" />
        </div>
      </main>
    );
  }

  if (error || !company) {
    return (
      <main className="min-h-screen bg-black px-6 py-12 text-white">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/companies"
            className="text-sm text-white/50 hover:text-white"
          >
            ← Back to companies
          </Link>

          <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <h1 className="text-2xl font-semibold">
              Company not found
            </h1>
            <p className="mt-3 text-white/50">
              We couldn't load this company.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">

        <Link
          href="/companies"
          className="text-sm text-white/50 transition hover:text-white"
        >
          ← Back to companies
        </Link>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10">

          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

            <div className="flex items-start gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-3xl font-semibold">
                {company.name.charAt(0)}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-4xl font-semibold tracking-tight">
                    {company.name}
                  </h1>

                  {company.featured && (
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                      Featured
                    </span>
                  )}
                </div>

                {company.industry && (
                  <p className="mt-2 text-white/50">
                    {company.industry}
                  </p>
                )}
              </div>
            </div>

            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
              >
                Visit website ↗
              </a>
            )}
          </div>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-white/60">
            {company.description}
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">

            {company.location && (
              <div className="rounded-xl border border-white/10 p-5">
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Location
                </p>
                <p className="mt-2 text-sm text-white/80">
                  {company.location}
                  {company.country ? `, ${company.country}` : ""}
                </p>
              </div>
            )}

            {company.foundedYear && (
              <div className="rounded-xl border border-white/10 p-5">
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Founded
                </p>
                <p className="mt-2 text-sm text-white/80">
                  {company.foundedYear}
                </p>
              </div>
            )}

            {company.employees && (
              <div className="rounded-xl border border-white/10 p-5">
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Employees
                </p>
                <p className="mt-2 text-sm text-white/80">
                  {company.employees}
                </p>
              </div>
            )}

            {company.stage && (
              <div className="rounded-xl border border-white/10 p-5">
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Stage
                </p>
                <p className="mt-2 text-sm text-white/80">
                  {company.stage}
                </p>
              </div>
            )}
          </div>

          {company.funding && (
            <div className="mt-4 rounded-xl border border-white/10 p-5">
              <p className="text-xs uppercase tracking-wider text-white/35">
                Funding
              </p>
              <p className="mt-2 text-sm text-white/80">
                {company.funding}
              </p>
            </div>
          )}

        </section>

      </div>
    </main>
  );
}