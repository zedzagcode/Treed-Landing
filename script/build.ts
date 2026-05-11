import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, mkdir } from "fs/promises";
import path from "path";

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "axios",
  "compression",
  "connect-pg-simple",
  "iconv-lite",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  // ─── Step 1: Build the client (browser bundle) ────────────────────────────
  console.log("building client...");
  await viteBuild();

  // ─── Step 2: Build the SSR bundle with esbuild ────────────────────────────
  console.log("building SSR bundle...");

  await mkdir(path.resolve(process.cwd(), "dist/ssr"), { recursive: true });

  await esbuild({
    entryPoints: [
      path.resolve(process.cwd(), "client/src/entry-server.tsx"),
    ],
    platform: "node",
    target: "node18",
    bundle: true,
    format: "cjs",
    outfile: path.resolve(process.cwd(), "dist/ssr/entry-server.cjs"),
    jsx: "automatic",
    alias: {
      "@": path.resolve(process.cwd(), "client/src"),
      "@shared": path.resolve(process.cwd(), "shared"),
      "@assets": path.resolve(process.cwd(), "attached_assets"),
    },
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    plugins: [
      {
        name: "ssr-asset-handler",
        setup(build) {
          build.onLoad({ filter: /\.css$/ }, () => ({
            contents: "",
            loader: "js",
          }));
          build.onLoad(
            { filter: /\.(png|jpe?g|gif|svg|webp|avif|ico|ttf|woff2?)$/ },
            () => ({
              contents: "export default ''",
              loader: "js",
            }),
          );
        },
      },
    ],
    logLevel: "info",
  });

  // ─── Step 3: Build the Express server ─────────────────────────────────────
  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});