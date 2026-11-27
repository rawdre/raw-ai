import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Anton } from "next/font/google";
import { SESSION_COOKIE, isConfigured, isValidSession, loadHealthData } from "@/lib/personal/server";
import { loadStravaFeed } from "@/lib/personal/strava";
import { Gate } from "@/components/personal/Gate";
import { Dashboard } from "@/components/personal/Dashboard";
import "./personal.css";

const poster = Anton({ variable: "--font-poster", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Personal — Raw AI",
  description: "Área privada.",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic"; // never prerender or cache: output depends on the session cookie

// The dossier is decrypted on the server ONLY after the session cookie verifies,
// and reaches the browser as props of this request — never as a static asset.
export default async function PersonalPage() {
  const store = await cookies();
  const unlocked = isValidSession(store.get(SESSION_COOKIE)?.value);

  const data = unlocked ? loadHealthData() : null;
  const strava = data ? await loadStravaFeed(data.game.activities) : null;

  return (
    <div className={`${poster.variable} personal`}>
      {data && strava ? <Dashboard data={data} strava={strava} /> : <Gate configured={isConfigured()} />}
    </div>
  );
}
