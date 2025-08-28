import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get all accounts
    const accounts = await prisma.account.findMany({
      select: {
        id: true,
        name: true,
        apiKey: true,
        createdAt: true,
        _count: {
          select: {
            announcements: true
          }
        }
      }
    });

    // Get all announcements
    const announcements = await prisma.announcement.findMany({
      select: {
        id: true,
        title: true,
        accountId: true,
        draft: true,
        publishedAt: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return new NextResponse(JSON.stringify({
      accounts,
      announcements
    }, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Debug error:', error);
    return new NextResponse('Debug error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}


