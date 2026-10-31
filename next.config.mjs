import nextMDX from "@next/mdx";
import bundleAnalyzer from "@next/bundle-analyzer";

/** Private backend API URL (server-side only) */
const backendUrl = process.env.API_BASE_URL || "https://artemia-backend-production.up.railway.app";
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withMDX = nextMDX({
  extension: /\.(md|mdx)$/,
});

const nextConfig = {
  devIndicators: false,

  allowedDevOrigins: ["http://artemia.local:3000"],

  /** Ignore build-blocking TypeScript errors */
  typescript: {
    ignoreBuildErrors: true,
  },

  /** Enable MDX as pages/components */
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],

  /** External image domains */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: backendUrl.startsWith("https") ? "https" : "http",
        hostname: new URL(backendUrl).hostname,
      },
    ],
  },
};

export default withBundleAnalyzer(withMDX(nextConfig));
