"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { createContext, useState } from "react";

export interface ProvidersProps {
	children: React.ReactNode;
	themeProps?: ThemeProviderProps;
}

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 60 * 60 * 24, // 24 hours
		},
	},
});

const storage = typeof window !== "undefined" ? window.localStorage : undefined;
const persister = createSyncStoragePersister({ storage });

interface ModalContextType {
  openModals: string[];
  setOpenModals: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function Providers({ children, themeProps }: ProvidersProps) {
	const router = useRouter();

  const [openModals, setOpenModals] = useState<string[]>([]);

	return (
		<QueryClientProvider client={queryClient}>
			<ConnectionProvider endpoint="https://rpc.ironforge.network/mainnet?apiKey=01HRZ9G6Z2A19FY8PR4RF4J4PW">
				<WalletProvider wallets={[]}>
					<WalletModalProvider>
						<NextUIProvider navigate={router.push}>
							<NextThemesProvider {...themeProps}>
								<ModalContext.Provider value={{
                  openModals: openModals,
                  setOpenModals: setOpenModals
                }}>
                  {children}
								</ModalContext.Provider>
								<ReactQueryDevtools initialIsOpen={false} />
							</NextThemesProvider>
						</NextUIProvider>
					</WalletModalProvider>
				</WalletProvider>
			</ConnectionProvider>
		</QueryClientProvider>
	);
}
