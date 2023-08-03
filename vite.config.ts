/** @type {import('vite').UserConfig} */
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "tailwindcss";
import {defineConfig, loadEnv} from "vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

export default ({mode}) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
    plugins: [react(), svgr(), tsconfigPaths()],
    css: {
      postcss: {
        plugins: [tailwindcss],
      },
    },
    server: {
      proxy: {
        "/api/v1": {
          target: process.env.VITE_API_URL,
          changeOrigin: true,
          rewrite: path => path.replace("/api/v1", ""),
        },
      },
    },
  });
};
