import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
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
  title: "Valencia Verde — Sistema de Reporte de Incendios",
  description:
    "Plataforma oficial para el reporte y seguimiento de incendios forestales en Valencia, Venezuela.",
  keywords: ["incendios", "forestales", "valencia", "venezuela", "reporte"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full bg-[--color-background] text-[--color-foreground]">
        <>
          {children}
          <Toaster />
        </>
      </body>
    </html>
  );
}
