import { LangProvider } from "@/lib/lang";
import { TechBackground } from "@/components/TechBackground";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Capabilities } from "@/components/Capabilities";
import { HowItWorks } from "@/components/HowItWorks";
import { Projects } from "@/components/Projects";
import { WebsiteBuilding } from "@/components/WebsiteBuilding";
import { Audit } from "@/components/Audit";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Jarvis } from "@/components/Jarvis";

export default function Home() {
  return (
    <LangProvider>
      <TechBackground />
      <Nav />
      <main className="flex-1">
        <Hero />
        <Capabilities />
        <HowItWorks />
        <Projects />
        <WebsiteBuilding />
        <Audit />
        <FAQ />
        <Footer />
      </main>
      <Jarvis />
    </LangProvider>
  );
}
