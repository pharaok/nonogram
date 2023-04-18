import Header from "components/header";
import { Silkscreen } from "next/font/google";
import "./globals.css";

const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
  weight: "400",
  subsets: ["latin-ext"],
});

export const metadata = {
  title: {
    default: "Nonogram",
    template: "%s | Nonogram",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-white ${silkscreen.variable}`}>
        <div className="flex h-screen w-screen flex-col">
          <Header />
          <main className="flex-1 overflow-hidden">{children}</main>
        </div>
      </body>
    </html>
  );
}
