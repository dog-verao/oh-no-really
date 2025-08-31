import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
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

    const announcement = await prisma.announcement.create({
      data: {
        title: body.title,
        message: body.content,
        themeId: body.themeId,
        placement: body.placement || 'modal',
        accountId: accountUser.accountId,
        buttons: body.buttons || null,
      },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { error: 'Failed to create announcement', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const placement = searchParams.get('placement');

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

    // Build the where clause
    const whereClause: any = {
      accountId: accountUser.accountId,
    };

    // Add placement filter if provided
    if (placement) {
      whereClause.placement = placement;
    }

    const announcements = await prisma.announcement.findMany({
      where: whereClause,
      include: {
        theme: true,
      },
      orderBy: {
        createdAt: 'desc',
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