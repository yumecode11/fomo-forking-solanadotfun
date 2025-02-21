import { Tabs, Tab } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { Key } from "react";

export default function ItemFilterBar({ setActiveFilter }: { setActiveFilter: (filter: string) => void }) {
	return (
		<Tabs
      aria-label="Options"
      color="primary"
      variant="bordered"
      classNames={{ base: "w-full overflow-x-auto md:w-fit", tabList: "w-full md:w-fit" }}
      onSelectionChange={(key: Key) => setActiveFilter(key.toString())}
    >
			<Tab
				key="trending"
        className="p-1 md:p-2"
				title={
					<div className="flex items-center space-x-1 md:space-x-2">
						<Icon icon="tabler:trending-up" />
						<span className="text-sm md:text-[16px]">Trending</span>
					</div>
				}
			/>
			<Tab
				key="top"
        className="p-1 md:p-2"
				title={
					<div className="flex items-center space-x-1 md:space-x-2">
						<Icon icon="tabler:trending-up" />
						<span className="text-sm md:text-[16px]">Top</span>
					</div>
				}
			/>
			<Tab
				key="rising"
        className="p-1 md:p-2"
				title={
					<div className="flex items-center space-x-1 md:space-x-2">
						<Icon icon="solar:chart-2-bold" />
						<span className="text-sm md:text-[16px]">Rising</span>
					</div>
				}
			/>
			<Tab
				key="new"
        className="p-1 md:p-2"
				title={
					<div className="flex items-center space-x-1 md:space-x-2">
						<Icon icon="solar:leaf-bold" />
						<span className="text-sm md:text-[16px]">New</span>
					</div>
				}
			/>
		</Tabs>
	);
}
