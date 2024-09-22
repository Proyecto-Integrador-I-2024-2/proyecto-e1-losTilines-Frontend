/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {

      },
      height: {
        '96': '24rem',  // 384px
        '100': '25rem', // 400px
        '104': '26rem', // 416px
        '108': '27rem', // 432px
        '112': '28rem', // 448px
        '116': '29rem', // 464px
        '120': '30rem', // 480px
        '124': '31rem', // 496px
        '128': '32rem', // 512px
        '144': '36rem', // 528px
        '160': '40rem', // 544px
        '192': '48rem', // 560px
      }
    },
  },
  plugins: [],
});
