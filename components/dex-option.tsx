"use client";

import Image from "next/image";
import Link from "next/link";

export default function DexOption({
  isSelected, 
  setSelectedDex,
  logo,
  name,
  description,
  learnMoreLink
}: { 
  isSelected: boolean; 
  setSelectedDex: (dex: "meteora" | "raydium") => void 
  logo: string;
  name: string;
  description: string;
  learnMoreLink: string;
}) {
	return (
		<div
      className={`min-h-[150px] flex flex-col gap-2 bg-[#27272a] hover:bg-white/10 p-10 transition-all duration-300 rounded-xl items-center justify-center border-3 cursor-pointer ${isSelected ? "border-primary" : "border-transparent"}`}
      onClick={() => setSelectedDex(name.toLowerCase() as "meteora" | "raydium")}
    >
			<div className="flex items-center gap-2">
				<Image src={logo} alt={name} width={25} height={250} />
				<h2 className="text-xl">{name}</h2>
			</div>
			<p className="inter text-xs text-center">
				{description} {learnMoreLink && <Link href={learnMoreLink} target="_blank" className="text-primary underline font-bold cursor-pointer">Learn more</Link>}
			</p>
		</div>
	);
}
