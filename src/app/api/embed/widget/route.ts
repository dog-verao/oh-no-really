import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    // Path to the built widget bundle
    const widgetPath = join(process.cwd(), 'widget', 'dist', 'announcements-widget.umd.js');

    // Read the widget bundle
    const widgetContent = readFileSync(widgetPath, 'utf-8');

    // Return the widget with proper headers
    return new NextResponse(widgetContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error serving widget bundle:', error);
    return new NextResponse('Widget bundle not found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}


