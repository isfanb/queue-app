/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      'small': {'min':'1066px'},
      'medium': {'min':'1820px'},
      'large': {'min':'2460px'},
      'x-large': {'min':'3840px'}
    }
  },
  plugins: [],
}

