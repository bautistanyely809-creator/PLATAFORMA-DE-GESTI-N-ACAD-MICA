/**
 * Servicio de Monitoreo de Usuarios Reales (RUM) & Métricas Web Vitals
 * Registra tiempos de carga, latencia TTFB y detecta conexiones lentas (2G/3G).
 */

export const PerformanceMonitor = {
  // Inicializar observador de rendimiento
  init() {
    if (typeof window === 'undefined' || !window.performance) return;

    // Reportar tiempo de carga total
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const ttfb = perfData.responseStart - perfData.requestStart;

        console.info(`⚡ [EDUNOVA Perf] Tiempo de Carga: ${pageLoadTime}ms | TTFB: ${ttfb}ms`);

        // Detectar si el usuario está en conexión lenta
        if (navigator.connection) {
          const { effectiveType, downlink, rtt } = navigator.connection;
          console.info(`📶 [EDUNOVA Red] Tipo: ${effectiveType} | Velocidad: ${downlink} Mbps | Latencia RTT: ${rtt}ms`);
        }
      }, 0);
    });
  },

  // Medir duración de operaciones asíncronas
  async measureAsync(label, fn) {
    const start = performance.now();
    try {
      return await fn();
    } finally {
      const duration = performance.now() - start;
      if (duration > 500) {
        console.warn(`⏳ [EDUNOVA Alerta Lenta] "${label}" tardó ${duration.toFixed(2)}ms (>500ms)`);
      }
    }
  }
};

