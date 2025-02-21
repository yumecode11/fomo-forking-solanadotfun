interface SidebarItem {
  key: string;
  href: string;
  icon: string;
  title: string;
  action?: string;
}

export const sidebarItems: SidebarItem[] = [
	{
		key: "watchlist",
		href: "/",
		icon: "solar:star-bold",
		title: "Watchlist",
	},
	{
		key: "alerts",
		href: "#",
		icon: "solar:bell-bold",
		title: "Alerts",
    action: "alertModal"
	},
	{
		key: "swap",
		href: "/swap",
		icon: "ion:swap-vertical-sharp",
		title: "Swap",
	},
	{
		key: "multicharts",
		href: "/multi-chart",
		icon: "solar:code-scan-bold",
		title: "Multicharts",
	},
	{
		key: "new-pairs",
		href: "/new-pairs",
		icon: "solar:leaf-bold",
		title: "New Pairs",
	},
	{
		key: "gainers-and-losers",
		href: "/gainers-and-losers",
		icon: "solar:chart-square-bold",
		title: "Gainers and Losers",
	},
	{
		key: "portfolio",
		href: "/portfolio",
		icon: "solar:wallet-2-bold",
		title: "Portfolio",
	},
];