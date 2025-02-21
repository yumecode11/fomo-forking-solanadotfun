"use client";

export default function TopNavItem({ label, value, isActive, onClick }: { label: string; value: number, isActive: boolean, onClick: () => void }) {
	return (
		<div className={`flex flex-col items-center p-2 hover:bg-white/10 hover:!border-transparent cursor-pointer ${isActive ? "bg-white/10 !border-transparent" : ""}`} onClick={onClick}>
			<span className="leading-none text-white/50">{label}</span>
			<span className={`leading-none ${value > 0 ? "text-success" : "text-danger"} text-xl`}>{value}</span>
		</div>
	);
}
