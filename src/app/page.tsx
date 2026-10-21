import { LangProvider } from "@/lib/lang";
import { TechBackground } from "@/components/TechBackground";
import { CursorGlow } from "@/components/CursorGlow";
import { MotionRoot } from "@/components/MotionRoot";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Ticker } from "@/components/Ticker";
import { Pillars } from "@/components/Pillars";
import { WebsiteBuilding } from "@/components/WebsiteBuilding";
import { Marketing } from "@/components/Marketing";
import { Robots } from "@/components/Robots";
import { HowItWorks } from "@/components/HowItWorks";
import { Projects } from "@/components/Projects";
import { Audit } from "@/components/Audit";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Jarvis } from "@/components/Jarvis";

export default function Home() {
  return (
    <LangProvider>
      <MotionRoot>
        <TechBackground />
        <CursorGlow />
        <Nav />
        <main className="flex-1">
          <Hero />
          <Ticker />
          <Pillars />
          <WebsiteBuilding />
          <Marketing />
          <Robots />
          <HowItWorks />
          <Projects />
          <Audit />
          <FAQ />
          <Footer />
        </main>
        <Jarvis />
      </MotionRoot>
    </LangProvider>
  );
}
