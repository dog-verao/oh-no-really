import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('account_id');

    if (!accountId) {
      return new NextResponse('Account ID is required', {
        status: 400,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

    // Check if the account exists (try by ID first, then by API key)
    let account = await prisma.account.findUnique({
      where: {
        id: accountId
      },
      select: {
        id: true,
        name: true
      }
    });

    // If not found by ID, try by API key
    if (!account) {
      account = await prisma.account.findUnique({
        where: {
          apiKey: accountId
        },
        select: {
          id: true,
          name: true
        }
      });
    }

    console.log('Looking for account:', accountId);
    console.log('Account found:', account);

    if (!account) {
      return new NextResponse('Account not found', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

    // Use the actual account ID for the query
    const actualAccountId = account.id;

    // First, let's check all announcements for this account to debug
    const allAnnouncements = await prisma.announcement.findMany({
      where: {
        accountId: actualAccountId,
      },
      select: {
        id: true,
        title: true,
        message: true,
        placement: true,
        buttons: true,
        createdAt: true,
        draft: true,
        publishedAt: true,
        theme: {
          select: {
            config: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('All announcements for account:', allAnnouncements);

    // Filter for published announcements
    const announcements = allAnnouncements.filter(announcement =>
      !announcement.draft && announcement.publishedAt !== null
    );

    console.log('Published announcements:', announcements);

    // Transform the data to match the widget's expected format
    const transformedAnnouncements = announcements.map(announcement => ({
      id: announcement.id,
      title: announcement.title,
      message: announcement.message,
      placement: announcement.placement,
      buttons: announcement.buttons,
      themeConfig: announcement.theme?.config || {
        modal: {
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          titleColor: '#1a1a1a'
        },
        button: {
          backgroundColor: '#1a1a1a',
          textColor: '#ffffff',
          borderRadius: '8px'
        },
        secondaryButton: {
          backgroundColor: 'transparent',
          textColor: '#1a1a1a',
          borderColor: '#e0e0e0',
          borderRadius: '8px'
        }
      }
    }));

    console.log('Found announcements:', transformedAnnouncements);

    // Return the announcements with proper headers
    return new NextResponse(JSON.stringify(transformedAnnouncements), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        'Access-Control-Allow-Origin': '*', // Allow CORS for widget embedding
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error in announcements API:', error);
    return new NextResponse('Internal server error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
