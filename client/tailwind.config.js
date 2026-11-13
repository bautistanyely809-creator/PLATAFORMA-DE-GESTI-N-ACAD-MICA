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
          // Paleta Oficial SaaS Rediseño
          midnight: '#0B1D33',      // Azul medianoche (Fondo Sidebar, encabezados oscuros)
          darkNavy: '#102A43',      // Azul oscuro secundario
          electric: '#3978F6',      // Azul eléctrico (Acciones primarias, degradados vivos)
          gold: '#DCA91F',          // Dorado principal (Insignias, acentos destacados)
          goldLight: '#F5C94A',     // Dorado claro (Degradados de botón, resplandores)
          teal: '#13BFA5',          // Turquesa (KPIs de éxito, métricas)
          violet: '#8767ED',        // Violeta IA (Módulo EDUNOVA AI, procesamiento inteligente)
          canvas: '#F3F5FA',        // Gris claro (Fondo general de la aplicación)
          surface: '#FFFFFF',       // Blanco puro (Tarjetas SaaS, modales)
          textPrimary: '#172B46',   // Texto principal (Alta legibilidad)
          textSecondary: '#718096', // Texto secundario (Subtítulos, placeholders)
          success: '#16A36A',       // Verde de éxito (Aprobado, presente)
          danger: '#EF4444',        // Rojo de error (Inasistencias, alertas)
          
          // Alias de retrocompatibilidad
          navy: '#0B1D33',
          'navy-dark': '#0B1D33',
          'navy-light': '#102A43',
          light: '#F3F5FA',
          card: '#FFFFFF',
          text: '#172B46',
          dark: '#172B46',
          muted: '#718096',
          border: '#E2E8F0',
          warning: '#DCA91F',
          emerald: '#16A36A',
          primary: '#3978F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'saas-sm': '0 1px 3px 0 rgba(11, 29, 51, 0.05), 0 1px 2px 0 rgba(11, 29, 51, 0.03)',
        'saas-card': '0 4px 20px -2px rgba(11, 29, 51, 0.06), 0 2px 6px -1px rgba(11, 29, 51, 0.04)',
        'saas-hover': '0 12px 30px -4px rgba(11, 29, 51, 0.12), 0 4px 12px -2px rgba(11, 29, 51, 0.06)',
        'gold-glow': '0 4px 20px 0 rgba(220, 169, 31, 0.35)',
        'electric-glow': '0 4px 20px 0 rgba(57, 120, 246, 0.35)',
        'ai-glow': '0 8px 32px 0 rgba(135, 103, 237, 0.30)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        slideUp: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        pulseSlow: 'pulseSlow 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
