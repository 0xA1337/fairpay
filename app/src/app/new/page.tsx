import { NewCampaignForm } from "./_components/new-campaign-form";

export default function NewCampaignPage() {
  return (
    <main className="mx-auto w-full max-w-5xl py-8">
      <h1 className="text-2xl font-semibold">Start your campaign</h1>
      <NewCampaignForm />
    </main>
  );
}
