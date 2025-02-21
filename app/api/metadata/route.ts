import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  try {
    const pairDetails = await fetch('https://fomo-api-production.up.railway.app/pairs');
    const pairDetailsJson = await pairDetails.json();

    // Find the pair that matches the token
    const pair = pairDetailsJson.find((pair: any) => pair.mint.address === token);
    if (!pair) {
      return NextResponse.json({ error: 'Pair not found' }, { status: 404 });
    }

    return NextResponse.json(pair);
  } catch (error) {
    // Handle any errors
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 });
  }
}
