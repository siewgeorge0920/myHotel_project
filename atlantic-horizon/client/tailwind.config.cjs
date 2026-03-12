/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        manorGreen: "#343a2f",
        manorGold: "#d4c5a1",
        manorRose: "#d2b4a0",
        manorTan: "#bfa36d"
      },
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        lato: ["Lato", "sans-serif"],
        georgia: ["Georgia", "serif"],
        courier: ["Courier New", "monospace"]
      }
    }
  },
  plugins: []
};
