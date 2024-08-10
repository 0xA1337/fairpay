import Image from "next/image";
import Link from "next/link";
import { HeaderAuthSection } from "./header-auth-section";

export function Header() {
  return (
    <header className="w-full max-w-4xl p-4 border-b border-border flex justify-between mx-auto">
      <Link href="/">
        <Image
          src="/assets/fairpay-textlogo.png"
          alt="Logo"
          width={787}
          height={200}
          className="h-8 w-auto"
        />
      </Link>
      <HeaderAuthSection />
    </header>
  );
}
