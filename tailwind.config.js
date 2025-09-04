/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", 
  content: ["./app/**/*.tsx","./components/**/*.tsx"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {}
  },
  plugins: []
}
