import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        'rainbow': "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)",
        'rainbow-less': "linear-gradient(45deg, red, blue, indigo)",
      },
      colors: {
        primary: '#434343',
      },
    },
  },
  plugins: [],
}
export default config
