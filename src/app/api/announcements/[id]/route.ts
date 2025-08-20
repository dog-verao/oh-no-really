import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const announcementId = params.id;
    const accountId = req.headers.get("x-account-id") as string;

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    const announcement = await prisma.announcement.findFirst({
      where: {
        id: announcementId,
        accountId: accountId, // Ensure user can only access their own announcements
      },
    });

    if (!announcement) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(announcement);
  } catch (error) {
    console.error('Error fetching announcement:', error);
    return NextResponse.json(
      { error: 'Failed to fetch announcement' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const announcementId = params.id;
    const accountId = req.headers.get("x-account-id") as string;
    const body = await req.json();

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    // First verify the announcement belongs to this account
    const existingAnnouncement = await prisma.announcement.findFirst({
      where: {
        id: announcementId,
        accountId: accountId,
      },
    });

    if (!existingAnnouncement) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      );
    }

    const announcement = await prisma.announcement.update({
      where: {
        id: announcementId,
      },
      data: {
        title: body.title,
        message: body.content,
        themeId: body.themeId,
        // Don't allow changing accountId for security
      },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json(
      { error: 'Failed to update announcement' },
      { status: 500 }
    );
  }
}
