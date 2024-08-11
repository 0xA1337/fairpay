"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils/tailwind";
import { useState } from "react";
import { DonateButtonWrapper } from "./donate-button-wrapper";

const suggestedDonations = [10, 25, 50, 100];

export function DonationForm(props: { id: number }) {
  const [amountToDonate, setAmountToDonate] = useState<number | null>(null);
  const [amountSetViaInput, setAmountSetViaInput] = useState(true);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 grid-rows-2 gap-2">
        {suggestedDonations.map((amount) => (
          <Button
            key={amount}
            variant={"outline"}
            className={cn(
              "h-[75px] text-lg hover:bg-yellow-400/5 ",
              amount === amountToDonate &&
                !amountSetViaInput &&
                "bg-yellow-400/20 hover:bg-yellow-400/20 text-accent-foreground"
            )}
            onClick={() => {
              setAmountSetViaInput(false);
              setAmountToDonate(amount);
            }}
          >
            ${amount}
          </Button>
        ))}
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        <div className="w-full md:w-1/2">
          <p className="mb-2">Or type your own amount:</p>
          <div className="flex items-center justify-center">
            <Input
              placeholder="Amount in USD"
              className="flex-grow text-lg h-12 px-4"
              inputMode="numeric"
              autoComplete="off"
              type="number"
              min={1}
              max={5_000_000}
              step={1}
              value={amountToDonate?.toString()}
              onChange={(e) => {
                setAmountSetViaInput(true);
                if (e.target.value === "") {
                  setAmountToDonate(null);
                } else if (/^\d*$/g.test(e.target.value)) {
                  setAmountToDonate(parseInt(e.target.value));
                }
              }}
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 self-end">
          <DonateButtonWrapper campaignId={props.id} amountUsdc={amountToDonate || 0} />
        </div>
      </div>
    </div>
  );
}
