import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts"],
  format: ["cjs"],
  sourcemap: true,
  dts: true,
  clean: true,
  external: ["@prisma/client"],
  esbuildOptions(options) {
    options.alias = {
      "@": "./src",
      test: "./test",
    };
  },
});
