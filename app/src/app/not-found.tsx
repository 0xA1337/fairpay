import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="w-full max-w-4xl flex flex-col gap-y-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <p className="text-4xl text-center font-semibold">Woops..</p>
      <p className="text-3xl text-center font-medium">
        {"We couldn't find the page you were looking for"}
      </p>
      <Button size={"lg"} className="self-center" asChild>
        <Link href="/">Go back home</Link>
      </Button>
    </main>
  );
}
