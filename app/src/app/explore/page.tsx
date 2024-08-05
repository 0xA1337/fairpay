import { ExploreCampaignsGrid } from "./_components/explore-campaigns-grid";

export default function ExplorePage() {
  const X = 1234; // TODO: Fetch from Subgraph

  return (
    <main className="mx-auto w-full max-w-5xl py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Uncover the Perfect Campaign for You</h1>
        <p className="text-neutral-700">
          Dive into
          <span className="font-medium"> {X} </span>
          active campaigns and make a difference today.
        </p>
      </div>

      <ExploreCampaignsGrid />
    </main>
  );
}
