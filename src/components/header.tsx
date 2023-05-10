"use client";

import { Settings } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Header() {
  const searchParams = useSearchParams();
  return (
    <header
      className="border-b-1 background-b-background-alt mb-4 flex items-center justify-between 
      border-t-4 border-t-primary bg-background-alt px-8 py-1 shadow-md shadow-black/25"
    >
      <nav className="flex items-center gap-4">
        <Link href="/">
          <h1 className="font-display text-3xl">Nonogram</h1>
        </Link>
        <Link href={`/play?${searchParams.toString()}`}>
          <h1 className="">Play</h1>
        </Link>
      </nav>
      <nav className="flex">
        <Link href="/settings">
          <Settings />
        </Link>
      </nav>
    </header>
  );
}
