import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function to safely import optional plugins
async function safeImport<T>(moduleName: string, fallback: T): Promise<T> {
  try {
    return await import(moduleName);
  } catch {
    console.warn(`Optional plugin ${moduleName} not found, skipping...`);
    return fallback;
  }
}

export default defineConfig(async () => {
  const plugins = [react()];
  
  // Add optional Replit plugins only if available
  try {
    const runtimeErrorOverlay = await import("@replit/vite-plugin-runtime-error-modal");
    plugins.push(runtimeErrorOverlay.default());
  } catch {
    console.warn("@replit/vite-plugin-runtime-error-modal not found, skipping...");
  }
  
  try {
    const themePlugin = await import("@replit/vite-plugin-shadcn-theme-json");
    plugins.push(themePlugin.default());
  } catch {
    console.warn("@replit/vite-plugin-shadcn-theme-json not found, skipping...");
  }

  // Add Cartographer plugin only in development
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    try {
      const cartographer = await import("@replit/vite-plugin-cartographer");
      plugins.push(cartographer.cartographer());
    } catch {
      console.warn("@replit/vite-plugin-cartographer not found, skipping...");
    }
  }

  return {
    // Use VITE_BASE env var when set so we can build with different base paths
    // e.g. for GitHub Pages set VITE_BASE=/portfolio/ before building.
    base: process.env.VITE_BASE || '/',
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
    },
  };
});

// export default defineConfig({
//   plugins: [
//     react(),
//     runtimeErrorOverlay(),
//     themePlugin(),
//     ...(process.env.NODE_ENV !== "production" &&
//     process.env.REPL_ID !== undefined
//       ? [
//           await import("@replit/vite-plugin-cartographer").then((m) =>
//             m.cartographer(),
//           ),
//         ]
//       : []),
//   ],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "client", "src"),
//       "@shared": path.resolve(__dirname, "shared"),
//       "@assets": path.resolve(__dirname, "attached_assets"),
//     },
//   },
//   root: path.resolve(__dirname, "client"),
//   build: {
//     outDir: path.resolve(__dirname, "dist/public"),
//     emptyOutDir: true,
//   },
// });
