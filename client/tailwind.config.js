/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        edunova: {
          // 1. Azul Marino del Escudo y Libro
          navy: '#0A2540',
          'navy-dark': '#06172A',
          'navy-light': '#14385C',
          'navy-border': '#1E4775',
          
          // 2. Dorado Académico de los Laureles y Borde Interior
          gold: '#D4A328',
          'gold-hover': '#BF8F1B',
          'gold-light': '#FDF6E2',
          'gold-muted': '#E5C568',
          
          // 3. Verde Esmeralda del Checkmark de Aprobación
          emerald: '#059669',
          'emerald-light': '#E6F4EA',
          
          // 4. Fondos y Textos del Sistema
          canvas: '#F8FAFC',
          card: '#FFFFFF',
          text: '#1E293B',
          muted: '#64748B',
          border: '#E2E8F0',
          
          // Estados de apoyo
          warning: '#EAB308',
          danger: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold': '0 4px 14px 0 rgba(212, 163, 40, 0.25)',
        'navy': '0 4px 20px 0 rgba(10, 37, 64, 0.15)',
      }
    },
  },
  plugins: [],
}
