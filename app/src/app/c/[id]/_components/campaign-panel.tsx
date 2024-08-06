import { Skeleton } from "@/shared/components/ui/skeleton";

export function CampaignPanel() {
  return (
    <section className="col-span-2 space-y-5">
      <div className="rounded-lg overflow-hidden border border-border/40">
        <div className="w-full h-[400px]">
          <Skeleton className="w-full h-full rounded-none" />
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold">Campaign title goes here</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </p>
        </div>
      </div>
      <div className="p-6 rounded-lg overflow-hidden border border-border/40">
        <h2 className="text-xl font-semibold">Campaign details</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </p>
      </div>
    </section>
  );
}
