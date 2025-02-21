import { SVGProps } from "react";
import { struct } from "@solana/buffer-layout";
import { u64, bool } from "@solana/buffer-layout-utils";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// Defining RawMint from https://github.com/solana-labs/solana-program-library/blob/48fbb5b7c49ea35848442bba470b89331dea2b2b/token/js/src/state/mint.ts#L31 //
export interface RawBondingCurveLayout {
  virtualSolReserves: bigint;
  virtualTokenReserves: bigint;
  realSolReserves: bigint;
  realTokenReserves: bigint;
  tokenTotalSupply: bigint;
  complete: boolean;
}

export const BondingCurveLayout: any = struct<RawBondingCurveLayout>([
  u64('virtualTokenReserves'),
  u64('virtualSolReserves'),
  u64('tokenTotalSupply'),
  u64('realSolReserves'),
  u64('realTokenReserves'),
  bool('complete'),
]);