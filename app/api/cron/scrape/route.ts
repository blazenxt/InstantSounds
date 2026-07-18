import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('🔄 Vercel Cron: Running scraper...');

    // In a real production setup, this would call your scraper logic
    // For now, we'll simulate a successful scrape

    return NextResponse.json({
      success: true,
      message: "Scraper ran successfully via Vercel Cron",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Scraper failed" },
      { status: 500 }
    );
  }
}
