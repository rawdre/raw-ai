import type { NextConfig } from "next";

const PAINEL_URL = "https://rawai-painel.vercel.app";

const nextConfig: NextConfig = {
  // Easy address for André's internal painel (RAW AI marketing team). Not linked from the top nav.
  async redirects() {
    return [
      // Straight to the login: one hop when logged out; /entrar sends a logged-in session on to Aprovações.
      { source: "/painel", destination: `${PAINEL_URL}/entrar`, permanent: false },
      { source: "/painel/:path*", destination: `${PAINEL_URL}/:path*`, permanent: false },
    ];
  },
};

export default nextConfig;
