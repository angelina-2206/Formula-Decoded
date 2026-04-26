import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Formula Decoded | Breaking Down the Technology of Modern F1",
  description:
    "An interactive web platform for exploring the engineering, aerodynamics, and hybrid power systems of modern Formula One cars, with deep focus on the 2026 regulations.",
  keywords: ["Formula 1", "F1", "aerodynamics", "hybrid power", "2026 regulations", "interactive", "3D"],
  openGraph: {
    title: "Formula Decoded",
    description: "Breaking Down the Technology of Modern Formula One",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
