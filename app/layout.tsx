import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BihariThread — Rooted in Bihar. Worn Everywhere.",
  description: "Premium streetwear brand rooted in Bihari culture. Shop oversized tees, limited editions, and custom prints. Born in Bihar, designed for the streets.",
  keywords: ["BihariThread", "Bihar", "streetwear", "oversized tees", "Indian fashion", "premium clothing"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
