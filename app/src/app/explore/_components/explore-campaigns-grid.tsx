import { Skeleton } from "@/shared/components/ui/skeleton";
import Link from "next/link";

export function ExploreCampaignsGrid() {
  const campaigns = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="grid grid-cols-2 gap-6">
      {campaigns.map((campaign) => (
        <Link href={`/c/${campaign}`} key={campaign}>
          <div className="w-full h-[300px] shadow-md rounded-md">
            <div className="h-2/3">
              <Skeleton className="w-full h-full" />
            </div>
            <div className="h-1/3"></div>
          </div>
        </Link>
      ))}
    </div>
  );
}
