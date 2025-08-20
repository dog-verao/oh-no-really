import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// TODO: account id should come from the auth context, not passed in as a parameter, we need to ensure row level security is enforced
export async function GET(
  req: NextRequest,
  { params }: { params: { announcement_id: string } }
) {
  try {
    const announcementId = params.announcement_id;

    const announcement = await prisma.announcement.findUnique({
      where: {
        id: announcementId,
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
  { params }: { params: { announcement_id: string } }
) {
  try {
    const announcementId = params.announcement_id;
    const body = await req.json();

    const announcement = await prisma.announcement.update({
      where: {
        id: announcementId,
      },
      data: {
        title: body.title,
        message: body.content,
        themeId: body.themeId,
        accountId: body.accountId,
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
