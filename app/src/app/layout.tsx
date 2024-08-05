import { Header } from "@/shared/components/header";
import { cn } from "@/shared/utils/tailwind";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Fairpay",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-screen" style={{ scrollbarGutter: "stable" }}>
      <body className={cn(inter.className, "w-full h-full")}>
        <Header />
        {children}
      </body>
    </html>
  );
}
