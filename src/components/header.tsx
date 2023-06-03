"use client";

import { Settings } from "lucide-react";
import Link from "./link";
import { useSearchParams } from "next/navigation";
import Heading from "./heading";

export default function Header() {
  const searchParams = useSearchParams();
  return (
    <header
      className="border-b-1 background-b-background-alt mb-4 flex items-center justify-between 
      border-t-4 border-t-primary bg-background-alt px-8 py-1 shadow-md shadow-black/25"
    >
      <nav className="flex items-center gap-4">
        <Link href="/">
          <Heading index={1} className="hidden">
            Nonogram
          </Heading>
          <span className='font-display text-3xl before:content-["Nng"] md:before:content-["Nonogram"]'></span>
        </Link>
        <Link href={`/play?${searchParams.toString()}`}>
          <Heading index={2} className="!mb-0">
            Play
          </Heading>
        </Link>
        <Link href="/editor">
          <Heading index={2} className="!mb-0">
            Editor
          </Heading>
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
