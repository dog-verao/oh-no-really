import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name, accountName, email } = body;

    // Verify the request is authenticated
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create the account
    const account = await prisma.account.create({
      data: {
        name: accountName,
        apiKey: `nf_${Math.random().toString(36).substr(2, 9)}_${Date.now().toString(36)}`,
      },
    });

    // Create the account-user relationship with owner role
    await prisma.accountUser.create({
      data: {
        accountId: account.id,
        userId: userId, // Use Supabase user ID directly
        role: 'owner',
      },
    });

    return NextResponse.json({
      success: true,
      account: {
        id: account.id,
        name: account.name,
        apiKey: account.apiKey,
      },
      user: {
        id: userId,
        email,
        name,
      },
    });
  } catch (error) {
    console.error('Error setting up account:', error);
    return NextResponse.json(
      { error: 'Failed to setup account', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
