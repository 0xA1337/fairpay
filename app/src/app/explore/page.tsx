import { Suspense } from "react";
import { CampaignsGrid } from "./_components/campaigns-grid";
import { SkeletonCampaignsGrid } from "./_components/skeleton-campaigns-grid";

export default function ExplorePage() {
  return (
    <main className="mx-auto w-full max-w-4xl py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Uncover the Perfect Campaign for You</h1>
        <p className="text-neutral-700">Dive into active campaigns and make a difference today.</p>
      </div>

      <Suspense fallback={<SkeletonCampaignsGrid />}>
        <CampaignsGrid />
      </Suspense>
    </main>
  );
}
