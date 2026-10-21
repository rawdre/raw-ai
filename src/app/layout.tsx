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
  title: "Raw AI — Sites, Marketing e Robôs de IA",
  description:
    "Sites cinematográficos, estratégia de marketing com criativos feitos por IA e robôs que respondem leads, fazem follow-up e vendem 24/7. Diagnóstico grátis.",
  metadataBase: new URL("https://raw-ai.vercel.app"),
  openGraph: {
    title: "Raw AI — Sites, Marketing e Robôs de IA",
    description:
      "Eu construo a máquina que faz seu negócio crescer: sites, marketing e robôs de IA trabalhando 24/7.",
    type: "website",
    images: [{ url: "/hf/hero-wide.jpg", width: 1920, height: 1071 }],
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
