import { CampaignPanel } from "./_components/campaign-panel";
import { GetInvolvedPanel } from "./_components/get-involved-panel";

export default function CampaignPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <main className="mx-auto w-full max-w-5xl py-8">
      <div className="grid grid-cols-3 gap-6">
        <CampaignPanel />
        <GetInvolvedPanel />
      </div>
    </main>
  );
}
