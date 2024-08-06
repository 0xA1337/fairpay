import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="w-full max-w-5xl mx-auto flex-grow flex flex-col gap-y-4 items-center justify-center">
      <p className="text-4xl font-semibold">Woops..</p>
      <p className="text-3xl font-semibold">{"We couldn't find the page you were looking for"}</p>
      <Button size={"lg"} asChild>
        <Link href="/">Go back home</Link>
      </Button>
    </main>
  );
}
