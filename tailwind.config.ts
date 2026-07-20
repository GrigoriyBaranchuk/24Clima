import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    // Общая тема (colors/fonts/container/radius) живёт в @24clima/design —
    // правки дизайна делать там, не здесь (см. DESIGN.md пакета).
    presets: [require("@24clima/design/tailwind-preset")],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // Shared design-system components ship raw TSX — Tailwind must scan them
    // so their token classes (bg-whatsapp, bg-brand-navy-dark, …) get generated.
    "./node_modules/@24clima/design/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
      },
    }
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
