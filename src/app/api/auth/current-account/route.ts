import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  try {
    // Verify the request is authenticated
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the user's account through the AccountUser relationship
    let accountUser = await prisma.accountUser.findFirst({
      where: {
        userId: user.id,
      },
      include: {
        account: true,
      },
    });

    // If no account exists, create one automatically
    if (!accountUser) {
      // Create a default account
      const account = await prisma.account.create({
        data: {
          name: `${user.user_metadata?.name || 'User'}'s Account`,
          apiKey: `nf_${Math.random().toString(36).substr(2, 9)}_${Date.now().toString(36)}`,
        },
      });

      // Create the account-user relationship with owner role
      accountUser = await prisma.accountUser.create({
        data: {
          accountId: account.id,
          userId: user.id, // Use Supabase user ID directly
          role: 'owner',
        },
        include: {
          account: true,
        },
      });

      // Create default theme for the new account
      await prisma.theme.upsert({
        where: { id: `default_theme_${account.id}` },
        update: {},
        create: {
          id: `default_theme_${account.id}`,
          name: 'Default Theme',
          accountId: account.id,
          config: {
            modal: {
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              titleColor: '#1a1a1a',
            },
            button: {
              backgroundColor: '#007bff',
              textColor: '#ffffff',
              borderRadius: '8px',
            },
            secondaryButton: {
              backgroundColor: '#ffffff',
              textColor: '#6c757d',
              borderColor: '#6c757d',
              borderRadius: '8px',
            },
          },
        },
      });
    }

    return NextResponse.json({
      account: {
        id: accountUser.account.id,
        name: accountUser.account.name,
        apiKey: accountUser.account.apiKey,
      },
    });
  } catch (error) {
    console.error('Error fetching current account:', error);
    return NextResponse.json(
      { error: 'Failed to fetch current account', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
