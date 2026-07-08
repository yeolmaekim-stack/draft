import type { NextConfig } from "next";

// GitHub Pages serves this repo at https://<user>.github.io/draft/,
// so the static export needs that subpath baked into every asset/route.
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/draft" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
