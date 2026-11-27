import type { Metadata } from "next";

// Private area: kept out of search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: "/personal" },
};

export default function PrivateLayout({ children }: LayoutProps<"/personal">) {
  return children;
}
