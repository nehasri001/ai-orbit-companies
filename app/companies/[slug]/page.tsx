import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CompanyDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const company = await prisma.company.findUnique({
    where: {
      slug,
    },
  });

  if (!company) {
    notFound();
  }

  const initial = company.name.charAt(0).toUpperCase();

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

          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">

            <div className="flex items-start gap-5">

              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] text-3xl font-semibold">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initial
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
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
                className="inline-flex rounded-lg border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
              >
                Visit website ↗
              </a>
            )}
          </div>

          {company.description && (
            <p className="mt-8 max-w-3xl text-lg leading-8 text-white/60">
              {company.description}
            </p>
          )}

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {company.location && (
              <div className="rounded-xl border border-white/10 p-5">
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Location
                </p>

                <p className="mt-2 text-sm text-white/80">
                  {company.location}
                  {company.country
                    ? `, ${company.country}`
                    : ""}
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