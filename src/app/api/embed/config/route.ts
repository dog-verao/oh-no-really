import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('account_id');
    const url = searchParams.get('url');
    const path = searchParams.get('path');

    if (!accountId) {
      return NextResponse.json(
        { error: 'Missing account_id parameter' },
        { status: 400 }
      );
    }

    // TODO: Add domain allowlist validation
    // TODO: Add proper caching headers
    // TODO: Add rate limiting

    // Find the account
    const account = await prisma.account.findUnique({
      where: { apiKey: accountId },
      include: {
        announcements: {
          where: {
            draft: false,
            publishedAt: { not: null },
          },
          include: {
            theme: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        themes: {
          where: {
            announcements: {
              some: {
                draft: false,
                publishedAt: { not: null },
              },
            },
          },
        },
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    // Filter announcements by target routes (for now, show all active announcements)
    // TODO: Implement proper route filtering based on path parameter
    const activeAnnouncements = account.announcements.filter(announcement => {
      // For MVP, show all active announcements
      // Later: filter by targetRoutes vs the requester path
      return true;
    });

    // Get unique themes used by active announcements
    const usedThemes = new Map();
    activeAnnouncements.forEach(announcement => {
      if (announcement.theme) {
        usedThemes.set(announcement.theme.id, announcement.theme);
      }
    });

    // Build the config response
    const config = {
      accountId: account.apiKey,
      widgetUrl: 'http://localhost:3000/widget/v1/widget.js', // Updated for local development
      themes: Array.from(usedThemes.values()).map(theme => ({
        id: theme.id,
        name: theme.name,
        config: theme.config,
      })),
      announcements: activeAnnouncements.map(announcement => ({
        id: announcement.id,
        title: announcement.title,
        message: announcement.message,
        buttons: announcement.buttons,
        themeId: announcement.themeId,
        // TODO: Add placement, frequency, targetRoutes fields to Announcement model
        placement: 'modal', // Changed to modal for testing
        frequency: 'always', // Default for MVP
        targetRoutes: ['*'], // Default for MVP - show on all routes
      })),
      version: generateVersionHash(activeAnnouncements, Array.from(usedThemes.values())),
      cacheTTL: 300, // 5 minutes
    };

    // Add CORS headers for cross-origin requests
    const response = NextResponse.json(config);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    response.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=86400');

    return response;
  } catch (error) {
    console.error('Embed config error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

// Generate a deterministic version hash for caching
function generateVersionHash(announcements: any[], themes: any[]): string {
  const data = {
    announcements: announcements.map(a => ({
      id: a.id,
      updatedAt: a.updatedAt,
    })),
    themes: themes.map(t => ({
      id: t.id,
      updatedAt: t.updatedAt,
    })),
  };

  // Simple hash for MVP - in production, use a proper hashing library
  return Buffer.from(JSON.stringify(data)).toString('base64').slice(0, 16);
}
