/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 👑 你的专属 Hotel Design System Color Library
      colors: {
        hotel: {
          gold: '#f59e0b',       // 酒店的主打金色 (你可以随时换 HEX code)
          goldHover: '#d97706',  // hover 时的深金色
          dark: '#111827',       // 酒店的高级黑 (用于 Navbar)
          light: '#f9fafb',      // 背景的干净白/灰
          border: '#e5e7eb',     // 细线条的颜色
          danger: '#ef4444',     // 删除/Logout 用的红色
        }
      }
    },
  },
  plugins: [],
}