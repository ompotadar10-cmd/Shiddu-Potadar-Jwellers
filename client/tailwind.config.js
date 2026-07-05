export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFF9E6',
          100: '#FFF0C2',
          200: '#FFE08A',
          300: '#FFD052',
          400: '#F5C518',
          500: '#D4AF37',
          600: '#B8860B',
          700: '#8B6914',
          800: '#6B5010',
          900: '#4A370B',
        },
        cream: { DEFAULT: '#FFF8E7', dark: '#F5E6C8' },
        dark: { DEFAULT: '#1A1A1A', light: '#2D2D2D', lighter: '#3D3D3D' },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
};
