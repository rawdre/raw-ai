import type { NextConfig } from "next";

const PAINEL_URL = "https://rawai-painel.vercel.app";

const nextConfig: NextConfig = {
  // Easy address for André's internal painel (RAW AI marketing team). Not linked from the top nav.
  async redirects() {
    return [
      { source: "/painel", destination: PAINEL_URL, permanent: false },
      { source: "/painel/:path*", destination: `${PAINEL_URL}/:path*`, permanent: false },
    ];
  },
};

export default nextConfig;
