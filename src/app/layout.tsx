import { Silkscreen } from "next/font/google";
import Header from "components/header";
import "./globals.css";

const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
  weight: "400",
  subsets: ["latin"],
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
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className={silkscreen.variable}>
        <Header />
        {children}
      </body>
    </html>
  );
}
