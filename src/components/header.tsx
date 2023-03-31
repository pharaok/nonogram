import Link from "next/link";

export default function Header() {
  return (
    <header
      className="flex justify-between items-center  mb-4 py-1 bg-gray-200 shadow-md shadow-black/25
                 border-t-4 border-t-purple-600 border-b-2"
    >
      <nav className="flex items-center">
        <Link href="/">
          <h1 className="text-3xl font-display mx-12">Nonogram</h1>
        </Link>
      </nav>
    </header>
  );
}
