import { Skeleton } from "@/shared/components/ui/skeleton";

export function SkeletonCampaignPanel() {
  return (
    <section className="space-y-5">
      <div className="rounded-lg overflow-hidden border border-border/40">
        <div className="w-full h-[400px]">
          <Skeleton className="w-full h-full rounded-none" />
        </div>
        <div className="p-6">
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-4 w-1/3 rounded-tr-none" />
        </div>
      </div>
      <div className="p-6 rounded-lg overflow-hidden border border-border/40">
        <Skeleton className="h-5 w-2/5 mb-2" />
        <Skeleton className="h-14 w-full" />
      </div>
    </section>
  );
}
