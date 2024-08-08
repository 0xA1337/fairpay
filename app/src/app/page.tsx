import { Button } from "@/shared/components/ui/button";
import { CirclePlusIcon, CompassIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Button size={"sm"} variant={"outline"} className="mr-2" asChild>
        <Link href="/explore">
          <CompassIcon className="w-4 h-4 mr-2" />
          Explore
        </Link>
      </Button>
      <Button size={"sm"} asChild>
        <Link href="/new">
          <CirclePlusIcon className="w-4 h-4 mr-2" />
          Create
        </Link>
      </Button>
    </main>
  );
}
