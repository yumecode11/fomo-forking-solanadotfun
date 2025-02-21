"use client";

import { Icon } from "@iconify/react";
import { Button, Card, CardBody, Input, Progress, Tab, Tabs } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SidebarStats from "@/components/sidebar-stats";
import SlippageInput from "@/components/slippage-input";
import AmountInput from "@/components/amount-input";
import { useEffect, useMemo, useState } from "react";
import { createAssociatedTokenAccountInstruction, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
	AddressLookupTableAccount,
	ComputeBudgetProgram,
	Connection,
	PublicKey,
	SystemProgram,
	SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
	Transaction,
	TransactionInstruction,
	TransactionMessage,
	VersionedTransaction,
} from "@solana/web3.js";
import { BN } from "bn.js";
import {
	CREATE_CPMM_POOL_PROGRAM,
	getCreatePoolKeys,
	getPdaPoolAuthority,
	getPdaPoolId,
	makeDepositCpmmInInstruction,
	makeInitializeMetadata,
	makeWithdrawCpmmInInstruction,
	METADATA_PROGRAM_ID,
	TokenInfo,
} from "tokengobbler";

import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { createJupiterApiClient } from "@jup-ag/api";
import { createAssociatedLedgerAccountInstruction } from "@raydium-io/raydium-sdk-v2";

class LPAMM {
	constructor(public virtualSolReserves: bigint, public virtualTokenReserves: bigint, public realSolReserves: bigint, public realTokenReserves: bigint, public initialVirtualTokenReserves: bigint) {}

	mintPubkey: PublicKey | null = null;

	getBuyPrice(tokens: bigint): bigint {
		if (tokens === BigInt(0) || tokens > this.virtualTokenReserves) {
			throw new Error("Invalid token amount");
		}

		const productOfReserves = this.virtualSolReserves * this.virtualTokenReserves;
		const newVirtualTokenReserves = this.virtualTokenReserves - tokens;
		const newVirtualSolReserves = productOfReserves / newVirtualTokenReserves + BigInt(1);
		return newVirtualSolReserves - this.virtualSolReserves;
	}

	getSellPrice(tokens: bigint): bigint {
		if (tokens === BigInt(0) || tokens > this.virtualTokenReserves) {
			throw new Error("Invalid token amount");
		}

		const productOfReserves = this.virtualSolReserves * this.virtualTokenReserves;
		const newVirtualTokenReserves = this.virtualTokenReserves + tokens;
		const newVirtualSolReserves = productOfReserves / newVirtualTokenReserves;
		const solAmount = this.virtualSolReserves - newVirtualSolReserves;
		return solAmount < this.realSolReserves ? solAmount : this.realSolReserves;
	}

	getBuyTokensWithSol(solAmount: bigint): { tokenAmount: bigint; solAmount: bigint } {
		if (solAmount <= 0n) {
			return { tokenAmount: 0n, solAmount: 0n };
		}

		// Calculate the product of virtual reserves
		const n = this.virtualSolReserves * this.virtualTokenReserves;

		// Calculate the new virtual sol reserves after the purchase
		const i = this.virtualSolReserves + solAmount;

		// Calculate the new virtual token reserves after the purchase
		const r = n / i + 1n;

		// Calculate the amount of tokens to be purchased
		let s = this.virtualTokenReserves - r;

		// Ensure we don't exceed the real token reserves
		s = s < this.realTokenReserves ? s : this.realTokenReserves;

		// Ensure we're not returning zero tokens
		if (s === 0n && solAmount > 0n) {
			s = 1n;
		}

		return { tokenAmount: s, solAmount };
	}
	applyBuy(tokenAmount: bigint): { tokenAmount: bigint; solAmount: bigint } {
		const finalTokenAmount = tokenAmount < this.realTokenReserves ? tokenAmount : this.realTokenReserves;
		const solAmount = this.getBuyPrice(finalTokenAmount);

		this.virtualTokenReserves -= finalTokenAmount;
		this.realTokenReserves -= finalTokenAmount;
		this.virtualSolReserves += solAmount;
		this.realSolReserves += solAmount;

		return { tokenAmount: finalTokenAmount, solAmount };
	}

	applySell(tokenAmount: bigint): { tokenAmount: bigint; solAmount: bigint } {
		const solAmount = this.getSellPrice(tokenAmount);

		this.virtualTokenReserves += tokenAmount;
		this.realTokenReserves += tokenAmount;
		this.virtualSolReserves -= solAmount;
		this.realSolReserves -= solAmount;

		return { tokenAmount, solAmount };
	}
}
export default function SingleTokenSidebar({
	token,
}: {
	token: any;
}) {
  if (!token) return null;

	const [solusdc, setSolusdc] = useState(150);
	const [sellAmount, setSellAmount] = useState("");
	const [buyIsProcessing, setBuyIsProcessing] = useState(false);
	const [sellIsProcessing, setSellIsProcessing] = useState(false);

	const RPC_URL = "https://rpc.ironforge.network/mainnet?apiKey=01HRZ9G6Z2A19FY8PR4RF4J4PW";
	const wallet = useWallet();
	const connection = new Connection(RPC_URL);
	const aw = useAnchorWallet();

	// RPC URL and necessary program IDs

	const PROGRAM_IDS = ["65YAWs68bmR2RpQrs2zyRNTum2NRrdWzUfUTew9kydN9", "Ei1CgRq6SMB8wQScEKeRMGYkyb3YmRTaej1hpHcqAV9r"];
	const jupiterApi = createJupiterApiClient({ basePath: "https://superswap.fomo3d.fun" });
	// Buy function
	const handleBuy = async () => {
		if (!aw) return null;
		const PROGRAM_ID = new PublicKey(token.programId);
		const provider = new AnchorProvider(connection, aw, {});
		const IDL = await Program.fetchIdl(new PublicKey(token.programId), provider);
		const program = new Program(IDL as any, provider);

		if (!wallet.publicKey || !program) {
			console.error("Wallet not connected or program not initialized");
			return;
		}
		setBuyIsProcessing(true);
		try {
			const tokenMint = new PublicKey(token.mint); // Replace with actual token mint address

			const [bondingCurvePda] = PublicKey.findProgramAddressSync([Buffer.from("bonding-curve"), tokenMint.toBuffer()], PROGRAM_ID);
			const [globalPda] = PublicKey.findProgramAddressSync([Buffer.from("global")], PROGRAM_ID);
			const ai = await connection.getAccountInfo(tokenMint);
			const userTokenAccount = getAssociatedTokenAddressSync(tokenMint, wallet.publicKey, true, ai?.owner || TOKEN_PROGRAM_ID);

			const bondingCurveTokenAccount = getAssociatedTokenAddressSync(tokenMint, bondingCurvePda, true, ai?.owner || TOKEN_PROGRAM_ID);

			const amountLamports = new BN(parseFloat(amount) * 10 ** 9);
			const ammAcc = await connection.getAccountInfo(bondingCurvePda);
			const data = ammAcc?.data.slice(8);
			const amm = new LPAMM(
				data?.readBigUInt64LE(0) || BigInt(0),
				data?.readBigUInt64LE(8) || BigInt(0),
				data?.readBigUInt64LE(16) || BigInt(0),
				data?.readBigUInt64LE(24) || BigInt(0),
				data?.readBigUInt64LE(32) || BigInt(0)
			);

			const { tokenAmount } = amm.getBuyTokensWithSol(BigInt(amountLamports.toString()));

			if (!token.isBondingCurve) {
				const tokenAMint = new PublicKey(token.baseTokenMint);
				const tokenBMint = new PublicKey(token.quoteTokenMint);
				const isFront = new BN(tokenAMint.toBuffer()).lte(new BN(tokenBMint.toBuffer()));

				const [mintA, mintB] = isFront ? [tokenAMint, tokenBMint] : [tokenBMint, tokenAMint];
				const aa = new BN(amountLamports.toString());
				const ab = new BN(0); // Assuming we're only depositing one token

				const configId = 0;
				const [ammConfigKey, _bump] = PublicKey.findProgramAddressSync([Buffer.from("amm_config"), new BN(configId).toArrayLike(Buffer, "be", 8)], CREATE_CPMM_POOL_PROGRAM);
				const poolKeys = getCreatePoolKeys({
					creator: wallet.publicKey,
					programId: CREATE_CPMM_POOL_PROGRAM,
					mintA,
					mintB,
					configId: ammConfigKey,
				});
				poolKeys.configId = ammConfigKey;
				// Initialize Jupiter API
				// Fetch quote for swapping SOL to tokenA
				const quoteA = await jupiterApi.quoteGet({
					inputMint: "So11111111111111111111111111111111111111112", // SOL mint address
					outputMint: mintA.toString(),
					amount: Number(amountLamports),
					slippageBps: 1000, // 1% slippage
				});

				// Fetch quote for swapping SOL to tokenB
				const quoteB = await jupiterApi.quoteGet({
					inputMint: "So11111111111111111111111111111111111111112", // SOL mint address
					outputMint: mintB.toString(),
					amount: Number(amountLamports),
					slippageBps: 1000, // 1% slippage
				});

				if (!quoteA || !quoteB) {
					throw new Error("Failed to fetch quotes");
				}
				// Perform swaps
				const swapResultA = await jupiterApi.swapPost({
					swapRequest: {
						userPublicKey: wallet.publicKey.toBase58(),
						quoteResponse: quoteA,
						wrapAndUnwrapSol: true,
					},
				});
				const swapResultB = await jupiterApi.swapPost({
					swapRequest: {
						userPublicKey: wallet.publicKey.toBase58(),
						quoteResponse: quoteB,
						wrapAndUnwrapSol: true,
					},
				});
				// Deserialize the swap transactions
				const swapTransactionA = Buffer.from(swapResultA.swapTransaction, "base64");
				const swapTransactionB = Buffer.from(swapResultB.swapTransaction, "base64");

				var transactionA = VersionedTransaction.deserialize(swapTransactionA);
				var transactionB = VersionedTransaction.deserialize(swapTransactionB);
				if (!wallet.signAllTransactions) return;
				// Update tokenAAmount and tokenBAmount with the expected output amounts
				const tokenAAmount = new BN(quoteA.outAmount);
				const tokenBAmount = new BN(quoteB.outAmount);
				const anai = await connection.getAccountInfo(getAssociatedTokenAddressSync(poolKeys.lpMint, wallet.publicKey));
				const someIxs: TransactionInstruction[] = [];
				if (!anai) {
					someIxs.push(createAssociatedTokenAccountInstruction(wallet.publicKey, getAssociatedTokenAddressSync(poolKeys.lpMint, wallet.publicKey), wallet.publicKey, poolKeys.lpMint));
				}

				let ix = makeDepositCpmmInInstruction(
					CREATE_CPMM_POOL_PROGRAM,
					wallet.publicKey,
					getPdaPoolAuthority(CREATE_CPMM_POOL_PROGRAM).publicKey,
					poolKeys.poolId,
					poolKeys.lpMint,
					getAssociatedTokenAddressSync(mintA, wallet.publicKey),
					getAssociatedTokenAddressSync(mintB, wallet.publicKey),
					poolKeys.vaultA,
					poolKeys.vaultA,
					mintA,
					mintB,
					poolKeys.lpMint,
					new BN(0), // LP amount, 0 for single-sided deposit
					tokenAAmount,
					tokenBAmount,
					// @ts-ignore
					(await connection.getAccountInfo(poolKeys.vaultA)).owner,
					// @ts-ignore
					(await connection.getAccountInfo(poolKeys.vaultA)).owner
				);
				someIxs.push(ix);
				// Create separate transactions for setup instructions

				const messageV0 = new TransactionMessage({
					payerKey: wallet.publicKey,
					recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
					instructions: [...someIxs],
				}).compileToV0Message([]);
				const transaction = new VersionedTransaction(messageV0);

				const signed = await wallet.signAllTransactions([transactionA, transactionB, transaction]);
				for (const signedTx of signed) {
					const txId = await connection.sendRawTransaction(signedTx.serialize());
					console.log(`Transaction sent: ${txId}`);
					await connection.confirmTransaction(txId, "confirmed");
					console.log(`Transaction ${txId} confirmed`);
				}
			} else {
				// @ts-ignore
				let ix = await program.methods
					.buy(new BN(tokenAmount.toString()), new BN(Number.MAX_SAFE_INTEGER))
					.accounts({
						user: wallet.publicKey,
						mint: tokenMint,
						bondingCurve: bondingCurvePda,
						global: globalPda,
						bondingCurveTokenAccount: bondingCurveTokenAccount,
						userTokenAccount: userTokenAccount,
						systemProgram: SystemProgram.programId,
						tokenProgram: ai?.owner || TOKEN_PROGRAM_ID,
						sysvarRecentSlothashes: SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
						hydra: new PublicKey("AZHP79aixRbsjwNhNeuuVsWD4Gdv1vbYQd8nWKMGZyPZ"), // Replace with actual hydra address
						program: PROGRAM_ID,
					})
					.instruction();
				const tx = new Transaction();
				tx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 33333 }));
				const ai2 = await connection.getAccountInfo(getAssociatedTokenAddressSync(new PublicKey(token.mint), wallet.publicKey, true, ai?.owner || TOKEN_PROGRAM_ID));
				if (!ai2) {
					tx.add(
						createAssociatedTokenAccountInstruction(
							wallet.publicKey,
							getAssociatedTokenAddressSync(new PublicKey(token.mint), wallet.publicKey, true, ai?.owner || TOKEN_PROGRAM_ID),
							wallet.publicKey,
							new PublicKey(token.mint),
							ai?.owner || TOKEN_PROGRAM_ID
						)
					);
				}
				tx.add(ix);
				const signature = await wallet.sendTransaction(tx, connection);
				console.log("Transaction signature", signature);
				await connection.confirmTransaction(signature, "processed");
			}
		} catch (error) {
			console.error("Error during buy:", error);
		}
		setBuyIsProcessing(false);
	};

	// Sell function
	const handleSell = async () => {
		if (!aw) return null;
		const provider = new AnchorProvider(connection, aw, {});
		const IDL = await Program.fetchIdl(new PublicKey("65YAWs68bmR2RpQrs2zyRNTum2NRrdWzUfUTew9kydN9"), provider);
		const program = new Program(IDL as any, provider);
		if (!wallet.publicKey || !program) {
			console.error("Wallet not connected or program not initialized");
			return;
		}
		setSellIsProcessing(true);
		try {
			const tokenMint = new PublicKey(token.mint);
			const PROGRAM_ID = new PublicKey(token.programId);
			const ai = await connection.getAccountInfo(tokenMint);
			const [bondingCurvePda] = PublicKey.findProgramAddressSync([Buffer.from("bonding-curve"), tokenMint.toBuffer()], PROGRAM_ID);
			const TOKEN_PROGRAM_ID_2022 = ai?.owner || TOKEN_PROGRAM_ID;
			const [globalPda] = PublicKey.findProgramAddressSync([Buffer.from("global")], PROGRAM_ID);

			const userTokenAccount = getAssociatedTokenAddressSync(tokenMint, wallet.publicKey, true, TOKEN_PROGRAM_ID_2022);

			const bondingCurveTokenAccount = getAssociatedTokenAddressSync(tokenMint, bondingCurvePda, true, TOKEN_PROGRAM_ID_2022);

			const sellAmountLamports = new BN(parseFloat(amount) * 10 ** 9);
			const ammAcc = await connection.getAccountInfo(bondingCurvePda);
			const data = ammAcc?.data.slice(8);
			const amm = new LPAMM(
				data?.readBigUInt64LE(0) || BigInt(0),
				data?.readBigUInt64LE(8) || BigInt(0),
				data?.readBigUInt64LE(16) || BigInt(0),
				data?.readBigUInt64LE(24) || BigInt(0),
				data?.readBigUInt64LE(32) || BigInt(0)
			);

			const { tokenAmount, solAmount } = amm.getBuyTokensWithSol(BigInt(sellAmountLamports.toString()));

			// Update sellAmountLamports to use the calculated tokenAmount
			// @ts-ignore

			if (!token.isBondingCurve) {
				const tokenAMint = new PublicKey(token.baseTokenMint);
				const tokenBMint = new PublicKey(token.quoteTokenMint);
				const isFront = new BN(tokenAMint.toBuffer()).lte(new BN(tokenBMint.toBuffer()));

				const [mintA, mintB] = isFront ? [tokenAMint, tokenBMint] : [tokenBMint, tokenAMint];
				const aa = new BN(sellAmountLamports.toString());
				const ab = new BN(0); // Assuming we're only selling one token

				const configId = 0;
				const [ammConfigKey, _bump] = PublicKey.findProgramAddressSync([Buffer.from("amm_config"), new BN(configId).toArrayLike(Buffer, "be", 8)], CREATE_CPMM_POOL_PROGRAM);
				const poolKeys = getCreatePoolKeys({
					creator: wallet.publicKey,
					programId: CREATE_CPMM_POOL_PROGRAM,
					mintA,
					mintB,
					configId: ammConfigKey,
				});
				poolKeys.configId = ammConfigKey;
				const blockhash = (await connection.getLatestBlockhash()).blockhash;
				const userBaseTokenAccount = await getAssociatedTokenAddressSync(new PublicKey(token.baseTokenMint), wallet.publicKey, true, TOKEN_PROGRAM_ID_2022);
				const userQuoteTokenAccount = await getAssociatedTokenAddressSync(new PublicKey(token.quoteTokenMint), wallet.publicKey, true, TOKEN_PROGRAM_ID_2022);

				// Fetch initial token balances
				const initialBaseBalance = await connection.getTokenAccountBalance(userBaseTokenAccount);
				const initialQuoteBalance = await connection.getTokenAccountBalance(userQuoteTokenAccount);

				// Perform withdraw instruction
				const withdrawIx = makeWithdrawCpmmInInstruction(
					CREATE_CPMM_POOL_PROGRAM,
					wallet.publicKey,
					getPdaPoolAuthority(CREATE_CPMM_POOL_PROGRAM).publicKey,
					poolKeys.poolId,
					poolKeys.lpMint,
					userBaseTokenAccount,
					userQuoteTokenAccount,
					poolKeys.vaultA,
					poolKeys.vaultB,
					mintA,
					mintB,
					poolKeys.lpMint,
					new BN(sellAmountLamports.toString()),
					new BN(0),
					new BN(0),
					(await connection.getAccountInfo(poolKeys.vaultA))!.owner,
					(await connection.getAccountInfo(poolKeys.vaultB))!.owner
				);

				// Create and send transaction
				const withdrawTx = new Transaction().add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 33333 })).add(withdrawIx);
				const withdrawSignature = await wallet.sendTransaction(withdrawTx, connection);
				await connection.confirmTransaction(withdrawSignature, "confirmed");

				// Fetch final token balances
				const finalBaseBalance = await connection.getTokenAccountBalance(userBaseTokenAccount);
				const finalQuoteBalance = await connection.getTokenAccountBalance(userQuoteTokenAccount);

				// Calculate the actual amounts of tokens withdrawn
				const baseTokenAmountWithdrawn = new BN(finalBaseBalance.value.amount).sub(new BN(initialBaseBalance.value.amount));
				const quoteTokenAmountWithdrawn = new BN(finalQuoteBalance.value.amount).sub(new BN(initialQuoteBalance.value.amount));

				// Fetch quotes for swapping both base and quote tokens to SOL
				const quoteBase = await jupiterApi.quoteGet({
					inputMint: token.baseTokenMint,
					outputMint: "So11111111111111111111111111111111111111112", // SOL mint address
					amount: baseTokenAmountWithdrawn.toNumber(),
					slippageBps: 1000, // 1% slippage
				});

				const quoteQuote = await jupiterApi.quoteGet({
					inputMint: token.quoteTokenMint,
					outputMint: "So11111111111111111111111111111111111111112", // SOL mint address
					amount: quoteTokenAmountWithdrawn.toNumber(),
					slippageBps: 1000, // 1% slippage
				});

				if (!quoteBase || !quoteQuote) {
					throw new Error("Failed to fetch quotes for token swaps");
				}
				// Perform swaps
				const swapResultBase = await jupiterApi.swapPost({
					swapRequest: {
						userPublicKey: wallet.publicKey.toBase58(),
						quoteResponse: quoteBase,
						wrapAndUnwrapSol: true,
					},
				});
				const swapResultQuote = await jupiterApi.swapPost({
					swapRequest: {
						userPublicKey: wallet.publicKey.toBase58(),
						quoteResponse: quoteQuote,
						wrapAndUnwrapSol: true,
					},
				});
				// Deserialize the swap transactions
				const swapTransactionBase = Buffer.from(swapResultBase.swapTransaction, "base64");
				const swapTransactionQuote = Buffer.from(swapResultQuote.swapTransaction, "base64");

				var transactionBase = VersionedTransaction.deserialize(swapTransactionBase);
				var transactionQuote = VersionedTransaction.deserialize(swapTransactionQuote);

				console.log("Swap Transaction Base:", transactionBase);
				console.log("Swap Transaction Quote:", transactionQuote);
				if (!wallet.signAllTransactions) return;
				// Update baseTokenAmount and quoteTokenAmount with the expected output amounts
				const baseTokenAmount = new BN(quoteBase.outAmount);
				const quoteTokenAmount = new BN(quoteQuote.outAmount);
				const anai = await connection.getAccountInfo(getAssociatedTokenAddressSync(poolKeys.lpMint, wallet.publicKey));
				const someIxs: TransactionInstruction[] = [];
				if (!anai) {
					someIxs.push(createAssociatedTokenAccountInstruction(wallet.publicKey, getAssociatedTokenAddressSync(poolKeys.lpMint, wallet.publicKey), wallet.publicKey, poolKeys.lpMint));
				}

				let ix = makeWithdrawCpmmInInstruction(
					CREATE_CPMM_POOL_PROGRAM,
					wallet.publicKey,
					getPdaPoolAuthority(CREATE_CPMM_POOL_PROGRAM).publicKey,
					poolKeys.poolId,
					poolKeys.lpMint,
					getAssociatedTokenAddressSync(mintA, wallet.publicKey),
					getAssociatedTokenAddressSync(mintB, wallet.publicKey),
					poolKeys.vaultA,
					poolKeys.vaultB,
					mintA,
					mintB,
					poolKeys.lpMint,
					new BN(sellAmountLamports.toString()),
					baseTokenAmount,
					quoteTokenAmount,
					// @ts-ignore
					(await connection.getAccountInfo(poolKeys.vaultA)).owner,
					// @ts-ignore
					(await connection.getAccountInfo(poolKeys.vaultB)).owner
				);
				someIxs.push(ix);
				// Create separate transactions for setup instructions

				const messageV0 = new TransactionMessage({
					payerKey: wallet.publicKey,
					recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
					instructions: [...someIxs],
				}).compileToV0Message([]);
				const transaction = new VersionedTransaction(messageV0);

				const signed = await wallet.signAllTransactions([transactionBase, transactionQuote, transaction]);
				for (const signedTx of signed) {
					const txId = await connection.sendRawTransaction(signedTx.serialize());
					console.log(`Transaction sent: ${txId}`);
					await connection.confirmTransaction(txId, "confirmed");
					console.log(`Transaction ${txId} confirmed`);
				}
			} else {
				// @ts-ignore
				const ix = await program.methods
					// @ts-ignore
					.sell(new BN(tokenAmount.toString()), new BN(0))
					.accounts({
						user: wallet.publicKey,
						mint: tokenMint,
						bondingCurve: bondingCurvePda,
						global: globalPda,
						bondingCurveTokenAccount: bondingCurveTokenAccount,
						userTokenAccount: userTokenAccount,
						systemProgram: SystemProgram.programId,
						tokenProgram: TOKEN_PROGRAM_ID_2022,
						hydra: new PublicKey("AZHP79aixRbsjwNhNeuuVsWD4Gdv1vbYQd8nWKMGZyPZ"),
						program: PROGRAM_ID,
					})
					.instruction();
				const tx = new Transaction().add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 33333 })).add(ix);
				const signature = await wallet.sendTransaction(tx, connection);
				console.log("Transaction signature", signature);
				await connection.confirmTransaction(signature, "processed");
			}
		} catch (error) {
			console.error("Error during sell:", error);
		}
		setSellIsProcessing(false);
	};
	const [amount, setAmount] = useState("");

	useEffect(() => {
		const fetchSolUsdcPrice = async () => {
			try {
				const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
				if (response.ok) {
					const data = await response.json();
					setSolusdc(data.solana.usd);
				} else {
					console.error("Failed to fetch SOL/USDC price");
				}
			} catch (error) {
				console.error("Error fetching SOL/USDC price:", error);
			}
		};

		fetchSolUsdcPrice();
		const intervalId = setInterval(fetchSolUsdcPrice, 60000); // Update every minute

		return () => clearInterval(intervalId);
	}, []);
	const router = useRouter();
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		if (!token.mint) return;

		const fetchBalance = async () => {
			const publicKey = new PublicKey(token.mint.address);

			try {
				const balance = await connection.getBalance(publicKey);
				const calculatedProgress = (balance / 85) * 10 ** 9;
				setProgress(Math.min(100, Math.max(0, calculatedProgress))); // Ensure progress is between 0 and 100
			} catch (error) {
				console.error("Error fetching balance:", error);
			}
		};

		fetchBalance();
		const intervalId = setInterval(fetchBalance, 60000); // Update every minute

		return () => clearInterval(intervalId);
	}, []);

  const formatTokenAmount = (amount: string, tokenPrice: number): string => {
    if (tokenPrice === 0) return '0';
    const parsedAmount = parseFloat(amount) || 0;
    const tokenAmount = parsedAmount / parseFloat((tokenPrice / 10 ** 9).toFixed(9));
		return new Intl.NumberFormat("en-US", { minimumFractionDigits: 9, maximumFractionDigits: 9 }).format(tokenAmount);
	};

  const price = typeof token.price === 'number' ? token.price : 0;
	
	return (
		<>
			<div className="flex justify-between items-center p-3">
				<div className="text-xl">{token.symbol} / SOL</div>
				<Button isIconOnly className="bg-white/10" size="sm" onClick={() => router.back()} aria-label="Close">
					<Icon icon="material-symbols-light:close" />
				</Button>
			</div>

			<div>
				<Image src={token.mint.metadata.image} alt="Peppa" unoptimized className="w-full h-full" width={100} height={100} />
			</div>

			<div className="p-3 flex flex-col gap-2">
				{token.isBondingCurve && (
					<Card className="bg-transparent border border-white/10 p-2">
						<CardBody>
							<div className="leading-none -mt-1 pb-2 text-sm">
								Progress <span className="text-primary">{token?.completed}%</span>
							</div>
							<Progress value={token?.completed} size="md" />
						</CardBody>
					</Card>
				)}
				<div className="grid grid-cols-2 gap-2">
					<Card className="bg-transparent border border-white/10">
						<CardBody className="text-center">
							<div className="leading-none pb-1 text-md uppercase text-white/50">Price</div>
							<span className="inter text-sm font-black leading-none">{(price / 10 ** 9).toFixed(9)} SOL</span>
						</CardBody>
					</Card>
					<Card className="bg-transparent border border-white/10">
						<CardBody className="text-center">
							<div className="leading-none pb-1 text-md uppercase text-white/50">Market Cap</div>
							<span className="inter text-sm font-black leading-none">${(price / 10 ** 9) * 1_000_000_000 * solusdc}</span>
						</CardBody>
					</Card>
				</div>

				<div>
					<Card className="bg-transparent border border-white/10">
						<CardBody className="flex flex-col gap-2">
							<AmountInput amount={amount} setAmount={setAmount} />

							<SlippageInput />

							<div className="flex flex-col gap-2 items-center">
								{aw && aw.signAllTransactions != undefined && (
									<>
										<Button color="primary" className="w-full" onClick={handleBuy} isLoading={buyIsProcessing} isDisabled={buyIsProcessing || sellIsProcessing}>
											Buy
										</Button>
										<Button color="secondary" className="w-full" onClick={handleSell} isLoading={sellIsProcessing} isDisabled={buyIsProcessing || sellIsProcessing}>
											Sell
										</Button>
									</>
								)}

								<span className="text-white/50 text-xs inter">
									You will receive min <span className="text-white">{formatTokenAmount(amount, price)}</span> @{token.mint.metadata.symbol}
								</span>
							</div>
						</CardBody>
					</Card>
				</div>
				{/* Display sidebar statistics */}
				{/* <div>
          <SidebarStats />
        </div> */}
			</div>
		</>
	);
}