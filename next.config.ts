import type { NextConfig } from "next";

// Sur GitHub Pages, le site est servi sous /project-luno.
const pages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: pages ? "/project-luno" : undefined,
  // Pour les liens vers les fichiers de `public/` (PDF), que Next ne préfixe pas tout seul.
  env: { NEXT_PUBLIC_BASE_PATH: pages ? "/project-luno" : "" },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
