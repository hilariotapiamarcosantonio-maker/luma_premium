import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://luma-premium.vercel.app"
  ),
  title: {
    default: "Luma Premium | Arquitectura comercial digital",
    template: "%s | Luma Premium",
  },
  description:
    "Sistemas comerciales digitales para negocios premium que necesitan captar, responder, organizar y convertir oportunidades con más autoridad, seguimiento y control.",
  openGraph: {
    title: "Luma Premium | Arquitectura comercial digital",
    description:
      "Sistemas comerciales digitales para negocios premium que venden con autoridad, seguimiento y control.",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
