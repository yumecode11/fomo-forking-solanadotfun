import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  try {
    const data = await fetch('https://fomo-api-production.up.railway.app/pairs');
    const json = await data.json();

    if (!json) {
      return NextResponse.json({ error: 'No pairs found' }, { status: 404 });
    }

    return NextResponse.json(json);
  } catch (error) {
    // Handle any errors
    return NextResponse.json({ error: 'Failed to fetch pairs' }, { status: 500 });
  }
}
