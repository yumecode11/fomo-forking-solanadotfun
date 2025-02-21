"use client";
import { useState, useMemo } from "react";

import { Table, TableHeader, TableBody, TableRow, TableCell, TableColumn, Spinner, Divider, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import usePairs from "@/app/hooks/usePairs";
import { Icon } from "@iconify/react";

export default function GainersAndLosers() {
  const { pairs, isLoading, error } = usePairs();
  const [selectedTimelineKeys, setSelectedTimelineKeys] = useState<string[]>(['Last 24 hours']);
  const [selectedAgeFilterKeys, setSelectedAgeFilterKeys] = useState<string[]>(['']);
  const [selectedLiquidityFilterKeys, setSelectedLiquidityFilterKeys] = useState<string[]>(['']);
  const [selectedVolumeFilterKeys, setSelectedVolumeFilterKeys] = useState<string[]>(['']);

  const selectedTimelineValue = useMemo(() => Array.from(selectedTimelineKeys).join(", ").replaceAll("_", " "), [selectedTimelineKeys]);
  const selectedAgeFilterValue = useMemo(() => Array.from(selectedAgeFilterKeys).join(", ").replaceAll("_", " "), [selectedAgeFilterKeys]);
  const selectedLiquidityFilterValue = useMemo(() => Array.from(selectedLiquidityFilterKeys).join(", ").replaceAll("_", " "), [selectedLiquidityFilterKeys]);
  const selectedVolumeFilterValue = useMemo(() => Array.from(selectedVolumeFilterKeys).join(", ").replaceAll("_", " "), [selectedVolumeFilterKeys]);
  return (
    <div className="">
      <div style={{ height: "calc(100vh - 64px)" }} className="flex flex-col w-screen md:w-full">
        <div className="w-full overflow-x-auto overflow-y-hidden pb-1 md:pb-0">
          <Divider className="hidden md:block" />
          <div className="py-2 px-4 flex gap-2 w-fit md:w-full border border-t-2 md:border-0 border-white/10">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  className="capitalize m-0"
                  size="sm"
                  startContent={<Icon icon="tabler:clock-filled" />}
                  endContent={<Icon icon="tabler:chevron-down" />}
                >
                  <span className="text-md inter font-black">{selectedTimelineValue}</span>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Single selection example"
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedTimelineKeys}
                onSelectionChange={(keys: any) => setSelectedTimelineKeys(keys)}
                className="inter text-md"
              >
                <DropdownItem key="Last 5 minutes">Last 5 minutes</DropdownItem>
                <DropdownItem key="Last hour">Last hour</DropdownItem>
                <DropdownItem key="Last 6 hours">Last 6 hours</DropdownItem>
                <DropdownItem key="Last 24 hours">Last 24 hours</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <div className="bg-white/10 flex w-fit p-1 rounded-md leading-none items-center gap-1">
              <Icon icon="cuida:fire-outline" />
              <span>Trending</span>
              <div className="flex gap-1">
                <div className="cursor-pointer hover:bg-white hover:text-black transition-all duration-300 bg-black/50 text-sm py-1 px-2 rounded">5M</div>
                <div className="cursor-pointer hover:bg-white hover:text-black transition-all duration-300 bg-black/50 text-sm py-1 px-2 rounded">1H</div>
                <div className="cursor-pointer hover:bg-white hover:text-black transition-all duration-300 bg-white text-black text-sm py-1 px-2 rounded">6H</div>
                <div className="cursor-pointer hover:bg-white hover:text-black transition-all duration-300 bg-black/50 text-sm py-1 px-2 rounded">24H</div>
              </div>
            </div>

            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  className={`capitalize m-0 ${selectedAgeFilterValue ? "pr-0" : ""}`}
                  size="sm"
                  startContent={<span className={`${selectedAgeFilterValue ? "text-white" : "text-white/50"}`}><Icon icon="tabler:filter-filled" /></span>}
                  endContent={
                    selectedAgeFilterValue && <Button isIconOnly size="sm" className="text-lg bg-transparent" onClick={() => setSelectedAgeFilterKeys([])}><Icon icon="iconamoon:close-light" /></Button>
                  }
                >
                  <span className={`text-md inter font-black ${selectedAgeFilterValue ? "text-white" : "text-white/50"}`}>{selectedAgeFilterValue ? selectedAgeFilterValue : "Age"}</span>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Single selection example"
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedAgeFilterKeys}
                onSelectionChange={(keys: any) => setSelectedAgeFilterKeys(keys)}
                className="inter text-md"
              >
                <DropdownItem key="Any">
                  <span>Any</span>
                </DropdownItem>
                <DropdownItem key="&le;15m">&le;
                  <span>15m</span>
                </DropdownItem>
                <DropdownItem key="&le;30m">&le;
                  <span>30m</span>
                </DropdownItem>
                <DropdownItem key="&le;1h">&le;
                  <span>1h</span>
                </DropdownItem>
                <DropdownItem key="&le;3h">&le;
                  <span>3h</span>
                </DropdownItem>
                <DropdownItem key="&le;6h">&le;
                  <span>6h</span>
                </DropdownItem>
                <DropdownItem key="&le;12h">&le;
                  <span>12h</span>
                </DropdownItem>
                <DropdownItem key="&le;24h">&le;
                  <span>24h</span>
                </DropdownItem>
                <DropdownItem key="&le;3d">&le;
                  <span>3d</span>
                </DropdownItem>
                <DropdownItem key="&le;7d">&le;
                  <span>7d</span>
                </DropdownItem>
                <DropdownItem key="&le;30d">&le;
                  <span>30d</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  className={`capitalize m-0 ${selectedLiquidityFilterValue ? "pr-0" : ""}`}
                  size="sm"
                  startContent={<span className={`${selectedLiquidityFilterValue ? "text-white" : "text-white/50"}`}><Icon icon="tabler:filter-filled" /></span>}
                  endContent={
                    selectedLiquidityFilterValue && <Button isIconOnly size="sm" className="text-lg bg-transparent" onClick={() => setSelectedLiquidityFilterKeys([])}><Icon icon="iconamoon:close-light" /></Button>
                  }
                >
                  <span className={`text-md inter font-black ${selectedLiquidityFilterValue ? "text-white" : "text-white/50"}`}>{selectedLiquidityFilterValue ? selectedLiquidityFilterValue : "Liquidity"}</span>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Single selection example"
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedLiquidityFilterKeys}
                onSelectionChange={(keys: any) => setSelectedLiquidityFilterKeys(keys)}
                className="inter text-md"
              >
                <DropdownItem key="Any">
                  <span className="">Any</span>
                </DropdownItem>
                <DropdownItem key="&gt;$1k">
                  <span className="">&gt;$1k</span>
                </DropdownItem>
                <DropdownItem key="&gt;$5k">
                  <span className="">&gt;$5k</span>
                </DropdownItem>
                <DropdownItem key="&gt;$10k">
                  <span className="">&gt;$10k</span>
                </DropdownItem>
                <DropdownItem key="&gt;$50k">
                  <span className="">&gt;$50k</span>
                </DropdownItem>
                <DropdownItem key="&gt;$100k">
                  <span className="">&gt;$100k</span>
                </DropdownItem>
                <DropdownItem key="&gt;$250">
                  <span className="">&gt;$250k</span>
                </DropdownItem>
                <DropdownItem key="&gt;$500k">
                  <span className="">&gt;$500k</span>
                </DropdownItem>
                <DropdownItem key="&gt;$1m">
                  <span className="">&gt;$1m</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  className={`capitalize m-0 ${selectedVolumeFilterValue ? "pr-0" : ""}`}
                  size="sm"
                  startContent={<span className={`${selectedVolumeFilterValue ? "text-white" : "text-white/50"}`}><Icon icon="tabler:filter-filled" /></span>}
                  endContent={
                    selectedVolumeFilterValue && <Button isIconOnly size="sm" className="text-lg bg-transparent" onClick={() => setSelectedVolumeFilterKeys([])}><Icon icon="iconamoon:close-light" /></Button>
                  }
                >
                  <span className={`text-md inter font-black ${selectedVolumeFilterValue ? "text-white" : "text-white/50"}`}>{selectedVolumeFilterValue ? selectedVolumeFilterValue : "Volume"}</span>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Single selection example"
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedVolumeFilterKeys}
                onSelectionChange={(keys: any) => setSelectedVolumeFilterKeys(keys)}
                className="inter text-md"
              >
                <DropdownItem key="Any">
                  <span className="">Any</span>
                </DropdownItem>
                <DropdownItem key="&gt;$1k">
                  <span className="">&gt;$1k</span>
                </DropdownItem>
                <DropdownItem key="&gt;$5k">
                  <span className="">&gt;$5k</span>
                </DropdownItem>
                <DropdownItem key="&gt;$10k">
                  <span className="">&gt;$10k</span>
                </DropdownItem>
                <DropdownItem key="&gt;$50k">
                  <span className="">&gt;$50k</span>
                </DropdownItem>
                <DropdownItem key="&gt;$100k">
                  <span className="">&gt;$100k</span>
                </DropdownItem>
                <DropdownItem key="&gt;$250">
                  <span className="">&gt;$250k</span>
                </DropdownItem>
                <DropdownItem key="&gt;$500k">
                  <span className="">&gt;$500k</span>
                </DropdownItem>
                <DropdownItem key="&gt;$1m">
                  <span className="">&gt;$1m</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <Table
          isStriped
          isHeaderSticky
          classNames={{
            base: "h-full overflow-scroll rounded-none max-w-screen",
            wrapper: "rounded-none p-0",
            th: "bg-[#0a0a0b] !rounded-none",
            tr: "!rounded-none",
            td: "before:!rounded-none",
          }}
        >
          <TableHeader>
            <TableColumn className="text-lg py-3">Token</TableColumn>
            <TableColumn className="text-lg py-3">Price</TableColumn>
            <TableColumn className="text-lg py-3">Age</TableColumn>
            <TableColumn className="text-lg py-3">Buys</TableColumn>
            <TableColumn className="text-lg py-3">Sells</TableColumn>
            <TableColumn className="text-lg py-3">Volume</TableColumn>
            <TableColumn className="text-lg py-3">Makers</TableColumn>
            <TableColumn className="text-lg py-3">5M</TableColumn>
            <TableColumn className="text-lg py-3">1H</TableColumn>
            <TableColumn className="text-lg py-3">6H</TableColumn>
            <TableColumn className="text-lg py-3">24H</TableColumn>
            <TableColumn className="text-lg py-3">Liquidity</TableColumn>
            <TableColumn className="text-lg py-3">MCAP</TableColumn>
          </TableHeader>

          <TableBody isLoading={isLoading} emptyContent={"No pairs found"} loadingContent={<Spinner />} className="p-10">
            {
              pairs ? pairs.map((pair: any) => (
                <TableRow key={pair.id}>
                  <TableCell className="text-md">{pair.token}</TableCell>
                  <TableCell className="text-md">{pair.price}</TableCell>
                  <TableCell className="text-md">{pair.age}</TableCell>
                  <TableCell className="text-md">{pair.buys}</TableCell>
                  <TableCell className="text-md">{pair.sells}</TableCell>
                  <TableCell className="text-md">{pair.volume}</TableCell>
                  <TableCell className="text-md">{pair.makers}</TableCell>
                  <TableCell className={`text-md ${pair["5m"].startsWith("-") ? "text-danger" : "text-success"}`}>{pair["5m"]}</TableCell>
                  <TableCell className={`text-md ${pair["1h"].startsWith("-") ? "text-danger" : "text-success"}`}>{pair["1h"]}</TableCell>
                  <TableCell className={`text-md ${pair["6h"].startsWith("-") ? "text-danger" : "text-success"}`}>{pair["6h"]}</TableCell>
                  <TableCell className={`text-md ${pair["24h"].startsWith("-") ? "text-danger" : "text-success"}`}>{pair["24h"]}</TableCell>
                  <TableCell className="text-md">{pair.liquidity}</TableCell>
                  <TableCell className="text-md">{pair.mcap}</TableCell>
                </TableRow>
              )) : <></>
            }
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
