import { CirclePlusIcon, CompassIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="w-full max-w-5xl p-4 border-b border-border flex justify-between mx-auto">
      <Link href="/">
        <Image
          src="/assets/fairpay-textlogo.png"
          alt="Logo"
          width={787}
          height={200}
          className="h-8 w-auto"
        />
      </Link>
      <div>
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
      </div>
    </header>
  );
}
