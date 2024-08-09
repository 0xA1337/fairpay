import { NewCampaignForm } from "./_components/new-campaign-form";

export default function NewCampaignPage() {
  return (
    <main className="mx-auto w-full max-w-5xl py-8 space-y-4">
      <h1 className="text-3xl font-bold">Start your campaign</h1>
      <NewCampaignForm />
    </main>
  );
}
