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
          // Paleta Oficial Pastel Glassmorphism
          pinkPastel: '#F7B8DC',    // Rosa pastel principal
          pinkSoft: '#FCE4F2',      // Rosa suave
          lavender: '#C8B5F5',      // Lavanda
          lilac: '#A78BFA',         // Lila
          violet: '#8064D8',        // Violeta
          skyBlue: '#A5D8FA',       // Azul cielo
          skySoft: '#DCEBFA',       // Azul suave
          cloud: '#F8F5FC',         // Fondo nube
          textPrimary: '#392C52',   // Texto principal
          textSecondary: '#8A819C', // Texto secundario
          mint: '#8CE2C2',          // Verde menta de éxito
          yellowPastel: '#FFE49B',  // Amarillo pastel
          
          // Compatibilidad semántica
          surface: '#FFFFFF',
          canvas: '#F8F5FC',
          success: '#8CE2C2',
          danger: '#EF4444',
          warning: '#FFE49B',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(167, 139, 250, 0.12)',
        'glass-hover': '0 16px 40px -4px rgba(167, 139, 250, 0.22)',
        'glass-card': '0 4px 24px -2px rgba(128, 100, 216, 0.08), 0 2px 6px -1px rgba(247, 184, 220, 0.10)',
        'pastel-pink': '0 8px 24px -4px rgba(247, 184, 220, 0.45)',
        'pastel-violet': '0 8px 24px -4px rgba(128, 100, 216, 0.35)',
        'pastel-mint': '0 8px 24px -4px rgba(140, 226, 194, 0.40)',
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
