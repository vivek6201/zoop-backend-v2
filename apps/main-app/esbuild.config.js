import { build } from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const PACKAGES_PATH = path.resolve(__dirname, "../../packages");
const IS_PROD = process.env.NODE_ENV === "production";

// Path resolution helpers
const resolvePackagePath = (packageName, filePath = "src/index.ts") =>
  path.resolve(PACKAGES_PATH, packageName, filePath);

const validatePath = (filepath, packageName) => {
  if (!fs.existsSync(filepath)) {
    return {
      errors: [
        { text: `${packageName} build output not found at ${filepath}` },
      ],
    };
  }
  return { path: filepath };
};

// Plugin configurations
const monorepoResolverPlugin = {
  name: "monorepo-resolver",
  setup(build) {
    build.onResolve({ filter: /^@repo\/db(\/src)?(\/index)?$/ }, () =>
      validatePath(resolvePackagePath("db"), "@repo/db")
    );

    build.onResolve({ filter: /^@repo\/validations(\/src)?(\/index)?$/ }, () =>
      validatePath(resolvePackagePath("validations"), "@repo/validations")
    );

    build.onResolve(
      { filter: /^@repo\/service-config(\/src)?(\/index)?$/ },
      () =>
        validatePath(
          resolvePackagePath("service-config"),
          "@repo/service-config"
        )
    );
  },
};

// Build configuration
const buildConfig = {
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  platform: "node",
  format: "esm",
  sourcemap: true,
  minify: IS_PROD,
  target: ["node20"],
  banner: {
    js: `
      const require = (await import("node:module")).createRequire(import.meta.url);
      const __filename = (await import("node:url")).fileURLToPath(import.meta.url);
      const __dirname = (await import("node:path")).dirname(__filename);
    `,
  },
  plugins: [
    nodeExternalsPlugin({
      allowList: ["@repo/db", "@repo/service-config", "@repo/validations"],
    }),
    monorepoResolverPlugin,
  ],
};

// Execute build
build(buildConfig).catch(() => process.exit(1));
