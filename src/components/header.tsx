import Link from "next/link";

export default function Header() {
  return (
    <header
      className="border-b-1 background-b-background-alt mb-4 flex items-center justify-between
      border-t-4 border-t-primary bg-background-alt py-1 shadow-md shadow-black/25"
    >
      <nav className="flex items-center">
        <Link href="/">
          <h1 className="mx-12 font-display text-3xl">Nonogram</h1>
        </Link>
      </nav>
    </header>
  );
}
