import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { BUSINESS, SITE_URL } from "@/lib/site";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

// Structured data: tells search engines and AI tools who this business is, in their own format.
const businessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: BUSINESS.name,
  alternateName: BUSINESS.shortName,
  url: SITE_URL,
  image: `${SITE_URL}/hf/hero-wide.jpg`,
  description:
    "Agência em Brasília que cria sites, marketing com criativos feitos por IA e robôs de IA que respondem leads 24/7.",
  telephone: BUSINESS.phone,
  founder: { "@type": "Person", name: BUSINESS.founder },
  address: { "@type": "PostalAddress", addressLocality: BUSINESS.city, addressRegion: BUSINESS.region, addressCountry: BUSINESS.country },
  areaServed: ["Brasília", "Distrito Federal", "Brasil", "United States"],
  knowsLanguage: ["pt-BR", "en"],
  sameAs: [BUSINESS.instagram],
};

export const metadata: Metadata = {
  title: "Raw AI Business Solution — Sites, Marketing e Robôs de IA em Brasília",
  description:
    "Sites cinematográficos, estratégia de marketing com criativos feitos por IA e robôs que respondem leads, fazem follow-up e vendem 24/7. Diagnóstico grátis.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
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
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }} />
        {children}
      </body>
    </html>
  );
}
