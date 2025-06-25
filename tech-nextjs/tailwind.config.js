/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf6',
          100: '#dcfceb',
          200: '#bbf7d7',
          300: '#86efb5',
          400: '#4ade8b',
          500: '#22c667',
          600: '#16a653',
          700: '#158044',
          800: '#166538',
          900: '#145330',
        },
        secondary: {
          50: '#fef6ee',
          100: '#fdead7',
          200: '#f9d1ae',
          300: '#f5b07a',
          400: '#f08344',
          500: '#ec6421',
          600: '#dd4b17',
          700: '#b73916',
          800: '#922f19',
          900: '#772917',
        },
        accent: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        dark: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#262626',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

