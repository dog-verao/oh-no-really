import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// TODO: account id should come from the auth context, not passed in as a parameter, we need to ensure row level security is enforced

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const announcement = await prisma.announcement.create({
      data: {
        title: body.title,
        message: body.content,
        themeId: body.themeId,
        accountId: body.accountId,
      },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const accountId = req.headers.get("x-account-id") as string;

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    const announcements = await prisma.announcement.findMany({
      where: {
        accountId: accountId,
      },
    });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}