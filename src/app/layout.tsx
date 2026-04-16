import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/toaster";
import { TRPCReactProvider } from "@/trpc/client";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Devroast",
  description:
    "Cole seu código, ative o roast mode ou receba feedback direto — mini SaaS de avaliação de código.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${jetbrainsMono.variable} dark`} lang="pt-BR">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Toaster />
        <TRPCReactProvider>
          <SiteHeader />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
