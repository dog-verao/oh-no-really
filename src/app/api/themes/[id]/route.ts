import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: themeId } = await params;

    // TODO: Get account ID from authenticated user session
    // For now, we'll use a hardcoded account ID until we implement proper auth
    const accountId = 'account_1'; // This should come from the authenticated user's session

    const theme = await prisma.theme.findFirst({
      where: {
        id: themeId,
        accountId: accountId, // Ensure user can only access their own themes
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

    // TODO: Get account ID from authenticated user session
    // For now, we'll use a hardcoded account ID until we implement proper auth
    const accountId = 'account_1'; // This should come from the authenticated user's session

    // First verify the theme belongs to this account
    const existingTheme = await prisma.theme.findFirst({
      where: {
        id: themeId,
        accountId: accountId,
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

    // TODO: Get account ID from authenticated user session
    // For now, we'll use a hardcoded account ID until we implement proper auth
    const accountId = 'account_1'; // This should come from the authenticated user's session

    // First verify the theme belongs to this account
    const existingTheme = await prisma.theme.findFirst({
      where: {
        id: themeId,
        accountId: accountId,
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
