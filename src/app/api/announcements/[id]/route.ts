import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: announcementId } = await params;

    // Get the authenticated user and their account
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the user's account
    const accountUser = await prisma.accountUser.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!accountUser) {
      return NextResponse.json(
        { error: 'No account found for user' },
        { status: 404 }
      );
    }

    const announcement = await prisma.announcement.findFirst({
      where: {
        id: announcementId,
        accountId: accountUser.accountId, // Ensure user can only access their own announcements
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: announcementId } = await params;
    const body = await req.json();

    // Get the authenticated user and their account
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the user's account
    const accountUser = await prisma.accountUser.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!accountUser) {
      return NextResponse.json(
        { error: 'No account found for user' },
        { status: 404 }
      );
    }

    // First verify the announcement belongs to this account
    const existingAnnouncement = await prisma.announcement.findFirst({
      where: {
        id: announcementId,
        accountId: accountUser.accountId,
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
        placement: body.placement || 'modal',
        buttons: body.buttons || null,
        // Don't allow changing accountId or createdBy for security
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: announcementId } = await params;

    // Get the authenticated user and their account
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the user's account
    const accountUser = await prisma.accountUser.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!accountUser) {
      return NextResponse.json(
        { error: 'No account found for user' },
        { status: 404 }
      );
    }

    // First verify the announcement belongs to this account
    const existingAnnouncement = await prisma.announcement.findFirst({
      where: {
        id: announcementId,
        accountId: accountUser.accountId,
      },
    });

    if (!existingAnnouncement) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      );
    }

    await prisma.announcement.delete({
      where: {
        id: announcementId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json(
      { error: 'Failed to delete announcement' },
      { status: 500 }
    );
  }
}
