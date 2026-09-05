import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const industry = searchParams.get("industry") || "";
    const country = searchParams.get("country") || "";
    const sort = searchParams.get("sort") ?? "name-asc";

    const page = Math.max(
      Number(searchParams.get("page") || "1"),
      1
    );

    const limit = Math.min(
      Math.max(Number(searchParams.get("limit") || "9"), 1),
      50
    );

    const skip = (page - 1) * limit;

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

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        orderBy: {
          name: "asc",
        },
        skip,
        take: limit,
      }),
      prisma.company.count({ where }),
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
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}