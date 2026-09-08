/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        onefi: {
          purple: "#6B21E8",
          purpleDark: "#4C15A8",
          purpleLight: "#F3ECFF",
          bg: "#F4F4F7",
          muted: "#6B6772",
        },
      },
    },
  },
  plugins: [],
};
