import type { NextConfig } from "next";
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

// Sur GitHub Pages, le site est servi sous /project-luno.
const pages = process.env.GITHUB_PAGES === "true";

// Identifiant de cette version du site : le site le compare à `version.json` pour
// proposer de recharger quand une mise à jour a été publiée (voir MiseAJour.tsx).
const version = (() => {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.slice(0, 12);
  try {
    return execSync("git rev-parse --short=12 HEAD").toString().trim();
  } catch {
    return "local";
  }
})();
writeFileSync("public/version.json", JSON.stringify({ version }));

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: pages ? "/project-luno" : undefined,
  // Pour les liens vers les fichiers de `public/` (PDF), que Next ne préfixe pas tout seul.
  env: { NEXT_PUBLIC_BASE_PATH: pages ? "/project-luno" : "", NEXT_PUBLIC_VERSION: version },
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
