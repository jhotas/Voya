import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Voya | Planeje suas viagens",
  description: "Crie roteiros colaborativos com seus amigos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${inter.className} antialiased bg-zinc-950 text-zinc-100 min-h-screen`}
      >
          <Navbar />
          {children}
      </body>
    </html>
  );
}