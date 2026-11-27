import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sites que vendem por você — planos e preços | Raw AI",
  description:
    "Sites profissionais para pequenos negócios em Brasília e nos EUA: planos Essencial, Profissional e Premium, com preços, modelos e exemplos no ar.",
  alternates: { canonical: "/sites" },
};

export default function SitesLayout({ children }: LayoutProps<"/sites">) {
  return children;
}
