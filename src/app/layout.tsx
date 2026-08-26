import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Raw AI — Funcionário IA que nunca dorme",
  description:
    "Agentes de IA que respondem seus leads 24/7, fazem follow-up como seu melhor vendedor e gerenciam seu pipeline. Diagnóstico de IA grátis para o seu negócio.",
  metadataBase: new URL("https://raw-ai.vercel.app"),
  openGraph: {
    title: "Raw AI — Funcionário IA que nunca dorme",
    description:
      "Agentes de IA que trabalham 24/7 pelo seu negócio: respondem leads, fazem follow-up e cuidam do pipeline.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
