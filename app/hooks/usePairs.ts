import { BondingCurveLayout, RawBondingCurveLayout } from "@/types";
import { splitArray } from "@/utils";
import { program } from "@coral-xyz/anchor/dist/cjs/native/system";
import { getMultipleAccountsInfo } from "@raydium-io/raydium-sdk-v2";
import { getAssociatedTokenAddressSync, getAccount, TOKEN_2022_PROGRAM_ID, getMint, MintLayout, MINT_SIZE, AccountLayout } from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { connect } from "http2";

export default function usePairs() {

	const endpoint = "https://rpc.ironforge.network/mainnet?apiKey=01HRZ9G6Z2A19FY8PR4RF4J4PW"
	const connection = new Connection(endpoint)

	const fetchPairs = async () => {
		const response = await fetch("/api/pairs/new?count=500");
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const data = await response.json()

		let bondingCurve: RawBondingCurveLayout[] = []

		const bondingCurves = data.map((ele: any) => new PublicKey(ele.address))
		const splitedBondingCurve = splitArray(bondingCurves, 100)
		const tempBCs = splitedBondingCurve.map(async (ele) => {
			const accountsInfo = await connection.getMultipleAccountsInfo(ele);
			const data = accountsInfo.map(eles => {
				if (eles == null) return
				//	@ts-ignore
				bondingCurve.push(BondingCurveLayout.decode(eles.data))

				console.log("BondingCurveLayout : ", BondingCurveLayout.decode(eles.data));
				//	@ts-ignore
				return eles.lamports
			})
			return await Promise.all(data);
		})

		await Promise.all(tempBCs);

		//	@ts-ignore
		console.log(bondingCurve);

		const returnData = data.map((ele: any, idx: number) => {
			return {
				...ele,
				balance: Number(bondingCurve[idx].virtualSolReserves),
				tokenBalance: Number(bondingCurve[idx].virtualTokenReserves),
				supply: Number(bondingCurve[idx].tokenTotalSupply),
				price: Number(bondingCurve[idx].virtualSolReserves) / Number(bondingCurve[idx].virtualTokenReserves)
			}

		})
		return returnData
	};

	const {
		data: pairs,
		isLoading,
		error,
	} = useQuery({
		// select: (data) => data.filter((pair:any) => pair.token !== 'Unknown'),
		queryKey: ["pairs"],
		queryFn: fetchPairs,
		staleTime: 250000,
	});

	return {
		pairs,
		isLoading,
		error,
	};
}
