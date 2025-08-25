import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const announcementId = params.id;

    // Get the user's account
    const accountUser = await prisma.accountUser.findFirst({
      where: { userId: user.id },
      include: { account: true },
    });

    if (!accountUser) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    // Get the announcement and verify it belongs to the user's account
    const announcement = await prisma.announcement.findFirst({
      where: {
        id: announcementId,
        accountId: accountUser.accountId,
      },
    });

    if (!announcement) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      );
    }

    // Publish the announcement
    const updatedAnnouncement = await prisma.announcement.update({
      where: { id: announcementId },
      data: {
        draft: false,
        publishedAt: new Date(),
      },
    });

    return NextResponse.json(updatedAnnouncement);
  } catch (error) {
    console.error('Error publishing announcement:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
