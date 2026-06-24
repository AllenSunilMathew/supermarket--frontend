/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#3BB77E',
          dark:    '#111827',
          light:   '#DEF9EC',
          yellow:  '#FDC040',
          orange:  '#fd7e14',
          cream:   '#F4F6FA',
        },
        // Expose textColor as usable utility classes: text-textColor-body etc.
        textColor: {
          heading: '#111111',
          body:    '#1F2937',
          muted:   '#4B5563',
        },
      },
      fontFamily: {
        sans: ['Quicksand', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        custom:  '0 8px 24px rgba(149, 157, 165, 0.12)',
        premium: '0 10px 30px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
