/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        urgency: {
          low: "#22c55e",
          medium: "#eab308",
          high: "#ef4444",
        },
      },
    },
  },
  plugins: [],
};
