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
          // Paleta Oficial Ocean Tech Premium
          petroleum: '#123B50',      // Azul petróleo
          deepBlue: '#17365D',       // Azul profundo
          midnight: '#102A43',       // Azul noche
          turquoise: '#19B5A5',      // Turquesa
          cyan: '#48BFE3',           // Cian
          iceBlue: '#DCEEF5',        // Azul hielo
          mint: '#70D6B3',           // Verde menta
          amber: '#E9B949',          // Ámbar
          slateGrey: '#EDF2F7',      // Gris azulado
          canvas: '#F4F7FA',         // Fondo general
          surface: '#FFFFFF',        // Blanco
          textPrimary: '#263746',    // Texto principal
          textSecondary: '#718096',  // Texto secundario

          // Semántica de compatibilidad
          success: '#19B5A5',
          danger: '#EF4444',
          warning: '#E9B949',
          info: '#48BFE3',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 10px 35px 0 rgba(18, 59, 80, 0.08)',
        'glass-hover': '0 18px 45px -4px rgba(18, 59, 80, 0.16)',
        'glass-card': '0 4px 24px -2px rgba(23, 54, 93, 0.06), 0 2px 6px -1px rgba(25, 181, 165, 0.08)',
        'ocean-glow': '0 8px 30px -4px rgba(25, 181, 165, 0.35)',
        'cyan-glow': '0 8px 30px -4px rgba(72, 191, 227, 0.35)',
        'deep-glow': '0 10px 30px -4px rgba(23, 54, 93, 0.40)',
      },
      backdropBlur: {
        'xs': '2px',
        '2xl': '24px',
        '3xl': '40px',
      }
    },
  },
  plugins: [],
}
