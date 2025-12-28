/** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./src/**/*.{js,jsx,ts,tsx}"],

//   darkMode: 'class',

//   safelist: [
//     'dark',
//     'dark:bg-gray-900',
//     'dark:bg-black',
//     'dark:text-white',
//     'dark:bg-gray-700'
//   ],

//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };
export default {
  darkMode: 'class', // ✅ required
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ this must match your file structure
  ],
  theme: {
  extend: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
  },
},

  plugins: [],
}
