"use client";

import "@/styles/globals.css";
import clsx from "clsx";

import SidebarContainer from "@/components/sidebar-container";

import { Providers } from "./providers";

import { useState, useEffect, useMemo, useContext } from "react";
import { motion } from "framer-motion";

import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/react";
import TopMenu from "@/components/top-menu";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import Modals from "@/components/modals";

function useIsMobile() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIsMobile = () => {
			setIsMobile(window.innerWidth <= 768); // Example breakpoint for mobile
		};

		checkIsMobile();
		window.addEventListener("resize", checkIsMobile);

		return () => window.removeEventListener("resize", checkIsMobile);
	}, []);

	return isMobile;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isScrollingUp, setIsScrollingUp] = useState(false);
	const isMobile = useIsMobile();

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	// The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
	const network = WalletAdapterNetwork.Devnet;

	// You can also provide a custom RPC endpoint.
	const endpoint = useMemo(() => clusterApiUrl(network), [network]);

	const wallets = useMemo(
		() => [
			new PhantomWalletAdapter(),
			new SolflareWalletAdapter(),
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[network]
	);

	useEffect(() => {
		let lastScrollTop = 0;
		const scrollThreshold = 5; // Threshold for scroll distance

		const handleScroll = () => {
			const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
			if (lastScrollTop - currentScrollTop > scrollThreshold) {
				setIsScrollingUp(true);
			} else if (currentScrollTop - lastScrollTop > scrollThreshold) {
				setIsScrollingUp(false);
			}
			lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For Mobile or negative scrolling
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<html suppressHydrationWarning lang="en">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
			</head>
			<body className={clsx("min-h-screen bg-background antialiased open-sans")}>
				<Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
					<ConnectionProvider endpoint={endpoint}>
						<WalletProvider wallets={wallets} autoConnect>
							<WalletModalProvider>
								<div className="h-dvh flex">
									<motion.div
										initial={{ x: "-100%" }}
										animate={{ x: isMobile ? (isSidebarOpen ? 0 : "-100%") : 0 }}
										transition={{ type: "spring", stiffness: 300, damping: 30 }}
										className="fixed top-0 left-0 z-50 h-screen w-72"
									>
										<SidebarContainer toggleSidebar={() => toggleSidebar()} isSidebarOpen  />
									</motion.div>

									<div className={`flex flex-col flex-1 md:pl-72 ${isSidebarOpen ? "h-0 overflow-hidden" : ""} ${isScrollingUp ? "pt-32 md:pt-20" : ""}`}>
										<div className={isScrollingUp ? "fixed top-0 left-0 right-0 z-50 md:pl-72" : ""}>
											<TopMenu toggleSidebar={toggleSidebar} />
										</div>

										<Modals />

										{children}
									</div>
								</div>
							</WalletModalProvider>
						</WalletProvider>
					</ConnectionProvider>
				</Providers>
			</body>
		</html>
	);
}
