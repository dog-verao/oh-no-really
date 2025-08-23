import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: themeId } = await params;

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

    const theme = await prisma.theme.findFirst({
      where: {
        id: themeId,
        accountId: accountUser.accountId, // Ensure user can only access their own themes
      },
    });

    if (!theme) {
      return NextResponse.json(
        { error: 'Theme not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(theme);
  } catch (error) {
    console.error('Error fetching theme:', error);
    return NextResponse.json(
      { error: 'Failed to fetch theme' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: themeId } = await params;
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

    // First verify the theme belongs to this account
    const existingTheme = await prisma.theme.findFirst({
      where: {
        id: themeId,
        accountId: accountUser.accountId,
      },
    });

    if (!existingTheme) {
      return NextResponse.json(
        { error: 'Theme not found' },
        { status: 404 }
      );
    }

    const theme = await prisma.theme.update({
      where: {
        id: themeId,
      },
      data: {
        name: body.name,
        config: body.config,
        // Don't allow changing accountId for security
      },
    });

    return NextResponse.json(theme);
  } catch (error) {
    console.error('Error updating theme:', error);
    return NextResponse.json(
      { error: 'Failed to update theme' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: themeId } = await params;

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

    // First verify the theme belongs to this account
    const existingTheme = await prisma.theme.findFirst({
      where: {
        id: themeId,
        accountId: accountUser.accountId,
      },
    });

    if (!existingTheme) {
      return NextResponse.json(
        { error: 'Theme not found' },
        { status: 404 }
      );
    }

    // Check if theme is being used by any announcements
    const announcementsUsingTheme = await prisma.announcement.findMany({
      where: {
        themeId: themeId,
      },
    });

    if (announcementsUsingTheme.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete theme that is being used by announcements' },
        { status: 400 }
      );
    }

    await prisma.theme.delete({
      where: {
        id: themeId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting theme:', error);
    return NextResponse.json(
      { error: 'Failed to delete theme' },
      { status: 500 }
    );
  }
}
