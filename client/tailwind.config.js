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
          navy: '#102A43',      // Azul oscuro: Barra lateral y encabezados
          primary: '#2563EB',   // Azul principal: Botones y acciones principales
          teal: '#14B8A6',      // Turquesa: Indicadores, métricas y módulo IA
          light: '#F1F5F9',     // Gris claro: Fondo general
          dark: '#334155',      // Gris oscuro: Textos principales
          success: '#22C55E',   // Verde: Estados satisfactorios y asistencias
          warning: '#F59E0B',   // Naranja: Alertas y pendientes
          danger: '#EF4444',    // Rojo: Errores e inasistencias
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

