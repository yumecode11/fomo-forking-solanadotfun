"use client";

import TopNavItem from "./top-nav-item";

export default function TopNav({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
	return (
		<div className="border-b border-white/10 grid grid-cols-4 divide-x divide-white/10">
			<TopNavItem label="5m" value={10} isActive={activeTab === "5m"} onClick={() => setActiveTab("5m")} />
			<TopNavItem label="1h" value={-10} isActive={activeTab === "1h"} onClick={() => setActiveTab("1h")} />
			<TopNavItem label="6h" value={-8} isActive={activeTab === "6h"} onClick={() => setActiveTab("6h")} />
			<TopNavItem label="24h" value={-2} isActive={activeTab === "24h"} onClick={() => setActiveTab("24h")} />
		</div>
	);
}
