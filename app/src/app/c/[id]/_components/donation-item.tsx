"use client";

import { formatRelativeDate } from "@/shared/utils/dates";
import { Avatar, Badge, Identity, Name } from "@coinbase/onchainkit/identity";
import { formatUnits, Hex } from "viem";

export function DonationItem(props: { donor: string; amount: bigint; timestamp: bigint }) {
  return (
    <div key={props.timestamp} className="flex justify-between items-center">
      <div>
        <Identity
          address={props.donor as Hex}
          className="bg-transparent"
          schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
        >
          <Avatar />
          <Name>
            <Badge />
          </Name>
        </Identity>
      </div>
      <p className="text-center">{formatUnits(props.amount, 6)}$</p>
      <p>{formatRelativeDate(Number(props.timestamp))}</p>
    </div>
  );
}
