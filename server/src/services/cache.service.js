/**
 * Servicio de Caché para EDUNOVA (Redis / In-Memory Fallback)
 * Optimiza la respuesta de datos altamente consultados (estadísticas, programas, cursos).
 */

class CacheService {
  constructor() {
    this.memoryStore = new Map();
    this.defaultTTL = 60 * 1000; // 60 segundos por defecto
  }

  // Obtener dato de caché
  get(key) {
    const item = this.memoryStore.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.memoryStore.delete(key);
      return null;
    }
    return item.value;
  }

  // Guardar en caché con TTL
  set(key, value, ttlMs = this.defaultTTL) {
    this.memoryStore.set(key, {
      value,
      expiry: Date.now() + ttlMs
    });
  }

  // Invalidar caché por clave o prefijo
  invalidate(key) {
    this.memoryStore.delete(key);
  }

  // Middleware para rutas Express
  middleware(ttlMs = 30000) {
    return (req, res, next) => {
      // Solo cachear peticiones GET
      if (req.method !== 'GET') return next();

      const key = `cache:${req.originalUrl || req.url}`;
      const cachedResponse = this.get(key);

      if (cachedResponse) {
        res.setHeader('X-Cache-Status', 'HIT');
        return res.json(cachedResponse);
      }

      res.setHeader('X-Cache-Status', 'MISS');
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        this.set(key, body, ttlMs);
        return originalJson(body);
      };
      next();
    };
  }
}

module.exports = new CacheService();

