import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received selectors:', body);

    // For now, just log the selectors and return success
    // In the future, this could save to a database
    return NextResponse.json({
      success: true,
      message: 'Selectors received successfully',
      count: body.selectors?.length || 0
    });
  } catch (error) {
    console.error('Error processing selectors:', error);
    return NextResponse.json(
      { error: 'Failed to process selectors' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // For now, return empty array
  // In the future, this could fetch from a database
  return NextResponse.json([]);
}
