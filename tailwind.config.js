/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Poppins-Regular', 'sans-serif'],
        'medium': ['Poppins-Medium', 'sans-serif'],
        'semibold': ['Poppins-SemiBold', 'sans-serif'],
        'bold': ['Poppins-Bold', 'sans-serif'],
      },
      colors: {
        'primary-light': '#f6f1ff',
        'primary-dark': '#d8d7d7ff',
        'primary-gray': '#a8a8a8ff',
        'charcoal-color': '#2c2c2cff',
        'accent-green': '#2E7D32', 
        'ligth-green': '#d5e6d5ff',
      }
    },
  },
  plugins: [],
}