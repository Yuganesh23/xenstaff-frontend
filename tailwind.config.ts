import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Official XenStaff Color Palette
        brand: {
          white: "#FEFEFE",
          light: "#F4F4F4",
          cool: "#DFDFE2",
          neutral: "#BEC0BF",
          sage: "#708A83",
          teal: "#476E66",
          tealHover: "#3B5C55",
          primary: "#202B28",
          secondary: "#66736F",
        },
        primary: {
          DEFAULT: "#476E66",
          hover: "#3B5C55",
          foreground: "#FEFEFE",
        },
        accent: {
          DEFAULT: "#708A83",
          foreground: "#FEFEFE",
        },
        // Harmonized Semantic Status Colors
        success: {
          DEFAULT: "#3B7A57",
          bg: "#EBF4EF",
          foreground: "#FEFEFE",
        },
        warning: {
          DEFAULT: "#B37D28",
          bg: "#FCF7EE",
          foreground: "#FEFEFE",
        },
        destructive: {
          DEFAULT: "#B0413E",
          bg: "#FBEBEB",
          foreground: "#FEFEFE",
        },
        // Mapped color scales for unified B2B calm palette
        slate: {
          50: "#F4F4F4",
          100: "#ECECEE",
          200: "#DFDFE2",
          300: "#BEC0BF",
          400: "#8B9793",
          500: "#66736F",
          600: "#505C58",
          700: "#3F4D49",
          800: "#2D3A36",
          900: "#202B28",
          950: "#18201E",
        },
        blue: {
          50: "#EBF2F0",
          100: "#D6E5E2",
          200: "#B8D2CC",
          500: "#708A83",
          600: "#476E66",
          700: "#3B5C55",
          800: "#2F4A44",
          900: "#202B28",
        },
        emerald: {
          50: "#EBF4EF",
          100: "#D3E9DC",
          600: "#3B7A57",
          700: "#316548",
          800: "#27503A",
        },
        amber: {
          50: "#FCF7EE",
          100: "#F7ECCF",
          600: "#B37D28",
          700: "#926520",
        },
        red: {
          50: "#FBEBEB",
          100: "#F6D4D4",
          600: "#B0413E",
          700: "#913532",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
