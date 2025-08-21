import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // TODO: Get account ID from authenticated user session
    // For now, we'll use a hardcoded account ID until we implement proper auth
    const accountId = 'account_1'; // This should come from the authenticated user's session

    const theme = await prisma.theme.create({
      data: {
        name: body.name,
        config: body.config,
        accountId: accountId,
      },
    });

    return NextResponse.json(theme);
  } catch (error) {
    console.error('Error creating theme:', error);
    return NextResponse.json(
      { error: 'Failed to create theme', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // TODO: Get account ID from authenticated user session
    // For now, we'll use a hardcoded account ID until we implement proper auth
    const accountId = 'account_1'; // This should come from the authenticated user's session

    const themes = await prisma.theme.findMany({
      where: {
        accountId: accountId,
        id: {
          not: 'default_theme', // Exclude default theme from listing
        },
      },
    });

    return NextResponse.json(themes);
  } catch (error) {
    console.error('Error fetching themes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch themes' },
      { status: 500 }
    );
  }
}
