import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") ?? "";
    const industry = searchParams.get("industry") ?? "";
    const country = searchParams.get("country") ?? "";
    const sort = searchParams.get("sort") ?? "name-asc";

    const page = Math.max(
      parseInt(searchParams.get("page") ?? "1", 10),
      1
    );

    const limit = Math.min(
      Math.max(
        parseInt(searchParams.get("limit") ?? "9", 10),
        1
      ),
      50
    );

    const where = {
      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),

      ...(industry ? { industry } : {}),
      ...(country ? { country } : {}),
    };

    let orderBy;

    switch (sort) {
      case "name-desc":
        orderBy = {
          name: "desc" as const,
        };
        break;

      case "newest":
        orderBy = {
          createdAt: "desc" as const,
        };
        break;

      case "featured":
        orderBy = [
          {
            featured: "desc" as const,
          },
          {
            name: "asc" as const,
          },
        ];
        break;

      case "name-asc":
      default:
        orderBy = {
          name: "asc" as const,
        };
        break;
    }

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),

      prisma.company.count({
        where,
      }),
    ]);

    return NextResponse.json({
      data: companies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/companies error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch companies",
      },
      {
        status: 500,
      }
    );
  }
}