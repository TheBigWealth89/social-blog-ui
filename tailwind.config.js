module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        animation: {
          'flip-in': 'flipIn 0.5s ease-in-out',
          'flip-out': 'flipOut 0.5s ease-in-out',
        },
        keyframes: {
          flipIn: {
            '0%': { transform: 'rotateY(90deg)', opacity: '0' },
            '100%': { transform: 'rotateY(0deg)', opacity: '1' },
          },
          flipOut: {
            '0%': { transform: 'rotateY(0deg)', opacity: '1' },
            '100%': { transform: 'rotateY(-90deg)', opacity: '0' },
          }
        }
      },
    },
    plugins: [],
  }