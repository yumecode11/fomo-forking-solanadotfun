"use client";

import { Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import { usePathname } from "next/navigation";

export default function MenuButton({ toggleSidebar }: { toggleSidebar: () => void }) {
	const pathName = usePathname();

	const getButtonPosition = () => {
    if (!pathName) return "top-14 left-4";

		switch (true) {
			case /^\/token(\/.*)?$/.test(pathName):
				return "top-16 left-4";
      case /^\/multi-chart(\/.*)?$/.test(pathName): 
        return "top-[72px] left-6" 
			default:
				return "top-14 left-4";
		}
	};

	return (
		<Button onClick={toggleSidebar} className="md:hidden z-10 bg-white/10" size="md" isIconOnly aria-label="Menu">
			<Icon icon="iconoir:menu" width={20} />
		</Button>
	);
}
