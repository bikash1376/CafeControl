import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  weight: ["400"], // array, even if only one
  style: ["normal"],
  subsets: ["latin"], // required
});

const monospace = Space_Mono({
  weight: ["400", "700"], // multiple weights
  style: ["normal"],      // still an array
  subsets: ["latin"],     // required
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maze",
  description: "Maze inside",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
