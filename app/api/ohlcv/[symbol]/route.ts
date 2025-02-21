import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  const symbol = params.symbol;

  try {
    const data = await fetch(`https://fomo-api-production.up.railway.app/ohlc/${symbol}`);
    const json = await data.json();

    if (!json) {
      return NextResponse.json({ error: 'No activity found' }, { status: 404 });
    }

    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to activty metadata' }, { status: 500 });
  }
}
