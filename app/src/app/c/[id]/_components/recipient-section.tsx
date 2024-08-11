"use client";

import { Avatar, Badge, Identity, Name } from "@coinbase/onchainkit/identity";
import { Hex } from "viem";

export function RecipientSection(props: { recipient: string }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <Identity
          address={props.recipient as Hex}
          className="bg-transparent pl-1 mt-1 mb-3"
          schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
          hasCopyAddressOnClick={true}
        >
          <Avatar />
          <Name>
            <Badge />
          </Name>
        </Identity>
      </div>
    </div>
  );
}
