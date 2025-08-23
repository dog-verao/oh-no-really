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

    const theme = await prisma.theme.create({
      data: {
        name: body.name,
        config: body.config,
        accountId: accountUser.accountId,
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

    const themes = await prisma.theme.findMany({
      where: {
        accountId: accountUser.accountId,
        id: {
          not: {
            startsWith: 'default_theme_',
          },
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
