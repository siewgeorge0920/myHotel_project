import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {

    chunkSizeWarningLimit: 1000, // Raises the warning limit to 1MB
  
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Puts all external libraries into a separate file
          }
        }
      }
    }
  }
})
