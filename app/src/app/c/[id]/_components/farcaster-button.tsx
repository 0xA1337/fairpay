"use client";

import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

export function FarcasterButton() {
  return (
    <Button variant={"farcaster"} asChild>
      <Link href="#" target="_blank">
        Share on Farcaster
      </Link>
    </Button>
  );
}
