"use client";

import { Button, Link } from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useRouter, usePathname } from "next/navigation";
import Logo from "@/app/assets/images/logo_color.svg";
import MenuButton from "@/components/menu-button";
import "@solana/wallet-adapter-react-ui/styles.css";
import { connected } from "process";
import { useWallet } from "@solana/wallet-adapter-react";

export default function TopMenu({ toggleSidebar }: { toggleSidebar: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const {connected} = useWallet()
	return (
    <div className="flex bg-black">
      <div className="flex items-center justify-between w-full p-4 md:hidden">
        <Link href="/">
          <Image src={Logo.src} alt="Logo" width={80} height={80} />
        </Link>
      </div>
      <div className="flex items-center justify-between gap-1 md:gap-2 w-fit md:w-full p-4">
        <div className="hidden md:flex flex-1 md:flex-none items-center gap-1 md:gap-2">
          <Button variant="flat" size="sm" className="text-sm md:text-md flex-1 md:flex-none" onPress={() => router.push("/portfolio")} aria-label="Portfolio">
            <Icon icon="tabler:trending-up" />
            Portfolio
          </Button>
          <Button variant="flat" size="sm" className="text-sm md:text-md flex-1 md:flex-none" onPress={() => router.push("/swap")} aria-label="Swap">
            <Icon icon="ion:swap-vertical-sharp" />
            Swap
          </Button>
        </div>
      </div>
    </div>
	);
}
