"use client";
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import { ModalContext } from "@/app/providers";

interface SidebarItem {
  key: string;
  href: string;
  icon: string;
  title: string;
  action?: string;
}

export default function Sidebar({ isSidebarOpen, items, toggleSidebar }: { isSidebarOpen: boolean; items: SidebarItem[]; toggleSidebar: () => void }) {
	const [activePage, setActivePage] = useState("");

  const pathName = usePathname();

  const getActivePage = () => {
    if (!pathName) return "";

		switch (true) {
      case pathName === "/":
        return "watchlist"
      case /^\/multi-chart(\/.*)?$/.test(pathName): 
        return "multicharts" 
      case /^\/new-pairs(\/.*)?$/.test(pathName): 
        return "new-pairs"
      case /^\/portfolio(\/.*)?$/.test(pathName):
        return "portfolio"
      case /^\/swap(\/.*)?$/.test(pathName):
        return "swap"
      case /^\/gainers-and-losers(\/.*)?$/.test(pathName):
        return "gainers-and-losers"
			default:
				return "";
		}
  }

	const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

	useEffect(() => {
		const handleResize = () => {
			setActivePage(getActivePage());
		};

		handleResize();
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [pathName]);

  const modalContext = useContext(ModalContext);

	return (
		<div className="flex flex-col px-2 z-50">
			{items.map((item: SidebarItem) => (
				<Link
					key={item.key}
					href={item.href}
					className={`flex items-center gap-2 text-lg rounded-xl py-1 px-2 cursor-pointer hover:bg-primary/50 hover:text-white/100 transition-all duration-300 ease-in-out ${getActivePage() === item.key ? "bg-primary/50 text-white/100" : "text-white/50"}`}
          onClick={() => {
            if (item.action) {
              modalContext?.setOpenModals((prev: any) => [...prev, item.action]);
            }

            if (isSidebarOpen && isMobile) {
              toggleSidebar();
            }
          }}
				>
					<Icon icon={item.icon} width={20} />
					<span className="text-sm py-2">{item.title}</span>
				</Link>
			))}
		</div>
	);
}
