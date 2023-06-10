import Head from "next/head";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Juego de piedras",
  description: "Programación Avanzada - 2023",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/unrc-logotype.ico" />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
