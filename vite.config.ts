// import { fileURLToPath, URL } from "url";
// import vue from "@vitejs/plugin-vue";

// // https://vitejs.dev/config/
// export default ({ command, mode }: any) => {
//   if (command === "serve") {
//     return {
//       plugins: [vue()],
//       resolve: {
//         alias: {
//           "@": fileURLToPath(new URL("./src", import.meta.url)),
//         },
//       },
//     };
//   } else {
//     return {
//       plugins: [vue()],
//       resolve: {
//         alias: {
//           "@": fileURLToPath(new URL("./src", import.meta.url)),
//         },
//       },
//       base: "/codestates-bithumb-frontend/",
//       build: {
//         outDir: "docs",
//       },
//     };
//   }
// };
import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
