/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        factory: {
          obsidian: '#101010',      // Base canvas
          carbon: '#1d1a18',        // Raised dark surfaces
          ash: '#3d3a39',           // Hairline borders, dividers
          graphite: '#4d4947',      // Mid-tone fills
          granite: '#8a8380',       // Muted secondary text
          stone: '#b8b3b0',         // Tertiary labels
          bone: '#eeeeee',          // Primary light surface & light card
          chalk: '#fafafa',         // High-emphasis light button fill
          signalOrange: '#ee6018',  // Accent: live status, alerts
          metricGreen: '#a0ca92',   // Accent: positive metrics, trends
        },
        // Compatibilidad semántica con Factory
        edunova: {
          canvas: '#101010',
          surface: '#1d1a18',
          border: '#3d3a39',
          textPrimary: '#eeeeee',
          textSecondary: '#8a8380',
          accent: '#ee6018',
          success: '#a0ca92',
          card: '#eeeeee',
          cardText: '#101010'
        }
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        'sm': '3px',
        'md': '6px',
        'lg': '10px',
        '2xl': '20px',
        'nav': '3px',
        'cards': '10px',
        'buttons': '3px',
        'largePanels': '20px'
      },
      letterSpacing: {
        'display': '-0.04em',
        'heading': '-0.025em',
        'caption': '-0.02em',
      }
    },
  },
  plugins: [],
}
