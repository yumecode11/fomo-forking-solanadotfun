import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { token: string } }) {
  const token = params.token;

  try {
    // Fetch transaction data
    const response = await fetch(`https://api.helius.xyz/v0/addresses/${token}/transactions?api-key=${process.env.HELIUS_API_KEY}`);
    if (!response.ok) throw new Error('Failed to fetch transaction data');
    const data = await response.json();

    // Fetch SOL to USD price
    const solUsdcPriceResponse = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
    if (!solUsdcPriceResponse.ok) throw new Error('Failed to fetch SOL price');
    const solUsdcPriceData = await solUsdcPriceResponse.json();
    const solUsdcPrice = solUsdcPriceData.solana.usd;

    let formattedResponse: { formattedTime: string; type: string; usd: number; sol: number; maker: string; txn: string; }[] = [];

    data?.forEach((item: { timestamp: string; type: string; nativeTransfers: { amount: number; toUserAccount: string; }[]; signature: string; }) => {
      const { timestamp, type, nativeTransfers, signature } = item;
      const amount = (nativeTransfers[0]?.amount ?? 0) / 1_000_000_000;
      formattedResponse.push({
        formattedTime: timestamp,
        type: type === 'TRANSFER' ? 'Buy' : 'Sell',
        usd: parseFloat((amount * solUsdcPrice).toFixed(2)),
        sol: amount,
        txn: signature,
        maker: nativeTransfers[0]?.toUserAccount,
      });
    });

    return NextResponse.json({
      success: true,
      data: formattedResponse,
      total: data.length,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
