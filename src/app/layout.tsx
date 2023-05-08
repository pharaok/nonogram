import Header from "components/header";
import { ThemeSetter } from "components/themeSetter";
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
        <div className="min-w-screen flex min-h-screen flex-col">
          <Header />
          {children}
        </div>
      </body>
      <ThemeSetter />
    </html>
  );
}
